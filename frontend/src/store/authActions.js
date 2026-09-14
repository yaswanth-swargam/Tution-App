import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

import {
  setAuthUser,
  setCheckingAuth,
  setLoggingIn,
  setSigningUp,
  setUpdatingProfile,
} from "./authSlice";

// ===============================
// Check Authentication
// ===============================
export const checkAuth = () => async (dispatch) => {
  dispatch(setCheckingAuth(true));

  try {
    const res = await axiosInstance.get("/auth/checkAuth");

    dispatch(setAuthUser(res.data));
  } catch (error) {
    dispatch(setAuthUser(null));
  } finally {
    dispatch(setCheckingAuth(false));
  }
};

// ===============================
// Login
// ===============================
export const login = (data) => async (dispatch) => {
  dispatch(setLoggingIn(true));

  try {
    const res = await axiosInstance.post("/auth/signin", data);

    dispatch(setAuthUser(res.data));

    toast.success("Logged in successfully");
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
  } finally {
    dispatch(setLoggingIn(false));
  }
};


// ===============================
// Logout
// ===============================
export const logout = () => async (dispatch) => {
  try {
    await axiosInstance.post("/auth/logout");

    dispatch(setAuthUser(null));

    toast.success("Logged out successfully");
  } catch (error) {
    toast.error(error.response?.data?.message || "Logout failed");
  }
};

// ===============================
// Update Profile
// ===============================
export const updateProfile = (data) => async (dispatch) => {
  dispatch(setUpdatingProfile(true));

  try {
    const res = await axiosInstance.put("/auth/update-profile", data);

    dispatch(setAuthUser(res.data));

    toast.success("Profile updated successfully");
  } catch (error) {
    toast.error(error.response?.data?.message || "Update failed");
  } finally {
    dispatch(setUpdatingProfile(false));
  }
};


// ===============================
// Create User - Admin Only
// ===============================
export const createUser = (data) => async (dispatch) => {
  try {
    const res = await axiosInstance.post("/auth/create-user", data);

    toast.success(res.data.message);

    return res.data;
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to create user"
    );

    throw error;
  }
};