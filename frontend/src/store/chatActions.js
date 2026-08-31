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
  setUnreadSectionCount,
  setUnreadSectionCounts,
  clearUnreadSectionCount,
  setLoadingUnreadSections,
} from "./chatSlice.js";

export const fetchSections=()=>async (dispatch)=>{
    try{
        dispatch(setLoadingSections(true));

        const response=await axios.get('/sections');
  dispatch(setSections(response.data));

  dispatch(fetchAllUnreadSectionMessages());        
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

// export const sendMessage =
//   (sectionId, content) => async (dispatch) => {
//     try {
//       dispatch(setSendingMessage(true));

//       const response = await axios.post(
//         `/messages/section/${sectionId}`,
//         { content }
//       );

//       console.log(
//         "✅ MESSAGE SAVED:",
//         response.data
//       );

//     } catch (error) {
//       console.error(
//         "❌ Error sending message:",
//         error.response?.data?.message ||
//           error.message
//       );

//     } finally {
//       dispatch(setSendingMessage(false));
//     }
//   };



export const sendMessage =
  (sectionId, messageData) =>
  async (dispatch) => {
    try {
      dispatch(setSendingMessage(true));
      console.log(
  "🚀 SENDING TO BACKEND:",
  messageData
);
      await axios.post(
        `/messages/section/${sectionId}`,
        messageData
      );

    } catch (error) {
      console.error(
        "❌ Error sending message:",
        error.response?.data?.message ||
          error.message
      );

      throw error;

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

    console.log(
      "👥 MEMBERS API RESPONSE:",
      response.data
    );

    dispatch(setMembers(response.data.members));

  } catch (error) {
    console.error(
      "Error fetching section members:",
      error.response?.data?.message ||
        error.message
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
  (receiverId, messageData) =>
  async (dispatch) => {
    try {
      dispatch(setSendingDirectMessage(true));

      console.log(
        "📡 Sending request to backend:",
        messageData
      );

      const response = await axios.post(
        `/direct-messages/${receiverId}`,
        messageData
      );

      console.log(
        "✅ Backend response:",
        response.data
      );

      dispatch(fetchDirectConversations());

      return response.data;

    } catch (error) {
      console.error(
        "❌ Error sending direct message:",
        error.response?.data?.message ||
        error.message
      );

      throw error;

    } finally {
      console.log(
        "🔄 Resetting sending state"
      );

      dispatch(
        setSendingDirectMessage(false)
      );
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




  // ==========================================
// FETCH UNREAD SECTION MESSAGES
// ==========================================

export const fetchUnreadSectionMessages =
  (sectionId) => async (dispatch) => {
    try {
      const response = await axios.get(
        `/messages/section/${sectionId}/unread`
      );

      dispatch(
        setUnreadSectionCount({
          sectionId,
          count: response.data.unreadCount,
        })
      );

      return response.data;

    } catch (error) {
      console.error(
        "Error fetching unread section messages:",
        error.response?.data?.message ||
          error.message
      );

      return null;
    }
  };


// ==========================================
// FETCH UNREAD COUNTS FOR ALL SECTIONS
// ==========================================

export const fetchAllUnreadSectionMessages =
  () => async (dispatch, getState) => {
    try {
      dispatch(setLoadingUnreadSections(true));

      const sections =
        getState().chat.sections || [];

      const results = await Promise.all(
        sections.map(async (section) => {
          try {
            const response = await axios.get(
              `/messages/section/${section.id}/unread`
            );

            return {
              sectionId: section.id,
              count: response.data.unreadCount,
            };

          } catch (error) {
            console.error(
              `Error fetching unread count for section ${section.id}:`,
              error.response?.data?.message ||
                error.message
            );

            return {
              sectionId: section.id,
              count: 0,
            };
          }
        })
      );

      const unreadCounts = {};

      results.forEach(
        ({ sectionId, count }) => {
          unreadCounts[sectionId] = count;
        }
      );

      dispatch(
        setUnreadSectionCounts(
          unreadCounts
        )
      );

      return unreadCounts;

    } finally {
      dispatch(
        setLoadingUnreadSections(false)
      );
    }
  };


// ==========================================
// MARK SECTION MESSAGES AS READ
// ==========================================

export const markSectionMessagesAsRead =
  (sectionId) => async (dispatch) => {
    try {
      const response = await axios.put(
        `/messages/section/${sectionId}/read`
      );

      dispatch(
        clearUnreadSectionCount(sectionId)
      );

      return response.data;

    } catch (error) {
      console.error(
        "Error marking section messages as read:",
        error.response?.data?.message ||
          error.message
      );

      throw error;
    }
  };