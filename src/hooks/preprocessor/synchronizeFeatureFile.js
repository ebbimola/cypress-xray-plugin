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
exports.importKnownFeature = exports.synchronizeFeatureFile = void 0;
var path_1 = require("path");
var logging_1 = require("../../logging/logging");
var preprocessing_1 = require("../../preprocessing/preprocessing");
var jiraIssueFetcher_1 = require("../../repository/jira/fields/jiraIssueFetcher");
var dedent_1 = require("../../util/dedent");
var errors_1 = require("../../util/errors");
var help_1 = require("../../util/help");
var set_1 = require("../../util/set");
function synchronizeFeatureFile(file, projectRoot, options, clients) {
    return __awaiter(this, void 0, void 0, function () {
        var relativePath, issueData, issueKeys, testSummaries, testLabels, updatedIssues_1, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!options.cucumber ||
                        !file.filePath.endsWith(options.cucumber.featureFileExtension) ||
                        !options.cucumber.uploadFeatures) {
                        return [2 /*return*/, file.filePath];
                    }
                    relativePath = path_1.default.relative(projectRoot, file.filePath);
                    logging_1.LOG.message(logging_1.Level.INFO, "Preprocessing feature file ".concat(relativePath, "..."));
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 7, , 8]);
                    issueData = (0, preprocessing_1.getCucumberIssueData)(file.filePath, options.jira.projectKey, clients.kind === "cloud", options.cucumber.prefixes);
                    issueKeys = __spreadArray(__spreadArray([], issueData.tests.map(function (data) { return data.key; }), true), issueData.preconditions.map(function (data) { return data.key; }), true);
                    // Xray currently (almost) always overwrites issue summaries when importing feature
                    // files to existing issues. Therefore, we manually need to backup and reset the
                    // summary once the import is done.
                    // See: https://docs.getxray.app/display/XRAY/Importing+Cucumber+Tests+-+REST
                    // See: https://docs.getxray.app/display/XRAYCLOUD/Importing+Cucumber+Tests+-+REST+v2
                    logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)("\n                Creating issue backups (summaries, labels) for issues:\n                  ".concat(issueKeys.join("\n"), "\n            ")));
                    logging_1.LOG.message(logging_1.Level.INFO, "Importing feature file to Xray...");
                    return [4 /*yield*/, (_a = clients.jiraRepository).getSummaries.apply(_a, issueKeys)];
                case 2:
                    testSummaries = _c.sent();
                    return [4 /*yield*/, (_b = clients.jiraRepository).getLabels.apply(_b, issueKeys)];
                case 3:
                    testLabels = _c.sent();
                    return [4 /*yield*/, importKnownFeature(file.filePath, options.jira.projectKey, issueKeys, clients.xrayClient)];
                case 4:
                    updatedIssues_1 = _c.sent();
                    // We can skip restoring issues which:
                    // - Jira created (in overlap: right only)
                    // - Jira did not update (in overlap: left only)
                    issueData = {
                        tests: issueData.tests.filter(function (test) { return updatedIssues_1.includes(test.key); }),
                        preconditions: issueData.tests.filter(function (precondition) {
                            return updatedIssues_1.includes(precondition.key);
                        }),
                    };
                    return [4 /*yield*/, resetSummaries(issueData, testSummaries, clients.jiraClient, clients.jiraRepository)];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, resetLabels(issueData.tests, testLabels, clients.jiraClient, clients.jiraRepository)];
                case 6:
                    _c.sent();
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _c.sent();
                    logging_1.LOG.message(logging_1.Level.ERROR, (0, dedent_1.dedent)("\n                Feature file invalid, skipping synchronization: ".concat(file.filePath, "\n\n                ").concat((0, errors_1.errorMessage)(error_1), "\n            ")));
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/, file.filePath];
            }
        });
    });
}
exports.synchronizeFeatureFile = synchronizeFeatureFile;
/**
 * Imports a feature file to Xray containings tags which correspond to known issues.
 *
 * @param filePath - the feature file
 * @param projectKey - the project to import the features to
 * @param expectedIssues - all issue keys which are expected to be updated
 * @param xrayClient - the Xray client
 * @returns all issue keys within the feature file belonging to issues that were updated by Jira
 */
