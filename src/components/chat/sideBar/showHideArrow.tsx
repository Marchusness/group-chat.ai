import { motion } from "framer-motion";
import { useState } from "react";

const icon = {
  arrowLeft: {
    d: "M 25,10 L 10,50 L 25,90",
  },
  noArrow: {
    d: "M 25,10 L 25,50 L 25,90",
  },
  arrowRight: {
    d: "M 25,10 L 40,50 L 25,90",
  },
};

interface ShowHideArrowProps {
    isOpen: boolean;
  onClick: () => void;
}

export function ShowHideArrow({
  isOpen,
  onClick,
}: ShowHideArrowProps): React.JSX.Element {
  const [isHovering, setIsHovering] = useState(false);

  return <div className="absolute -right-1 flex flex-row items-center translate-x-full z-50 top-1/2 -translate-y-1/2 select-none h-screen">
    <button 
      onClick={onClick}
      className="text-neutral-400 hover:text-white transition-colors bg-transparent pl-1 pr-3 py-7"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <svg
        className="w-4 h-8"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 100"
      >
        <motion.path
          className="stroke-current fill-none overflow"
          style={{
            strokeWidth: 15,
            strokeLinecap: "round",
          }}
          variants={icon}
          initial="noArrow"
          transition={{
            duration: 0.5,
            type: "spring",
          }}
          animate={
            isOpen 
              ? isHovering ? "arrowLeft" : "noArrow"
              : "arrowRight"}
        />
      </svg>
    </button>
  </div>;
}