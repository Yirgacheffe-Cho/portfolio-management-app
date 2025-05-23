// ✅ 특정 날짜 기록을 위한 메타 정보 타입 정의
export interface RecordMeta {
  /**
   * 💰 목표 저축액 (₩ 단위)
   * 예: 3,000,000
   */
  savingsGoal: number;

  /**
   * 📈 저축률 (0 ~ 1 사이의 비율)
   * 예: 0.75 → 75%
   */
  savingRate: number;

  /**
   * 🎯 자산 유형별 목표 비중
   * - 예: { '주식': 0.5, '금': 0.1 }
   * - string key로 하는 이유는 유연성을 위해 AssetType 직접 참조하지 않음
   */
  targetAllocation: Record<string, number>;
}