function importKnownFeature(filePath, projectKey, expectedIssues, xrayClient) {
    return __awaiter(this, void 0, void 0, function () {
        var importResponse, setOverlap, mismatchLines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, xrayClient.importFeature(filePath, projectKey)];
                case 1:
                    importResponse = _a.sent();
                    if (importResponse.errors.length > 0) {
                        logging_1.LOG.message(logging_1.Level.WARNING, (0, dedent_1.dedent)("\n                Encountered errors during feature file import:\n                ".concat(importResponse.errors.map(function (error) { return "- ".concat(error); }).join("\n"), "\n            ")));
                    }
                    setOverlap = (0, set_1.computeOverlap)(expectedIssues, importResponse.updatedOrCreatedIssues);
                    if (setOverlap.leftOnly.length > 0 || setOverlap.rightOnly.length > 0) {
                        mismatchLines = [];
                        if (setOverlap.leftOnly.length > 0) {
                            mismatchLines.push("Issues contained in feature file tags which were not updated by Jira and might not exist:");
                            mismatchLines.push.apply(mismatchLines, setOverlap.leftOnly.map(function (issueKey) { return "  ".concat(issueKey); }));
                        }
                        if (setOverlap.rightOnly.length > 0) {
                            mismatchLines.push("Issues updated by Jira which are not present in feature file tags and might have been created:");
                            mismatchLines.push.apply(mismatchLines, setOverlap.rightOnly.map(function (issueKey) { return "  ".concat(issueKey); }));
                        }
                        logging_1.LOG.message(logging_1.Level.WARNING, (0, dedent_1.dedent)("\n                Mismatch between feature file issue tags and updated Jira issues detected\n\n                ".concat(mismatchLines.join("\n"), "\n\n                Make sure that:\n                - All issues present in feature file tags belong to existing issues\n                - Your plugin tag prefix settings are consistent with the ones defined in Xray\n\n                More information:\n                - ").concat(help_1.HELP.plugin.guides.targetingExistingIssues, "\n                - ").concat(help_1.HELP.plugin.configuration.cucumber.prefixes, "\n            ")));
                    }
                    return [2 /*return*/, setOverlap.intersection];
            }
        });
    });
}
exports.importKnownFeature = importKnownFeature;
function resetSummaries(issueData, testSummaries, jiraClient, jiraRepository) {
    return __awaiter(this, void 0, void 0, function () {
        var allIssues, _i, allIssues_1, issue, issueKey, oldSummary, newSummary, summaryFieldId, fields;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    allIssues = __spreadArray(__spreadArray([], issueData.tests, true), issueData.preconditions, true);
                    _i = 0, allIssues_1 = allIssues;
                    _b.label = 1;
                case 1:
                    if (!(_i < allIssues_1.length)) return [3 /*break*/, 6];
                    issue = allIssues_1[_i];
                    issueKey = issue.key;
                    oldSummary = testSummaries[issueKey];
                    newSummary = issue.summary;
                    if (!oldSummary) {
                        logging_1.LOG.message(logging_1.Level.ERROR, (0, dedent_1.dedent)("\n                    Failed to reset issue summary of issue to its old summary: ".concat(issueKey, "\n                    The issue's old summary could not be fetched, make sure to restore it manually if needed\n\n                    Summary post sync: ").concat(newSummary, "\n                ")));
                        return [3 /*break*/, 5];
                    }
                    if (!(oldSummary !== newSummary)) return [3 /*break*/, 4];
                    return [4 /*yield*/, jiraRepository.getFieldId(jiraIssueFetcher_1.SupportedFields.SUMMARY)];
                case 2:
                    summaryFieldId = _b.sent();
                    logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)("\n                    Resetting issue summary of issue: ".concat(issueKey, "\n\n                    Summary pre sync:  ").concat(oldSummary, "\n                    Summary post sync: ").concat(newSummary, "\n                ")));
                    fields = (_a = {}, _a[summaryFieldId] = oldSummary, _a);
                    return [4 /*yield*/, jiraClient.editIssue(issueKey, { fields: fields })];
                case 3:
                    if (!(_b.sent())) {
                        logging_1.LOG.message(logging_1.Level.ERROR, (0, dedent_1.dedent)("\n                        Failed to reset issue summary of issue to its old summary: ".concat(issueKey, "\n\n                        Summary pre sync:  ").concat(oldSummary, "\n                        Summary post sync: ").concat(newSummary, "\n\n                        Make sure to reset it manually if needed\n                    ")));
                    }
                    return [3 /*break*/, 5];
                case 4:
                    logging_1.LOG.message(logging_1.Level.DEBUG, "Issue summary is identical to scenario (outline) name already: ".concat(issueKey, " (").concat(oldSummary, ")"));
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function resetLabels(issueData, testLabels, jiraClient, jiraRepository) {
    return __awaiter(this, void 0, void 0, function () {
        var _loop_1, _i, issueData_1, issue;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _loop_1 = function (issue) {
                        var issueKey, newLabels, oldLabels, labelFieldId, fields;
                        var _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    issueKey = issue.key;
                                    newLabels = issue.tags;
                                    if (!(issueKey in testLabels)) {
                                        logging_1.LOG.message(logging_1.Level.ERROR, (0, dedent_1.dedent)("\n                    Failed to reset issue labels of issue to its old labels: ".concat(issueKey, "\n                    The issue's old labels could not be fetched, make sure to restore them manually if needed\n\n                    Labels post sync: ").concat(newLabels.join(","), "\n                ")));
                                        return [2 /*return*/, "continue"];
                                    }
                                    oldLabels = testLabels[issueKey];
                                    if (!!newLabels.every(function (label) { return oldLabels.includes(label); })) return [3 /*break*/, 3];
                                    return [4 /*yield*/, jiraRepository.getFieldId(jiraIssueFetcher_1.SupportedFields.LABELS)];
                                case 1:
                                    labelFieldId = _c.sent();
                                    logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)("\n                    Resetting issue labels of issue: ".concat(issueKey, "\n\n                    Labels pre sync:  ").concat(oldLabels.join(","), "\n                    Labels post sync: ").concat(newLabels.join(","), "\n                ")));
                                    fields = (_b = {}, _b[labelFieldId] = oldLabels, _b);
                                    return [4 /*yield*/, jiraClient.editIssue(issueKey, { fields: fields })];
                                case 2:
                                    if (!(_c.sent())) {
                                        logging_1.LOG.message(logging_1.Level.ERROR, (0, dedent_1.dedent)("\n                        Failed to reset issue labels of issue to its old labels: ".concat(issueKey, "\n\n                        Labels pre sync:  ").concat(oldLabels.join(","), "\n                        Labels post sync: ").concat(newLabels.join(","), "\n\n                        Make sure to reset them manually if needed\n                    ")));
                                    }
                                    return [3 /*break*/, 4];
                                case 3:
                                    logging_1.LOG.message(logging_1.Level.DEBUG, "Issue labels are identical to scenario (outline) labels already: ".concat(issueKey, " (").concat(oldLabels.join(","), ")"));
                                    _c.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, issueData_1 = issueData;
                    _a.label = 1;
                case 1:
                    if (!(_i < issueData_1.length)) return [3 /*break*/, 4];
                    issue = issueData_1[_i];
                    return [5 /*yield**/, _loop_1(issue)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
