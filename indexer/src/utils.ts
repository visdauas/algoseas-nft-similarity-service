import { Asset, AssetDBEntry, AssetSalesDBEntry, StatWeights } from './types';

export function convertAssetToDBEntry(asset: Asset): AssetDBEntry {
  const dbEntry: AssetDBEntry = {
    assetId: asset.assetId,
    statVector: [asset.combat, asset.constitution, asset.luck, asset.plunder],
    combat: asset.combat,
    constitution: asset.constitution,
    luck: asset.luck,
    plunder: asset.plunder,
    forSale: asset.forSale,
    price: asset.price,
  };
  return dbEntry;
}

export function applyWeightsToAssetDBEntry(
  asset: AssetDBEntry,
  weights: StatWeights,
): AssetDBEntry {
  const weightedStatVector = [
    asset.combat * weights.combat,
    asset.constitution * weights.constitution,
    asset.luck * weights.luck,
    asset.plunder * weights.plunder,
  ];
  asset.statVector = weightedStatVector;

  asset.combat = weightedStatVector[0];
  asset.constitution = weightedStatVector[1];
  asset.luck = weightedStatVector[2];
  asset.plunder = weightedStatVector[3];

  return asset;
}

export function applyWeightsToAssetSalesDBEntry(
  asset: AssetSalesDBEntry,
  weights: StatWeights,
): AssetSalesDBEntry {
  const weightedStatVector = [
    asset.combat * weights.combat,
    asset.constitution * weights.constitution,
    asset.luck * weights.luck,
    asset.plunder * weights.plunder,
  ];
  asset.statVector = weightedStatVector;

  asset.combat = weightedStatVector[0];
  asset.constitution = weightedStatVector[1];
  asset.luck = weightedStatVector[2];
  asset.plunder = weightedStatVector[3];

  return asset;
}

export function schemaToEmbeddings(schema: any): string[] {
  const embeddings = schema.map((field: any) => {
    return field.name;
  });
  return embeddings;
}
