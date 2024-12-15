export function isDigit(c: string) {
    return c >= "0" && c <= "9";
}

export function isWhitespace(c: string) {
    return RegExp(/^\p{Z}/u).test(c);
}
