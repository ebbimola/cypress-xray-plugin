import { IPreprocessorConfiguration } from "@badeball/cypress-cucumber-preprocessor";
import { logDebug } from "./logging/logging";

export interface CucumberPreprocessorExports {
    resolvePreprocessorConfiguration: (
        cypressConfig: Cypress.PluginConfigOptions,
        environment: Record<string, unknown>,
        implicitIntegrationFolder: string
    ) => Promise<IPreprocessorConfiguration>;
}

/**
 * Imports and returns an optional dependency.
 *
 * @param packageName the dependency's package name
 * @returns the dependency
 */
export async function importOptionalDependency<T>(packageName: string): Promise<T> {
    const dependency: T = await importModule(packageName);
    logDebug(`Successfully imported optional dependency: ${packageName}`);
    return dependency;
}

/**
 * Dynamically imports a package.
 *
 * Note: This function is mainly used for stubbing purposes only, since `import` cannot be stubbed
 * as it's not a function. You should probably use safer alternatives like
 * {@link importOptionalDependency `importOptionalDependency`}.
 *
 * @param packageName the name of the package to import
 * @returns the package
 */
export const importModule = async <T>(packageName: string): Promise<T> => {
    return await import(packageName);
};