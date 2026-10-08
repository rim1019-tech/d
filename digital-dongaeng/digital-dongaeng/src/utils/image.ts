/** 사진을 브라우저 안에서 작게 줄여 data URL로 만듭니다. (서버에 따로 저장하지 않아요) */
export function readAndResize(file: File, maxSide = 700): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read'));
    reader.onload = () => {
      const im = new Image();
      im.onerror = () => reject(new Error('decode'));
      im.onload = () => {
        const k = Math.min(1, maxSide / Math.max(im.width, im.height));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(im.width * k));
        c.height = Math.max(1, Math.round(im.height * k));
        c.getContext('2d')?.drawImage(im, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.72));
      };
      im.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
