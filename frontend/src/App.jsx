import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "./lib/socket.js";
import AppRouter from "./routes/AppRouter";
import { checkAuth } from "./store/authActions";

const App = () => {
  const dispatch = useDispatch();

  const { isCheckingAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected to Socket.IO:", socket.id);

      socket.emit("join_section", 2);

      console.log("Requested to join section:2");
    };

    socket.on("connect", handleConnect);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
    };
  }, []);

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