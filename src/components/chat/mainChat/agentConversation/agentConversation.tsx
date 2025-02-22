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
  // const agentDebate = useAgentDebate(user?.uid, conversationId, agentDebateId);
  
  // Dummy data structure for development/testing
  const agentDebate = {
    id: agentDebateId,
    status: 'active',
    messages: [
      {
        order: 1,
        content: "Hello! I'm Agent 1. How can I help you today?",
        agentId: "agent1",
        agentName: "Assistant Alpha",
        timestamp: new Date().getTime(),
        type: "message"
      },
      {
        order: 2,
        content: "I'm Agent 2, and I'm also here to assist.",
        agentId: "agent2",
        agentName: "Assistant Beta",
        timestamp: new Date().getTime(),
        type: "message"
      },
      {
        order: 3,
        content: "Let's work together to solve your problem.",
        agentId: "agent1",
        agentName: "Assistant Alpha",
        timestamp: new Date().getTime(),
        type: "message"
      },
      {
        order: 4,
        content: "I agree! We're here to provide comprehensive assistance.",
        agentId: "agent2",
        agentName: "Assistant Beta",
        timestamp: new Date().getTime(),
        type: "message"
      }
    ]
  };

  return (
    <div className="bg-[rgb(61,61,58)] rounded-xl shadow-lg h-[calc(100vh-2rem)] w-[calc(100%-2rem)] m-4 ml-auto">
      <div className="px-4 py-4">
        <h2 className="font-semibold text-white">Multi-Agent Conversation</h2>
      </div>
      <div className="space-y-4 px-4 py-4 flex flex-col overflow-y-auto h-[calc(100%-4rem)]">
        {Object.values(agentDebate?.messages || {}).sort((a, b) => a.order - b.order).map((message) => (
          <div key={message.order} className="block rounded-lg bg-[rgb(41,41,38)] p-3 w-[calc(100%-1rem)] shadow-md">
            <div className="font-semibold text-white">{message.agentName}</div>
            <div className="mt-1 text-gray-300 whitespace-pre-wrap break-words">{message.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}