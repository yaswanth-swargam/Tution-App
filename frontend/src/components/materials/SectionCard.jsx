import { FileText } from "lucide-react";

const SectionCard = ({
  section,
  onSelect,
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(section)}
      className="
        group
        w-full
        rounded-2xl
        border
        border-base-300
        bg-base-100
        p-5
        text-left
        transition-all
        duration-200
        hover:border-primary/40
        hover:shadow-md
      "
    >
      <div className="flex items-center justify-between gap-4">

        <div className="flex min-w-0 items-center gap-4">

          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-primary/10
              text-primary
            "
          >
            <FileText size={22} />
          </div>

          <div className="min-w-0">

            <h2
              className="
                truncate
                text-base
                font-semibold
                text-base-content
              "
            >
              {section.name}
            </h2>

            <p
              className="
                mt-1
                text-sm
                text-base-content/50
              "
            >
              View study materials
            </p>

          </div>

        </div>

        <span
          className="
            text-sm
            font-medium
            text-primary
            opacity-0
            transition-opacity
            group-hover:opacity-100
          "
        >
          Open →
        </span>

      </div>
    </button>
  );
};

export default SectionCard;