import React, { createContext, useState, useCallback } from "react";

export const DialogContext = createContext();

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState({
    title: "",
    message: "",
  });

  const setMessage = useCallback((title = "", message) => {
    setDialog({ title, message });
  }, []);

  return <DialogContext.Provider value={{ dialog, setMessage }}>
    {children}
  </DialogContext.Provider>;
}
