
interface ErrorBubbleProps {
  errorText: string;
}

export function ErrorBubble({
  errorText
}: ErrorBubbleProps): React.JSX.Element {
  return <div className="bg-red-600 bg-opacity-15 mx-auto p-2 rounded-md ring-1 ring-red-500">
    {errorText}
  </div>;
}