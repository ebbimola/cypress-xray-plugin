"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestRunData_V13 = exports.getTestRunData_V12 = void 0;
var preprocessing_1 = require("../../preprocessing/preprocessing");
var statusConversion_1 = require("./statusConversion");
/**
 * Converts a Cypress v12 (or before) run result into several {@link TestRunData} objects.
 *
 * The function returns an array of promises because the conversion of the test results contained
 * within the run can fail for individual tests. This makes sure that a single failing conversion
 * does not affect or cancel the conversion of the other test results.
 *
 * To retrieve the results, you should use the following approach:
 *
 * ```ts
 *   const testData = await Promise.allSettled(getTestRunData_V12(runResult));
 *   testData.forEach((promise) => {
 *     if (promise.status === "fulfilled") {
 *       // use test data
 *     } else {
 *       // handle failed test conversion
 *     }
 *   });
 * ```
 *
 * @param runResult - the run result
 * @returns an array of test data promises
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
function getTestRunData_V12(runResult) {
    var testRuns = [];
    runResult.tests.forEach(function (test) {
        testRuns.push(new Promise(function (resolve) {
            resolve({
                duration: test.attempts[test.attempts.length - 1].duration,
                screenshots: test.attempts[test.attempts.length - 1].screenshots.map(function (screenshot) {
                    return { filepath: screenshot.path };
                }),
                spec: {
                    filepath: runResult.spec.absolute,
                },
                startedAt: new Date(test.attempts[test.attempts.length - 1].startedAt),
                status: (0, statusConversion_1.toCypressStatus)(test.attempts[test.attempts.length - 1].state),
                title: test.title.join(" "),
            });
        }));
    });
    return testRuns;
}
exports.getTestRunData_V12 = getTestRunData_V12;
/**
 * Converts a Cypress v13 (and above) run result into several {@link TestRunData | `ITestRunData`}
 * objects. The project key is required for mapping screenshots to test cases.
 *
 * The function returns an array of promises because the conversion of the test results contained
 * within the run can fail for individual tests. This makes sure that a single failing conversion
 * does not affect or cancel the conversion of the other test results.
 *
 * To retrieve the results, you should use the following approach:
 *
 * ```ts
 *   const testData = await Promise.allSettled(getTestRunData_V13(runResult, projectKey));
 *   testData.forEach((promise) => {
 *     if (promise.status === "fulfilled") {
 *       // use test data
 *     } else {
 *       // handle failed test conversion
 *     }
 *   });
 * ```
 *
 * @param runResult - the run result
 * @param projectKey - the project key
 * @returns an array of test data promises
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
function getTestRunData_V13(runResult, projectKey) {
    var testRuns = [];
    var testStarts = startTimesByTest(runResult);
    var testScreenshots = screenshotsByTest(runResult, projectKey);
    runResult.tests.forEach(function (test) {
        var title = test.title.join(" ");
        var screenshots = title in testScreenshots ? testScreenshots[title] : [];
        testRuns.push(new Promise(function (resolve) {
            var _a;
            resolve({
                duration: test.duration,
                screenshots: screenshots.map(function (screenshot) {
                    return { filepath: screenshot.path };
                }),
                spec: {
                    filepath: runResult.spec.absolute,
                },
                startedAt: (_a = testStarts.get(title)) !== null && _a !== void 0 ? _a : new Date(),
                status: (0, statusConversion_1.toCypressStatus)(test.state),
                title: title,
            });
        }));
    });
    return testRuns;
}
exports.getTestRunData_V13 = getTestRunData_V13;
function startTimesByTest(run) {
    var map = new Map();
    var testStarts = [];
    for (var i = 0; i < run.tests.length; i++) {
        var date = void 0;
        if (i === 0) {
            date = new Date(run.stats.startedAt);
        }
        else {
            date = new Date(testStarts[i - 1].getTime() + run.tests[i - 1].duration);
        }
        testStarts.push(date);
        map.set(run.tests[i].title.join(" "), date);
    }
    return map;
}
function screenshotsByTest(run, projectKey) {
    var map = {};
    for (var _i = 0, _a = run.screenshots; _i < _a.length; _i++) {
        var screenshot = _a[_i];
        for (var _b = 0, _c = run.tests; _b < _c.length; _b++) {
            var test_1 = _c[_b];
            var title = test_1.title.join(" ");
            if (screenshotNameMatchesTestTitle(screenshot, projectKey, test_1.title)) {
                if (title in map) {
                    map[title].push(screenshot);
                }
                else {
                    map[title] = [screenshot];
                }
            }
        }
    }
    return map;
}
function screenshotNameMatchesTestTitle(screenshot, projectKey, testTitle) {
    try {
        var testTitleKey = (0, preprocessing_1.getNativeTestIssueKey)(testTitle[testTitle.length - 1], projectKey);
        if (testTitleKey && screenshot.path.includes(testTitleKey)) {
            return true;
        }
    }
    catch (error) {
        // Do nothing.
    }
    return false;
}
