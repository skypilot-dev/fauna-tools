/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Integer } from '@skypilot/common-types';
import { Client, query as q } from 'faunadb';

import { Timestamp } from '../lib/types';
import { FaunaConfig } from './FaunaConfig';

/* -- Typings -- */
interface DeleteKeyOptions {
  configFilepath?: string;
  dbName: string;
  keyName: string;
}

interface Key {
  id?: string;
  name: string;
  priority: Integer;
  role: string;
  hashed_secret: string;
  ts: Timestamp;
}

interface KeyRef {
  '@ref': {
    id: string;
    collection: {
      '@ref': {
        id: string;
      };
    };
  };
}

interface GetKeyOutput extends Key {
  ref: any;
}

interface PaginateKeysOutput {
  data: any;
}


function dereference(referenceObject: any): any {
  return JSON.parse(JSON.stringify(referenceObject));
}

async function getKeyIds(client: Client): Promise<string[]> {
  const paginateKeysOutput = await client.query(q.Paginate(q.Keys())) as PaginateKeysOutput;
  const { data } = paginateKeysOutput;
  const dereferencedData = dereference(data) as KeyRef[];
  const keyIds: string[] = dereferencedData.map((key) => key['@ref'].id);
  return keyIds;
}

async function getKeyById(client: Client, keyId: string): Promise<Key> {
  try {
    const getKeyOutput = await client.query(q.Get(q.Ref(q.Keys(), keyId))) as GetKeyOutput;
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { ref, ...otherProps } = getKeyOutput;
    return otherProps;
  } catch (error) {
    return await Promise.reject(error);
  }
}

/* Get all keys matching a list of IDs. */
// @ts-ignore
async function getKeysById(client: Client, keyIds: string[]): Promise<Key[]> {
  const keyPromises = keyIds.map(keyId => getKeyById(client, keyId).then());
  return await Promise.all(keyPromises);
}

async function getKeyByName(client: Client, name: string): Promise<Key | null> {
  const keyIds = await getKeyIds(client);
  for (let i = 0; i < keyIds.length; i += 1) {
    const keyId = keyIds[i];
    const key = await getKeyById(client, keyId);
    if (key.name === name) {
      return {
        id: keyId,
        ...key,
      };
    }
  }
  return null;
}

/* Delete the key */
/* IMPORTANT: It is assumed that endpoint alias = database name. This isn't required by Fauna, but it greatly
 * reduces the risk of confusion. */
export async function deleteKey({ configFilepath, dbName, keyName }: DeleteKeyOptions): Promise<any> {
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

  /* Get the key number from the key ID. */
  const key: Key | null = await getKeyByName(client, keyName);

  console.log('Found key:', key);

  // let deleteKeyOutput;
  console.log(`Deleting the key '${keyName}' from the '${dbName}' database...`);
  try {
    // deleteKeyOutput = await client.query(q.Delete(q.Ref(q.Keys(), keyNumber)));
    // console.log('deleteKeyOutput:', deleteKeyOutput);
    if (!key) {
      return null;
    }
    return { keyId: key.id };
  } catch (error) {
    return await Promise.reject(error);
  }
  // const parsedOutput = JSON.parse(JSON.stringify(deleteKeyOutput));
  // // console.log('parsedOutput:', parsedOutput);
  // const keyId = parsedOutput.ref['@ref'].id;
  // const { name, secret } = deleteKeyOutput;
  // return { keyId: name || keyId, secret };
}
