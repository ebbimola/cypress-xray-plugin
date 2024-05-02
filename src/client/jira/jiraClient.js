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
exports.AbstractJiraClient = void 0;
var form_data_1 = require("form-data");
var fs_1 = require("fs");
var requests_1 = require("../../https/requests");
var logging_1 = require("../../logging/logging");
var dedent_1 = require("../../util/dedent");
var errors_1 = require("../../util/errors");
var client_1 = require("../client");
/**
 * A Jira client class for communicating with Jira instances.
 */
var AbstractJiraClient = /** @class */ (function (_super) {
    __extends(AbstractJiraClient, _super);
    function AbstractJiraClient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractJiraClient.prototype.addAttachment = function (issueIdOrKey) {
        var files = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            files[_i - 1] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            var form, filesIncluded, header, progressInterval, response, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (files.length === 0) {
                            logging_1.LOG.message(logging_1.Level.WARNING, "No files provided to attach to issue ".concat(issueIdOrKey, ". Skipping attaching."));
                            return [2 /*return*/, []];
                        }
                        form = new form_data_1.default();
                        filesIncluded = 0;
                        files.forEach(function (file) {
                            if (!fs_1.default.existsSync(file)) {
                                logging_1.LOG.message(logging_1.Level.WARNING, "File does not exist:", file);
                                return;
                            }
                            filesIncluded++;
                            var fileContent = fs_1.default.createReadStream(file);
                            form.append("file", fileContent);
                        });
                        if (filesIncluded === 0) {
                            logging_1.LOG.message(logging_1.Level.WARNING, "All files do not exist. Skipping attaching.");
                            return [2 /*return*/, []];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, this.credentials.getAuthorizationHeader()];
                    case 2:
                        header = _b.sent();
                        logging_1.LOG.message.apply(logging_1.LOG, __spreadArray([logging_1.Level.DEBUG, "Attaching files:"], files, false));
                        progressInterval = this.startResponseInterval(this.apiBaseUrl);
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, , 5, 6]);
                        return [4 /*yield*/, requests_1.REST.post(this.getUrlAddAttachment(issueIdOrKey), form, {
                                headers: __assign(__assign(__assign({}, header), form.getHeaders()), (_a = {}, _a["X-Atlassian-Token"] = "no-check", _a)),
                            })];
                    case 4:
                        response = _b.sent();
                        logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)("\n                        Successfully attached files to issue: ".concat(issueIdOrKey, "\n                          ").concat(response.data.map(function (attachment) { return attachment.filename; }).join("\n"), "\n                    ")));
                        return [2 /*return*/, response.data];
                    case 5:
                        clearInterval(progressInterval);
                        return [7 /*endfinally*/];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_1 = _b.sent();
                        logging_1.LOG.message(logging_1.Level.ERROR, "Failed to attach files: ".concat((0, errors_1.errorMessage)(error_1)));
                        logging_1.LOG.logErrorToFile(error_1, "addAttachmentError");
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    AbstractJiraClient.prototype.getIssueTypes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var authorizationHeader, progressInterval, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.credentials.getAuthorizationHeader()];
                    case 1:
                        authorizationHeader = _a.sent();
                        logging_1.LOG.message(logging_1.Level.DEBUG, "Getting issue types...");
                        progressInterval = this.startResponseInterval(this.apiBaseUrl);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 4, 5]);
                        return [4 /*yield*/, requests_1.REST.get(this.getUrlGetIssueTypes(), {
                                headers: __assign({}, authorizationHeader),
                            })];
                    case 3:
                        response = _a.sent();
                        logging_1.LOG.message(logging_1.Level.DEBUG, "Successfully retrieved data for ".concat(response.data.length, " issue types."));
                        logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)("\n                        Received data for issue types:\n                        ".concat(response.data
                            .map(function (issueType) { return "".concat(issueType.name, " (id: ").concat(issueType.id, ")"); })
                            .join("\n"), "\n                    ")));
                        return [2 /*return*/, response.data];
                    case 4:
                        clearInterval(progressInterval);
                        return [7 /*endfinally*/];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        logging_1.LOG.message(logging_1.Level.ERROR, "Failed to get issue types: ".concat((0, errors_1.errorMessage)(error_2)));
                        logging_1.LOG.logErrorToFile(error_2, "getIssueTypesError");
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AbstractJiraClient.prototype.getFields = function () {
        return __awaiter(this, void 0, void 0, function () {
            var authorizationHeader, progressInterval, response, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.credentials.getAuthorizationHeader()];
                    case 1:
                        authorizationHeader = _a.sent();
                        logging_1.LOG.message(logging_1.Level.DEBUG, "Getting fields...");
                        progressInterval = this.startResponseInterval(this.apiBaseUrl);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 4, 5]);
                        return [4 /*yield*/, requests_1.REST.get(this.getUrlGetFields(), {
                                headers: __assign({}, authorizationHeader),
                            })];
                    case 3:
                        response = _a.sent();
                        logging_1.LOG.message(logging_1.Level.DEBUG, "Successfully retrieved data for ".concat(response.data.length, " fields"));
                        logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)("\n                        Received data for fields:\n                        ".concat(response.data
                            .map(function (field) { return "".concat(field.name, " (id: ").concat(field.id, ")"); })
                            .join("\n"), "\n                    ")));
                        return [2 /*return*/, response.data];
                    case 4:
                        clearInterval(progressInterval);
                        return [7 /*endfinally*/];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_3 = _a.sent();
                        logging_1.LOG.message(logging_1.Level.ERROR, "Failed to get fields: ".concat((0, errors_1.errorMessage)(error_3)));
                        logging_1.LOG.logErrorToFile(error_3, "getFieldsError");
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AbstractJiraClient.prototype.search = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var header, progressInterval, total, startAt, results, paginatedRequest, response, error_4;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 9, , 10]);
                        return [4 /*yield*/, this.credentials.getAuthorizationHeader()];
                    case 1:
                        header = _c.sent();
                        logging_1.LOG.message(logging_1.Level.DEBUG, "Searching issues...");
                        progressInterval = this.startResponseInterval(this.apiBaseUrl);
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, , 7, 8]);
                        total = 0;
                        startAt = (_a = request.startAt) !== null && _a !== void 0 ? _a : 0;
                        results = [];
                        _c.label = 3;
                    case 3:
                        paginatedRequest = __assign(__assign({}, request), { startAt: startAt });
                        return [4 /*yield*/, requests_1.REST.post(this.getUrlPostSearch(), paginatedRequest, {
                                headers: __assign({}, header),
                            })];
                    case 4:
                        response = _c.sent();
                        total = (_b = response.data.total) !== null && _b !== void 0 ? _b : total;
                        if (response.data.issues) {
                            results.push.apply(results, response.data.issues);
                            // Explicit check because it could also be 0.
                            if (typeof response.data.startAt === "number") {
                                startAt = response.data.startAt + response.data.issues.length;
                            }
                        }
                        _c.label = 5;
                    case 5:
                        if (startAt && startAt < total) return [3 /*break*/, 3];
                        _c.label = 6;
                    case 6:
                        logging_1.LOG.message(logging_1.Level.DEBUG, "Found ".concat(total, " issues"));
                        return [2 /*return*/, results];
                    case 7:
                        clearInterval(progressInterval);
                        return [7 /*endfinally*/];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_4 = _c.sent();
                        logging_1.LOG.message(logging_1.Level.ERROR, "Failed to search issues: ".concat((0, errors_1.errorMessage)(error_4)));
                        logging_1.LOG.logErrorToFile(error_4, "searchError");
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    AbstractJiraClient.prototype.editIssue = function (issueIdOrKey, issueUpdateData) {
        return __awaiter(this, void 0, void 0, function () {
            var header, progressInterval, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.credentials.getAuthorizationHeader()];
                    case 1:
                        header = _a.sent();
                        logging_1.LOG.message(logging_1.Level.DEBUG, "Editing issue...");
                        progressInterval = this.startResponseInterval(this.apiBaseUrl);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 4, 5]);
                        return [4 /*yield*/, requests_1.REST.put(this.getUrlEditIssue(issueIdOrKey), issueUpdateData, {
                                headers: __assign({}, header),
                            })];
                    case 3:
                        _a.sent();
                        logging_1.LOG.message(logging_1.Level.DEBUG, "Successfully edited issue: ".concat(issueIdOrKey));
                        return [3 /*break*/, 5];
                    case 4:
                        clearInterval(progressInterval);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/, issueIdOrKey];
                    case 6:
                        error_5 = _a.sent();
                        logging_1.LOG.message(logging_1.Level.ERROR, "Failed to edit issue: ".concat((0, errors_1.errorMessage)(error_5)));
                        logging_1.LOG.logErrorToFile(error_5, "editIssue");
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return AbstractJiraClient;
}(client_1.Client));
exports.AbstractJiraClient = AbstractJiraClient;
