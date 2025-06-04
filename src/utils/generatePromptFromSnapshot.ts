import type { Snapshot } from '@/types/report';
import type { AssetType } from '@/types/asset';

/**
 * 📊 전체 스냅샷 흐름을 기반으로 Gemini용 전략 프롬프트 생성
 */
export function generatePromptFromSnapshots(
  snapshots: Snapshot[],
  targetAllocation: Record<AssetType, number>,
): string {
  // ✅ 최근 12개만 사용
  const trimmed = snapshots.slice(-12);
  if (trimmed.length === 0) return '📉 데이터가 부족하여 분석할 수 없습니다.';

  const sorted = [...trimmed].sort((a, b) => Number(a.date) - Number(b.date));
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const hasMultipleSnapshots = sorted.length >= 2;
  const delta = hasMultipleSnapshots ? last.total - first.total : 0;
  const deltaRate = hasMultipleSnapshots ? (delta / first.total) * 100 : 0;

  const getAssetMap = (snap: Snapshot): Record<string, number> => {
    const map: Record<string, number> = {};
    snap.data.forEach(({ name, value }) => {
      map[name] = value;
    });
    return map;
  };

  const firstAssets = getAssetMap(first);
  const lastAssets = getAssetMap(last);

  const assetChanges = Object.keys(lastAssets).map((key) => {
    const prev = hasMultipleSnapshots
      ? (firstAssets[key] ?? 0)
      : lastAssets[key];
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

  const assetChangeSummary = `
📊 **자산군별 변화 상세**:
${assetDiffLines}
`;

  return `
당신은 **최고 수준의 금융 전문가이자 투자 전략가**입니다. 제공된 자산 스냅샷 데이터를 기반으로, 현재의 거시 경제 상황, 글로벌 시장 동향, 그리고 **최신 뉴스 분석을 핵심 근거로 삼아** 고객에게 **실질적이고 신뢰할 수 있는 자산 관리 전략과 맞춤형 조언**을 제공해야 합니다.

...

${assetFlowSummary}
${assetChangeSummary}

🎯 **현재 설정된 목표 비중**:
${targetLines}

📊 **최신 실제 비중 (기준일: ${last.date})**:
${actualRatioLines}

📝 참고: 이 분석은 최근 12개의 스냅샷(약 1년 분량)만을 기반으로 하며, 장기적 자산 흐름은 포함되어 있지 않습니다. 분석 시 이 점을 고려해 주세요.

---

**✍️ 답변 지침**:
* 당신의 모든 분석과 제안은 **최신 뉴스를 통해 분석된 상황**을 반드시 반영하며, ...
`.trim();
}
