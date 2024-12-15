import { register } from "node:module";
import { pathToFileURL } from "node:url";

// Register the TypeScript loader
register("ts-node/esm", pathToFileURL("./"));
