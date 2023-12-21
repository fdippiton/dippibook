import React, { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import { Navigate, Link, useParams } from "react-router-dom";
import axios from "axios";
function AccountPage() {
  const { ready, user } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }
  console.log(subpage);

  const logout = () => {
    axios.post("/logout", { withCredentials: true });
    setRedirect(true);
  };

  if (!ready) {
    return "Loading...";
  }

  if (ready && !user) {
    return <Navigate to={"/login"} />;
  }

  // function linkClasses(type = null) {
  //   let classes = "py-2 px-6";
  //   if (type === subpage || (subpage === undefined && type === "profile")) {
  //     classes += "bg-primary text-white rounded-full";
  //   }
  //   return classes;
  // }

  /**
   * The function `linkClasses` returns a string of CSS classes based on the `type` parameter and the
   * value of `subpage`. If the `type` parameter is equal to the `subpage` variable, it will return
   * a string that combines the `baseClasses` variable with additional classes for background color, text
   * color, and rounded corners. If the `type` parameter is not equal to the `subpage` variable, it will
   * return just the `baseClasses` variable.
   */
  function linkClasses(type) {
    const baseClasses = "py-2 px-6";
    const isActive = type === subpage;

    return isActive
      ? `${baseClasses} bg-primary text-white rounded-full`
      : baseClasses;
  }

  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div>
      <nav className="w-full flex  justify-center mt-8 gap-2 mb-8">
        <Link className={linkClasses("profile")} to={"/account"}>
          My profile
        </Link>
        <Link className={linkClasses("bookings")} to={"/account/bookings"}>
          My bookings
        </Link>
        <Link className={linkClasses("places")} to={"/account/places"}>
          My accommodations
        </Link>
      </nav>

      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name}({user.email}) <br />
          <button onClick={logout} className="primary max-w-sm mt-2">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default AccountPage;
