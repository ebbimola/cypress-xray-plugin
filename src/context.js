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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initClients = exports.initSslOptions = exports.initCucumberOptions = exports.initXrayOptions = exports.initPluginOptions = exports.initJiraOptions = exports.clearPluginContext = exports.setPluginContext = exports.getPluginContext = void 0;
var credentials_1 = require("./authentication/credentials");
var jiraClientCloud_1 = require("./client/jira/jiraClientCloud");
var jiraClientServer_1 = require("./client/jira/jiraClientServer");
var xrayClientCloud_1 = require("./client/xray/xrayClientCloud");
var xrayClientServer_1 = require("./client/xray/xrayClientServer");
var dependencies_1 = require("./dependencies");
var env_1 = require("./env");
var logging_1 = require("./logging/logging");
var jiraFieldRepository_1 = require("./repository/jira/fields/jiraFieldRepository");
var jiraIssueFetcher_1 = require("./repository/jira/fields/jiraIssueFetcher");
var jiraRepository_1 = require("./repository/jira/jiraRepository");
var dedent_1 = require("./util/dedent");
var errors_1 = require("./util/errors");
var help_1 = require("./util/help");
var parsing_1 = require("./util/parsing");
var ping_1 = require("./util/ping");
var context = undefined;
function getPluginContext() {
    return context;
}
exports.getPluginContext = getPluginContext;
function setPluginContext(newContext) {
    context = newContext;
}
exports.setPluginContext = setPluginContext;
function clearPluginContext() {
    context = undefined;
}
exports.clearPluginContext = clearPluginContext;
/**
 * Returns an {@link InternalJiraOptions | `InternalJiraOptions`} instance based on parsed
 * environment variables and a provided options object. Environment variables will take precedence
 * over the options set in the object.
 *
 * @param env - an object containing environment variables as properties
 * @param options - an options object containing Jira options
 * @returns the constructed internal Jira options
 */
function initJiraOptions(env, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
    var projectKey = (_a = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.projectKey, parsing_1.asString)) !== null && _a !== void 0 ? _a : options.projectKey;
    if (!projectKey) {
        throw new Error("Plugin misconfiguration: Jira project key was not set");
    }
    var testExecutionIssueKey = (_b = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.testExecutionIssueKey, parsing_1.asString)) !== null && _b !== void 0 ? _b : options.testExecutionIssueKey;
    if (testExecutionIssueKey && !testExecutionIssueKey.startsWith(projectKey)) {
        throw new Error("Plugin misconfiguration: test execution issue key ".concat(testExecutionIssueKey, " does not belong to project ").concat(projectKey));
    }
    var testPlanIssueKey = (_c = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.testPlanIssueKey, parsing_1.asString)) !== null && _c !== void 0 ? _c : options.testPlanIssueKey;
    if (testPlanIssueKey && !testPlanIssueKey.startsWith(projectKey)) {
        throw new Error("Plugin misconfiguration: test plan issue key ".concat(testPlanIssueKey, " does not belong to project ").concat(projectKey));
    }
    return {
        attachVideos: (_e = (_d = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.attachVideos, parsing_1.asBoolean)) !== null && _d !== void 0 ? _d : options.attachVideos) !== null && _e !== void 0 ? _e : false,
        fields: {
            description: (_f = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.fields.description, parsing_1.asString)) !== null && _f !== void 0 ? _f : (_g = options.fields) === null || _g === void 0 ? void 0 : _g.description,
            labels: (_h = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.fields.labels, parsing_1.asString)) !== null && _h !== void 0 ? _h : (_j = options.fields) === null || _j === void 0 ? void 0 : _j.labels,
            summary: (_k = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.fields.summary, parsing_1.asString)) !== null && _k !== void 0 ? _k : (_l = options.fields) === null || _l === void 0 ? void 0 : _l.summary,
            testEnvironments: (_m = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.fields.testEnvironments, parsing_1.asString)) !== null && _m !== void 0 ? _m : (_o = options.fields) === null || _o === void 0 ? void 0 : _o.testEnvironments,
            testPlan: (_p = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.fields.testPlan, parsing_1.asString)) !== null && _p !== void 0 ? _p : (_q = options.fields) === null || _q === void 0 ? void 0 : _q.testPlan,
            testType: (_r = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.fields.testType, parsing_1.asString)) !== null && _r !== void 0 ? _r : (_s = options.fields) === null || _s === void 0 ? void 0 : _s.testType,
        },
        projectKey: projectKey,
        testExecutionIssueDescription: (_t = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.testExecutionIssueDescription, parsing_1.asString)) !== null && _t !== void 0 ? _t : options.testExecutionIssueDescription,
        testExecutionIssueDetails: { subtask: false },
        testExecutionIssueKey: testExecutionIssueKey,
        testExecutionIssueSummary: (_u = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.testExecutionIssueSummary, parsing_1.asString)) !== null && _u !== void 0 ? _u : options.testExecutionIssueSummary,
        testExecutionIssueType: (_w = (_v = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.testExecutionIssueType, parsing_1.asString)) !== null && _v !== void 0 ? _v : options.testExecutionIssueType) !== null && _w !== void 0 ? _w : "Test Execution",
        testPlanIssueKey: testPlanIssueKey,
        testPlanIssueType: (_y = (_x = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.testPlanIssueType, parsing_1.asString)) !== null && _x !== void 0 ? _x : options.testPlanIssueType) !== null && _y !== void 0 ? _y : "Test Plan",
        url: (_z = (0, parsing_1.parse)(env, env_1.ENV_NAMES.jira.url, parsing_1.asString)) !== null && _z !== void 0 ? _z : options.url,
    };
}
exports.initJiraOptions = initJiraOptions;
/**
 * Returns an {@link InternalPluginOptions | `InternalPluginOptions`} instance based on parsed
 * environment variables and a provided options object. Environment variables will take precedence
 * over the options set in the object.
 *
 * @param env - an object containing environment variables as properties
 * @param options - an options object containing plugin options
 * @returns the constructed internal plugin options
 */
