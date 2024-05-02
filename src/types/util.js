"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nonNull = void 0;
/**
 * Utility function which asserts that a value is neither `null` nor `undefined`.
 *
 * @param value - the value
 * @returns `true` if it is neither `null` nor `undefined`, otherwise `false`
 */
function nonNull(value) {
    return value !== null && value !== undefined;
}
exports.nonNull = nonNull;
