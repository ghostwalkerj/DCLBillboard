import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  bannerDescription: string;
  bannerParcel: string;
  bannerRealm: string;
  bannerRate: number
};

function BillboardManager() {
  //const dclbillboardCtx = useContext(DCLBillboardContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  
  return (
    <div className="content mr-auto ml-auto">
      <h2>Create a Billboard</h2>
      <form className="bannerForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group mr-sm-2">
          <br></br>
          <input required
            placeholder="Banner description..."
            {...register("bannerDescription",  { required: true })}
            className="form-control"
          />
          <br></br>
          <input required
            placeholder="59, -32"
            {...register("bannerParcel",  { required: true })}
            className="form-control"
          />
          <br></br>
          <input required
            placeholder="Genesis Plaza"
            {...register("bannerRealm",  { required: true })}
            className="form-control"
          />
          <br></br>
          <input required
            placeholder="Rate in Wei / Week"
            {...register("bannerRate", { required: true })}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">
          Save
        </button>
      </form>
    </div>
  );
}

export default BillboardManager;
