import React, { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BillboardContext } from "../context/BillboardContext";
import BillboardView from "./BillboardView";
import { BigNumber } from "ethers";

type Inputs = {
  billboardDescription: string;
  billboardParcel: string;
  billboardRealm: string;
  billboardRate: BigNumber;
};

function BillboardManager() {
  const billboardContext = useContext(BillboardContext);
  const [createBillboard] = [billboardContext.createBillboard!];
  const [billboards] = [billboardContext.billboards!];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    if (billboardContext) {
      await createBillboard(
        data.billboardDescription,
        data.billboardParcel,
        data.billboardRealm,
        data.billboardRate
      );
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
            placeholder={"Rate in Finney (1000 = 1 Eth) / Day"}
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
          <BillboardView
            billboard={billboard}
            key={billboard!.id!.toNumber()}
          />
        );
      })}
    </div>
  );
}

export default BillboardManager;
