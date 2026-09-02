// import { useRef, useState } from "react";
// import {
//   Send,
//   Paperclip,
//   X,
//   File,
// } from "lucide-react";

// import { uploadFile } from "../../lib/upload.js";

// const MessageInput = ({
//   content,
//   onContentChange,
//   onSendMessage,
//   isSendingMessage,
// }) => {
//   const fileInputRef = useRef(null);

//   const [selectedFile, setSelectedFile] =
//     useState(null);

//   const [isUploading, setIsUploading] =
//     useState(false);
  
//   const [uploadProgress, setUploadProgress] =
//   useState(0);

//   const handleFileChange = (e) => {
//   const file = e.target.files?.[0];

//   if (!file) return;

//   setSelectedFile(file);
//   setUploadProgress(0);
// };

//   const removeFile = () => {
//     setSelectedFile(null);

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       (!content.trim() && !selectedFile) ||
//       isSendingMessage ||
//       isUploading
//     ) {
//       return;
//     }

//     try {
//       let uploadedFileData = null;

//       // Upload file first
//       if (selectedFile) {
//         setIsUploading(true);

//         // uploadedFileData =
//         //   await uploadFile(selectedFile);

//         setUploadProgress(0);

// uploadedFileData = await uploadFile(
//   selectedFile,
//   (progress) => {
//     setUploadProgress(progress);
//   }
// );
//       }

//       console.log(
//   "📁 UPLOAD RESPONSE:",
//   uploadedFileData
// );

//       // Build message object
//       const messageData = {
//         content: content.trim(),

//         ...(uploadedFileData && {
//           file_url: uploadedFileData.url,
//     file_public_id: uploadedFileData.public_id,
//     file_name: uploadedFileData.file_name,
//     file_type: uploadedFileData.file_type,
//     file_size: uploadedFileData.file_size,
//         }),
//       };

//       await onSendMessage(messageData);

//       // Clear input
//       onContentChange("");

//       removeFile();

//     } catch (error) {
//       console.error(
//         "Failed to send message:",
//         error
//       );

//     } finally {
//       setIsUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   const isDisabled =
//     isSendingMessage || isUploading;

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="
//         shrink-0
//         border-t
//         border-base-300
//         bg-base-100
//         px-4
//         py-3
//         md:px-6
//       "
//     >
//       {/* FILE PREVIEW */}

//       {selectedFile && (
//   <div
//     className="
//       mb-3
//       rounded-lg
//       bg-base-200
//       px-3
//       py-2
//     "
//   >
//     <div className="flex items-center justify-between gap-3">
//       <div className="flex min-w-0 items-center gap-2">
//         <File className="h-5 w-5 shrink-0 text-primary" />

//         <span className="truncate text-sm">
//           {selectedFile.name}
//         </span>
//       </div>

//       <button
//         type="button"
//         onClick={removeFile}
//         disabled={isDisabled}
//         className="
//           btn
//           btn-ghost
//           btn-xs
//           btn-circle
//           shrink-0
//         "
//         aria-label="Remove file"
//       >
//         <X className="h-4 w-4" />
//       </button>
//     </div>

//     {isUploading && (
//       <div className="mt-2 flex items-center gap-3">
//         <progress
//           className="progress progress-primary h-2 flex-1"
//           value={uploadProgress}
//           max="100"
//         />

//         <span className="w-10 text-right text-xs text-base-content/60">
//           {uploadProgress}%
//         </span>
//       </div>
//     )}
//   </div>
// )}

//       <div className="flex items-center gap-2">

//         {/* HIDDEN FILE INPUT */}

//         <input
//           ref={fileInputRef}
//           type="file"
//           onChange={handleFileChange}
//           className="hidden"
//           disabled={isDisabled}
//         />

//         {/* ATTACH BUTTON */}

//         <button
//           type="button"
//           onClick={() =>
//             fileInputRef.current?.click()
//           }
//           disabled={isDisabled}
//           className="
//             btn
//             btn-ghost
//             btn-square
//             shrink-0
//           "
//           aria-label="Attach file"
//         >
//           <Paperclip className="h-5 w-5" />
//         </button>

//         {/* MESSAGE INPUT */}

//         <input
//           type="text"
//           value={content}
//           onChange={(e) =>
//             onContentChange(e.target.value)
//           }
//           placeholder="Type a message..."
//           disabled={isDisabled}
//           className="
//             input
//             input-bordered
//             min-w-0
//             flex-1
//             text-sm
//             md:text-base
//           "
//         />

//         {/* SEND */}

//         <button
//           type="submit"
//           disabled={
//             isDisabled ||
//             (!content.trim() && !selectedFile)
//           }
//           className="
//             btn
//             btn-primary
//             btn-square
//             shrink-0
//           "
//           aria-label="Send message"
//         >
//           {isUploading || isSendingMessage ? (
//             <span className="
//               loading
//               loading-spinner
//               loading-sm
//             " />
//           ) : (
//             <Send className="h-5 w-5" />
//           )}
//         </button>

//       </div>
//     </form>
//   );
// };

// export default MessageInput;









import { useRef, useState } from "react";
import {
  Send,
  Paperclip,
  X,
  File,
} from "lucide-react";

import { uploadFile } from "../../lib/upload.js";

