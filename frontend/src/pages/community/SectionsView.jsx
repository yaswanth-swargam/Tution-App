import { useState } from "react";
import {
  BookOpen,
  Users,
  Plus,
  X,
  MessageCircle,
  Search,
} from "lucide-react";

import SectionCard from "./SectionCard";

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
}) => {
  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [sectionName, setSectionName] =
    useState("");

  const [isCreating, setIsCreating] =
    useState(false);

  // =========================
  // DIRECT MESSAGE SEARCH
  // =========================

  const [searchQuery, setSearchQuery] =
    useState("");

  const filteredConversations =
    conversations.filter((user) => {
      const query =
        searchQuery.toLowerCase().trim();

      if (!query) return true;

      return (
        user.full_name
          ?.toLowerCase()
          .includes(query) ||

        user.email
          ?.toLowerCase()
          .includes(query) ||

        user.role
          ?.toLowerCase()
          .includes(query)
      );
    });

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
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* ================= HEADER ================= */}

      <div className="border-b border-base-300 px-6 py-6 md:px-8 md:py-8">

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

      <div className="flex-1 overflow-y-auto">

        <div className="px-6 py-8 md:px-8 space-y-10">


          {/* ========================================
              DIRECT MESSAGES
          ========================================= */}

          <section>

            <div className="flex items-center gap-3 mb-5">

              <div className="p-2 rounded-lg bg-primary/10">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Direct Messages
                </h2>

                <p className="text-sm text-base-content/60">
                  {authUser?.role === "admin"
                    ? "Search and message students or other administrators"
                    : "Message your administrators directly"}
                </p>
              </div>

            </div>


            {/* ================= SEARCH BAR ================= */}

            {!isLoadingConversations && (
              <div className="relative mb-5">

                <Search
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    w-5
                    h-5
                    text-base-content/40
                  "
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) =>
                    setSearchQuery(
                      e.target.value
                    )
                  }
                  placeholder={
                    authUser?.role === "admin"
                      ? "Search students or administrators..."
                      : "Search administrators..."
                  }
                  className="
                    input
                    input-bordered
                    w-full
                    pl-11
                  "
                />

              </div>
            )}


            {/* ================= LOADING ================= */}

            {isLoadingConversations ? (

              <div className="flex justify-center py-8">

                <span className="
                  loading
                  loading-spinner
                  loading-lg
                  text-primary
                " />

              </div>

            ) : filteredConversations.length === 0 ? (

              <div className="border border-base-300 rounded-xl p-8 text-center">

                <MessageCircle className="
                  w-12
                  h-12
                  mx-auto
                  mb-3
                  text-base-content/30
                " />

                <h3 className="font-semibold">

                  {searchQuery
                    ? "No users found"
                    : "No users available"}

                </h3>

                <p className="text-sm text-base-content/50 mt-1">

                  {searchQuery
                    ? "Try searching with a different name or email"
                    : "Users available for direct messaging will appear here"}

                </p>

              </div>

            ) : (

              <>

                {/* SEARCH RESULT COUNT */}

                {searchQuery && (

                  <p className="text-xs text-base-content/50 mb-3">

                    {filteredConversations.length}{" "}

                    {filteredConversations.length === 1
                      ? "person found"
                      : "people found"}

                  </p>

                )}


                {/* ================= USER GRID ================= */}

                <div className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  lg:grid-cols-3
                  gap-4
                ">

                  {filteredConversations.map(
                    (user) => (

                      <button
                        key={user.id}
                        onClick={() =>
                          onSelectDirectUser(user)
                        }
                        className="
                          w-full
                          flex
                          items-center
                          gap-4
                          p-4
                          rounded-xl
                          border
                          border-base-300
                          bg-base-100
                          hover:bg-base-200
                          hover:border-primary/40
                          transition-all
                          text-left
                        "
                      >

                        {/* AVATAR */}

                        <div className="avatar placeholder">

                          <div className="
                            w-12
                            rounded-full
                            bg-primary
                            text-primary-content
                          ">

                            {user.profile_pic ? (

                              <img
                                src={user.profile_pic}
                                alt={user.full_name}
                              />

                            ) : (

                              <span className="text-lg">

                                {user.full_name
                                  ?.charAt(0)
                                  ?.toUpperCase()}

                              </span>

                            )}

                          </div>

                        </div>


                        {/* USER INFO */}

                        <div className="
                          flex-1
                          min-w-0
                        ">

                          <h3 className="
                            font-semibold
                            truncate
                          ">

                            {user.full_name}

                          </h3>


                          <p className="
                            text-sm
                            text-base-content/60
                            truncate
                          ">

                            {user.email}

                          </p>


                          <div className="mt-1">

                            <span className="
                              badge
                              badge-sm
                              badge-outline
                            ">

                              {user.role === "admin"
                                ? "Administrator"
                                : "Student"}

                            </span>

                          </div>

                        </div>

                      </button>

                    )
                  )}

                </div>

              </>

            )}

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