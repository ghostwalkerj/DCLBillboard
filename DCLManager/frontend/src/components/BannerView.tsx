import React from "react";
import { IBanner } from "../types";
import { Jazzicon } from "@ukstv/jazzicon-react";

type BannerProps = {
  banner: IBanner | undefined;
};

const IPFS_HOST = process.env.REACT_APP_IPFS_HOST;
const IPFS_PORT = process.env.REACT_APP_IPFS_PORT;

function BannerView(props: BannerProps) {
  const banner = props.banner;
  if (banner) {
    return (
      <div className="card mb-4" key={banner!.id!.toNumber()}>
        <div className="card-header">
          <div
            className="d-inline-block align-top"
            style={{ width: "30px", height: "30px" }}
          >
            <Jazzicon address={banner.owner} className="mr-2"/>
          </div>
          <small className="text-muted">{banner.owner}</small>
        </div>
        <ul id="bannerList" className="list-group list-group-flush">
          <li className="list-group-item">
            <p className="text-center">
              <img
                src={`https://${IPFS_HOST}:${IPFS_PORT}/ipfs/${banner.hash}`}
                style={{ maxWidth: "420px" }}
                alt={"Banner"}
              />
            </p>
            <p>{banner.description}</p>
          </li>
        </ul>
      </div>
    );
  }
  return <div/>;
}

export default BannerView;
