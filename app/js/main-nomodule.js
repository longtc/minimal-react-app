// Import polyfills not in `core-js` for the nomodule builds.
import "whatwg-fetch";
import { enableES5 } from "immer";

import { main } from "./main";

enableES5();

main();
