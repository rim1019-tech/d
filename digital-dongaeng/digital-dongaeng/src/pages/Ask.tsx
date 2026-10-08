import { useRef, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Btn from '../components/Btn';
import Guide from '../components/Guide';
import Header from '../components/Header';
import { useToast } from '../components/Toast';
import { SAMPLE_TEXT } from '../data/analysis';
import type { Draft } from '../types';
import { readAndResize } from '../utils/image';

export default function Ask() {
  const nav = useNavigate();
  const say = useToast();
  const cam = useRef<HTMLInputElement>(null);
  const gal = useRef<HTMLInputElement>(null);

  const go = (draft: Draft) => nav('/senior/ask/analyze', { state: { draft } });
  const pick = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    try {
      go({ id: Date.now(), img: await readAndResize(f) });
    } catch {
      say('사진을 불러오지 못했어요. 다시 해볼까요?');
    }
  };

  return (
    <div className="pg">
      <Header crumb="묻기 › 사진 고르기" onBack={() => nav('/senior')} title="무엇이 궁금하세요?" />
      <Guide>받은 문자를 사진으로 보여 주세요. 아래 버튼을 눌러 볼까요?</Guide>
      <input ref={cam} type="file" accept="image/*" capture="environment" hidden onChange={pick} />
      <input ref={gal} type="file" accept="image/*" hidden onChange={pick} />
      <Btn kind="p" onClick={() => cam.current?.click()}>📷 사진 가져오기</Btn>
      <Btn kind="g" onClick={() => gal.current?.click()}>🖼️ 갤러리에서 가져오기</Btn>
      <div className="soft">사진이 없어도 괜찮아요. 시연용 예시 문자로 해볼 수 있어요.</div>
      <Btn onClick={() => go({ id: Date.now(), text: SAMPLE_TEXT })}>💌 예시 문자로 해보기</Btn>
      <p className="sub">시연용이에요. 실제 이름·번호·계좌가 보이는 사진은 올리지 마세요.</p>
    </div>
  );
}
