import { Send } from "lucide-react";

const MessageInput = ({
  content,
  onContentChange,
  onSendMessage,
  isSendingMessage,
}) => {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage(e);
    }
  };

  return (
    <form
      onSubmit={onSendMessage}
      className="border-t border-base-300 px-4 py-4 md:px-6 md:py-4 bg-base-100"
    >
      <div className="flex gap-3">
        <input
          type="text"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={isSendingMessage}
          className="input input-bordered flex-1 text-sm md:text-base"
        />

        <button
          type="submit"
          disabled={isSendingMessage || !content.trim()}
          className="btn btn-primary btn-square"
          aria-label="Send message"
        >
          {isSendingMessage ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;