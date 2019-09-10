/* Built-in modules */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { homedir } from 'os';

/* External modules */
import ini from 'ini';

/* Internal modules */
import { Maybe } from '../lib/types';


/* -- Typings -- */
interface CreateFaunaConfig {
  filePath?: string;
}

export interface FaunaConfigData {
  [globalOrEndpointAlias: string]: string | FaunaEndpointConfig;
}

export interface FaunaEndpointConfig {
  domain: string;
  port?: Maybe<string>;
  scheme?: Maybe<string>;
  secret: string;
}


/* -- Constants -- */
const CONFIG_FILE_PATH = `${homedir()}/.fauna-shell`;


/* -- Classes -- */
/* Class for managing the Fauna configuratino file */
export class FaunaConfig {
  private _config: FaunaConfigData = {};

  private filePath: string = CONFIG_FILE_PATH;

  constructor(createFaunaConfig: CreateFaunaConfig) {
    const {
      filePath = CONFIG_FILE_PATH,
    } = createFaunaConfig;
    if (filePath) {
      this.filePath = filePath;
    }
    this.readFile();
  }

  get config(): FaunaConfigData {
    return this._config;
  }

  /* Return the requested endpoint config, or null if it doesn't exist. */
  getEndpoint(endpointAlias: string): FaunaEndpointConfig | null {
    if (!endpointAlias) {
      throw new Error('No endpoint alias was specified.');
    }
    if (!Object.prototype.hasOwnProperty.call(this._config, endpointAlias)) {
      return null;
    }
    const endpointConfig = this._config[endpointAlias];
    /* Guard against the case where the requested endpoint alias is actually the name of a global */
    if (typeof endpointConfig === 'string') {
      return null;
    }
    return endpointConfig;
  }

  readFile(): void {
    const configAsText = readFileSync(this.filePath, 'utf-8');
    this._config = ini.parse(configAsText)
  }

  removeEndpoint(endpointAlias: string): boolean {
    if (!endpointAlias) {
      throw new Error('No endpoint alias was specified.');
    }
    if (Object.prototype.hasOwnProperty.call(this._config, endpointAlias)) {
      delete this._config[endpointAlias];
      return true;
    }
    return false;
  }

  writeFile(): void {
    if (!existsSync(this.filePath)) {
      throw new Error(`The fauna configuration was not found at ${this.filePath}`);
    }
    const configAsText = ini.stringify(this._config);
    writeFileSync(this.filePath, configAsText);
  }
}
