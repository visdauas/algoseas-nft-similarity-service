import fetch from 'node-fetch';
import { Asset } from '../types';

export function assetFromJSON(assetId: number, assetInformation: any, marketActivity: any = null): Asset {
  const hasMarketActivity = marketActivity != null
  const asset: Asset = {
    assetId: assetId,
    combat: assetInformation.nProps.properties.combat,
    constitution: assetInformation.nProps.properties.constitution,
    luck: assetInformation.nProps.properties.luck,
    plunder: assetInformation.nProps.properties.plunder,
    forSale: hasMarketActivity ? marketActivity.event.includes('ACTIVE_LISTING') : false,
    price: hasMarketActivity ? marketActivity.algoAmount : 0,
  };
  return asset;
}

export async function getAsset(assetId: number) : Promise<Asset | undefined> {
  const URL = `${process.env.PIRATE_API_URL}/prod/marketplace/asset/${assetId}`;
  const response = await fetch(URL);
  const assetInformation: any = await response.json();

  if(!isValidAssetData(assetInformation)) return undefined;

  if(assetInformation.marketActivity == undefined) {
    return assetFromJSON(assetId, assetInformation.assetInformation, null);
  }
  const TRX_URL = `${process.env.ALGOINDEXER_URL}/assets/${assetId}/transactions`;
  const trxResponse = await fetch (TRX_URL);
  const trxInformation: any = await trxResponse.json();
  if(trxInformation.transactions == undefined) {
    return assetFromJSON(assetId, assetInformation.assetInformation, assetInformation.marketActivity[0]);
  }
  const lastSoldRound = trxInformation.transactions[0].confirmedRound == undefined ? 0 : trxInformation.transactions[0].confirmedRound;
  return assetFromJSON(assetId, assetInformation.assetInformation, assetInformation.marketActivity[0]);
}

export function isValidAssetData(assetInformation: any) : boolean {
 if(
    assetInformation.assetInformation.nProps == undefined ||
    assetInformation.assetInformation.nProps.properties == undefined ||
    assetInformation.assetInformation.nProps.properties.luck == undefined ||
    assetInformation.assetInformation.nProps.properties.constitution == undefined ||
    assetInformation.assetInformation.nProps.properties.luck == undefined ||
    assetInformation.assetInformation.nProps.properties.plunder == undefined
  ) return false;
  return true;
}