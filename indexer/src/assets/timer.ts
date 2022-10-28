import fetch from 'node-fetch';
import { getLastUpdates, getLastSold } from './assetUpdate';
import { getNListings, updateDatabase } from './listings';

async function getLastRound() : Promise<number> {
  const URL = `${process.env.ALGOEXPLORER_URL}/status`;
  const response = await fetch(URL);
  const data = await response.json();
  return data['last-round'];
}

export async function waitForBlock() {
  let lastRound = await getLastRound();
  while(true) {
    const URL = `${process.env.ALGOEXPLORER_URL}/status/wait-for-block-after/${lastRound}`;
    await fetch(URL);
    await getLastUpdates(lastRound);
    await getLastSold(10);
    await updateDatabase(10);
    lastRound++;
  }
}