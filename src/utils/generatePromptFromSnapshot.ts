import type { Snapshot } from '@/types/report';
import type { AssetType } from '@/types/asset';

/**
 * 📊 전체 스냅샷 흐름을 기반으로 Gemini용 전략 프롬프트 생성
 * - 과거 자산 변화 요약
 * - 현재 상태와 목표 비중 비교
 * - 리스크 자산 집중도 판단
 * - 시장 환경 기반 리밸런싱 또는 목표 비중 조정 요청 포함
 */
export function generatePromptFromSnapshots(
  snapshots: Snapshot[],
  targetAllocation: Record<AssetType, number>,
): string {
  // ✅ 수정: 스냅샷이 하나도 없으면 분석 불가 (length < 1로 변경)
  if (snapshots.length === 0) return '📉 데이터가 부족하여 분석할 수 없습니다.';

  const sorted = [...snapshots].sort((a, b) => Number(a.date) - Number(b.date));
  const first = sorted[0]; // 스냅샷이 하나여도 first는 존재
  const last = sorted[sorted.length - 1]; // 스냅샷이 하나면 first와 동일

  // ⚠️ 스냅샷이 하나인 경우 delta, deltaRate는 0이 되거나 계산 불가가 됨
  const hasMultipleSnapshots = snapshots.length >= 2;
  const delta = hasMultipleSnapshots ? last.total - first.total : 0;
  const deltaRate = hasMultipleSnapshots ? (delta / first.total) * 100 : 0; // 또는 NaN/Infinity 방지

  const getAssetMap = (snap: Snapshot): Record<string, number> => {
    const map: Record<string, number> = {};
    snap.data.forEach(({ name, value }) => {
      map[name] = value;
    });
    return map;
  };

  const firstAssets = getAssetMap(first);
  const lastAssets = getAssetMap(last);

  // ⚠️ 스냅샷이 하나인 경우 자산 변화 요약은 무의미함
  const assetChanges = Object.keys(lastAssets).map((key) => {
    const prev = hasMultipleSnapshots
      ? (firstAssets[key] ?? 0)
      : lastAssets[key]; // 스냅샷 하나면 현재값 그대로
    const now = lastAssets[key];
    const diff = now - prev;
    return { name: key, diff };
  });

  const assetDiffLines = hasMultipleSnapshots
    ? assetChanges
        .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
        .map(
          ({ name, diff }) =>
            `${name}: ${diff >= 0 ? '+' : ''}₩${diff.toLocaleString()}`,
        )
        .join(', ')
    : '과거 데이터 부족으로 자산군별 변화를 분석할 수 없습니다.';

  const total = last.total;
  const actualRatioLines = last.data
    .map(({ name, value }) => {
      const ratio = ((value / total) * 100).toFixed(1);
      const target = targetAllocation[name as AssetType]
        ? (targetAllocation[name as AssetType] * 100).toFixed(1)
        : 'N/A';
      return `- ${name}: 목표 ${target}% / 실제 ${ratio}%`;
    })
    .join('\n');

  const targetLines = Object.entries(targetAllocation)
    .map(([key, ratio]) => `- ${key}: ${Math.round(ratio * 100)}%`)
    .join('\n');

  // 🚩 프롬프트 내용도 스냅샷 개수에 따라 조정
  const assetFlowSummary = hasMultipleSnapshots
    ? `
📅 **제공된 자산 흐름 데이터**:
-   시작일: ${first.date} → 총 자산: ₩${first.total.toLocaleString()}
-   종료일: ${last.date} → 총 자산: ₩${last.total.toLocaleString()}
-   기간 중 증가율: +${deltaRate.toFixed(1)}%
`
    : `
📅 **제공된 현재 자산 스냅샷 데이터 (단일 스냅샷)**:
-   기준일: ${last.date} → 총 자산: ₩${last.total.toLocaleString()}
-   과거 데이터 부족으로 총 자산 증가 추이는 분석할 수 없습니다.
`;

  const assetChangeSummary = hasMultipleSnapshots
    ? `
📊 **자산군별 변화 상세**:
${assetDiffLines}
`
    : `
📊 **자산군별 변화 상세**:
${assetDiffLines}
`;

  return `
당신은 **최고 수준의 금융 전문가이자 투자 전략가**입니다. 제공된 자산 스냅샷 데이터를 기반으로, 현재의 거시 경제 상황, 글로벌 시장 동향, 그리고 **최신 뉴스 분석을 핵심 근거로 삼아** 고객에게 **실질적이고 신뢰할 수 있는 자산 관리 전략과 맞춤형 조언**을 제공해야 합니다.

다음 분석 항목들을 심층적으로 다루어 주십시오:

1.  **총 자산 성과 분석**:
    ${hasMultipleSnapshots ? `지난 기간 동안의 총 자산 증가 추이를 심층적으로 분석하고, 그 **주요 원인과 시장 환경의 영향**을 구체적으로 설명해 주십시오. 이 분석의 근거가 되는 **주요 경제 지표 및 관련 최신 뉴스**를 명시해 주십시오.` : `단일 스냅샷이므로 총 자산 변화 추이는 분석할 수 없습니다. 대신 현재 총 자산 규모의 의미를 현재 시장 상황에 비추어 설명해 주십시오.`}
2.  **자산군별 변화 및 시장 맥락**:
    ${hasMultipleSnapshots ? `각 자산군(현금, 주식, 코인, 금 등)의 **주요 변화(증가/감소)를 분석하고, 해당 변화가 발생한 시장의 맥락과 연결하여 설명**해 주십시오. 특히, 특정 자산군의 변동성에 영향을 미친 **최신 뉴스 (예: 산업별 규제 변화, 기업 실적 발표, 원자재 가격 변동 관련 뉴스 등)를 핵심 근거로 제시**해 주십시오.` : `단일 스냅샷이므로 자산군별 과거 변화 추이는 분석할 수 없습니다. 대신 현재 자산군별 절대 규모가 현재 시장에서 가지는 의미를 설명해 주십시오.`}
3.  **포트폴리오 비중 진단**:
    * **목표 비중 대비 실제 비중의 차이**를 명확히 분석하고, 이 차이가 현재 포트폴리오에 미치는 **전략적 함의**를 제시해 주십시오.
    * **리스크 자산(주식, 코인 등)의 집중도**를 평가하고, 현재 시장의 변동성 및 잠재적 위험을 고려했을 때 해당 집중도가 적절한지, 그리고 **필요한 리밸런싱 또는 헤지 방안**이 있는지 판단해 주십시오. 이 판단의 근거가 되는 **최신 시장 불안정성 관련 뉴스 또는 경제 전문가의 견해**를 함께 제시해 주십시오.
4.  **시장 환경 기반의 미래 전략 제안 (자산 비율 조정 근거)**: 현재의 금리 추이, 환율 변동, 주요 주식 시장 흐름, 그리고 **최신 세계 정세(예: 지정학적 리스크, 공급망 문제, 기술 혁신 관련 뉴스 등)**를 종합적으로 반영하여, 향후 포트폴리오를 위한 **구체적인 자산군별 액션 플랜(매수/매도/유지 권고)을 제안**해 주십시오. **각 제안의 근거는 반드시 관련 최신 뉴스(뉴스 제목, 날짜, 출처 명시)에 기반**해야 합니다.
5.  **목표 비중 재조정 검토 (단기/중기/장기 전략)**:
    * 현재의 시장 상황과 고객의 투자 목표 및 위험 감수 수준을 고려했을 때, **기존 목표 비중 자체를 재조정할 필요성**이 있다면, 다음과 같이 **단기, 중기, 장기 관점으로 나누어** 그 이유와 함께 새로운 목표 비중을 제시해 주십시오.
    * **단기 (향후 3개월):** 시장의 즉각적인 변화와 예상되는 이슈(예: 임박한 금리 결정, 단기 기업 실적)에 대응하기 위한 목표 비중 조정. **핵심 근거 뉴스 및 시장 이벤트**를 명시해 주십시오.
    * **중기 (향후 6개월 ~ 1년):** 예상되는 경제 사이클 변화, 산업 트렌드 변화(예: 특정 기술의 시장 침투 가속화), 주요 정책 변화 등을 고려한 목표 비중 조정. **관련 최신 뉴스 및 분석 보고서**를 근거로 제시해 주십시오.
    * **장기 (향후 3년 이상):** 거시 경제의 구조적 변화, 인구 구조 변화, 장기 기술 발전 방향 등 근본적인 환경 변화에 따른 목표 비중 조정. **장기 전망 보고서, 주요 기관의 연구 결과 또는 관련 최신 뉴스**를 근거로 제시해 주십시오.

---
${assetFlowSummary}
${assetChangeSummary}

🎯 **현재 설정된 목표 비중**:
${targetLines}

📊 **최신 실제 비중 (기준일: ${last.date})**:
${actualRatioLines}

---

**✍️ 답변 지침**:
* 당신의 모든 분석과 제안은 **최신 뉴스를 통해 분석된 상황**을 반드시 반영하며, **각 제안의 핵심 근거가 되는 뉴스(뉴스 제목, 날짜, 출처)**를 명확히 명시해야 합니다. 관련 뉴스가 없는 경우, "뉴스 없음"이라고 명시하고 일반적인 시장 분석을 제시해 주십시오.
* **5~10문장으로 핵심적인 전략적 해석과 실행 가능한 제안**을 중심으로 요약해 주십시오. 단순한 데이터 나열이 아닌, 고객이 이해하고 행동할 수 있는 **명확하고 간결한 조언**을 제공해 주십시오.
* 전문 용어는 최소화하고, 일반 투자자가 쉽게 이해할 수 있도록 친절하게 설명해 주십시오.
* 제안하는 전략에 대한 **잠재적인 리스크 요인과 이에 대한 헤지 방안**도 함께 언급하여, 투자자가 종합적인 판단을 내릴 수 있도록 도와주십시오.
`.trim();
}
