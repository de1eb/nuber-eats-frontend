import { useReactiveVar } from "@apollo/client";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authTokenVar } from "./apollo";

function Root() {
  const isLoggedIn = useReactiveVar(authTokenVar);
  const location = useLocation();
  return (
    <div>
      <Outlet />
      {isLoggedIn ? location.pathname === "/login" ? <Navigate to="/home" /> : null : <Navigate to="/login" />}
    </div>
  );
}

export default Root;
