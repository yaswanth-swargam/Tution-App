import {
  FileText,
  PlayCircle,
  Link as LinkIcon,
  Download,
  ExternalLink,
  Pencil,
  Trash2,
} from "lucide-react";

// ==========================================
// HELPERS
// ==========================================

const formatFileSize = (bytes) => {
  if (!bytes) return null;

  const size = Number(bytes);

  if (Number.isNaN(size)) {
    return null;
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const formatDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};

const getMaterialLabel = (item) => {
  if (item.material_type === "link") {
    return "Resource";
  }

  if (item.file_type?.startsWith("video/")) {
    return "Video";
  }

  if (item.file_type === "application/pdf") {
    return "PDF";
  }

  if (
    item.file_type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return "DOCX";
  }

  if (item.file_type === "application/msword") {
    return "DOC";
  }

  if (
    item.file_type ===
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    return "PPTX";
  }

  if (
    item.file_type ===
    "application/vnd.ms-powerpoint"
  ) {
    return "PPT";
  }

  if (
    item.file_type ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return "XLSX";
  }

  if (
    item.file_type ===
    "application/vnd.ms-excel"
  ) {
    return "XLS";
  }

  return "File";
};

const getMaterialIcon = (item) => {
  if (item.material_type === "link") {
    return <LinkIcon size={20} />;
  }

  if (item.file_type?.startsWith("video/")) {
    return <PlayCircle size={20} />;
  }

  return <FileText size={20} />;
};

const getMaterialUrl = (item) => {
  if (item.material_type === "link") {
    return item.external_url;
  }

  return item.file_url;
};


// ==========================================
// MATERIAL CARD
// ==========================================

const MaterialCard = ({
  item,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  const materialUrl =
    getMaterialUrl(item);

  return (
    <article
      className="
        group
        flex
        items-start
        justify-between
        gap-4
        rounded-xl
        border
        border-base-300
        bg-base-100
        p-5
        transition-all
        duration-200
        hover:border-primary/50
        hover:shadow-md
      "
    >

      {/* =====================================
          MATERIAL DETAILS
      ===================================== */}

      <div className="flex min-w-0 gap-4">

        {/* ICON */}

        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-primary/10
            text-primary
          "
        >
          {getMaterialIcon(item)}
        </div>


        {/* DETAILS */}

        <div className="min-w-0">

          <p
            className="
              text-[11px]
              font-semibold
              uppercase
              tracking-wide
              text-primary
            "
          >
            {getMaterialLabel(item)}
          </p>

          <h2
            className="
              mt-1
              truncate
              text-[15px]
              font-semibold
              text-base-content
            "
          >
            {item.title}
          </h2>

          {item.description && (
            <p
              className="
                mt-1
                line-clamp-2
                text-sm
                text-base-content/50
              "
            >
              {item.description}
            </p>
          )}

          <div
            className="
              mt-2
              flex
              flex-wrap
              items-center
              gap-x-2
              gap-y-1
              text-xs
              text-base-content/40
            "
          >

            {item.created_by_name && (
              <span>
                Added by {item.created_by_name}
              </span>
            )}

            {item.created_at && (
              <>
                <span>•</span>

                <span>
                  {formatDate(
                    item.created_at
                  )}
                </span>
              </>
            )}

            {item.file_size && (
              <>
                <span>•</span>

                <span>
                  {formatFileSize(
                    item.file_size
                  )}
                </span>
              </>
            )}

          </div>

        </div>
      </div>


      {/* =====================================
          ACTIONS
      ===================================== */}

      <div
        className="
          flex
          shrink-0
          items-center
          gap-1
        "
      >

        {/* OPEN */}

        {materialUrl && (
  <a
    href={materialUrl}
    target="_blank"
    rel="noopener noreferrer"
    download={
      item.file_type !== "application/pdf" &&
      !item.file_type?.startsWith("image/")
        ? item.file_name
        : undefined
    }
    className="btn btn-ghost btn-sm btn-square ..."
    aria-label={
      item.material_type === "link"
        ? "Open resource"
        : item.file_type === "application/pdf" ||
          item.file_type?.startsWith("image/")
        ? "Open file"
        : "Download file"
    }
    title={
      item.material_type === "link"
        ? "Open resource"
        : item.file_type === "application/pdf" ||
          item.file_type?.startsWith("image/")
        ? "Open file"
        : "Download file"
    }
  >
    {item.material_type === "link" ? (
      <ExternalLink size={17} />
    ) : item.file_type === "application/pdf" ||
      item.file_type?.startsWith("image/") ? (
      <ExternalLink size={17} />
    ) : (
      <Download size={17} />
    )}
  </a>
)}

        {/* ADMIN ACTIONS */}

        {isAdmin && (
          <>
            <button
              type="button"
              onClick={() =>
                onEdit?.(item)
              }
              className="
                btn
                btn-ghost
                btn-sm
                btn-square
                text-base-content/40
                hover:text-primary
              "
              aria-label={`Edit ${item.title}`}
              title="Edit material"
            >
              <Pencil size={17} />
            </button>

            <button
              type="button"
              onClick={() =>
                onDelete?.(item)
              }
              className="
                btn
                btn-ghost
                btn-sm
                btn-square
                text-base-content/40
                hover:text-error
              "
              aria-label={`Delete ${item.title}`}
              title="Delete material"
            >
              <Trash2 size={17} />
            </button>
          </>
        )}

      </div>

    </article>
  );
};

export default MaterialCard;