import { useContext, useCallback } from "react";

import { AppContext } from "../../../context/app-context";

const languageOptions = [
  { value: "en-US", label: "English" },
  { value: "vi-VN", label: "Tiếng Việt" },
];

export function ChangeLanguage() {
  const { locale, setLocale } = useContext(AppContext);
  const handleChangeLocale = useCallback(ev => setLocale(ev.target.value), []);

  return (
    <select name="language" id="language" onChange={handleChangeLocale} value={locale}>
      {languageOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
