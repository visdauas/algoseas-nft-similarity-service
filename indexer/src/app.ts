/**
 * The following lines intialize dotenv,
 * so that env vars from the .env file are present in process.env
 */
import * as dotenv from 'dotenv';
dotenv.config();

import { testDatabase } from './databaseTest';
import { getClient } from './database/client';
import { getAssetIds } from './assets/assetId';

export const sum = (a: number, b: number): number => {
  return a + b;
};

//getAssetIds().then(ids => {console.log(ids.length)})
getClient();
testDatabase();