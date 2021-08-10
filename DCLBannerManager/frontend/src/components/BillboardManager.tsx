import { Jazzicon } from "@ukstv/jazzicon-react";
import { BigNumber } from "ethers";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { DCLBillboardContext } from "../hardhat/SymfoniContext";

type IBillboard = {
  id: BigNumber;
  description: string;
  parcel: string;
  realm: string;
  rate: BigNumber;
  owner: string;
};

type Inputs = {
  billboardDescription: string;
  billboardParcel: string;
  billboardRealm: string;
  billboardRate: number;
};

function BillboardManager() {
  const dclbillboardCtx = useContext(DCLBillboardContext);
  const [billboardCount, setBillboardCount] = useState(0);
  const [billboards, setBillboards] = useState<IBillboard[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  useEffect(() => {
    const initalizeCount = async () => {
      let _billboardCount = 0;
      try {
        if (dclbillboardCtx.instance) {
          _billboardCount = (
            await dclbillboardCtx.instance.billboardCount()
          ).toNumber();
        }
      } catch (e) {
      } finally {
        setBillboardCount(_billboardCount);
      }
    };
    initalizeCount();
  }, [dclbillboardCtx.instance]);

  useEffect(() => {
    const initializeBillboards = async () => {
      if (dclbillboardCtx.instance) {
        const _billBoards = [];
        for (var i = billboardCount; i >= 1; i--) {
          const billboard = await dclbillboardCtx.instance.billboards(i);
          _billBoards.push(billboard);
        }
        setBillboards(_billBoards);
      }
    };
    initializeBillboards();
  }, [dclbillboardCtx.instance, billboardCount]);

  const saveBillboard = async (data: Inputs) => {
    if (dclbillboardCtx.instance) {
      const rate = BigNumber.from(data.billboardRate);
      console.log("Submitting to the contract: ", data.billboardDescription);
      const saveTx = await dclbillboardCtx.instance.createBillboard(
        data.billboardDescription,
        data.billboardParcel,
        data.billboardRealm,
        rate
      );
      await saveTx.wait();
      setBillboardCount(billboardCount + 1);
      reset();
    }
  };

  const onSubmit: SubmitHandler<Inputs> = saveBillboard;

  return (
    <div className="content mr-auto ml-auto">
      <h2>Create a Billboard</h2>
      <form className="bannerForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group mr-sm-2">
          <br></br>
          <input required
            placeholder="Billboard description..."
            {...register("billboardDescription", { required: true })}
            className="form-control"
          />
          <br></br>
          <input required
            placeholder="59, -32"
            {...register("billboardParcel", { required: true })}
            className="form-control"
          />
          <br></br>
          <input required
            placeholder="Genesis Plaza"
            {...register("billboardRealm", { required: true })}
            className="form-control"
          />
          <br></br>
          <input required
            type="number"
            placeholder={'Rate in Wei / Week'}
            {...register("billboardRate", { required: true })}
            className="form-control"
          />
          {errors.billboardRate && <span className="text-danger">This should be a number</span>}
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">
          Save
        </button>
      </form>
      <p>&nbsp;</p>

      <p>&nbsp;</p>
      {billboards.map((billboard, key) => {
        return (
          <div className="card mb-4" key={key}>
            <div className="card-header">
              <div
                className="d-inline-block align-top"
                style={{ width: "30px", height: "30px" }}
              >
                <Jazzicon address={billboard.owner} className="mr-2" />
              </div>
              <small className="text-muted">{billboard.owner}</small>
            </div>
            <ul id="billboardList" className="list-group list-group-flush">
              <li className="list-group-item">
                {billboard.description}
              </li>
              <li className="list-group-item">
                Parcel: {billboard.parcel}<br />
                Realm: {billboard.realm}<br />
                Rate: {billboard.rate.toString()} / Wei per Week
              </li>
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default BillboardManager;
