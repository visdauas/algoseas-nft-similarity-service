import { dropCollection, loadCollection } from './database/manage';
import { fillDummy } from './database/fillDummy';
import { initalizeDatabase } from './database/initalize';
import { indexData } from './database/indexData';

export async function testDatabase() {
  await dropCollection('algoseas_pirates');
  await initalizeDatabase();
  await fillDummy();
  await loadCollection('algoseas_pirates');
  await indexData();
}
