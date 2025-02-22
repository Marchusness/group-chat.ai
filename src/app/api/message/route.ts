import { ApiMessageRequest, ApiMessageResponse } from "@/types/apiMessage";
import { initializeFirebaseAdmin } from "@/services/firebase/adminInit";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { UserDoc, UserCollectionId } from "@/types/userDoc";
import { ConversationsCollectionId, ConversationMessage, ConversationsDoc } from "@/types/conversationsDoc";
import { AgentDebateDoc, AgentDebateCollectionId } from "@/types/agentDebateDoc";
import { randomUUID } from "crypto";

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
        await userRef.set({ conversations: {} } as UserDoc);
        return { conversations: {} };
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
                conversationName: `Conversation ${new Date().toLocaleDateString()}`
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
    requestedAgents: string[]
): Promise<ConversationMessage> {
    const conversationRef = db.collection(UserCollectionId)
        .doc(userId)
        .collection(ConversationsCollectionId)
        .doc(conversationId);

    const userMessage: ConversationMessage = {
        type: "user",
        lastUpdated: Date.now(),
        content: message,
        requestedAgents
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
    agentDetails: AgentDetails
) {
    try {
        const messageId = randomUUID();
        const agentMessage: ConversationMessage = {
            type: "single-agent",
            lastUpdated: Date.now(),
            agentId: agentDetails.agentId,
            agentName: agentDetails.agentName,
            content: ""
        };

        // Simulate streaming response (replace with actual AI implementation)
        const response = "This is a simulated response from the helpful assistant.";
        for (const chunk of response.split(" ")) {            
            // Update the message content
            agentMessage.content += chunk + " ";
            
            // Update the conversation document
            await db.collection(UserCollectionId)
                .doc(userId)
                .collection(ConversationsCollectionId)
                .doc(conversationId)
                .set({
                    messages: {
                        [messageId]: agentMessage
                    }
                }, { merge: true });
        }
    } catch (error) {
        console.error('Error in stream processing:', error);
    }
}

async function handleAgentDebate(
    userId: string,
    conversationId: string,
    conversationDoc: ConversationsDoc,
    message: string,
    requestedAgentDetails: AgentDetails[]
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
        const debateMessage: ConversationMessage = {
            type: "agent-debate",
            lastUpdated: Date.now(),
            agentDebateId,
            content: ""
        };

        // Initialize both documents
        await Promise.all([
            db.collection(UserCollectionId)
                .doc(userId)
                .collection(ConversationsCollectionId)
                .doc(conversationId)
                .collection(AgentDebateCollectionId)
                .doc(agentDebateId)
                .set(agentDebateDoc),

            db.collection(UserCollectionId)
                .doc(userId)
                .collection(ConversationsCollectionId)
                .doc(conversationId)
                .set({
                    messages: {
                        [messageId]: debateMessage
                    }
                }, { merge: true })
        ]);

        // Simulate debate (replace with actual implementation)
        let debateContent = "";
        const rounds = 2;
        for (let round = 0; round < rounds; round++) {
            for (const agent of requestedAgentDetails) {
                const agentMessage = `${agent.agentName}'s response for round ${round + 1}. `;
                debateContent += agentMessage;
                
                // Update debate message
                debateMessage.content = debateContent;
                // Update debate message
                debateMessage.content = debateContent;
                await db.collection(UserCollectionId)
                    .doc(userId)
                    .collection(ConversationsCollectionId)
                    .doc(conversationId)
                    .set({
                        messages: {
                            [messageId]: debateMessage
                        }
                    }, { merge: true });
            }
        }

        // Add summary
        const summary = "\n\nDebate Summary: This is a simulated summary of the debate.";
        debateMessage.content += summary;

        // Update final state
        await Promise.all([
            db.collection(UserCollectionId)
                .doc(userId)
                .collection(ConversationsCollectionId)
                .doc(conversationId)
                .collection(AgentDebateCollectionId)
                .doc(agentDebateId)
                .update({ state: "completed" }),

            db.collection(UserCollectionId)
                .doc(userId)
                .collection(ConversationsCollectionId)
                .doc(conversationId)
                .set({
                    messages: {
                        [messageId]: debateMessage
                    }
                }, { merge: true })
        ]);

    } catch (error) {
        console.error('Error in debate processing:', error);
    } 
}

type AgentDetails = {
    agentId: string;
    agentName: string;
    systemPrompt: string;
    model: string;
}

const defaultAgentDetails: AgentDetails = {
    agentId: "default-assistant",
    agentName: "Helpful Assistant",
    systemPrompt: "You are a helpful assistant.",
    model: "gpt-4o-mini"
}

async function getAgentDetails(agentIds: string[]): Promise<AgentDetails[]> {
    if (agentIds.length === 0) {
        agentIds = ["default-assistant"];
    }

    return agentIds.map((agentId) => {
        switch (agentId) {
            case "default-assistant":
                return defaultAgentDetails;
            default:
                return {
                    agentId: agentId,
                    agentName: "Unknown Agent",
                    systemPrompt: "You are a helpful assistant.",
                    model: "gpt-4o-mini"
                };
        }
    });
}

export async function POST(req: Request) {
    const { message, conversationId, userAuthToken, requestedAgentIds } = await req.json() as ApiMessageRequest;
    
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
        await addMessageToConversation(userId, conversationId, message, requestedAgentIds || []);

        const agentDetails = await getAgentDetails(requestedAgentIds);

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