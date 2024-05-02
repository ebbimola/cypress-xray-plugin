"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyPadValues = exports.prettyPadObjects = void 0;
/**
 * Converts the values of all given objects into strings and pads them such that values belonging to
 * the same property are strings of equal length. For stringification,
 * {@link JSON.stringify | `JSON.stringify`} is used.
 *
 * @example
 * ```ts
 * const a = {
 *   x: "hello",
 *   y: "bonjour"
 * };
 * const b = {
 *   x: "goodbye",
 *   b: 123456789
 * };
 * console.log(JSON.stringify(prettyPadObjects([a, b])));
 * // [
 * //   '{"x":"hello  ","y":"bonjour"}'
 * //   '{"x":"goodbye","b":"123456789"}'
 * // ]
 * ```
 *
 * @param objects - the objects to pretty pad
 * @returns the pretty padded objects
 */
function prettyPadObjects(objects) {
    var maxPropertyLengths = {};
    for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
        var obj = objects_1[_i];
        Object.entries(obj).forEach(function (entry) {
            var valueLength = JSON.stringify(entry[1]).length;
            if (!(entry[0] in maxPropertyLengths) || valueLength > maxPropertyLengths[entry[0]]) {
                maxPropertyLengths[entry[0]] = valueLength;
            }
        });
    }
    var paddedObjects = objects.map(function (element) {
        var prettiedEntries = Object.entries(element).map(function (entry) {
            return [
                entry[0],
                JSON.stringify(entry[1]).padEnd(maxPropertyLengths[entry[0]], " "),
            ];
        });
        return Object.fromEntries(prettiedEntries);
    });
    return paddedObjects;
}
exports.prettyPadObjects = prettyPadObjects;
/**
 * Pads the values of an object such that all values are mapped to strings of equal length. For
 * stringification, {@link JSON.stringify | `JSON.stringify`} is used.
 *
 * @example
 * ```ts
 * const a = {
 *   x: "hello",
 *   y: "bonjour"
 *   z: 123
 * };
 * console.log(JSON.stringify(prettyPadValues(a));
 * // '{"x":"hello  ","y":"bonjour","z":"123    "}'
 * ```
 *
 * @param value - the object
 * @returns the pretty padded object
 */
function prettyPadValues(value) {
    var maxPropertyLength = 0;
    Object.entries(value).forEach(function (entry) {
        var valueLength = JSON.stringify(entry[1]).length;
        if (valueLength > maxPropertyLength) {
            maxPropertyLength = valueLength;
        }
    });
    var prettiedEntries = Object.entries(value).map(function (entry) {
        return [entry[0], JSON.stringify(entry[1]).padEnd(maxPropertyLength, " ")];
    });
    return Object.fromEntries(prettiedEntries);
}
exports.prettyPadValues = prettyPadValues;
