// noinspection JSIgnoredPromiseFromCall

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { IFlight } from "../types";
import { DCLBillboardContext } from "../hardhat/SymfoniContext";

type Props = {
  flightCount: number;
  setFlightCount: Dispatch<SetStateAction<number>>;
  flights: IFlight[];
  setFlights: Dispatch<SetStateAction<IFlight[]>>;
  approveFlight: (flight: IFlight, approved: boolean) => Promise<void>;
  createFlight: (
    _description: string,
    _bannerId: number,
    _billboardId: number,
    _rate: number,
    _startDate: number,
    _endDate: number,
    _total: number
  ) => Promise<void>;
};

const FlightContext = React.createContext<Partial<Props>>({});

function FlightProvider(props: { children: JSX.Element }) {
  const dclbillboardCtx = useContext(DCLBillboardContext);
  const [flightCount, setFlightCount] = useState(0);
  const [flights, setFlights] = useState<IFlight[]>([]);

  useEffect(() => {
    const initalizeCount = async () => {
      let _flightCount = 0;
      try {
        if (dclbillboardCtx.instance) {
          _flightCount = (
            await dclbillboardCtx.instance.flightCount()
          ).toNumber();
        }
      } catch (e) {
      } finally {
        setFlightCount(_flightCount);
      }
    };
    initalizeCount();
  }, [dclbillboardCtx.instance]);

  const getFlights = useCallback(async () => {
    if (dclbillboardCtx.instance) {
      const _flights = [];
      for (let i = flightCount; i >= 1; i--) {
        const _flight = await dclbillboardCtx.instance.flights(i);
        _flights.push(_flight);
      }
      setFlights(_flights);
    }
  }, [dclbillboardCtx.instance, flightCount]);

  useEffect(() => {
    const initializeFlights = async () => {
      if (dclbillboardCtx.instance) {
        await getFlights();
      }
    };
    initializeFlights();
  }, [dclbillboardCtx.instance, flightCount, getFlights]);

  const approveFlight = async (flight: IFlight, approved: boolean) => {
    if (dclbillboardCtx.instance && flight) {
      try {
        const approveTx = await dclbillboardCtx.instance.approveFlight(
          flight.id!,
          approved
        );
        await approveTx.wait();
      } finally {
        await getFlights();
      }
    }
  };

  const createFlight = async (
    _description: string,
    _bannerId: number,
    _billboardId: number,
    _rate: number,
    _startDate: number,
    _endDate: number,
    _total: number
  ) => {
    if (dclbillboardCtx.instance) {
      try {
        const approveTx = await dclbillboardCtx.instance.createFlight(
          _description,
          _bannerId,
          _billboardId,
          _rate,
          _startDate,
          _endDate,
          _total
        );
        await approveTx.wait();
        setFlightCount(flightCount + 1);
      } finally {
      }
    }
  };

  return (
    <FlightContext.Provider
      value={{
        flightCount,
        setFlightCount,
        flights,
        setFlights,
        approveFlight,
        createFlight,
      }}
    >
      {props.children}
    </FlightContext.Provider>
  );
}

export { FlightContext, FlightProvider };
