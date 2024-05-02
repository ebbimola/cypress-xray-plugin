"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeOverlap = void 0;
/**
 * Computes the overlap of two iterables, i.e. their intersection and differences at the same time.
 *
 * @example
 *
 * ```ts
 * console.log(computeOverlap([1, 2, 3], [2, 5, 9, 1]));
 * // {
 * //   intersection: [1, 2],
 * //   leftOnly: [3],
 * //   rightOnly: [5, 9]
 * // }
 * ```
 *
 * @param left - the first iterable
 * @param right - the second iterable
 * @returns the overlap
 */
function computeOverlap(left, right) {
    var sets = {
        intersection: [],
        leftOnly: [],
        rightOnly: [],
    };
    var leftSet = new Set(left);
    var rightSet = new Set(right);
    for (var _i = 0, leftSet_1 = leftSet; _i < leftSet_1.length; _i++) {
        var element = leftSet_1[_i];
        if (rightSet.has(element)) {
            sets.intersection.push(element);
        }
        else {
            sets.leftOnly.push(element);
        }
    }
    for (var _a = 0, rightSet_1 = rightSet; _a < rightSet_1.length; _a++) {
        var element = rightSet_1[_a];
        if (!leftSet.has(element)) {
            sets.rightOnly.push(element);
        }
    }
    return sets;
}
exports.computeOverlap = computeOverlap;
