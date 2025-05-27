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
  //현금
  KRW: '현금',
  USD: '달러',
  //주식
  KOREAN_STOCK: '국내주식',
  FOREIGN_STOCK: '해외주식',
  //금
  GOLD: '금',
  //코인
  BITCOIN: '비트코인',
  ETHEREUM: '이더리움',
} as const;

export type InvestmentType =
  (typeof InvestmentType)[keyof typeof InvestmentType];

// ✅ 통화 타입 객체 + 타입
export const CurrencyType = {
  KRW: 'KRW',
  USD: 'USD',
  BTC: 'BTC',
  ETH: 'ETH',
} as const;

export type CurrencyType = (typeof CurrencyType)[keyof typeof CurrencyType];

// ✅ 자산 위치별 매핑
export type InvestmentMap = Record<string, AssetRecord[]>;

export const InvestmentToAssetMap: Record<InvestmentType, AssetType> = {
  // 현금 계열
  현금: AssetType.CASH,
  달러: AssetType.CASH,

  // 주식
  국내주식: AssetType.STOCK,
  해외주식: AssetType.STOCK,

  // 금
  금: AssetType.GOLD,

  // 코인
  비트코인: AssetType.COIN,
  이더리움: AssetType.COIN,
};
export type AssetRecord = {
  type: InvestmentType;
  currency: CurrencyType;
  amount?: number; // ✅ 템플릿에선 undefined, 월간에선 사용됨
};
// ✅ Select 등에 쓰일 리스트 형태
export const ASSET_TYPE_LIST = Object.values(AssetType);
export const INVESTMENT_TYPE_LIST = Object.values(InvestmentType);
export const CURRENCY_TYPE_LIST = Object.values(CurrencyType);
