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
    <div className="min-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] m-4 ml-auto bg-[rgb(61,61,58)] rounded-xl shadow-lg">
      <div className="p-4">
        <h2 className="text-white font-semibold">Multi-Agent Conversation</h2>
      </div>
      <div className="flex flex-col space-y-4 p-4 overflow-y-auto h-[calc(100%-4rem)]">
        {Object.values(agentDebate?.messages || {}).sort((a, b) => a.order - b.order).map((message) => (
          <div 
            key={message.order} 
            className="w-[calc(100%-1rem)] bg-[rgb(41,41,38)] rounded-lg p-3 shadow-md"
          >
            <div className="text-white font-semibold">{message.agentName}</div>
            <div className="mt-1 text-gray-300 whitespace-pre-wrap break-words">{message.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}