# Tu Toán Chứng Đạo

Trò chơi học Toán lớp 10 (Chương III: Hệ thức lượng trong tam giác) phong cách thủy mặc tiên hiệp.

- **Web**: [https://tutoanchungdao.vercel.app](https://tutoanchungdao.vercel.app)
- **Công nghệ**: React 19, TypeScript, Vite 8, Tailwind CSS 4, KaTeX, Supabase (Auth + PostgreSQL + RLS), Vercel Serverless Functions.

## Phát triển cục bộ

```bash
cp .env.example .env.local
# Điền VITE_SUPABASE_URL và VITE_SUPABASE_PUBLISHABLE_KEY
npm install
npm run dev
```

## Biến môi trường

| Biến | Bắt buộc | Mô tả |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Có | URL dự án Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Có | Publishable key của Supabase |
| `GEMINI_API_KEY` | Tùy chọn | API key Gemini cho `/api/sinh-cau-hoi` |
