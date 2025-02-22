import { CharacterId } from "@/store/characters";

export const ConversationsCollectionId = "Conversations";



export type ConversationMessage = {
  type: "agent-debate";
  lastUpdated: number;
  agentDebateId: string;
  content: string;
} | {
  type: "user";
  lastUpdated: number;
  content: string;
  requestedCharacters: {
    characterId: string;
    characterName: string;
  }[];
} | {
  type: "single-agent";
  lastUpdated: number;
  agentId: CharacterId;
  agentName: string;
  content: string;
};

export type ConversationsDoc = {
  messages: {
    [messageId: string]: ConversationMessage;
  };
};