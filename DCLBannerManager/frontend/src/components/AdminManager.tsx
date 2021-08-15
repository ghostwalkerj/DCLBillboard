import React, { useContext, useEffect, useState } from "react";
import { DCLBillboardContext } from "../hardhat/SymfoniContext";
import { FlightContext } from "../context/FlightContext";
import { BannerContext } from "../context/BannerContext";
import { BillboardContext } from "../context/BillboardContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { IFlight } from "../types";
import FlightView from "./FlightView";

type Inputs = {
  flightID: number;
  approved: boolean;
};

function AdminManager() {
  const dclbillboardCtx = useContext(DCLBillboardContext);
  const flightContext = useContext(FlightContext);
  const bannerContext = useContext(BannerContext);
  const billboardContext = useContext(BillboardContext);
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const billboards = billboardContext.billboards!;
  const banners = bannerContext.banners!;
  const flights = flightContext.flights!;
  const [selectedFlight, setSelectedFlight] = useState<IFlight>();

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    if (dclbillboardCtx.instance) {
      console.log("Submitting Flight Approval to the contract: ");

      const saveTx = await dclbillboardCtx.instance.approveFlight(
        data.flightID,
        data.approved
      );

      await saveTx.wait();

      reset();
    }
  };

  useEffect(() => {
    setSelectedFlight(flights[0]);
  }, [flights]);

  function onFlightChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const _flight = flights.find((obj) => {
      return obj.id.toString() === e.target.value;
    });
    setSelectedFlight(_flight);
  }

  return (
    <div className="content mr-auto ml-auto">
      <h2>Admin Flights</h2>
      <form className="approvalForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group mr-sm-2">
          <br/>
          <select
            className="form-control"
            {...register("flightID", { required: true })}
            onChange={(e) => onFlightChange(e)}
            value={selectedFlight ? selectedFlight.id.toNumber() : 0}
          >
            {flights.map((flight) => (
              <option value={flight.id.toNumber()} key={flight.id.toNumber()}>
                {flight.description}
              </option>
            ))}
          </select>
          <br/>
          <FlightView
            flight={selectedFlight}
            setSelectedFlight={setSelectedFlight}
            banners={banners}
            billboards={billboards}
          />
        </div>
      </form>
    </div>
  );
}

export default AdminManager;
