"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCucumberPreconditionIssueTags = exports.getCucumberPreconditionIssueComments = exports.getScenarioTagRegex = exports.getCucumberScenarioIssueTags = exports.parseFeatureFile = exports.getCucumberIssueData = exports.containsCucumberTest = exports.getNativeTestIssueKey = exports.getNativeTestIssueKeys = exports.containsNativeTest = void 0;
var gherkin_1 = require("@cucumber/gherkin");
var messages_1 = require("@cucumber/messages");
var fs_1 = require("fs");
var logging_1 = require("../logging/logging");
var errors_1 = require("../util/errors");
// ============================================================================================== //
// CYPRESS NATIVE                                                                                 //
// ============================================================================================== //
function containsNativeTest(runResult, featureFileExtension) {
    return runResult.runs.some(function (run) {
        if (featureFileExtension && run.spec.absolute.endsWith(featureFileExtension)) {
            return false;
        }
        return true;
    });
}
exports.containsNativeTest = containsNativeTest;
function getNativeTestIssueKeys(results, projectKey, featureFileExtension) {
    var issueKeys = [];
    for (var _i = 0, _a = results.runs; _i < _a.length; _i++) {
        var runResult = _a[_i];
        var keyedTests = [];
        // Cucumber tests aren't handled here. Let's skip them.
        if (featureFileExtension && runResult.spec.absolute.endsWith(featureFileExtension)) {
            continue;
        }
        for (var _b = 0, _c = runResult.tests; _b < _c.length; _b++) {
            var testResult = _c[_b];
            var title = testResult.title.join(" ");
            try {
                // The last element refers to an individual test (it).
                // The ones before are test suite titles (describe, context, ...).
                var issueKey = getNativeTestIssueKey(testResult.title[testResult.title.length - 1], projectKey);
                keyedTests.push(testResult);
                issueKeys.push(issueKey);
            }
            catch (error) {
                logging_1.LOG.message(logging_1.Level.WARNING, "Skipping test: ".concat(title, "\n\n").concat((0, errors_1.errorMessage)(error)));
            }
        }
        runResult.tests = keyedTests;
    }
    return issueKeys;
}
exports.getNativeTestIssueKeys = getNativeTestIssueKeys;
/**
 * Extracts a Jira issue key from a native Cypress test title, based on the provided project key.
 *
 * @param title - the test title
 * @param projectKey - the Jira projectk key
 * @returns the Jira issue key
 * @throws if the title contains zero or more than one issue key
 */
function getNativeTestIssueKey(title, projectKey) {
    var regex = new RegExp("(".concat(projectKey, "-\\d+)"), "g");
    var matches = title.match(regex);
    if (!matches) {
        throw (0, errors_1.missingTestKeyInNativeTestTitleError)(title, projectKey);
    }
    else if (matches.length === 1) {
        return matches[0];
    }
    else {
        throw (0, errors_1.multipleTestKeysInNativeTestTitleError)(title, matches);
    }
}
exports.getNativeTestIssueKey = getNativeTestIssueKey;
// ============================================================================================== //
// CUCUMBER                                                                                       //
// ============================================================================================== //
function containsCucumberTest(runResult, featureFileExtension) {
    return runResult.runs.some(function (run) {
        if (featureFileExtension && run.spec.absolute.endsWith(featureFileExtension)) {
            return true;
        }
        return false;
    });
}
exports.containsCucumberTest = containsCucumberTest;
function getCucumberIssueData(filePath, projectKey, isCloudClient, prefixes) {
    var _a;
    var featureFileIssueKeys = {
        tests: [],
        preconditions: [],
    };
    var document = parseFeatureFile(filePath);
    if (!((_a = document.feature) === null || _a === void 0 ? void 0 : _a.children)) {
        return featureFileIssueKeys;
    }
    for (var _i = 0, _b = document.feature.children; _i < _b.length; _i++) {
        var child = _b[_i];
        if (child.scenario) {
            var issueKeys = getCucumberScenarioIssueTags(child.scenario, projectKey, prefixes === null || prefixes === void 0 ? void 0 : prefixes.test);
            if (issueKeys.length === 0) {
                throw (0, errors_1.missingTestKeyInCucumberScenarioError)(child.scenario, projectKey, isCloudClient);
            }
            else if (issueKeys.length > 1) {
                throw (0, errors_1.multipleTestKeysInCucumberScenarioError)(child.scenario, child.scenario.tags, issueKeys, isCloudClient);
            }
            featureFileIssueKeys.tests.push({
                key: issueKeys[0],
                summary: child.scenario.name ? child.scenario.name : "<empty>",
                tags: child.scenario.tags.map(function (tag) { return tag.name.replace("@", ""); }),
            });
        }
        else if (child.background) {
            var preconditionComments = getCucumberPreconditionIssueComments(child.background, projectKey, document.comments);
            var preconditionKeys = getCucumberPreconditionIssueTags(child.background, projectKey, preconditionComments, prefixes === null || prefixes === void 0 ? void 0 : prefixes.precondition);
            if (preconditionKeys.length === 0) {
                throw (0, errors_1.missingPreconditionKeyInCucumberBackgroundError)(child.background, projectKey, isCloudClient, preconditionComments);
            }
            else if (preconditionKeys.length > 1) {
                throw (0, errors_1.multiplePreconditionKeysInCucumberBackgroundError)(child.background, preconditionKeys, document.comments, isCloudClient);
            }
            featureFileIssueKeys.preconditions.push({
                key: preconditionKeys[0],
                summary: child.background.name ? child.background.name : "<empty>",
            });
        }
    }
    return featureFileIssueKeys;
}
exports.getCucumberIssueData = getCucumberIssueData;
/**
 * Parses a Gherkin document (feature file) and returns the information contained within.
 *
 * @param file - the path to the feature file
 * @param encoding - the file's encoding
 * @returns an object containing the data of the feature file
 * @example
 *   const data = parseFeatureFile("myTetest.feature")
 *   console.log(data.feature.children[0].scenario); // steps, name, ...
 * @see https://github.com/cucumber/messages/blob/main/javascript/src/messages.ts
 */
