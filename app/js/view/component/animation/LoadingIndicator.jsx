import React from "react";

const SIZE = 44;

export function LoadingIndicator({
  size = 40,
  thickness = 3.6,
  className = "",
  style = {},
}) {
  return (
    <div
      className={className}
      style={Object.assign({
        width: size,
        height: size,
      }, style)}
    >
      <svg
        className="loader"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={(SIZE - thickness) / 2}
          fill="none"
          strokeWidth={thickness}
        />
      </svg>
    </div>
  );
}
