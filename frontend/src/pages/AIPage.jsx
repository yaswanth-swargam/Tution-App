import { ArrowUpRight, Sparkles } from "lucide-react";
import PageHeader from "../components/common/PageHeader";

const prompts = [
  "Explain this chapter in simple terms",
  "Make a 10-question quiz",
  "Summarize my notes",
];

const AIPage = () => {
  return (
    <div>
      <PageHeader
        eyebrow="Assistant"
        title="AI study partner"
        subtitle="Ask for summaries, quizzes, or a clearer explanation."
      />

      <div className="panel p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold">Ready when you are</p>
            <p className="text-xs text-neutral/50">No chat history yet</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Ask anything about your subject..."
            className="input input-bordered h-11 flex-1 rounded-xl border-base-300 bg-canvas focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
          />
          <button type="button" className="btn btn-primary h-11 rounded-xl">
            Ask
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="rounded-xl border border-base-300 bg-base-100 px-3 py-1.5 text-xs font-medium text-neutral/60 transition-colors duration-150 hover:border-primary/25 hover:text-primary"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIPage;
