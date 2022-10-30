import fetch from 'node-fetch';
import { Asset } from '../types';
import { isValidAssetData } from './assets';

async function createAssets(assetsInformation: any) : Promise<Asset[]> {
  const assets: Asset[] = [];
  await Promise.all(assetsInformation.map(async (assetInformation:any) => {
    if(isValidAssetData(assetInformation)) {
      const marketActivity = assetInformation.marketActivity;
      assetInformation = assetInformation.assetInformation;
      const a: Asset = {
        assetId: assetInformation.SK,
        combat: assetInformation.nProps.properties.combat,
        luck: assetInformation.nProps.properties.luck,
        constitution: assetInformation.nProps.properties.constitution,
        plunder: assetInformation.nProps.properties.plunder,
        forSale: marketActivity ? true : false,
        price: marketActivity ? marketActivity.algoAmount : 0,
      };
      assets.push(a);
    }
  }));
  return assets;
}

async function getAssets(limit = 100): Promise<Asset[]> {
  const assets: Asset[] = [];
  let URL = `${process.env.PIRATE_API_URL}/prod/marketplace/v2/assetsByCollection/AlgoSeas%20Pirates?type=collection&sortBy=assetID&sortAscending=false&limit=${limit}`;

  const response = await fetch(URL, {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
  let data: any = await response.json();
  assets.push(...(await createAssets(data.assets)));

  while(data.nextToken != undefined) {
    let nextUrl = `${URL}&nextToken=${data.nextToken}`;
    const response = await fetch(nextUrl, {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    data = await response.json();
    assets.push(...(await createAssets(data.assets)));
    console.log(assets.length);
  }
  return assets;
}

export async function getEveryAsset(): Promise<Asset[]> {
  const assets = await getAssets(1000);
  console.log(assets.length);
  return assets;
}