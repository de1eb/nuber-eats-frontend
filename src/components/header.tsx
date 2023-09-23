import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { authTokenVar, client } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { useMe } from "../hooks/useMe";
import nuberLogo from "../images/logo.svg";
import logout from "../images/logout.svg";

export const Header: React.FC = () => {
  const { data } = useMe();
  const navigate = useNavigate();
  const onClick = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    authTokenVar(null);
    client.clearStore();
    navigate("/");
  };

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-base text-white">
          <span>Please verify your email.</span>
        </div>
      )}
      <header className="py-4">
        <div className="w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center">
          <Link to="restaurants">
            <img src={nuberLogo} className="w-44" alt="Nuber Eats" />
          </Link>
          <span className="text-xs flex items-center">
            <span className="text-xs relative group">
              <Link to="edit-profile">
                <FontAwesomeIcon icon={faUser} className="text-3xl mr-5" />
              </Link>
              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Edit Profile
              </span>
            </span>
            <button onClick={onClick} className="relative group">
              <img src={logout} className="w-12 h-12" alt="Logout" />
              <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Logout
              </span>
            </button>
          </span>
        </div>
      </header>
    </>
  );
};
