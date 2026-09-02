import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  studyMaterials: [],

  isLoadingMaterials: false,
  isCreatingMaterial: false,
  isUpdatingMaterial: false,
  isDeletingMaterial: false,
};

const studyMaterialSlice = createSlice({
  name: "studyMaterial",

  initialState,

  reducers: {
    setStudyMaterials: (state, action) => {
      state.studyMaterials = action.payload;
    },

    setLoadingMaterials: (state, action) => {
      state.isLoadingMaterials = action.payload;
    },

    setCreatingMaterial: (state, action) => {
      state.isCreatingMaterial = action.payload;
    },

    setUpdatingMaterial: (state, action) => {
      state.isUpdatingMaterial = action.payload;
    },

    setDeletingMaterial: (state, action) => {
      state.isDeletingMaterial = action.payload;
    },
  },
});

export const {
  setStudyMaterials,
  setLoadingMaterials,
  setCreatingMaterial,
  setUpdatingMaterial,
  setDeletingMaterial,
} = studyMaterialSlice.actions;

export default studyMaterialSlice.reducer;