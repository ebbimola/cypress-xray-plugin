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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.XrayClientCloud = void 0;
var form_data_1 = require("form-data");
var requests_1 = require("../../https/requests");
var logging_1 = require("../../logging/logging");
var dedent_1 = require("../../util/dedent");
var errors_1 = require("../../util/errors");
var xrayClient_1 = require("./xrayClient");
var XrayClientCloud = /** @class */ (function (_super) {
    __extends(XrayClientCloud, _super);
    /**
     * Construct a new Xray cloud client using the provided credentials.
     *
     * @param credentials - the credentials to use during authentication
     */
    function XrayClientCloud(credentials) {
        return _super.call(this, XrayClientCloud.URL, credentials) || this;
    }
    XrayClientCloud.prototype.getUrlImportExecution = function () {
        return "".concat(this.apiBaseUrl, "/import/execution");
    };
    XrayClientCloud.prototype.getUrlExportCucumber = function (issueKeys, filter) {
        var query = [];
        if (issueKeys) {
            query.push("keys=".concat(issueKeys.join(";")));
        }
        if (filter) {
            query.push("filter=".concat(filter));
        }
        if (query.length === 0) {
            throw new Error("One of issueKeys or filter must be provided to export feature files");
        }
        return "".concat(this.apiBaseUrl, "/export/cucumber?").concat(query.join("&"));
    };
    XrayClientCloud.prototype.getUrlImportFeature = function (projectKey, projectId) {
        var query = [];
        if (projectKey) {
            query.push("projectKey=".concat(projectKey));
        }
        if (projectId) {
            query.push("projectId=".concat(projectId));
        }
        return "".concat(this.apiBaseUrl, "/import/feature?").concat(query.join("&"));
    };
    /**
     * Returns Xray test types for the provided test issues, such as `Manual`, `Cucumber` or
     * `Generic`.
     *
     * @param projectKey - key of the project containing the test issues
     * @param issueKeys - the keys of the test issues to retrieve test types for
     * @returns a promise which will contain the mapping of issues to test types
     */
    XrayClientCloud.prototype.getTestTypes = function (projectKey) {
        var issueKeys = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            issueKeys[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var authorizationHeader, progressInterval, types, total, start, jql, query, paginatedRequest, response, _a, _b, test_1, missingTypes, _c, issueKeys_1, issueKey, error_1;
            var _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _f.trys.push([0, 9, , 10]);
                        if (issueKeys.length === 0) {
                            logging_1.LOG.message(logging_1.Level.WARNING, "No issue keys provided. Skipping test type retrieval");
                            return [2 /*return*/, {}];
                        }
                        return [4 /*yield*/, this.credentials.getAuthorizationHeader()];
                    case 1:
                        authorizationHeader = _f.sent();
                        logging_1.LOG.message(logging_1.Level.DEBUG, "Retrieving test types...");
                        progressInterval = this.startResponseInterval(this.apiBaseUrl);
                        _f.label = 2;
                    case 2:
                        _f.trys.push([2, , 7, 8]);
                        types = {};
                        total = 0;
                        start = 0;
                        jql = "project = '".concat(projectKey, "' AND issue in (").concat(issueKeys.join(","), ")");
                        query = (0, dedent_1.dedent)("\n                    query($jql: String, $start: Int!, $limit: Int!) {\n                        getTests(jql: $jql, start: $start, limit: $limit) {\n                            total\n                            start\n                            results {\n                                testType {\n                                    name\n                                    kind\n                                }\n                                jira(fields: [\"key\"])\n                            }\n                        }\n                    }\n                ");
                        _f.label = 3;
                    case 3:
                        paginatedRequest = {
                            query: query,
                            variables: {
                                jql: jql,
                                start: start,
                                limit: XrayClientCloud.GRAPHQL_LIMITS.getTests,
                            },
                        };
                        return [4 /*yield*/, requests_1.REST.post(XrayClientCloud.URL_GRAPHQL, paginatedRequest, {
                                headers: __assign({}, authorizationHeader),
                            })];
                    case 4:
                        response = _f.sent();
                        total = (_d = response.data.data.getTests.total) !== null && _d !== void 0 ? _d : total;
                        if (response.data.data.getTests.results) {
                            if (typeof response.data.data.getTests.start === "number") {
                                start =
                                    response.data.data.getTests.start +
                                        response.data.data.getTests.results.length;
                            }
                            for (_a = 0, _b = response.data.data.getTests.results; _a < _b.length; _a++) {
                                test_1 = _b[_a];
                                if ((test_1 === null || test_1 === void 0 ? void 0 : test_1.jira.key) && ((_e = test_1.testType) === null || _e === void 0 ? void 0 : _e.name)) {
                                    types[test_1.jira.key] = test_1.testType.name;
                                }
                            }
                        }
                        _f.label = 5;
                    case 5:
                        if (start && start < total) return [3 /*break*/, 3];
                        _f.label = 6;
                    case 6:
                        missingTypes = [];
                        for (_c = 0, issueKeys_1 = issueKeys; _c < issueKeys_1.length; _c++) {
                            issueKey = issueKeys_1[_c];
                            if (!(issueKey in types)) {
                                missingTypes.push(issueKey);
                            }
                        }
                        if (missingTypes.length > 0) {
                            throw new Error((0, dedent_1.dedent)("\n                            Failed to retrieve test types for issues:\n\n                              ".concat(missingTypes.join("\n"), "\n\n                            Make sure these issues exist and are actually test issues\n                        ")));
                        }
                        logging_1.LOG.message(logging_1.Level.DEBUG, "Successfully retrieved test types for ".concat(issueKeys.length, " issues"));
                        return [2 /*return*/, types];
                    case 7:
                        clearInterval(progressInterval);
                        return [7 /*endfinally*/];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_1 = _f.sent();
                        logging_1.LOG.message(logging_1.Level.ERROR, "Failed to get test types: ".concat((0, errors_1.errorMessage)(error_1)));
                        logging_1.LOG.logErrorToFile(error_1, "getTestTypes");
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/, {}];
                }
            });
        });
    };
    XrayClientCloud.prototype.handleResponseImportExecution = function (response) {
        return response.key;
    };
    XrayClientCloud.prototype.handleResponseImportFeature = function (cloudResponse) {
        var _a, _b, _c;
        var response = {
            errors: [],
            updatedOrCreatedIssues: [],
        };
        if (cloudResponse.errors.length > 0) {
            (_a = response.errors).push.apply(_a, cloudResponse.errors);
            logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)("\n                    Encountered some errors during feature file import:\n                    ".concat(cloudResponse.errors.map(function (error) { return "- ".concat(error); }).join("\n"), "\n                ")));
        }
        if (cloudResponse.updatedOrCreatedTests.length > 0) {
            var testKeys = cloudResponse.updatedOrCreatedTests.map(function (test) { return test.key; });
            (_b = response.updatedOrCreatedIssues).push.apply(_b, testKeys);
            logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)("\n                    Successfully updated or created test issues:\n                    ".concat(testKeys.join("\n"), "\n                ")));
        }
        if (cloudResponse.updatedOrCreatedPreconditions.length > 0) {
            var preconditionKeys = cloudResponse.updatedOrCreatedPreconditions.map(function (test) { return test.key; });
            (_c = response.updatedOrCreatedIssues).push.apply(_c, preconditionKeys);
            logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)("\n                    Successfully updated or created precondition issues:\n                    ".concat(preconditionKeys.join(", "), "\n                ")));
        }
        return response;
    };
    XrayClientCloud.prototype.prepareRequestImportExecutionCucumberMultipart = function (cucumberJson, cucumberInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var formData, resultString, infoString, authorizationHeader;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        formData = new form_data_1.default();
                        resultString = JSON.stringify(cucumberJson);
                        infoString = JSON.stringify(cucumberInfo);
                        formData.append("results", resultString, {
                            filename: "results.json",
                        });
                        formData.append("info", infoString, {
                            filename: "info.json",
                        });
                        return [4 /*yield*/, this.credentials.getAuthorizationHeader()];
                    case 1:
                        authorizationHeader = _a.sent();
                        return [2 /*return*/, {
                                url: "".concat(this.apiBaseUrl, "/import/execution/cucumber/multipart"),
                                data: formData,
                                config: {
                                    headers: __assign(__assign({}, authorizationHeader), formData.getHeaders()),
                                },
                            }];
                }
            });
        });
    };
    XrayClientCloud.prototype.handleResponseImportExecutionCucumberMultipart = function (response) {
        return response.key;
    };
    /**
     * The URLs of Xray's Cloud API.
     * Note: API v1 would also work, but let's stick to the more recent one.
     */
    XrayClientCloud.URL = "https://xray.cloud.getxray.app/api/v2";
    XrayClientCloud.URL_GRAPHQL = "".concat(XrayClientCloud.URL, "/graphql");
    XrayClientCloud.GRAPHQL_LIMITS = {
        /**
         * @see https://xray.cloud.getxray.app/doc/graphql/gettests.doc.html
         */
        getTests: 100,
    };
    return XrayClientCloud;
}(xrayClient_1.AbstractXrayClient));
exports.XrayClientCloud = XrayClientCloud;
