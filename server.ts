import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ungDung = express();
const CONG = Number(process.env.PORT || 3000);

ungDung.use(express.json({ limit: '1mb' }));

// Tuyen API tuy chon de giao vien sinh them cau hoi bang Gemini (kiem giai 2 lan)
ungDung.post('/api/sinh-cau-hoi', async (yeuCau, phanHoi) => {
  const khoaApi = process.env.GEMINI_API_KEY;
  if (!khoaApi || khoaApi === 'MY_GEMINI_API_KEY') {
    phanHoi.status(400).json({
      loi: 'Chưa cấu hình khóa Gemini trên máy chủ. Hãy đặt GEMINI_API_KEY trong phần Bí mật để sử dụng tính năng này.',
    });
    return;
  }

  try {
    const { canhGioi, giaiDoan, chuDe, soLuong } = yeuCau.body || {};
    const soCau = Math.min(Math.max(Number(soLuong) || 3, 1), 5);
    const ai = new GoogleGenAI({
      apiKey: khoaApi,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const yeuCauNoiDung = [
      `Hãy tạo ${soCau} câu hỏi Toán lớp 10 (bộ Kết nối tri thức), Chương III: Hệ thức lượng trong tam giác.`,
      `Cảnh giới: ${canhGioi || 'Luyện Khí'}, Giai đoạn: ${giaiDoan || 'Sơ kỳ'}, Chủ đề trọng tâm: ${chuDe || 'Giá trị lượng giác và hệ thức lượng trong tam giác'}.`,
      'Yêu cầu bắt buộc:',
      '- Viết hoàn toàn bằng tiếng Việt có dấu chuẩn xác, lồng ghép nhẹ nhàng bối cảnh tu tiên/cổ phong nhưng dữ kiện toán học phải rõ ràng, chính xác 100%.',
      '- Dùng ký hiệu KaTeX trong dấu $...$ cho công thức và góc độ (ví dụ $\\sin 60^\\circ$, $\\widehat{A} = 45^\\circ$).',
      '- Có 4 đáp án lựa chọn (A, B, C, D tương ứng mảng 4 chuỗi khác nhau hoàn toàn), trong đó dapAn là chỉ số 0, 1, 2 hoặc 3.',
      '- Có loiGiai từng bước chi tiết và goiY ngắn gọn.',
      '- Kiểm tra lại phép tính nhiều lần trước khi trả về.',
    ].join('\n');

    const ketQua = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: yeuCauNoiDung,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              deBai: { type: Type.STRING },
              luaChon: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              dapAn: { type: Type.INTEGER },
              loiGiai: { type: Type.STRING },
              goiY: { type: Type.STRING },
            },
            required: ['deBai', 'luaChon', 'dapAn', 'loiGiai', 'goiY'],
          },
        },
      },
    });

    interface CauSinhTho {
      deBai: string;
      luaChon: string[];
      dapAn: number;
      loiGiai: string;
      goiY: string;
    }

    const danhSachTho: CauSinhTho[] = JSON.parse((ketQua.text || '[]').trim());
    const danhSachCoBan = danhSachTho.filter(
      (item) =>
        item &&
        typeof item.deBai === 'string' &&
        item.deBai.trim().length > 10 &&
        Array.isArray(item.luaChon) &&
        item.luaChon.length === 4 &&
        new Set(item.luaChon.map((s) => String(s).trim())).size === 4 &&
        Number.isInteger(item.dapAn) &&
        item.dapAn >= 0 &&
        item.dapAn < 4 &&
        typeof item.loiGiai === 'string' &&
        item.loiGiai.trim().length > 5
    );

    if (danhSachCoBan.length === 0) {
      phanHoi.json({ danhSach: [] });
      return;
    }

    // Luot giai kiem chung doc lap lan 2 tren may chu
    const yeuCauKiemGiai = [
      'Hãy giải độc lập từng câu hỏi Toán lớp 10 sau đây từ dữ kiện đề bài, KHÔNG tin tưởng sẵn dapAn của người soạn.',
      'Với mỗi câu theo đúng thứ tự, trả về chỉ số đáp án đúng duy nhất (0..3) và hopLe = true nếu đề bài đủ dữ kiện, không mâu thuẫn và có đúng 1 đáp án chính xác.',
      JSON.stringify(
        danhSachCoBan.map((c, idx) => ({
          chiSo: idx,
          deBai: c.deBai,
          luaChon: c.luaChon,
        }))
      ),
    ].join('\n');

    const ketQuaKiem = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: yeuCauKiemGiai,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              chiSo: { type: Type.INTEGER },
              dapAnKiemChung: { type: Type.INTEGER },
              hopLe: { type: Type.BOOLEAN },
            },
            required: ['chiSo', 'dapAnKiemChung', 'hopLe'],
          },
        },
      },
    });

    interface KiemChungItem {
      chiSo: number;
      dapAnKiemChung: number;
      hopLe: boolean;
    }

    const ketQuaDoiChieu: KiemChungItem[] = JSON.parse(
      (ketQuaKiem.text || '[]').trim()
    );
    const danhSachDaXacMinh = danhSachCoBan.filter((cau, idx) => {
      const kc = ketQuaDoiChieu.find((k) => k.chiSo === idx);
      return Boolean(kc && kc.hopLe && kc.dapAnKiemChung === cau.dapAn);
    });

    phanHoi.json({ danhSach: danhSachDaXacMinh });
  } catch (err) {
    console.error('Loi sinh cau hoi:', err);
    phanHoi.status(500).json({
      loi: 'Không thể tạo câu hỏi vào lúc này. Vui lòng thử lại sau.',
    });
  }
});

async function khoiChayMayChu() {
  const laSanXuat = process.env.NODE_ENV === 'production';

  if (!laSanXuat) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    ungDung.use(vite.middlewares);
  } else {
    const thuMucDist = path.resolve(__dirname, 'dist');
    if (fs.existsSync(thuMucDist)) {
      ungDung.use(express.static(thuMucDist));
      ungDung.get('*', (_req, res) => {
        res.sendFile(path.join(thuMucDist, 'index.html'));
      });
    }
  }

  ungDung.listen(CONG, '0.0.0.0', () => {
    console.log(`May chu Tu Toan Chung Dao dang chay tai http://0.0.0.0:${CONG}`);
  });
}

khoiChayMayChu();
