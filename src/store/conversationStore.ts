import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface ConversationState {
  currentConversationId: string | null
  agentDebateId: string | null

  openConversation: (conversationId: string) => void
  openAgentDebate: (agentDebateId: string) => void
  closeAgentDebate: () => void
}

export const useConversationStore = create<ConversationState>()(
  immer((set) => ({
    currentConversationId: null,
    agentDebateId: null,

    openConversation: (conversationId: string) => {
      set((state: ConversationState) => {
        state.currentConversationId = conversationId
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
