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
exports.AbstractXrayClient = void 0;
var axios_1 = require("axios");
var form_data_1 = require("form-data");
var fs_1 = require("fs");
var requests_1 = require("../../https/requests");
var logging_1 = require("../../logging/logging");
var dedent_1 = require("../../util/dedent");
var errors_1 = require("../../util/errors");
var help_1 = require("../../util/help");
var client_1 = require("../client");
/**
 * An abstract Xray client class for communicating with Xray instances.
 */
var AbstractXrayClient = /** @class */ (function (_super) {
    __extends(AbstractXrayClient, _super);
    function AbstractXrayClient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractXrayClient.prototype.importExecution = function (execution) {
        return __awaiter(this, void 0, void 0, function () {
            var authorizationHeader, progressInterval, response, key, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        if (!execution.tests || execution.tests.length === 0) {
                            logging_1.LOG.message(logging_1.Level.WARNING, "No native Cypress tests were executed. Skipping native upload.");
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.credentials.getAuthorizationHeader()];
                    case 1:
                        authorizationHeader = _a.sent();
                        logging_1.LOG.message(logging_1.Level.DEBUG, "Importing execution...");
                        progressInterval = this.startResponseInterval(this.apiBaseUrl);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 4, 5]);
                        return [4 /*yield*/, requests_1.REST.post(this.getUrlImportExecution(), execution, {
                                headers: __assign({}, authorizationHeader),
                            })];
                    case 3:
                        response = _a.sent();
                        key = this.handleResponseImportExecution(response.data);
                        logging_1.LOG.message(logging_1.Level.DEBUG, "Successfully uploaded test execution results to ".concat(key, "."));
                        return [2 /*return*/, key];
                    case 4:
                        clearInterval(progressInterval);
                        return [7 /*endfinally*/];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        logging_1.LOG.message(logging_1.Level.ERROR, "Failed to import execution: ".concat((0, errors_1.errorMessage)(error_1)));
                        logging_1.LOG.logErrorToFile(error_1, "importExecutionError");
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AbstractXrayClient.prototype.exportCucumber = function (keys, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var authorizationHeader, progressInterval, response, contentDisposition, filenameStart, filenameEnd, filename, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.credentials.getAuthorizationHeader()];
                    case 1:
                        authorizationHeader = _a.sent();
                        logging_1.LOG.message(logging_1.Level.DEBUG, "Exporting Cucumber tests...");
                        progressInterval = this.startResponseInterval(this.apiBaseUrl);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 4, 5]);
                        return [4 /*yield*/, requests_1.REST.get(this.getUrlExportCucumber(keys, filter), {
                                headers: __assign({}, authorizationHeader),
                            })];
                    case 3:
                        response = _a.sent();
                        // Extract filename from response.
                        if ("Content-Disposition" in response.headers) {
                            contentDisposition = response.headers["Content-Disposition"];
                            filenameStart = contentDisposition.indexOf('"');
                            filenameEnd = contentDisposition.lastIndexOf('"');
                            filename = contentDisposition.substring(filenameStart, filenameEnd);
                            fs_1.default.writeFileSync(filename, response.data);
                        }
                        else {
                            throw new Error("Content-Disposition header does not contain a filename");
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        clearInterval(progressInterval);
                        return [7 /*endfinally*/];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        logging_1.LOG.message(logging_1.Level.ERROR, "Failed to export Cucumber tests: ".concat((0, errors_1.errorMessage)(error_2)));
                        logging_1.LOG.logErrorToFile(error_2, "exportCucumberError");
                        return [3 /*break*/, 7];
                    case 7: throw new Error("Method not implemented.");
                }
            });
        });
    };
    AbstractXrayClient.prototype.importFeature = function (file, projectKey, projectId, source) {
        return __awaiter(this, void 0, void 0, function () {
            var authorizationHeader, progressInterval, fileContent, form, response, error_3;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.credentials.getAuthorizationHeader()];
                    case 1:
                        authorizationHeader = _b.sent();
                        logging_1.LOG.message(logging_1.Level.DEBUG, "Importing Cucumber features...");
                        progressInterval = this.startResponseInterval(this.apiBaseUrl);
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, , 4, 5]);
                        fileContent = fs_1.default.createReadStream(file);
                        form = new form_data_1.default();
                        form.append("file", fileContent);
                        return [4 /*yield*/, requests_1.REST.post(this.getUrlImportFeature(projectKey, projectId, source), form, {
                                headers: __assign(__assign({}, authorizationHeader), form.getHeaders()),
                            })];
                    case 3:
                        response = _b.sent();
                        return [2 /*return*/, this.handleResponseImportFeature(response.data)];
                    case 4:
                        clearInterval(progressInterval);
                        return [7 /*endfinally*/];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_3 = _b.sent();
                        logging_1.LOG.logErrorToFile(error_3, "importFeatureError");
                        if ((0, axios_1.isAxiosError)(error_3) && ((_a = error_3.response) === null || _a === void 0 ? void 0 : _a.status) === axios_1.HttpStatusCode.BadRequest) {
                            logging_1.LOG.message(logging_1.Level.ERROR, (0, dedent_1.dedent)("\n                        Failed to import Cucumber features: ".concat((0, errors_1.errorMessage)(error_3), "\n\n                        The prefixes in Cucumber background or scenario tags might be inconsistent with the scheme defined in Xray\n\n                        For more information, visit:\n                        - ").concat(help_1.HELP.plugin.configuration.cucumber.prefixes, "\n                    ")));
                        }
                        else {
                            logging_1.LOG.message(logging_1.Level.ERROR, "Failed to import Cucumber features: ".concat((0, errors_1.errorMessage)(error_3)));
                        }
                        throw new errors_1.LoggedError("Feature file import failed");
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    AbstractXrayClient.prototype.importExecutionCucumberMultipart = function (cucumberJson, cucumberInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var request, progressInterval, response, key, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        if (cucumberJson.length === 0) {
                            logging_1.LOG.message(logging_1.Level.WARNING, "No Cucumber tests were executed. Skipping Cucumber upload.");
                            return [2 /*return*/, null];
                        }
                        logging_1.LOG.message(logging_1.Level.DEBUG, "Importing execution (Cucumber)...");
                        return [4 /*yield*/, this.prepareRequestImportExecutionCucumberMultipart(cucumberJson, cucumberInfo)];
                    case 1:
                        request = _a.sent();
                        progressInterval = this.startResponseInterval(this.apiBaseUrl);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, , 4, 5]);
                        return [4 /*yield*/, requests_1.REST.post(request.url, request.data, request.config)];
                    case 3:
                        response = _a.sent();
                        key = this.handleResponseImportExecutionCucumberMultipart(response.data);
                        logging_1.LOG.message(logging_1.Level.DEBUG, "Successfully uploaded Cucumber test execution results to ".concat(key, "."));
                        return [2 /*return*/, key];
                    case 4:
                        clearInterval(progressInterval);
                        return [7 /*endfinally*/];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_4 = _a.sent();
                        logging_1.LOG.message(logging_1.Level.ERROR, "Failed to import Cucumber execution: ".concat((0, errors_1.errorMessage)(error_4)));
                        logging_1.LOG.logErrorToFile(error_4, "importExecutionCucumberMultipartError");
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return AbstractXrayClient;
}(client_1.Client));
exports.AbstractXrayClient = AbstractXrayClient;
