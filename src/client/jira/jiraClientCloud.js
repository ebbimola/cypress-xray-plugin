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
exports.JiraClientCloud = void 0;
var jiraClient_1 = require("./jiraClient");
/**
 * A Jira client class for communicating with Jira Cloud instances.
 */
var JiraClientCloud = /** @class */ (function (_super) {
    __extends(JiraClientCloud, _super);
    function JiraClientCloud() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JiraClientCloud.prototype.getUrlAddAttachment = function (issueIdOrKey) {
        return "".concat(this.apiBaseUrl, "/rest/api/3/issue/").concat(issueIdOrKey, "/attachments");
    };
    JiraClientCloud.prototype.getUrlGetIssueTypes = function () {
        return "".concat(this.apiBaseUrl, "/rest/api/3/issuetype");
    };
    JiraClientCloud.prototype.getUrlGetFields = function () {
        return "".concat(this.apiBaseUrl, "/rest/api/3/field");
    };
    JiraClientCloud.prototype.getUrlPostSearch = function () {
        return "".concat(this.apiBaseUrl, "/rest/api/3/search");
    };
    JiraClientCloud.prototype.getUrlEditIssue = function (issueIdOrKey) {
        return "".concat(this.apiBaseUrl, "/rest/api/3/issue/").concat(issueIdOrKey);
    };
    return JiraClientCloud;
}(jiraClient_1.AbstractJiraClient));
exports.JiraClientCloud = JiraClientCloud;
