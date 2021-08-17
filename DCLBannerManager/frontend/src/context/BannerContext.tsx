// noinspection JSIgnoredPromiseFromCall

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
  createBanner: (
    _bannerHash: string,
    _description: string,
    _clickThru: string
  ) => Promise<void>;
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
    const initializeBanners = async () => {
      if (dclbillboardCtx.instance) {
        const _banners = [];
        for (let i = bannerCount; i >= 1; i--) {
          const banner = await dclbillboardCtx.instance.banners(i);
          _banners.push(banner);
        }
        setBanners(_banners);
      }
    };
    initializeBanners();
  }, [dclbillboardCtx.instance, bannerCount]);

  const createBanner = async (
    _bannerHash: string,
    _description: string,
    _clickThru: string
  ) => {
    if (dclbillboardCtx.instance) {
      try {
        const approveTx = await dclbillboardCtx.instance.createBanner(
          _bannerHash,
          _description,
          _clickThru
        );
        await approveTx.wait();
        setBannerCount(bannerCount + 1);
      } finally {
      }
    }
  };

  return (
    <BannerContext.Provider
      value={{ bannerCount, setBannerCount, banners, setBanners, createBanner }}
    >
      {props.children}
    </BannerContext.Provider>
  );
}

export { BannerProvider, BannerContext };
