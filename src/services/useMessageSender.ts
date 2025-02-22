/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from "react";

export function useMessageSender(conversationId: string) {
  
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const sendMessage = useCallback(async (message: string) => {
        if (loading) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    message,
                    conversationId,
                 }),
            });
            const data = await response.json();
            // return data;
        } catch (err) {
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
