import axiosInstance from "./axios";

export const uploadFile = async (file) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axiosInstance.post(
    "/uploads",
    formData
  );

  return response.data.file;
};