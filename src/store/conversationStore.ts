import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface ConversationState {
  currentConversationId: string
  agentDebateId: string | null

  openConversation: (conversationId: string | null) => void
  openAgentDebate: (agentDebateId: string) => void
  closeAgentDebate: () => void
}

export const useConversationStore = create<ConversationState>()(
  immer((set) => ({
    currentConversationId: uuidv4(),
    agentDebateId: null,

    openConversation: (conversationId: string | null) => {
      set((state: ConversationState) => {
        state.currentConversationId = conversationId ?? uuidv4()
        state.agentDebateId = null
      })
    },

    openAgentDebate: (agentDebateId: string) => {
      set((state: ConversationState) => {
        state.agentDebateId = agentDebateId
      })
    },

    closeAgentDebate: () => {
      set((state: ConversationState) => {
        state.agentDebateId = null
      })
    },
  }))
)
