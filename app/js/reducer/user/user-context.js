import React, { createContext, useReducer } from "react";

import { userReducer, initialUser } from "./reducer";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, dispatch] = useReducer(userReducer, initialUser);

  return <UserContext.Provider value={{ user, dispatch }}>
    {children}
  </UserContext.Provider>;
}
