
export const AgentDebateCollectionId = "AgentDebate";

export type AgentMessage = {
    createdAt: number;
    lastUpdated: number;
    order: number;
    agentId: string;
    agentName: string;
    content: string;
};

// /Users/{uid}/Conversations/{conversationId}/AgentDebate/{agentDebateId}
export type AgentDebateDoc = {
  messages: {
    [messageId: string]: AgentMessage;
  };
  state: "pending" | "completed" | "failed";
};