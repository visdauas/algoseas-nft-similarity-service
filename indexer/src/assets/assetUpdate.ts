import fetch from 'node-fetch';

export async function getLastUpdates(limit: number = 10) {
  const URL = `${process.env.ALGOINDEXER_URL}/accounts/SEASZVO4B4DC3F2SQKQVTQ5WXNVQWMCIPFPWTNQT3KMUX2JEGJ5K76ZC4Q/transactions?limit=${limit}`;
  const response = await fetch(URL);
  const transactions: any = await response.json();
  await Promise.all((transactions.transactions).map(async (trx: any) => {
    if(trx.note != undefined) {
      const assetId = trx['asset-config-transaction']['asset-id'];
      const b64Buffer = Buffer.from(trx.note, 'base64');
      try {
        const trxNote = JSON.parse(b64Buffer.toString('utf-8'));
        console.log(trxNote);
      } catch {
        console.log(`ERR: ${b64Buffer.toString('utf-8')}`);
      }
    }
  }));
}