import { defineConfig, Plugin } from "vite";
import { dataToEsm } from "@rollup/pluginutils";
import react from "@vitejs/plugin-react";
import JSON5 from "json5";

function json5Plugin(): Plugin {
    const json5ExtRE = /\.(jsonc|json5)$/;

    return {
        name: "vite:json5",
        transform(json, id) {
            if (!json5ExtRE.test(id)) return null;

            try {
                // Parse the JSON5
                const parsed = JSON5.parse(json);

                // Convert the parsed JSON5 data to an ES module export
                return {
                    code: dataToEsm(parsed),
                    map: { mappings: "" },
                };
            } catch (e) {
                const error = e instanceof Error ? e : new Error(String(e));
                this.error(error.message);
            }
        },
    };
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), json5Plugin()],
});
