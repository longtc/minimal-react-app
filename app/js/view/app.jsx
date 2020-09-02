import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import { I18nProvider } from "@lingui/react";
import defaultCatalog from "../../locales/en-US/messages";

import { AppContextProvider, AppContext } from "../context/app-context";
import { loadCatalog } from "../store/locale/load-catalog";

import { routeConfig } from "./routeConfig";
import { NotFound } from "./page/NotFound/index.jsx";

import { PrivateRoute } from "./component/PrivateRoute.jsx";
import { Breadcrumbs } from "./component/Breadcrumbs.jsx";

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
            {routeConfig.map(({ path, exact, component: Component, isProtected }) => (
              <CustomRouter
                key={path}
                exact={exact}
                path={path}
                isProtected={isProtected}
                accessToken={user.accessToken}
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
function CustomRouter({ component: Component, isProtected, accessToken, ...rest }) {
  if (isProtected) {
    return (
      <PrivateRoute
        accessToken={accessToken}
        component={Component}
        {...rest}
      />
    );
  }

  return (
    <Route
      render={routeProps =>
        <Component {...routeProps} />
      }
      {...rest}
    />
  );
}
