import { X, UserPlus } from "lucide-react";

const AddStudentModal = ({
  availableStudents,
  isLoadingAvailableStudents,
  selectedStudentId,
  onSelectedStudentChange,
  onAddStudent,
  isAddingStudent,
  onClose,
}) => {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-base-100 rounded-xl shadow-xl max-w-md w-full p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-bold text-base-content">
                Add Student
              </h3>
            </div>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-circle btn-sm"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* Student select */}
            <div>
              <label className="label">
                <span className="label-text font-medium">
                  Select a student
                </span>
              </label>

              <select
                value={selectedStudentId}
                onChange={(e) =>
                  onSelectedStudentChange(e.target.value)
                }
                disabled={
                  isLoadingAvailableStudents ||
                  isAddingStudent
                }
                className="select select-bordered w-full"
              >
                <option value="">
                  {isLoadingAvailableStudents
                    ? "Loading students..."
                    : availableStudents.length === 0
                      ? "No students available"
                      : "Choose a student"}
                </option>

                {availableStudents.map((student) => (
                  <option
                    key={student.id}
                    value={student.id}
                  >
                    {student.full_name}
                  </option>
                ))}
              </select>

              {availableStudents.length === 0 &&
                !isLoadingAvailableStudents && (
                  <p className="text-xs text-base-content/50 mt-2">
                    All available students are already
                    in this section
                  </p>
                )}
            </div>

            {/* Student info preview */}
            {selectedStudentId &&
              availableStudents.find(
                (s) => s.id == selectedStudentId
              ) && (
                <div className="bg-base-200/50 rounded-lg p-4">
                  {(() => {
                    const student =
                      availableStudents.find(
                        (s) => s.id == selectedStudentId
                      );
                    return (
                      <div className="flex gap-3">
                        {student.profile_pic ? (
                          <img
                            src={
                              student.profile_pic
                            }
                            alt={student.full_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">
                              {student.full_name
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-base-content">
                            {student.full_name}
                          </p>
                          <p className="text-xs text-base-content/60">
                            {student.email}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="btn btn-ghost flex-1"
            >
              Cancel
            </button>

            <button
              onClick={onAddStudent}
              disabled={
                !selectedStudentId || isAddingStudent
              }
              className="btn btn-primary flex-1"
            >
              {isAddingStudent ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Adding...
                </>
              ) : (
                "Add Student"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStudentModal;