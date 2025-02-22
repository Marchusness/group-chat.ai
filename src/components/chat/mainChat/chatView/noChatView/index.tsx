
export function NoChatHistoryView({
  text,
}: {
    text: string | React.ReactNode;
}): React.JSX.Element {
  return <div className="flex flex-col w-full justify-center items-center gap-3 overflow-y-scroll p-2 flex-grow">
    <h3 className="text-4xl font-extrabold text-neutral-500">{text}</h3>
  </div>;
}