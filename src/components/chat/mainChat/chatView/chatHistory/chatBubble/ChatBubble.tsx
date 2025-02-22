/* eslint-disable @typescript-eslint/no-unused-vars */
import Markdown from "react-markdown";
import { ChatBubbleCodeBlock } from "./codeBlock";
import remarkGfm from "remark-gfm";
import { ConversationMessage } from "@/types/conversationsDoc";
import { useConversationStore } from "@/store/conversationStore";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
  
export function ChatBubble({
  message
}: {
  message: ConversationMessage
}): React.JSX.Element {
  const openAgentDebate = useConversationStore(state => state.openAgentDebate);

  if (message.type === "agent-debate" || message.type === "single-agent") {
    return <div className="pr-[5%]">
      <div className="flex flex-col items-start w-full bg-neutral-700 p-4 rounded-r-xl rounded-tl-xl mr-auto gap-2">
        {message.type === "agent-debate" && (
          <button 
            onClick={() => openAgentDebate(message.agentDebateId)}
            className="bg-neutral-800 px-4 py-3 rounded-xl mr-auto flex items-center gap-2 hover:bg-neutral-900 transition-colors"
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5" />
            <span>Agent Debate</span>
          </button>
        )}
        {message.content === "" ? 
          <div className="">
            Loading...
          </div>
          :
          <div className="w-full">
            <Markdown 
              remarkPlugins={[remarkGfm]}
              components={{
                code(props) {
                  const {children, className, node, ...rest} = props;
                  const match = /language-(\w+)/.exec(className || "");

                  return <ChatBubbleCodeBlock
                    language={match?.[1] ?? ""}
                    code={String(children).replace(/\n$/, "")}
                  />;
                }
              }}
            >
              {message.content}
            </Markdown>
          </div>
        }
      </div>
    </div>;
  }
  
  if (message.type === "user") {
    return <div className="flex flex-col w-full pl-[5%]">
      <div className="bg-neutral-900 p-3 w-full rounded-l-xl rounded-tr-xl ml-auto">
        <div className="flex flex-wrap gap-1 pb-2">
          {(message.requestedCharacters ?? []).map(({ characterId, characterName }) => (
            <span
              key={characterId}
              className="inline-flex items-center bg-[rgb(57,57,56)] text-white rounded px-2 py-0.5 text-sm mr-1">
              @{characterName}
            </span>
          ))}
        </div>
        <p className=''>
          {message.content}
        </p>
      </div>
    </div>;
  }
  
  return <p>not supported</p>;
}