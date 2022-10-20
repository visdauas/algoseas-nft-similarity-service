import fetch from 'node-fetch';

export interface Asset {
  assetId: number,
  combat: number,
  constitution: number,
  luck: number,
  plunder: number,
  forSale: boolean,
  lastPrice: number,
  lastSoldRound: number,
};

function assetFromJSON(assetId: number, assetInformation: any, marketActivity: any = null, lastSoldRound: number): Asset {
  const hasMarketActivity = marketActivity != null
  const asset: Asset = {
    assetId: assetId,
    combat: assetInformation.nProps.properties.combat,
    constitution: assetInformation.nProps.properties.constitution,
    luck: assetInformation.nProps.properties.luck,
    plunder: assetInformation.nProps.properties.plunder,
    forSale: hasMarketActivity ? marketActivity.event.includes('ACTIVE_LISTING') : false,
    lastPrice: hasMarketActivity ? marketActivity.algoAmount : 0,
    lastSoldRound
  };
  return asset;
}

export async function getAsset(assetId: number) : Promise<Asset> {
  const URL = `https://d3ohz23ah7.execute-api.us-west-2.amazonaws.com/prod/marketplace/asset/${assetId}`;
  const response = await fetch(URL);
  const assetInformation: any = await response.json();
  if(assetInformation.marketActivity == undefined) {
    return assetFromJSON(assetId, assetInformation.assetInformation, null, 0);
  }
  const TRX_URL = `https://algoindexer.algoexplorerapi.io/v2/assets/${assetId}/transactions`;
  const trxResponse = await fetch (TRX_URL);
  const trxInformation: any = await trxResponse.json();
  if(trxInformation.transactions == undefined) {
    return assetFromJSON(assetId, assetInformation.assetInformation, assetInformation.marketActivity[0], 0);
  }
  return assetFromJSON(assetId, assetInformation.assetInformation, assetInformation.marketActivity[0], trxInformation.transactions[0].confirmedRound);
};