import React, { useEffect } from "react";
import { FiPower } from "react-icons/fi";
import { useState } from "react";

const PowerSwitch = ({ isOn, onToggle, theme }) => {
  return (
    <button
      onClick={() => onToggle(!isOn)}
      className="focus:outline-none active:scale-95 active:shadow-inner transition-transform duration-150 "
    >
      <div
        className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 shadow-lg
          ${
            isOn
              ? "ring-4 ring-green-400 bg-white"
              : `ring-4 ${theme?.butRing} bg-white`
          }
        `}
      >
        <FiPower
          size={22}
          className={`transition-colors duration-300 ${
            isOn ? "text-green-600" : `${theme.text}`
          }`}
        />
        {/* Inner highlight circle for toggle feedback */}
        <span
          className={`absolute inset-0 rounded-full transform transition-all duration-200
            ${
              isOn
                ? "scale-85 bg-green-400 opacity-30"
                : `scale-85 ${theme.iconBg} opacity-30`
            }
          `}
        />
      </div>
    </button>
  );
};

export default PowerSwitch;
