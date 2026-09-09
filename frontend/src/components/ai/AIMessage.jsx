
import { Bot, User } from "lucide-react";

const AIMessage = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex w-full gap-3 px-4 py-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-content">
          <Bot size={18} />
        </div>
      )}

      <div
        className={`max-w-[80%] whitespace-pre-wrap break-words text-sm leading-6 ${
          isUser
            ? "rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-content"
            : "px-1 py-1 text-base-content"
        }`}
      >
        {message.content}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-base-300 text-base-content">
          <User size={17} />
        </div>
      )}
    </div>
  );
};

export default AIMessage;

