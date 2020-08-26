
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
    <div className="w-full flex justify-center pb-2">
      <ul className="w-full flex justify-start bg-transparent list-none m-0 mt-1 pl-0">
        {breadcrumbs.map(({
          match,
          breadcrumb,
        }, idx, arr) => (
          <li key={match.url} className="mr-1 relative breadcrumb">
            {idx < (arr.length - 1)
              ? <NavLink
                className="no-underline text-gray"
                to={match.url}
              >
                {breadcrumb}
              </NavLink>
              : <span className="black">{breadcrumb}</span>
            }
          </li>
        ))}
      </ul>
    </div>
  );
});
