import { config } from 'dotenv';
import fetch from 'node-fetch';
import { Asset, getAsset } from './assets'

async function configChange(trx: any) : Promise<Asset> {
  const assetId = trx['asset-config-transaction']['asset-id'];
  let asset = await getAsset(assetId);
  const b64Buffer = Buffer.from(trx.note, 'base64');
  const trxNote = JSON.parse(b64Buffer.toString('utf-8'));
  asset.combat = trxNote.properties.combat,
  asset.constitution = trxNote.properties.constitution,
  asset.luck = trxNote.properties.luck,
  asset.plunder = trxNote.properties.plunder
  return asset;
}

//https://developer.algorand.org/docs/get-details/indexer/#transaction-type
export async function getLastUpdates(limit: number = 10) {
  const URL = `${process.env.ALGOINDEXER_URL}/accounts/SEASZVO4B4DC3F2SQKQVTQ5WXNVQWMCIPFPWTNQT3KMUX2JEGJ5K76ZC4Q/transactions?limit=${limit}`;
  const response = await fetch(URL);
  const transactions: any = await response.json();
  await Promise.all((transactions.transactions).map(async (trx: any) => {
    if(trx['tx-type'] == 'acfg') {
      console.log(await configChange(trx));
    }
 }));
}