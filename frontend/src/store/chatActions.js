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
  setAvailableStudents,
  setLoadingAvailableStudents,
  setAddingStudent,
  setRemovingStudent,
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

      const response = await axios.post(
        `/messages/section/${sectionId}`,
        { content }
      );

      console.log(
        "✅ MESSAGE SAVED:",
        response.data
      );

    } catch (error) {
      console.error(
        "❌ Error sending message:",
        error.response?.data?.message ||
          error.message
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

      await axios.post(
        `/direct-messages/${receiverId}`,
        { content }
      );

      // Refresh conversations so the latest conversation
      // moves to the top
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




  export const fetchAvailableStudents = (sectionId) => async (dispatch) => {
  try {
    dispatch(setLoadingAvailableStudents(true));

    const response = await axios.get(
      `/sections/${sectionId}/available-students`
    );

    dispatch(setAvailableStudents(response.data));
  } catch (error) {
    console.error(
      "Error fetching available students:",
      error.response?.data?.message || error.message
    );
  } finally {
    dispatch(setLoadingAvailableStudents(false));
  }
};




export const addStudentToSection =
  (sectionId, userId) => async (dispatch) => {
    try {
      dispatch(setAddingStudent(true));

      await axios.post(
        `/sections/${sectionId}/members`,
        { userId }
      );

      // Refresh members and available students
      dispatch(fetchSectionMembers(sectionId));
      dispatch(fetchAvailableStudents(sectionId));

    } catch (error) {
      console.error(
        "Error adding student:",
        error.response?.data?.message || error.message
      );
    } finally {
      dispatch(setAddingStudent(false));
    }
  };




  export const removeStudentFromSection =
  (sectionId, userId) => async (dispatch) => {
    try {
      dispatch(setRemovingStudent(true));

      await axios.delete(
        `/sections/${sectionId}/members/${userId}`
      );

      // Refresh members and available students
      dispatch(fetchSectionMembers(sectionId));
      dispatch(fetchAvailableStudents(sectionId));

    } catch (error) {
      console.error(
        "Error removing student:",
        error.response?.data?.message || error.message
      );
    } finally {
      dispatch(setRemovingStudent(false));
    }
  };






export const createSection =
  (name) => async (dispatch) => {
    try {
      const response = await axios.post(
        "/sections",
        { name }
      );

      dispatch(fetchSections());

      return response.data.section;

    } catch (error) {
      console.error(
        "Error creating section:",
        error.response?.data?.message ||
          error.message
      );

      throw error;
    }
  };






  export const renameSection =
  (sectionId, name) =>
  async (dispatch) => {
    try {
      const response = await axios.put(
        `/sections/${sectionId}`,
        { name }
      );

      dispatch(fetchSections());

      return response.data.section;

    } catch (error) {
      console.error(
        "Error renaming section:",
        error.response?.data?.message ||
          error.message
      );

      throw error;
    }
  };



export const deleteSection =
  (sectionId) => async (dispatch) => {
    try {
      await axios.delete(
        `/sections/${sectionId}`
      );

      // Refresh sections
      dispatch(fetchSections());

      return true;

    } catch (error) {
      console.error(
        "Error deleting section:",
        error.response?.data?.message ||
          error.message
      );

      throw error;
    }
  };