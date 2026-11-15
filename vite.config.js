import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

function copyStaticDirsPlugin() {
  return {
    name: 'copy-orbitar-static-dirs',
    closeBundle() {
      const dirs = ['assets', 'css', 'js', 'public'];
      for (const dir of dirs) {
        const src = path.resolve(process.cwd(), dir);
        const dest = path.resolve(process.cwd(), 'dist', dir);
        if (fs.existsSync(src)) {
          fs.cpSync(src, dest, { recursive: true, force: true });
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [copyStaticDirsPlugin()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0
  }
});
