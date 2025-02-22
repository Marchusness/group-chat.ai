import { CharacterId } from "@/store/characters";

export type ApiMessageRequest = {
    message: string;
    conversationId: string;
    userAuthToken: string;
    requestedCharacterIds: CharacterId[];
}

export type ApiMessageResponse = {
    success: boolean;
    conversationId: string;
}