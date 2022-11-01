import * as dotenv from 'dotenv';
dotenv.config();

import { getAsset } from './assets/assets';
import { getLastUpdates } from './assets/assetUpdate';
import { initialIndex } from './initialIndex';
import { getLastRound } from './assets/timer';
import { getListings } from './assets/listings';
import {
  applyWeightsToAssetDBEntry,
  applyWeightsToAssetSalesDBEntry,
  convertAssetToDBEntry,
} from './utils';
import { Asset, StatWeights } from './types';
import { getSold } from './assets/indexSales';
import { getLastAssets } from './assets/newAssets';
import {
  checkIfAssetIdExsists,
  checkIfListingExsists,
  deleteData,
  getIfTxIdExsists,
  insertData,
} from './database/data';
import fetch from 'node-fetch';
import { dropCollection, flushCollection } from './database/collection';

const statWeights: StatWeights = {
  combat: parseFloat(process.env.PIRATE_COMBAT_WEIGHT!),
  constitution: parseFloat(process.env.PIRATE_CONSTITUTION_WEIGHT!),
  luck: parseFloat(process.env.PIRATE_LUCK_WEIGHT!),
  plunder: parseFloat(process.env.PIRATE_PLUNDER_WEIGHT!),
};

const ASSETS_COLLECTION_NAME = process.env.MILVUS_ASSETS_COLLECTION!;
const SALES_COLLECTION_NAME = process.env.MILVUS_SALES_COLLECTION!;

const REINDEX = process.env.REINDEX === 'true';

async function main() {
  if (REINDEX) {
    await dropCollection(ASSETS_COLLECTION_NAME);
    await dropCollection(SALES_COLLECTION_NAME);
  }

  let roundBeforeIndex = await getLastRound();

  await initialIndex(
    ASSETS_COLLECTION_NAME,
    SALES_COLLECTION_NAME,
    statWeights,
  );

  // correct for time lost while indexing
  await checkStatUpdates(roundBeforeIndex);

  let lastRound = await getLastRound();
  while (true) {
    try {
      console.log('Checking for updates, current round: ' + lastRound);
      const URL = `${process.env.ALGOEXPLORER_URL}/status/wait-for-block-after/${lastRound}`;
      await fetch(URL);

      checkForNewAssets();
      checkStatUpdates(lastRound);
      checkSalesUpdates();
      checkListingUpdates();

      // flush milvus database every 100 blocks
      if (lastRound % 100 === 0) {
        await flushCollection(ASSETS_COLLECTION_NAME);
        await flushCollection(SALES_COLLECTION_NAME);
        console.log('Flushed collections');
      }
    } catch (error) {
      console.log(error);
    }
    lastRound++;
  }
}

let lastAssetIds: number[] = [];

async function checkForNewAssets() {
  const assets: Asset[] = await getLastAssets(10);

  for (const asset of assets) {
    if (!lastAssetIds.includes(asset.assetId)) {
      if (await checkIfAssetIdExsists(ASSETS_COLLECTION_NAME, asset.assetId)) {
        lastAssetIds.push(asset.assetId);
      } else {
        await insertData(ASSETS_COLLECTION_NAME, [
          applyWeightsToAssetDBEntry(convertAssetToDBEntry(asset), statWeights),
        ]);
        console.log('New asset found: ' + asset.assetId);
      }
    }
  }

  while (lastAssetIds.length > 10) {
    lastAssetIds.shift();
  }
}

async function checkStatUpdates(lastRound: number) {
  const assets: Asset[] = await getLastUpdates(lastRound);
  if (assets.length > 0) {
    const assetIds = assets.map((asset) => asset.assetId);
    await deleteData(ASSETS_COLLECTION_NAME, assetIds);

    const assetDBEntries = assets.map((asset) =>
      applyWeightsToAssetDBEntry(convertAssetToDBEntry(asset), statWeights),
    );
    await insertData(ASSETS_COLLECTION_NAME, assetDBEntries);

    console.log('Updated assets: ' + assetIds);
  }
}

let lastSalesTxIds: string[] = [];

export async function checkSalesUpdates() {
  const sales = await getSold(10);

  for (const sale of sales) {
    if (!lastSalesTxIds.includes(sale.txId)) {
      if (await getIfTxIdExsists(SALES_COLLECTION_NAME, sale.txId)) {
        lastSalesTxIds.push(sale.txId);
      } else {
        await insertData(SALES_COLLECTION_NAME, [
          applyWeightsToAssetSalesDBEntry(sale, statWeights),
        ]);

        // change forSale to false
        let asset: Asset | undefined = await getAsset(sale.assetId);
        if (asset != undefined) {
          asset.forSale = false;
          await deleteData(ASSETS_COLLECTION_NAME, [asset.assetId]);
          await insertData(ASSETS_COLLECTION_NAME, [
            applyWeightsToAssetDBEntry(
              convertAssetToDBEntry(asset),
              statWeights,
            ),
          ]);
        }

        console.log('New sale found: ' + sale.txId);
      }
    }
  }

  while (lastSalesTxIds.length > 10) {
    lastSalesTxIds.shift();
  }
}

let lastListingIds: number[] = [];

async function checkListingUpdates() {
  const listings: Asset[] = await getListings(10);

  for (const listing of listings) {
    if (!lastListingIds.includes(listing.assetId)) {
      if (
        await checkIfListingExsists(ASSETS_COLLECTION_NAME, listing.assetId)
      ) {
        lastListingIds.push(listing.assetId);
      } else {
        await deleteData(ASSETS_COLLECTION_NAME, [listing.assetId]);
        await insertData(ASSETS_COLLECTION_NAME, [
          applyWeightsToAssetDBEntry(
            convertAssetToDBEntry(listing),
            statWeights,
          ),
        ]);
        console.log('New listing found: ' + listing.assetId);
      }
    }
  }

  while (lastListingIds.length > 10) {
    lastListingIds.shift();
  }
}

main();
