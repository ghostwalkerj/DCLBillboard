import React, { useContext, useRef, useState } from "react";
import { DCLBillboardContext } from "../hardhat/SymfoniContext";
import { SubmitHandler, useForm } from "react-hook-form";

import "react-date-range/dist/styles.css"; // main style file
import { BannerContext } from "context/BannerContext";
import BannerView from "./BannerView";

//Declare IPFS
const ipfsClient = require("ipfs-http-client");
const IPFS_API_HOST = process.env.REACT_APP_IPFS_API_HOST;
const IPFS_API_PORT = process.env.REACT_APP_IPFS_API_PORT;
const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;
const INFURA_PROJECT_SECRET = process.env.REACT_APP_INFURA_PROJECT_SECRET;

// Infura Auth Header
const auth =
  "Basic " +
  Buffer.from(INFURA_PROJECT_ID + ":" + INFURA_PROJECT_SECRET).toString(
    "base64"
  );

type Inputs = {
  imageDescription: string;
};

function BannerManager() {
  const dclbillboardCtx = useContext(DCLBillboardContext);
  const bannerContext = useContext(BannerContext);
  const fileInput = useRef<HTMLInputElement>(null);
  const [bannerCount, setBannerCount] = [
    bannerContext.bannerCount!,
    bannerContext.setBannerCount!,
  ];
  const [banners] = [bannerContext.banners!];
  const [buffer, setBuffer] = useState<string | ArrayBuffer | null>();
  const { register, handleSubmit, reset } = useForm<Inputs>();

  const captureFile = (event: React.FormEvent) => {
    event.preventDefault();
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new window.FileReader();
    reader.onloadend = () => {
      setBuffer(Buffer.from(reader.result!));
    };
    reader.readAsArrayBuffer(file);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    console.log("Submitting file to ipfs...");
    const ipfs = await ipfsClient.create({
      host: IPFS_API_HOST,
      port: IPFS_API_PORT,
      protocol: "https",
      //, headers: {
      //  authorization: auth
      //}
    });
    // adding file to the IPFS
    let ipfsId = "";
    ipfs.add(buffer).then((response: any) => {
      ipfsId = response.path;
      updateContract(ipfsId);
    });

    const updateContract = async (hash: string) => {
      if (dclbillboardCtx.instance) {
        console.log(
          "Submitting to the contract: ",
          ipfsId,
          data.imageDescription
        );
        const uploadTx = await dclbillboardCtx.instance.createBanner(
          hash,
          data.imageDescription,
          ""
        );
        await uploadTx.wait();
        setBannerCount(bannerCount + 1);
        reset();
      }

      if (fileInput.current) {
        fileInput.current.value = "";
      }
    };
  };

  return (
    <div className="content mr-auto ml-auto">
      <h2>Upload Your Banner</h2>
      <form className="imageForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group mr-sm-2">
          <br />
          <input
            required
            type="file"
            accept="image/*"
            onChange={captureFile}
            ref={fileInput}
          />
          <br />
          <br />
          <input
            required
            placeholder="Description"
            {...register("imageDescription", { required: true })}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">
          Upload!
        </button>
      </form>
      <p>&nbsp;</p>
      {banners.map((banner, key) => {
        return <BannerView banner={banner} key={banner.id.toNumber()} />;
      })}
    </div>
  );
}

export default BannerManager;
