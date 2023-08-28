import { useReactiveVar } from "@apollo/client";
import { Navigate, Outlet } from "react-router-dom";
import { authTokenVar } from "./apollo";

function Root() {
  // const isLoggedIn = makeVar(localStorage.getItem(LOCALSTORAGE_TOKEN));
  const isLoggedIn = useReactiveVar(authTokenVar);
  return (
    <div>
      <Outlet />
      {isLoggedIn ? <Navigate to="loggedIn" /> : <Navigate to="login" />}
    </div>
  );
}

export default Root;
