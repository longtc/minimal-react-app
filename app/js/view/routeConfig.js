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
    path: "/pokemon/:pokemonName",
    exact: true,
    component: loadable(lazy(() => import("./page/Pokemon"))),
    isProtected: false,
    breadcrumb: "Pokemon Info",
  },
];
