/* eslint-disable @typescript-eslint/no-explicit-any */
// noinspection JSUnusedGlobalSymbols

declare module "*.pegjs" {
    export type StartRules = string[];

    export type SyntaxError = import("peggy").parser.SyntaxErrorConstructor;

    export function parse(
        input: string,
        options?: import("peggy").ParserOptions
    ): any;
}
