import { BigNumber } from "ethers";
import React, { useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { DCLBillboardContext } from "../hardhat/SymfoniContext";

type Inputs = {
  billboardDescription: string;
  billboardParcel: string;
  billboardRealm: string;
  billboardRate: number
};

function BillboardManager() {
  const dclbillboardCtx = useContext(DCLBillboardContext);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const saveBillboard = async (data : Inputs) => {
    if (dclbillboardCtx.instance) {
        const rate = BigNumber.from(data.billboardRate)
        console.log("Submitting to the contract: ",data.billboardDescription);
        const saveTx = await dclbillboardCtx.instance.createBillboard(
          data.billboardDescription,
          data.billboardParcel,
          data.billboardRealm,
          rate
        );
        await saveTx.wait();
      }
  }

  const onSubmit: SubmitHandler<Inputs> = saveBillboard;

  
  
  return (
    <div className="content mr-auto ml-auto">
      <h2>Create a Billboard</h2>
      <form className="bannerForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group mr-sm-2">
          <br></br>
          <input required
            placeholder="Billboard description..."
            {...register("billboardDescription",  { required: true })}
            className="form-control"
          />
          <br></br>
          <input required
            placeholder="59, -32"
            {...register("billboardParcel",  { required: true })}
            className="form-control"
          />
          <br></br>
          <input required
            placeholder="Genesis Plaza"
            {...register("billboardRealm",  { required: true })}
            className="form-control"
          />
          <br></br>
          <input required
            placeholder="Rate in Wei / Week"
            {...register("billboardRate", { required: true, pattern: /^\d+$"/i})}
            className="form-control"
          />
          {errors.billboardRate && <span className="text-danger">This should be a number</span>}
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">
          Save
        </button>
      </form>
    </div>
  );
}

export default BillboardManager;
