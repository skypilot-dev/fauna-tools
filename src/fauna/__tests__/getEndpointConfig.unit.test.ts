/* -- Imports -- */
/* Built-in modules */
import { writeFileSync } from 'fs';

/* External modules */
import tmp from 'tmp';

/* Internal modules */
import { getEndpointConfig } from '../getEndpointConfig';


/* -- Constants -- */
const faunaConfigAsText = `
default=default-profile

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
writeFileSync(configFilePath, faunaConfigAsText);


/* -- Test suites -- */
describe('getEndpointConfig()', () => {
  it('can get a section of the Fauna config by endpoint alias', () => {
    const endpointAlias = 'dummy-profile-2';
    const endpointConfig = getEndpointConfig(endpointAlias, configFilePath);

    expect(endpointConfig).toMatchObject({
      domain: 'db2.fauna.com',
      scheme: 'https',
      secret: 'secret-key-2',
    });
  });
});
