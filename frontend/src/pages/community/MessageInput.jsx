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
}) => {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [isUploading, setIsUploading] =
    useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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

      // Upload file first
      if (selectedFile) {
        setIsUploading(true);

        uploadedFileData =
          await uploadFile(selectedFile);
      }

      console.log(
  "📁 UPLOAD RESPONSE:",
  uploadedFileData
);

      // Build message object
      const messageData = {
        content: content.trim(),

        ...(uploadedFileData && {
          file_url: uploadedFileData.url,
    file_public_id: uploadedFileData.public_id,
    file_name: uploadedFileData.file_name,
    file_type: uploadedFileData.file_type,
    file_size: uploadedFileData.file_size,
        }),
      };

      await onSendMessage(messageData);

      // Clear input
      onContentChange("");

      removeFile();

    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );

    } finally {
      setIsUploading(false);
    }
  };

  const isDisabled =
    isSendingMessage || isUploading;

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
      {/* FILE PREVIEW */}

      {selectedFile && (
        <div
          className="
            mb-3
            flex
            items-center
            justify-between
            gap-3
            rounded-lg
            bg-base-200
            px-3
            py-2
          "
        >
          <div className="flex min-w-0 items-center gap-2">

            <File className="h-5 w-5 shrink-0 text-primary" />

            <span className="truncate text-sm">
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
      )}

      <div className="flex items-center gap-2">

        {/* HIDDEN FILE INPUT */}

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          disabled={isDisabled}
        />

        {/* ATTACH BUTTON */}

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

        {/* MESSAGE INPUT */}

        <input
          type="text"
          value={content}
          onChange={(e) =>
            onContentChange(e.target.value)
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
            (!content.trim() && !selectedFile)
          }
          className="
            btn
            btn-primary
            btn-square
            shrink-0
          "
          aria-label="Send message"
        >
          {isUploading || isSendingMessage ? (
            <span className="
              loading
              loading-spinner
              loading-sm
            " />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>

      </div>
    </form>
  );
};

export default MessageInput;