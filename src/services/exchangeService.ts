// services/exchangeService.ts
export async function fetchExchangeRates(date: string) {
  const formatted = formatDateForFrankfurter(date); // '2024-05-31'
  const res = await fetch(
    `https://api.frankfurter.app/${formatted}?from=USD&to=KRW`,
  );
  const data = await res.json();
  return data.rates.KRW;
}

export async function fetchCryptoPrices(date: string) {
  const todayStr = getTodayString(); // '20240531'
  if (date === todayStr) {
    // ✅ 오늘 날짜일 경우 → simple/price 사용
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=krw',
    );
    const data = await res.json();
    return {
      BTC: data.bitcoin.krw,
      ETH: data.ethereum.krw,
    };
  } else {
    // ✅ 과거 날짜일 경우 → history API 사용
    const formatted = formatDateForCoingecko(date); // '31-05-2024'

    const [btcRes, ethRes] = await Promise.all([
      fetch(
        `https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${formatted}`,
      ),
      fetch(
        `https://api.coingecko.com/api/v3/coins/ethereum/history?date=${formatted}`,
      ),
    ]);

    const btc = await btcRes.json();
    const eth = await ethRes.json();

    return {
      BTC: btc?.market_data?.current_price?.krw ?? 0,
      ETH: eth?.market_data?.current_price?.krw ?? 0,
    };
  }
}

// 📌 유틸 함수들
function getTodayString(): string {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}
function formatDateForFrankfurter(yyyymmdd: string) {
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}
function formatDateForCoingecko(yyyymmdd: string): string {
  return `${yyyymmdd.slice(6, 8)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(0, 4)}`;
}
