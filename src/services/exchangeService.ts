// services/exchangeService.ts

export async function fetchExchangeRates(date: string): Promise<number> {
  const correctedDate = isFutureDate(date) ? getTodayString() : date;
  const formatted = formatDateForFrankfurter(correctedDate);

  try {
    const res = await fetch(
      `https://api.frankfurter.app/${formatted}?from=USD&to=KRW`,
    );
    if (!res.ok) throw new Error('Frankfurter API 실패');

    const data = await res.json();
    return data.rates.KRW ?? 0;
  } catch (error) {
    console.error('[환율 API 실패]', error);
    return 0;
  }
}

export async function fetchCryptoPrices(
  date: string,
): Promise<{ BTC: number; ETH: number }> {
  const todayStr = getTodayString();
  const correctedDate = isFutureDate(date) ? todayStr : date;

  try {
    if (correctedDate === todayStr) {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=krw',
      );
      if (!res.ok) throw new Error('Simple Price API 실패');

      const data = await res.json();
      return {
        BTC: data.bitcoin?.krw ?? 0,
        ETH: data.ethereum?.krw ?? 0,
      };
    } else {
      const formatted = formatDateForCoingecko(correctedDate);
      const [btcRes, ethRes] = await Promise.all([
        fetch(
          `https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${formatted}`,
        ),
        fetch(
          `https://api.coingecko.com/api/v3/coins/ethereum/history?date=${formatted}`,
        ),
      ]);

      if (!btcRes.ok || !ethRes.ok) throw new Error('History API 실패');

      const btc = await btcRes.json();
      const eth = await ethRes.json();

      return {
        BTC: btc?.market_data?.current_price?.krw ?? 0,
        ETH: eth?.market_data?.current_price?.krw ?? 0,
      };
    }
  } catch (error) {
    console.error('[코인 가격 조회 실패]', error);
    return { BTC: 0, ETH: 0 };
  }
}

// 📌 유틸 함수들

export function getTodayString(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

export function formatDateForFrankfurter(yyyymmdd: string): string {
  if (yyyymmdd.length !== 8) throw new Error('날짜 형식 오류 (Frankfurter)');
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}

export function formatDateForCoingecko(yyyymmdd: string): string {
  if (yyyymmdd.length !== 8) throw new Error('날짜 형식 오류 (Coingecko)');
  return `${yyyymmdd.slice(6, 8)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(0, 4)}`;
}

export function isFutureDate(dateStr: string): boolean {
  if (dateStr.length !== 8) return false;

  const input = new Date(
    Number(dateStr.slice(0, 4)),
    Number(dateStr.slice(4, 6)) - 1,
    Number(dateStr.slice(6, 8)),
  );
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return input.getTime() > today.getTime();
}
