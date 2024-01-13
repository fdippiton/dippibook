import React, { useContext } from "react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../UserContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  /* -------------------------------------------------------------------------- */
  /*                                 HandleLogin                                */
  /* -------------------------------------------------------------------------- */
  /**
   * The function `handleLoginUser` is an asynchronous function that sends a POST request to the "/login"
   * endpoint with the user's email and password, and sets the redirect state to true if the login is
   * successful.
   */
  const handleLoginUser = async (ev) => {
    ev.preventDefault();

    try {
      const { data } = await axios.post(
        "/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      setUser(data);
      setRedirect(true);
      alert("Login successful.");
    } catch (error) {
      alert("Login failed.");
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64 border p-3 rounded-md">
        <h1 className="text-4xl text-center mb-4 ">Login</h1>

        <form className="max-w-md mx-auto " onSubmit={handleLoginUser}>
          <input
            type="email"
            name=""
            id=""
            placeholder="your@email.com"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            name=""
            id=""
            placeholder="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />

          <button className="primary">Login</button>

          <div className="text-center py-2 text-gray-500">
            Dont't have an account yet?{" "}
            <Link className="underline text-black" to={"/register"}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
