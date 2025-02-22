
export type ApiMessageRequest = {
    message: string;
    conversationId: string;
    userAuthToken: string;
    requestedAgentIds: string[];
}

export type ApiMessageResponse = {
    success: boolean;
    conversationId: string;
}