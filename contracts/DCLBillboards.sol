//SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.4;

import "hardhat/console.sol";

contract DCLBillboards {
	string public name = "DCLBillboards";

	// Banners
	uint256 public bannerCount = 0;
	mapping(uint256 => Banner) public banners;

	struct Banner {
		uint256 id;
		string hash;
		string description;
		string clickThru;
		address payable owner;
	}
	event BannerCreated(Banner _banner);

	// Billboards
	uint256 public billboardCount = 0;
	mapping(uint256 => Billboard) public billboards;

	struct Billboard {
		uint256 id;
		string postion;
		string description;
		string realm;
		uint256 rate;
		address payable owner;
	}
	event BillboardCreated(Billboard _billboard);

	// Flight - Represents an advertising run
	uint256 public flightCount = 0;
	mapping(uint256 => Flight) public flights;

	struct Flight {
		uint256 id;
		string parcel;
		string description;
		uint256 rate;
		uint256 startDate;
		uint256 endDate;
	}

	event FlightCreated(Flight _flight);

	function uploadBanner(
		string memory _bannerHash,
		string memory _description,
		string memory _clickThru
	) public {
		require(bytes(_description).length > 0, "Description required");
		require(bytes(_bannerHash).length > 0, "BannerHash required");
		require(msg.sender != address(0x0), "Bad Sender");
		bannerCount++;

		Banner memory banner = Banner(
			bannerCount,
			_bannerHash,
			_description,
			_clickThru,
			payable(msg.sender)
		);
		banners[bannerCount] = banner;

		emit BannerCreated(banner);
	}
}
