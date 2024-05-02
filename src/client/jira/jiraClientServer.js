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
exports.JiraClientServer = void 0;
var jiraClient_1 = require("./jiraClient");
/**
 * A Jira client class for communicating with Jira Server instances.
 */
var JiraClientServer = /** @class */ (function (_super) {
    __extends(JiraClientServer, _super);
    function JiraClientServer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JiraClientServer.prototype.getUrlAddAttachment = function (issueIdOrKey) {
        return "".concat(this.apiBaseUrl, "/rest/api/2/issue/").concat(issueIdOrKey, "/attachments");
    };
    JiraClientServer.prototype.getUrlGetIssueTypes = function () {
        return "".concat(this.apiBaseUrl, "/rest/api/2/issuetype");
    };
    JiraClientServer.prototype.getUrlGetFields = function () {
        return "".concat(this.apiBaseUrl, "/rest/api/2/field");
    };
    JiraClientServer.prototype.getUrlPostSearch = function () {
        return "".concat(this.apiBaseUrl, "/rest/api/2/search");
    };
    JiraClientServer.prototype.getUrlEditIssue = function (issueIdOrKey) {
        return "".concat(this.apiBaseUrl, "/rest/api/2/issue/").concat(issueIdOrKey);
    };
    return JiraClientServer;
}(jiraClient_1.AbstractJiraClient));
exports.JiraClientServer = JiraClientServer;
