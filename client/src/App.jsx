import { useEffect, useState } from "react";
import "./App.css";
import { Link, Route, Routes } from "react-router-dom";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import AccountPage from "./pages/AccountPage";

/* `axios.defaults.baseURL = "http://localhost:4000";` sets the default base URL for all Axios requests
in the application. In this case, it sets the base URL to "http://localhost:4000", which means that
all requests made with Axios will be sent to this URL unless explicitly specified otherwise. */
axios.defaults.baseURL = "http://localhost:4000";
// axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account/:subpage?" element={<AccountPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
