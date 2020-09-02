import React, { useContext, useCallback } from "react";

import { AppContext } from "../../../context/app-context";

import { DialogMessage } from "../../component/dialog/DialogMessage.jsx";

import "./style.css";

export default function PokemonDetails() {

  const { setDialogMessage } = useContext(AppContext);

  const openDialog = useCallback(() => {
    setDialogMessage(
      "The dialog title",
      "And this is the content");
  }, [setDialogMessage]);

  return (
    <section>
      <h1 className="h3">This page is empty</h1>
      <p className="mb-3" styleName="some-paragraph">
        This paragraph is just to show that you can use css module.
      </p>
      <button onClick={openDialog}>Open dialog</button>
      <DialogMessage />
    </section>
  );
}
