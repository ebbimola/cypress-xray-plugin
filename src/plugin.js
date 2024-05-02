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
exports.syncFeatureFile = exports.addXrayResultUpload = exports.configureXrayPlugin = exports.resetPlugin = void 0;
var context_1 = require("./context");
var hooks_1 = require("./hooks/hooks");
var synchronizeFeatureFile_1 = require("./hooks/preprocessor/synchronizeFeatureFile");
var requests_1 = require("./https/requests");
var logging_1 = require("./logging/logging");
var dedent_1 = require("./util/dedent");
var help_1 = require("./util/help");
var canShowInitializationWarning = true;
/**
 * Resets the plugin including its context.
 */
function resetPlugin() {
    (0, context_1.clearPluginContext)();
    canShowInitializationWarning = true;
}
exports.resetPlugin = resetPlugin;
/**
 * Configures the plugin. The plugin will inspect all environment variables passed in
 * {@link Cypress.PluginConfigOptions.env | `config.env`} and merge them with the ones provided in
 * `options`.
 *
 * Note: Environment variables always take precedence over values specified in `options`.
 *
 * Other Cypress configuration values which the plugin typically accesses are the Cypress version or
 * the project root directory.
 *
 * @param config - the Cypress configuration
 * @param options - the plugin options
 *
 * @see https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/uploadTestResults/#setup
 */
function configureXrayPlugin(config, options) {
    return __awaiter(this, void 0, void 0, function () {
        var pluginOptions, internalOptions, _a;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    canShowInitializationWarning = false;
                    pluginOptions = (0, context_1.initPluginOptions)(config.env, options.plugin);
                    if (!pluginOptions.enabled) {
                        logging_1.LOG.message(logging_1.Level.INFO, "Plugin disabled. Skipping further configuration");
                        return [2 /*return*/];
                    }
                    // Init logging before all other configurations because they might require an initialized
                    // logging module.
                    logging_1.LOG.configure({
                        debug: pluginOptions.debug,
                        logDirectory: pluginOptions.logDirectory,
                    });
                    _b = {
                        jira: (0, context_1.initJiraOptions)(config.env, options.jira),
                        plugin: pluginOptions,
                        xray: (0, context_1.initXrayOptions)(config.env, options.xray)
                    };
                    return [4 /*yield*/, (0, context_1.initCucumberOptions)(config, options.cucumber)];
                case 1:
                    internalOptions = (_b.cucumber = _d.sent(),
                        _b.ssl = (0, context_1.initSslOptions)(config.env, options.openSSL),
                        _b);
                    requests_1.REST.init({
                        debug: internalOptions.plugin.debug,
                        ssl: internalOptions.ssl,
                    });
                    _a = context_1.setPluginContext;
                    _c = {
                        cypress: config,
                        internal: internalOptions
                    };
                    return [4 /*yield*/, (0, context_1.initClients)(internalOptions.jira, config.env)];
                case 2:
                    _a.apply(void 0, [(_c.clients = _d.sent(),
                            _c)]);
                    return [2 /*return*/];
            }
        });
    });
}
exports.configureXrayPlugin = configureXrayPlugin;
/**
 * Enables Cypress test results upload to Xray. This method will register several upload hooks under
 * the passed plugin events.
 *
 * @param on - the Cypress plugin events
 *
 * @see https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/guides/uploadTestResults/
 */
function addXrayResultUpload(on) {
    var _this = this;
    on("before:run", function (runDetails) { return __awaiter(_this, void 0, void 0, function () {
        var context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    context = (0, context_1.getPluginContext)();
                    if (!context) {
                        if (canShowInitializationWarning) {
                            logInitializationWarning("before:run");
                        }
                        return [2 /*return*/];
                    }
                    if (!context.internal.plugin.enabled) {
                        logging_1.LOG.message(logging_1.Level.INFO, "Plugin disabled. Skipping before:run hook");
                        return [2 /*return*/];
                    }
                    if (!runDetails.specs) {
                        logging_1.LOG.message(logging_1.Level.WARNING, "No specs about to be executed. Skipping before:run hook");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, hooks_1.beforeRunHook)(runDetails.specs, context.internal, context.clients)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    on("after:run", function (results) { return __awaiter(_this, void 0, void 0, function () {
        var context, failedResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    context = (0, context_1.getPluginContext)();
                    if (!context) {
                        if (canShowInitializationWarning) {
                            logInitializationWarning("after:run");
                        }
                        return [2 /*return*/];
                    }
                    if (!context.internal.plugin.enabled) {
                        logging_1.LOG.message(logging_1.Level.INFO, "Skipping after:run hook: Plugin disabled");
                        return [2 /*return*/];
                    }
                    if (!context.internal.xray.uploadResults) {
                        logging_1.LOG.message(logging_1.Level.INFO, "Skipping results upload: Plugin is configured to not upload test results");
                        return [2 /*return*/];
                    }
                    // Cypress's status types are incomplete, there is also "finished".
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    if ("status" in results && results.status === "failed") {
                        failedResult = results;
                        logging_1.LOG.message(logging_1.Level.ERROR, (0, dedent_1.dedent)("\n                        Skipping after:run hook: Failed to run ".concat(failedResult.failures, " tests\n\n                        ").concat(failedResult.message, "\n                    ")));
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, hooks_1.afterRunHook)(results, context.internal, context.clients)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.addXrayResultUpload = addXrayResultUpload;
/**
 * Attempts to synchronize the Cucumber feature file with Xray. If the filename does not end with
 * the configured {@link https://qytera-gmbh.github.io/projects/cypress-xray-plugin/section/configuration/cucumber/#featurefileextension | feature file extension},
 * this method does not upload anything to Xray.
 *
 * @param file - the Cypress file object
 * @returns the unmodified file's path
 */
function syncFeatureFile(file) {
    return __awaiter(this, void 0, void 0, function () {
        var context;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    context = (0, context_1.getPluginContext)();
                    if (!context) {
                        if (canShowInitializationWarning) {
                            logInitializationWarning("file:preprocessor");
                        }
                        return [2 /*return*/, file.filePath];
                    }
                    if (!context.internal.plugin.enabled) {
                        logging_1.LOG.message(logging_1.Level.INFO, "Plugin disabled. Skipping feature file synchronization triggered by: ".concat(file.filePath));
                        return [2 /*return*/, file.filePath];
                    }
                    return [4 /*yield*/, (0, synchronizeFeatureFile_1.synchronizeFeatureFile)(file, context.cypress.projectRoot, context.internal, context.clients)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.syncFeatureFile = syncFeatureFile;
function logInitializationWarning(hook) {
    // Do not throw in case someone does not want the plugin to run but forgot to remove a hook.
    logging_1.LOG.message(logging_1.Level.WARNING, (0, dedent_1.dedent)("\n            Skipping ".concat(hook, " hook: Plugin misconfigured: configureXrayPlugin() was not called\n\n            Make sure your project is set up correctly: ").concat(help_1.HELP.plugin.configuration.introduction, "\n        ")));
}
