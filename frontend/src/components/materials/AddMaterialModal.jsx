import { useState } from "react";
import { X, Upload, Link as LinkIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { uploadFile } from "../../lib/upload.js";
import {
  createStudyMaterial,
} from "../../store/studyMaterialActions.js";


const AddMaterialModal = ({
  section,
  onClose,
}) => {
  const dispatch = useDispatch();

  const {
    isCreatingMaterial,
  } = useSelector(
    (state) => state.studyMaterial
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [materialType, setMaterialType] =
    useState("file");

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [externalUrl, setExternalUrl] =
    useState("");

  const [uploadProgress, setUploadProgress] =
    useState(0);

  const [error, setError] =
    useState("");


  // ==========================================
  // FILE SELECT
  // ==========================================

  const handleFileChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setError("");
  };


  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");


    // ========================================
    // VALIDATION
    // ========================================

    if (!title.trim()) {
      setError(
        "Please enter a title."
      );

      return;
    }


    if (
      materialType === "file" &&
      !selectedFile
    ) {
      setError(
        "Please select a file."
      );

      return;
    }


    if (
      materialType === "link" &&
      !externalUrl.trim()
    ) {
      setError(
        "Please enter a resource URL."
      );

      return;
    }


    try {
      let materialData = {
        title: title.trim(),
        description:
          description.trim() || null,
        material_type:
          materialType,
      };


      // ======================================
      // FILE
      // ======================================

      if (
        materialType === "file"
      ) {
        setUploadProgress(0);

        const uploadedFile =
  await uploadFile(
    selectedFile,
    setUploadProgress
  );

materialData = {
  ...materialData,

  file_url:
    uploadedFile.url,

  file_public_id:
    uploadedFile.public_id,

  file_name:
    uploadedFile.file_name,

  file_type:
    uploadedFile.file_type,

  file_size:
    uploadedFile.file_size,
};
      }


      // ======================================
      // LINK
      // ======================================

      if (
        materialType === "link"
      ) {
        materialData = {
          ...materialData,

          external_url:
            externalUrl.trim(),
        };
      }


      // ======================================
      // CREATE MATERIAL
      // ======================================

      await dispatch(
        createStudyMaterial(
          section.id,
          materialData
        )
      );


      // ======================================
      // CLOSE
      // ======================================

      onClose();

    } catch (err) {
      console.error(
        "Failed to create study material:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to add study material."
      );
    }
  };


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

            <h2
              className="
                text-lg
                font-semibold
                text-base-content
              "
            >
              Add Study Material
            </h2>

            <p
              className="
                mt-0.5
                text-xs
                text-base-content/50
              "
            >
              {section?.name}
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={
              isCreatingMaterial
            }
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
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="e.g. Normalization Notes"
              className="input input-bordered w-full"
              disabled={
                isCreatingMaterial
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
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Optional description"
              rows={3}
              className="
                textarea
                textarea-bordered
                w-full
                resize-none
              "
              disabled={
                isCreatingMaterial
              }
            />

          </div>


          {/* TYPE */}

          <div>

            <label
              className="
                mb-1.5
                block
                text-sm
                font-medium
              "
            >
              Material type
            </label>

            <div className="flex gap-2">

              <button
                type="button"
                onClick={() =>
                  setMaterialType("file")
                }
                className={`
                  btn
                  flex-1
                  ${
                    materialType === "file"
                      ? "btn-primary"
                      : "btn-outline"
                  }
                `}
                disabled={
                  isCreatingMaterial
                }
              >
                <Upload size={16} />
                File
              </button>


              <button
                type="button"
                onClick={() =>
                  setMaterialType("link")
                }
                className={`
                  btn
                  flex-1
                  ${
                    materialType === "link"
                      ? "btn-primary"
                      : "btn-outline"
                  }
                `}
                disabled={
                  isCreatingMaterial
                }
              >
                <LinkIcon size={16} />
                Link
              </button>

            </div>

          </div>


          {/* ==================================
              FILE
          ================================== */}

          {materialType === "file" && (

            <div>

              <label
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                "
              >
                Upload file
              </label>

              <label
                className="
                  flex
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-dashed
                  border-base-300
                  px-5
                  py-8
                  text-center
                  transition-colors
                  hover:border-primary/50
                  hover:bg-base-200/40
                "
              >

                <Upload
                  className="
                    mb-2
                    h-7
                    w-7
                    text-base-content/30
                  "
                />

                {selectedFile ? (

                  <>

                    <p
                      className="
                        max-w-full
                        truncate
                        text-sm
                        font-medium
                      "
                    >
                      {selectedFile.name}
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-base-content/40
                      "
                    >
                      Click to choose another file
                    </p>

                  </>

                ) : (

                  <>

                    <p
                      className="
                        text-sm
                        font-medium
                      "
                    >
                      Choose a file
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-base-content/40
                      "
                    >
                      PDF, documents, videos, images
                    </p>

                  </>

                )}

                <input
                  type="file"
                  className="hidden"
                  onChange={
                    handleFileChange
                  }
                  disabled={
                    isCreatingMaterial
                  }
                />

              </label>


              {/* UPLOAD PROGRESS */}

              {isCreatingMaterial &&
                uploadProgress > 0 &&
                uploadProgress < 100 && (

                  <div className="mt-3">

                    <div
                      className="
                        mb-1
                        flex
                        justify-between
                        text-xs
                        text-base-content/50
                      "
                    >
                      <span>
                        Uploading...
                      </span>

                      <span>
                        {uploadProgress}%
                      </span>
                    </div>

                    <progress
                      className="
                        progress
                        progress-primary
                        w-full
                      "
                      value={
                        uploadProgress
                      }
                      max="100"
                    />

                  </div>

                )}

            </div>

          )}


          {/* ==================================
              LINK
          ================================== */}

          {materialType === "link" && (

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
                onChange={(e) =>
                  setExternalUrl(
                    e.target.value
                  )
                }
                placeholder="https://example.com"
                className="input input-bordered w-full"
                disabled={
                  isCreatingMaterial
                }
              />

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


          {/* ==================================
              ACTIONS
          ================================== */}

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
                isCreatingMaterial
              }
              className="btn btn-ghost"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={
                isCreatingMaterial
              }
              className="btn btn-primary"
            >

              {isCreatingMaterial ? (
                <>
                  <span
                    className="
                      loading
                      loading-spinner
                      loading-sm
                    "
                  />

                  Adding...
                </>
              ) : (
                "Add Material"
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddMaterialModal;