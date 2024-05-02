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
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiplePreconditionKeysInCucumberBackgroundError = exports.missingPreconditionKeyInCucumberBackgroundError = exports.multipleTestKeysInCucumberScenarioError = exports.missingTestKeyInCucumberScenarioError = exports.multipleTestKeysInNativeTestTitleError = exports.missingTestKeyInNativeTestTitleError = exports.isLoggedError = exports.LoggedError = exports.errorMessage = void 0;
var dedent_1 = require("./dedent");
var help_1 = require("./help");
var string_1 = require("./string");
/**
 * Returns an error message of any error.
 *
 * @param error - the error
 * @returns the error message
 */
function errorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    return (0, string_1.unknownToString)(error);
}
exports.errorMessage = errorMessage;
/**
 * An error which has been logged to a file or other log locations already.
 */
var LoggedError = /** @class */ (function (_super) {
    __extends(LoggedError, _super);
    function LoggedError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return LoggedError;
}(Error));
exports.LoggedError = LoggedError;
/**
 * Assesses whether the given error is an instance of a {@link LoggedError | `LoggedError`}.
 *
 * @param error - the error
 * @returns `true` if the error is a {@link LoggedError | `LoggedError`}, otherwise `false`
 */
function isLoggedError(error) {
    return error instanceof LoggedError;
}
exports.isLoggedError = isLoggedError;
// ============================================================================================== //
// COLLECTION OF USEFUL ERRORS                                                                    //
// ============================================================================================== //
/**
 * Returns an error describing that a test issue key is missing in the title of a native Cypress
 * test case.
 *
 * @param title - the Cypress test title
 * @param projectKey - the project key
 * @returns the error
 */
function missingTestKeyInNativeTestTitleError(title, projectKey) {
    return new Error((0, dedent_1.dedent)("\n            No test issue keys found in title of test: ".concat(title, "\n            You can target existing test issues by adding a corresponding issue key:\n\n            it(\"").concat(projectKey, "-123 ").concat(title, "\", () => {\n              // ...\n            });\n\n            For more information, visit:\n            - ").concat(help_1.HELP.plugin.guides.targetingExistingIssues, "\n        ")));
}
exports.missingTestKeyInNativeTestTitleError = missingTestKeyInNativeTestTitleError;
/**
 * Returns an error describing that multiple test issue keys are present in the title of a native
 * Cypress test case.
 *
 * @param title - the Cypress test title
 * @param issueKeys - the issue keys
 * @returns the error
 */
function multipleTestKeysInNativeTestTitleError(title, issueKeys) {
    // Remove any circumflexes currently present in the title.
    var indicatorLine = title.replaceAll("^", " ");
    issueKeys.forEach(function (issueKey) {
        indicatorLine = indicatorLine.replaceAll(issueKey, "^".repeat(issueKey.length));
    });
    // Replace everything but circumflexes with space.
    indicatorLine = indicatorLine.replaceAll(/[^^]/g, " ");
    return new Error((0, dedent_1.dedent)("\n            Multiple test keys found in title of test: ".concat(title, "\n            The plugin cannot decide for you which one to use:\n\n            it(\"").concat(title, "\", () => {\n                ").concat(indicatorLine, "\n              // ...\n            });\n\n            For more information, visit:\n            - ").concat(help_1.HELP.plugin.guides.targetingExistingIssues, "\n        ")));
}
exports.multipleTestKeysInNativeTestTitleError = multipleTestKeysInNativeTestTitleError;
/**
 * Returns an error describing that a test issue key is missing in the tags of a Cucumber scenario.
 *
 * @param scenario - the Cucumber scenario
 * @param projectKey - the project key
 * @param isCloudClient - whether Xray cloud is being used
 * @returns the error
 */
