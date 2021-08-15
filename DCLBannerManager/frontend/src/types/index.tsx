import { BigNumber } from "ethers";

export type IBillboard = {
  id: BigNumber;
  description: string;
  parcel: string;
  realm: string;
  rate: BigNumber;
  owner: string;
};

export type IBanner = {
  id: BigNumber;
  hash: string;
  description: string;
  clickThru: string;
  owner: string;
};

export type IFlight = {
  id: BigNumber;
  description: string;
  bannerId: BigNumber;
  billboardId: BigNumber;
  rate: BigNumber;
  startDate: BigNumber;
  endDate: BigNumber;
  total: BigNumber;
};
