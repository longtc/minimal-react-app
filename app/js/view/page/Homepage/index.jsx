import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useRequest } from "../../../hook/use-request";
import { getPokemonList } from "../../../api/pokemon/query";

import { LoadingIndicator } from "../../component/animation/LoadingIndicator.jsx";

export default function Homepage() {
  const [pokemons, setPokemons] = useState([]);

  const pokemonListWithId = useMemo(() => {
    return pokemons.map(p => ({
      name: p.name,
      id: p.url.split("/")[6],
    }));
  }, [pokemons]);

  const isLoading = useRequest({
    request: getPokemonList,
    onSuccess(res) {
      if (res && Array.isArray(res.results))
        setPokemons(res.results);
    },
  });

  return (
    <section>
      <h1>Pokemon list</h1>
      {isLoading && <LoadingIndicator />}
      <ul>
        {pokemonListWithId.map(p => (
          <li key={p.name}>
            <Link to={`/pokemon/${p.name}`}>{p.name}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