function missingTestKeyInCucumberScenarioError(scenario, projectKey, isCloudClient) {
    var firstStepLine = scenario.steps.length > 0
        ? "".concat(scenario.steps[0].keyword.trim(), " ").concat(scenario.steps[0].text)
        : "Given A step";
    // if (scenario.tags && scenario.tags.length > 0) {
    //     return new Error(
    //         dedent(`
    //             No test issue keys found in tags of scenario${
    //                 scenario.name.length > 0 ? `: ${scenario.name}` : ""
    //             }
    //             Available tags:
    //               ${scenario.tags.map((tag) => tag.name).join("\n")}
    //             If a tag contains the test issue key already, specify a global prefix to align the plugin with Xray
    //               For example, with the following plugin configuration:
    //                 {
    //                   cucumber: {
    //                     prefixes: {
    //                       test: "TestName:"
    //                     }
    //                   }
    //                 }
    //               The following tag will be recognized as a test issue tag by the plugin:
    //                 @TestName:${projectKey}-123
    //                 ${scenario.keyword}: ${scenario.name}
    //                   ${firstStepLine}
    //                   ...
    //             For more information, visit:
    //             - ${HELP.plugin.guides.targetingExistingIssues}
    //             - ${HELP.plugin.configuration.cucumber.prefixes}
    //             - ${
    //                 isCloudClient
    //                     ? HELP.xray.importCucumberTests.cloud
    //                     : HELP.xray.importCucumberTests.server
    //             }
    //         `)
    //     );
    // }
    return new Error((0, dedent_1.dedent)("\n            No test issue keys found in tags of scenario".concat(scenario.name.length > 0 ? ": ".concat(scenario.name) : "", "\n\n            You can target existing test issues by adding a corresponding tag:\n\n              @").concat(projectKey, "-123\n              ").concat(scenario.keyword, ": ").concat(scenario.name, "\n                ").concat(firstStepLine, "\n                ...\n\n            You can also specify a prefix to match the tagging scheme configured in your Xray instance:\n\n              Plugin configuration:\n\n                {\n                  cucumber: {\n                    prefixes: {\n                      test: \"TestName:\"\n                    }\n                  }\n                }\n\n              Feature file:\n\n                @TestName:").concat(projectKey, "-123\n                ").concat(scenario.keyword, ": ").concat(scenario.name, "\n                  ").concat(firstStepLine, "\n                  ...\n\n            For more information, visit:\n            - ").concat(help_1.HELP.plugin.guides.targetingExistingIssues, "\n            - ").concat(help_1.HELP.plugin.configuration.cucumber.prefixes, "\n            - ").concat(isCloudClient
        ? help_1.HELP.xray.importCucumberTests.cloud
        : help_1.HELP.xray.importCucumberTests.server, "\n        ")));
}
exports.missingTestKeyInCucumberScenarioError = missingTestKeyInCucumberScenarioError;
/**
 * Returns an error describing that multiple test issue keys are present in the tags of a Cucumber
 * scenario.
 *
 * @param scenario - the Cucumber scenario
 * @param tags - the scenario tags
 * @param issueKeys - the issue keys
 * @param isCloudClient - whether Xray cloud is being used
 * @param testPrefix - the prefix of issues linked in scenario tags
 * @returns the error
 */
function multipleTestKeysInCucumberScenarioError(scenario, tags, issueKeys, isCloudClient) {
    var firstStepLine = scenario.steps.length > 0
        ? "".concat(scenario.steps[0].keyword.trim(), " ").concat(scenario.steps[0].text)
        : "Given A step";
    return new Error((0, dedent_1.dedent)("\n            Multiple test issue keys found in tags of scenario".concat(scenario.name.length > 0 ? ": ".concat(scenario.name) : "", "\n            The plugin cannot decide for you which one to use:\n\n            ").concat(tags.map(function (tag) { return tag.name; }).join(" "), "\n            ").concat(tags
        .map(function (tag) {
        if (issueKeys.some(function (key) { return tag.name.endsWith(key); })) {
            return "^".repeat(tag.name.length);
        }
        return " ".repeat(tag.name.length);
    })
        .join(" ")
        .trimEnd(), "\n            ").concat(scenario.keyword, ": ").concat(scenario.name, "\n              ").concat(firstStepLine, "\n              ...\n\n            For more information, visit:\n            - ").concat(isCloudClient
        ? help_1.HELP.xray.importCucumberTests.cloud
        : help_1.HELP.xray.importCucumberTests.server, "\n            - ").concat(help_1.HELP.plugin.guides.targetingExistingIssues, "\n        ")));
}
exports.multipleTestKeysInCucumberScenarioError = multipleTestKeysInCucumberScenarioError;
/**
 * Returns an error describing that a test issue key is missing in the comments of a Cucumber
 * background.
 *
 * @param background - the Cucumber background
 * @param projectKey - the project key
 * @param isCloudClient - whether Xray cloud is being used
 * @param comments - the comments containing precondition issue keys
 * @returns the error
 */
