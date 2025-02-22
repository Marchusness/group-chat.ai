"use client"

import { AgentConversation } from "./agentConversation/agentConversation";
import { useConversationStore } from "@/store/conversationStore";
import { ActiveChatView } from "./chatView";
import { motion, AnimatePresence } from "framer-motion";
import { UserDoc } from "@/types/userDoc";

export function MainChat({
  userDoc,
}: {
  userDoc: UserDoc | null
}) {
  const { currentConversationId, agentDebateId } = useConversationStore()

  const showAgentDebate = currentConversationId && agentDebateId;

  return (
    <div className="flex flex-row w-full h-screen overflow-hidden relative">
      <motion.div
        className="absolute w-1/2 h-full"
        initial={false}
        animate={{
          left: showAgentDebate ? "0%" : "25%",
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      >
        <ActiveChatView conversationId={currentConversationId} userDoc={userDoc} />
      </motion.div>

      <AnimatePresence>
        {showAgentDebate && (
          <motion.div
            className="absolute w-1/2 h-full right-0"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          >
            <AgentConversation 
              conversationId={currentConversationId} 
              agentDebateId={agentDebateId} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}