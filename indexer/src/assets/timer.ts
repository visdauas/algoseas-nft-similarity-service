import fetch from 'node-fetch';
import { getLastUpdates } from './assetUpdate';

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
    lastRound++;
    await getLastUpdates(lastRound);
  }
}