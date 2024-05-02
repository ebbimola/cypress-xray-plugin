"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOG = exports.PluginLogger = exports.Level = void 0;
var axios_1 = require("axios");
var chalk_1 = require("chalk");
var fs_1 = require("fs");
var path_1 = require("path");
var errors_1 = require("../util/errors");
var Level;
(function (Level) {
    Level["INFO"] = "INFO";
    Level["ERROR"] = "ERROR";
    Level["SUCCESS"] = "SUCCESS";
    Level["WARNING"] = "WARNING";
    Level["DEBUG"] = "DEBUG";
})(Level || (exports.Level = Level = {}));
/**
 * A Chalk-based logger.
 */
var PluginLogger = /** @class */ (function () {
    function PluginLogger(options) {
        var _a, _b, _c;
        if (options === void 0) { options = { logDirectory: "." }; }
        this.loggingOptions = options;
        var maxPrefixLength = Math.max.apply(Math, Object.values(Level).map(function (s) { return s.length; }));
        this.prefixes = (_a = {},
            _a[Level.INFO] = this.prefix(Level.INFO, maxPrefixLength),
            _a[Level.ERROR] = this.prefix(Level.ERROR, maxPrefixLength),
            _a[Level.SUCCESS] = this.prefix(Level.SUCCESS, maxPrefixLength),
            _a[Level.WARNING] = this.prefix(Level.WARNING, maxPrefixLength),
            _a[Level.DEBUG] = this.prefix(Level.DEBUG, maxPrefixLength),
            _a);
        this.colorizers = (_b = {},
            _b[Level.INFO] = chalk_1.default.gray,
            _b[Level.ERROR] = chalk_1.default.red,
            _b[Level.SUCCESS] = chalk_1.default.green,
            _b[Level.WARNING] = chalk_1.default.yellow,
            _b[Level.DEBUG] = chalk_1.default.cyan,
            _b);
        this.logFunctions = (_c = {},
            _c[Level.INFO] = console.info,
            _c[Level.ERROR] = console.error,
            _c[Level.SUCCESS] = console.log,
            _c[Level.WARNING] = console.warn,
            _c[Level.DEBUG] = console.debug,
            _c);
    }
    PluginLogger.prototype.message = function (level) {
        var text = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            text[_i - 1] = arguments[_i];
        }
        if (level === Level.DEBUG && !this.loggingOptions.debug) {
            return;
        }
        var colorizer = this.colorizers[level];
        var prefix = this.prefixes[level];
        var logFunction = this.logFunctions[level];
        var lines = text.join(" ").split("\n");
        lines.forEach(function (line, index) {
            if (index === 0) {
                logFunction("".concat(prefix, " ").concat(colorizer(line)));
            }
            else {
                logFunction("".concat(prefix, "   ").concat(colorizer(line)));
            }
            // Pad multiline log messages with an extra new line to cleanly separate them from the
            // following line.
            if (index > 0 && index === lines.length - 1) {
                logFunction(prefix);
            }
        });
    };
    PluginLogger.prototype.logToFile = function (data, filename) {
        var logDirectoryPath = path_1.default.resolve(this.loggingOptions.logDirectory);
        fs_1.default.mkdirSync(logDirectoryPath, { recursive: true });
        var filepath = path_1.default.resolve(logDirectoryPath, filename);
        fs_1.default.writeFileSync(filepath, JSON.stringify(data));
        return filepath;
    };
    PluginLogger.prototype.logErrorToFile = function (error, filename) {
        var _a;
        var errorFileName;
        var errorData;
        if ((0, errors_1.isLoggedError)(error)) {
            return;
        }
        if ((0, axios_1.isAxiosError)(error)) {
            errorFileName = "".concat(filename, ".json");
            errorData = {
                error: error.toJSON(),
                response: (_a = error.response) === null || _a === void 0 ? void 0 : _a.data,
            };
        }
        else if (error instanceof Error) {
            errorFileName = "".concat(filename, ".json");
            errorData = {
                error: "".concat(error.name, ": ").concat(error.message),
                stacktrace: error.stack,
            };
        }
        else {
            errorFileName = "".concat(filename, ".log");
            errorData = error;
        }
        var filepath = this.logToFile(errorData, errorFileName);
        this.message(Level.ERROR, "Complete error logs have been written to: ".concat(filepath));
    };
    PluginLogger.prototype.configure = function (options) {
        this.loggingOptions = options;
    };
    PluginLogger.prototype.prefix = function (type, maxPrefixLength) {
        return chalk_1.default.white("\u2502 Cypress Xray Plugin \u2502 ".concat(type.padEnd(maxPrefixLength, " "), " \u2502"));
    };
    return PluginLogger;
}());
exports.PluginLogger = PluginLogger;
/**
 * The global logger instance.
 */
exports.LOG = new PluginLogger();
