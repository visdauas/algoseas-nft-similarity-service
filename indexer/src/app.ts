/**
 * The following lines intialize dotenv,
 * so that env vars from the .env file are present in process.env
 */
import * as dotenv from 'dotenv';
dotenv.config();

import { testDatabase } from './databaseTest';
import { getClient } from './database/client';
import { getAssetIds } from './assets/assetId';
import { getEveryAsset } from './assets/indexAssets';
import { getAsset } from './assets/assets';
import { getLastUpdates } from './assets/assetUpdate';
import { initialIndex } from './initialIndex';
import { waitForBlock } from './assets/timer';
import { getNListings } from './assets/listings';
import { convertAssetToDBEntry } from './utils';
import { StatWeights } from './types';

export const sum = (a: number, b: number): number => {
  return a + b;
};

const statWeights: StatWeights = {
  combat: parseFloat(process.env.PIRATE_COMBAT_WEIGHT!),
  constitution: parseFloat(process.env.PIRATE_CONSTITUTION_WEIGHT!),
  luck: parseFloat(process.env.PIRATE_LUCK_WEIGHT!),
  plunder: parseFloat(process.env.PIRATE_PLUNDER_WEIGHT!),
};

//waitForBlock();

//getEveryAsset();

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
//testDatabase(); // do not uncomment if you don't want to reindex 21k items. learnt it the hard way
initialIndex(statWeights);

