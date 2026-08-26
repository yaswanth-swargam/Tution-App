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



  availableStudents: [],
isLoadingAvailableStudents: false,
isAddingStudent: false,
isRemovingStudent: false,

    onlineUsers: [],
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
  const incomingMessage = action.payload;

  const alreadyExists = state.directMessages.some(
    (message) => Number(message.id) === Number(incomingMessage.id)
  );

  if (!alreadyExists) {
    state.directMessages.push(incomingMessage);
  }
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



setAvailableStudents: (state, action) => {
  state.availableStudents = action.payload;
},

setLoadingAvailableStudents: (state, action) => {
  state.isLoadingAvailableStudents = action.payload;
},

setAddingStudent: (state, action) => {
  state.isAddingStudent = action.payload;
},

setRemovingStudent: (state, action) => {
  state.isRemovingStudent = action.payload;
},

  setOnlineUsers: (state, action) => {
  state.onlineUsers = action.payload;
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


  setAvailableStudents,
setLoadingAvailableStudents,
setAddingStudent,
setRemovingStudent,
    setOnlineUsers,
} = chatSlice.actions;

export default chatSlice.reducer;