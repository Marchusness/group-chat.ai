import { useEffect, useState } from "react";
import { firestore } from "./init";
import { AgentDebateCollectionId, AgentDebateDoc } from "@/types/agentDebateDoc";
import { doc, onSnapshot } from "@firebase/firestore";
import { ConversationsCollectionId, ConversationsDoc } from "@/types/conversationsDoc";
import { UserCollectionId, UserDoc } from "@/types/userDoc";

export function useDoc<T>(path: string): T | null {
  const [docData, setDocData] = useState<T | null>(null);

  useEffect(() => {
    if (!path) {
      setDocData(null);
      return;
    };

    const docRef = doc(firestore, path);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      setDocData(doc.data() as T);
    });
    return () => unsubscribe();
  }, [path]);

  return docData;
}


export function useUserDocData(userId: string | undefined): UserDoc | null {
  const path = `${UserCollectionId}/${userId}`;
  return useDoc<UserDoc>(path);
}


export function useConversation(userId: string | undefined, conversationId: string | undefined): ConversationsDoc | null {
  const path = `${UserCollectionId}/${userId}/${ConversationsCollectionId}/${conversationId}`;
  return useDoc<ConversationsDoc>(path);
}


export function useAgentDebate(userId: string | undefined, conversationId: string | undefined, agentDebateId: string | undefined): AgentDebateDoc | null {
  const path = `${UserCollectionId}/${userId}/${ConversationsCollectionId}/${conversationId}/${AgentDebateCollectionId}/${agentDebateId}`;
  return useDoc<AgentDebateDoc>(path);
}