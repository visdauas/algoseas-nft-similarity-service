import fetch from 'node-fetch';

async function assetIdsFromIndex(next: number) : Promise<number[]> {
  const ids: number[] = [];
  const URL = `${process.env.ALGOINDEXER_URL}/assets?unit=PIRATE&next=${next}`;
  const response = await fetch(URL);
  const assets: any = await response.json();
  await Promise.all((assets.assets).map(async (asset: any)  => {
    ids.push(asset.index);
  }));
  return ids;
};

export async function getAssetIds() : Promise<number[]> {
  let ids: number[] = [];
  ids = ids.concat(await assetIdsFromIndex(0));
  while(ids.at(-1) && ids.at(-1) !== 0) {
    const idList = await assetIdsFromIndex(ids.at(-1)!)
    if(idList.length === 0) break;
    ids = ids.concat(idList);
    console.log(ids.length);
  }
  return ids;
};