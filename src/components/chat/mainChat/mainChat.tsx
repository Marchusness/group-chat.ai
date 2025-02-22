"use client"

import { AgentConversation } from "./agentConversation/agentConversation";
import { useConversationStore } from "@/store/conversationStore";
import { ActiveChatView } from "./chatView";
export function MainChat() {
  // const { currentConversationId, agentDebateId } = useConversationStore()
  const currentConversationId = "test-conversation-123";
  const agentDebateId = "test-debate-456";

  return (
    <div className="flex flex-row justify-between w-full">
      <div className="flex flex-col">
        <ActiveChatView conversationId={currentConversationId} />

        <div>
          <h1>This is the chat input</h1>
        </div>
      </div>

      {currentConversationId && agentDebateId && (
        <div className="flex justify-end">
          <AgentConversation conversationId={currentConversationId} agentDebateId={agentDebateId} />
        </div>
      )}
    </div>
  );
}