
export const ConversationsCollection = "Conversations";

type AgentMessage = {
  createdAt: Date;
  order: number;
  agentId: string;
  agentName: string;
  content: string;
};

export type ConversationsDoc = {
  messages: Record<string, AgentMessage>;
};