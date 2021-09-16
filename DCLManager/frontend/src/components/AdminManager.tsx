// noinspection JSIgnoredPromiseFromCall

import React, { useContext, useEffect, useState } from "react";
import { FlightContext } from "../context/FlightContext";
import { BannerContext } from "../context/BannerContext";
import { BillboardContext } from "../context/BillboardContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { IFlight } from "../types";
import FlightApprove from "./FlightApprove";
import { DCLBillboardContext } from "../hardhat/SymfoniContext";
import { formatEther } from "ethers/lib/utils";
import EventView from "./EventView";

type Inputs = {
  flightID: number;
  approved: boolean;
  withdrawAmount: number;
  withdrawalAddress: string;
};

function AdminManager() {
  const dclbillboardCtx = useContext(DCLBillboardContext);
  const flightContext = useContext(FlightContext);
  const bannerContext = useContext(BannerContext);
  const billboardContext = useContext(BillboardContext);
  const billboards = billboardContext.billboards!;
  const banners = bannerContext.banners!;
  const flights = flightContext.flights!;
  const flightCount = flightContext.flightCount;
  const approveFlight = flightContext.approveFlight!;
  const [selectedFlight, setSelectedFlight] = useState<IFlight>();
  const [contractBalance, setContractBalance] = useState("0");

  useEffect(() => {
    setSelectedFlight(flights[0]);
  }, [flights, flightCount]);

  useEffect(() => {
    const initializeBalance = async () => {
      let _balance = "0";
      try {
        if (dclbillboardCtx.instance) {
          const _bigBalance = await dclbillboardCtx.instance.getBalance();
          _balance = formatEther(_bigBalance);
        }
      } catch (e) {
        console.log("Error in getBalance: ", e.toString());
      } finally {
        setContractBalance(_balance);
      }
    };
    initializeBalance();
  }, [dclbillboardCtx.instance, flightCount]);

  function onFlightChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const _flight = flights.find((obj) => {
      return obj!.id!.toString() === e.target.value;
    });
    setSelectedFlight(_flight);
  }

  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async () => {
    await dclbillboardCtx.instance?.withdrawFunds();
    setContractBalance("0");
  };

  return (
    <div className="content mr-auto ml-auto">
      <h2>Admin Funds</h2>
      Contract Current Balance: {contractBalance} Eth
      <form className="withdrawForm" onSubmit={handleSubmit(onSubmit)}>
        <br/>

        <button type="submit" className="btn btn-primary btn-block btn-lg">
          Withdraw
        </button>
      </form>
      <br/>
      <h2>Admin Flights</h2>
      <form className="approvalForm">
        <div className="form-group mr-sm-2">
          <br/>
          <select
            className="form-control"
            {...register("flightID")}
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
          <br/>
          <FlightApprove
            flight={selectedFlight}
            banners={banners}
            billboards={billboards}
            approveFlight={approveFlight}
          />
          <br/>
          <EventView/>

        </div>
      </form>
    </div>
  );
}

export default AdminManager;
