import RequestManager, { ContractFactory, HTTPProvider, sha3, toAddress, toStringData } from "eth-connect";
import DCLBillboardABI from "contracts/DCLBillboard";


function parseData(data: string): string[] {
  const dataString: string[] = [];

  return dataString;
}

export async function getBanners(targetId: string) {
  const provider = "http://127.0.0.1:8545";
  const contractAddr = toAddress("0xabfe99d4cf78e5e2823bccf02a6687face5d99cb");
  const startBlock = "earliest";

  const providerInstance = new HTTPProvider(provider);
  const requestManager = new RequestManager(providerInstance);
  const factory = new ContractFactory(requestManager, DCLBillboardABI);
  const contract = (await factory.at(contractAddr)) as any;

  // Encode TargetID for topic filtering
  const targetHash = "0x" + (sha3(toStringData(targetId), { encoding: "hex" }));

  // Create Signature and add topic
  const flightApprovedSignature = await contract.events.FlightApproved({}, {
    fromBlock: startBlock
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