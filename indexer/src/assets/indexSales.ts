import fetch from 'node-fetch';
import { AssetSalesDBEntry } from '../types';

let succ = 0;
let err  = 0;

async function getEveryTransactionFromAsset(assetId: number) : Promise<any> {
  const URL = `${process.env.ALGOINDEXER_URL}/assets/${assetId}/transactions`;
  let transactions = [];
  while(transactions.length == 0) {
    try{
      const response = await fetch(URL);
      transactions = await response.json();
    } catch (_) {
      setTimeout(() => {}, 5000);
    }
  }

  const trx: any[] = transactions;

  while(transactions['next-id'] != undefined) {
    const URL = `${process.env.ALGOINDEXER_URL}/assets/${assetId}/transactions?next=${transactions['next-id']}`;
    const newResponse = await fetch(URL);
    const newTransactions = await newResponse.json();
    trx.concat(...newTransactions);
  }
  return trx;
}

async function getTransactions(assetId: number, price: number, txnID: string) : Promise<AssetSalesDBEntry> {
  const transactions = await getEveryTransactionFromAsset(assetId);
  let round = 0;
  let flag = false;
  let note = '';
  for(const txn of transactions.transactions) {
    if(txn.id == txnID) {
      round = txn['first-valid'];
      flag = true;
    }
    if(txn['tx-type'] == 'acfg') {
      note = txn.note;
      if(flag == true) break;
    }
  };
  let statVector = [0, 0, 0, 0];
  if(note != '') {
    const b = Buffer.from(note, 'base64');
    const data = JSON.parse(b.toString('utf-8'));
    statVector = [
      data.properties.combat,
      data.properties.constitution,
      data.properties.luck,
      data.properties.plunder
    ];
  }
  if(statVector[0] == 0 || statVector[1] == 0 ||
     statVector[2] == 0 || statVector[3] == 0 ) err++;
  if(statVector[0] == undefined || statVector[1] == undefined ||
     statVector[2] == undefined || statVector[3] == undefined ) err++;
  

  else succ++;
  const sales: AssetSalesDBEntry = {
    assetId,
    statVector,
    price,
    round
  };
  return sales;
}

export async function getSold(limit = 10) : Promise<AssetSalesDBEntry[]> {
  let URL = `${process.env.PIRATE_API_URL}/prod/marketplace/sales?collectionName=AlgoSeas%20Pirates&sortBy=time&sortAscending=false`;
  if(limit > 0)
    URL += `&limit=${limit}`;
  const response = await fetch(URL);
  const sold: any = await response.json();
  const sales: AssetSalesDBEntry[] = [];
  for(const soldData of sold) {
    const assetId = soldData.assetInformation.SK;
    const price = soldData.marketActivity.algoAmount;
    sales.push(await getTransactions(assetId, price, soldData.marketActivity.txnID));
    console.log(`${succ} / ${err}`)
  }
  return sales;
}