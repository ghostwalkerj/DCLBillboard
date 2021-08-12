import React, { useContext, useEffect, useRef, useState } from "react";
import { Jazzicon } from "@ukstv/jazzicon-react";
import { DCLBillboardContext } from "../hardhat/SymfoniContext";
import { Collapse } from "react-bootstrap";
import { DateRange, Range } from "react-date-range";
import { SubmitHandler, useForm } from "react-hook-form";

import "react-date-range/dist/styles.css"; // main style file
import { IBanner, IBillboard } from "../types";

//Declare IPFS
const ipfsClient = require("ipfs-http-client");
const IPFS_API_HOST = process.env.REACT_APP_IPFS_API_HOST;
const IPFS_API_PORT = process.env.REACT_APP_IPFS_API_PORT;
const IPFS_HOST = process.env.REACT_APP_IPFS_HOST;
const IPFS_PORT = process.env.REACT_APP_IPFS_PORT;
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
  const fileInput = useRef<HTMLInputElement>(null);
  const [bannerCount, setBannerCount] = useState(0);
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [buffer, setBuffer] = useState<string | ArrayBuffer | null>();
  const [open, setOpen] = React.useState<{ [key: number]: boolean }>({});
  const [dateState, setDateState] = useState<{ [key: number]: [Range] }>({});
  const [billboards, setBillboards] = useState<IBillboard[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

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
    const loadBillboards = async () => {
      let _billboardCount = 0;
      let _billboards = [];
      try {
        if (dclbillboardCtx.instance) {
          _billboardCount = (
            await dclbillboardCtx.instance.billboardCount()
          ).toNumber();
        }
      } catch (e) {
      } finally {
        if (dclbillboardCtx.instance) {
          for (var i = _billboardCount; i >= 1; i--) {
            const billboard = await dclbillboardCtx.instance.billboards(i);
            _billboards.push(billboard);
          }
          setBillboards(_billboards);
        }
      }
    };
    loadBillboards();
  }, [dclbillboardCtx.instance, billboards]);

  useEffect(() => {
    const initializeImages = async () => {
      if (dclbillboardCtx.instance) {
        const _dateState: { [key: number]: [Range] } = {};
        const _banners = [];
        let j = 0;
        for (let i = bannerCount; i >= 1; i--) {
          const banner = await dclbillboardCtx.instance.banners(i);
          _banners.push(banner);
          const today = new Date();
          const nextWeek = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 7
          );
          _dateState[j] = [
            {
              startDate: today,
              endDate: nextWeek,
              key: "selection",
            },
          ];
          j++;
        }
        setBanners(_banners);
        setDateState(_dateState);
      }
    };
    initializeImages();
  }, [dclbillboardCtx.instance, bannerCount]);

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
    console.log(IPFS_API_HOST, IPFS_PORT);
    const ipfs = await ipfsClient.create({
      host: IPFS_API_HOST,
      port: IPFS_API_PORT,
      protocol: "https",
      //, headers: {
      //  authorization: auth
      //}
    });
    // adding file to the IPFS
    console.log(buffer);
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
        const today = new Date();
        const nextWeek = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 7
        );

        setDateState((prevState) => ({
          ...prevState,
          bannerCount: [
            {
              startDate: today,
              endDate: nextWeek,
              key: "selection",
            },
          ],
        }));
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
        return (
          <div className="card mb-4" key={key}>
            <div className="card-header">
              <div
                className="d-inline-block align-top"
                style={{ width: "30px", height: "30px" }}
              >
                <Jazzicon address={banner.owner} className="mr-2" />
              </div>
              <small className="text-muted">{banner.owner}</small>
            </div>
            <ul id="bannerList" className="list-group list-group-flush">
              <li className="list-group-item">
                <p className="text-center">
                  <img
                    src={`http://${IPFS_HOST}:${IPFS_PORT}/ipfs/${banner.hash}`}
                    style={{ maxWidth: "420px" }}
                    alt={"Banner"}
                  />
                </p>
                <p>{banner.description}</p>
              </li>
              <li key={key} className="list-group-item py-2">
                <div className="row">
                  <button
                    className="btn btn-primary btn-sm float-left pt-0"
                    onClick={() => {
                      setOpen((prevState) => ({
                        ...prevState,
                        [key]: !prevState[key],
                      }));
                    }}
                  >
                    Schedule Banner
                  </button>
                </div>
                <Collapse in={open[key]}>
                  <div id="example-collapse-text" className="collapse pt-3">
                    <DateRange
                      editableDateInputs={true}
                      onChange={(item) => {
                        if ("selection" in item)
                          setDateState((prevState) => ({
                            ...prevState,
                            [key]: [item.selection],
                          }));
                      }}
                      moveRangeOnFirstSelection={true}
                      ranges={dateState[key]}
                      minDate={new Date()}
                      focusedRange={[0, 0]}
                    />
                  </div>
                </Collapse>
              </li>
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default BannerManager;
