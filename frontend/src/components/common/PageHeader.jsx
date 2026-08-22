const PageHeader = ({ eyebrow, title, subtitle, action }) => {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {eyebrow}
          </p>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-neutral">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-neutral/50">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
};

export default PageHeader;
