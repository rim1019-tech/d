export type Role = 'senior' | 'family' | 'welfare';
export type Responder = 'family' | 'welfare';
export type AnswerKey = 'no' | 'ok' | 'call';
export type Level = 'caution' | 'check' | 'low';

export interface Analysis {
  easy: string;
  level: Level;
  signs: string[];
  actions: string[];
  /** true: 실제 AI 응답 / false: 시연용 예시(fallback) */
  ai: boolean;
}

/** 어르신 → 가족/복지사 확인 요청 (나중에 DB 테이블 1개로 옮기기 쉬운 형태) */
export interface HelpRequest {
  id: number;
  to: Responder;
  img: string | null;
  text: string | null;
  an: Analysis;
  answer: AnswerKey | null;
  seen: boolean;
}

export interface AppState {
  quiz: number;
  learned: string[];
  req: HelpRequest | null;
}

export interface Draft {
  id: number;
  img?: string;
  text?: string;
}
