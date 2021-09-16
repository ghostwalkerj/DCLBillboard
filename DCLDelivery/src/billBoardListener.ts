import RequestManager, { HTTPProvider } from "eth-connect";

export async function getBanners(targetID: string) {
  const provider = "http://127.0.0.1:8545";
  const providerInstance = new HTTPProvider(provider);
  const requestManager = new RequestManager(providerInstance);

  const accounts = await requestManager.eth_accounts();
  return accounts;
}