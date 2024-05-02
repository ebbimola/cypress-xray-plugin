"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dedent = void 0;
/**
 * Dedents strings based on the first non-empty line contained within. Lines with less indentation
 * than the first non-empty line are indented at least as much as that line (which is different to
 * what other libraries like [dedent](https://www.npmjs.com/package/dedent) do).
 *
 * This also applies to expression whitespace.
 *
 * @param string - the string
 * @returns the dedented string
 */
function dedent(string) {
    // Trim whitespace up until the first newline in the front and all whitespace in the back.
    var lines = string
        .replace(/^\s*\n/, "")
        .trimEnd()
        .split("\n");
    var indents = lines.map(function (line) { return line.length - line.trimStart().length; });
    var baseIndent = indents[0];
    var dedentedLines = [];
    var lastTrueIndent = 0;
    lines.forEach(function (line, i) {
        var indentLength = 0;
        var indent = "";
        if (i > 0) {
            if (indents[i] < baseIndent) {
                indentLength = indents[lastTrueIndent] + indents[i] - baseIndent;
            }
            else {
                lastTrueIndent = i;
                indentLength = indents[i] - baseIndent;
            }
            indent = " ".repeat(indentLength);
        }
        // Replace whitespace in the front with calculated indent, then trim all trailing
        // whitespace. Trimming after concatenation replaces blank lines with the empty string.
        dedentedLines.push("".concat(indent).concat(line.trimStart()).trimEnd());
    });
    return dedentedLines.join("\n");
}
exports.dedent = dedent;
