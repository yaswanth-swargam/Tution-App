import { useEffect, useState } from "react";
import {
  X,
  Link as LinkIcon,
  FileText,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  updateStudyMaterial,
} from "../../store/studyMaterialActions.js";

const EditMaterialModal = ({
  material,
  onClose,
  onUpdated,
}) => {
  const dispatch = useDispatch();

  const {
    isUpdatingMaterial,
  } = useSelector(
    (state) => state.studyMaterial
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [externalUrl, setExternalUrl] =
    useState("");
  const [error, setError] =
    useState("");

  // ==========================================
  // INITIAL VALUES
  // ==========================================

  useEffect(() => {
    if (!material) {
      return;
    }

    setTitle(material.title || "");

    setDescription(
      material.description || ""
    );

    setExternalUrl(
      material.external_url || ""
    );

    setError("");
  }, [material]);

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // ========================================
    // VALIDATE TITLE
    // ========================================

    if (!title.trim()) {
      setError(
        "Please enter a title."
      );

      return;
    }

    // ========================================
    // VALIDATE LINK
    // ========================================

    if (
      material.material_type === "link" &&
      !externalUrl.trim()
    ) {
      setError(
        "Please enter a resource URL."
      );

      return;
    }

    try {
      const materialData = {
        title: title.trim(),

        description:
          description.trim() || null,
      };

      // Only links can have their URL edited.
      if (
        material.material_type === "link"
      ) {
        materialData.external_url =
          externalUrl.trim();
      }

      const updatedMaterial =
        await dispatch(
          updateStudyMaterial(
            material.id,
            materialData
          )
        );

      // Tell parent that the update succeeded.
      if (onUpdated) {
        onUpdated(
          updatedMaterial
        );
      }

      onClose();

    } catch (err) {
      console.error(
        "Failed to update study material:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to update study material."
      );
    }
  };

  if (!material) {
    return null;
  }

  const isLink =
    material.material_type === "link";

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/40
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-lg
          rounded-2xl
          border
          border-base-300
          bg-base-100
          shadow-xl
        "
      >

        {/* ==================================
            HEADER
        ================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-base-300
            px-6
            py-4
          "
        >

          <div>

            <div className="flex items-center gap-2">

              {isLink ? (
                <LinkIcon
                  size={18}
                  className="text-primary"
                />
              ) : (
                <FileText
                  size={18}
                  className="text-primary"
                />
              )}

              <h2
                className="
                  text-lg
                  font-semibold
                  text-base-content
                "
              >
                Edit Study Material
              </h2>

            </div>

            <p
              className="
                mt-0.5
                text-xs
                text-base-content/50
              "
            >
              Update the material details
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUpdatingMaterial}
            className="
              btn
              btn-ghost
              btn-sm
              btn-square
            "
          >
            <X size={18} />
          </button>

        </div>


        {/* ==================================
            FORM
        ================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          {/* TITLE */}

          <div>

            <label
              className="
                mb-1.5
                block
                text-sm
                font-medium
              "
            >
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="Material title"
              className="
                input
                input-bordered
                w-full
              "
              disabled={
                isUpdatingMaterial
              }
            />

          </div>


          {/* DESCRIPTION */}

          <div>

            <label
              className="
                mb-1.5
                block
                text-sm
                font-medium
              "
            >
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Optional description"
              rows={4}
              className="
                textarea
                textarea-bordered
                w-full
                resize-none
              "
              disabled={
                isUpdatingMaterial
              }
            />

          </div>


          {/* LINK URL */}

          {isLink && (
            <div>

              <label
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                "
              >
                Resource URL
              </label>

              <input
                type="url"
                value={externalUrl}
                onChange={(event) =>
                  setExternalUrl(
                    event.target.value
                  )
                }
                placeholder="https://example.com"
                className="
                  input
                  input-bordered
                  w-full
                "
                disabled={
                  isUpdatingMaterial
                }
              />

            </div>
          )}


          {/* FILE INFORMATION */}

          {!isLink && (
            <div
              className="
                rounded-xl
                bg-base-200
                px-4
                py-3
              "
            >

              <p
                className="
                  text-xs
                  font-medium
                  text-base-content/50
                "
              >
                Attached file
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-sm
                  font-medium
                "
              >
                {material.file_name ||
                  "Uploaded file"}
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-base-content/40
                "
              >
                The existing file will remain
                unchanged.
              </p>

            </div>
          )}


          {/* ERROR */}

          {error && (
            <div
              className="
                rounded-lg
                bg-error/10
                px-4
                py-3
                text-sm
                text-error
              "
            >
              {error}
            </div>
          )}


          {/* ACTIONS */}

          <div
            className="
              flex
              justify-end
              gap-2
              pt-2
            "
          >

            <button
              type="button"
              onClick={onClose}
              disabled={
                isUpdatingMaterial
              }
              className="btn btn-ghost"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isUpdatingMaterial
              }
              className="btn btn-primary"
            >

              {isUpdatingMaterial ? (
                <>
                  <span
                    className="
                      loading
                      loading-spinner
                      loading-sm
                    "
                  />

                  Saving...
                </>
              ) : (
                "Save Changes"
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EditMaterialModal;