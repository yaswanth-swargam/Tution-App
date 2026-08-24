import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sections: [],
  selectedSection: null,
  messages: [],
  members:[],

  isLoadingSections: false,
  isLoadingMessages: false,
  isSendingMessage: false,
  isLoadingMembers: false,


  conversations: [],
  selectedDirectUser: null,
  directMessages: [],

  isLoadingConversations: false,
  isLoadingDirectMessages: false,
  isSendingDirectMessage: false,
};

const chatSlice = createSlice({
  name: "chat",

  initialState,

  reducers: {
    setSections: (state, action) => {
      state.sections = action.payload;
    },

    setSelectedSection: (state, action) => {
      state.selectedSection = action.payload;
    },

    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    setLoadingSections: (state, action) => {
      state.isLoadingSections = action.payload;
    },

    setLoadingMessages: (state, action) => {
      state.isLoadingMessages = action.payload;
    },

    setSendingMessage: (state, action) => {
      state.isSendingMessage = action.payload;
    },
    setMembers: (state, action) => {
  state.members = action.payload;
},

setLoadingMembers: (state, action) => {
  state.isLoadingMembers = action.payload;
},


setConversations: (state, action) => {
  state.conversations = action.payload;
},

setSelectedDirectUser: (state, action) => {
  state.selectedDirectUser = action.payload;
},

setDirectMessages: (state, action) => {
  state.directMessages = action.payload;
},

addDirectMessage: (state, action) => {
  state.directMessages.push(action.payload);
},

setLoadingConversations: (state, action) => {
  state.isLoadingConversations = action.payload;
},

setLoadingDirectMessages: (state, action) => {
  state.isLoadingDirectMessages = action.payload;
},

setSendingDirectMessage: (state, action) => {
  state.isSendingDirectMessage = action.payload;
},
  },
});

export const {
  setSections,
  setSelectedSection,
  setMessages,
  addMessage,
  setLoadingSections,
  setLoadingMessages,
  setSendingMessage,
  setLoadingMembers,
  setMembers,
  setConversations,
  setSelectedDirectUser,
  setDirectMessages,
  addDirectMessage,
  setLoadingConversations,
  setLoadingDirectMessages,
  setSendingDirectMessage,
} = chatSlice.actions;

export default chatSlice.reducer;