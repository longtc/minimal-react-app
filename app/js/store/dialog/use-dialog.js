import { useState, useCallback } from "react";

export function useDialog() {
  const [dialog, setDialog] = useState({
    title: "",
    message: "",
  });

  const setDialogMessage = useCallback((title = "", message) => {
    setDialog({ title, message });
  }, []);

  return { dialog, setDialogMessage };
}
