import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// 파일 하나(HTML)로 모든 것을 합치는 빌드: npm run build:single → dist-single/index.html
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { outDir: 'dist-single', emptyOutDir: true },
});
