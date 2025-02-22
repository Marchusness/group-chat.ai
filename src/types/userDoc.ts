import { CharacterDetails } from "@/store/characters";

export const UserCollectionId = "Users";

export type UserDoc = {
  conversations: {
    [conversationId: string]: {
      createdAt: number;
      updatedAt: number;
      conversationName: string;
    };
  };
  characterDetails: Record<string, CharacterDetails>;
};