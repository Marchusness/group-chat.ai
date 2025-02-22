import { SideBarRowButton } from "./sideBarRowButton";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { cn, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@heroui/react";
import { useState } from "react";


export function ConversationSelectorButton({
  selected,
  name,
  onSelect,
  onChangeName,
  onDelete,
}: {
  selected: boolean;
  name: string;
onSelect: () => void;
onChangeName: (name: string) => void;
onDelete: () => void;
}): React.JSX.Element {
  const [isEditing, setIsEditing] = useState(false);

  function confirmNameChange(newName: string) {
    onChangeName(newName);
    setIsEditing(false);
  }

  return <SideBarRowButton 
    hoverEffectEnabled={selected}
    onClick={onSelect} 
  >
    {isEditing ? (
      <Input 
        defaultValue={name}
        type="text"
        autoFocus
        onBlur={(e) => confirmNameChange((e.target as {value: string}).value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            confirmNameChange(e.currentTarget.value);
          }
        }}
      />
    ) : <>
      <div className="relative grow text-left py-1 -my-1 -mr-1 overflow-hidden whitespace-nowrap">
        {name}
        <div className={cn(
          "absolute h-7 top-0 bottom-0 right-0 w-10 group-hover:w-20 from-transparent transition-all bg-gradient-to-r",
          selected ? "to-neutral-800" : "to-neutral-900 group-hover:to-neutral-800"
        )} />
        <Dropdown >
          <DropdownTrigger >
            <EllipsisHorizontalIcon className="absolute h-7 w-7 top-0 right-0 opacity-0 group-hover:opacity-100 bg-neutral-900 hover:bg-neutral-700 transition-all rounded-lg" />
          </DropdownTrigger>
          <DropdownMenu 
            onAction={(key) => {
              if (key === "delete") {
                onDelete();
              }
              if (key === "rename") {
                setIsEditing(true);
              }
            }}
            aria-label="Static Actions"
          >
            <DropdownItem key="rename">Rename</DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger">
                Delete Chat
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </>}
  </SideBarRowButton>;
}