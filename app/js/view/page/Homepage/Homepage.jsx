import { Trans } from "@lingui/macro";
import React from "react";

import { ChangeLanguage } from "../../component/change-language/ChangeLanguage.jsx";

import { PokemonList } from "../../module/Pokemon";

export function Homepage() {
  return (
    <section>
      <ChangeLanguage />
      <h1 className="h2"><Trans>Pokemon list</Trans></h1>

      <PokemonList />
    </section>
  );
}
