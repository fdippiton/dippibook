import React from "react";
import { useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async (ev) => {
    ev.preventDefault();

    try {
      await axios.post("/register", {
        name,
        email,
        password,
      });

      alert("Registration successful.");
      <Navigate to={"/login"} />;
    } catch (error) {
      alert("Registration failed.");
    }
  };

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto border" onSubmit={registerUser}>
          <input
            type="text"
            name=""
            id=""
            placeholder="John Doe"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
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
          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">
            Already have an account ?{" "}
            <Link className="underline text-black" to={"/login"}>
              Login now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
