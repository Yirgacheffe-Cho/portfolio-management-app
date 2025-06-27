import { type TickerItem } from '@/types/stock';
import type { ChatMessage } from '@/store/chat/chatAtoms';
export async function fetchGeminiInsight(prompt: string): Promise<string> {
  try {
    if (prompt.length > 10000) {
      return '⚠️ 프롬프트가 너무 깁니다.';
    }

    const res = await fetch(
      'https://vercel-api-yirgacheffe-chos-projects.vercel.app/api/gemini',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      },
    );

    if (!res.ok) {
      console.error('❌ Gemini API 응답 오류:', res.status);
      return `❌ Gemini API 오류 (${res.status})`;
    }

    const text = await res.text();
    return text ?? '❌ 분석 실패 (빈 응답)';
  } catch (err) {
    console.error('[fetchGeminiInsight] 예외 발생:', err);
    return '❌ Gemini 호출 중 네트워크 오류 발생';
  }
}
export async function fetchGeminiStockInfo(
  stockInfo: TickerItem,
): Promise<string> {
  try {
    const res = await fetch(
      'https://vercel-api-yirgacheffe-chos-projects.vercel.app/api/stock-info',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockInfo }), // ✅ 수정
      },
    );

    if (!res.ok) {
      console.error('❌ Gemini API 응답 오류:', res.status);
      return `❌ Gemini API 오류 (${res.status})`;
    }

    const text = await res.text();
    return text ?? '❌ 분석 실패 (빈 응답)';
  } catch (err) {
    console.error('[fetchGeminiStockInfo] 예외 발생:', err);
    return '❌ Gemini 호출 중 네트워크 오류 발생';
  }
}
export async function fetchGeminiWithMessages(
  messages: ChatMessage[],
  stockData: string | null, // Added parameter for stock data
): Promise<string> {
  try {
    const res = await fetch(
      'https://vercel-api-yirgacheffe-chos-projects.vercel.app/api/gemini-chat',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          stockData: stockData || '', // ✨ Pass the stockData here. Ensure it's never null/undefined if you want it always sent.
        }),
      },
    );

    if (!res.ok) {
      console.error('❌ Gemini Chat API 오류:', res.status);
      return `❌ Gemini API 오류 (${res.status})`;
    }

    const text = await res.text();
    return text ?? '❌ 분석 실패 (빈 응답)';
  } catch (err) {
    console.error('[fetchGeminiWithMessages] 예외 발생:', err);
    return '❌ Gemini 호출 중 네트워크 오류 발생';
  }
}
