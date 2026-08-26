import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { socket } from "./lib/socket.js";

import AppRouter from "./routes/AppRouter";
import { checkAuth } from "./store/authActions";
import { setOnlineUsers } from "./store/chatSlice";

const App = () => {
  const dispatch = useDispatch();

  const { isCheckingAuth, authUser } = useSelector(
    (state) => state.auth
  );

  // Check authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Listen for online users
  useEffect(() => {
    const handleOnlineUsers = (users) => {
      console.log("Online users:", users);

      dispatch(setOnlineUsers(users));
    };

    socket.on("online_users", handleOnlineUsers);

    return () => {
      socket.off("online_users", handleOnlineUsers);
    };
  }, [dispatch]);

  // Handle socket connection
  useEffect(() => {
    const handleConnect = () => {
      console.log("Connected to Socket.IO:", socket.id);

      if (authUser?.id) {
        socket.emit("user_online", authUser.id);

        console.log(
          `Marked user ${authUser.id} as online`
        );
      }
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [authUser]);

  // If socket is already connected when auth finishes
  useEffect(() => {
    if (socket.connected && authUser?.id) {
      socket.emit("user_online", authUser.id);

      console.log(
        `Marked user ${authUser.id} as online`
      );
    }
  }, [authUser]);

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