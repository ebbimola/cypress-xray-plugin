"use strict";
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
exports.buildMultipartFeatures = void 0;
var logging_1 = require("../../logging/logging");
var preprocessing_1 = require("../../preprocessing/preprocessing");
var dedent_1 = require("../../util/dedent");
var errors_1 = require("../../util/errors");
/**
 * Modifies the input Cucumber JSON results by adding test execution issue tags and filtering
 * screenshots, based on the options provided. The function also asserts that every test contained
 * within the results has been appropriately tagged with either Xray cloud or Xray server tags.
 *
 * @param input - the Cucumber JSON results
 * @param options - the options for results modification
 * @returns the modified Cucumber JSON results
 */
function buildMultipartFeatures(input, options) {
    var tests = [];
    input.forEach(function (result) {
        var test = __assign({}, result);
        if (options.testExecutionIssueKey) {
            var testExecutionIssueTag = {
                name: "@".concat(options.testExecutionIssueKey),
            };
            // Xray uses the first encountered issue tag for deducing the test execution issue.
            if (result.tags) {
                test.tags = __spreadArray([testExecutionIssueTag], result.tags, true);
            }
            else {
                test.tags = [testExecutionIssueTag];
            }
        }
        var elements = [];
        result.elements.forEach(function (element) {
            try {
                if (element.type === "scenario") {
                    assertScenarioContainsIssueKey(element, options.projectKey, options.useCloudTags, options.testPrefix);
                    var modifiedElement = __assign(__assign({}, element), { steps: getSteps(element, options.includeScreenshots) });
                    elements.push(modifiedElement);
                }
            }
            catch (error) {
                logging_1.LOG.message(logging_1.Level.WARNING, (0, dedent_1.dedent)("\n                        Skipping result upload for ".concat(element.type, ": ").concat(element.name, "\n\n                        ").concat((0, errors_1.errorMessage)(error), "\n                    ")));
            }
        });
        if (elements.length > 0) {
            test.elements = elements;
            tests.push(test);
        }
    });
    return tests;
}
exports.buildMultipartFeatures = buildMultipartFeatures;
function assertScenarioContainsIssueKey(element, projectKey, isXrayCloud, testPrefix) {
    var issueKeys = [];
    if (element.tags) {
        for (var _i = 0, _a = element.tags; _i < _a.length; _i++) {
            var tag = _a[_i];
            var matches = tag.name.match((0, preprocessing_1.getScenarioTagRegex)(projectKey, testPrefix));
            if (!matches) {
                continue;
            }
            else if (matches.length === 2) {
                issueKeys.push(matches[1]);
            }
        }
        if (issueKeys.length > 1) {
            throw (0, errors_1.multipleTestKeysInCucumberScenarioError)({
                name: element.name,
                keyword: element.keyword,
                steps: element.steps.map(function (step) {
                    return { keyword: step.keyword, text: step.name };
                }),
            }, element.tags, issueKeys, isXrayCloud);
        }
    }
    if (issueKeys.length === 0) {
        throw (0, errors_1.missingTestKeyInCucumberScenarioError)({
            name: element.name,
            keyword: element.keyword,
            steps: element.steps.map(function (step) {
                return { keyword: step.keyword, text: step.name };
            }),
            tags: element.tags,
        }, projectKey, isXrayCloud);
    }
}
function getSteps(element, includeScreenshots) {
    var steps = [];
    element.steps.forEach(function (step) {
        steps.push(__assign(__assign({}, step), { embeddings: includeScreenshots ? step.embeddings : [] }));
    });
    return steps;
}
