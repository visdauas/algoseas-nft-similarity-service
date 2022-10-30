import { config } from 'dotenv';
import fetch from 'node-fetch';
import { Asset } from '../types';
import { getAsset } from './assets';

async function configChange(trx: any) : Promise<Asset | undefined> {
  const assetId = trx['asset-config-transaction']['asset-id'];
  const asset = await getAsset(assetId);
  if(asset == undefined) return undefined;
  const b64Buffer = Buffer.from(trx.note, 'base64');
  const trxNote = JSON.parse(b64Buffer.toString('utf-8'));
  asset.combat = trxNote.properties.combat;
  asset.constitution = trxNote.properties.constitution;
  asset.luck = trxNote.properties.luck;
  asset.plunder = trxNote.properties.plunder;
  return asset;
}

//https://developer.algorand.org/docs/get-details/indexer/#transaction-type
export async function getLastUpdates(minRound: number) {
  const URL = `${process.env.ALGOINDEXER_URL}/accounts/SEASZVO4B4DC3F2SQKQVTQ5WXNVQWMCIPFPWTNQT3KMUX2JEGJ5K76ZC4Q/transactions?min-round=${minRound}`;
  const response = await fetch(URL);
  const transactions: any = await response.json();
  await Promise.all((transactions.transactions).map(async (trx: any) => {
    if(trx['tx-type'] == 'acfg') {
      console.log(await configChange(trx));
    }
  }));
}

export async function getLastSold(limit: number) {
  const URL =  `${process.env.PIRATE_API_URL}/prod/marketplace/sales?collectionName=AlgoSeas%20Pirates&sortBy=time&sortAscending=false&limit=${limit}`;
  const response = await fetch(URL);
  const sold: any = await response.json();
  await Promise.all(sold.map(async (soldData:any) => {
    const asset = await getAsset(soldData.assetInformation.SK);
    if(asset == undefined) return;
    asset.price = soldData.marketActivity.algoAmount;
    asset.forSale = false;
    console.log(asset);
  }));
}