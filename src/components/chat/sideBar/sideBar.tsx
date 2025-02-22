"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ShowHideArrow } from "./showHideArrow";
import { NewConversationButton } from "./newChatButton";
import { ConversationSelectorList } from "./conversationSelector";
import { useUserDocData } from "@/services/firebase/firestore";
import { useAuthUser } from "@/services/firebase/init";

export function SideBar(): React.JSX.Element {
  const user = useAuthUser();
  const userDoc = useUserDocData(user?.uid);

  const [isOpen, setIsOpen] = useState(true);

  return <div className="relative h-screen"
    onMouseEnter={() => setIsOpen(true)}
    onMouseLeave={() => setIsOpen(false)}
  >
    <ShowHideArrow isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}/>
    <motion.div
      className="h-full max-w-full bg-neutral-900 overflow-hidden"
      initial={false}
      animate={isOpen ? {
        width: 360,
        maxWidth: "100vw",
        translateX: 0,
      } : {
        width: 0,
        translateX: 0,
      }}
      transition={{
        duration: 0.6,
        type: "spring",
      }}
    >
      <nav
        className="flex h-full flex-col px-3 pb-3.5 w-[360px] text-neutral-300"
      >
        <div className="flex flex-col flex-1 -mr-3 pr-3 overflow-y-auto">
          <NewConversationButton />
          <ConversationSelectorList userDoc={userDoc} />
        </div>
      </nav>
    </motion.div>
  </div>
}
