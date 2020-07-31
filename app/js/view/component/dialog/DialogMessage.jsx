import React, { useContext, useCallback } from "react";

import { DialogContext } from "../../../reducer/dialog/dialog-context.js";

import { Modal } from "../Modal.jsx";

// Inject this component into a page that you want to show dialog
export function DialogMessage() {

  const { dialog, setMessage } = useContext(DialogContext);

  const closeDialog = useCallback(() => setMessage("", ""), [setMessage]);

  return (
    <Modal
      isOpen={dialog.message}
      onClose={closeDialog}
    >
      <section className="w-full">
        {dialog.title && <h1 className="mb-3 h3 leading-none">{dialog.title}</h1>}
        <p className="h4">{dialog.message}</p>
      </section>
    </Modal>
  );
}
