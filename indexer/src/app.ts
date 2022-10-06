/**
 * The following lines intialize dotenv,
 * so that env vars from the .env file are present in process.env
 */
import * as dotenv from 'dotenv';
dotenv.config();

import { initDatabase } from './databaseTest.js';

export const sum = (a: number, b: number): number => {
  return a + b;
};

await initDatabase();
