import React, { useState, useEffect } from "react";

import { DisplayCampaigns } from "../components";
import { useStateContext } from "../context"; // this make functions and variables from our server-side to be available
// to this page

const Home = () => {
  // Hooks
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]); // We use this to keep track of the campaigns that have been created on the blockchain

  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data); // update the campaigns in state
    setIsLoading(false);
  };

  // [address, contract] this section is called a dependency array. useEffect runs first when the application loads
  // and if any of the items in the array changes.
  // Note that you can't call an async function inside of useEffect and that's why we are calling our async function "getCampaigns"
  // first inside fetchCampaigns and then fetchCampaigns can be called inside of useEffect
  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <DisplayCampaigns
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  );
};

export default Home;
