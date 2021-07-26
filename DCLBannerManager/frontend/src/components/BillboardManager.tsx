import React, { useContext, useState } from "react";
import { DCLBillboardContext } from "../hardhat/SymfoniContext";
import { useForm } from "react-hook-form";

function BillboardManager() {
  const dclbillboardCtx = useContext(DCLBillboardContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);

  const [description, setDescription] = useState("");
  const [parcel, setParcel] = useState("");
  const [realm, setRealm] = useState("");
  const [rate, setRate] = useState(0.0);

  return (
    <div className="content mr-auto ml-auto">
      <h2>Create a Billboard</h2>
      <form className="bannerForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group mr-sm-2">
          <br></br>
          <input defaultValue="test" {...register("example")} />;
          <input
            id="bannerDescription"
            type="text"
            className="form-control"
            placeholder="Banner description..."
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <br></br>
          <input
            id="bannerParcel"
            type="text"
            className="form-control"
            placeholder="59, -32"
            required
            value={parcel}
            onChange={(e) => setParcel(e.target.value)}
          />
          <br></br>
          <input
            id="bannerRealm"
            type="text"
            className="form-control"
            placeholder="Genesis Plaza"
            required
            value={realm}
            onChange={(e) => setRealm(e.target.value)}
          />
          <br></br>
          <input
            id="bannerRate"
            type="text"
            className="form-control"
            placeholder="Rate in Wei / Week"
            required
            value={rate ? rate : ""}
            onChange={(e) => setRate(parseFloat(e.target.value))}
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
