import { generateAnalysisReportPrompt } from './generateAnalysisReportPrompt';
import { type TickerItem } from '@/types/stock';

/**
 * 🧠 최종 프롬프트 생성기
 * - 수집된 정보(JSON 텍스트)를 바탕으로, Gemini에게 분석 요청을 구성합니다.
 * @param collectedData - Perplexity 등으로부터 받은 응답 (텍스트 or JSON string)
 * @param stockInfo - 분석 대상 종목 정보
 * @returns 최종 프롬프트 문자열 (Gemini에게 직접 보낼 text)
 */
export function createFinalPrompt(
  collectedData: string,
  stockInfo: TickerItem,
): string {
  const analysisPrompt = generateAnalysisReportPrompt(stockInfo);

  return `
당신은 주식 분석 전문가입니다.
아래는 "${stockInfo.name}"(${stockInfo.symbol}) 종목에 대한 수집된 정보이며, 이 정보를 바탕으로 심층적인 분석 리포트를 작성해야 합니다.

아래의 JSON은 수집된 원본 정보이며, 정확하게 반영된 내용을 기반으로 분석을 작성하십시오.
\`\`\`json
${collectedData}
\`\`\`

또한, 분석은 다음 지침을 따르십시오:
\`\`\`json
${JSON.stringify(analysisPrompt, null, 2)}
\`\`\`

⚠️ 주의: 출처 기반의 분석을 수행하고, 주관적 예측보다는 객관적인 정보 요약과 구조화된 해석을 제공합니다.
`.trim();
}
