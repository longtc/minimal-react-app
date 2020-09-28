import React from "react";

/**
 *
 * @param {object} param
 * @param {string} param.name Name of the pokemon
 */
export function PokemonDetails({ name }) {
  return (
    <div>
      <h1 className="h3 capitalize">{name}</h1>
    </div>
  );
}
