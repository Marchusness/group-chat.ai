
export const UserCollectionId = "Users";

export type UserDoc = {
  conversations: {
    [conversationId: string]: {
      createdAt: number;
      updatedAt: number;
      conversationName: string;
    };
  };
};