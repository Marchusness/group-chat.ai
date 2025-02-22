import { useAgentDebate } from "@/services/firebase/firestore";
import { useAuthUser } from "@/services/firebase/init";
import { useConversationStore } from "@/store/conversationStore";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

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
    <div className="h-full w-full p-4">
      <div className="bg-[rgb(61,61,58)] rounded-xl shadow-lg h-full"> 
        <div className="flex flex-row justify-between p-4">
          <h2 className="text-white font-semibold">Multi-Agent Debate</h2>
          <button className="text-white font-semibold bg-neutral-800 rounded-xl p-2"
            onClick={() => {
              useConversationStore.getState().closeAgentDebate();
            }}
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col space-y-4 p-4 overflow-y-auto h-[calc(100%-4rem)]">
          {Object.values(agentDebate?.messages || {}).sort((a, b) => a.createdAt - b.createdAt).map((message) => (
            <div 
              key={message.createdAt} 
              className="w-[calc(100%-1rem)] bg-[rgb(41,41,38)] rounded-lg p-3 shadow-md"
            >
              <div className="text-white font-semibold">{message.agentName}</div>
              <div className="mt-1 text-gray-300 whitespace-pre-wrap break-words">{message.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}