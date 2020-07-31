import { get } from "../../util/request";


export async function getPokemonList({ params, onSuccess }) {
  // wait for a while to show the loading spinner, in case the response is cached
  await new Promise(r => setTimeout(r, 500));

  await get({
    url: "/pokemon",
    useCache: true,
    params,
    onSuccess,
  });
}
