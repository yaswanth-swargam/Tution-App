import axios from '../lib/axios.js'

import {
  setSections,
  setMessages,
  addMessage,
  setMembers,
  setLoadingSections,
  setLoadingMessages,
  setLoadingMembers,
  setSendingMessage,
  setConversations,
  setSelectedDirectUser,
  setDirectMessages,
  addDirectMessage,
  setLoadingConversations,
  setLoadingDirectMessages,
  setSendingDirectMessage,
} from "./chatSlice.js";

export const fetchSections=()=>async (dispatch)=>{
    try{
        dispatch(setLoadingSections(true));

        const response=await axios.get('/sections');
        dispatch(setSections(response.data))
        
    }catch (error) {
    console.error(
      "Error fetching sections:",
      error.response?.data?.message || error.message
    );

  } finally {
    dispatch(setLoadingSections(false));
  }
}


export const fetchMessages=(sectionId)=>async(dispatch)=>{
    try{
        dispatch(setLoadingMessages(true));

        const response=await axios.get(`/messages/section/${sectionId}`);
        dispatch(setMessages(response.data));

    }
    catch(error){
        console.error('Error fetching messages',error.response?.data?.message || error.message)
    }
    finally{
        dispatch(setLoadingMessages(false));
    }
}

export const sendMessage =
  (sectionId, content) => async (dispatch) => {
    try {
      dispatch(setSendingMessage(true));

      await axios.post(
        `/messages/section/${sectionId}`,
        { content }
      );

    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data?.message || error.message
      );
    } finally {
      dispatch(setSendingMessage(false));
    }
  };


export const fetchSectionMembers = (sectionId) => async (dispatch) => {
  try {
    dispatch(setLoadingMembers(true));

    const response = await axios.get(
      `/sections/${sectionId}/members`
    );

    console.log("Section members:", response.data);

    dispatch(setMembers(response.data.members));

  } catch (error) {
    console.error(
      "Error fetching section members:",
      error.response?.data?.message || error.message
    );

    dispatch(setMembers([]));
  } finally {
    dispatch(setLoadingMembers(false));
  }
};



//direct messs

export const fetchDirectConversations = () => async (dispatch) => {
  try {
    dispatch(setLoadingConversations(true));

    const response = await axios.get(
      "/direct-messages/conversations"
    );

    dispatch(setConversations(response.data));

  } catch (error) {
    console.error(
      "Error fetching direct conversations:",
      error.response?.data?.message || error.message
    );

    dispatch(setConversations([]));

  } finally {
    dispatch(setLoadingConversations(false));
  }
};



export const fetchDirectMessages = (userId) => async (dispatch) => {
  try {
    dispatch(setLoadingDirectMessages(true));

    const response = await axios.get(
      `/direct-messages/${userId}`
    );

    dispatch(setDirectMessages(response.data.messages));

  } catch (error) {
    console.error(
      "Error fetching direct messages:",
      error.response?.data?.message || error.message
    );

    dispatch(setDirectMessages([]));

  } finally {
    dispatch(setLoadingDirectMessages(false));
  }
};




export const sendDirectMessage =
  (receiverId, content) => async (dispatch) => {
    try {
      dispatch(setSendingDirectMessage(true));

      const response = await axios.post(
        `/direct-messages/${receiverId}`,
        { content }
      );

      dispatch(addDirectMessage(response.data.data));

      // Refresh conversation list so new conversations appear
      dispatch(fetchDirectConversations());

    } catch (error) {
      console.error(
        "Error sending direct message:",
        error.response?.data?.message || error.message
      );

    } finally {
      dispatch(setSendingDirectMessage(false));
    }
  };