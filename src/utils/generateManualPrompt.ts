import { type TickerItem } from '@/types/stock';

/**
 * Perplexity 등 외부 분석 도구에서 사용할 JSON 프롬프트 생성기 (압축 버전)
 *
 * 이 프롬프트는 특정 종목의 뉴스, 재무, 애널리스트 리포트, 시장 데이터,
 * 실적 발표 자료 및 거시경제/지정학적 맥락을 요청하여 심층적인 분석을 유도합니다.
 * 정보의 명확성, 출처 명시, 그리고 분석의 전문성을 목표로 합니다.
 *
 * @param stockInfo - 종목 정보 (심볼, 국가, 회사명 포함)
 * @returns JSON 형태의 분석 요청 프롬프트 객체
 */
export function generateManualPrompt(stockInfo: TickerItem): object {
  const { symbol, country, name } = stockInfo;
  const unit = country === 'US' ? '억달러' : '억원'; // 미국 주식은 억달러, 한국 주식은 억원

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
          '제목, 발행일(YYYY-MM-DD), 언론사, 원문 URL',
          '핵심 요약 (3~5문장)',
          '기업 사업/주가/가치 잠재적 영향',
          '관련 업황/고객사 연관성',
        ],
        source_priority: ['공식 언론 기사', '기업 공시 자료'],
        if_no_results:
          '요청된 뉴스가 부족할 경우, 제한된 정보임을 명시하고 산업 전반의 주요 뉴스 포함.',
      },
      financial_statements: {
        enabled: true,
        period: '최근 2년',
        granularity: '분기',
        metrics: [
          '매출액',
          '영업이익',
          '순이익',
          '자산총계',
          '부채총계',
          '자본총계',
          '영업활동 현금흐름',
          '투자활동 현금흐름',
          '재무활동 현금흐름',
        ],
        include_comparisons: ['YoY', 'QoQ'],
        include_estimates: true,
        unit: unit,
        source_guidance: `모든 재무 데이터는 명확한 출처(예: FnGuide, Bloomberg, 기업 IR) 및 기준 시점 명시. 추정치는 기관/리포트 출처와 함께 실제와 다를 수 있음을 명확히 고지. 마크다운 테이블 형태로 제공하며, 모든 숫자에 쉼표와 '${unit}' 단위를 명시.`,
      },
      analyst_reports: {
        enabled: true,
        period: '최근 6개월',
        limit: 5,
        details: [
          '증권사, 애널리스트명, 발행일(YYYY-MM-DD), 리포트명, 원문 URL/식별 정보',
          '투자 의견, 목표주가 (수치 및 제시일자)',
          '주요 논점 요약 (긍정/부정 요인, 100단어 내외)',
          '이익 추정치 변화 (수치 포함)',
          '분석된 업황 (산업 사이클, 기술/경쟁 환경) 요약',
        ],
        source_guidance:
          '각 리포트명, 출처(증권사/발행일), 애널리스트 명시. 투자 의견/목표주가 유효 시점 명시, 가급적 원문 URL 포함. 정보 부재 시 명확히 고지.',
      },
      market_data: {
        enabled: true,
        details: [
          '현재 주가 (수치), 기준 시간 (YYYY-MM-DD HH:MM KST)',
          '전일 대비 등락률 (%), 거래량',
          '52주 최고가, 52주 최저가, 시가총액',
          'PER, PBR, 배당수익률, 베타',
          '과거 1년 일별 주가 (날짜, 시/고/저/종가, 거래량 포함) - 테이블/JSON/CSV',
          '주요 기술적 지표 (50/200 MA, RSI, MACD) 수치 및 해석',
          '공매도 잔고 현황 (최신 데이터, %, 수량, 기준일자)',
          '주요 기관/외국인 순매수/순매도 동향 (최근 1개월)',
        ],
        source_guidance:
          '최신 시장 데이터 출처(예: 한국거래소, Investing.com) 및 기준 시점 명시. 기술적 지표/과거 주가는 사용된 데이터 출처 명시.',
      },
      earnings_call_and_ir_materials: {
        enabled: true,
        period: '최근 1년',
        limit: 2,
        details: [
          '최근 컨퍼런스콜 개최일, 원문 URL, 주요 내용 요약 (경영진 전망, Q&A 등)',
          '최근 IR Day 개최일, 원문 URL, 핵심 내용 요약 (장기 전략, 신제품, 재무 목표 등)',
        ],
        source_guidance:
          '기업 공식 웹사이트 IR, 신뢰할 수 있는 금융 플랫폼(FnGuide, DART) 등 명확한 출처 및 원본 URL 권장. 정보 부재 시 명확히 고지.',
      },
      macro_economic_and_geopolitical_context: {
        enabled: true,
        period: '최근 6개월',
        details: [
          `**${name || '해당 기업'}의 산업 관련 주요 거시경제 지표** (예: 금리, 인플레이션, GDP, 특정 시장 동향, 원자재 가격) 최신 데이터/전망 (수치 포함)`,
          `**${name || '해당 기업'} 사업 환경 관련 주요 지정학적 리스크/기회** (예: 무역 분쟁, 공급망 규제, 지정학적 분쟁, 산업 정책 변화) 최신 동향`,
          '위 정보에 대한 **복수 전문가/기관의 최신 분석 요약 (출처 명시)**',
        ],
        source_guidance:
          '주요 경제 연구기관(KDI, 한은), 정부, 국제기구 보고서 등 검증 가능한 출처 기재. 최신 데이터(수치) 및 기준 시점 명시.',
      },
    },
    response_guidance: {
      language: 'ko',
      format: 'Markdown',
      tone: '객관적이고 정보 중심적인',
      reliability_guarantees: [
        '모든 정보는 명시된 출처 기반이며, 불분명하거나 미확인 정보는 배제합니다.',
        '뉴스/리포트 요약은 원문의 핵심 내용을 중립적이고 정확하게 반영하며, 주관적 해석/예측은 배제합니다.',
        '추정치는 출처/기준 시점과 함께 추정치임을 명확히 고지하며, 실제와 다를 수 있음을 강조합니다.',
        '요청 정보가 부족하거나 없을 시, 해당 사실과 이유를 명확히 고지하고 가능한 범위에서 제공합니다.',
        '모든 수치 데이터는 정확한 단위와 기준 시점 명시.',
      ],
    },
  };
}
