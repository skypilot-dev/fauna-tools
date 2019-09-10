import { writeFileSync } from 'fs';

import tmp from 'tmp';

import { FaunaConfig } from '../FaunaConfig';


/* -- Constants -- */
const faunaConfigAsText = `
default=dummy-profile

[dummy-profile]
domain=db.fauna.com
scheme=https
secret=secret-key
`;

const filePath = tmp.fileSync().name;
writeFileSync(filePath, faunaConfigAsText);


/* -- Test suites -- */
describe('FaunaConfig', () => {
  it('should parse the file at the path passed to the constructor to a configuration object', () => {
    const faunaConfig = new FaunaConfig(({
      filePath,
    }));
    expect(faunaConfig.config).toMatchObject({
      'default': 'dummy-profile',
      'dummy-profile': {
        domain: 'db.fauna.com',
        scheme: 'https',
        secret: 'secret-key',
      },
    });
  });
});
