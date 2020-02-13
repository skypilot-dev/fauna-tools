import { Client, query as q } from 'faunadb';

import { Timestamp } from '../lib/types';

import { FaunaConfig } from './FaunaConfig';


interface CreateDatabaseOptions {
  configFilepath: string;
  dbName: string;
  name: string;
  parentDbName: string;
}

interface CreateDatabaseOutput {
  name: string;
  ref: any;
  ts: Timestamp;
}

// https://docs.fauna.com/fauna/current/api/fql/functions/createdatabase
export async function createDatabase(
  { configFilepath, dbName, name, parentDbName }
): Promise<string> {
  console.log(configFilepath, name, parentDbName);
  const faunaConfig = new FaunaConfig({ filePath: configFilepath });
  const config = faunaConfig.getEndpoint(dbName);
  if (!config) {
    return Promise.reject(
      new Error(`No configuration for the '${dbName}' database was found in the Fauna configuration file.`)
    );
  }

  const { secret } = config;
  if (!secret) {
    return Promise.reject(
      new Error(`The secret for the '${dbName}' database is not defined in the Fauna configuration file.`)
    );
  }
  const client = new Client({ secret });
  let output: CreateDatabaseOutput;
  try {
    output = await client.query(
      q.CreateDatabase({
        name: dbName,
      })
    ) as CreateDatabaseOutput;
  } catch (error) {
    return Promise.reject(error);
  }
  return `The ${output.name} database has been created.`;
}
