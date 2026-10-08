import type { AnswerText } from '../data/answers';
import { speak } from '../utils/speak';
import Btn from './Btn';

export default function SeniorMessage({ a }: { a: AnswerText }) {
  return (
    <div className="msg">
      <div className="sub">{a.s}</div>
      <div className="t">{a.t}</div>
      <Btn kind="o" onClick={() => speak(a.say)}>
        🔊 소리로 듣기
      </Btn>
    </div>
  );
}
