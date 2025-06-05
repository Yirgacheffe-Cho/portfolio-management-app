export interface TickerItem {
  symbol: string;
  name: string;
  country: 'US' | 'KR';
  type?: string; // 종목 유형 (예: Equity)
}
