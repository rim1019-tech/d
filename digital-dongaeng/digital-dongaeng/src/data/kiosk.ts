export const BRAND = '동행버거';
export const ITEMS = [
  { id: 'burger', n: '불고기버거', p: 4500, e: '🍔' },
  { id: 'cheese', n: '치즈버거', p: 4000, e: '🧀' },
  { id: 'fries', n: '감자튀김', p: 2000, e: '🍟' },
  { id: 'cola', n: '콜라', p: 1500, e: '🥤' },
  { id: 'ice', n: '아이스크림', p: 2000, e: '🍦' },
] as const;

/** 단계별로 눌러야 하는 버튼 id */
export const KIOSK_TARGETS = ['burger', 'cola', 'cartbtn', 'order', 'card'] as const;
export const KIOSK_GUIDES = [
  '다음에는 불고기버거를 눌러볼까요?',
  '이번에는 콜라를 눌러볼까요?',
  '아래의 “장바구니 보기”를 눌러볼까요?',
  '내용이 맞으면 “주문하기”를 눌러볼까요?',
  '“카드로 내기(연습)”를 눌러볼까요? 진짜 결제는 되지 않아요.',
];