function parseFeatureFile(file, encoding) {
    if (encoding === void 0) { encoding = "utf-8"; }
    var uuidFn = messages_1.IdGenerator.uuid();
    var builder = new gherkin_1.AstBuilder(uuidFn);
    var matcher = new gherkin_1.GherkinClassicTokenMatcher();
    var parser = new gherkin_1.Parser(builder, matcher);
    return parser.parse(fs_1.default.readFileSync(file, { encoding: encoding }));
}
exports.parseFeatureFile = parseFeatureFile;
function getCucumberScenarioIssueTags(scenario, projectKey, testPrefix) {
    var issueKeys = [];
    for (var _i = 0, _a = scenario.tags; _i < _a.length; _i++) {
        var tag = _a[_i];
        var matches = tag.name.match(getScenarioTagRegex(projectKey, testPrefix));
        if (!matches) {
            continue;
        }
        else if (matches.length === 2) {
            issueKeys.push(matches[1]);
        }
    }
    return issueKeys;
}
exports.getCucumberScenarioIssueTags = getCucumberScenarioIssueTags;
function getScenarioTagRegex(projectKey, testPrefix) {
    if (testPrefix) {
        // @TestName:CYP-123
        return new RegExp("@".concat(testPrefix, "(").concat(projectKey, "-\\d+)"));
    }
    // @CYP-123
    return new RegExp("@(".concat(projectKey, "-\\d+)"));
}
exports.getScenarioTagRegex = getScenarioTagRegex;
/**
 * Extracts all comments which are relevant for linking a background to precondition issues.
 *
 * @param background - the background
 * @param projectKey - the project key
 * @param comments - the feature file comments
 * @returns the relevant comments
 */
function getCucumberPreconditionIssueComments(background, projectKey, comments) {
    if (background.steps.length === 0) {
        return [];
    }
    var backgroundLine = background.location.line;
    var firstStepLine = background.steps[0].location.line;
    return comments
        .filter(function (comment) { return comment.location.line > backgroundLine; })
        .filter(function (comment) { return comment.location.line < firstStepLine; })
        .filter(function (comment) { return new RegExp("@\\S*".concat(projectKey, "-\\d+")).test(comment.text); })
        .map(function (comment) { return comment.text.trim(); });
}
exports.getCucumberPreconditionIssueComments = getCucumberPreconditionIssueComments;
function getCucumberPreconditionIssueTags(background, projectKey, comments, preconditionPrefix) {
    var preconditionKeys = [];
    if (background.steps.length > 0) {
        for (var _i = 0, comments_1 = comments; _i < comments_1.length; _i++) {
            var comment = comments_1[_i];
            var matches = comment.match(backgroundRegex(projectKey, preconditionPrefix));
            if (!matches) {
                continue;
            }
            else if (matches.length === 2) {
                preconditionKeys.push(matches[1]);
            }
        }
    }
    return preconditionKeys;
}
exports.getCucumberPreconditionIssueTags = getCucumberPreconditionIssueTags;
function backgroundRegex(projectKey, preconditionPrefix) {
    if (preconditionPrefix) {
        // @Precondition:CYP-111
        return new RegExp("@".concat(preconditionPrefix, "(").concat(projectKey, "-\\d+)"));
    }
    // @CYP-111
    return new RegExp("@(".concat(projectKey, "-\\d+)"));
}
