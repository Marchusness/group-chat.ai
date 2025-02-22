
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
  requestedAgents: string[];
} | {
  type: "single-agent";
  lastUpdated: number;
  agentId: string;
  agentName: string;
  content: string;
};

export type ConversationsDoc = {
  messages: {
    [messageId: string]: ConversationMessage;
  };
};