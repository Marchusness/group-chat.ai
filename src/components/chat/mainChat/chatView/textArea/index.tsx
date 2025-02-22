
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { ChatViewSendQuestionButton } from "./sendButton";
import { useLoadingHandler } from "@/utils/useLoading";

export function ChatViewTextArea({
  placeholder,
  loading,
  onSend,
}: {
  placeholder: string;
  loading: boolean;
  onSend: ({
    text,
    requestedAgentIds,
  }: {
    text: string;
    requestedAgentIds: string[];
  }) => Promise<void>;
}): React.JSX.Element {
  
  const [ input, setInput ] = useState<string>("");

  const {
    wrappedHandler: _sendQuestion,
  } = useLoadingHandler(onSend);

  function sendQuestion(text: string, requestedAgentIds: string[]): void {
    if (loading) {
      return;
    }
    if (text.trim() === "") {
      return;
    }
    setInput("");
    _sendQuestion({ text, requestedAgentIds });
  }

  return <div className="bg-zinc-700 rounded-xl flex items-end border-[1px] border-neutral-500 flex-shrink-0 mx-2 mb-2">
    <TextareaAutosize className='bg-transparent rounded-lg resize-none w-full min-h-full p-3 text-base'
      minRows={1}
      maxRows={5}
      placeholder={placeholder}
      value={input}
      onChange={(e) => {
        if (e.target.value === "\n") {
          return;
        }
        setInput(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {// enter key to submit form 
          sendQuestion(input, []);
        }
      }}
    />
    <ChatViewSendQuestionButton
      loading={loading}
      disabled={loading || input === ""}
      onclick={function (): void {
        sendQuestion(input, []);
      } } />
  </div>;
}
