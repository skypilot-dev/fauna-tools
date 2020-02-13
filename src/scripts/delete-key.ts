import { deleteKey } from  '../fauna/deleteKey';

import { helpFlags } from './helpers';

/* -- Constants -- */
const usage = 'Usage: delete-key.ts DB_NAME KEY_ID [PATH_TO_FAUNA_CONFIG]';

const args = process.argv.slice(2);
if (args.length < 1 || args.length > 3) {
  console.error(usage);
  process.exit(1);
}

/* Process arguments */
if (helpFlags.includes(args[0])) {
  console.log(usage);
  process.exit(0);
}

const [dbName, keyId, configFilepath] = args;

/* Code */
console.log('Deleting...');
deleteKey({ configFilepath, dbName, keyName: keyId })
  .then((result) => {
    const { keyId } = result;
    console.log(`The '${keyId}' key has been deleted from the '${dbName}' database:
      ID: ${keyId}
    `);
  })
  // .catch((error) => console.error(`The key could not be deleted: ${error.message}`));
  .catch((error) => {
    let errorDescription = '';
    if (error.requestResult) {
      const parsedResponse = JSON.parse(error.requestResult.responseRaw) || '';
      if (parsedResponse) {
        const { errors } = parsedResponse || [];
        if (errors.length > 0) {
          errorDescription = errors[0].description;
        }
      }
    }
    console.error(`The key could not be deleted. ${error.name}: ${error.message}.
    Description: ${errorDescription}`
    );
  });
// .catch((error) => console.error('The key could not be deleted:', error));
