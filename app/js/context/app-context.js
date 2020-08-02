import React, { createContext } from "react";

import { useLocale } from "../store/locale/use-locale";
import { useUser } from "../store/user/use-user";
import { useDialog } from "../store/dialog/use-dialog";

export const AppContext = createContext();

export function AppContextProvider({ children }) {

  const { locale, setLocale } = useLocale();
  const { user, dispatchUser } = useUser();
  const { dialog, setDialogMessage } = useDialog();

  return <AppContext.Provider value={{
    locale, setLocale,
    user, dispatchUser,
    dialog, setDialogMessage,
  }}>
    {children}
  </AppContext.Provider>;
}
