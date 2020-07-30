import React, { Suspense } from "react";

import { LoadingIndicator } from "./animation/LoadingIndicator.jsx";

// This component is mostly only used to load an entire page
export function loadable(Component) {

  return function Loadable({ ...rest }) {
    return (
      <div className="bg-light-grey full flex justify-center flex-auto">
        <div className="bg-transparent full max-width">
          <Suspense fallback={<LoadingIndicator size={64} />}>
            <Component {...rest} />
          </Suspense>
        </div>
      </div>
    );
  };
}
