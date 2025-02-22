import { CharacterId } from "@/store/characters";

interface CharacterTagProps {
  characterName: string;
  characterId: CharacterId;
  onRemove?: ((character: CharacterId) => void);
}

export function CharacterTag({ characterName, characterId, onRemove = undefined }: CharacterTagProps) {
  return (
    <span className="inline-flex items-center bg-blue-600 text-white rounded px-2 py-0.5 text-sm mr-1">
      @{characterName}
      {onRemove && (
        <button 
          onClick={() => onRemove(characterId)}
          className="ml-1 hover:text-blue-200"
        >
          ×
        </button>
      )}
    </span>
  );
} 