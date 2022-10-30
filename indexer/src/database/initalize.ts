import { createCollection } from './collection';
import { ASSETS_AND_LISTINGS_SCHEMA, SALES_SCHEMA } from './schema';

export async function initalizeDatabase() {
  await createCollection('algoseas_pirates', ASSETS_AND_LISTINGS_SCHEMA);
  await createCollection('algoseas_pirates_sales', SALES_SCHEMA);

  console.log('initalized');
}
