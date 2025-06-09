// utils/generateManualPrompt.ts
import { type TickerItem } from '@/types/stock';

/**
 * Perplexity 등 외부 분석 도구에서 사용할 JSON 프롬프트 생성기
 * @param stockInfo - 종목 정보
 * @returns JSON 형태의 분석 요청 프롬프트
 */
export function generateManualPrompt(stockInfo: TickerItem): object {
  const { symbol, country, name } = stockInfo;
  const unit = country === 'US' ? '억달러' : '억원';

  return {
    request_type: '주식정보조회',
    stock_info: {
      ticker: symbol,
      market_country: country,
      company_name: name || '',
    },
    data_requests: {
      news: {
        enabled: true,
        period: '최근 6개월',
        limit: 10,
        details: [
          '요약문 (핵심 내용을 1~2문장으로 요약)',
          '긍정/부정 영향 (주가 및 기업 가치에 미치는 영향 위주로)',
          '출처 (언론사명, 기사 제목, 발행일, URL 또는 공시 정보)',
          '업황/고객사 연관성 (기업의 사업에 미치는 구체적인 영향)',
        ],
        source_priority: ['공식 언론 기사', '기업 공시 자료'],
      },
      financial_statements: {
        enabled: true,
        period: '최근 2년',
        granularity: '분기',
        metrics: ['매출액', '영업이익', '순이익'],
        include_comparisons: ['YoY', 'QoQ'],
        include_estimates: true,
        unit,
        source_guidance:
          '모든 재무 데이터는 출처 (예: FnGuide, Bloomberg, 기업 공식 IR 자료)를 명확히 명시하고, 각 수치에 대한 기준 시점 (예: 2024년 4분기 확정, 2025년 1분기 추정)을 기재하십시오. 추정치일 경우 근거와 함께 실제 실적과 다를 수 있음을 명확히 고지하십시오.',
      },
      analyst_reports: {
        enabled: true,
        period: '최근 6개월',
        limit: 5,
        details: [
          '증권사 이름',
          '애널리스트 이름',
          '리포트 발행일',
          '투자 의견',
          '목표주가',
          '주요 논점 (투자 의견 변화에 영향을 미친 긍정/부정 요인)',
          '이익 추정치 변화',
          '업황 분석 (산업 사이클, 성장 전망 등 핵심 내용)',
        ],
        source_guidance:
          '각 리포트별로 리포트명, 출처 (증권사명, 발행일), 애널리스트 이름을 명확히 기재하십시오. 투자 의견 및 목표주가는 해당 리포트의 유효 시점을 명시하고, 가급적 원문 확인이 가능한 URL 또는 고유 식별 정보를 포함해 주세요.',
      },
      market_data: {
        enabled: true,
        details: ['현재 주가'],
        source_guidance:
          '가장 최근의 시장 데이터 출처와 기준 시점을 명시하십시오.',
      },
    },
    response_guidance: {
      language: 'ko',
      format: 'Markdown',
      tone: '명확하고 전문적인',
      reliability_guarantees: [
        '제공되는 모든 정보는 명시된 출처를 기반으로 함',
        '뉴스/리포트 요약 시 원문 의미 왜곡 없음',
        '추정치 데이터는 실제와 다를 수 있음을 명시',
        '확인되지 않은 정보/소문 배제',
      ],
    },
  };
}
