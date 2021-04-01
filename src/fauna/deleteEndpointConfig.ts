/* eslint-disable no-console */

/* Internal modules */
import { FaunaConfig } from './FaunaConfig';


/* Delete the specified endpoint config, if it exists, from the Fauna config. Return true if the
 * endpoint config was found and deleted; otherwise, return false. */
export function deleteEndpointConfig(endpointAlias: string, configFilePath?: string): boolean {
  const faunaConfig: FaunaConfig = new FaunaConfig({
    filePath: configFilePath,
  });
  if (faunaConfig.removeEndpoint(endpointAlias)) {
    faunaConfig.writeFile();
    console.log('Changes to the Fauna config file have been saved.');
    return true;
  }
  console.log('The specified endpoint config does not exist. No changes were made to the Fauna config file');
  return false;
}
