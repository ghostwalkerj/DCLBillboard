import React, { useContext, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DCLBillboardContext } from "../hardhat/SymfoniContext";
import { DateRange, RangeWithKey } from "react-date-range";
import { IBanner, IBillboard } from "../types";

type Inputs = {
  flightDescription: string;
  dateInput: any;
  billboardId: number;
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
    key: "selection",
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
        for (let i = billboardCount; i >= 1; i--) {
          const billboard = await dclbillboardCtx.instance.billboards(i);
          _billBoards.push(billboard);
        }
        setBillboards(_billBoards);
      }
    };
    initializeBillboards();
  }, [dclbillboardCtx.instance, billboardCount]);

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
          <select
            placeholder={"Select a Billboard"}
            className="form-control"
            {...register("billboardId")}
          >
            {billboards.map((billboard) => (
              <option
                value={billboard.id.toNumber()}
                key={billboard.id.toNumber()}
              >
                {billboard.description}
              </option>
            ))}
          </select>
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
