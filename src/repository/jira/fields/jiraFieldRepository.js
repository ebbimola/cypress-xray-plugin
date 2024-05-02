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
exports.CachingJiraFieldRepository = void 0;
var dedent_1 = require("../../../util/dedent");
var pretty_1 = require("../../../util/pretty");
var jiraIssueFetcher_1 = require("./jiraIssueFetcher");
/**
 * A Jira field repository which caches retrieved field IDs. After the first ID retrieval, all
 * subsequent accesses will return the cached value.
 */
var CachingJiraFieldRepository = /** @class */ (function () {
    /**
     * Constructs a new caching Jira field repository. The Jira client is necessary for accessing
     * Jira data.
     *
     * @param jiraClient - the Jira client
     */
    function CachingJiraFieldRepository(jiraClient) {
        this.jiraClient = jiraClient;
        this.names = {};
        this.ids = {};
    }
    CachingJiraFieldRepository.prototype.getFieldId = function (fieldName) {
        return __awaiter(this, void 0, void 0, function () {
            var lowerCasedName, jiraFields, matches;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lowerCasedName = fieldName.toLowerCase();
                        if (!!(lowerCasedName in this.ids)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.jiraClient.getFields()];
                    case 1:
                        jiraFields = _a.sent();
                        if (!jiraFields) {
                            throw new Error("Failed to fetch Jira field ID for field with name: ".concat(fieldName));
                        }
                        else {
                            matches = jiraFields.filter(function (field) {
                                var lowerCasedField = field.name.toLowerCase();
                                return lowerCasedField === lowerCasedName;
                            });
                            if (matches.length > 1) {
                                throw this.multipleFieldsError(fieldName, matches);
                            }
                            jiraFields.forEach(function (jiraField) {
                                _this.ids[jiraField.name.toLowerCase()] = jiraField.id;
                                _this.names[jiraField.name.toLowerCase()] = jiraField.name;
                            });
                        }
                        _a.label = 2;
                    case 2:
                        if (!(lowerCasedName in this.ids)) {
                            throw this.missingFieldsError(fieldName);
                        }
                        return [2 /*return*/, this.ids[lowerCasedName]];
                }
            });
        });
    };
    CachingJiraFieldRepository.prototype.multipleFieldsError = function (fieldName, matches) {
        var nameDuplicates = (0, pretty_1.prettyPadObjects)(matches)
            .map(function (duplicate) {
            return Object.entries(duplicate)
                .map(function (entry) { return "".concat(entry[0], ": ").concat(entry[1]); })
                .join(", ");
        })
            .sort()
            .join("\n");
        var idSuggestions = matches.map(function (field) { return "\"".concat(field.id, "\""); }).join(" or ");
        return new Error((0, dedent_1.dedent)("\n                Failed to fetch Jira field ID for field with name: ".concat(fieldName, "\n                There are multiple fields with this name\n\n                Duplicates:\n                  ").concat(nameDuplicates, "\n\n                You can provide field IDs in the options:\n\n                  jira: {\n                    fields: {\n                      ").concat(this.getOptionName(fieldName), ": // ").concat(idSuggestions, "\n                    }\n                  }\n            ")));
    };
    CachingJiraFieldRepository.prototype.missingFieldsError = function (fieldName) {
        if (Object.keys(this.ids).length === 0) {
            throw new Error((0, dedent_1.dedent)("\n                    Failed to fetch Jira field ID for field with name: ".concat(fieldName, "\n                    Make sure the field actually exists and that your Jira language settings did not modify the field's name\n\n                    You can provide field IDs directly without relying on language settings:\n\n                      jira: {\n                        fields: {\n                          ").concat(this.getOptionName(fieldName), ": // corresponding field ID\n                        }\n                      }\n                ")));
        }
        else {
            var availableFields = Object.entries((0, pretty_1.prettyPadValues)(this.names))
                .map(function (entry) { return "name: ".concat(entry[1], " id: ").concat(JSON.stringify(entry[0])); })
                .sort();
            throw new Error((0, dedent_1.dedent)("\n                    Failed to fetch Jira field ID for field with name: ".concat(fieldName, "\n                    Make sure the field actually exists and that your Jira language settings did not modify the field's name\n\n                    Available fields:\n                      ").concat(availableFields.join("\n"), "\n\n                    You can provide field IDs directly without relying on language settings:\n\n                      jira: {\n                        fields: {\n                          ").concat(this.getOptionName(fieldName), ": // corresponding field ID\n                        }\n                      }\n                ")));
        }
    };
    CachingJiraFieldRepository.prototype.getOptionName = function (fieldName) {
        switch (fieldName) {
            case jiraIssueFetcher_1.SupportedFields.DESCRIPTION:
                return "description";
            case jiraIssueFetcher_1.SupportedFields.SUMMARY:
                return "summary";
            case jiraIssueFetcher_1.SupportedFields.LABELS:
                return "labels";
            case jiraIssueFetcher_1.SupportedFields.TEST_ENVIRONMENTS:
                return "testEnvironments";
            case jiraIssueFetcher_1.SupportedFields.TEST_PLAN:
                return "testPlan";
            case jiraIssueFetcher_1.SupportedFields.TEST_TYPE:
                return "testType";
        }
    };
    return CachingJiraFieldRepository;
}());
exports.CachingJiraFieldRepository = CachingJiraFieldRepository;
