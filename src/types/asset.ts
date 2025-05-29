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
  KRW: '원화',
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

export type InvestmentMap = Record<string, AssetRecord[]>;

export const InvestmentToAssetMap: Record<InvestmentType, AssetType> = {
  // 현금 계열
  원화: AssetType.CASH,
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
export const ASSET_SNAP_CATEGORIES = [
  '현금',
  '국내주식',
  '해외주식',
  '코인',
  '금',
] as const;

export type AssetSnapCategory = (typeof ASSET_SNAP_CATEGORIES)[number];
export const InvestmentToSnapMap: Record<InvestmentType, AssetSnapCategory> = {
  원화: '현금',
  달러: '현금',
  국내주식: '국내주식',
  해외주식: '해외주식',
  금: '금',
  비트코인: '코인',
  이더리움: '코인',
};
export type AssetRecord = {
  type: InvestmentType;
  currency: CurrencyType;
  amount?: number; // ✅ 템플릿에선 undefined, 월간에선 사용됨
};
// 통화 제한 맵핑: 투자 유형 → 허용 통화 목록
export const InvestmentCurrencyOptionsMap: Record<
  InvestmentType,
  CurrencyType[]
> = {
  원화: ['KRW'],
  달러: ['USD'],
  국내주식: ['KRW'],
  해외주식: ['KRW', 'USD'],
  금: ['KRW', 'USD'],
  비트코인: ['KRW', 'USD', 'BTC'],
  이더리움: ['KRW', 'USD', 'ETH'],
};
// ✅ Select 등에 쓰일 리스트 형태
export const ASSET_TYPE_LIST = Object.values(AssetType);
export const INVESTMENT_TYPE_LIST = Object.values(InvestmentType);
export const CURRENCY_TYPE_LIST = Object.values(CurrencyType);
