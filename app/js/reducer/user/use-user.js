import { useReducer } from "react";

import { userReducer, initialUser } from "./reducer";

export function useUser() {
  const [user, dispatchUser] = useReducer(userReducer, initialUser);

  return { user, dispatchUser };
}
