import React, { useContext, useEffect, useState } from "react";
import { FlightContext } from "../context/FlightContext";
import { BannerContext } from "../context/BannerContext";
import { BillboardContext } from "../context/BillboardContext";
import { useForm } from "react-hook-form";
import { IFlight } from "../types";
import FlightApprove from "./FlightApprove";

type Inputs = {
  flightID: number;
  approved: boolean;
};

function AdminManager() {
  const flightContext = useContext(FlightContext);
  const bannerContext = useContext(BannerContext);
  const billboardContext = useContext(BillboardContext);
  const { register } = useForm<Inputs>();
  const billboards = billboardContext.billboards!;
  const banners = bannerContext.banners!;
  const flights = flightContext.flights!;
  const flightCount = flightContext.flightCount;
  const approveFlight = flightContext.approveFlight!;
  const [selectedFlight, setSelectedFlight] = useState<IFlight>();

  useEffect(() => {
    setSelectedFlight(flights[0]);
  }, [flights, flightCount]);

  function onFlightChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const _flight = flights.find((obj) => {
      return obj!.id!.toString() === e.target.value;
    });
    setSelectedFlight(_flight);
  }

  return (
    <div className="content mr-auto ml-auto">
      <h2>Admin Flights</h2>
      <form className="approvalForm">
        <div className="form-group mr-sm-2">
          <br />
          <select
            className="form-control"
            {...register("flightID", { required: true })}
            onChange={(e) => onFlightChange(e)}
            value={selectedFlight ? selectedFlight!.id!.toNumber() : 0}
          >
            {flights.map((flight) => (
              <option
                value={flight!.id!.toNumber()}
                key={flight!.id!.toNumber()}
              >
                {flight.description}
              </option>
            ))}
          </select>
          <br />
          <FlightApprove
            flight={selectedFlight}
            banners={banners}
            billboards={billboards}
            approveFlight={approveFlight}
          />
        </div>
      </form>
    </div>
  );
}

export default AdminManager;
