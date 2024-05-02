"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMultipartInfoCloud = exports.buildMultipartInfoServer = void 0;
var dedent_1 = require("../../util/dedent");
/**
 * Converts Cypress run data into Cucumber multipart information, which could be used when creating
 * new test executions on import or when updating existing ones.
 *
 * @param runData - Cypress run data
 * @param testExecutionIssueData - additional information to consider
 * @returns the Cucumber multipart information data for Xray server
 */
function buildMultipartInfoServer(runData, testExecutionIssueData) {
    var _a, _b;
    var multipartInfo = {
        fields: {
            project: {
                key: testExecutionIssueData.projectKey,
            },
            summary: (_a = testExecutionIssueData.summary) !== null && _a !== void 0 ? _a : defaultSummary(new Date(runData.startedTestsAt).getTime()),
            description: (_b = testExecutionIssueData.description) !== null && _b !== void 0 ? _b : defaultDescription(runData.cypressVersion, runData.browserName, runData.browserVersion),
            issuetype: testExecutionIssueData.issuetype,
        },
    };
    if (testExecutionIssueData.testPlan) {
        multipartInfo.fields[testExecutionIssueData.testPlan.fieldId] =
            testExecutionIssueData.testPlan.issueKey;
    }
    if (testExecutionIssueData.testEnvironments) {
        multipartInfo.fields[testExecutionIssueData.testEnvironments.fieldId] =
            testExecutionIssueData.testEnvironments.environments;
    }
    return multipartInfo;
}
exports.buildMultipartInfoServer = buildMultipartInfoServer;
/**
 * Converts Cypress run data into Cucumber multipart information, which could be used when creating
 * new test executions on import or when updating existing ones.
 *
 * @param runData - Cypress run data
 * @param testExecutionIssueData - additional information to consider
 * @returns the Cucumber multipart information data for Xray cloud
 */
function buildMultipartInfoCloud(runData, testExecutionIssueData) {
    var _a, _b, _c, _d;
    return {
        fields: {
            project: {
                key: testExecutionIssueData.projectKey,
            },
            summary: (_a = testExecutionIssueData.summary) !== null && _a !== void 0 ? _a : defaultSummary(new Date(runData.startedTestsAt).getTime()),
            description: (_b = testExecutionIssueData.description) !== null && _b !== void 0 ? _b : defaultDescription(runData.cypressVersion, runData.browserName, runData.browserVersion),
            issuetype: testExecutionIssueData.issuetype,
        },
        xrayFields: {
            testPlanKey: (_c = testExecutionIssueData.testPlan) === null || _c === void 0 ? void 0 : _c.issueKey,
            environments: (_d = testExecutionIssueData.testEnvironments) === null || _d === void 0 ? void 0 : _d.environments,
        },
    };
}
exports.buildMultipartInfoCloud = buildMultipartInfoCloud;
function defaultSummary(timestamp) {
    return "Execution Results [".concat(timestamp, "]");
}
function defaultDescription(cypressVersion, browserName, browserVersion) {
    return (0, dedent_1.dedent)("\n        Cypress version: ".concat(cypressVersion, "\n        Browser: ").concat(browserName, " (").concat(browserVersion, ")\n    "));
}
