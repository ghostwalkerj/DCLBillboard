import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { DCLBillboardContext } from "../hardhat/SymfoniContext";
import { IBanner } from "../types";

type ContextProps = {
  bannerCount: number;
  setBannerCount: Dispatch<SetStateAction<number>>;
  banners: IBanner[];
  setBanners: Dispatch<SetStateAction<IBanner[]>>;
};

const BannerContext = React.createContext<Partial<ContextProps>>({});

function BannerProvider(props: { children: JSX.Element }) {
  const dclbillboardCtx = useContext(DCLBillboardContext);
  const [bannerCount, setBannerCount] = useState(0);
  const [banners, setBanners] = useState<IBanner[]>([]);

  useEffect(() => {
    const initalizeCount = async () => {
      let _bannerCount = 0;
      try {
        if (dclbillboardCtx.instance) {
          _bannerCount = (
            await dclbillboardCtx.instance.bannerCount()
          ).toNumber();
        }
      } catch (e) {
      } finally {
        setBannerCount(_bannerCount);
      }
    };
    initalizeCount();
  }, [dclbillboardCtx.instance]);

  useEffect(() => {
    const initializeBillboards = async () => {
      if (dclbillboardCtx.instance) {
        const _banners = [];
        for (let i = bannerCount; i >= 1; i--) {
          const banner = await dclbillboardCtx.instance.banners(i);
          _banners.push(banner);
        }
        setBanners(_banners);
      }
    };
    initializeBillboards();
  }, [dclbillboardCtx.instance, bannerCount]);

  return (
    <BannerContext.Provider
      value={{ bannerCount, setBannerCount, banners, setBanners }}
    >
      {props.children}
    </BannerContext.Provider>
  );
}

export { BannerProvider, BannerContext };
