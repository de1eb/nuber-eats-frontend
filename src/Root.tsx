import { useReactiveVar } from "@apollo/client";
import { Navigate, Outlet } from "react-router-dom";
import { authTokenVar } from "./apollo";

function Root() {
  const isLoggedIn = useReactiveVar(authTokenVar);
  return (
    <div>
      <Outlet />
      {isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />}
    </div>
  );
}

export default Root;
