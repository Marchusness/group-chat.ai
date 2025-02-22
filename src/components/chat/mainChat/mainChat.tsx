import { AgentConversation } from "./agentConversation/agentConversation";

export function MainChat() {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col">
        <div>
          <h1>This is the chat history</h1>
        </div>

        <div>
          <h1>This is the chat input</h1>
        </div>
      </div>

      <AgentConversation />


    </div>
  );
}