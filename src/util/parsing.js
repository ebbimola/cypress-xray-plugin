"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.asArrayOfStrings = exports.asInt = exports.asFloat = exports.asString = exports.asBoolean = void 0;
var dedent_1 = require("./dedent");
var string_1 = require("./string");
/**
 * Parses and returns a boolean value from a string.
 *
 * @param value - a string that can be interpreted as a boolean value
 * @returns the corresponding boolean value
 * @see https://www.npmjs.com/package/yn
 */
function asBoolean(value) {
    value = String(value).trim();
    if (/^(?:y|yes|true|1|on)$/i.test(value)) {
        return true;
    }
    if (/^(?:n|no|false|0|off)$/i.test(value)) {
        return false;
    }
    throw new Error("Failed to parse boolean value from string: ".concat(value));
}
exports.asBoolean = asBoolean;
/**
 * No-op function for consistency purposes.
 *
 * @param value - the string
 * @returns the string
 */
function asString(value) {
    return value;
}
exports.asString = asString;
/**
 * Parses and returns a float value from a string.
 *
 * @param value - a string that can be interpreted as a float value
 * @returns the corresponding float value
 */
function asFloat(value) {
    return Number.parseFloat(value);
}
exports.asFloat = asFloat;
/**
 * Parses and returns an integer value from a string.
 *
 * @param value - a string that can be interpreted as an integer value
 * @returns the corresponding integer value
 */
function asInt(value) {
    return Number.parseInt(value);
}
exports.asInt = asInt;
/**
 * Parses and returns an array of strings from an unknown value. If the value is not an array,
 * contains zero elements or non-primitive elements, corresponding errors will be thrown.
 *
 * @param value - a string that can be interpreted as a string array
 * @returns the corresponding string array
 */
function asArrayOfStrings(value) {
    if (!Array.isArray(value)) {
        throw new Error((0, dedent_1.dedent)("\n                Failed to parse as array of strings: ".concat(JSON.stringify(value), "\n                Expected an array of primitives, but got: ").concat((0, string_1.unknownToString)(value), "\n            ")));
    }
    var array = value.map(function (element, index) {
        if (typeof element === "string" ||
            typeof element === "boolean" ||
            typeof element === "number" ||
            typeof element === "symbol" ||
            typeof element === "bigint") {
            return element.toString();
        }
        throw new Error((0, dedent_1.dedent)("\n                Failed to parse as array of strings: ".concat(JSON.stringify(value), "\n                Expected a primitive element at index ").concat(index, ", but got: ").concat(JSON.stringify(element), "\n            ")));
    });
    if (array.length === 0) {
        throw new Error((0, dedent_1.dedent)("\n                Failed to parse as array of strings: ".concat(JSON.stringify(value), "\n                Expected an array of primitives with at least one element\n            ")));
    }
    return __spreadArray([array[0]], array.slice(1), true);
}
exports.asArrayOfStrings = asArrayOfStrings;
/**
 * Parses an environment variable to arbitrary data types.
 *
 * @param env - the object holding all environment variables as key-value pairs
 * @param variable - the variable name
 * @param parser - the parsing function
 * @returns the parsed data or undefined if the variable does not exist
 */
function parse(env, variable, parser) {
    if (variable in env) {
        return parser(env[variable]);
    }
    return undefined;
}
exports.parse = parse;
