// src/types/asset.ts

// ✅ 자산 분류용 객체 + 타입
export const AssetType = {
  CASH: '현금',
  STOCK: '주식',
  COIN: '코인',
  GOLD: '금',
} as const;

export type AssetType = (typeof AssetType)[keyof typeof AssetType];

// ✅ 실제 투자 항목용 객체 + 타입
export const InvestmentType = {
  CASH: '현금',
  KOREAN_STOCK: '국내주식',
  FOREIGN_STOCK: '해외주식',
  GOLD: '금',
  BITCOIN: '비트코인',
  ETHEREUM: '이더리움',
  USD: '달러',
} as const;

export type InvestmentType =
  (typeof InvestmentType)[keyof typeof InvestmentType];

// ✅ 통화 타입 객체 + 타입
export const CurrencyType = {
  KRW: 'KRW',
  USD: 'USD',
  BTC: 'BTC',
} as const;

export type CurrencyType = (typeof CurrencyType)[keyof typeof CurrencyType];

// ✅ 개별 투자 항목 구조
export type InvestmentItem = {
  type: InvestmentType;
  currency: CurrencyType;
};

// ✅ 자산 위치별 매핑
export type InvestmentMap = Record<string, InvestmentItem[]>;

// ✅ Select 등에 쓰일 리스트 형태
export const ASSET_TYPE_LIST = Object.values(AssetType);
export const INVESTMENT_TYPE_LIST = Object.values(InvestmentType);
export const CURRENCY_TYPE_LIST = Object.values(CurrencyType);
