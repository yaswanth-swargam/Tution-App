import { FileText, PlayCircle, Download } from "lucide-react";
import PageHeader from "../components/common/PageHeader";

const materials = [
  { title: "Algebra — Quadratics", type: "Notes", meta: "12 pages" },
  { title: "Organic chemistry intro", type: "Video", meta: "18 min" },
  { title: "Essay structure sheet", type: "PDF", meta: "Updated today" },
  { title: "Practice set: Waves", type: "Worksheet", meta: "20 questions" },
];

const MaterialsPage = () => {
  return (
    <div>
      <PageHeader
        eyebrow="Library"
        title="Study materials"
        subtitle="Notes, videos, and worksheets in one place."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {materials.map((item) => (
          <article
            key={item.title}
            className="panel group flex items-start justify-between gap-4 p-5"
          >
            <div className="flex gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-canvas text-neutral/60">
                {item.type === "Video" ? (
                  <PlayCircle size={20} />
                ) : (
                  <FileText size={20} />
                )}
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-neutral/45">
                  {item.type}
                </p>
                <h2 className="mt-0.5 text-[15px] font-semibold tracking-tight">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm text-neutral/50">{item.meta}</p>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-square text-neutral/40 transition-colors duration-150 group-hover:text-primary"
            >
              <Download size={16} />
            </button>
          </article>
        ))}
      </div>
    </div>
  );
};

export default MaterialsPage;
