import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUser } from "../store/authActions";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { authUser } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsCreating(true);

    try {
      await dispatch(createUser(formData));

      setFormData({
        fullName: "",
        email: "",
        password: "",
        role: "student",
      });
    } catch (error) {
      // Error toast is already handled in authActions
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-base-content/60">
            Welcome, {authUser?.fullName}
          </p>
        </div>

        {/* Create User */}
        <div className="rounded-2xl bg-base-100 p-8 shadow-lg">

          <h2 className="mb-6 text-2xl font-semibold">
            Create User
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Full Name
                </span>
              </label>

              <input
                type="text"
                name="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Email
                </span>
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Password
                </span>
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter temporary password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered w-full"
                minLength={6}
                required
              />
            </div>

            {/* Role */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Role
                </span>
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="student">
                  Student
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  Creating...
                </>
              ) : (
                "Create User"
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;