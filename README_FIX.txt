TRI-LIFT FIX PACK (untuk error import @/components/ui/* dan tsconfigPaths)

1) STOP server (Ctrl + C) di terminal.
2) Copy folder 'src/components/ui' dari ZIP ini ke:
   D:\github\Tri-LIFT\trilift\src\components\ui
   (merge/replace jika diminta)

3) Replace file vite.config.js Anda dengan vite.config.js di ZIP ini
   (ini mengaktifkan alias '@' -> './src' TANPA plugin vite-tsconfig-paths)

4) Pastikan file jsconfig.json berada di root proyek (sejajar package.json)

5) Install library yang diperlukan (sekali saja):
   npm install recharts lucide-react

6) Jalankan ulang:
   npm run dev
