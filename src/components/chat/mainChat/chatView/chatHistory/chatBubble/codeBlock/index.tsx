import {Prism as SyntaxHighlighter} from "react-syntax-highlighter";
import a11yDark from "react-syntax-highlighter/dist/esm/styles/prism/a11y-dark";
import { CopyCodeToClipboard } from "./copyToClipboard";

interface ChatBubbleCodeBlockProps {
  code: string;
  language: string;
}

export function ChatBubbleCodeBlock({
  code,
  language  
}: ChatBubbleCodeBlockProps): React.JSX.Element {
  return <div className="relative">
    <CopyCodeToClipboard code={code} language={language} />

    <SyntaxHighlighter
      customStyle={{
        fontSize: "0.8em",
        borderRadius: "0.5em",
      }}
      PreTag="div"
      language={language}
      style={a11yDark}
    >
      {code}
    </SyntaxHighlighter>
  </div>;
}