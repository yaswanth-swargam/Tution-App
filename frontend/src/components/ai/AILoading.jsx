
import { Bot } from "lucide-react";

const AILoading = () => {
  return (
    <div className="flex w-full gap-3 px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-content">
        <Bot size={18} />
      </div>

      <div className="flex items-center gap-1 px-1 py-2">
        <span className="h-2 w-2 animate-bounce rounded-full bg-base-content/50 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-base-content/50 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-base-content/50" />
      </div>
    </div>
  );
};

export default AILoading;