// types/asset.ts

export enum AssetType {
  // 🔸 전통 자산
  CASH = '현금',
  STOCK = '주식',
  COIN = '코인',
  GOLD = '금',
}

export const ASSET_TYPE_LIST = Object.values(AssetType);
