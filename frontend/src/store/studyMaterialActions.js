import api from "../lib/axios.js";

import {
  setStudyMaterials,
  setLoadingMaterials,
  setCreatingMaterial,
  setUpdatingMaterial,
  setDeletingMaterial,
} from "./studyMaterialSlice.js";



// ==========================================
// FETCH SECTION MATERIALS
// ==========================================

export const fetchSectionMaterials =
  (sectionId) => async (dispatch) => {
    dispatch(setLoadingMaterials(true));

    try {
      const response = await api.get(
        `/study-materials/section/${sectionId}`
      );

      dispatch(
        setStudyMaterials(response.data)
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error fetching study materials:",
        error
      );

      throw error;
    } finally {
      dispatch(setLoadingMaterials(false));
    }
  };


// ==========================================
// CREATE STUDY MATERIAL
// ==========================================

export const createStudyMaterial =
  (sectionId, materialData) => async (dispatch) => {
    dispatch(setCreatingMaterial(true));

    try {
      const response = await api.post(
        `/study-materials/section/${sectionId}`,
        materialData
      );

      // Refresh the materials list
      // after successful creation
      dispatch(
        fetchSectionMaterials(sectionId)
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error creating study material:",
        error
      );

      throw error;
    } finally {
      dispatch(setCreatingMaterial(false));
    }
  };

// ==========================================
// UPDATE STUDY MATERIAL
// ==========================================

export const updateStudyMaterial =
  (materialId, materialData) => async (dispatch) => {
    dispatch(setUpdatingMaterial(true));

    try {
      const response = await api.put(
        `/study-materials/${materialId}`,
        materialData
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error updating study material:",
        error
      );

      throw error;
    } finally {
      dispatch(setUpdatingMaterial(false));
    }
  };


// ==========================================
// DELETE STUDY MATERIAL
// ==========================================

export const deleteStudyMaterial =
  (materialId) => async (dispatch) => {
    dispatch(setDeletingMaterial(true));

    try {
      const response = await api.delete(
        `/study-materials/${materialId}`
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error deleting study material:",
        error
      );

      throw error;
    } finally {
      dispatch(setDeletingMaterial(false));
    }
  };


  // ==========================================
// FETCH ALL ACCESSIBLE MATERIALS
// ==========================================

export const fetchAccessibleStudyMaterials =
  () => async (dispatch) => {
    dispatch(setLoadingMaterials(true));

    try {
      const response = await api.get(
        "/study-materials"
      );

      dispatch(
        setStudyMaterials(response.data)
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error fetching accessible study materials:",
        error
      );

      throw error;
    } finally {
      dispatch(
        setLoadingMaterials(false)
      );
    }
  };