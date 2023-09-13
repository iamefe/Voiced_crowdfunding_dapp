// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@thirdweb-dev/contracts/extension/ContractMetadata.sol";

contract CrowdFunding is ContractMetadata {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256 => Campaign) public campaigns;

    uint256 public numberOfCampaigns = 0;

    address public deployer;

    constructor() {
        deployer = msg.sender;
    }

    function _canSetContractURI()
        internal
        view
        virtual
        override
        returns (bool)
    {
        return msg.sender == deployer;
    }

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        // How exactly does this line below work?
        // Answer: This creates a new campaign in "storage" at index 0.
        Campaign storage campaign = campaigns[numberOfCampaigns];

        require(
            campaign.deadline < block.timestamp,
            "The deadline should be a date in the future."
        );

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
        // This is the value of the created campaign and it is equivalent to
        // the value of numberOfCampaigns which the function start with.
    }

    function donateToCampaign(uint256 _id) public payable {
        // Since the donateToCampaign function is payable, the msg object becomes available to us
        // msg.value contains the amount of wei (ether / 1e18) sent in the transaction.
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        // Here I am checking to see the status of the transaction between the donator and owner (ie. was it sent or not)
        // The variable "sent" can be "true" or "false".
        // (bool sent, ) = payable(campaign.owner).call{value: amount}("");

        // if (sent) {
        //     campaign.amountCollected = campaign.amountCollected + amount;
        // }

        payable(campaign.owner).transfer(amount);
        campaign.amountCollected = campaign.amountCollected + amount;
    }

    function getDonators(
        uint256 _id
    ) public view returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        // The variable allCampaigns is at this point going to be an array with empty campaign
        // structs (the same value of the number of campaigns that have be created).

        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns;
    }
}
