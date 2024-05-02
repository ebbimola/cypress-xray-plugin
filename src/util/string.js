"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unknownToString = void 0;
/**
 * Converts an unknown value to a string.
 *
 * @param value - the value
 * @returns the string
 */
function unknownToString(value) {
    switch (typeof value) {
        case "string":
            return value;
        case "number":
        case "bigint":
        case "boolean":
        case "symbol":
        case "function":
            return value.toString();
        case "undefined":
            return "undefined";
        case "object":
            return JSON.stringify(value);
    }
}
exports.unknownToString = unknownToString;
