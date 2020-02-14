import { deleteEndpointConfig } from '../fauna/deleteEndpointConfig';
import { helpFlags } from '../helpers';

const usage = 'Usage: delete-endpoint-config.ts ENDPOINT_ALIAS [PATH_TO_FAUNA_CONFIG]';

const args = process.argv.slice(2);
if (args.length < 1 || args.length > 2) {
  console.error(usage);
  process.exit(1);
}

if (helpFlags.includes(args[0])) {
  console.log(usage);
  process.exit(0);
}

const [endpointAlias, configFilepath] = args;
deleteEndpointConfig(endpointAlias, configFilepath);
