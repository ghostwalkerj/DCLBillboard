import { BigNumber } from "ethers";
import React, { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { DCLBillboardContext } from "../hardhat/SymfoniContext";
import { BillboardContext } from "../context/BillboardContext";
import BillboardView from "./BillboardView";

type Inputs = {
  billboardDescription: string;
  billboardParcel: string;
  billboardRealm: string;
  billboardRate: number;
};

function BillboardManager() {
  const dclbillboardCtx = useContext(DCLBillboardContext);
  const billboardContext = useContext(BillboardContext);
  const [billboardCount, setBillboardCount] = [
    billboardContext.billboardCount!,
    billboardContext.setBillboardCount!,
  ];
  const [billboards] = [billboardContext.billboards!];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
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

  return (
    <div className="content mr-auto ml-auto">
      <h2>Create a Billboard</h2>
      <form className="bannerForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group mr-sm-2">
          <br />
          <input
            required
            placeholder="Billboard description..."
            {...register("billboardDescription", { required: true })}
            className="form-control"
          />
          <br />
          <input
            required
            placeholder="59, -32"
            {...register("billboardParcel", { required: true })}
            className="form-control"
          />
          <br />
          <input
            required
            placeholder="Genesis Plaza"
            {...register("billboardRealm", { required: true })}
            className="form-control"
          />
          <br />
          <input
            required
            type="number"
            placeholder={"Rate in Wei / Day"}
            {...register("billboardRate", { required: true })}
            className="form-control"
          />
          {errors.billboardRate && (
            <span className="text-danger">This should be a number</span>
          )}
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">
          Save
        </button>
      </form>
      <p>&nbsp;</p>
      {billboards.map((billboard) => {
        return (
          <BillboardView billboard={billboard} key={billboard.id.toNumber()} />
        );
      })}
    </div>
  );
}

export default BillboardManager;
