import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { logo, sun } from "../assets";
import { navlinks } from "../constants";

// const icon = ({props go in here }) => ( html code goes in here ) is the summarized version of this code block.
const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div
    className={`w-[48px] h-[48px] rounded-[10px] ${
      isActive && isActive == name && "bg-[#2c2f32]"
    } flex justify-center items-center ${
      !disabled && "cursor-pointer"
    } ${styles}`}
    onClick={handleClick}
  >
    {/* This is where we create variants just like in Figma */}
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" /> // "alt" isn't dynamic here
    ) : (
      // This else part of the code will be the default look of the sidebar icons since "isActive" by default is set to the value
      // "dashboard" which at first will not be equal to the value in the variable "name" during mapping in our jsx return code below.
      // This part else part of the code comes alive in the mapping of the side bar
      <img
        src={imgUrl}
        alt="fund_logo"
        className={`w-1/2 h-1/2 ${isActive !== name && "grayscale"}`} // Why are we checking this "isActive !== name" here?
        // Answer: If "isActive" the value of the page we are on, isn't equal to "name", then we are the sidebar icon that icon when
        // render won't be coloured.
      />
    )}
  </div>
);
const Sidebar = () => {
  //HOOKS
  const navigate = useNavigate(); // This is a hook
  const [isActive, setIsActive] = useState("dashboard"); // This is also a hook and in it, the initial value of isActive is "dashboard".
  // The essence of this hook is to keep track of the page we are on.
  // isActive the name of our variable. It can be anything else such as dog, school, man, etc. It is a reactive variable as a result
  // of this state code block.

  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      {/* Product's logo */}
      <Link to="/">
        <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
        {/* bg-[#2c2f32]" seems to be repeated here since I already have it in the default code */}
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[24px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-3">
          {/* 
              MAPPING: 
              Links are inside the navlinks objects in our constants index.js file,
              and this code is for mapping over them 
          */}
          {navlinks.map((link) => (
            <Icon
              key={link.name}
              {...link} // name, imgUrl, link and disabled. "link" isn't one of our default args for Icon but it can be passed here still.
              isActive={isActive} // This gives "isActive" a value first and formost
              handleClick={() => {
                if (!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                }
              }}
            />
          ))}
        </div>

        <Icon styles="bg-[#1c1c24] secondary-shadow" imgUrl={sun} />
      </div>
    </div>
  );
};

export default Sidebar;
