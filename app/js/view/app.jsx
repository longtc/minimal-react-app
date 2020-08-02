import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { I18nProvider } from "@lingui/react";
import defaultCatalog from "../../locales/en-US/messages";

import { AppContextProvider, AppContext } from "../context/app-context";
import { loadCatalog } from "../store/locale/load-catalog";

import { routeConfig } from "./routeConfig";
import { NotFound } from "./page/NotFound/index.jsx";

import { PrivateRoute } from "./component/PrivateRoute.jsx";
import { Breadcrumbs } from "./component/breadcrumbs.jsx";

export function App() {
  return (
    <AppContextProvider>
      <Routes />
    </AppContextProvider>
  );
}

function Routes() {
  const { user, locale } = useContext(AppContext);

  const [catalogs, setCatalogs] = useState({ [locale]: defaultCatalog });

  useEffect(() => {
    loadCatalog(locale, setCatalogs);
  }, [locale]);

  return (
    <I18nProvider language={locale} catalogs={catalogs}>
      <div className="w-full max-w-screen-lg px-4">
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
    </I18nProvider>
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
