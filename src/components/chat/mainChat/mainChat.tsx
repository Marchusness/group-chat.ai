import { AgentConversation } from "./agentConversation/agentConversation";
import { useConversationStore } from "@/store/conversationStore";

export function MainChat() {
  const { currentConversationId, agentDebateId } = useConversationStore((state) => ({
    currentConversationId: state.currentConversationId,
    agentDebateId: state.agentDebateId,
  }));

  return (
    <div className="flex flex-row">
      <div className="flex flex-col">
        <div>
          <h1>This is the chat history</h1>
        </div>

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