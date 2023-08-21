import { useReactiveVar } from "@apollo/client";
import { Outlet } from "react-router-dom";
import { isLoggedInVar } from "./apollo";
import { LoggedIn } from "./pages/logged-in";

function Root() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return isLoggedIn ? <LoggedIn /> : <Outlet />;
  // return <Outlet />;
}

export default Root;
