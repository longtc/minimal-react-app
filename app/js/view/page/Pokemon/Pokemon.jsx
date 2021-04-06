import { useContext, useCallback } from "react";

import { AppContext } from "../../../context/app-context";

import { DialogMessage } from "../../component/dialog/DialogMessage.jsx";
import { PokemonDetails } from "../../module/Pokemon";

import "./style.css";

export function Pokemon({ match }) {

  const { setDialogMessage } = useContext(AppContext);

  const openDialog = useCallback(() => {
    setDialogMessage(
      "The dialog title",
      "And this is the content");
  }, [setDialogMessage]);

  return (
    <section>
      <PokemonDetails name={match.params.pokemonName} />
      <p className="mb-3" styleName="some-paragraph">
        This paragraph is just to show that you can use css module.
      </p>
      <button onClick={openDialog}>Open dialog</button>
      <DialogMessage />
    </section>
  );
}
