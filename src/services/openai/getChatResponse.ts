import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function getChatResponse(
    messages: {
        role: "user" | "assistant" | "system",
        content: string,
    }[],
    model: string,
    onChunk: (chunk: string) => Promise<void>,
) {

    console.log({
        info: "chat gpt request",
        messages: messages,
        model: model,
    }); 
    
    const response = await openai.chat.completions.create({
        model: model,
        messages: messages,
        stream: true,
    });

    let buffer = '';
    let processing = false;
    let processPromise = Promise.resolve();

    const tryProcessBuffer = async () => {
        // get mutex
        if (processing) {
            return;
        }
        processing = true;

        // Get the current buffer
        const currentBuffer = buffer;
        buffer = '';

        // If there's any content in the buffer, process it
        if (currentBuffer) {
            processPromise = onChunk(currentBuffer);
            await processPromise;
        }

        // release mutex
        processing = false;
    };

    for await (const chunk of response) {
        const content = chunk.choices[0].delta.content || "";
        if (content) {
            // Add the chunk to the buffer
            buffer += content;
            // Try to process the buffer without waiting
            tryProcessBuffer();
        }
    }

    // Process any remaining content
    await processPromise;
    await tryProcessBuffer();
}