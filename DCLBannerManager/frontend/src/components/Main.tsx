import React, { useContext } from "react";
import { Tab, Tabs } from "react-bootstrap";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import BannerManager from "./BannerManager";
import BillboardManager from "./BillboardManager";
import FlightManager from "./FlightManager";
import { BillboardProvider } from "../context/BillboardContext";
import { BannerProvider } from "../context/BannerContext";
import { FlightProvider } from "../context/FlightContext";
import { Role, RoleContext } from "../context/RoleContext";
import AdminManager from "./AdminManager";

function Main() {
  const roleContext = useContext(RoleContext);

  const isAdmin: boolean = roleContext.roles?.includes(Role.Admin)
    ? true
    : false;

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main
          role="main"
          className="col-lg-12 ml-auto mr-auto"
          style={{ maxWidth: "600px" }}
        >
          <BillboardProvider>
            <BannerProvider>
              <FlightProvider>
                <Tabs defaultActiveKey="banner" className="mb-3 pt-4">
                  <Tab eventKey="banner" title="Banner Manager">
                    <BannerManager />
                  </Tab>
                  <Tab eventKey="billboard" title="Billboard Manager">
                    <BillboardManager />
                  </Tab>
                  <Tab eventKey="flight" title="Flight Manager">
                    <FlightManager />
                  </Tab>
                  {isAdmin && (
                    <Tab eventKey="admin" title="Admin">
                      <AdminManager />
                    </Tab>
                  )}
                </Tabs>
              </FlightProvider>
            </BannerProvider>
          </BillboardProvider>
        </main>
      </div>
    </div>
  );
}

export default Main;
