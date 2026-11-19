import { GoogleGenAI, Type } from '@google/genai';

interface VercelReq {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: {
    canhGioi?: string;
    giaiDoan?: string;
    chuDe?: string;
    soLuong?: number;
  };
}

interface VercelRes {
  status: (code: number) => { json: (data: unknown) => void };
  json: (data: unknown) => void;
}

async function xacThucQuanTri(authHeader?: string): Promise<boolean> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.slice(7).trim();
  if (!token) return false;

  const supabaseUrl = (process.env.VITE_SUPABASE_URL || '').trim();
  const supabaseKey = (
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    ''
  ).trim();
  if (!supabaseUrl || !supabaseKey) return false;

  try {
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!userRes.ok) return false;
    const user = (await userRes.json()) as { id?: string };
    if (!user?.id) return false;

    const adminRes = await fetch(
      `${supabaseUrl}/rest/v1/quan_tri_vien?uid=eq.${encodeURIComponent(user.id)}&select=uid`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!adminRes.ok) return false;
    const rows = (await adminRes.json()) as unknown[];
    return Array.isArray(rows) && rows.length > 0;
  } catch {
    return false;
  }
}

export default async function handler(yeuCau: VercelReq, phanHoi: VercelRes) {
  if (yeuCau.method !== 'POST') {
    phanHoi.status(405).json({ loi: 'Chỉ hỗ trợ phương thức POST.' });
    return;
  }

  const rawAuth = yeuCau.headers?.authorization || yeuCau.headers?.Authorization;
  const authHeader = Array.isArray(rawAuth) ? rawAuth[0] : rawAuth;
  const laQuanTri = await xacThucQuanTri(authHeader);
  if (!laQuanTri) {
    phanHoi.status(403).json({
      loi: 'Chỉ Quản trị viên đã xác thực mới được phép sử dụng tính năng sinh câu hỏi.',
    });
    return;
  }

  const khoaApi = process.env.GEMINI_API_KEY;
  if (!khoaApi || khoaApi === 'MY_GEMINI_API_KEY') {
    phanHoi.status(400).json({
      loi: 'Chưa cấu hình khóa Gemini trên máy chủ. Hãy đặt GEMINI_API_KEY trong phần Environment Variables trên Vercel để sử dụng tính năng này.',
    });
    return;
  }

  try {
    const { canhGioi, giaiDoan, chuDe, soLuong } = yeuCau.body || {};
    const soCau = Math.min(Math.max(Number(soLuong) || 3, 1), 5);
    const cgSach = String(canhGioi || 'Luyện Khí').slice(0, 60);
    const gdSach = String(giaiDoan || 'Sơ kỳ').slice(0, 60);
    const cdSach = String(chuDe || 'Giá trị lượng giác và hệ thức lượng trong tam giác').slice(0, 160);
    const ai = new GoogleGenAI({ apiKey: khoaApi });

    const yeuCauNoiDung = [
      `Hãy tạo ${soCau} câu hỏi Toán lớp 10 (bộ Kết nối tri thức), Chương III: Hệ thức lượng trong tam giác.`,
      `Cảnh giới: ${cgSach}, Giai đoạn: ${gdSach}, Chủ đề trọng tâm: ${cdSach}.`,
      'Yêu cầu bắt buộc:',
      '- Viết hoàn toàn bằng tiếng Việt có dấu chuẩn xác, lồng ghép nhẹ nhàng bối cảnh tu tiên/cổ phong nhưng dữ kiện toán học phải rõ ràng, chính xác 100%.',
      '- Dùng ký hiệu KaTeX trong dấu $...$ cho công thức và góc độ (ví dụ $\\sin 60^\\circ$, $\\widehat{A} = 45^\\circ$).',
      '- Có 4 đáp án lựa chọn (A, B, C, D tương ứng mảng 4 chuỗi khác nhau hoàn toàn), trong đó dapAn là chỉ số 0, 1, 2 hoặc 3.',
      '- Có loiGiai từng bước chi tiết và goiY ngắn gọn.',
      '- Kiểm tra lại phép tính nhiều lần trước khi trả về.',
    ].join('\n');

    const ketQua = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
      model: 'gemini-2.5-flash',
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
}
