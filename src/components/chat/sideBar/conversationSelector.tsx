/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConversationSelectorButton } from "./conversationSelectorButton";
import { UserDoc } from "@/types/userDoc";
import { useConversationStore } from "@/store/conversationStore";
import { useIsClient } from "@/utils/useIsClient";


export function ConversationSelectorList({
  userDoc,
}: {
  userDoc: UserDoc | null
}): React.JSX.Element {
  const isClient = useIsClient();
  const conversations = Object.entries(userDoc?.conversations || {}).sort((a, b) => b[1].updatedAt - a[1].updatedAt);

  const currentConversationId = useConversationStore((state) => state.currentConversationId);
  const openConversation = useConversationStore((state) => state.openConversation);
  return <ol className="pb-2 text-sm mt-3 flex-grow flex flex-col gap-1">
    {!isClient ? <>
      <li
        className="z-10"
      >
        <div className="w-full text-center text-neutral-500">
          Loading ...
        </div>
      </li>
    </> : <>
      {conversations.map(([conversationId, {conversationName}]) => (
        <li
          key={conversationId}
          className="z-10"
        >
          <ConversationSelectorButton 
            selected={currentConversationId === conversationId} 
            name={conversationName} 
            onSelect={() => openConversation(conversationId)} 
            onChangeName={(newName) => {
              // updateConversationName(conversationId, newName);
            }} 
            onDelete={() => {
              // deleteConversation(conversationId);
            }}
             />
        </li>
      ))}

      {conversations.length === 0 && (
        <li
          className="z-10"
        >
          <div className="w-full text-center text-neutral-500">
            No Conversation History
          </div>
        </li>
      )}
    </>}
  </ol>;
}