import { useReactiveVar } from "@apollo/client";
import { isLoggedInVar } from "./apollo";
import { LoggedIn } from "./pages/logged-in";
import { LoggedOut } from "./pages/logged-out";

function Root() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return <div>{isLoggedIn ? <LoggedIn /> : <LoggedOut />}</div>;
}

export default Root;
