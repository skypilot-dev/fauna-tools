/* Internal modules */
import { FaunaConfig, FaunaEndpointConfig } from './FaunaConfig';


/* Get the specified endpoint config, if it exists, from the Fauna config & return the result;
 * if the endpoint config doesn't exist, return null. */
export function getEndpointConfig(endpointAlias: string, configFilePath?: string): FaunaEndpointConfig | null {
  const faunaConfig: FaunaConfig = new FaunaConfig({
    filePath: configFilePath,
  });
  return faunaConfig.getEndpoint(endpointAlias);
}