function initPluginOptions(env, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return {
        debug: (_b = (_a = (0, parsing_1.parse)(env, env_1.ENV_NAMES.plugin.debug, parsing_1.asBoolean)) !== null && _a !== void 0 ? _a : options === null || options === void 0 ? void 0 : options.debug) !== null && _b !== void 0 ? _b : false,
        enabled: (_d = (_c = (0, parsing_1.parse)(env, env_1.ENV_NAMES.plugin.enabled, parsing_1.asBoolean)) !== null && _c !== void 0 ? _c : options === null || options === void 0 ? void 0 : options.enabled) !== null && _d !== void 0 ? _d : true,
        logDirectory: (_f = (_e = (0, parsing_1.parse)(env, env_1.ENV_NAMES.plugin.logDirectory, parsing_1.asString)) !== null && _e !== void 0 ? _e : options === null || options === void 0 ? void 0 : options.logDirectory) !== null && _f !== void 0 ? _f : "logs",
        normalizeScreenshotNames: (_h = (_g = (0, parsing_1.parse)(env, env_1.ENV_NAMES.plugin.normalizeScreenshotNames, parsing_1.asBoolean)) !== null && _g !== void 0 ? _g : options === null || options === void 0 ? void 0 : options.normalizeScreenshotNames) !== null && _h !== void 0 ? _h : false,
    };
}
exports.initPluginOptions = initPluginOptions;
/**
 * Returns an {@link InternalXrayOptions | `InternalXrayOptions`} instance based on parsed environment
 * variables and a provided options object. Environment variables will take precedence over the
 * options set in the object.
 *
 * @param env - an object containing environment variables as properties
 * @param options - an options object containing Xray options
 * @returns the constructed internal Xray options
 */
