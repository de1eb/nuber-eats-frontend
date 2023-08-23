import { Navigate, Outlet } from "react-router-dom";

export const LoggedOut = () => {
  return (
    <div>
      <Outlet />
      <Navigate to="/login" replace={true} />
    </div>
  );
};
