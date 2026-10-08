/** 브라우저 기본 음성(SpeechSynthesis)으로 읽어 주기 */
export function speak(text: string): boolean {
  try {
    if (!('speechSynthesis' in window)) return false;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ko-KR';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
    return true;
  } catch {
    return false;
  }
}
