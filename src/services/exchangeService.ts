// services/exchangeService.ts
export async function fetchExchangeRates() {
  const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=KRW');

  const data = await res.json();
  return data.rates.KRW;
}

export async function fetchCryptoPrices() {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=krw',
  );
  const data = await res.json();
  return {
    BTC: data.bitcoin.krw,
    ETH: data.ethereum.krw,
  };
}
