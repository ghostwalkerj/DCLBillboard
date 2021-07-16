import { ethers } from "hardhat";
import chai, { assert } from "chai";
import chaiAsPromised from "chai-as-promised";
import { BigNumber, Overrides, Signer } from "ethers";
import { solidity } from "ethereum-waffle";
import { DCLBillboard__factory } from "../src/hardhat/typechain/factories/DCLBillboard__factory";
import { DCLBillboard } from "../src/hardhat/typechain/DCLBillboard";

chai.use(chaiAsPromised);
chai.use(solidity);
const { expect } = chai;
let signers: Signer[];
let authorAddress: string;
let dclBillboard: DCLBillboard;
let bannerCount: BigNumber;
let billboardCount: BigNumber;
let flightCount: BigNumber;

describe("DCLBillboard", () => {

  beforeEach(async () => {
    signers = await ethers.getSigners();
    authorAddress = await signers[0].getAddress();

    const DCLBillboardFactory = (await ethers.getContractFactory(
      "DCLBillboard"
    )) as DCLBillboard__factory;

    dclBillboard = await DCLBillboardFactory.deploy();
    await dclBillboard.deployed();
    expect(dclBillboard.address).to.properAddress;
  });

  it('has a name', async () => {
    const name = await dclBillboard.name();
    expect(name).to.eq('DCLBillboard');
  });

  it('can upload a banner', async () => {
    const trx = await dclBillboard.createBanner('abc123', 'This is an ad for adult diapers', 'http://go.to.go.com');
    await trx.wait();
    const eventFilter = dclBillboard.filters.BannerCreated(null);
    const event = await dclBillboard.queryFilter(eventFilter);
    console.log(event);
    bannerCount = await dclBillboard.bannerCount();
    assert.equal(bannerCount.toNumber(), 1);
  });

  it('can create a billboard', async () => {
    const trx = await dclBillboard.;
    await trx.wait();
    const eventFilter = dclBillboard.filters.BillboardCreated(null);
    const event = await dclBillboard.queryFilter(eventFilter);
    console.log(event);
    billboardCount = await dclBillboard["billboardCount()"]();
    assert.equal(billboardCount.toNumber(), 1);
  });




});
