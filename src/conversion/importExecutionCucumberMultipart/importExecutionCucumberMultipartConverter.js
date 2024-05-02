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
exports.ImportExecutionCucumberMultipartConverter = void 0;
var jiraIssueFetcher_1 = require("../../repository/jira/fields/jiraIssueFetcher");
var multipartFeatureBuilder_1 = require("./multipartFeatureBuilder");
var multipartInfoBuilder_1 = require("./multipartInfoBuilder");
/**
 * A class for converting Cucumber JSON results into Xray Cucumber multipart JSON.
 *
 * @see https://docs.getxray.app/display/XRAY/Import+Execution+Results+-+REST#ImportExecutionResultsREST-CucumberJSONresultsMultipart
 * @see https://docs.getxray.app/display/XRAYCLOUD/Import+Execution+Results+-+REST+v2#ImportExecutionResultsRESTv2-CucumberJSONresultsMultipart
 */
var ImportExecutionCucumberMultipartConverter = /** @class */ (function () {
    /**
     * Construct a new converter with access to the provided options. The cloud converter flag is
     * used to deduce the output format. When set to `true`, Xray cloud JSONs will be created, if
     * set to `false`, the format will be Xray server JSON.
     *
     * @param options - the options
     * @param isCloudConverter - whether Xray cloud JSONs should be created
     * @param jiraRepository - the Jira repository for fetching issue data
     */
    function ImportExecutionCucumberMultipartConverter(options, isCloudConverter, jiraRepository) {
        this.options = options;
        this.isCloudConverter = isCloudConverter;
        this.jiraRepository = jiraRepository;
    }
    /**
     * Converts Cucumber JSON results into Xray Cucumber multipart JSON. Additional Cypress run data
     * is required during conversion for some information like Cypress version or the browser used.
     *
     * @param input - the Cucumber JSON results
     * @param runData - the Cypress run data
     * @returns corresponding Xray Cucumber multipart JSON
     */
    ImportExecutionCucumberMultipartConverter.prototype.convert = function (input, runData) {
        return __awaiter(this, void 0, void 0, function () {
            var features, testExecutionIssueData_1, testExecutionIssueData, _a, _b;
            var _c, _d;
            var _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        features = (0, multipartFeatureBuilder_1.buildMultipartFeatures)(input, {
                            testExecutionIssueKey: this.options.jira.testExecutionIssueKey,
                            includeScreenshots: this.options.xray.uploadScreenshots,
                            projectKey: this.options.jira.projectKey,
                            useCloudTags: this.isCloudConverter,
                            testPrefix: (_e = this.options.cucumber) === null || _e === void 0 ? void 0 : _e.prefixes.test,
                        });
                        if (this.isCloudConverter) {
                            testExecutionIssueData_1 = {
                                projectKey: this.options.jira.projectKey,
                                summary: this.options.jira.testExecutionIssueSummary,
                                description: this.options.jira.testExecutionIssueDescription,
                                issuetype: this.options.jira.testExecutionIssueDetails,
                            };
                            if (this.options.jira.testPlanIssueKey) {
                                testExecutionIssueData_1.testPlan = {
                                    issueKey: this.options.jira.testPlanIssueKey,
                                };
                            }
                            if (this.options.xray.testEnvironments) {
                                testExecutionIssueData_1.testEnvironments = {
                                    environments: this.options.xray.testEnvironments,
                                };
                            }
                            return [2 /*return*/, {
                                    features: features,
                                    info: (0, multipartInfoBuilder_1.buildMultipartInfoCloud)(runData, testExecutionIssueData_1),
                                }];
                        }
                        testExecutionIssueData = {
                            projectKey: this.options.jira.projectKey,
                            summary: this.options.jira.testExecutionIssueSummary,
                            description: this.options.jira.testExecutionIssueDescription,
                            issuetype: this.options.jira.testExecutionIssueDetails,
                        };
                        if (!this.options.jira.testPlanIssueKey) return [3 /*break*/, 2];
                        _a = testExecutionIssueData;
                        _c = {
                            issueKey: this.options.jira.testPlanIssueKey
                        };
                        return [4 /*yield*/, this.jiraRepository.getFieldId(jiraIssueFetcher_1.SupportedFields.TEST_PLAN)];
                    case 1:
                        _a.testPlan = (_c.fieldId = _f.sent(),
                            _c);
                        _f.label = 2;
                    case 2:
                        if (!this.options.xray.testEnvironments) return [3 /*break*/, 4];
                        _b = testExecutionIssueData;
                        _d = {
                            environments: this.options.xray.testEnvironments
                        };
                        return [4 /*yield*/, this.jiraRepository.getFieldId(jiraIssueFetcher_1.SupportedFields.TEST_ENVIRONMENTS)];
                    case 3:
                        _b.testEnvironments = (_d.fieldId = _f.sent(),
                            _d);
                        _f.label = 4;
                    case 4: return [2 /*return*/, {
                            features: features,
                            info: (0, multipartInfoBuilder_1.buildMultipartInfoServer)(runData, testExecutionIssueData),
                        }];
                }
            });
        });
    };
    return ImportExecutionCucumberMultipartConverter;
}());
exports.ImportExecutionCucumberMultipartConverter = ImportExecutionCucumberMultipartConverter;
