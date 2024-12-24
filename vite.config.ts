import { dataToEsm } from "@rollup/pluginutils";
import react from "@vitejs/plugin-react";
import JSON5 from "json5";
import * as peggy from "peggy";
import { defineConfig, Plugin } from "vitest/config";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const peggyGenerate = (peggy as any).default.generate;

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

function peggyPlugin(): Plugin {
    return {
        name: "vite:peggy",
        transform(grammar, id) {
            if (!id.endsWith(".pegjs")) {
                return;
            }

            const code = peggyGenerate(grammar, {
                output: "source",
                format: "es",
            });
            return {
                code,
            };
        },
    };
}

// https://vite.dev/config/
export default defineConfig({
    base: "./",
    build: { target: "es2022" },
    plugins: [
        // @ts-expect-error TS2769
        react() as unknown,
        json5Plugin(),
        peggyPlugin(),
    ],
    test: {
        coverage: {},
    },
});
