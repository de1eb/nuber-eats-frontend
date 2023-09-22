import { Navigate } from "react-router-dom";

export const LoggedOut = () => {
  return (
    <div>
      <Navigate to="/login" />
    </div>
  );
};
