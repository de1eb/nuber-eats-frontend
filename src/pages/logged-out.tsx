import { Outlet } from "react-router-dom";

export const LoggedOut = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};
