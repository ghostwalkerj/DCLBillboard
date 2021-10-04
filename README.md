# Readme

## Summary

The DCLBillboard system is a decentralised marketing system that allows users to rent advertising space on billboards
within the Decentraland Game. Users pay with Ethereum to rent billboards on a daily basis.

## Features

* Delivery system is fully decentralise utilising the Ethereum block chain and IPFS.
* Tightly integrated with Metamask.
* Users can upload banners and store information on the blockchain .
* Land owners can deploy billboards and make available for lease.
* Land owners can specify daily lease rate for billboards.
* Customers can self schedule advertising flights choosing available billboards given a data range.
* Customers pay for the lease directly in Eth when confirming the scheduled banner advertisement, billboard and number
  of days.
* Administrator has approval over transactions.
* Administrator can transfer funds collected into a personal wallet.

## Concepts

* **Banner** - Any image that can be displayed on a billboard. The same image can be used many times.
* **[IPFS](https://ipfs-io.ipns.dweb.link/) - InterPlanetary File System** - This is where banner images are stored.
  Currently accessed via the [Infura](https://infura.io/) API.
* **Billboard** - Represents a Smart Item which can be targeted for a banner. Each one should have a unique TargetId for
  banner delivery. Descriptions, Parcel, and Location are optional attributes to manage billboards for later use. The
  Billboard's rate is in [Finney](https://eth-converter.com/extended-converter.html) per day which equates to 1/1000 of
  an Eth. Given the current cost of Eth this unit seems to be the most appropriate.
* **Flight** - A flight is a match between a banner and a billboard. It is the creation of the advertisement run for a
  given rate over a set period of time. Flights are approved by the administrator before they can run. Scheduling a
  flight costs Eth to prepay for the total run.
* **Admin** - Special user with full privileges, based on their Eth address. By default, this is the address used to
  deploy the DCLBillboard Smart Contract,

## Architecture

### DCLBillboard contract

The DCLBillboard contract holds the information for the system. This includes:

* Permissions - The addressed used to deploy the contract is automatically the administrator of the system. Other
  administrator addresses may be added and removed. See the
  OpenZeppelin [documentation](https://docs.openzeppelin.com/contracts/2.x/access-control) for more information on
  Ownership and Role-Based Access Control.

### DCLBillboard Management System

The management system is written in Node.js and React. It is not distributed; however all state is managed by the
DCLBillboard contract. Therefore, the system can be hosted anywhere, have multiple instances or be moved without any
impact on operations.

#### Metamask Integration

The system in integrated with Metamask. Whatever account is selected in Metamask, that account is used by the system. To
verify both the account address and Jazzicon in Metamask is also displayed in the DCLBillboard Manager.

![screenshot_99.png](./assets/1633316655703-screenshot_99.png)

#### Permissions / Security

Permissions and Security are completely based upon the Ethereum address selected in MetaMask. If the address has the
Admin role in the DCLBillboard contract, then administrative functions will be displayed. Behind the scenes, any
component marked "IsAdmin" in React, will only be rendered when the address has the "IsAdmin" role in the contract.

With Admin Address:

![screenshot_100.png](./assets/screenshot_100.png)

With Non-Admin Address:

![screenshot_101.png](./assets/screenshot_101.png)

#### Banner Manager

#### Billboard Manager

#### Flight Manager

#### Admin

### DCL Delivery System

### Config.ts

### Billboard Listener

## Workflows

### Approving Flights

### Adding new Billboards

### Funds

## Future Enhancements

### Click-thru

### Banner Size Restriction

### Un-approving Flights

Refunds

### Expanding Smart Items

### Listening to New Flights
