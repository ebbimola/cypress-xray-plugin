"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
exports.TestConverter = void 0;
var path_1 = require("path");
var semver_1 = require("semver");
var logging_1 = require("../../logging/logging");
var preprocessing_1 = require("../../preprocessing/preprocessing");
var base64_1 = require("../../util/base64");
var dedent_1 = require("../../util/dedent");
var errors_1 = require("../../util/errors");
var files_1 = require("../../util/files");
var time_1 = require("../../util/time");
var runConversion_1 = require("./runConversion");
var statusConversion_1 = require("./statusConversion");
/**
 * A class for converting Cypress run results into Xray test JSON.
 *
 * @see https://docs.getxray.app/display/XRAY/Import+Execution+Results#ImportExecutionResults-%22tests%22object-TestRundetails
 * @see https://docs.getxray.app/display/XRAYCLOUD/Using+Xray+JSON+format+to+import+execution+results#UsingXrayJSONformattoimportexecutionresults-%22test%22object-TestRundetails
 */
var TestConverter = /** @class */ (function () {
    /**
     * Construct a new converter with access to the provided options. The cloud converter flag is
     * used to deduce the output format. When set to `true`, Xray cloud JSONs will be created, if
     * set to `false`, the format will be Xray server JSON.
     *
     * @param options - the options
     * @param isCloudConverter - whether Xray cloud JSONs should be created
     */
    function TestConverter(options, isCloudConverter) {
        this.options = options;
        this.isCloudConverter = isCloudConverter;
    }
    TestConverter.prototype.toXrayTests = function (runResults) {
        return __awaiter(this, void 0, void 0, function () {
            var testRunData, xrayTests;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getTestRunData(runResults)];
                    case 1:
                        testRunData = _a.sent();
                        xrayTests = [];
                        testRunData.forEach(function (testData) {
                            try {
                                var issueKey = (0, preprocessing_1.getNativeTestIssueKey)(testData.title, _this.options.jira.projectKey);
                                var test_1 = _this.getTest(testData, issueKey, _this.getXrayEvidence(testData));
                                xrayTests.push(test_1);
                            }
                            catch (error) {
                                logging_1.LOG.message(logging_1.Level.WARNING, (0, dedent_1.dedent)("\n                        Skipping result upload for test: ".concat(testData.title, "\n\n                        ").concat((0, errors_1.errorMessage)(error), "\n                    ")));
                            }
                        });
                        if (xrayTests.length === 0) {
                            throw new Error("Failed to convert Cypress tests into Xray tests: No Cypress tests to upload");
                        }
                        return [2 /*return*/, __spreadArray([xrayTests[0]], xrayTests.slice(1), true)];
                }
            });
        });
    };
    TestConverter.prototype.getTestRunData = function (runResults) {
        return __awaiter(this, void 0, void 0, function () {
            var testRunData, conversionPromises, runs, _loop_1, _i, runs_1, run_1, runs, _loop_2, this_1, _a, runs_2, run_2, convertedTests, _b, _c, run_3, _d, _e, screenshot, path;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        testRunData = [];
                        conversionPromises = [];
                        if ((0, semver_1.lt)(runResults.cypressVersion, "13.0.0")) {
                            runs = runResults.runs;
                            if (runs.every(function (run) {
                                return (_this.options.cucumber &&
                                    run.spec.relative.endsWith(_this.options.cucumber.featureFileExtension));
                            })) {
                                throw new Error("Failed to extract test run data: Only Cucumber tests were executed");
                            }
                            _loop_1 = function (run_1) {
                                (0, runConversion_1.getTestRunData_V12)(run_1).forEach(function (promise, index) {
                                    return conversionPromises.push([run_1.tests[index].title.join(" "), promise]);
                                });
                            };
                            for (_i = 0, runs_1 = runs; _i < runs_1.length; _i++) {
                                run_1 = runs_1[_i];
                                _loop_1(run_1);
                            }
                        }
                        else {
                            runs = runResults.runs;
                            if (runs.every(function (run) {
                                return (_this.options.cucumber &&
                                    run.spec.relative.endsWith(_this.options.cucumber.featureFileExtension));
                            })) {
                                throw new Error("Failed to extract test run data: Only Cucumber tests were executed");
                            }
                            _loop_2 = function (run_2) {
                                (0, runConversion_1.getTestRunData_V13)(run_2, this_1.options.jira.projectKey).forEach(function (promise, index) {
                                    return conversionPromises.push([run_2.tests[index].title.join(" "), promise]);
                                });
                            };
                            this_1 = this;
                            for (_a = 0, runs_2 = runs; _a < runs_2.length; _a++) {
                                run_2 = runs_2[_a];
                                _loop_2(run_2);
                            }
                        }
                        return [4 /*yield*/, Promise.allSettled(conversionPromises.map(function (tuple) { return tuple[1]; }))];
                    case 1:
                        convertedTests = _f.sent();
                        convertedTests.forEach(function (promise, index) {
                            if (promise.status === "fulfilled") {
                                testRunData.push(promise.value);
                            }
                            else {
                                logging_1.LOG.message(logging_1.Level.WARNING, (0, dedent_1.dedent)("\n                        Skipping result upload for test: ".concat(conversionPromises[index][0], "\n\n                        ").concat((0, errors_1.errorMessage)(promise.reason), "\n                    ")));
                            }
                        });
                        if (this.options.xray.uploadScreenshots) {
                            if ((0, semver_1.gte)(runResults.cypressVersion, "13.0.0")) {
                                for (_b = 0, _c = runResults.runs; _b < _c.length; _b++) {
                                    run_3 = _c[_b];
                                    for (_d = 0, _e = run_3.screenshots; _d < _e.length; _d++) {
                                        screenshot = _e[_d];
                                        if (!this.willBeUploaded(screenshot, testRunData)) {
                                            path = (0, path_1.parse)(screenshot.path);
                                            logging_1.LOG.message(logging_1.Level.WARNING, (0, dedent_1.dedent)("\n                                    Screenshot will not be uploaded: ".concat(screenshot.path, "\n\n                                    Its filename does not contain a test issue key.\n                                    To upload screenshots, include a test issue key anywhere in their names:\n\n                                    cy.screenshot(\"").concat(this.options.jira.projectKey, "-123 ").concat(path.name, "\")\n                                ")));
                                        }
                                    }
                                }
                            }
                        }
                        return [2 /*return*/, testRunData];
                }
            });
        });
    };
    TestConverter.prototype.getTest = function (test, issueKey, evidence) {
        // TODO: Support multiple iterations.
        var xrayTest = {
            testKey: issueKey,
            start: (0, time_1.truncateIsoTime)(test.startedAt.toISOString()),
            finish: (0, time_1.truncateIsoTime)(new Date(test.startedAt.getTime() + test.duration).toISOString()),
            status: (0, statusConversion_1.getXrayStatus)(test.status, this.isCloudConverter, this.options.xray.status),
        };
        if (evidence.length > 0) {
            xrayTest.evidence = evidence;
        }
        return xrayTest;
    };
    TestConverter.prototype.getXrayEvidence = function (testRunData) {
        var evidence = [];
        if (this.options.xray.uploadScreenshots) {
            for (var _i = 0, _a = testRunData.screenshots; _i < _a.length; _i++) {
                var screenshot = _a[_i];
                var filename = (0, path_1.basename)(screenshot.filepath);
                if (this.options.plugin.normalizeScreenshotNames) {
                    filename = (0, files_1.normalizedFilename)(filename);
                }
                evidence.push({
                    filename: filename,
                    data: (0, base64_1.encodeFile)(screenshot.filepath),
                });
            }
        }
        return evidence;
    };
    TestConverter.prototype.willBeUploaded = function (screenshot, testRunData) {
        return testRunData.some(function (testRun) {
            return testRun.screenshots.some(function (_a) {
                var filepath = _a.filepath;
                return screenshot.path === filepath;
            });
        });
    };
    return TestConverter;
}());
exports.TestConverter = TestConverter;
