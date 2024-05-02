"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.CachingJiraIssueFetcherCloud = exports.CachingJiraIssueFetcher = exports.SupportedFields = void 0;
var dedent_1 = require("../../../util/dedent");
var errors_1 = require("../../../util/errors");
var extraction_1 = require("../../../util/extraction");
var SupportedFields;
(function (SupportedFields) {
    SupportedFields["DESCRIPTION"] = "description";
    SupportedFields["SUMMARY"] = "summary";
    SupportedFields["LABELS"] = "labels";
    SupportedFields["TEST_ENVIRONMENTS"] = "test environments";
    SupportedFields["TEST_PLAN"] = "test plan";
    SupportedFields["TEST_TYPE"] = "test type";
})(SupportedFields || (exports.SupportedFields = SupportedFields = {}));
/**
 * A generic Jira issue data fetcher which fetches issue data for every call, i.e. does not perform
 * any caching.
 */
var CachingJiraIssueFetcher = /** @class */ (function () {
    /**
     * Constructs a new Jira issue fetcher. The Jira client is necessary for accessing Jira. The
     * field repository is required because issue data can only be retrieved through Jira fields,
     * which might have custom field IDs. An optional mapping of known field IDs can be provided,
     * which will then be used instead of accessing the field repository.
     *
     * @param jiraClient - the Jira client
     * @param jiraFieldRepository - the Jira field repository
     * @param fieldIds - an optional mapping of known field IDs
     */
    function CachingJiraIssueFetcher(jiraClient, jiraFieldRepository, fieldIds) {
        this.jiraClient = jiraClient;
        this.jiraFieldRepository = jiraFieldRepository;
        this.fieldIds = fieldIds;
    }
    CachingJiraIssueFetcher.prototype.fetchSummaries = function () {
        var issueKeys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            issueKeys[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var summaryId, fields;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        summaryId = (_a = this.fieldIds) === null || _a === void 0 ? void 0 : _a.summary;
                        if (!!summaryId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.jiraFieldRepository.getFieldId(SupportedFields.SUMMARY)];
                    case 1:
                        summaryId = _b.sent();
                        _b.label = 2;
                    case 2: return [4 /*yield*/, this.fetchFieldData.apply(this, __spreadArray([summaryId,
                            function (issue, fieldId) {
                                return (0, extraction_1.extractString)(issue.fields, fieldId);
                            }], issueKeys, false))];
                    case 3:
                        fields = _b.sent();
                        return [2 /*return*/, fields];
                }
            });
        });
    };
    CachingJiraIssueFetcher.prototype.fetchDescriptions = function () {
        var issueKeys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            issueKeys[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var descriptionId, fields;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        descriptionId = (_a = this.fieldIds) === null || _a === void 0 ? void 0 : _a.description;
                        if (!!descriptionId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.jiraFieldRepository.getFieldId(SupportedFields.DESCRIPTION)];
                    case 1:
                        descriptionId = _b.sent();
                        _b.label = 2;
                    case 2: return [4 /*yield*/, this.fetchFieldData.apply(this, __spreadArray([descriptionId,
                            function (issue, fieldId) {
                                return (0, extraction_1.extractString)(issue.fields, fieldId);
                            }], issueKeys, false))];
                    case 3:
                        fields = _b.sent();
                        return [2 /*return*/, fields];
                }
            });
        });
    };
    CachingJiraIssueFetcher.prototype.fetchLabels = function () {
        var issueKeys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            issueKeys[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var labelsId, fields;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        labelsId = (_a = this.fieldIds) === null || _a === void 0 ? void 0 : _a.labels;
                        if (!!labelsId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.jiraFieldRepository.getFieldId(SupportedFields.LABELS)];
                    case 1:
                        labelsId = _b.sent();
                        _b.label = 2;
                    case 2: return [4 /*yield*/, this.fetchFieldData.apply(this, __spreadArray([labelsId,
                            function (issue, fieldId) {
                                return (0, extraction_1.extractArrayOfStrings)(issue.fields, fieldId);
                            }], issueKeys, false))];
                    case 3:
                        fields = _b.sent();
                        return [2 /*return*/, fields];
                }
            });
        });
    };
    CachingJiraIssueFetcher.prototype.fetchTestTypes = function () {
        var issueKeys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            issueKeys[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var testTypeId, fields;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        testTypeId = (_a = this.fieldIds) === null || _a === void 0 ? void 0 : _a.testType;
                        if (!!testTypeId) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.jiraFieldRepository.getFieldId(SupportedFields.TEST_TYPE)];
                    case 1:
                        testTypeId = _b.sent();
                        _b.label = 2;
                    case 2: return [4 /*yield*/, this.fetchFieldData.apply(this, __spreadArray([testTypeId,
                            function (issue, fieldId) {
                                return (0, extraction_1.extractNestedString)(issue.fields, [fieldId, "value"]);
                            }], issueKeys, false))];
                    case 3:
                        fields = _b.sent();
                        return [2 /*return*/, fields];
                }
            });
        });
    };
    CachingJiraIssueFetcher.prototype.fetchFieldData = function (fieldId, extractor) {
        var issueKeys = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            issueKeys[_i - 2] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var results, issues, issuesWithUnparseableField, _a, issues_1, issue, _b, _c, error_1;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        results = {};
                        return [4 /*yield*/, this.jiraClient.search({
                                jql: "issue in (".concat(issueKeys.join(","), ")"),
                                fields: [fieldId],
                            })];
                    case 1:
                        issues = _e.sent();
                        if (!issues) return [3 /*break*/, 10];
                        issuesWithUnparseableField = [];
                        _a = 0, issues_1 = issues;
                        _e.label = 2;
                    case 2:
                        if (!(_a < issues_1.length)) return [3 /*break*/, 9];
                        issue = issues_1[_a];
                        _e.label = 3;
                    case 3:
                        _e.trys.push([3, 7, , 8]);
                        if (!issue.key) return [3 /*break*/, 5];
                        _b = results;
                        _c = issue.key;
                        return [4 /*yield*/, extractor(issue, fieldId)];
                    case 4:
                        _b[_c] = _e.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        issuesWithUnparseableField.push("Unknown: ".concat(JSON.stringify(issue)));
                        _e.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_1 = _e.sent();
                        issuesWithUnparseableField.push("".concat((_d = issue.key) !== null && _d !== void 0 ? _d : "Unknown issue", ": ").concat((0, errors_1.errorMessage)(error_1)));
                        return [3 /*break*/, 8];
                    case 8:
                        _a++;
                        return [3 /*break*/, 2];
                    case 9:
                        if (issuesWithUnparseableField.length > 0) {
                            issuesWithUnparseableField.sort();
                            throw new Error((0, dedent_1.dedent)("\n                        Failed to parse Jira field with ID: ".concat(fieldId, "\n                        Make sure the correct field is present on the following issues:\n\n                          ").concat(issuesWithUnparseableField.join("\n"), "\n                    ")));
                        }
                        _e.label = 10;
                    case 10: return [2 /*return*/, results];
                }
            });
        });
    };
    return CachingJiraIssueFetcher;
}());
exports.CachingJiraIssueFetcher = CachingJiraIssueFetcher;
var CachingJiraIssueFetcherCloud = /** @class */ (function (_super) {
    __extends(CachingJiraIssueFetcherCloud, _super);
    function CachingJiraIssueFetcherCloud(jiraClient, jiraFieldRepository, xrayClient, jiraOptions) {
        var _this = _super.call(this, jiraClient, jiraFieldRepository, jiraOptions.fields) || this;
        _this.xrayClient = xrayClient;
        _this.jiraOptions = jiraOptions;
        return _this;
    }
    CachingJiraIssueFetcherCloud.prototype.fetchTestTypes = function () {
        var issueKeys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            issueKeys[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, (_a = this.xrayClient).getTestTypes.apply(_a, __spreadArray([this.jiraOptions.projectKey], issueKeys, false))];
                    case 1: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    return CachingJiraIssueFetcherCloud;
}(CachingJiraIssueFetcher));
exports.CachingJiraIssueFetcherCloud = CachingJiraIssueFetcherCloud;
