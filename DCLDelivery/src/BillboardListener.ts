import RequestManager, { ContractFactory, HTTPProvider, sha3, toStringData } from "eth-connect";
import abi from "contracts/DCLBillboard";

export async function getBanners(targetId: string) {
  const provider = "http://127.0.0.1:8545";
  const providerInstance = new HTTPProvider(provider);
  const requestManager = new RequestManager(providerInstance);
  const factory = new ContractFactory(requestManager, abi);
  const contractAddr = "0xABfE99d4cF78E5E2823bccf02a6687face5D99cB";
  const contract = (await factory.at(contractAddr)) as any;

  const targetHash = "0x" + (sha3(toStringData(targetId), { encoding: "hex" }));
  log("targetHash: ", targetHash);

  const flightApprovedSignature = await contract.events.FlightApproved({}, {
    fromBlock: "earliest"
  });
  flightApprovedSignature.options.topics[1] = targetHash;
  log("Signature: ", flightApprovedSignature.options);


  // const ethFilter = new EthFilter(requestManager, {
  //   address: contractAddr,
  //   fromBlock: "earliest",
  //   topics: [flightApprovedSignature.options.topics[0], targetHash]
  // });

// const flightApprovedEvent = await contract.allEvents({
//   fromBlock: "earliest",
//   topics: [flightApprovedSignature, targetHash]
// });


// Get past flights approved
  const logs = await flightApprovedSignature.getLogs();
  log("Logs Found: ", logs.length);

  logs.forEach(data => {
    const flightID = parseInt(data.topics[2], 16);
    const approved = parseInt(data.topics[3], 16);
    log("Flight ID: " + flightID);
    log("Approved: " + approved);
  });
  return logs;


}