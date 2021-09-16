import React from "react";
import { IBillboard } from "../types";
import { Jazzicon } from "@ukstv/jazzicon-react";

type BillboardProps = {
  billboard: IBillboard | undefined;
};

function BillboardView(props: BillboardProps) {
  const billboard = props.billboard;
  if (billboard) {
    return (
      <div className="card mb-4" key={billboard!.id!.toNumber()}>
        <div className="card-header">
          <div
            className="d-inline-block align-top"
            style={{ width: "30px", height: "30px" }}
          >
            <Jazzicon address={billboard.owner} className="mr-2"/>
          </div>

          <small className="text-muted">{billboard.owner}</small>
        </div>
        <ul id="billboardList" className="list-group list-group-flush">

          <li className="list-group-item">Id: {billboard!.id!.toString()}</li>
          <li className="list-group-item">
            TargetId: {billboard.targetId}
            <br/>
            {billboard.description}
            <br/>
            Parcel: {billboard.parcel}
            <br/>
            Realm: {billboard.realm}
            <br/>
            Rate: {billboard.rate.toString()} Finney / Day
          </li>
        </ul>
      </div>
    )
      ;
  }
  return <div/>;
}

export default BillboardView;
