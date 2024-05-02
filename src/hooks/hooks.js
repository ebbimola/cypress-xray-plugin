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
exports.afterRunHook = exports.beforeRunHook = void 0;
var fs_1 = require("fs");
var importExecutionConverter_1 = require("../conversion/importExecution/importExecutionConverter");
var importExecutionCucumberMultipartConverter_1 = require("../conversion/importExecutionCucumberMultipart/importExecutionCucumberMultipartConverter");
var logging_1 = require("../logging/logging");
var preprocessing_1 = require("../preprocessing/preprocessing");
var util_1 = require("../types/util");
var dedent_1 = require("../util/dedent");
var errors_1 = require("../util/errors");
var help_1 = require("../util/help");
function beforeRunHook(specs, options, clients) {
    return __awaiter(this, void 0, void 0, function () {
        var issueDetails;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!specs.some(function (spec) {
                        return options.cucumber &&
                            options.xray.uploadResults &&
                            spec.absolute.endsWith(options.cucumber.featureFileExtension);
                    })) return [3 /*break*/, 2];
                    logging_1.LOG.message(logging_1.Level.INFO, "Fetching necessary Jira issue type information in preparation for Cucumber result uploads...");
                    return [4 /*yield*/, clients.jiraClient.getIssueTypes()];
                case 1:
                    issueDetails = _a.sent();
                    if (!issueDetails) {
                        throw new Error((0, dedent_1.dedent)("\n                    Jira issue type information could not be fetched.\n\n                    Please make sure project ".concat(options.jira.projectKey, " exists at ").concat(options.jira.url, "\n\n                    For more information, visit:\n                    - ").concat(help_1.HELP.plugin.configuration.jira.projectKey, "\n                    - ").concat(help_1.HELP.plugin.configuration.jira.url, "\n                ")));
                    }
                    options.jira.testExecutionIssueDetails = retrieveIssueTypeInformation(options.jira.testExecutionIssueType, issueDetails, options.jira.projectKey);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.beforeRunHook = beforeRunHook;
function retrieveIssueTypeInformation(type, issueDetails, projectKey) {
    var details = issueDetails.filter(function (issueDetail) { return issueDetail.name === type; });
    if (details.length === 0) {
        throw new Error((0, dedent_1.dedent)("\n                Failed to retrieve issue type information for issue type: ".concat(type, "\n\n                Make sure you have Xray installed.\n\n                For more information, visit:\n                - ").concat(help_1.HELP.plugin.configuration.jira.testExecutionIssueType, "\n                - ").concat(help_1.HELP.plugin.configuration.jira.testPlanIssueType, "\n            ")));
    }
    else if (details.length > 1) {
        throw new Error((0, dedent_1.dedent)("\n                Found multiple issue types named: ".concat(type, "\n\n                Make sure to only make a single one available in project ").concat(projectKey, ".\n\n                For more information, visit:\n                - ").concat(help_1.HELP.plugin.configuration.jira.testExecutionIssueType, "\n                - ").concat(help_1.HELP.plugin.configuration.jira.testPlanIssueType, "\n            ")));
    }
    return details[0];
}
function afterRunHook(results, options, clients) {
    return __awaiter(this, void 0, void 0, function () {
        var runResult, issueKey, cucumberIssueKey;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    runResult = results;
                    issueKey = null;
                    if (!(0, preprocessing_1.containsNativeTest)(runResult, (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.featureFileExtension)) return [3 /*break*/, 2];
                    logging_1.LOG.message(logging_1.Level.INFO, "Uploading native Cypress test results...");
                    return [4 /*yield*/, uploadCypressResults(runResult, options, clients)];
                case 1:
                    issueKey = _c.sent();
                    if (options.jira.testExecutionIssueKey &&
                        issueKey &&
                        issueKey !== options.jira.testExecutionIssueKey) {
                        logging_1.LOG.message(logging_1.Level.WARNING, (0, dedent_1.dedent)("\n                    Cypress execution results were imported to test execution ".concat(issueKey, ", which is different from the configured one: ").concat(options.jira.testExecutionIssueKey, "\n\n                    Make sure issue ").concat(options.jira.testExecutionIssueKey, " actually exists and is of type: ").concat(options.jira.testExecutionIssueType, "\n                ")));
                    }
                    else if (!options.jira.testExecutionIssueKey && issueKey) {
                        // Prevents Cucumber results upload from creating yet another execution issue.
                        options.jira.testExecutionIssueKey = issueKey;
                    }
                    _c.label = 2;
                case 2:
                    if (!(0, preprocessing_1.containsCucumberTest)(runResult, (_b = options.cucumber) === null || _b === void 0 ? void 0 : _b.featureFileExtension)) return [3 /*break*/, 4];
                    logging_1.LOG.message(logging_1.Level.INFO, "Uploading Cucumber test results...");
                    return [4 /*yield*/, uploadCucumberResults(runResult, options, clients)];
                case 3:
                    cucumberIssueKey = _c.sent();
                    if (options.jira.testExecutionIssueKey &&
                        cucumberIssueKey &&
                        cucumberIssueKey !== options.jira.testExecutionIssueKey) {
                        logging_1.LOG.message(logging_1.Level.WARNING, (0, dedent_1.dedent)("\n                    Cucumber execution results were imported to test execution ".concat(cucumberIssueKey, ", which is different from the configured one: ").concat(options.jira.testExecutionIssueKey, "\n\n                    Make sure issue ").concat(options.jira.testExecutionIssueKey, " actually exists and is of type: ").concat(options.jira.testExecutionIssueType, "\n                ")));
                    }
                    if (options.jira.testExecutionIssueKey &&
                        issueKey &&
                        cucumberIssueKey &&
                        cucumberIssueKey !== issueKey) {
                        logging_1.LOG.message(logging_1.Level.WARNING, (0, dedent_1.dedent)("\n                    Cucumber execution results were imported to a different test execution issue than the Cypress execution results.\n\n                    This might be a bug, please report it at: https://github.com/Qytera-Gmbh/cypress-xray-plugin/issues\n                "));
                    }
                    else if (!issueKey && cucumberIssueKey) {
                        issueKey = cucumberIssueKey;
                    }
                    _c.label = 4;
                case 4:
                    if (issueKey === undefined) {
                        logging_1.LOG.message(logging_1.Level.WARNING, "Execution results import failed. Skipping remaining tasks");
                        return [2 /*return*/];
                    }
                    else if (issueKey === null) {
                        logging_1.LOG.message(logging_1.Level.WARNING, "Execution results import was skipped. Skipping remaining tasks");
                        return [2 /*return*/];
                    }
                    logging_1.LOG.message(logging_1.Level.SUCCESS, "Uploaded test results to issue: ".concat(issueKey, " (").concat(options.jira.url, "/browse/").concat(issueKey, ")"));
                    if (!options.jira.attachVideos) return [3 /*break*/, 6];
                    return [4 /*yield*/, attachVideos(runResult, issueKey, clients.jiraClient)];
                case 5:
                    _c.sent();
                    _c.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.afterRunHook = afterRunHook;
function uploadCypressResults(runResult, options, clients) {
    return __awaiter(this, void 0, void 0, function () {
        var converter, cypressExecution, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    converter = new importExecutionConverter_1.ImportExecutionConverter(options, clients.kind === "cloud");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, converter.toXrayJson(runResult)];
                case 2:
                    cypressExecution = _a.sent();
                    return [4 /*yield*/, clients.xrayClient.importExecution(cypressExecution)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    error_1 = _a.sent();
                    logging_1.LOG.message(logging_1.Level.ERROR, (0, errors_1.errorMessage)(error_1));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function uploadCucumberResults(runResult, options, clients) {
    return __awaiter(this, void 0, void 0, function () {
        var results, converter, cucumberMultipart;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!((_b = (_a = options.cucumber) === null || _a === void 0 ? void 0 : _a.preprocessor) === null || _b === void 0 ? void 0 : _b.json.output)) {
                        throw new Error("Failed to upload Cucumber results: Cucumber preprocessor JSON report path not configured");
                    }
                    results = JSON.parse(fs_1.default.readFileSync(options.cucumber.preprocessor.json.output, "utf-8"));
                    converter = new importExecutionCucumberMultipartConverter_1.ImportExecutionCucumberMultipartConverter(options, clients.kind === "cloud", clients.jiraRepository);
                    return [4 /*yield*/, converter.convert(results, runResult)];
                case 1:
                    cucumberMultipart = _c.sent();
                    return [4 /*yield*/, clients.xrayClient.importExecutionCucumberMultipart(cucumberMultipart.features, cucumberMultipart.info)];
                case 2: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
function attachVideos(runResult, issueKey, jiraClient) {
    return __awaiter(this, void 0, void 0, function () {
        var videos;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    videos = runResult.runs
                        .map(function (result) {
                        return result.video;
                    })
                        .filter(util_1.nonNull);
                    if (!(videos.length === 0)) return [3 /*break*/, 1];
                    logging_1.LOG.message(logging_1.Level.WARNING, "No videos were uploaded: No videos have been captured");
                    return [3 /*break*/, 3];
                case 1: return [4 /*yield*/, jiraClient.addAttachment.apply(jiraClient, __spreadArray([issueKey], videos, false))];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
