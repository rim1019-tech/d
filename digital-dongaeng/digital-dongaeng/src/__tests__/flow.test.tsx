import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';

const click = (name: RegExp | string) => userEvent.click(screen.getByRole('button', { name }));
const open = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
const goTab = (label: string) => userEvent.click(screen.getByRole('link', { name: new RegExp(label) }));

beforeEach(() => {
  // AI 서버가 없는 환경(로컬 vite 등)을 흉내: 실패 → fallback
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('no api')));
});

describe('디지털 동행 주요 흐름', () => {
  it('TEST 1: 시작 화면 → 어르신으로 시작 → 홈', async () => {
    open();
    expect(screen.getByText(/혼자 고민하지 않아도 괜찮아요/)).toBeInTheDocument();
    expect(screen.getByText(/시연용 프로토타입/)).toBeInTheDocument();
    await click(/어르신으로 시작하기/);
    expect(await screen.findByText(/안녕하세요, 순자님/)).toBeInTheDocument();
  });

  it('TEST 2: 키오스크 주문 연습 (잘못 눌러도 부드럽게)', async () => {
    open('/senior/learn/kiosk');
    await click(/치즈버거/);
    expect(screen.getByText(/괜찮아요. 천천히 다시 찾아볼까요/)).toBeInTheDocument();
    await click(/불고기버거/);
    await click(/콜라/);
    await click(/장바구니 보기/);
    await click(/^주문하기$/);
    await click(/카드로 내기/);
    expect(screen.getByText(/잘했어요/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /다시 연습하기/ })).toBeInTheDocument();
  });

  it('TEST 3: 기차·버스 예매 연습', async () => {
    open('/senior/learn/train');
    for (const o of ['서울', '부산', '내일', '오전 9:00', '3호차 창가 12A']) await click(new RegExp(`^${o}$`));
    await click(/예매 확인\(연습\)/);
    expect(screen.getByText(/기차표 예매 과정을 연습했어요/)).toBeInTheDocument();
  });

  it('TEST 4: 안심 퀴즈 5개 → 결과', async () => {
    open('/senior/quiz');
    const answers = ['가족에게 먼저 물어본다', '공단 대표번호를 직접', '원래 알던 번호로', '넣지 않고 가족에게', '잠깐 멈추고 가족에게'];
    for (let i = 0; i < 5; i++) {
      await click(new RegExp(answers[i]));
      await click(i === 4 ? /결과 보기/ : /다음 문제/);
    }
    expect(screen.getByText(/모두 풀었어요/)).toBeInTheDocument();
  });

  it('TEST 5~6~7: 묻기 → AI 분석(fallback) → 가족에게 → 가족 답변 → 어르신 화면 + 음성', async () => {
    const speak = vi.fn();
    vi.stubGlobal('speechSynthesis', { speak, cancel: vi.fn() });
    vi.stubGlobal('SpeechSynthesisUtterance', class { constructor(public text: string) {} });

    open('/senior/ask');
    await click(/예시 문자로 해보기/);
    expect(await screen.findByText(/무슨 내용인가요/, {}, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.getByText(/조금 조심할 부분/)).toBeInTheDocument();
    expect(screen.getByText(/어떻게 하면 좋을까요/)).toBeInTheDocument();
    expect(screen.getByText(/시연용 예시 분석/)).toBeInTheDocument();
    await click(/가족에게 물어보기/);
    expect(screen.getByText(/김민수님에게 확인 요청을 보낼까요/)).toBeInTheDocument();
    await click(/네, 보낼게요/);
    expect(screen.getByText(/확인 요청을 보냈어요/, { selector: '.t' })).toBeInTheDocument();

    await goTab('가족');
    expect(await screen.findByText(/순자님이 확인을 요청했어요/)).toBeInTheDocument();
    await click(/^누르지 마세요$/);

    await goTab('어르신');
    await click(/답이 도착했어요/);
    expect(await screen.findByText('가족이 확인했어요.')).toBeInTheDocument();
    expect(screen.getByText('누르지 마세요.')).toBeInTheDocument();
    await click(/소리로 듣기/);
    expect(speak).toHaveBeenCalledTimes(1);
  });

  it('AI가 확정 표현을 쓰면 버리고 예시 분석으로 대체', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ easy: '100% 사기입니다.', level: 'caution', signs: [], actions: ['누르지 마세요'] }) }));
    open('/senior/ask');
    await click(/예시 문자로 해보기/);
    expect(await screen.findByText(/시연용 예시 분석/, {}, { timeout: 5000 })).toBeInTheDocument();
  });

  it('AI 응답이 정상이면 그 결과를 보여줌', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ easy: '택배 도착 안내 문자예요.', level: 'check', signs: ['주소가 들어 있어요.'], actions: ['누르지 말고 가족에게 보여 주세요.'] }) }));
    open('/senior/ask');
    await click(/예시 문자로 해보기/);
    expect(await screen.findByText('택배 도착 안내 문자예요.', {}, { timeout: 5000 })).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/시연용 예시 분석/)).not.toBeInTheDocument());
  });
});
