import { ApiMessageRequest, ApiMessageResponse } from "@/types/apiMessage";
import { initializeFirebaseAdmin } from "@/services/firebase/adminInit";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { UserDoc, UserCollectionId } from "@/types/userDoc";
import { ConversationsCollectionId, ConversationMessage, ConversationsDoc } from "@/types/conversationsDoc";
import { AgentDebateDoc, AgentDebateCollectionId, AgentMessage } from "@/types/agentDebateDoc";
import { randomUUID } from "crypto";
import { characterDetails, CharacterDetails, CharacterId } from "@/store/characters";
import { getChatResponse } from "@/services/openai/getChatResponse";

// Initialize Firebase Admin if not already initialized
const app = initializeFirebaseAdmin();
const auth = getAuth(app);
const db = getFirestore(app);

export const runtime = 'nodejs'; // Use Node.js runtime instead of Edge
export const maxDuration = 300; // Set maximum timeout to 300 seconds

async function getUserDoc(userId: string): Promise<UserDoc> {
    const userRef = db.collection(UserCollectionId).doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
        await userRef.set({ conversations: {}, characterDetails: characterDetails } as UserDoc);
        return { conversations: {}, characterDetails: characterDetails };
    }
    return userDoc.data() as UserDoc;
}

async function getOrCreateConversation(userId: string, userDoc: UserDoc, conversationId: string): Promise<ConversationsDoc> {

    if (!userDoc.conversations[conversationId]) {
        const batch = db.batch();

        const userUpdate = {
            [`conversations.${conversationId}`]: {
                createdAt: Date.now(),
                updatedAt: Date.now(),
                conversationName: `Created at ${new Date().toISOString()}`
            } satisfies UserDoc["conversations"][string]
        };

        const userRef = db.collection(UserCollectionId).doc(userId);


        batch.update(userRef, userUpdate);

        const conversationRef = db.collection(UserCollectionId)
            .doc(userId)
            .collection(ConversationsCollectionId)
            .doc(conversationId);
        
        batch.create(conversationRef, {
            messages: {},
        } satisfies ConversationsDoc);

        await batch.commit();
        
        return {
            messages: {},
        }
    }
    
    const conversationRef = db.collection(UserCollectionId)
        .doc(userId)
        .collection(ConversationsCollectionId)
        .doc(conversationId);

    const conversationDoc = await conversationRef.get();
    return conversationDoc.data() as ConversationsDoc;
}

async function addMessageToConversation(
    userId: string, 
    conversationId: string, 
    message: string,
    requestedCharacters: CharacterId[],
    userDoc: UserDoc
): Promise<ConversationMessage> {
    const conversationRef = db.collection(UserCollectionId)
        .doc(userId)
        .collection(ConversationsCollectionId)
        .doc(conversationId);

    const userMessage: ConversationMessage = {
        type: "user",
        lastUpdated: Date.now(),
        content: message,
        requestedCharacters: requestedCharacters.map((characterId) => ({
            characterId,
            characterName: (userDoc.characterDetails ?? characterDetails)[characterId].agentName
        }))
    };

    const messageId = randomUUID();
    await conversationRef.set({
        messages: {
            [messageId]: userMessage
        }
    }, { merge: true });

    return userMessage;
}

async function handleSingleAgentResponse(
    userId: string,
    conversationId: string,
    conversationDoc: ConversationsDoc,
    recentMessage: string,
    agentDetails: CharacterDetails
) {
    try {
        const messageId = randomUUID();
        const agentMessage: ConversationMessage = {
            type: "single-agent",
            lastUpdated: Date.now(),
            agentId: agentDetails.agentId as CharacterId,
            agentName: agentDetails.agentName,
            content: ""
        };

        const conversationRef = db.collection(UserCollectionId)
            .doc(userId)
            .collection(ConversationsCollectionId)
            .doc(conversationId);

        const previousMessages = Object.values(conversationDoc.messages)
            .sort((a, b) => a.lastUpdated - b.lastUpdated)
            .map((message) => {
                return {
                    role: message.type === "user" ? "user" : "assistant" as "user" | "assistant",
                    content: message.content
                }
            })
            .slice(-6);

        await getChatResponse(
            [
                ...previousMessages,
                {
                    role: "user",
                    content: recentMessage
                },
                {
                    role: "system",
                    content: agentDetails.systemPrompt + " Generate a markdown response. put code blocks in ```code``` tags."
                }
            ],
            agentDetails.model,
            async (chunk) => {
                agentMessage.content += chunk;
                agentMessage.lastUpdated = Date.now();
            
                await conversationRef
                    .set({
                        messages: {
                            [messageId]: agentMessage
                        }
                    }, { merge: true });
            }
        );
    } catch (error) {
        console.error('Error in stream processing:', error);
    }
}

