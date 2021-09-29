export default {
  "anonymous": false,
  "inputs": [
    {
      "indexed": true,
      "internalType": "string",
      "name": "_targetId",
      "type": "string"
    },
    {
      "indexed": true,
      "internalType": "uint256",
      "name": "_flightID",
      "type": "uint256"
    },
    {
      "indexed": true,
      "internalType": "bool",
      "name": "_approved",
      "type": "bool"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "_startDate",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "uint256",
      "name": "_endDate",
      "type": "uint256"
    },
    {
      "indexed": false,
      "internalType": "string",
      "name": "_bannerHash",
      "type": "string"
    },
    {
      "indexed": false,
      "internalType": "string",
      "name": "_clickThru",
      "type": "string"
    }
  ],
  "name": "FlightApproved",
  "type": "event"

};