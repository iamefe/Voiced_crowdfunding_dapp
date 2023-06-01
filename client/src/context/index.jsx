// I'm using this context file to connect the client with the smart contract

import React, { useContext, createContext } from "react";

import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

// Some explanation
// Create a context
// Connect with contract, wallet and then smart contract functions, using StateContextProvider
// Pass the connections above to all pages using StateContext.Provider which is different from StateContextProvider
// Create a hook to make our context usable
// So, StateContextProvider -> useContract -> useContractWrite -> publishCampaign -> StateContext.Provider -> useContext

export const StateContextProvider = ({ children }) => {
  // In order to connect our client to our smart contract using this code, we'll need the following:
  // 1: Our contract's address
  // 2: A code for our write functions
  // 3: A code for our wallet's address
  // 4: A code for establishing the connection to Metamask

  // Start: Connect to contract
  // 1: Get our contract
  const { contract } = useContract(
    "0x732c655f1BdfD0f3872dC0778DC839ca644B9c8E"
  );
  // 2: Bringing our Web3 server methods into our client.
  // Here we get our createCampaign function (it's a write function ie. "C" in CRUD). Thus,
  // creating a link between our client-side and server-side just for it ie.
  // it is as though we have pulled our web3 functions into our server. That is the main purpose of this context file.
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );
  // 3: Get the address of the campaign owner
  const address = useAddress();
  // 4: Connect to metamask eg. when a user clicks on the connect button in the nav bar
  const connect = useMetamask();
  // End: Connect to contract

  // Publish a campaign
  // This connects with the createCampaign function in our smart contract, and takes args in the order specified there.
  const publishCampaign = async (form) => {
    // We use a trycatch block here to ensure that there are no errors before allowing any subsquent code to execute
    // in the file where createCampaign is called
    try {
      const data = await createCampaign({
        // We simply send in the form's values. No logic is required in our client since they are already
        // present on the server-side
        args: [
          address, // campaign owner
          form.title, // campaign title
          form.description,
          form.target,
          new Date(form.deadline).getTime(), // campaign deadline [getTime() gives us access to a number of seconds passed since 1970].
          form.image,
        ],
      });

      console.log("Contract call succeded", data);
    } catch (error) {
      console.log("Contract call failed", error);
    }
  };

  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns");

    // Since we don't want to return an object with data that isn't properly formatted for readability,
    // rather we want to return certain fields in a comprehensive way, we code as follows:
    const parsedCampaigns = campaigns.map((campaign, i) => ({
      //  Note that the argument "i" is automatically incremented by React every time the code runs (returning a
      // new campaign)
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      image: campaign.image,
      pId: i,
    }));
    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  const donate = async (pId, amount) => {
    // Although "donateToCampaign" to campaign in our Web3 back-end takes only one argument, "pId", the entire
    // contract call here in the context front-end logic take more than that to identify which function, campaign,
    // user/donator and finally the amount they are donating.

    // if (data === true) {
    //   console.log("Donation made successfully!");
    // } else {
    //   console.log("Donation failed!");
    // }

    try {
      const data = await contract.call("donateToCampaign", [pId], {
        value: ethers.utils.parseEther(amount),
      });
      console.log("Donation was successful!", data);
      return data;
    } catch (error) {
      console.log("Donation failed!", error);
    }
  };

  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", [pId]);
    // donations contains donators and their donations

    const numberOfDonations = donations[0].length; // technically the first array in our donations object contains
    // donators but that number also corresponds with the number of donations they made so the logic here also works.

    // Let parse the donations object into a simple array of {donator, donation} objects ie. [{donator, donation}, {donator, donation}]
    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    console.log(parsedDonations);

    return parsedDonations;
  };

  // Share items across all pages using context
  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign, // Here we are sharing our publishCampaign function with the name "createCampaign" for easy recognition.
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

// Create a hook to make our context usable
export const useStateContext = () => useContext(StateContext);

// How to use this hook in other pages
// 1: Import useStateContext. For example, import { useStateContext } from "../context";
// 2: Destructure the shared items we need eg.
//      const { createCampaign } = useStateContext()
//      const { contract, createCampaign } = useStateContext()
// Now put them to use, eg. for const { createCampaign } = useStateContext()
/*

await createCampaign({
    ...form,
    target: ethers.utils.parseUnits(form.target, 18),
});

*/
