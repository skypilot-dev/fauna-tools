/* Built-in modules */
import { readFileSync, writeFileSync } from 'fs';

/* External modules */
import tmp from 'tmp';

/* Internal modules */
import { deleteEndpointConfig } from '../deleteEndpointConfig';


const faunaConfigAsText =
`default=default-profile

[dummy-profile-1]
domain=db1.fauna.com
scheme=https
secret=secret-key-1

[dummy-profile-2]
domain=db2.fauna.com
scheme=https
secret=secret-key-2
`;

const configFilePath = tmp.fileSync().name;
writeFileSync(configFilePath, faunaConfigAsText)

describe('deleteEndpointConfig()', () => {
  it('can delete a section of the Fauna config by endpoint alias', () => {
    const endpointAlias = 'dummy-profile-1';
    const deleted = deleteEndpointConfig(endpointAlias, configFilePath);

    expect(deleted).toBe(true);
    const configAsText = readFileSync(configFilePath, 'utf-8');
    const expectedFileContent =
`default=default-profile

[dummy-profile-2]
domain=db2.fauna.com
scheme=https
secret=secret-key-2
`;
    expect(configAsText).toEqual(expectedFileContent);
  });
});
