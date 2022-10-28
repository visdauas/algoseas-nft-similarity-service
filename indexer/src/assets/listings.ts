import { config } from 'dotenv';
import fetch from 'node-fetch';
import { Asset } from '../types';
import { isValidAssetData } from './assets';
import { insertData, deleteData } from '../database/data';
import { assetFromJSON } from './assets';
import { convertAssetToDBEntry } from '../utils';

export async function initializeDatabase() {
  const listings: Asset[] = await getNListings();
  await deleteData('algoseas_pirates', listings.map(l => +l.assetId));
  await insertData('algoseas_pirates', listings.map(l => convertAssetToDBEntry(l)));
}

export async function updateDatabase(limit = 10) {
  const listings: Asset[] = await getNListings(limit);
  await deleteData('algoseas_pirates', listings.map(l => +l.assetId));
  await insertData('algoseas_pirates', listings.map(l => convertAssetToDBEntry(l)));
}

export async function getNListings(limit = 0) : Promise<Asset[]> {
  let URL = `${process.env.PIRATE_API_URL}/prod/marketplace/listings?type=listing`;
  if(limit > 0)
    URL = `${process.env.PIRATE_API_URL}/prod/marketplace/listings?type=listing&limit=${limit}`;
  const response = await fetch(URL);
  const listings: any = await response.json();
  const assets: Asset[] = [];
  await Promise.all(listings.map(async (listing:any) => {
    const asset = listingToAsset(listing); 
    if(asset == undefined) return;
    asset.lastPrice = listing.marketActivity.algoAmount;
    asset.forSale = true;
    assets.push(asset);
  }));
  return assets;
}

function listingToAsset(listing: any) : Asset | undefined {
  const marketActivity = listing.marketActivity;
  const assetInformation = listing.assetInformation;

  if(!isValidAssetData(listing)) return undefined;

  const asset = assetFromJSON(assetInformation.SK, assetInformation, marketActivity, 0);
  if(asset.combat == undefined || asset.luck == undefined 
    || asset.plunder == undefined || asset.constitution == undefined)
    return undefined;
  return asset;
}