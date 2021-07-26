import React from "react";
import { BigNumber } from "ethers";
import { Tabs, Tab } from "react-bootstrap";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import BannerManager from "./BannerManager";
import BillboardManager from "./BillboardManager";

interface IBanner {
  id: BigNumber;
  hash: string;
  description: string;
  clickThru: string;
  owner: string;
}

function Main() {
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 ml-auto mr-auto"
          style={{ maxWidth: "500px" }}
        >
          <Tabs defaultActiveKey="banner" className="mb-3 pt-4">
            <Tab eventKey="banner" title="Banner Manager">
              <BannerManager />
            </Tab>
            <Tab eventKey="billboard" title="Billboard Manager">
              <BillboardManager />
            </Tab>
            <Tab eventKey="admin" title="Admin"></Tab>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

export default Main;
