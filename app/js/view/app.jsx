import React, { useContext } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { UserProvider, UserContext } from "../reducer/user/user-context";

import { routeConfig } from "./routeConfig";
import { NotFound } from "./page/NotFound/index.jsx";

import { PrivateRoute } from "./component/PrivateRoute.jsx";
import { Breadcrumbs } from "./component/BreadCrumps.jsx";

export function App() {
  return (
    <UserProvider>
      <Routers />
    </UserProvider>
  );
}

function Routers() {
  const { user } = useContext(UserContext);

  return (
    <div className="full">
      <BrowserRouter>
        <Breadcrumbs />

        <Switch>
          {routeConfig.map(({ path, component: Component, isProtected }) => (
            <CustomRouter
              key={path}
              path={path}
              isProtected={isProtected}
              accessToken={user.accessToken}
              exact
              component={Component}
            />
          ))}

          <Route path="*" component={NotFound} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

// ***************************************
// private
function CustomRouter({ path, component: Component, accessToken, isProtected }) {
  if (isProtected) {
    return (
      <PrivateRoute
        key={path}
        accessToken={accessToken}
        path={path}
        exact
        component={Component}
      />
    );
  }

  return (
    <Route
      key={path}
      path={path}
      exact
      render={routeProps =>
        <Component {...routeProps} />
      }
    />
  );
}
