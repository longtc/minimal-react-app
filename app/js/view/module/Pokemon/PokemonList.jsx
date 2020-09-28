import { Trans } from "@lingui/macro";
import { mdiPokeball } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";


import { parse } from "../../../util/request";
import { useRequest } from "../../../hook/use-request";
import { getPokemonList } from "../../../api/pokemon/query";

import { LoadingIndicator } from "../../component/animation/LoadingIndicator.jsx";
import { ButtonPaging } from "../../component/paging/ButtonPaging.jsx";

export function PokemonList() {

  const [pagingButton, setPagingButton] = useState({
    next: null, // { offset, limit }
    previous: null, // { offset, limit }
  });
  const [paging, setPaging] = useState({
    offset: 0,
    limit: 10,
  });
  const [pokemons, setPokemons] = useState([]);

  const pokemonListWithId = useMemo(() => {
    return pokemons.map(p => ({
      name: p.name,
      id: p.url.split("/")[6],
    }));
  }, [pokemons]);


  const isLoading = useRequest({
    request: getPokemonList,
    params: paging,
    onSuccess(res) {
      if (res) {
        if (Array.isArray(res.results))
          setPokemons(res.results);

        // actually we can just use `paging` for these buttons
        setPagingButton({
          next: res.next ? parse(res.next.split("?")[1]) : null,
          previous: res.previous ? parse(res.previous.split("?")[1]) : null,
        });
      }
    },
  }, [paging]);


  return (
    <div>
      {isLoading && <LoadingIndicator />}
      <ul className="pl-4 leading-tight list-none">
        {pokemonListWithId.map(p => (
          <li key={p.name} className="h4 leading-normal capitalize hover:underline">
            <Icon path={mdiPokeball} size={1} className="inline-block mr-1" />
            <Link className="no-underline" to={`/pokemon/${p.name}`}>{p.name}</Link>
          </li>
        ))}
      </ul>

      <div className="flex">
        {pagingButton.previous && <ButtonPaging
          paging={pagingButton.previous}
          setPaging={setPaging}
        >
          <Trans>Previous</Trans>
        </ButtonPaging>}
        {pagingButton.next && <ButtonPaging
          paging={pagingButton.next}
          setPaging={setPaging}
        >
          <Trans>Next</Trans>
        </ButtonPaging>}
      </div>
    </div>
  );
}
