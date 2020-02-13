/* -- Imports -- */
/* External imports */
import { Client, query as q } from 'faunadb';

/* Internal imports */
import { FaunaConfig } from './FaunaConfig';
import { CreateKeyOutput } from './types';


/* -- Typings -- */
interface CreateKeyOptions {
  configFilepath?: string;
  dbName: string;
  userName?: string;
  roleName?: string;
}

export interface CreateUserKeyOutput {
  keyId: string;
  name?: string;
  secret: string;
}


/* Create a database-wide key for the specified role. */
/* IMPORTANT: It is assumed that endpoint alias = database name. This isn't required by Fauna, but it greatly
 * reduces the risk of confusion. */
export async function createKey({ configFilepath, dbName, userName = '', roleName = 'admin' }: CreateKeyOptions): Promise<CreateUserKeyOutput> {
  const faunaConfig = new FaunaConfig({ filePath: configFilepath });
  const config = faunaConfig.getEndpoint(dbName);
  if (!config) {
    return Promise.reject(
      new Error(`No configuration for the '${dbName}' database was found in the Fauna configuration file.`)
    );
  }

  const { secret: adminSecret } = config;
  if (!adminSecret) {
    return Promise.reject(
      new Error(`The secret for the '${dbName}' database is not defined in the Fauna configuration file.`)
    );
  }

  const client = new Client({ secret: adminSecret });
  let createKeyOutput: CreateKeyOutput ;
  try {
    createKeyOutput = await client.query(
      q.CreateKey({
        ...(userName ? { name: userName } : {}),
        role: roleName,
      })
    ) as CreateKeyOutput;
  } catch (error) {
    return await Promise.reject(error);
  }
  const parsedOutput = JSON.parse(JSON.stringify(createKeyOutput));
  // console.log('parsedOutput:', parsedOutput);
  const keyId = parsedOutput.ref['@ref'].id;
  const { name, secret } = createKeyOutput;
  return { keyId: name || keyId, secret };
}
