export async function loadCatalog(language, setCatalogs) {
  let catalog;
  switch (language) {
    case "en-US":
      catalog = await import("../../../locales/en-US/messages");
      break;

    case "vi-VN":
      catalog = await import("../../../locales/vi-VN/messages");
      break;
  }
  setCatalogs({ [language]: catalog.default });
}
