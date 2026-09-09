
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  currentConversationId: null,
  messages: [],

  isLoadingConversations: false,
  isLoadingConversation: false,
  isSendingMessage: false,

  error: null,
};

const aiSlice = createSlice({
  name: "ai",

  initialState,

  reducers: {
    // ===============================
    // Conversations
    // ===============================

    setConversations: (state, action) => {
      state.conversations = action.payload;
    },

    addConversation: (state, action) => {
      state.conversations.unshift(action.payload);
    },

    removeConversation: (state, action) => {
      state.conversations = state.conversations.filter(
        (conversation) => conversation.id !== action.payload
      );
    },

    updateConversation: (state, action) => {
      const { id, updates } = action.payload;

      const conversation = state.conversations.find(
        (item) => item.id === id
      );

      if (conversation) {
        Object.assign(conversation, updates);
      }
    },

    // ===============================
    // Current Conversation
    // ===============================

    setCurrentConversation: (state, action) => {
      state.currentConversationId = action.payload;
      state.messages = [];
      state.error = null;
    },

    clearCurrentConversation: (state) => {
      state.currentConversationId = null;
      state.messages = [];
      state.error = null;
    },

    // ===============================
    // Messages
    // ===============================

    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    // ===============================
    // Loading States
    // ===============================

    setLoadingConversations: (state, action) => {
      state.isLoadingConversations = action.payload;
    },

    setLoadingConversation: (state, action) => {
      state.isLoadingConversation = action.payload;
    },

    setSendingMessage: (state, action) => {
      state.isSendingMessage = action.payload;
    },

    // ===============================
    // Error
    // ===============================

    setAIError: (state, action) => {
      state.error = action.payload;
    },

    clearAIError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setConversations,
  addConversation,
  removeConversation,
  updateConversation,

  setCurrentConversation,
  clearCurrentConversation,

  setMessages,
  addMessage,

  setLoadingConversations,
  setLoadingConversation,
  setSendingMessage,

  setAIError,
  clearAIError,
} = aiSlice.actions;

export default aiSlice.reducer;
