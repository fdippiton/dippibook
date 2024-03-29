import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

function AccountPage() {
  const { ready, user, setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  /* --------------------------------- Logout --------------------------------- */
  const logout = () => {
    axios.post("/logout", { withCredentials: true });
    setUser(null);
    setRedirect(true);
  };

  if (!ready) {
    return "Loading...";
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  // function linkClasses(type = null) {
  //   let classes = "py-2 px-6";
  //   if (type === subpage || (subpage === undefined && type === "profile")) {
  //     classes += "bg-primary text-white rounded-full";
  //   }
  //   return classes;
  // }

  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div>
      <AccountNav />
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name}({user.email}) <br />
          <button onClick={logout} className="primary max-w-sm mt-2">
            Logout
          </button>
        </div>
      )}

      {subpage === "places" && <PlacesPage />}
    </div>
  );
}

export default AccountPage;
