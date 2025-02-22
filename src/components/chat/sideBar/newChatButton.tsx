import { useConversationStore } from "@/store/conversationStore";
import { SideBarRowButton } from "./sideBarRowButton";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export function NewConversationButton(): React.JSX.Element {
  const openConversation = useConversationStore((state) => state.openConversation);

  return <div className="sticky left-0 right-0 top-0 z-20 pt-3.5 bg-neutral-900 text-neutral-50">
    <SideBarRowButton onClick={() => openConversation(null)}>
      <div className="grow overflow-hidden text-ellipsis whitespace-nowrap text-left text-sm">
        New Chain
      </div>
      <PencilSquareIcon className="h-6 w-6" />
    </SideBarRowButton>
  </div>;
}