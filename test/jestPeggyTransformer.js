import * as peggy from "peggy";

export function process(sourceText) {
    const code = peggy.default.generate(sourceText, {
        output: "source",
        format: "commonjs",
    });

    return { code };
}
