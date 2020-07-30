import dynamicImportPolyfill from "dynamic-import-polyfill";
import { enableMapSet } from "immer";

// https://philipwalton.com/articles/using-native-javascript-modules-in-production-today/#dynamic-import
// This needs to be done before any dynamic imports are used.
// If your modules are hosted in a sub-directory, it must be specified here.
dynamicImportPolyfill.initialize({ modulePath: "/js/" });

import { main } from "./main";

enableMapSet();

main();
