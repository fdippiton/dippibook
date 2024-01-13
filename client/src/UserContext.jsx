import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                            Get user information                            */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!user) {
      const fetchData = async () => {
        const { data } = await axios.get("/profile", { withCredentials: true });
        setUser(data);
        setReady(true);
      };
      fetchData();
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
