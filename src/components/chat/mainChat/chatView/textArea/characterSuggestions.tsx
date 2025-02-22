/* eslint-disable @typescript-eslint/no-unused-vars */
import { CharacterId, characterDetails } from "@/store/characters";
import { UserDoc } from "@/types/userDoc";

interface CharacterSuggestionsProps {
  searchTerm: string;
  onSelect: (character: CharacterId) => void;
  style?: React.CSSProperties;
  userDoc: UserDoc | null;
}

export function CharacterSuggestions({ searchTerm, onSelect, style, userDoc }: CharacterSuggestionsProps) {
  const suggestions = Object.entries(userDoc?.characterDetails ?? characterDetails)
    .filter(([id, { agentName }]) => 
      agentName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map(([id, { agentName, systemPrompt }]) => ({
      id: id,
      agentName,
      systemPrompt,
    }));

  if (suggestions.length === 0) return null;

  return (
    <div 
      className="absolute bottom-full mb-2 bg-zinc-800 rounded-lg border border-neutral-500 max-h-60 overflow-y-auto w-96"
      style={style}
    >
      {suggestions.map(({ id, agentName, systemPrompt }) => (
        <button
          key={id}
          className="w-full px-4 py-2 text-left hover:bg-zinc-700 flex flex-col"
          onClick={() => onSelect(id as CharacterId)}
        >
          <span className="font-medium">{agentName}</span>
          <span className="text-sm text-neutral-400">{systemPrompt.slice(0, 100)}</span>
        </button>
      ))}
    </div>
  );
} 