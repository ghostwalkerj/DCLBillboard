import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { DateRange, RangeWithKey } from "react-date-range";
import { BannerContext } from "../context/BannerContext";
import { BillboardContext } from "../context/BillboardContext";
import { IBanner, IBillboard } from "../types";
import * as dateMath from "date-arithmetic";
import { FlightContext } from "../context/FlightContext";
import BillboardView from "./BillboardView";
import BannerView from "./BannerView";
import { Col, Container, Row } from "react-bootstrap";
import { BigNumber } from "ethers";

type Inputs = {
  flightDescription: string;
  dateInput: any;
  billboardId: number;
  bannerId: number;
};

type FlightSummary = {
  billboardDescription: string;
  bannerDescription: string;
  rate: number;
  numberOfDays: number;
  totalCost: number;
};

function FlightManager() {
  const bannerContext = useContext(BannerContext);
  const flightContext = useContext(FlightContext);
  const billboardContext = useContext(BillboardContext);
  const [dateState, setDateState] = useState<RangeWithKey>({
    startDate: new Date(),
    endDate: new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate() + 6
    ),
    key: "selection",
  });
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const billboards = billboardContext.billboards!;
  const banners = bannerContext.banners!;
  const createFlight = flightContext.createFlight;
  const getBlockedDates = flightContext.getBlockedDates;
  const { register, handleSubmit, control, reset, setValue } =
    useForm<Inputs>();
  const [selectedBanner, setSelectedBanner] = useState<IBanner>();
  const [selectedBillboard, setSelectedBillboard] = useState<IBillboard>();
  const [flightSummary, setFlightSummary] = useState<FlightSummary>({
    billboardDescription: "",
    bannerDescription: "",
    rate: 0,
    numberOfDays: 0,
    totalCost: 0,
  });

  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    console.log("Submitting to the contract: ", data.flightDescription);
    if (createFlight) {
      await createFlight(
        data.flightDescription,
        selectedBanner!.id!,
        selectedBillboard!.id!,
        BigNumber.from(flightSummary.rate),
        BigNumber.from(dateState.startDate!.getTime()),
        BigNumber.from(dateState.endDate!.getTime()),
        BigNumber.from(flightSummary.totalCost)
      );
      setValue("flightDescription", "");
      reset();
    }
  };

  useEffect(() => {
    setSelectedBanner(banners[0]);
  }, [banners]);

  useEffect(() => {
    if (selectedBillboard && selectedBanner && dateState) {
      const numberOfDays =
        dateMath.diff(dateState.startDate!, dateState.endDate!, "day", false) +
        1;
      const totalRate = numberOfDays * selectedBillboard.rate.toNumber();

      setFlightSummary({
        bannerDescription: selectedBanner.description,
        billboardDescription: selectedBillboard.description,
        rate: selectedBillboard.rate.toNumber(),
        numberOfDays: numberOfDays,
        totalCost: totalRate,
      });
    }
  }, [selectedBillboard, selectedBanner, dateState]);

  useEffect(() => {
    const _billboard = billboards[0];
    setSelectedBillboard(_billboard);
    if (_billboard && _billboard.id) {
      const blockedDates = getBlockedDates!(_billboard.id);
      setDisabledDates(blockedDates);
    }
  }, [billboards, getBlockedDates]);

  const onBannerChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const _banner = banners.find((obj) => {
      return obj.id!.toString() === e.target.value;
    });
    setSelectedBanner(_banner);
  };

  function onBillboardChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const _billboard = billboards.find((obj) => {
      return obj.id!.toString() === e.target.value;
    });
    setSelectedBillboard(_billboard);
    const blockedDates = getBlockedDates!(_billboard!.id!);
    setDisabledDates(blockedDates);
  }

  return (
    <div className="content mr-auto ml-auto">
      <h2>Schedule a Flight</h2>
      <form className="flightForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group mr-sm-2">
          <br />
          <input
            required
            placeholder="Flight description..."
            {...register("flightDescription", { required: true })}
            className="form-control"
          />
          <br />
          <select
            className="form-control"
            {...register("billboardId")}
            onChange={(e) => onBillboardChange(e)}
            value={selectedBillboard ? selectedBillboard!.id!.toNumber() : 0}
          >
            {billboards.map((billboard) => (
              <option
                value={billboard!.id!.toNumber()}
                key={billboard!.id!.toNumber()}
              >
                {billboard.description}
              </option>
            ))}
          </select>
          <br />
          <BillboardView billboard={selectedBillboard} />
          <select
            required
            className="form-control"
            {...register("bannerId")}
            onChange={(e) => onBannerChange(e)}
            value={selectedBanner ? selectedBanner!.id!.toNumber() : 0}
          >
            {banners.map((banner) => (
              <option
                value={banner!.id!.toNumber()}
                key={banner!.id!.toNumber()}
              >
                {banner.description}
              </option>
            ))}
          </select>
          <br />
          <BannerView banner={selectedBanner} />
          <Container className="m-0 p-0">
            <Row className="m-0 p-0">
              <Col className="m-0 p-0">
                <Controller
                  control={control}
                  name="dateInput"
                  render={({ field }) => (
                    <DateRange
                      editableDateInputs={true}
                      onChange={(item) => {
                        if ("selection" in item) {
                          setDateState(item.selection);
                          field.onChange(item.selection);
                        }
                      }}
                      moveRangeOnFirstSelection={true}
                      ranges={[dateState]}
                      minDate={new Date()}
                      disabledDates={disabledDates}
                    />
                  )}
                />
              </Col>
              <Col className="m-0 p-0 pl-2">
                <div className="card">
                  <div className="card-header text-center">Flight Summary</div>
                  <div className="card-body small ml-0 pl-0">
                    <ul
                      id="summaryList"
                      className="list-group list-group-flush box p-0 m-0"
                    >
                      <li className="list-group-item li">
                        Billboard: {flightSummary.billboardDescription}
                      </li>
                      <li className="list-group-item">
                        Banner: {flightSummary.bannerDescription}
                      </li>
                      <li className="list-group-item">
                        Rate: {flightSummary.rate} Wei / Day
                      </li>
                      <li className="list-group-item">
                        Run Time: {flightSummary.numberOfDays} days
                      </li>
                      <li className="list-group-item">
                        Total Cost: {flightSummary.totalCost}
                      </li>
                    </ul>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
          <button type="submit" className="btn btn-primary btn-block btn-lg">
            Schedule
          </button>
        </div>
      </form>
    </div>
  );
}

export default FlightManager;
