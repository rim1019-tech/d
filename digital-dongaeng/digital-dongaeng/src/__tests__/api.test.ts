import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import handler from '../../api/analyze';

function call(body: unknown, method = 'POST') {
  let code = 0;
  let json: unknown;
  const res = {
    setHeader: () => res,
    status: (c: number) => ((code = c), res),
    json: (j: unknown) => ((json = j), res),
  } as unknown as VercelResponse;
  const req = { method, body, headers: { 'x-forwarded-for': `t-${Math.random()}` } } as unknown as VercelRequest;
  return handler(req, res).then(() => ({ code, json: json as Record<string, unknown> }));
}
const gemini = (obj: unknown) => ({ ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: JSON.stringify(obj) }] } }] }) });

describe('/api/analyze', () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-key';
  });
  it('키가 없으면 503 (클라이언트는 fallback 사용)', async () => {
    delete process.env.GEMINI_API_KEY;
    expect((await call({ text: '안녕' })).code).toBe(503);
  });
  it('GET은 405', async () => {
    expect((await call({}, 'GET')).code).toBe(405);
  });
  it('빈 입력은 400', async () => {
    expect((await call({})).code).toBe(400);
  });
  it('정상 응답은 정리되어 반환 (signs 3개, actions 2개 제한)', async () => {
    const f = vi.fn().mockResolvedValue(gemini({ easy: '지원금 문자예요.', level: 'caution', signs: ['a', 'b', 'c', 'd'], actions: ['x', 'y', 'z'] }));
    vi.stubGlobal('fetch', f);
    const r = await call({ text: '지원금 문자' });
    expect(r.code).toBe(200);
    expect((r.json.signs as string[]).length).toBe(3);
    expect((r.json.actions as string[]).length).toBe(2);
    // 키는 헤더로만 전달되고 응답에는 없다
    expect(JSON.stringify(r.json)).not.toContain('test-key');
    expect((f.mock.calls[0][1] as RequestInit).headers).toMatchObject({ 'x-goog-api-key': 'test-key' });
  });
  it('확정 표현이 섞이면 502', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(gemini({ easy: '안전합니다.', level: 'low', signs: [], actions: ['괜찮아요'] })));
    expect((await call({ text: 'x' })).code).toBe(502);
  });
  it('잘못된 이미지 형식은 502 (fallback 유도)', async () => {
    vi.stubGlobal('fetch', vi.fn());
    expect((await call({ img: 'data:text/html;base64,AAAA' })).code).toBe(502);
  });
});
