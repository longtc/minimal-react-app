
import React from "react";
import { NavLink } from "react-router-dom";
import withBreadcrumbs from "react-router-breadcrumbs-hoc/dist/es/index";

import { routeConfig } from "../routeConfig";

export const Breadcrumbs = withBreadcrumbs(routeConfig)(({ breadcrumbs }) => {

  // do not render on homepage
  if (
    Array.isArray(breadcrumbs) &&
    breadcrumbs.length === 1 &&
    breadcrumbs[0].match.path === "/"
  )
    return null;

  return (
    <div className="bg-light-grey full flex justify-center pb2">
      <ul className="bg-transparent full max-width flex justify-start list-reset m0 mt1">
        {breadcrumbs.map(({
          match,
          breadcrumb,
        }, idx, arr) => (
          <li key={match.url} className="mr1 relative breadcrump">
            {idx < (arr.length - 1)
              ? <NavLink
                className="text-decoration-none dark-grey"
                to={match.url}
              >
                {breadcrumb} /
              </NavLink>
              : <span className="black">{breadcrumb}</span>
            }
          </li>
        ))}
      </ul>
    </div>
  );
});
