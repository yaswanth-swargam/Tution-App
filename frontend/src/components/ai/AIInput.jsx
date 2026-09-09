
import { Send } from "lucide-react";
import { useState } from "react";

const AIInput = ({
  onSend,
  disabled = false,
  initialValue = "",
}) => {
  const [message, setMessage] = useState(initialValue);

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || disabled) return;

    onSend(trimmedMessage);
    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-base-300 bg-base-100 px-3 py-3 sm:px-4">
      <div className="mx-auto flex max-w-4xl items-end gap-2 rounded-2xl border border-base-300 bg-base-200/50 p-2 focus-within:border-primary/50">
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          placeholder="Message your AI assistant..."
          className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-base-content/40"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="btn btn-primary btn-circle btn-sm shrink-0 disabled:opacity-40"
          aria-label="Send message"
        >
          <Send size={16} />
        </button>
      </div>

      <p className="mx-auto mt-2 max-w-4xl text-center text-[11px] text-base-content/40">
        Enter to send · Shift + Enter for a new line
      </p>
    </div>
  );
};

export default AIInput;
