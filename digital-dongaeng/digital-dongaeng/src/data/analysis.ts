import type { Analysis, Level } from '../types';

export const SAMPLE_TEXT =
  '[정부지원센터] 정부 지원금 신청을 위해 아래 링크를 클릭하여 본인인증을 완료하시기 바랍니다. 오늘 안에 하지 않으면 신청이 취소됩니다.\nhttp://gov-support-kr.example/apply';

export const LEVEL_LABEL: Record<Level, string> = {
  caution: '⚠️ 조금 조심할 필요가 있어요.',
  check: '🔎 확인이 필요해요.',
  low: '🙂 위험 신호는 적어 보여요. 그래도 한 번 확인해 봐요.',
};

/** AI 호출이 실패해도 시연이 끊기지 않도록 쓰는 예시 분석 */
export const FALLBACK: Omit<Analysis, 'ai'> = {
  easy: '정부 지원금을 신청하라는 문자예요. 문자 속 인터넷 주소를 눌러서 본인 확인을 하라고 안내하고 있어요.',
  level: 'caution',
  signs: ['문자에 인터넷 주소가 들어 있어요.', '공식 홈페이지 주소인지 확인이 필요해요.', '오늘 안에 바로 하라고 재촉하고 있어요.'],
  actions: ['인터넷 주소는 누르지 말고 그대로 두세요.', '가족이나 사회복지사에게 먼저 보여 주고 물어보세요.'],
};
