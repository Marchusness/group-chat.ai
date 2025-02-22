import { AgentConversation } from "./agentConversation/agentConversation";
import { useConversationStore } from "@/store/conversationStore";
import { ActiveChatView } from "./chatView";
export function MainChat() {
  const { currentConversationId, agentDebateId } = useConversationStore();

  return (
    <div className="flex flex-row">
      <div className="flex flex-col">
        <ActiveChatView conversationId={currentConversationId} />

        <div>
          <h1>This is the chat input</h1>
        </div>
      </div>

      {currentConversationId && agentDebateId && (
        <AgentConversation conversationId={currentConversationId} agentDebateId={agentDebateId} />
      )}

    </div>
  );
}