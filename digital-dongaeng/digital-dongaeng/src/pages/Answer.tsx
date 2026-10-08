import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Btn from '../components/Btn';
import Guide from '../components/Guide';
import Header from '../components/Header';
import SeniorMessage from '../components/SeniorMessage';
import { ANSWERS } from '../data/answers';
import { RESPONDER_LABEL, USERS } from '../data/users';
import { useAppState } from '../hooks/useAppState';
import { markSeen } from '../services/requests';

/** 어르신 화면: 보낸 확인 요청의 상태와 가족/복지사의 답변 */
export default function Answer() {
  const nav = useNavigate();
  const { req } = useAppState();
  const a = req?.answer ? ANSWERS[req.answer] : null;
  useEffect(() => {
    if (a && !req?.seen) markSeen();
  }, [a, req?.seen]);

  const back = () => nav('/senior');
  if (!req)
    return (
      <div className="pg">
        <Header crumb="묻기 › 답변" onBack={back} />
        <h2>보낸 확인 요청이 아직 없어요.</h2>
        <Btn onClick={back}>🏠 홈으로 가기</Btn>
      </div>
    );
  return (
    <div className="pg">
      <Header crumb="묻기 › 답변" onBack={back} />
      {a ? (
        <div>
          <Guide>아래 버튼을 누르면 소리로 들을 수 있어요.</Guide>
          <SeniorMessage a={a} />
          <p className="sub" style={{ textAlign: 'center' }}>{USERS[req.to]}님이 보내 준 답이에요.</p>
        </div>
      ) : (
        <div>
          <Guide>{USERS[req.to]}님의 답을 기다리고 있어요. 답이 오면 이 화면이 바뀌어요.</Guide>
          <div className="msg">
            <div className="t">확인 요청을 보냈어요.</div>
            <div className="dots"><span /><span /><span /></div>
          </div>
          <div className="soft">시연 안내: 위쪽의 “{req.to === 'family' ? '가족' : '복지사'}” 버튼을 눌러 {RESPONDER_LABEL[req.to]} 화면에서 답해 보세요.</div>
        </div>
      )}
      <Btn onClick={back}>🏠 홈으로 가기</Btn>
    </div>
  );
}
