/**
 * ✅ formatKorean
 *
 * 숫자를 한국식 금액 포맷으로 변환 (ex. 12,000,000 → "1,200만원")
 */
export const formatKorean = (num: number): string => {
  const man = Math.floor(num / 10000);
  const won = num % 10000;

  const formattedMan = man ? `${man.toLocaleString('ko-KR')}만원` : '';
  const formattedWon = won ? `${won.toLocaleString('ko-KR')}원` : '';

  return [formattedMan, formattedWon].filter(Boolean).join(' ');
};
