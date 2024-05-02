"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startInterval = exports.truncateIsoTime = void 0;
/**
 * Remove milliseconds from ISO time string.
 *
 * @param time - a date time string in ISO format
 * @returns the truncated date time string
 * @example
 *   const time = truncateISOTime("2022-12-01T02:30:44.744Z")
 *   console.log(time); // "2022-12-01T02:30:44Z"
 */
function truncateIsoTime(time) {
    return time.split(".")[0] + "Z";
}
exports.truncateIsoTime = truncateIsoTime;
/**
 * The general delay between intervals.
 */
var LOG_RESPONSE_INTERVAL_MS = 10000;
/**
 * Starts an informative timer which ticks in a predefined interval.
 *
 * @param onTick - the function to call on each interval tick
 * @returns the timer's handler
 */
function startInterval(onTick) {
    var sumTime = 0;
    var callback = function () {
        sumTime = sumTime + LOG_RESPONSE_INTERVAL_MS;
        onTick(sumTime);
    };
    return setInterval(callback, LOG_RESPONSE_INTERVAL_MS);
}
exports.startInterval = startInterval;
