import React, { useContext, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DCLBillboardContext } from "../hardhat/SymfoniContext";
import { DateRange, RangeWithKey } from "react-date-range";
import { IBanner, IBillboard } from "../types";

type Inputs = {
  flightDescription: string;
  dateInput: any;
};

function FlightManager() {
  const dclbillboardCtx = useContext(DCLBillboardContext);
  const [dateState, setDateState] = useState<RangeWithKey>({
    startDate: new Date(),
    endDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 6
    ),
    key: "selection"
  });
  const [billboards, setBillboards] = useState<IBillboard[]>([]);
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [bannerCount, setBannerCount] = useState(0);
  const [billboardCount, setBillboardCount] = useState(0);

  const { register, handleSubmit, control, reset } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    if (dclbillboardCtx.instance) {
      console.log("Submitting to the contract: ", data.flightDescription);
      // const saveTx = await dclbillboardCtx.instance.createFlight(
      //  data.flightDescription);
      // await saveTx.wait();
      reset();
    }
  };

  return (
    <div className="content mr-auto ml-auto">
      <h2>Schedule a Flight</h2>
      <form className="flightForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group mr-sm-2">
          <br />
          <input
            required
            placeholder="Description"
            {...register("flightDescription", { required: true })}
            className="form-control"
          />
          <br />

          <br />
          <Controller
            control={control}
            name="dateInput"

            render={({ field }) => (
              <DateRange
                editableDateInputs={true}
                onChange={(item) => {
                  if ("selection" in item) {
                    setDateState(item.selection);
                    field.onChange(item.selection);
                  }
                }}
                moveRangeOnFirstSelection={true}
                ranges={[dateState]}
                minDate={new Date()}
                focusedRange={[0, 6]}
              />
            )}
          />

          <button type="submit" className="btn btn-primary btn-block btn-lg">
            Schedule
          </button>
        </div>
      </form>
    </div>
  );
}

export default FlightManager;
