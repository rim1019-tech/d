import type { Responder, Role } from '../types';

/** 시연용 가상 사용자. 실제 회원 정보가 아닙니다. */
export const USERS: Record<Role, string> = {
  senior: '김순자',
  family: '김민수',
  welfare: '박지영',
};
export const callName = (r: Role) => USERS[r].slice(1);
export const RESPONDER_LABEL: Record<Responder, string> = { family: '가족', welfare: '사회복지사' };
