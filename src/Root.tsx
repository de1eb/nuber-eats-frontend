import { useReactiveVar } from "@apollo/client";
import { Outlet } from "react-router-dom";
import { authTokenVar } from "./apollo";
import { LoggedIn } from "./pages/logged-in";
import { Login } from "./pages/login";

function Root() {
  const isLoggedIn = useReactiveVar(authTokenVar);
  return (
    <div>
      <Outlet />
      {isLoggedIn ? <LoggedIn /> : <Login />}
    </div>
  );
}

export default Root;
