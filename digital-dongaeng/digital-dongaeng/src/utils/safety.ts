import type { Analysis, Level } from '../types';

/** AI가 사기 여부를 확정하는 표현을 쓰면 결과를 버리고 예시 분석으로 대체합니다. */
export const BAD = /사기(입니다|예요|에요|이에요|임|가 맞)|100\s*%|안전(합니다|해요|하다|한 문자)|확실(히|합니다)|틀림없/;

const LEVELS: Level[] = ['caution', 'check', 'low'];
const strs = (a: unknown, n: number) =>
  (Array.isArray(a) ? a : [])
    .filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    .map((x) => x.trim())
    .slice(0, n);

export function sanitizeAnalysis(raw: unknown): Omit<Analysis, 'ai'> | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const easy = typeof r.easy === 'string' ? r.easy.trim() : '';
  const signs = strs(r.signs, 3);
  const actions = strs(r.actions, 2);
  if (!easy || !actions.length) return null;
  if (BAD.test([easy, ...signs, ...actions].join(' '))) return null;
  const level = LEVELS.includes(r.level as Level) ? (r.level as Level) : 'check';
  return { easy, level, signs, actions };
}
