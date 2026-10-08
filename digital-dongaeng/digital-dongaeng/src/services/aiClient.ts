/**
 * AI 문자 분석 클라이언트.
 * 비밀키는 브라우저에 없고, 서버리스 함수(/api/analyze)만 알고 있어요.
 * 어떤 이유로든 실패하면 예시 분석(FALLBACK)을 돌려줘서 시연이 끊기지 않게 해요.
 */
import { FALLBACK } from '../data/analysis';
import type { Analysis } from '../types';
import { sanitizeAnalysis } from '../utils/safety';

const TIMEOUT_MS = 25000;

export async function analyzeMessage(input: { img?: string; text?: string }): Promise<Analysis> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(String(res.status));
    const clean = sanitizeAnalysis(await res.json());
    if (!clean) throw new Error('invalid');
    return { ...clean, ai: true };
  } catch {
    return { ...FALLBACK, ai: false };
  } finally {
    clearTimeout(timer);
  }
}