const MessageInput = ({
  content,
  onContentChange,
  onSendMessage,
  isSendingMessage,
  authUser,
}) => {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [isUploading, setIsUploading] =
    useState(false);

  const [uploadProgress, setUploadProgress] =
    useState(0);

  // ==========================================
  // ADMIN MATERIAL OPTION
  // ==========================================

  const [saveToMaterials, setSaveToMaterials] =
    useState(false);

  const isAdmin =
    authUser?.role === "admin";


  // ==========================================
  // FILE SELECT
  // ==========================================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setUploadProgress(0);
  };


  // ==========================================
  // REMOVE FILE
  // ==========================================

  const removeFile = () => {
    setSelectedFile(null);

    setSaveToMaterials(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      (!content.trim() && !selectedFile) ||
      isSendingMessage ||
      isUploading
    ) {
      return;
    }

    try {
      let uploadedFileData = null;

      // ======================================
      // UPLOAD FILE
      // ======================================

      if (selectedFile) {
        setIsUploading(true);

        setUploadProgress(0);

        uploadedFileData =
          await uploadFile(
            selectedFile,
            (progress) => {
              setUploadProgress(progress);
            }
          );
      }

      console.log(
        "📁 UPLOAD RESPONSE:",
        uploadedFileData
      );


      // ======================================
      // BUILD MESSAGE
      // ======================================

      const messageData = {
        content: content.trim(),

        ...(uploadedFileData && {
          file_url:
            uploadedFileData.url,

          file_public_id:
            uploadedFileData.public_id,

          file_name:
            uploadedFileData.file_name,

          file_type:
            uploadedFileData.file_type,

          file_size:
            uploadedFileData.file_size,
        }),

        // ====================================
        // ADMIN MATERIAL FLAG
        // ====================================

        ...(isAdmin &&
          selectedFile && {
            save_to_materials:
              saveToMaterials,
          }),
      };


      console.log(
        "📨 MESSAGE DATA:",
        messageData
      );


      // ======================================
      // SEND
      // ======================================

      await onSendMessage(
        messageData
      );


      // ======================================
      // CLEAR
      // ======================================

      onContentChange("");

      removeFile();

    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );

    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };


  const isDisabled =
    isSendingMessage ||
    isUploading;


  return (
    <form
      onSubmit={handleSubmit}
      className="
        shrink-0
        border-t
        border-base-300
        bg-base-100
        px-4
        py-3
        md:px-6
      "
    >

      {/* ======================================
          FILE PREVIEW
      ====================================== */}

      {selectedFile && (
        <div
          className="
            mb-3
            rounded-lg
            bg-base-200
            px-3
            py-2
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >

            <div
              className="
                flex
                min-w-0
                items-center
                gap-2
              "
            >

              <File
                className="
                  h-5
                  w-5
                  shrink-0
                  text-primary
                "
              />

              <span
                className="
                  truncate
                  text-sm
                "
              >
                {selectedFile.name}
              </span>

            </div>


            <button
              type="button"
              onClick={removeFile}
              disabled={isDisabled}
              className="
                btn
                btn-ghost
                btn-xs
                btn-circle
                shrink-0
              "
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </button>

          </div>


          {/* ==================================
              ADMIN ONLY
          ================================== */}

          {isAdmin && (
            <label
              className="
                mt-3
                flex
                cursor-pointer
                items-center
                gap-2
                text-sm
                text-base-content/70
              "
            >

              <input
                type="checkbox"
                className="
                  checkbox
                  checkbox-sm
                  checkbox-primary
                "
                checked={
                  saveToMaterials
                }
                onChange={(e) =>
                  setSaveToMaterials(
                    e.target.checked
                  )
                }
                disabled={isDisabled}
              />

              <span>
                Save this file to Study Materials
              </span>

            </label>
          )}


          {/* ==================================
              UPLOAD PROGRESS
          ================================== */}

          {isUploading && (
            <div
              className="
                mt-2
                flex
                items-center
                gap-3
              "
            >

              <progress
                className="
                  progress
                  progress-primary
                  h-2
                  flex-1
                "
                value={uploadProgress}
                max="100"
              />

              <span
                className="
                  w-10
                  text-right
                  text-xs
                  text-base-content/60
                "
              >
                {uploadProgress}%
              </span>

            </div>
          )}

        </div>
      )}


      {/* ======================================
          INPUT ROW
      ====================================== */}

      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        {/* HIDDEN FILE INPUT */}

        <input
          ref={fileInputRef}
          type="file"
          onChange={
            handleFileChange
          }
          className="hidden"
          disabled={isDisabled}
        />


        {/* ATTACH */}

        <button
          type="button"
          onClick={() =>
            fileInputRef.current?.click()
          }
          disabled={isDisabled}
          className="
            btn
            btn-ghost
            btn-square
            shrink-0
          "
          aria-label="Attach file"
        >
          <Paperclip className="h-5 w-5" />
        </button>


        {/* MESSAGE */}

        <input
          type="text"
          value={content}
          onChange={(e) =>
            onContentChange(
              e.target.value
            )
          }
          placeholder="Type a message..."
          disabled={isDisabled}
          className="
            input
            input-bordered
            min-w-0
            flex-1
            text-sm
            md:text-base
          "
        />


        {/* SEND */}

        <button
          type="submit"
          disabled={
            isDisabled ||
            (!content.trim() &&
              !selectedFile)
          }
          className="
            btn
            btn-primary
            btn-square
            shrink-0
          "
          aria-label="Send message"
        >

          {isUploading ||
          isSendingMessage ? (
            <span
              className="
                loading
                loading-spinner
                loading-sm
              "
            />
          ) : (
            <Send className="h-5 w-5" />
          )}

        </button>

      </div>

    </form>
  );
};

export default MessageInput;