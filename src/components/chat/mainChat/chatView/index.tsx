import { useMessageSender } from "@/services/useMessageSender";
import { ChatHistory } from "./chatHistory";
import { NoChatHistoryView } from "./noChatView";
import { ChatViewTextArea } from "./textArea";
import { useConversation } from "@/services/firebase/firestore";
import { useAuthUser } from "@/services/firebase/init";

export function ActiveChatView({
  conversationId,
}: {
  conversationId: string;
}): React.JSX.Element {

  const {
    loading,
    error,
    sendMessage,
  } = useMessageSender(conversationId);

  const user = useAuthUser();

  // const conversationDoc = useConversation(user?.uid, conversationId);

  // For testing - comment out the real messages line and use this instead
  const dummyMessages = [
    {
      type: "user",
      lastUpdated: 1,
      content: "Thats cool adhfklasjdfkadsjflakdjhflkasjdfhkl",
      requestedAgents: "alpha"
    },
    {
      type: "user",
      lastUpdated: 1,
      content: "Thats cool",
      requestedAgents: "alpha"
    },
    {
      type: "user",
      lastUpdated: 1,
      content: "Thats cool",
      requestedAgents: "alpha"
    },
    {
      type: "user",
      lastUpdated: 1,
      content: "Thats cool",
      requestedAgents: "alpha"
    }
  ]

  const conversationDoc = { messages: dummyMessages }

  // Change the sorting to show oldest messages first (a - b instead of b - a)
  const messages = Object.values(conversationDoc?.messages ?? {}).sort((a, b) => a.lastUpdated - b.lastUpdated);
  // Test line - uncomment this when testing
  // const messages = Object.values(dummyMessages).sort((a, b) => b.lastUpdated - a.lastUpdated);

  return <div className="flex flex-col">
    {messages.length === 0 ? 
      <NoChatHistoryView text={"How can I help you today?"} />
      :
      <ChatHistory 
        error={error?.message ?? null} 
        messages={messages} />
    }

    {messages.length === 0 ?
      <ChatViewTextArea 
        placeholder={"Ask me anything..."} 
        loading={loading}
        onSend={sendMessage} 
      />
      :
      <div className="sticky bottom-0">
        <ChatViewTextArea 
          placeholder={"Ask me anything... MESSAGESS"} 
          loading={loading}
          onSend={sendMessage} 
        />
      </div>
    }
  </div>;
}