/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Timestamp } from '../lib/types';

export interface CreateKeyOutput {
  collection: any;
  database: any;
  hashed_secret: string;
  name?: string;
  ref: any;
  role: string;
  secret: string;
  ts: Timestamp;
}
