
import {
  BookOpen,
  Lightbulb,
  MessageSquare,
  Sparkles,
} from "lucide-react";

const AIEmptyState = ({ onPromptClick }) => {
  const prompts = [
    {
      icon: MessageSquare,
      title: "Catch me up",
      text: "What did I miss recently?",
      prompt: "What did I miss recently?",
    },
    {
      icon: BookOpen,
      title: "Study help",
      text: "Explain my study materials",
      prompt: "Help me understand my study materials.",
    },
    {
      icon: Lightbulb,
      title: "Learn something",
      text: "Teach me a concept",
      prompt: "Teach me something interesting.",
    },
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-10">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Sparkles size={28} />
      </div>

      <h2 className="text-2xl font-semibold">
        How can I help you?
      </h2>

      <p className="mt-2 max-w-md text-center text-sm text-base-content/60">
        Ask me about your tuition activity, study materials,
        or anything you want to learn.
      </p>

      <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-3">
        {prompts.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              type="button"
              onClick={() => onPromptClick(item.prompt)}
              className="group rounded-xl border border-base-300 bg-base-100 p-4 text-left transition hover:border-primary/40 hover:bg-base-200"
            >
              <Icon
                size={19}
                className="mb-3 text-primary transition-transform group-hover:scale-110"
              />

              <p className="text-sm font-medium">
                {item.title}
              </p>

              <p className="mt-1 text-xs text-base-content/60">
                {item.text}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AIEmptyState;
