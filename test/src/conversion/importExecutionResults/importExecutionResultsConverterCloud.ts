/// <reference types="cypress" />
import { expect } from "chai";
import { readFileSync } from "fs";
import { CONTEXT, initContext } from "../../../../src/context";
import { ImportExecutionResultsConverterCloud } from "../../../../src/conversion/importExecutionResults/importExecutionResultsConverterCloud";
import { XrayTestExecutionResultsCloud } from "../../../../src/types/xray/importTestExecutionResults";
import { stubLogWarning } from "../../../constants";
import { DummyXrayClient, expectToExist } from "../../helpers";

describe("the conversion function", () => {
    let converter: ImportExecutionResultsConverterCloud;

    beforeEach(() => {
        initContext({
            jira: {
                projectKey: "CYP",
            },
            xray: {
                testType: "Manual",
                uploadResults: true,
            },
            cucumber: {
                featureFileExtension: ".feature",
            },
        });
        CONTEXT.xrayClient = new DummyXrayClient();
        converter = new ImportExecutionResultsConverterCloud();
    });

    it("should be able to convert test results into Xray JSON", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResult.json", "utf-8")
        );
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);

        expect(json.tests).to.have.length(3);
    });

    it("should log warnings when unable to create test issues", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResult.json", "utf-8")
        );
        CONTEXT.config.jira.createTestIssues = false;
        const stubbedWarning = stubLogWarning();
        const json = converter.convertExecutionResults(result);
        expect(json.tests).to.not.exist;
        expect(stubbedWarning).to.have.been.called.with.callCount(3);
        expect(stubbedWarning).to.have.been.calledWith(
            'No test issue key found in test title. Skipping result upload for test "xray upload demo should look for paragraph elements".'
        );
        expect(stubbedWarning).to.have.been.calledWith(
            'No test issue key found in test title. Skipping result upload for test "xray upload demo should look for the anchor element".'
        );
        expect(stubbedWarning).to.have.been.calledWith(
            'No test issue key found in test title. Skipping result upload for test "xray upload demo should fail".'
        );
    });

    it("should be able to erase milliseconds from timestamps", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResult.json", "utf-8")
        );
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);
        expect(json.info?.startDate).to.eq("2022-11-28T17:41:12Z");
        expect(json.info?.finishDate).to.eq("2022-11-28T17:41:19Z");
    });

    it("should be able to detect re-use of existing test issues", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResultExistingTestIssues.json", "utf-8")
        );
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);
        expectToExist(json.tests);
        expect(json.tests).to.have.length(3);
        expect(json.tests[0].testKey).to.eq("CYP-40");
        expect(json.tests[1].testKey).to.eq("CYP-41");
        expect(json.tests[2].testKey).to.eq("CYP-49");
        expect(json.tests[0].testInfo).to.be.undefined;
        expect(json.tests[1].testInfo).to.be.undefined;
        expect(json.tests[2].testInfo).to.be.undefined;
    });

    it("should be able to add test execution issue keys", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResult.json", "utf-8")
        );
        CONTEXT.config.jira.testExecutionIssueKey = "CYP-123";
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);
        expect(json.testExecutionKey).to.eq("CYP-123");
    });

    it("should be able to add test plan issue keys", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResult.json", "utf-8")
        );
        CONTEXT.config.jira.testPlanIssueKey = "CYP-123";
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);
        expectToExist(json.info);
        expect(json.info.testPlanKey).to.eq("CYP-123");
    });

    it("should not add test execution issue keys on its own", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResult.json", "utf-8")
        );
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);
        expect(json.testExecutionKey).to.be.undefined;
    });

    it("should not add test plan issue keys on its own", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResult.json", "utf-8")
        );
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);
        expectToExist(json.info);
        expect(json.info.testPlanKey).to.be.undefined;
    });

    it("should be able to overwrite existing test issues if specified", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResultExistingTestIssues.json", "utf-8")
        );
        expectToExist(CONTEXT.config.plugin);
        CONTEXT.config.plugin.overwriteIssueSummary = true;
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);
        expectToExist(json.tests);
        expect(json.tests).to.have.length(3);
        expect(json.tests[0].testKey).to.eq("CYP-40");
        expect(json.tests[1].testKey).to.eq("CYP-41");
        expect(json.tests[2].testKey).to.eq("CYP-49");
        expect(json.tests[0].testInfo).to.not.be.undefined;
        expect(json.tests[1].testInfo).to.not.be.undefined;
        expect(json.tests[2].testInfo).to.not.be.undefined;
    });

    it("should be able to create test issues with summary overwriting disabled", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResult.json", "utf-8")
        );
        CONTEXT.config.plugin = {
            overwriteIssueSummary: false,
        };
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);
        expectToExist(json.tests);
        expect(json.tests).to.have.length(3);
        expect(json.tests[0].testInfo).to.exist;
        expect(json.tests[1].testInfo).to.exist;
        expect(json.tests[2].testInfo).to.exist;
    });

    it("should normalize screenshot filenames if enabled", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResultProblematicScreenshot.json", "utf-8")
        );
        expectToExist(CONTEXT.config.plugin);
        CONTEXT.config.plugin.normalizeScreenshotNames = true;
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);
        expectToExist(json.tests);
        expectToExist(json.tests[0].evidence);
        expect(json.tests[0].evidence[0].filename).to.eq("t_rtle_with_problem_tic_name.png");
    });

    it("should not normalize screenshot filenames if disabled", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResultProblematicScreenshot.json", "utf-8")
        );
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);
        expectToExist(json.tests);
        expectToExist(json.tests[0].evidence);
        expect(json.tests[0].evidence[0].filename).to.eq("tûrtle with problemätic name.png");
    });

    it("should be able to use custom passed/failed statuses", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResult.json", "utf-8")
        );
        expectToExist(CONTEXT.config.xray);
        CONTEXT.config.xray.statusPassed = "it worked";
        CONTEXT.config.xray.statusFailed = "it did not work";
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);
        expectToExist(json.tests);
        expect(json.tests[0].status).to.eq("it worked");
        expect(json.tests[1].status).to.eq("it worked");
        expect(json.tests[2].status).to.eq("it did not work");
    });

    it("should be able to skip screenshot evidence if disabled", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResult.json", "utf-8")
        );
        expectToExist(CONTEXT.config.xray);
        CONTEXT.config.xray.uploadScreenshots = false;
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);
        expectToExist(json.tests);
        expect(json.tests).to.have.length(3);
        expect(json.tests[0].evidence).to.be.undefined;
        expect(json.tests[1].evidence).to.be.undefined;
        expect(json.tests[2].evidence).to.be.undefined;
    });

    it("should skip step updates if disabled", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResult.json", "utf-8")
        );
        expectToExist(CONTEXT.config.xray);
        CONTEXT.config.xray.steps = {
            update: false,
        };
        // TODO: remove once #47 is fixed.
        expectToExist(CONTEXT.config.plugin);
        CONTEXT.config.plugin.overwriteIssueSummary = true;
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);
        expectToExist(json.tests);
        expect(json.tests).to.have.length(3);
        expectToExist(json.tests[0].testInfo);
        expect(json.tests[0].testInfo.steps).to.be.undefined;
        expectToExist(json.tests[1].testInfo);
        expect(json.tests[1].testInfo.steps).to.be.undefined;
        expectToExist(json.tests[2].testInfo);
        expect(json.tests[2].testInfo.steps).to.be.undefined;
    });

    it("should include step updates if enabled", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResult.json", "utf-8")
        );
        expectToExist(CONTEXT.config.xray);
        CONTEXT.config.xray.steps = {
            update: true,
        };
        // TODO: remove once #47 is fixed.
        expectToExist(CONTEXT.config.plugin);
        CONTEXT.config.plugin.overwriteIssueSummary = true;
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);
        expectToExist(json.tests);
        expect(json.tests).to.have.length(3);
        expectToExist(json.tests[0].testInfo);
        expectToExist(json.tests[0].testInfo.steps);
        expect(json.tests[0].testInfo.steps).to.have.length(1);
        expect(json.tests[0].testInfo.steps[0].action).to.be.a("string");
        expectToExist(json.tests[1].testInfo);
        expectToExist(json.tests[1].testInfo.steps);
        expect(json.tests[1].testInfo.steps).to.have.length(1);
        expect(json.tests[1].testInfo.steps[0].action).to.be.a("string");
        expectToExist(json.tests[2].testInfo);
        expectToExist(json.tests[2].testInfo.steps);
        expect(json.tests[2].testInfo.steps).to.have.length(1);
        expect(json.tests[2].testInfo.steps[0].action).to.be.a("string");
    });

    it("should truncate step actions if enabled", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResult.json", "utf-8")
        );
        expectToExist(CONTEXT.config.xray);
        CONTEXT.config.xray.steps = {
            update: true,
            maxLengthAction: 5,
        };
        // TODO: remove once #47 is fixed.
        expectToExist(CONTEXT.config.plugin);
        CONTEXT.config.plugin.overwriteIssueSummary = true;
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);
        expectToExist(json.tests);
        expectToExist(json.tests[0].testInfo);
        expectToExist(json.tests[0].testInfo.steps);
        expect(json.tests[0].testInfo.steps[0].action.length).to.eq(5);
        expectToExist(json.tests[1].testInfo);
        expectToExist(json.tests[1].testInfo.steps);
        expect(json.tests[1].testInfo.steps[0].action.length).to.eq(5);
        expectToExist(json.tests[2].testInfo);
        expectToExist(json.tests[2].testInfo.steps);
        expect(json.tests[2].testInfo.steps[0].action.length).to.eq(5);
    });

    it("should include a custom test execution summary if provided", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResult.json", "utf-8")
        );
        expectToExist(CONTEXT.config.jira);
        CONTEXT.config.jira.testExecutionIssueSummary = "Jeffrey's Test";
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);
        expectToExist(json.info);
        expect(json.info.summary).to.eq("Jeffrey's Test");
    });

    it("should use a timestamp as test execution summary by default", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResult.json", "utf-8")
        );
        expectToExist(CONTEXT.config.jira);
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);
        expectToExist(json.info);
        expect(json.info.summary).to.eq("Execution Results [1669657272234]");
    });

    it("should include a custom test execution description if provided", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResult.json", "utf-8")
        );
        expectToExist(CONTEXT.config.jira);
        CONTEXT.config.jira.testExecutionIssueDescription = "Very Useful Text";
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);
        expectToExist(json.info);
        expect(json.info.description).to.eq("Very Useful Text");
    });

    it("should use versions as test execution description by default", () => {
        let result: CypressCommandLine.CypressRunResult = JSON.parse(
            readFileSync("./test/resources/runResult.json", "utf-8")
        );
        expectToExist(CONTEXT.config.jira);
        const json: XrayTestExecutionResultsCloud = converter.convertExecutionResults(result);
        expectToExist(json.info);
        expect(json.info.description).to.eq(
            "Cypress version: 11.1.0 Browser: electron (106.0.5249.51)"
        );
    });
});
