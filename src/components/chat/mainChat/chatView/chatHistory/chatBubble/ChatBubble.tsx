/* eslint-disable @typescript-eslint/no-unused-vars */
import Markdown from "react-markdown";
import { ChatBubbleCodeBlock } from "./codeBlock";
import remarkGfm from "remark-gfm";
import { ConversationMessage } from "@/types/conversationsDoc";
  
export function ChatBubble({
  message
}: {
  message: ConversationMessage
}): React.JSX.Element {
  if (message.type === "agent-debate" || message.type === "single-agent") {
    return <div className="flex items-start w-full pr-[5%]">
      {message.content === "" ? 
        <div className="bg-neutral-700 p-4 rounded-r-xl rounded-tl-xl mr-auto">
          Loading...
        </div>
        :
        <Markdown 
          // className="bg-neutral-700 p-3 w-full rounded-r-xl rounded-tl-xl mr-auto markdown"
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
      }
    </div>;
  }
  
  if (message.type === "user") {
    return <div className="flex w-full items-end pl-[5%]">
      <p className='bg-neutral-900 p-3 w-full rounded-l-xl rounded-tr-xl ml-auto'>
        {message.content}
      </p>
    </div>;
  }
  
  return <p>not supported</p>;
}