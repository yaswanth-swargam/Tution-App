import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppRouter from "./routes/AppRouter";
import { checkAuth } from "./store/authActions";

const App = () => {
  const dispatch = useDispatch();

  const { isCheckingAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return <AppRouter />;
};

export default App;