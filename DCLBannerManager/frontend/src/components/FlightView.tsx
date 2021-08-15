import React from "react";
import { IBanner, IBillboard, IFlight } from "../types";
import BillboardView from "./BillboardView";
import BannerView from "./BannerView";
import * as dateMath from "date-arithmetic";

type FlightProps = {
  flight: IFlight | undefined;
  banners: [IBanner] | undefined;
  billboards: [IBillboard] | undefined;
};

function FlightView(props: FlightProps) {
  const { flight, banners, billboards } = props;

  if (flight && banners && billboards) {
    const startDate = new Date(flight.startDate.toNumber());
    const endDate = new Date(flight.endDate.toNumber());
    const numberOfDays = dateMath.diff(startDate, endDate, "day", false) + 1;
    return (
      <div className="card mb-4" key={flight.id.toNumber()}>
        <div className="card-header">{flight.description}</div>
        <div className="card-body ml-0 pl-0">
          <ul id="flightList" className="list-group list-group-flush">
            <li className="list-group-item">{flight.description}</li>
            <li className="list-group-item">
              <BillboardView
                billboard={billboards[flight.billboardId.toNumber()]}
              />
            </li>
            <li className="list-group-item">
              <BannerView banner={banners[flight.bannerId.toNumber()]} />
            </li>
            <li>
              <ul
                id="summaryList"
                className="list-group list-group-flush box p-0 m-0"
              >
                <li className="list-group-item">
                  Rate: {flight.rate} Wei / Day
                </li>
                <li className="list-group-item">
                  {startDate} / {endDate} Run Time: {numberOfDays} days
                </li>
                <li className="list-group-item">Total Cost: {flight.total}</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  return <div />;
}

export default FlightView;
