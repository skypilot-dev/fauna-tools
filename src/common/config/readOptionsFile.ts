import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { findPackageFileDir } from '@skypilot/sugarbowl';

interface ReadOptionsFileOptions {
  pathToFile?: string;
}

/* eslint-disable-next-line @typescript-eslint/ban-types */
export function readOptionsFile(options: ReadOptionsFileOptions = {}): object {
  const {
    pathToFile = path.resolve(findPackageFileDir(), '.skypilot/fauna-tools.yaml'),
  } = options;
  if (fs.existsSync(pathToFile)) {
    const fileContents = fs.readFileSync(pathToFile, { encoding: 'utf-8'} );
    const parsedContents = yaml.safeLoad(fileContents);
    if (typeof parsedContents === 'string') {
      throw new Error(`Unexpected non-object value read from YAML file: ${parsedContents}`);
    }
    return parsedContents || {};
  }
  return {};
}
