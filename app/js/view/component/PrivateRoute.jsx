import React from "react";
import { Route, Redirect } from "react-router-dom";

export function PrivateRoute({ component: Component, accessToken, ...rest }) {
  return (
    <Route
      {...rest}
      render={routeProps =>
        accessToken ? (
          <Component {...routeProps} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              search: `?next=/${routeProps.location.pathname.slice(1)}`,
              state: { from: routeProps.location },
            }}
          />
        )
      }
    />
  );
}
