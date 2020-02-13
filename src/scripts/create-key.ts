import { createKey } from  '../fauna/createKey';

import { helpFlags } from './helpers';

/* -- Constants -- */
const usage = 'Usage: create-key.ts ENDPOINT_ALIAS ROLE_NAME [USER_NAME [PATH_TO_FAUNA_CONFIG]]';

const args = process.argv.slice(2);
if (args.length < 1 || args.length > 4) {
  console.error(usage);
  process.exit(1);
}

/* Process arguments */
if (helpFlags.includes(args[0])) {
  console.log(usage);
  process.exit(0);
}

const [dbName, roleName, userName, configFilepath] = args;

/* Code */
console.log('Creating');
createKey({ configFilepath, dbName, userName, roleName })
  .then((result) => {
    const { keyId, secret } = result;
    console.log(`The following key has been created for the '${roleName}' role in the '${dbName}' database:
    ID: ${keyId}
    secret: ${secret}`);
    console.log('RECORD THE SECRET NOW. This is the only time the secret will be visible.');
  })
  .catch((error) => console.error(`Error: ${error.message}`));
