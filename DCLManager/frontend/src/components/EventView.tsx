import React, { useContext } from "react";
import { DCLBillboardContext } from "../hardhat/SymfoniContext";
import { IBanner } from "../types";

function EventView() {
  const dclbillboardCtx = useContext(DCLBillboardContext);
  const instance = dclbillboardCtx.instance!;

  const eventFilter = instance.filters.FlightApproved("boogie1", null, null);
  const getFlights = async () => {
    const events = await instance.queryFilter(eventFilter);
    events.forEach(e => {
        const banner: IBanner = e.args![2];
        console.log(banner.hash);
      }
    );
  };

  getFlights();
  return (
    <div></div>
  );
}

export default EventView;

