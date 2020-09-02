import { lazy } from "react";

import { loadable } from "./component/Loadable.jsx";


export const routeConfig = [
  {
    path: "/",
    exact: true,
    component: loadable(lazy(() => import("./page/Homepage"))),
    isProtected: false,
    breadcrumb: "Homepage",
  },
  {
    path: "/pokemon",
    exact: true,
    component: null,
    isProtected: false,
    breadcrumb: null,
  },
  {
    path: "/pokemon/:id",
    exact: true,
    component: loadable(lazy(() => import("./page/PokemonDetail"))),
    isProtected: false,
    breadcrumb: "Pokemon Info",
  },
];