async function handleAgentDebate(
    userId: string,
    conversationId: string,
    conversationDoc: ConversationsDoc,
    recentMessage: string,
    requestedAgentDetails: CharacterDetails[]
) {
    try {
        const agentDebateId = randomUUID();
        const messageId = randomUUID();

        // Create agent debate document
        const agentDebateDoc: AgentDebateDoc = {
            messages: {},
            state: "pending"
        };

        // Create conversation message
        const conversationMessage: ConversationMessage = {
            type: "agent-debate",
            lastUpdated: Date.now(),
            agentDebateId,
            content: ""
        };

        const conversationRef = db.collection(UserCollectionId)
            .doc(userId)
            .collection(ConversationsCollectionId)
            .doc(conversationId);

        const agentDebateRef = conversationRef
            .collection(AgentDebateCollectionId)
            .doc(agentDebateId);

        // Initialize both documents
        await Promise.all([
            agentDebateRef
                .set(agentDebateDoc),

            conversationRef
                .set({
                    messages: {
                        [messageId]: conversationMessage
                    }
                }, { merge: true })
        ]);

        const previousMessages: {
            role: "user" | "assistant",
            agentName?: string,
            content: string
        }[] = Object.values(conversationDoc.messages)
            .sort((a, b) => a.lastUpdated - b.lastUpdated)
            .map((message) => {
                return {
                    role: message.type === "user" ? "user" : "assistant" as "user" | "assistant",
                    content: message.content
                }
            })
            .slice(-6);

        previousMessages.push({
            role: "user",
            content: recentMessage
        });

        const rounds = 2;
        for (let round = 0; round < rounds; round++) {
            for (const agent of requestedAgentDetails) {
                const debateMessageId = randomUUID();
                const debateMessage: AgentMessage = {
                    createdAt: Date.now(),
                    lastUpdated: Date.now(),
                    order: round,
                    agentId: agent.agentId,
                    agentName: agent.agentName,
                    content: ""
                };

                let currentResponse = "";

                await getChatResponse(
                    [
                        ...previousMessages.map((message) => ({
                            role: message.agentName ? (
                                message.agentName === agent.agentName ? "assistant" : "user"
                            ) : message.role,
                            content: message.content
                        })),
                        {
                            role: "system",
                            content: agent.systemPrompt + " Generate a response in markdown format."
                        }
                    ],
                    agent.model,
                    async (chunk) => {
                        currentResponse += chunk;
                        debateMessage.content += chunk;
                        debateMessage.lastUpdated = Date.now();
                    
                        await agentDebateRef
                            .set({
                                messages: {
                                    [debateMessageId]: debateMessage
                                }
                            }, { merge: true });
                    }
                );

                previousMessages.push({
                    role: "assistant",
                    agentName: agent.agentName,
                    content: currentResponse
                });
            }
        }

        const replyerSystemPrompt = `
            You will be given a list of messages from the debate.
            Please be concise and to the point. If there are any details that are important such as steps or instructions.
            You should be a helpful assistant that replies to the user's message using the information from the debate.
            Use the information from the debate to answer the question that the user asked which is ${recentMessage}
        `;

        await getChatResponse(
            [
                ...previousMessages.filter((message) => !message.agentName).map((message) => ({
                    role: message.role,
                    content: message.content
                })),
                {
                    role: "user",
                    content: `Debate between the agents: ${JSON.stringify(previousMessages.filter((message) => message.agentName))}`
                },
                {
                    role: "system",
                    content: replyerSystemPrompt
                },
            ],
            "gpt-4o-mini",
            async (chunk) => {
                conversationMessage.content += chunk;
                conversationMessage.lastUpdated = Date.now();
            
                await conversationRef
                .set({
                    messages: {
                        [messageId]: conversationMessage
                    }
                }, { merge: true })
            }
        );

        // Update final state
        await agentDebateRef.update({ state: "completed" })

    } catch (error) {
        console.error('Error in debate processing:', error);
    } 
}

const defaultAgentDetails: CharacterDetails = {
    agentId: "Helpful Assistant",
    agentName: "Helpful Assistant",
    systemPrompt: "You are a helpful assistant.",
    model: "gpt-4o-mini"
}

async function getAgentDetails(agentIds: string[], userDoc: UserDoc): Promise<CharacterDetails[]> {
    if (agentIds.length === 0) {
        agentIds = ["Helpful Assistant"];
    }

    return agentIds.map((agentId) => {
        if ((userDoc.characterDetails ?? characterDetails)[agentId]) {
            return (userDoc.characterDetails ?? characterDetails)[agentId]
        }
        return defaultAgentDetails;
    });
}

export async function POST(req: Request) {
    const { message, conversationId, userAuthToken, requestedCharacterIds } = await req.json() as ApiMessageRequest;
    
    try {
        // Verify the user's auth token
        const decodedToken = await auth.verifyIdToken(userAuthToken);
        const userId = decodedToken.uid;

        if (!userId) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        // Ensure user document exists
        const userDoc = await getUserDoc(userId);

        // Get or create conversation
        const conversationDoc = await getOrCreateConversation(userId, userDoc, conversationId);

        // Add user message to conversation
        await addMessageToConversation(userId, conversationId, message, requestedCharacterIds || [], userDoc);

        const agentDetails = await getAgentDetails(requestedCharacterIds, userDoc);

        if (agentDetails.length <= 1) {
            await handleSingleAgentResponse(userId, conversationId, conversationDoc, message, agentDetails.at(0) ?? defaultAgentDetails);
        } else {
            await handleAgentDebate(userId, conversationId, conversationDoc, message, agentDetails);
        }

        const response: ApiMessageResponse = {
            success: true,
            conversationId,
        };

        return new Response(JSON.stringify(response), { status: 200 });

    } catch (error) {
        console.error('Error processing message:', error);
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
}