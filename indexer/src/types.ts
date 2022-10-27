export type AssetDBEntry = {
  assetId: number;
  statVector: number[];
  combat: number;
  constitution: number;
  luck: number;
  plunder: number;
  forSale: boolean;
  lastPrice: number;
  lastSoldRound: number;
};
