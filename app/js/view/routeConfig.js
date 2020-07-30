import { lazy } from "react";

import { loadable } from "./component/Loadable.jsx";


export const routeConfig = [
  {
    path: "/",
    component: loadable(lazy(() => import("./page/Homepage/index.jsx"))),
    isProtected: false,
    breadcrumb: "Homepage",
  },
  {
    path: "/pokemon",
    component: null,
    isProtected: false,
    breadcrumb: null,
  },
  {
    path: "/pokemon/:id",
    component: loadable(lazy(() => import("./page/PokemonDetails/index.jsx"))),
    isProtected: false,
    breadcrumb: "Pokemon Info",
  },
];
