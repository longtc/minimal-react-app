import { get } from "../../util/request";


export async function getPokemonList({ params = { limit: 10, offset: 0 }, onSuccess }) {
  // wait for 1 second to show the loading spinner, in case the response is cached
  await new Promise(r => setTimeout(r, 1000));

  await get({
    url: "/pokemon",
    useCache: true,
    params,
    onSuccess,
  });
}
