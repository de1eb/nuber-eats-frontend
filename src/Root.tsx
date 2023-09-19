import { useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authTokenVar } from "./apollo";

function Root() {
  // const isLoggedIn = useReactiveVar(authTokenVar);
  // useEffect(() => {
  //   if (isLoggedIn) {
  //     return <Navigate to="loggedIn" />;
  //   } else {
  //     return <Navigate to="login" />;
  //   }
  // }, [isLoggedIn]);

  // return (
  //   <div>
  //     <Outlet />
  //   </div>
  // );
  const isLoggedIn = useReactiveVar(authTokenVar);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [route, setRoute] = useState("");
  useEffect(() => {
    isLoggedIn ? setRoute("loggedIn") : setRoute("login");
  }, [isLoggedIn]);
  return (
    <div>
      <Outlet />
      {route && <Navigate to={route} />}
      {/* {isLoggedIn ? <Navigate to="loggedIn" /> : <Navigate to="login" />} */}
    </div>
  );
}

export default Root;
