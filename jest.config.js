export default {
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: "tsconfig.app.json",
                diagnostics: {
                    ignoreCodes: [151001],
                },
            },
        ],
        "^.+\\.pegjs$": "<rootDir>/jestPeggyTransformer.js",
    },
    coverageDirectory: ".qodana/code-coverage/",
    coverageReporters: ["lcovonly"],
    testEnvironment: "jsdom",
};
