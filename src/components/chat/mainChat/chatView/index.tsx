
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

  const conversationDoc = useConversation(user?.uid, conversationId);

  const messages = Object.values(conversationDoc?.messages ?? {}).sort((a, b) => a.lastUpdated - b.lastUpdated);

  return <div className="flex flex-col h-full">
    {messages.length === 0 ? 
      <NoChatHistoryView text={"How can I help you today?"} />
      :
      <ChatHistory 
        error={error?.message ?? null} 
        messages={messages} />
    }
    
    <ChatViewTextArea 
      placeholder={"Ask me anything..."} 
      loading={loading}
      onSend={sendMessage} 
    />
  </div>;
}