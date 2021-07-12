import { ethers } from "hardhat";
import chai, { assert } from "chai";
import chaiAsPromised from "chai-as-promised";
import { BigNumber, Overrides, Signer } from "ethers";
import { solidity } from "ethereum-waffle";
import { DCLBillboards__factory } from "../src/hardhat/typechain/factories/DCLBillboards__factory";
import { DCLBillboards } from "../src/hardhat/typechain/DCLBillboards";

chai.use(chaiAsPromised);
chai.use(solidity);
const { expect } = chai;
let signers: Signer[];
let authorAddress: string;
let dclbillboards: DCLBillboards;

describe("DCLBillboards", () => {

  beforeEach(async () => {
    signers = await ethers.getSigners();
    authorAddress = await signers[0].getAddress();

    const dclbillboardsFactory = (await ethers.getContractFactory(
      "DCLBillboards"
    )) as DCLBillboards__factory;

    dclbillboards = await dclbillboardsFactory.deploy();
    await dclbillboards.deployed();
    expect(dclbillboards.address).to.properAddress;
  });

  it('has a name', async () => {
    const name = await dclbillboards.name();
    expect(name).to.eq('DCLBillboards');
  });

});
