import { ChatBubble } from "./chatBubble/ChatBubble";
import { ErrorBubble } from "./errorBubble";
import { ConversationMessage } from "@/types/conversationsDoc";

export function ChatHistory({
  error,
  messages,
}: {
  error: string | null;
  messages: ConversationMessage[];
}): React.JSX.Element {
  return <div className="flex flex-col w-full gap-3 overflow-y-scroll p-2 flex-grow">

    {messages.map((message, i) => {
      return <ChatBubble key={i} message={message} />;
    })}

    {error && <ErrorBubble errorText={error} />}
  </div>;
}