"use effect";

interface SideBarRowButtonProps {
  hoverEffectEnabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export function SideBarRowButton({
  hoverEffectEnabled = false,
  onClick,
  children,
}: SideBarRowButtonProps): React.JSX.Element {


  return <button
    className={`
    group
    flex w-full max-w-[100%] items-center gap-2 rounded-lg p-2 text-sm
    ${hoverEffectEnabled ? "bg-neutral-800" : "hover:bg-neutral-800"}
    `}
    type="button"
    onClick={onClick}
  >{children}</button>;
}