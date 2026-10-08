/**
 * "확인 요청" 관련 도메인 함수 모음.
 * 어르신 → 확인 요청 생성 → 가족/복지사 답변 → 어르신에게 전달
 *
 * 실제 서비스에서는 이 함수들의 내부를 Supabase 호출로 바꾸면 됩니다.
 *  - createRequest  → insert into help_requests
 *  - answerRequest  → update help_requests set answer = ...
 *  - markSeen       → update help_requests set seen = true
 */
import type { Analysis, AnswerKey, Draft, Responder } from '../types';
import { store } from './store';

export function createRequest(to: Responder, draft: Draft, an: Analysis) {
  store.update((s) => ({
    ...s,
    req: { id: Date.now(), to, img: draft.img ?? null, text: draft.text ?? null, an, answer: null, seen: false },
  }));
}

export function answerRequest(answer: AnswerKey) {
  store.update((s) => (s.req ? { ...s, req: { ...s.req, answer, seen: false } } : s));
}

export function markSeen() {
  store.update((s) => (s.req && !s.req.seen ? { ...s, req: { ...s.req, seen: true } } : s));
}

export function addLearned(title: string) {
  store.update((s) => ({ ...s, learned: [...new Set([...s.learned, title])] }));
}

export function setQuizProgress(n: number) {
  store.update((s) => ({ ...s, quiz: Math.max(s.quiz, n) }));
}

export function clearDemoData() {
  store.clear();
}
