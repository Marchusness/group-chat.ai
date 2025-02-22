"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ShowHideArrow } from "./showHideArrow";
import { NewConversationButton } from "./newChatButton";
import { ConversationSelectorList } from "./conversationSelector";
import { CharacterSelectorList } from "./characterSelector";
import { UserDoc } from "@/types/userDoc";

export function SideBar({
  userDoc,
}: {
  userDoc: UserDoc | null
}): React.JSX.Element {

  const [isOpen, setIsOpen] = useState(false);

  return <div className="absolute h-screen"
    onMouseEnter={() => setIsOpen(true)}
    onMouseLeave={() => setIsOpen(false)}
  >
    <ShowHideArrow isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}/>
    <motion.div
      className="h-full max-w-full bg-neutral-900 overflow-hidden"
      initial={false}
      animate={isOpen ? {
        width: 300,
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
        className="flex h-full flex-col px-3 pb-3.5 w-[300px] text-neutral-300"
      >
        <div className="flex flex-col flex-1 -mr-3 pr-3 overflow-y-auto">
          <NewConversationButton />
          <CharacterSelectorList userDoc={userDoc} />
          <ConversationSelectorList userDoc={userDoc} />
        </div>
      </nav>
    </motion.div>
  </div>
}
