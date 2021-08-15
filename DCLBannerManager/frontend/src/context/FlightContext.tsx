import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
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
};

const FlightContext = React.createContext<Partial<Props>>({});

function FlightProvider(props: { children: JSX.Element }): ReactElement {
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

  useEffect(() => {
    const initializeBillboards = async () => {
      if (dclbillboardCtx.instance) {
        const _flights = [];
        for (let i = flightCount; i >= 1; i--) {
          const banner = await dclbillboardCtx.instance.flights(i);
          _flights.push(banner);
        }
        setFlights(_flights);
      }
    };
    initializeBillboards();
  }, [dclbillboardCtx.instance, flightCount]);

  return (
    <FlightContext.Provider
      value={{ flightCount, setFlightCount, flights, setFlights }}
    >
      {props.children}
    </FlightContext.Provider>
  );
}

export { FlightContext, FlightProvider };
