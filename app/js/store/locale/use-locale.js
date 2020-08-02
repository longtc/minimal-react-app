import { useState } from "react";

import { DEFAULT_LOCALE } from "../../util/constant";

export function useLocale() {
  const [locale, setLocale] = useState(DEFAULT_LOCALE);

  return { locale, setLocale };
}
