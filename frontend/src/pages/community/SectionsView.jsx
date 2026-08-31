import { useState } from "react";
import {
  BookOpen,
  Users,
  Plus,
  X,
} from "lucide-react";

import SectionCard from "./SectionCard";
import DirectConversationsPanel from "./DirectConversationsPanel";

const SectionsView = ({
  sections,
  isLoadingSections,
  onSelectSection,
  authUser,
  onCreateSection,

  // Direct Messages
  conversations,
  isLoadingConversations,
  onSelectDirectUser,
  onlineUsers = [],


  unreadSectionCounts = {}
}) => {
  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [sectionName, setSectionName] =
    useState("");

  const [isCreating, setIsCreating] =
    useState(false);

  // =========================
  // CREATE SECTION
  // =========================

  const handleCreateSection = async (e) => {
    e.preventDefault();

    if (!sectionName.trim()) {
      return;
    }

    try {
      setIsCreating(true);

      await onCreateSection(
        sectionName.trim()
      );

      setSectionName("");
      setShowCreateModal(false);

    } catch (error) {
      console.error(
        "Failed to create section:",
        error
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">

      {/* ================= HEADER ================= */}

      <div className="shrink-0 border-b border-base-300 px-6 py-6 md:px-8 md:py-8">

        <div className="flex items-start justify-between gap-4">

          <div>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-primary" />

              <h1 className="text-3xl font-bold text-base-content">
                Community
              </h1>
            </div>

            <p className="text-sm text-base-content/60">
              {authUser?.role === "admin"
                ? "Manage your sections and connect with students"
                : "Stay connected with your classes and administrators"}
            </p>
          </div>

          {/* CREATE SECTION */}

          {authUser?.role === "admin" && (
            <button
              onClick={() =>
                setShowCreateModal(true)
              }
              className="btn btn-primary gap-2"
            >
              <Plus className="w-5 h-5" />

              <span className="hidden sm:inline">
                Create Section
              </span>
            </button>
          )}

        </div>
      </div>


      {/* ================= CONTENT ================= */}

      <div className="min-h-0 flex-1 overflow-y-auto">

        <div className="px-6 py-8 md:px-8 space-y-10">


          {/* ========================================
              DIRECT MESSAGES
          ========================================= */}

          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold">
                Direct Messages
              </h2>
              <p className="text-sm text-base-content/60">
                {authUser?.role === "admin"
                  ? "Recent chats, or search to message someone new"
                  : "Your recent direct conversations"}
              </p>
            </div>

            <DirectConversationsPanel
              conversations={conversations}
              isLoading={isLoadingConversations}
              onSelectUser={onSelectDirectUser}
              authUser={authUser}
              onlineUsers={onlineUsers}
            />
          </section>


          {/* ========================================
              SECTIONS
          ========================================= */}

          <section>

            <div className="flex items-center justify-between mb-5">

              <div>

                <h2 className="text-xl font-bold">
                  Sections
                </h2>

                <p className="
                  text-sm
                  text-base-content/60
                ">

                  Your learning communities

                </p>

              </div>

              {authUser?.role === "admin" && (
                <span className="
                  badge
                  badge-outline
                ">
                  {sections.length}
                </span>
              )}

            </div>


            {/* ================= SECTIONS LOADING ================= */}

            {isLoadingSections ? (

              <div className="
                flex
                items-center
                justify-center
                py-12
              ">

                <span className="
                  loading
                  loading-spinner
                  loading-lg
                  text-primary
                " />

              </div>

            ) : sections.length === 0 ? (

              <div className="
                text-center
                border
                border-base-300
                rounded-xl
                py-12
                px-6
              ">

                <Users className="
                  w-16
                  h-16
                  mx-auto
                  mb-4
                  text-base-content/30
                " />

                <h3 className="
                  text-lg
                  font-semibold
                  text-base-content/70
                  mb-2
                ">

                  No sections yet

                </h3>

                <p className="
                  text-sm
                  text-base-content/50
                ">

                  {authUser?.role === "admin"
                    ? "Create your first section to start building your learning community"
                    : "You'll see your sections here once they're created"}

                </p>


                {authUser?.role === "admin" && (

                  <button
                    onClick={() =>
                      setShowCreateModal(true)
                    }
                    className="
                      btn
                      btn-primary
                      mt-5
                      gap-2
                    "
                  >

                    <Plus className="w-5 h-5" />

                    Create Section

                  </button>

                )}

              </div>

            ) : (

              <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                gap-6
              ">

                {sections.map(
                  (section) => (

                    <SectionCard
                      key={section.id}
                      section={section}
                      onClick={() =>
                        onSelectSection(section)
                      }
                      unreadCount={
        unreadSectionCounts[section.id] || 0
      }
                    />

                  )
                )}

              </div>

            )}

          </section>

        </div>

      </div>


      {/* ========================================
          CREATE SECTION MODAL
      ========================================= */}

      {showCreateModal && (

        <div className="modal modal-open">

          <div className="modal-box relative">

            <button
              onClick={() => {
                if (!isCreating) {
                  setShowCreateModal(false);
                  setSectionName("");
                }
              }}
              className="
                btn
                btn-sm
                btn-circle
                btn-ghost
                absolute
                right-3
                top-3
              "
            >
              <X className="w-5 h-5" />
            </button>


            <h3 className="font-bold text-xl">
              Create New Section
            </h3>


            <p className="
              text-sm
              text-base-content/60
              mt-2
            ">
              Create a section where you can communicate with selected students.
            </p>


            <form
              onSubmit={handleCreateSection}
              className="mt-6"
            >

              <label className="
                form-control
                w-full
              ">

                <div className="label">

                  <span className="label-text">
                    Section Name
                  </span>

                </div>


                <input
                  type="text"
                  value={sectionName}
                  onChange={(e) =>
                    setSectionName(
                      e.target.value
                    )
                  }
                  placeholder="e.g. DBMS - Section A"
                  className="
                    input
                    input-bordered
                    w-full
                  "
                  autoFocus
                  disabled={isCreating}
                />

              </label>


              <div className="
                flex
                justify-end
                gap-3
                mt-6
              ">

                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setSectionName("");
                  }}
                  className="btn btn-ghost"
                  disabled={isCreating}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="
                    btn
                    btn-primary
                  "
                  disabled={
                    !sectionName.trim() ||
                    isCreating
                  }
                >

                  {isCreating ? (

                    <>
                      <span className="
                        loading
                        loading-spinner
                        loading-sm
                      " />

                      Creating

                    </>

                  ) : (

                    <>

                      <Plus className="w-4 h-4" />

                      Create Section

                    </>

                  )}

                </button>

              </div>

            </form>

          </div>


          <div
            className="modal-backdrop"
            onClick={() => {
              if (!isCreating) {
                setShowCreateModal(false);
                setSectionName("");
              }
            }}
          />

        </div>

      )}

    </div>
  );
};

export default SectionsView;