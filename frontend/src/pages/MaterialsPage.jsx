import { useEffect, useState } from "react";
import {
  FileText,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import SectionCard from "../components/materials/SectionCard.jsx";
import PageHeader from "../components/common/PageHeader.jsx";
import AddMaterialModal from "../components/materials/AddMaterialModal.jsx";
import MaterialCard from "../components/materials/MaterialCard.jsx";
import EditMaterialModal from "../components/materials/EditMaterialModal.jsx";
import {
  fetchSections,
} from "../store/chatActions.js";

import {
  fetchSectionMaterials,
  deleteStudyMaterial,
} from "../store/studyMaterialActions.js";



// ==========================================
// MAIN PAGE
// ==========================================

const MaterialsPage = () => {
  const dispatch = useDispatch();


  // ==========================================
  // LOCAL STATE
  // ==========================================

  const [
    selectedSection,
    setSelectedSection,
  ] = useState(null);

  const [
  showAddMaterial,
  setShowAddMaterial,
] = useState(false);


const [
  editingMaterial,
  setEditingMaterial,
] = useState(null);


  // ==========================================
  // REDUX
  // ==========================================

  const {
    sections,
  } = useSelector(
    (state) => state.chat
  );


  const {
    studyMaterials,
    isLoadingMaterials,
  } = useSelector(
    (state) => state.studyMaterial
  );


  const {
    authUser,
  } = useSelector(
    (state) => state.auth
  );


  // ==========================================
  // INITIAL SECTION FETCH
  // ==========================================

  useEffect(() => {
    dispatch(fetchSections());
  }, [dispatch]);


  // ==========================================
  // SELECT SECTION
  // ==========================================

  const handleSelectSection = (
    section
  ) => {
    setSelectedSection(section);

    dispatch(
      fetchSectionMaterials(
        section.id
      )
    );
  };

  // ==========================================
// EDIT MATERIAL
// ==========================================

const handleEditMaterial = (material) => {
  setEditingMaterial(material);
};


// ==========================================
// DELETE MATERIAL
// ==========================================

const handleDeleteMaterial = async (material) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${material.title}"?`
  );

  if (!confirmed) {
    return;
  }

  try {
    await dispatch(
      deleteStudyMaterial(material.id)
    );

    // Refresh current section
    await dispatch(
      fetchSectionMaterials(
        selectedSection.id
      )
    );

  } catch (error) {
    console.error(
      "Failed to delete material:",
      error
    );

    window.alert(
      error.response?.data?.message ||
        "Failed to delete material."
    );
  }
};
  // ==========================================
  // BACK TO SECTIONS
  // ==========================================

  const handleBack = () => {
    setSelectedSection(null);
  };


  // ==========================================
  // ADMIN
  // ==========================================

  const isAdmin =
    authUser?.role === "admin";


  // ==========================================
  // RENDER — SECTION LIST
  // ==========================================

  if (!selectedSection) {
    return (
      <div>

        <PageHeader
          eyebrow="Library"
          title="Study materials"
          subtitle={
            isAdmin
              ? "Resources from all your sections."
              : "Notes, videos, and resources from your sections."
          }
        />


        {sections.length === 0 ? (

          <div
            className="
              rounded-xl
              border
              border-base-300
              px-6
              py-14
              text-center
            "
          >

            <FileText
              className="
                mx-auto
                mb-3
                h-12
                w-12
                text-base-content/20
              "
            />

            <h2
              className="
                font-semibold
                text-base-content
              "
            >
              No sections available
            </h2>

            <p
              className="
                mx-auto
                mt-1
                max-w-sm
                text-sm
                text-base-content/50
              "
            >
              You don't have any sections
              available yet.
            </p>

          </div>

        ) : (

          <div
            className="
              grid
              gap-3
              sm:grid-cols-2
            "
          >

            {sections.map(
              (section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  onSelect={
                    handleSelectSection
                  }
                />
              )
            )}

          </div>

        )}

      </div>
    );
  }


  // ==========================================
  // RENDER — SELECTED SECTION
  // ==========================================

  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">

        <button
          type="button"
          onClick={handleBack}
          className="
            btn
            btn-ghost
            btn-sm
            mb-4
            -ml-2
          "
        >
          <ArrowLeft size={17} />

          All sections
        </button>


        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div>

            <p
              className="
                text-[11px]
                font-semibold
                uppercase
                tracking-wide
                text-primary
              "
            >
              Study materials
            </p>

            <h1
              className="
                mt-1
                text-2xl
                font-bold
                text-base-content
              "
            >
              {selectedSection.name}
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-base-content/50
              "
            >
              Resources available in this
              section.
            </p>

          </div>


          {/* ADMIN ADD BUTTON */}

          {isAdmin && (
            <button
              type="button"
              className="
                btn
                btn-primary
                btn-sm
                shrink-0
              "
              onClick={() =>
  setShowAddMaterial(true)
}
            >
              <Plus size={17} />

              Add Material
            </button>
          )}

        </div>

      </div>


      {/* MATERIALS */}

      {/* ==========================================
    MATERIALS
========================================== */}

{isLoadingMaterials ? (

  <div className="py-16 text-center">

    <span
      className="
        loading
        loading-spinner
        loading-md
        text-primary
      "
    />

    <p
      className="
        mt-3
        text-sm
        text-base-content/50
      "
    >
      Loading study materials...
    </p>

  </div>

) : studyMaterials.length === 0 ? (

  <div
    className="
      rounded-xl
      border
      border-base-300
      px-6
      py-14
      text-center
    "
  >

    <FileText
      className="
        mx-auto
        mb-3
        h-12
        w-12
        text-base-content/20
      "
    />

    <h2
      className="
        font-semibold
        text-base-content
      "
    >
      No study materials yet
    </h2>

    <p
      className="
        mx-auto
        mt-1
        max-w-sm
        text-sm
        text-base-content/50
      "
    >
      {isAdmin
        ? "Add a PDF, video, file, or resource to this section."
        : "Materials added to this section will appear here."
      }
    </p>

  </div>

) : (

  <div
    className="
      grid
      gap-3
      sm:grid-cols-2
    "
  >

    {studyMaterials.map(
      (item) => (
        <MaterialCard
          key={item.id}
          item={item}
          isAdmin={isAdmin}
  onEdit={handleEditMaterial}
  onDelete={handleDeleteMaterial}
        />
      )
    )}

  </div>

)}

{/* ==========================================
    ADD MATERIAL MODAL
========================================== */}

{showAddMaterial && (
  <AddMaterialModal
    section={selectedSection}
    onClose={() =>
      setShowAddMaterial(false)
    }
  />
)}




{/* ==========================================
    EDIT MATERIAL MODAL
========================================== */}

{editingMaterial && (
  <EditMaterialModal
    material={editingMaterial}
    onClose={() =>
      setEditingMaterial(null)
    }
    onUpdated={() => {
      dispatch(
        fetchSectionMaterials(
          selectedSection.id
        )
      );
    }}
  />
)}



   
    </div>
  );
};

export default MaterialsPage;