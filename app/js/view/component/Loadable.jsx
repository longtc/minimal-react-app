import React, { Suspense } from "react";

import { LoadingIndicator } from "./animation/LoadingIndicator.jsx";

// This component is mostly only used to load an entire page
export function loadable(Component) {

  return function Loadable({ ...rest }) {
    return (
      <div className="w-full flex justify-center flex-auto">
        <div className="w-full max-w-screen-lg bg-transparent">
          <Suspense fallback={<LoadingIndicator size={64} />}>
            <Component {...rest} />
          </Suspense>
        </div>
      </div>
    );
  };
}
