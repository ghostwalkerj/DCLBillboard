import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { IBanner, IBillboard, IFlight } from "../types";
import BillboardView from "./BillboardView";
import BannerView from "./BannerView";
import * as dateMath from "date-arithmetic";
import { BigNumber } from "ethers";
import { DCLBillboardContext } from "../hardhat/SymfoniContext";

type FlightProps = {
  flight: IFlight | undefined;
  setSelectedFlight: Dispatch<SetStateAction<IFlight | undefined>>;
  banners: IBanner[] | undefined;
  billboards: IBillboard[] | undefined;
};

function FlightView(props: FlightProps) {
  const { flight, setSelectedFlight, banners, billboards } = props;
  const [approved, setApproved] = useState(
    flight !== undefined ? flight.approved : false
  );
  const dclbillboardCtx = useContext(DCLBillboardContext);

  useEffect(() => {
    setApproved(flight !== undefined ? flight.approved : false);
  }, [flight]);

  function getBanner(id: BigNumber) {
    const _banner = banners!.find((obj) => {
      return obj.id.eq(id);
    });
    return _banner!;
  }

  function getBillboard(id: BigNumber) {
    const _billboard = billboards!.find((obj) => {
      return obj.id.eq(id);
    });
    return _billboard!;
  }

  const handleChangeChk = async (e: ChangeEvent<HTMLInputElement>) => {
    const _checked = e.target.checked;
    if (dclbillboardCtx.instance && flight) {
      try {
        const approveTx = await dclbillboardCtx.instance.approveFlight(
          flight.id,
          _checked
        );
        const receipt = await approveTx.wait();
        if (receipt.status === 1) {
          setApproved(_checked);
        } else {
          setApproved(flight.approved);
        }
      } catch {
        setApproved(flight.approved);
      } finally {
        setSelectedFlight(flight);
      }
    } else {
      setApproved(!_checked);
    }
  };

  if (flight && banners && billboards) {
    const startDate = new Date(flight.startDate.toNumber());
    const endDate = new Date(flight.endDate.toNumber());
    const numberOfDays = dateMath.diff(startDate, endDate, "day", false) + 1;
    return (
      <div>
        <ul id="flightList" className="list-group list-group-flush">
          <li className="list-group-item">
            <div className="d-flex justify-content-between">
              <div>{flight.description}</div>
              <div className="d-flex justify-content-between">
                {approved ? (
                  <div className="mr-2 text-success">Approved:</div>
                ) : (
                  <div className="mr-2 text-danger">Not Approved:</div>
                )}
                <div>
                  <input
                    type="checkbox"
                    onChange={handleChangeChk}
                    checked={approved}
                  />
                </div>
              </div>
            </div>
          </li>
          <li className="list-group-item">
            Billboard:
            <br />
            <br />
            <BillboardView billboard={getBillboard(flight!.billboardId)} />
          </li>
          <li className="list-group-item">
            Banner:
            <br />
            <br />
            <BannerView banner={getBanner(flight!.bannerId)} />
          </li>
          <li>
            <div className="card mb-4" key={flight.id.toNumber()}>
              <div className="card-header">
                Schedule:
                <br />
                <br />
              </div>
              <ul id="billboardList" className="list-group list-group-flush">
                <li className="list-group-item small">
                  Rate: {flight.rate.toNumber()} Wei / Day <br />
                  Start Date:{startDate.toString()} <br />
                  End Date: {endDate.toString()} <br />
                  Run Time: {numberOfDays} days Total Cost:{" "}
                  {flight.total.toNumber()}
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    );
  }
  return <div />;
}

export default FlightView;