function initXrayOptions(env, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    return {
        status: {
            failed: (_a = (0, parsing_1.parse)(env, env_1.ENV_NAMES.xray.status.failed, parsing_1.asString)) !== null && _a !== void 0 ? _a : (_b = options === null || options === void 0 ? void 0 : options.status) === null || _b === void 0 ? void 0 : _b.failed,
            passed: (_c = (0, parsing_1.parse)(env, env_1.ENV_NAMES.xray.status.passed, parsing_1.asString)) !== null && _c !== void 0 ? _c : (_d = options === null || options === void 0 ? void 0 : options.status) === null || _d === void 0 ? void 0 : _d.passed,
            pending: (_e = (0, parsing_1.parse)(env, env_1.ENV_NAMES.xray.status.pending, parsing_1.asString)) !== null && _e !== void 0 ? _e : (_f = options === null || options === void 0 ? void 0 : options.status) === null || _f === void 0 ? void 0 : _f.pending,
            skipped: (_g = (0, parsing_1.parse)(env, env_1.ENV_NAMES.xray.status.skipped, parsing_1.asString)) !== null && _g !== void 0 ? _g : (_h = options === null || options === void 0 ? void 0 : options.status) === null || _h === void 0 ? void 0 : _h.skipped,
        },
        testEnvironments: (_j = (0, parsing_1.parse)(env, env_1.ENV_NAMES.xray.testEnvironments, parsing_1.asArrayOfStrings)) !== null && _j !== void 0 ? _j : options === null || options === void 0 ? void 0 : options.testEnvironments,
        uploadResults: (_l = (_k = (0, parsing_1.parse)(env, env_1.ENV_NAMES.xray.uploadResults, parsing_1.asBoolean)) !== null && _k !== void 0 ? _k : options === null || options === void 0 ? void 0 : options.uploadResults) !== null && _l !== void 0 ? _l : true,
        uploadScreenshots: (_o = (_m = (0, parsing_1.parse)(env, env_1.ENV_NAMES.xray.uploadScreenshots, parsing_1.asBoolean)) !== null && _m !== void 0 ? _m : options === null || options === void 0 ? void 0 : options.uploadScreenshots) !== null && _o !== void 0 ? _o : true,
    };
}
exports.initXrayOptions = initXrayOptions;
/**
 * Returns an {@link InternalCucumberOptions | `InternalCucumberOptions`} instance based on parsed
 * environment variables and a provided options object. Environment variables will take precedence
 * over the options set in the object.
 *
 * @param env - an object containing environment variables as properties
 * @param options - an options object containing Cucumber options
 * @returns the constructed internal Cucumber options
 */
function initCucumberOptions(config, options) {
    return __awaiter(this, void 0, void 0, function () {
        var featureFileExtension, preprocessor, error_1, preprocessorConfiguration;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    featureFileExtension = (_a = (0, parsing_1.parse)(config.env, env_1.ENV_NAMES.cucumber.featureFileExtension, parsing_1.asString)) !== null && _a !== void 0 ? _a : options === null || options === void 0 ? void 0 : options.featureFileExtension;
                    if (!featureFileExtension) return [3 /*break*/, 6];
                    preprocessor = void 0;
                    _k.label = 1;
                case 1:
                    _k.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, dependencies_1.importOptionalDependency)("@badeball/cypress-cucumber-preprocessor")];
                case 2:
                    preprocessor = _k.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _k.sent();
                    throw new Error((0, dedent_1.dedent)("\n                    Plugin dependency misconfigured: @badeball/cypress-cucumber-preprocessor\n\n                    ".concat((0, errors_1.errorMessage)(error_1), "\n\n                    The plugin depends on the package and should automatically download it during installation, but might have failed to do so because of conflicting Node versions\n\n                    Make sure to install the package manually using: npm install @badeball/cypress-cucumber-preprocessor --save-dev\n                ")));
                case 4:
                    logging_1.LOG.message(logging_1.Level.DEBUG, "Successfully resolved configuration of @badeball/cypress-cucumber-preprocessor package");
                    return [4 /*yield*/, preprocessor.resolvePreprocessorConfiguration(config, config.env, "/")];
                case 5:
                    preprocessorConfiguration = _k.sent();
                    if (!preprocessorConfiguration.json.enabled) {
                        throw new Error((0, dedent_1.dedent)("\n                        Plugin misconfiguration: Cucumber preprocessor JSON report disabled\n\n                        Make sure to enable the JSON report as described in https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/json-report.md\n                    "));
                    }
                    if (!preprocessorConfiguration.json.output) {
                        throw new Error((0, dedent_1.dedent)("\n                        Plugin misconfiguration: Cucumber preprocessor JSON report path was not set\n\n                        Make sure to configure the JSON report path as described in https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/json-report.md\n                    "));
                    }
                    return [2 /*return*/, {
                            downloadFeatures: (_c = (_b = (0, parsing_1.parse)(config.env, env_1.ENV_NAMES.cucumber.downloadFeatures, parsing_1.asBoolean)) !== null && _b !== void 0 ? _b : options === null || options === void 0 ? void 0 : options.downloadFeatures) !== null && _c !== void 0 ? _c : false,
                            featureFileExtension: featureFileExtension,
                            preprocessor: preprocessorConfiguration,
                            prefixes: {
                                precondition: (_d = (0, parsing_1.parse)(config.env, env_1.ENV_NAMES.cucumber.prefixes.precondition, parsing_1.asString)) !== null && _d !== void 0 ? _d : (_e = options === null || options === void 0 ? void 0 : options.prefixes) === null || _e === void 0 ? void 0 : _e.precondition,
                                test: (_f = (0, parsing_1.parse)(config.env, env_1.ENV_NAMES.cucumber.prefixes.test, parsing_1.asString)) !== null && _f !== void 0 ? _f : (_g = options === null || options === void 0 ? void 0 : options.prefixes) === null || _g === void 0 ? void 0 : _g.test,
                            },
                            uploadFeatures: (_j = (_h = (0, parsing_1.parse)(config.env, env_1.ENV_NAMES.cucumber.uploadFeatures, parsing_1.asBoolean)) !== null && _h !== void 0 ? _h : options === null || options === void 0 ? void 0 : options.uploadFeatures) !== null && _j !== void 0 ? _j : false,
                        }];
                case 6: return [2 /*return*/, undefined];
            }
        });
    });
}
exports.initCucumberOptions = initCucumberOptions;
/**
 * Returns an {@link InternalSslOptions | `InternalOpenSSLOptions`} instance based on parsed
 * environment variables and a provided options object. Environment variables will take precedence
 * over the options set in the object.
 *
 * @param env - an object containing environment variables as properties
 * @param options - an options object containing OpenSSL options
 * @returns the constructed internal OpenSSL options
 */
