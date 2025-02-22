import { useEffect, useState } from "react";
import { firestore } from "./init";
import { AgentDebateDoc } from "@/types/agentDebateDoc";
import { collection, doc, onSnapshot } from "@firebase/firestore";

export function useAgentDebate(userId: string | undefined, conversationId: string | undefined, agentDebateId: string | undefined): AgentDebateDoc | null {
  const [agentDebate, setAgentDebate] = useState<AgentDebateDoc | null>(null);

  useEffect(() => {
    if (!userId || !conversationId || !agentDebateId) {
        setAgentDebate(null);
        return;
    };

    const agentDebateRef = doc(collection(firestore, `Users/${userId}/Conversations/${conversationId}/AgentDebate/${agentDebateId}`));
    const unsubscribe = onSnapshot(agentDebateRef, (doc) => {
      setAgentDebate(doc.data() as AgentDebateDoc);
    });
    return () => unsubscribe();
  }, [userId, conversationId, agentDebateId]);

  return agentDebate;
}