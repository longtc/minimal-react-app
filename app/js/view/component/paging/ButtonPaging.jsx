import { useCallback } from "react";

export function ButtonPaging({
  setPaging,
  paging, // { offset, limit }
  children,
}) {

  const onClick = useCallback(ev => {
    setPaging({
      offset: ev.target.dataset.offset,
      limit: ev.target.dataset.limit,
    });
  }, []);

  return (
    <button
      className="mr-1"
      data-offset={paging.offset}
      data-limit={paging.limit}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
