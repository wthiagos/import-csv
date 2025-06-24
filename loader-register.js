import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("ts-node/esm", pathToFileURL(new URL("./src", import.meta.url).pathname));
