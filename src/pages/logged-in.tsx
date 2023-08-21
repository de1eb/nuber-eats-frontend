import { Navigate } from "react-router-dom";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { Restaurants } from "./client/restaurants";

export const LoggedIn = () => {
  const { data, loading, error } = useMe();
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <div>
      <Header />
      {data.me.role === "Client" && <Restaurants />}
      <Navigate to="/" />
    </div>
  );
};
