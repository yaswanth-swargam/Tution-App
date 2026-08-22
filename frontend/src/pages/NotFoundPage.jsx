import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
      <div className="max-w-sm text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral/40">
          404
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-neutral/50">
          That route doesn’t exist. Head back to the dashboard.
        </p>
        <Link
          to={ROUTES.DASHBOARD}
          className="btn btn-primary btn-sm mt-6 rounded-xl"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