function initSslOptions(env, options) {
    var _a;
    var _b, _c;
    return _a = {},
        _a["rootCAPath"] = (_b = (0, parsing_1.parse)(env, env_1.ENV_NAMES.openSSL.rootCAPath, parsing_1.asString)) !== null && _b !== void 0 ? _b : options === null || options === void 0 ? void 0 : options.rootCAPath,
        _a.secureOptions = (_c = (0, parsing_1.parse)(env, env_1.ENV_NAMES.openSSL.secureOptions, parsing_1.asInt)) !== null && _c !== void 0 ? _c : options === null || options === void 0 ? void 0 : options.secureOptions,
        _a;
}
exports.initSslOptions = initSslOptions;
function initClients(jiraOptions, env) {
    return __awaiter(this, void 0, void 0, function () {
        var credentials, jiraClient, xrayCredentials, xrayClient, jiraFieldRepository, jiraFieldFetcher, credentials, jiraClient, xrayClient, jiraFieldRepository, jiraFieldFetcher, credentials, jiraClient, xrayClient, jiraFieldRepository, jiraFieldFetcher;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!jiraOptions.url) {
                        throw new Error((0, dedent_1.dedent)("\n                Failed to configure Jira client: no Jira URL was provided\n                Make sure Jira was configured correctly: ".concat(help_1.HELP.plugin.configuration.authentication.jira.root, "\n            ")));
                    }
                    if (!(env_1.ENV_NAMES.authentication.jira.username in env &&
                        env_1.ENV_NAMES.authentication.jira.apiToken in env)) return [3 /*break*/, 5];
                    // Jira cloud authentication: username (Email) and token.
                    logging_1.LOG.message(logging_1.Level.INFO, "Jira username and API token found. Setting up Jira cloud basic auth credentials");
                    credentials = new credentials_1.BasicAuthCredentials(env[env_1.ENV_NAMES.authentication.jira.username], env[env_1.ENV_NAMES.authentication.jira.apiToken]);
                    return [4 /*yield*/, (0, ping_1.pingJiraInstance)(jiraOptions.url, credentials)];
                case 1:
                    _a.sent();
                    jiraClient = new jiraClientCloud_1.JiraClientCloud(jiraOptions.url, credentials);
                    if (!(env_1.ENV_NAMES.authentication.xray.clientId in env &&
                        env_1.ENV_NAMES.authentication.xray.clientSecret in env)) return [3 /*break*/, 3];
                    // Xray cloud authentication: client ID and client secret.
                    logging_1.LOG.message(logging_1.Level.INFO, "Xray client ID and client secret found. Setting up Xray cloud JWT credentials");
                    xrayCredentials = new credentials_1.JwtCredentials(env[env_1.ENV_NAMES.authentication.xray.clientId], env[env_1.ENV_NAMES.authentication.xray.clientSecret], "".concat(xrayClientCloud_1.XrayClientCloud.URL, "/authenticate"));
                    return [4 /*yield*/, (0, ping_1.pingXrayCloud)(xrayCredentials)];
                case 2:
                    _a.sent();
                    xrayClient = new xrayClientCloud_1.XrayClientCloud(xrayCredentials);
                    jiraFieldRepository = new jiraFieldRepository_1.CachingJiraFieldRepository(jiraClient);
                    jiraFieldFetcher = new jiraIssueFetcher_1.CachingJiraIssueFetcherCloud(jiraClient, jiraFieldRepository, xrayClient, jiraOptions);
                    return [2 /*return*/, {
                            kind: "cloud",
                            jiraClient: jiraClient,
                            xrayClient: xrayClient,
                            jiraRepository: new jiraRepository_1.CachingJiraRepository(jiraFieldRepository, jiraFieldFetcher),
                        }];
                case 3: throw new Error((0, dedent_1.dedent)("\n                    Failed to configure Xray client: Jira cloud credentials detected, but the provided Xray credentials are not Xray cloud credentials\n                    You can find all configurations currently supported at: ".concat(help_1.HELP.plugin.configuration.authentication.root, "\n                ")));
                case 4: return [3 /*break*/, 12];
                case 5:
                    if (!(env_1.ENV_NAMES.authentication.jira.apiToken in env && jiraOptions.url)) return [3 /*break*/, 8];
                    // Jira server authentication: no username, only token.
                    logging_1.LOG.message(logging_1.Level.INFO, "Jira PAT found. Setting up Jira server PAT credentials");
                    credentials = new credentials_1.PatCredentials(env[env_1.ENV_NAMES.authentication.jira.apiToken]);
                    return [4 /*yield*/, (0, ping_1.pingJiraInstance)(jiraOptions.url, credentials)];
                case 6:
                    _a.sent();
                    jiraClient = new jiraClientServer_1.JiraClientServer(jiraOptions.url, credentials);
                    // Xray server authentication: no username, only token.
                    logging_1.LOG.message(logging_1.Level.INFO, "Jira PAT found. Setting up Xray server PAT credentials");
                    return [4 /*yield*/, (0, ping_1.pingXrayServer)(jiraOptions.url, credentials)];
                case 7:
                    _a.sent();
                    xrayClient = new xrayClientServer_1.XrayClientServer(jiraOptions.url, credentials);
                    jiraFieldRepository = new jiraFieldRepository_1.CachingJiraFieldRepository(jiraClient);
                    jiraFieldFetcher = new jiraIssueFetcher_1.CachingJiraIssueFetcher(jiraClient, jiraFieldRepository, jiraOptions.fields);
                    return [2 /*return*/, {
                            kind: "server",
                            jiraClient: jiraClient,
                            xrayClient: xrayClient,
                            jiraRepository: new jiraRepository_1.CachingJiraRepository(jiraFieldRepository, jiraFieldFetcher),
                        }];
                case 8:
                    if (!(env_1.ENV_NAMES.authentication.jira.username in env &&
                        env_1.ENV_NAMES.authentication.jira.password in env &&
                        jiraOptions.url)) return [3 /*break*/, 11];
                    logging_1.LOG.message(logging_1.Level.INFO, "Jira username and password found. Setting up Jira server basic auth credentials");
                    credentials = new credentials_1.BasicAuthCredentials(env[env_1.ENV_NAMES.authentication.jira.username], env[env_1.ENV_NAMES.authentication.jira.password]);
                    return [4 /*yield*/, (0, ping_1.pingJiraInstance)(jiraOptions.url, credentials)];
                case 9:
                    _a.sent();
                    jiraClient = new jiraClientServer_1.JiraClientServer(jiraOptions.url, credentials);
                    logging_1.LOG.message(logging_1.Level.INFO, "Jira username and password found. Setting up Xray server basic auth credentials");
                    return [4 /*yield*/, (0, ping_1.pingXrayServer)(jiraOptions.url, credentials)];
                case 10:
                    _a.sent();
                    xrayClient = new xrayClientServer_1.XrayClientServer(jiraOptions.url, credentials);
                    jiraFieldRepository = new jiraFieldRepository_1.CachingJiraFieldRepository(jiraClient);
                    jiraFieldFetcher = new jiraIssueFetcher_1.CachingJiraIssueFetcher(jiraClient, jiraFieldRepository, jiraOptions.fields);
                    return [2 /*return*/, {
                            kind: "server",
                            jiraClient: jiraClient,
                            xrayClient: xrayClient,
                            jiraRepository: new jiraRepository_1.CachingJiraRepository(jiraFieldRepository, jiraFieldFetcher),
                        }];
                case 11: throw new Error((0, dedent_1.dedent)("\n                Failed to configure Jira client: no viable authentication method was configured\n                You can find all configurations currently supported at: ".concat(help_1.HELP.plugin.configuration.authentication.root, "\n            ")));
                case 12: return [2 /*return*/];
            }
        });
    });
}
exports.initClients = initClients;
