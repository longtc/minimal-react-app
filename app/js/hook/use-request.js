import { useState, useEffect } from "react";

/**
 * This hook aims to remove the boilerplate to show the loading state of a request call
 * @param {Object} param - The object params of this hook
 * @param {function} param.request - The query|mutation function
 * @param {function(Object):void} param.onSuccess - The callback that handle the response
 * @param {Object} param.rest - The remaining options that will be passed to `param.request`
 * @returns {boolean} The loading state of the request
 */
export function useRequest({ request, onSuccess, ...rest }, dependencies = []) {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    async function executeRequest() {
      setLoading(true);
      await request({ onSuccess, ...rest });
      setLoading(false);
    }
    executeRequest();
  }, dependencies);

  return isLoading;
}
