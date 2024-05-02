"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HELP = exports.BASE_URL = void 0;
exports.BASE_URL = "https://qytera-gmbh.github.io/projects/cypress-xray-plugin";
exports.HELP = {
    plugin: {
        configuration: {
            authentication: {
                jira: {
                    root: "".concat(exports.BASE_URL, "/section/configuration/authentication/#jira"),
                },
                root: "".concat(exports.BASE_URL, "/section/configuration/authentication/"),
                xray: {
                    cloud: "".concat(exports.BASE_URL, "/section/configuration/authentication/#xray-cloud"),
                    server: "".concat(exports.BASE_URL, "/section/configuration/authentication/#xray-server"),
                },
            },
            introduction: "".concat(exports.BASE_URL, "/section/configuration/introduction/"),
            jira: {
                projectKey: "".concat(exports.BASE_URL, "/section/configuration/jira/#projectkey"),
                testExecutionIssueType: "".concat(exports.BASE_URL, "/section/configuration/jira/#testExecutionIssueType"),
                testPlanIssueType: "".concat(exports.BASE_URL, "/section/configuration/jira/#testPlanIssueType"),
                url: "".concat(exports.BASE_URL, "/section/configuration/jira/#url"),
            },
            cucumber: {
                prefixes: "".concat(exports.BASE_URL, "/section/configuration/cucumber/#prefixes"),
            },
            plugin: {
                debug: "".concat(exports.BASE_URL, "/section/configuration/plugin/#debug"),
            },
        },
        guides: {
            targetingExistingIssues: "".concat(exports.BASE_URL, "/section/guides/targetingExistingIssues/"),
        },
    },
    xray: {
        installation: {
            cloud: "https://docs.getxray.app/display/XRAYCLOUD/Installation",
            server: "https://docs.getxray.app/display/XRAY/Installation",
        },
        importCucumberTests: {
            cloud: "https://docs.getxray.app/display/XRAYCLOUD/Importing+Cucumber+Tests+-+REST+v2",
            server: "https://docs.getxray.app/display/XRAY/Importing+Cucumber+Tests+-+REST",
        },
    },
};
