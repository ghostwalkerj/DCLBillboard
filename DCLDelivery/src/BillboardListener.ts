import RequestManager, { ContractFactory, HTTPProvider, sha3, toStringData } from "eth-connect";
import DCLBillboardABI from "contracts/DCLBillboard";
import * as config from "./config";

export async function getBanners(targetId: string) {

  const providerInstance = new HTTPProvider(config.PROVIDER);
  const requestManager = new RequestManager(providerInstance);
  const factory = new ContractFactory(requestManager, DCLBillboardABI);
  const contract = (await factory.at(config.CONTRACT_ADDRESS)) as any;

  // Encode TargetID for topic filtering
  const targetHash = "0x" + (sha3(toStringData(targetId), { encoding: "hex" }));

  // Create Signature and add topic
  const flightApprovedSignature = await contract.events.FlightApproved({}, {
    fromBlock: config.STARTBLOCK
  });
  flightApprovedSignature.options.topics[1] = targetHash;

  // Get past flights
  const logs = await flightApprovedSignature.getLogs();
  //log("Logs Found: ", logs.length);
  const flightSummary = [];

  // Build a array of approved flight
  for (const data of logs) {
    const flightID = parseInt(data.topics[2], 16);
    const [startDateNum, endDateNum, approved, hash, clickthru] = await contract.getFlightSummary(flightID);
    if (approved) {
      const startDate = new Date(startDateNum.toNumber());
      const endDate = new Date(endDateNum.toNumber());
      flightSummary.push({ flightID, startDate, endDate, hash, clickthru });
    }
  }
  return flightSummary;

}