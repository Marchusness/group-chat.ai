import { useState, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { ChatViewSendQuestionButton } from "./sendButton";
import { useLoadingHandler } from "@/utils/useLoading";
import { CharacterId } from "@/store/characters";
import { CharacterSuggestions } from "./characterSuggestions";
import { CharacterTag } from "./characterTag";
import toast from "react-hot-toast";
import { UserDoc } from "@/types/userDoc";

const MAX_CHARACTERS = 5;

export function ChatViewTextArea({
  userDoc,
  loading,
  onSend,
}: {
  userDoc: UserDoc | null;
  loading: boolean;
  onSend: ({
    text,
    requestedCharacterIds,
  }: {
    text: string;
    requestedCharacterIds: CharacterId[];
  }) => Promise<void>;
}): React.JSX.Element {
  const [input, setInput] = useState<string>("");
  const [selectedCharacters, setSelectedCharacters] = useState<CharacterId[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    wrappedHandler: _sendQuestion,
  } = useLoadingHandler(onSend);

  function handleCharacterSelect(character: CharacterId) {
    // Check if character is already selected
    if (selectedCharacters.includes(character)) {
      toast.error(`@${character} is already selected`);
      return;
    }

    // Check if max characters reached
    if (selectedCharacters.length >= MAX_CHARACTERS) {
      toast.error(`Maximum of ${MAX_CHARACTERS} characters allowed`);
      return;
    }

    const beforeCursor = input.slice(0, textareaRef.current?.selectionStart ?? 0);
    const afterCursor = input.slice(textareaRef.current?.selectionStart ?? 0);
    const lastAtIndex = beforeCursor.lastIndexOf("@");
    
    const newInput = beforeCursor.slice(0, lastAtIndex) + afterCursor;
    setInput(newInput);
    setSelectedCharacters([...selectedCharacters, character]);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  }

  function removeCharacter(character: CharacterId) {
    console.log(selectedCharacters);
    setSelectedCharacters(selectedCharacters.filter(c => c !== character));
  }

  function sendQuestion(text: string, requestedCharacterIds: CharacterId[]): void {
    if (loading || text.trim() === "") {
      return;
    }
    setInput("");
    setSelectedCharacters([]);
    _sendQuestion({ text, requestedCharacterIds });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    if (value === "\n") return;
    
    setInput(value);
    
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = value.slice(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf("@");
    
    if (lastAtIndex !== -1 && !textBeforeCursor.slice(lastAtIndex).includes(" ")) {
      setShowSuggestions(true);
      setSearchTerm(textBeforeCursor.slice(lastAtIndex + 1));
    } else {
      setShowSuggestions(false);
    }
  }

  return (
    <div className="bg-zinc-700 rounded-xl flex flex-col border-[1px] border-neutral-500 flex-shrink-0 mx-2 mb-2 relative">
      {showSuggestions && (
        <CharacterSuggestions
          userDoc={userDoc}
          searchTerm={searchTerm}
          onSelect={handleCharacterSelect}
        />
      )}
      {selectedCharacters.length > 0 && (
        <div className="flex flex-wrap gap-1 p-2 pb-0">
        {selectedCharacters.map((character) => (
          <CharacterTag
            key={character}
            characterName={userDoc?.characterDetails?.[character]?.agentName ?? character}
            characterId={character}
            onRemove={removeCharacter}
          />
          ))}
        </div>
      )}
      <div className="flex items-end">
        <TextareaAutosize
          ref={textareaRef}
          className="bg-transparent rounded-lg resize-none w-full min-h-full p-3 text-base"
          minRows={1}
          maxRows={5}
          placeholder="@chef please make me a recipe for a ..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendQuestion(input, selectedCharacters);
            }
          }}
        />
        <ChatViewSendQuestionButton
          loading={loading}
          disabled={loading || input === ""}
          onclick={() => sendQuestion(input, selectedCharacters)}
        />
      </div>
    </div>
  );
}
