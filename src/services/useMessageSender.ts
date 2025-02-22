 
import { useCallback, useState } from "react";
import { getUserAuthToken } from "./firebase/init";
import { ApiMessageRequest } from "@/types/apiMessage";

export function useMessageSender(conversationId: string) {
  
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const sendMessage = useCallback(async ({
        text,
        requestedAgentIds,
    }: {
        text: string;
        requestedAgentIds: string[];
    }) => {
        if (loading) {
            return;
        }
        setLoading(true);
        setError(null);
        const userAuthToken = await getUserAuthToken();
        if (!userAuthToken) {
            setError(new Error("User not authenticated"));
            return;
        }
        try {
            const response = await fetch("/api/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    message: text,
                    conversationId,
                    userAuthToken,
                    requestedAgentIds,
                 } satisfies ApiMessageRequest),
            });
            const data = await response.json();
            console.log(data);
            // return data;
        } catch (err) {
            console.error(err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [setError, loading, setLoading, conversationId]);

    return {
        sendMessage,
        loading,
        error,
    }
}
