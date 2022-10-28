import { Asset, AssetDBEntry } from 'types';

export function convertAssetToDBEntry(asset: Asset) : AssetDBEntry {
 const dbEntry: AssetDBEntry = {
    assetId: asset.assetId,
    statVector: [asset.combat, asset.constitution, asset.luck, asset.plunder],
    combat: asset.combat,
    constitution: asset.constitution,
    luck: asset.luck,
    plunder: asset.plunder,
    forSale: asset.forSale,
    lastPrice: asset.lastPrice,
    lastSoldRound: asset.lastSoldRound,
  };
  return dbEntry;
}