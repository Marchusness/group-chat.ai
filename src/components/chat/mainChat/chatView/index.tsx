
import { useMessageSender } from "@/services/useMessageSender";
import { ChatHistory } from "./chatHistory";
import { NoChatHistoryView } from "./noChatView";
import { ChatViewTextArea } from "./textArea";
import { useConversation } from "@/services/firebase/firestore";
import { useAuthUser } from "@/services/firebase/init";
import { UserDoc } from "@/types/userDoc";

export function ActiveChatView({
  conversationId,
  userDoc,
}: {
  conversationId: string;
  userDoc: UserDoc | null;
}): React.JSX.Element {

  const {
    loading,
    error,
    sendMessage,
  } = useMessageSender(conversationId);

  const user = useAuthUser();

  const conversationDoc = useConversation(user?.uid, conversationId);

  const messages = Object.values(conversationDoc?.messages ?? {}).sort((a, b) => a.lastUpdated - b.lastUpdated);

  if (messages.length === 0) {
    return <div className="flex flex-col h-full w-full justify-center p-16 gap-4">
      <NoChatHistoryView text={"How can I help you today?"} />
      <ChatViewTextArea 
        userDoc={userDoc}
        loading={loading}
        onSend={sendMessage} 
      />
    </div>
  }

  return <div className="flex flex-col h-full w-full px-16 py-4">
    <ChatHistory 
      error={error?.message ?? null} 
      messages={messages} />

    <ChatViewTextArea 
      userDoc={userDoc}
      loading={loading}
      onSend={sendMessage} 
    />
  </div>;
}