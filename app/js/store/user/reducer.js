import produce from "immer";

import { LOGIN_SUCCESS } from "./action";

export const initialUser = {
  accessToken: "",
  refreshToken: "",
  userId: "",
  userName: "",
};

export function userReducer(state, action) {
  // eslint-disable-next-line no-unused-vars
  return produce(state, draft => {
    switch (action.type) {
      case LOGIN_SUCCESS: {
        return action.user;
        // break;
      }
    }
  });
}
