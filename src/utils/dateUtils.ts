export function formatFullDate(date: string) {
  const y = date.slice(0, 4);
  const m = parseInt(date.slice(4, 6), 10);
  const d = date.length === 8 ? parseInt(date.slice(6, 8), 10) : null;
  return d ? `${y}년 ${m}월 ${d}일` : `${y}년 ${m}월`;
}
