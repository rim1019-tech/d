import type { AnswerKey } from '../types';

export interface AnswerText {
  s: string;
  t: string;
  say: string;
}
export const ANSWERS: Record<AnswerKey, AnswerText> = {
  no: { s: '가족이 확인했어요.', t: '누르지 마세요.', say: '가족이 확인했어요. 누르지 마세요.' },
  ok: { s: '가족이 확인했어요.', t: '괜찮아요.', say: '가족이 확인했어요. 괜찮아요. 안심하고 보셔도 돼요.' },
  call: { s: '가족이 확인했어요.', t: '곧 전화드릴게요.', say: '가족이 확인했어요. 곧 전화드릴게요. 잠시만 기다려 주세요.' },
};
