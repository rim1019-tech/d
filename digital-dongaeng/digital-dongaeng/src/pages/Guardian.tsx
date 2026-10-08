import Btn from '../components/Btn';
import { useToast } from '../components/Toast';
import { ANSWERS } from '../data/answers';
import { LEVEL_LABEL } from '../data/analysis';
import { USERS, callName } from '../data/users';
import { useAppState } from '../hooks/useAppState';
import { answerRequest } from '../services/requests';
import type { AnswerKey, Responder } from '../types';

/** 가족(김민수) / 사회복지사(박지영) 화면 */
export default function Guardian({ who }: { who: Responder }) {
  const say = useToast();
  const { req } = useAppState();
  const mine = req && req.to === who ? req : null;
  const reply = (a: AnswerKey) => {
    answerRequest(a);
    say('답변을 보냈어요.');
  };
  return (
    <div className="pg">
      <h1>안녕하세요, {callName(who)}님.</h1>
      {!mine && (
        <div className="card">
          <h2>아직 확인 요청이 없어요.</h2>
          <p className="sub">어르신 화면에서 “묻기”로 요청을 보내면 여기에 나타나요.</p>
        </div>
      )}
      {mine && (
        <div>
          <div className="soft">{callName('senior')}님이 확인을 요청했어요.</div>
          {mine.img ? (
            <img className="shot" src={mine.img} alt="어르신이 보낸 문자 사진" />
          ) : (
            <div className="sms">{(mine.text ?? '').split('\n').map((l, k) => <div key={k}>{l}</div>)}</div>
          )}
          <div className="card">
            <span className="tag">도우미(AI)가 정리했어요</span>
            <p><b>{mine.an.easy}</b></p>
            <p className="sub">{LEVEL_LABEL[mine.an.level]} 링크를 눌러도 되는지 확인해 주세요.</p>
          </div>
          {mine.answer ? (
            <div className="msg"><div className="sub">보낸 답변 ({USERS.senior}님 화면에 보여요)</div><div className="t">{ANSWERS[mine.answer].t}</div></div>
          ) : (
            <h2>어떻게 답할까요?</h2>
          )}
          <Btn kind="o" onClick={() => reply('no')}>누르지 마세요</Btn>
          <Btn kind="p" onClick={() => reply('ok')}>괜찮아요</Btn>
          <Btn kind="g" onClick={() => reply('call')}>전화드릴게요</Btn>
        </div>
      )}
    </div>
  );
}
