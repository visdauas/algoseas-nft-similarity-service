import fetch from 'node-fetch';
import { Asset } from '../types';
import { isValidAssetData } from './assets';

export async function getLastAssets(limit: number) {
  const URL = `${process.env.PIRATE_API_URL}/prod/marketplace/v2/assetsByCollection/AlgoSeas%20Pirates?type=collection&sortBy=assetID&sortAscending=false&limit=${limit}`;
  const response = await fetch(URL, {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
  const data = await response.json();
  const assets: Asset[] = [];
  for (const asset of data.assets) {
    if (!isValidAssetData(asset)) continue;
    const newAsset: Asset = {
      assetId: asset.assetInformation.SK,
      combat: asset.assetInformation.nProps.properties.combat,
      constitution: asset.assetInformation.nProps.properties.constitution,
      luck: asset.assetInformation.nProps.properties.luck,
      plunder: asset.assetInformation.nProps.properties.plunder,
      price: 0,
      forSale: false,
    };
    assets.push(newAsset);
  }
  return assets;
}
