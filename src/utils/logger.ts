// utils/logger.ts

const isDev = import.meta.env.DEV;

function extractScope(metaUrl: string): string {
  try {
    const parts = metaUrl.split('/');
    const file = parts.at(-1)?.split('.')[0]; // ex: useTemplateInitializer.ts → useTemplateInitializer
    return file ?? 'log';
  } catch {
    return 'log';
  }
}

function baseLog(
  level: 'debug' | 'info' | 'warn' | 'error',
  scope: string,
  ...args: any[]
) {
  if (!isDev && level !== 'error') return;
  console[level](`[${scope}]`, ...args);
}

// ✅ export: 함수가 자동 scope 가진 log 객체 생성
export function useLogger(metaUrl: string) {
  const scope = extractScope(metaUrl);
  return {
    debug: (...args: any[]) => baseLog('debug', scope, ...args),
    info: (...args: any[]) => baseLog('info', scope, ...args),
    warn: (...args: any[]) => baseLog('warn', scope, ...args),
    error: (...args: any[]) => baseLog('error', scope, ...args),
  };
}
