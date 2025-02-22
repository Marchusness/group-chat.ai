import { useAgentDebate } from "@/services/firebase/firestore";
import { useAuthUser } from "@/services/firebase/init";

export function AgentConversation({
  conversationId,
  agentDebateId,
}: {
  conversationId: string;
  agentDebateId: string;
}) {
  const user = useAuthUser();
  const agentDebate = useAgentDebate(user?.uid, conversationId, agentDebateId);

  return (
    <div>
      {Object.values(agentDebate?.messages || {}).sort((a, b) => a.order - b.order).map((message) => (
        <div key={message.order}>
          <h3>{message.content}</h3>
        </div>
      ))}
    </div>
  );
}