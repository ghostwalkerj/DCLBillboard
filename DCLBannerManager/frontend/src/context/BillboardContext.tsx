import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { DCLBillboardContext } from "../hardhat/SymfoniContext";
import { IBillboard } from "../types";

type ContextProps = {
  billboardCount: number;
  setBillboardCount: Dispatch<SetStateAction<number>>;
  billboards: IBillboard[];
  setBillboards: Dispatch<SetStateAction<IBillboard[]>>;
};

const BillboardContext = React.createContext<Partial<ContextProps>>({});

function BillboardProvider(props: { children: JSX.Element }) {
  const dclbillboardCtx = useContext(DCLBillboardContext);
  const [billboardCount, setBillboardCount] = useState(0);
  const [billboards, setBillboards] = useState<IBillboard[]>([]);

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
    <BillboardContext.Provider
      value={{ billboardCount, setBillboardCount, billboards, setBillboards }}
    >
      {props.children}
    </BillboardContext.Provider>
  );
}

export { BillboardProvider, BillboardContext };
