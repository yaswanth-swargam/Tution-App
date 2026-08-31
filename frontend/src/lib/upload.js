import axiosInstance from "./axios";

export const uploadFile = async (
  file,
  onProgress
) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axiosInstance.post(
    "/uploads",
    formData,
    {
      onUploadProgress: (progressEvent) => {
        if (
          progressEvent.total &&
          onProgress
        ) {
          const progress = Math.round(
            (progressEvent.loaded * 100) /
              progressEvent.total
          );

          onProgress(progress);
        }
      },
    }
  );

  return response.data.file;
};