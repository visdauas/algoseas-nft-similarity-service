import fetch, { Body } from 'node-fetch';
import { AssetSalesDBEntry } from '../types';

async function getEveryTransactionFromAsset(assetId: number, txnID: string) : Promise<any> {
  const URL = `${process.env.ALGOINDEXER_URL}/assets/${assetId}/transactions`;
  let transactions = [];
  while(transactions.length == 0) {
    try{
      const response = await fetch(URL);
      const data = await response.json();
      if(data.transactions != undefined)
        transactions = data;
    } catch (_) { }
  }

  let trx: any[] = transactions.transactions;

  for(const t of trx) {
    if(t.id == txnID) return trx;
  }

  while(transactions['next-id'] != undefined) {
    const URL = `${process.env.ALGOINDEXER_URL}/assets/${assetId}/transactions?next=${transactions['next-id']}`;
    const newResponse: any = await fetch(URL);
    transactions = await newResponse.json();
    trx = trx.concat(...transactions.transactions);
  }

  return trx;
}

async function getTransactions(assetId: number, price: number, txnID: string) : Promise<AssetSalesDBEntry> {
  const transactions = await getEveryTransactionFromAsset(assetId, txnID);
  let round = 0;
  let flag = false;
  let note = '';
  for(const txn of transactions) {
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

  const sales: AssetSalesDBEntry = {
    assetId,
    statVector,
    price,
    round,
    txId: txnID
  };
  return sales;
}

export async function getSold(limit = 10) : Promise<AssetSalesDBEntry[]> {
  let URL = `${process.env.PIRATE_API_URL}/prod/marketplace/sales?collectionName=AlgoSeas%20Pirates&sortBy=time&sortAscending=false`;
  if(limit > 0)
    URL += `&limit=${limit}`;
  const response = await fetch(URL);
  const sold: any = await response.json();
  console.log("Loaded sales ids");
  const sales: AssetSalesDBEntry[] = [];
  for(const soldData of sold) {
    const assetId = soldData.assetInformation.SK;
    const price = soldData.marketActivity.algoAmount;
    sales.push(await getTransactions(assetId, price, soldData.marketActivity.txnID));
    console.log(sales.length + ' / ' + sold.length);
  }
  return sales;
}

export async function indexSold() : Promise<AssetSalesDBEntry[]> {
  return await getSold(-1);
}