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