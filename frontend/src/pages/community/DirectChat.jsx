import { useEffect, useRef, useState } from "react";

import {
  ArrowLeft,
  Send,
  MessageCircle,
  Search,
  X,
  Paperclip,
  File,
  Image,
  ExternalLink,
} from "lucide-react";

import ChatLayout from "./ChatLayout";
import { uploadFile } from "../../lib/upload.js";

const DirectChat = ({
  selectedUser,
  messages = [],
  authUser,
  onBack,
  onSendMessage,
  isLoading,
  isSending,
}) => {
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // =========================
  // SEARCH
  // =========================

  const normalizedQuery =
    searchQuery.trim().toLowerCase();

  const filteredMessages = normalizedQuery
    ? messages.filter((message) =>
        message.content
          ?.toLowerCase()
          .includes(normalizedQuery)
      )
    : messages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [filteredMessages]);

  const handleToggleSearch = () => {
    setIsSearching((prev) => !prev);

    if (isSearching) {
      setSearchQuery("");
    }
  };

  // =========================
  // FILE HANDLING
  // =========================

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

  // =========================
  // SEND MESSAGE
  // =========================

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    (!content.trim() && !selectedFile) ||
    isSending ||
    isUploading
  ) {
    return;
  }

  try {
    let uploadedFileData = null;

    if (selectedFile) {
      console.log("📤 Starting file upload");

      setIsUploading(true);

      uploadedFileData =
        await uploadFile(selectedFile);

      console.log(
        "✅ File upload finished:",
        uploadedFileData
      );
    }

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

    console.log(
      "📨 Sending direct message:",
      messageData
    );

    await onSendMessage(messageData);

    console.log(
      "✅ Direct message successfully sent"
    );

    setContent("");
    removeFile();

  } catch (error) {
    console.error(
      "❌ Failed to send direct message:",
      error
    );
  } finally {
    console.log("🔄 Resetting upload state");

    setIsUploading(false);
  }
};
  // =========================
  // DATE FORMAT
  // =========================

  const formatDateTime = (dateString) => {
    if (!dateString) return "";

    return new Date(
      dateString
    ).toLocaleString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================
  // HELPERS
  // =========================

  const isImageFile = (fileType) => {
    return fileType?.startsWith("image/");
  };

  const isDisabled =
    isSending || isUploading;

  const isEmpty =
    filteredMessages.length === 0;

  return (
    <ChatLayout
      isLoading={isLoading}
      loadingText="Loading messages..."

      // =========================
      // HEADER
      // =========================

      header={
        <div className="border-b border-base-300 bg-base-100">

          {isSearching ? (

            <div className="flex items-center gap-3 px-4 py-3 md:px-6">

              <div className="relative flex-1">

                <Search
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-base-content/40
                  "
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(e.target.value)
                  }
                  placeholder="Search messages..."
                  className="
                    input
                    input-bordered
                    w-full
                    pl-10
                  "
                  autoFocus
                />

              </div>

              <button
                type="button"
                onClick={handleToggleSearch}
                className="
                  btn
                  btn-ghost
                  btn-circle
                  btn-sm
                "
                title="Close search"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

          ) : (

            <div className="flex items-center gap-3 px-4 py-3 md:px-6">

              <button
                type="button"
                onClick={onBack}
                className="
                  btn
                  btn-ghost
                  btn-circle
                  btn-sm
                "
                title="Back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="avatar placeholder">

                <div className="
                  w-10
                  overflow-hidden
                  rounded-full
                  bg-primary
                  text-primary-content
                ">

                  {selectedUser?.profile_pic ? (

                    <img
                      src={selectedUser.profile_pic}
                      alt={selectedUser.full_name}
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />

                  ) : (

                    <span>
                      {selectedUser?.full_name
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </span>

                  )}

                </div>

              </div>

              <div className="min-w-0 flex-1">

                <h2 className="
                  truncate
                  font-semibold
                  text-base-content
                ">
                  {selectedUser?.full_name}
                </h2>

                <p className="
                  truncate
                  text-xs
                  text-base-content/50
                ">
                  {selectedUser?.role === "admin"
                    ? "Administrator"
                    : selectedUser?.email}
                </p>

              </div>

              <button
                type="button"
                onClick={handleToggleSearch}
                className="
                  btn
                  btn-ghost
                  btn-circle
                  btn-sm
                "
                title="Search messages"
                aria-label="Search messages"
              >
                <Search className="h-5 w-5" />
              </button>

            </div>

          )}

        </div>
      }

      // =========================
      // FOOTER / MESSAGE INPUT
      // =========================

      footer={
        <form
          onSubmit={handleSubmit}
          className="
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

            <div className="
              mb-3
              flex
              items-center
              justify-between
              gap-3
              rounded-lg
              bg-base-200
              px-3
              py-2
            ">

              <div className="
                flex
                min-w-0
                items-center
                gap-2
              ">

                <File className="
                  h-5
                  w-5
                  shrink-0
                  text-primary
                " />

                <span className="
                  truncate
                  text-sm
                ">
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
              >
                <X className="h-4 w-4" />
              </button>

            </div>

          )}

          <div className="
            flex
            items-center
            gap-2
          ">

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
              title="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            {/* TEXT INPUT */}

            <input
              type="text"
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder={`Message ${
                selectedUser?.full_name || ""
              }`}
              className="
                input
                input-bordered
                min-w-0
                flex-1
              "
              disabled={isDisabled}
            />

            {/* SEND BUTTON */}

            <button
              type="submit"
              disabled={
                isDisabled ||
                (
                  !content.trim() &&
                  !selectedFile
                )
              }
              className="
                btn
                btn-primary
                btn-square
                shrink-0
              "
            >

              {isUploading || isSending ? (

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
      }
    >

      {/* =========================
          MESSAGE LIST
      ========================== */}

      <div className="
        flex
        min-h-0
        flex-1
        flex-col
        overflow-y-auto
        overflow-x-hidden
        px-4
        py-5
        md:px-6
      ">

        {isEmpty ? (

          <div className="
            flex
            min-h-full
            flex-1
            flex-col
            items-center
            justify-center
            text-center
          ">

            <MessageCircle
              className="
                mb-3
                h-12
                w-12
                text-base-content/20
              "
            />

            <h3 className="
              font-medium
              text-base-content/70
            ">
              {normalizedQuery
                ? "No matching messages found"
                : "No messages yet"}
            </h3>

            <p className="
              mt-1
              text-sm
              text-base-content/45
            ">
              {normalizedQuery
                ? "Try searching with different words"
                : `Start the conversation with ${selectedUser?.full_name}`}
            </p>

          </div>

        ) : (

          <div className="
            flex
            flex-col
            gap-4
          ">

            {filteredMessages.map((message) => {

              const isMine =
                Number(message.sender_id) ===
                Number(authUser?.id);

              const isImage =
                isImageFile(
                  message.file_type
                );

              return (

                <div
                  key={message.id}
                  className={`
                    flex
                    ${
                      isMine
                        ? "justify-end"
                        : "justify-start"
                    }
                  `}
                >

                  <div
                    className={`
                      max-w-[75%]
                      rounded-2xl
                      px-4
                      py-3
                      ${
                        isMine
                          ? "rounded-br-md bg-primary text-primary-content"
                          : "rounded-bl-md bg-base-200 text-base-content"
                      }
                    `}
                  >

                    {/* TEXT */}

                    {message.content && (

                      <p className="
                        whitespace-pre-wrap
                        break-words
                        text-sm
                      ">
                        {message.content}
                      </p>

                    )}

                    {/* IMAGE FILE */}

                    {message.file_url && isImage && (

                      <a
                        href={message.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >

                        <img
                          src={message.file_url}
                          alt={
                            message.file_name ||
                            "Shared image"
                          }
                          className="
                            mt-2
                            max-h-72
                            rounded-lg
                            object-cover
                          "
                        />

                      </a>

                    )}

                    {/* OTHER FILE */}

                    {message.file_url && !isImage && (

                      <a
                        href={message.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          mt-2
                          flex
                          items-center
                          gap-3
                          rounded-lg
                          bg-base-100/10
                          p-3
                          hover:bg-base-100/20
                        "
                      >

                        <File className="
                          h-6
                          w-6
                          shrink-0
                        " />

                        <div className="
                          min-w-0
                          flex-1
                        ">

                          <p className="
                            truncate
                            text-sm
                            font-medium
                          ">
                            {message.file_name}
                          </p>

                          <p className="
                            text-xs
                            opacity-70
                          ">
                            {message.file_type}
                          </p>

                        </div>

                        <ExternalLink className="
                          h-4
                          w-4
                          shrink-0
                        " />

                      </a>

                    )}

                    {/* TIME */}

                    <p
                      className={`
                        mt-2
                        text-[11px]
                        ${
                          isMine
                            ? "text-primary-content/70"
                            : "text-base-content/40"
                        }
                      `}
                    >
                      {formatDateTime(
                        message.created_at
                      )}
                    </p>

                  </div>

                </div>

              );

            })}

            <div ref={messagesEndRef} />

          </div>

        )}

      </div>

    </ChatLayout>
  );
};

export default DirectChat;