function missingPreconditionKeyInCucumberBackgroundError(background, projectKey, isCloudClient, comments) {
    var firstStepLine = background.steps.length > 0
        ? "".concat(background.steps[0].keyword.trim(), " ").concat(background.steps[0].text)
        : "Given A step";
    if (comments && comments.length > 0) {
        return new Error((0, dedent_1.dedent)("\n                No precondition issue keys found in comments of background".concat(background.name.length > 0 ? ": ".concat(background.name) : "", "\n\n                Available comments:\n                  ").concat(comments.join("\n"), "\n\n                If a comment contains the precondition issue key already, specify a global prefix to align the plugin with Xray\n\n                  For example, with the following plugin configuration:\n\n                    {\n                      cucumber: {\n                        prefixes: {\n                          precondition: \"Precondition:\"\n                        }\n                      }\n                    }\n\n                  The following comment will be recognized as a precondition issue tag by the plugin:\n\n                    ").concat(background.keyword, ": ").concat(background.name, "\n                      #@Precondition:").concat(projectKey, "-123\n                      ").concat(firstStepLine, "\n                      ...\n\n                For more information, visit:\n                - ").concat(help_1.HELP.plugin.guides.targetingExistingIssues, "\n                - ").concat(help_1.HELP.plugin.configuration.cucumber.prefixes, "\n                - ").concat(isCloudClient
            ? help_1.HELP.xray.importCucumberTests.cloud
            : help_1.HELP.xray.importCucumberTests.server, "\n            ")));
    }
    return new Error((0, dedent_1.dedent)("\n            No precondition issue keys found in comments of background".concat(background.name.length > 0 ? ": ".concat(background.name) : "", "\n\n            You can target existing precondition issues by adding a corresponding comment:\n\n              ").concat(background.keyword, ": ").concat(background.name, "\n                #@").concat(projectKey, "-123\n                ").concat(firstStepLine, "\n                ...\n\n            You can also specify a prefix to match the tagging scheme configured in your Xray instance:\n\n              Plugin configuration:\n\n                {\n                  cucumber: {\n                    prefixes: {\n                      precondition: \"Precondition:\"\n                    }\n                  }\n                }\n\n              Feature file:\n\n                ").concat(background.keyword, ": ").concat(background.name, "\n                  #@Precondition:").concat(projectKey, "-123\n                  ").concat(firstStepLine, "\n                  ...\n\n            For more information, visit:\n            - ").concat(help_1.HELP.plugin.guides.targetingExistingIssues, "\n            - ").concat(help_1.HELP.plugin.configuration.cucumber.prefixes, "\n            - ").concat(isCloudClient
        ? help_1.HELP.xray.importCucumberTests.cloud
        : help_1.HELP.xray.importCucumberTests.server, "\n        ")));
}
exports.missingPreconditionKeyInCucumberBackgroundError = missingPreconditionKeyInCucumberBackgroundError;
/**
 * Returns an error describing that multiple test issue keys are present in the comments of a
 * Cucumber background.
 *
 * @param background - the Cucumber background
 * @param preconditionKeys - the issue keys
 * @param comments - the precondition comments
 * @param isCloudClient - whether Xray cloud is being used
 * @returns the error
 */
function multiplePreconditionKeysInCucumberBackgroundError(background, preconditionKeys, comments, isCloudClient) {
    return new Error((0, dedent_1.dedent)("\n            Multiple precondition issue keys found in comments of background".concat(background.name.length > 0 ? ": ".concat(background.name) : "", "\n            The plugin cannot decide for you which one to use:\n\n            ").concat(reconstructMultipleTagsBackground(background, preconditionKeys, comments), "\n\n            For more information, visit:\n            - ").concat(isCloudClient
        ? help_1.HELP.xray.importCucumberTests.cloud
        : help_1.HELP.xray.importCucumberTests.server, "\n            - ").concat(help_1.HELP.plugin.guides.targetingExistingIssues, "\n        ")));
}
exports.multiplePreconditionKeysInCucumberBackgroundError = multiplePreconditionKeysInCucumberBackgroundError;
function reconstructMultipleTagsBackground(background, preconditionIssueKeys, comments) {
    var example = [];
    var backgroundLine = background.location.line;
    var firstStepLine = background.steps[0].location.line;
    example.push("".concat(background.keyword, ": ").concat(background.name));
    var _loop_1 = function (comment) {
        if (comment.location.line > backgroundLine && comment.location.line < firstStepLine) {
            example.push("  ".concat(comment.text.trimStart()));
            if (preconditionIssueKeys.some(function (key) { return comment.text.endsWith(key); })) {
                example.push("  ".concat(comment.text.replaceAll(/\S/g, "^").trimStart()));
            }
        }
    };
    for (var _i = 0, comments_1 = comments; _i < comments_1.length; _i++) {
        var comment = comments_1[_i];
        _loop_1(comment);
    }
    example.push(background.steps.length > 0
        ? "  ".concat(background.steps[0].keyword.trim(), " ").concat(background.steps[0].text)
        : "  Given A step");
    example.push("  ...");
    return example.join("\n");
}
