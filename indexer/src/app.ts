/**
 * The following lines intialize dotenv,
 * so that env vars from the .env file are present in process.env
 */
import * as dotenv from 'dotenv';
dotenv.config();

import { testDatabase } from './databaseTest';
import { getClient } from './database/client';
import { getAssetIds } from './assets/assetId';
import { Asset, getAsset } from './assets/assets';
import { getLastUpdates } from './assets/assetUpdate';

export const sum = (a: number, b: number): number => {
  return a + b;
};

//getLastUpdates(5);

/*
getAssetIds().then(ids => {
  ids.forEach(id => {
    getAsset(id).then(asset => {
      console.log(asset.assetId);
    });
  });
});
*/

//getClient();
testDatabase();