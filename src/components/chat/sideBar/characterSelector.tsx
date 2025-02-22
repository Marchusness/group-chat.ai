"use client";

import { UserDoc } from "@/types/userDoc";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { CharacterDetails } from "@/store/characters";
import { useAuthUser } from "@/services/firebase/init";
import { updateUserDoc } from "@/services/firebase/firestore";

interface CharacterSelectorListProps {
  userDoc: UserDoc | null;
}

interface CharacterEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: CharacterDetails;
  characterId: string;
  onSave: (characterId: string, updatedCharacter: CharacterDetails) => Promise<void>;
  isNew?: boolean;
}

const MODEL_OPTIONS = ['o3-mini', 'gpt-4o-mini'] as const;
type ModelOption = typeof MODEL_OPTIONS[number];

function CharacterEditModal({ isOpen, onClose, character, characterId, onSave, isNew }: CharacterEditModalProps) {
  const [agentName, setAgentName] = useState(character.agentName);
  const [systemPrompt, setSystemPrompt] = useState(character.systemPrompt);
  const [model, setModel] = useState<ModelOption>(character.model as ModelOption);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(characterId, {
        agentId: characterId,
        agentName,
        systemPrompt,
        model,
      });
      onClose();
    } catch (error) {
      console.error('Failed to save character:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 bg-neutral-800 rounded-lg w-[600px] max-w-[95vw]">
        <h2 className="text-xl font-semibold mb-4">
          {isNew ? 'Create Character' : 'Edit Character'}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Agent Name</label>
            <input 
              type="text" 
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-700 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Character Description</label>
            <textarea 
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-700 rounded font-mono text-sm"
              rows={12}
              style={{ minHeight: '200px' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as ModelOption)}
              className="w-full px-3 py-2 bg-neutral-700 rounded"
            >
              {MODEL_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-neutral-700 rounded hover:bg-neutral-600"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function CharacterSelectorList({ userDoc }: CharacterSelectorListProps) {
  const user = useAuthUser();
  const [selectedCharacter, setSelectedCharacter] = useState<{id: string, details: CharacterDetails, isNew?: boolean} | null>(null);

  if (!userDoc || !user) return null;

  const handleSaveCharacter = async (characterId: string, updatedCharacter: CharacterDetails) => {
    const update = {
      [`characterDetails.${characterId}`]: updatedCharacter
    };
    
    await updateUserDoc(user.uid, update);
  };

  const handleCreateCharacter = () => {
    // Generate a random ID for the new character
    const newCharacterId = `character_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create a new character with default values
    const newCharacter: CharacterDetails = {
      agentId: newCharacterId,
      agentName: "New Character",
      systemPrompt: "Enter system prompt here...",
      model: "gpt-4o-mini",
    };

    setSelectedCharacter({
      id: newCharacterId,
      details: newCharacter,
      isNew: true
    });
  };

  return (
    <div className="mb-4">
      <div className="px-3 mb-2 flex justify-between items-center">
        <h2 className="text-lg font-bold text-neutral-400">Characters</h2>
        <button
          onClick={handleCreateCharacter}
          className="text-sm px-2 py-1 bg-blue-600 rounded hover:bg-blue-700"
        >
          + New
        </button>
      </div>
      <div className="space-y-1">
        {Object.entries(userDoc.characterDetails ?? {}).sort((a, b) => a[1].agentId.localeCompare(b[1].agentId)).map(([characterId, character]) => (
          <button
            key={characterId}
            onClick={() => setSelectedCharacter({ id: characterId, details: character })}
            className="w-full px-3 py-2 text-left bg-neutral-800 hover:bg-neutral-900 rounded-lg transition-colors"
          >
            <span className="text-sm">{character.agentName}</span>
          </button>
        ))}
      </div>

      {selectedCharacter && (
        <CharacterEditModal
          isOpen={!!selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
          character={selectedCharacter.details}
          characterId={selectedCharacter.id}
          onSave={handleSaveCharacter}
          isNew={selectedCharacter.isNew}
        />
      )}
    </div>
  );
} 