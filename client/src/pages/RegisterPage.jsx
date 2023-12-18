import React from "react";
import { Link, Route, Routes } from "react-router-dom";

function RegisterPage() {
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto border">
          <input type="text" name="" id="" placeholder="John Doe" />
          <input type="email" name="" id="" placeholder="your@email.com" />
          <input type="password" name="" id="" placeholder="password" />
          <button className="primary">Login</button>
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
