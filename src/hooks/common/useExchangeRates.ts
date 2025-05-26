import { useQuery } from '@tanstack/react-query';
import {
  fetchExchangeRates,
  fetchCryptoPrices,
} from '@/services/exchangeService';

/**
 * 📈 useExchangeRates
 * - USD 환율 + 암호화폐 시세 (BTC, ETH) 조회
 */
export function useExchangeRates() {
  const { data: usdToKrw, isLoading: usdLoading } = useQuery({
    queryKey: ['usd-krw'],
    queryFn: fetchExchangeRates,
  });

  const { data: cryptoPrices, isLoading: cryptoLoading } = useQuery({
    queryKey: ['crypto-krw'],
    queryFn: fetchCryptoPrices,
  });

  return {
    usdToKrw,
    cryptoPrices,
    isLoading: usdLoading || cryptoLoading,
  };
}
