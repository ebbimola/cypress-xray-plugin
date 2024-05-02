"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
/**
 * All test statuses Cypress assigns to test attempts.
 */
var Status;
(function (Status) {
    /**
     * A test marked as passed.
     *
     * @see https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Passed
     */
    Status["PASSED"] = "passed";
    /**
     * A test marked as failed.
     *
     * @see https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Failed
     */
    Status["FAILED"] = "failed";
    /**
     * A test marked as pending.
     *
     * @see https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Pending
     */
    Status["PENDING"] = "pending";
    /**
     * A test marked as skipped.
     *
     * @see https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Skipped
     */
    Status["SKIPPED"] = "skipped";
})(Status || (exports.Status = Status = {}));
