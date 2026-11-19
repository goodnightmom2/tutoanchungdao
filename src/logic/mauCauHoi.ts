import {
  CauHoi,
  HinhVe,
  MaCanhGioi,
  MaGiaiDoan,
  MucDoCauHoi,
  NguonCau,
} from '../kieuDuLieu/troChoi';
import { maKinhMacDinhChoCau } from './tangKinhCac';
import { THU_TU_CANH_GIOI, THU_TU_GIAI_DOAN } from './tienTrinh';

export interface ThamSoMau {
  [khoa: string]: number | string;
}

export interface MauCauHoi {
  maMau: string;
  canhGioi: MaCanhGioi;
  giaiDoan: MaGiaiDoan;
  dang: 'tracNghiem' | 'dienSo';
  dangBai: string;
  mucDo: MucDoCauHoi;
  nguon: NguonCau;
  boThamSo: ThamSoMau[];
  taoCauHoi: (ts: ThamSoMau, chiSoBienThe: number) => Omit<
    CauHoi,
    'id' | 'canhGioi' | 'giaiDoan' | 'dang' | 'dangBai' | 'mucDo' | 'nguon' | 'laBienThe' | 'maGoc' | 'canDuyet' | 'kinhLienQuan'
  >;
}

function ucln(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x || 1;
}

function dinhDangPhanSo(tu: number, mau: number): string {
  if (mau === 0) return '0';
  let t = Math.round(tu);
  let m = Math.round(mau);
  if (m < 0) {
    t = -t;
    m = -m;
  }
  const g = ucln(t, m);
  t /= g;
  m /= g;
  if (m === 1) return `${t}`;
  if (t < 0) return `-\\dfrac{${Math.abs(t)}}{${m}}`;
  return `\\dfrac{${t}}{${m}}`;
}

function chonBonPhuongAnDuyNhat(
  dung: string,
  ungVienSai: string[]
): string[] {
  const ketQua: string[] = [dung];
  for (const s of ungVienSai) {
    if (s && !ketQua.includes(s)) {
      ketQua.push(s);
    }
    if (ketQua.length === 4) break;
  }
  let bu = 1;
  while (ketQua.length < 4) {
    const duPhong = `$${bu * 3 + 7}$`;
    if (!ketQua.includes(duPhong)) ketQua.push(duPhong);
    bu++;
  }
  return ketQua;
}

// Bang gia tri luong giac goc dac biet dang LaTeX & dang so tu/mau
const GOC_DAC_BIET: Record<
  number,
  { sinTex: string; cosTex: string; tanTex: string; cotTex: string; sinVal: number; cosVal: number }
> = {
  30: { sinTex: '\\dfrac{1}{2}', cosTex: '\\dfrac{\\sqrt{3}}{2}', tanTex: '\\dfrac{\\sqrt{3}}{3}', cotTex: '\\sqrt{3}', sinVal: 0.5, cosVal: Math.sqrt(3) / 2 },
  45: { sinTex: '\\dfrac{\\sqrt{2}}{2}', cosTex: '\\dfrac{\\sqrt{2}}{2}', tanTex: '1', cotTex: '1', sinVal: Math.SQRT1_2, cosVal: Math.SQRT1_2 },
  60: { sinTex: '\\dfrac{\\sqrt{3}}{2}', cosTex: '\\dfrac{1}{2}', tanTex: '\\sqrt{3}', cotTex: '\\dfrac{\\sqrt{3}}{3}', sinVal: Math.sqrt(3) / 2, cosVal: 0.5 },
  120: { sinTex: '\\dfrac{\\sqrt{3}}{2}', cosTex: '-\\dfrac{1}{2}', tanTex: '-\\sqrt{3}', cotTex: '-\\dfrac{\\sqrt{3}}{3}', sinVal: Math.sqrt(3) / 2, cosVal: -0.5 },
  135: { sinTex: '\\dfrac{\\sqrt{2}}{2}', cosTex: '-\\dfrac{\\sqrt{2}}{2}', tanTex: '-1', cotTex: '-1', sinVal: Math.SQRT1_2, cosVal: -Math.SQRT1_2 },
  150: { sinTex: '\\dfrac{1}{2}', cosTex: '-\\dfrac{\\sqrt{3}}{2}', tanTex: '-\\dfrac{\\sqrt{3}}{3}', cotTex: '-\\sqrt{3}', sinVal: 0.5, cosVal: -Math.sqrt(3) / 2 },
};

const DANH_SACH_MAU_CAU_HOI: MauCauHoi[] = [
  // ================= 1. LUYẾN KHÍ =================
  {
    maMau: 'mau_lk_sk',
    canhGioi: 'luyenKhi',
    giaiDoan: 'soKy',
    dang: 'tracNghiem',
    dangBai: 'toaDoNuaDuongTron',
    mucDo: 'de',
    nguon: { tep: 'KNTT-SGK_1ee17597.pdf', trang: 34, soBai: 'Biến thể Ví dụ 1' },
    boThamSo: [
      { goc: 30, hoi: 'hoành độ $x_0$' },
      { goc: 45, hoi: 'tung độ $y_0$' },
      { goc: 60, hoi: 'hoành độ $x_0$' },
      { goc: 120, hoi: 'hoành độ $x_0$' },
      { goc: 135, hoi: 'tung độ $y_0$' },
      { goc: 150, hoi: 'hoành độ $x_0$' },
    ],
    taoCauHoi: (ts) => {
      const goc = Number(ts.goc);
      const hoi = String(ts.hoi);
      const laHoanhDo = hoi.includes('x_0');
      const g = GOC_DAC_BIET[goc];
      const dungTex = laHoanhDo ? g.cosTex : g.sinTex;
      const doiDau = dungTex.startsWith('-') ? dungTex.slice(1) : `-${dungTex}`;
      const dao = laHoanhDo ? g.sinTex : g.cosTex;
      const luaChon = chonBonPhuongAnDuyNhat(`$${dungTex}$`, [
        `$${doiDau}$`,
        `$${dao}$`,
        `$${g.tanTex}$`,
        `$0$`,
        `$1$`,
      ]);
      const hinhVe: HinhVe = {
        loai: 'nuaDuongTronDonVi',
        gocAlpha: goc,
        hienToaDo: true,
        nhanDiem: 'M',
      };
      return {
        deBai: `Trên nửa đường tròn đơn vị, điểm $M(x_0; y_0)$ ứng với tia linh khí tạo góc $\\alpha = ${goc}^\\circ$. Giá trị ${hoi} của điểm $M$ là bao nhiêu?`,
        hinhVe,
        luaChon,
        dapAn: 0,
        loiGiai: `Theo định nghĩa, $x_0 = \\cos ${goc}^\\circ = ${g.cosTex}$ và $y_0 = \\sin ${goc}^\\circ = ${g.sinTex}$. Vậy ${hoi} bằng $${dungTex}$.`,
        goiY: 'Trên nửa đường tròn đơn vị: hoành độ x₀ = cos α, tung độ y₀ = sin α.',
      };
    },
  },
  {
    maMau: 'mau_lk_tk',
    canhGioi: 'luyenKhi',
    giaiDoan: 'trungKy',
    dang: 'dienSo',
    dangBai: 'giaTriGocDacBiet',
    mucDo: 'trungBinh',
    nguon: { tep: '1_b221520d.pdf', trang: 1, soBai: 'Biến thể Câu 3' },
    boThamSo: [
      { a: 4, b: 6, c: 3 },
      { a: 6, b: 8, c: -2 },
      { a: 10, b: 4, c: 5 },
      { a: 8, b: 2, c: -3 },
      { a: 12, b: 6, c: 1 },
      { a: 14, b: 4, c: -4 },
    ],
    taoCauHoi: (ts) => {
      const a = Number(ts.a);
      const b = Number(ts.b);
      const c = Number(ts.c);
      // P = a*sin(30) + b*cos(60) + c*tan(45) = 0.5*a + 0.5*b + c
      const kq = (a + b) / 2 + c;
      const dauC = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
      return {
        deBai: `Để tụ linh vào đan điền, đạo hữu cần tính đúng mật mã $P = ${a}\\sin 30^\\circ + ${b}\\cos 60^\\circ ${dauC}\\tan 45^\\circ$. Giá trị $P$ bằng bao nhiêu?`,
        dapAn: String(kq),
        saiSo: 0.01,
        loiGiai: `Thay $\\sin 30^\\circ = \\dfrac{1}{2}$, $\\cos 60^\\circ = \\dfrac{1}{2}$, $\\tan 45^\\circ = 1$: $P = ${a}\\cdot\\dfrac{1}{2} + ${b}\\cdot\\dfrac{1}{2} ${dauC}\\cdot 1 = ${a / 2} + ${b / 2} ${dauC} = ${kq}$.`,
        goiY: 'Nhớ nhanh: sin 30° = cos 60° = 1/2 và tan 45° = 1.',
      };
    },
  },
  {
    maMau: 'mau_lk_hk',
    canhGioi: 'luyenKhi',
    giaiDoan: 'hauKy',
    dang: 'dienSo',
    dangBai: 'tinhBieuThucGocTu',
    mucDo: 'kho',
    nguon: { tep: '0C4B1.-Gi_-tr_-l__ng-gi_c-m_t-g_c-t_-0-180_fd168603.pdf', trang: 5, soBai: 'Biến thể Dạng 2' },
    boThamSo: [
      { a: 6, b: 4, c: 2 },
      { a: 8, b: 6, c: 3 },
      { a: 10, b: 8, c: -1 },
      { a: 4, b: 10, c: 5 },
      { a: 12, b: 4, c: -2 },
      { a: 6, b: 12, c: 4 },
    ],
    taoCauHoi: (ts) => {
      const a = Number(ts.a);
      const b = Number(ts.b);
      const c = Number(ts.c);
      // Q = a*cos(120) + b*sin(150) + c*tan(135) = -0.5*a + 0.5*b - c
      const kq = -a / 2 + b / 2 - c;
      const dauC = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
      return {
        deBai: `Tính linh áp trận đồ tại góc tù: $Q = ${a}\\cos 120^\\circ + ${b}\\sin 150^\\circ ${dauC}\\tan 135^\\circ$.`,
        dapAn: String(kq),
        saiSo: 0.01,
        loiGiai: `Ta có $\\cos 120^\\circ = -\\dfrac{1}{2}$, $\\sin 150^\\circ = \\dfrac{1}{2}$, $\\tan 135^\\circ = -1$. Do đó $Q = -${a / 2} + ${b / 2} ${c >= 0 ? `- ${c}` : `+ ${Math.abs(c)}`} = ${kq}$.`,
        goiY: 'Góc tù: cos 120° = -1/2, tan 135° = -1, còn sin 150° = +1/2.',
      };
    },
  },
  {
    maMau: 'mau_lk_dp',
    canhGioi: 'luyenKhi',
    giaiDoan: 'dinhPhong',
    dang: 'dienSo',
    dangBai: 'tongHopGocDacBiet',
    mucDo: 'vanDungCao',
    nguon: { tep: '2_1e8a60ae.pdf', trang: 3, soBai: 'Biến thể Đề 2' },
    boThamSo: [
      { a: 8, b: 4, c: 3 },
      { a: 12, b: 8, c: 5 },
      { a: 16, b: 12, c: 2 },
      { a: 10, b: 6, c: 4 },
      { a: 20, b: 8, c: 1 },
      { a: 6, b: 10, c: 6 },
    ],
    taoCauHoi: (ts) => {
      const a = Number(ts.a);
      const b = Number(ts.b);
      const c = Number(ts.c);
      // T = a*sin^2(60) + b*cos^2(135) + c*cos(180) = 0.75*a + 0.5*b - c
      const kq = 0.75 * a + 0.5 * b - c;
      return {
        deBai: `Trước bình cảnh Trúc Cơ, tính giá trị biểu thức $T = ${a}\\sin^2 60^\\circ + ${b}\\cos^2 135^\\circ + ${c}\\cos 180^\\circ$.`,
        dapAn: String(kq),
        saiSo: 0.01,
        loiGiai: `$\\sin^2 60^\\circ = \\dfrac{3}{4}$, $\\cos^2 135^\\circ = \\dfrac{1}{2}$, $\\cos 180^\\circ = -1$. Suy ra $T = ${0.75 * a} + ${0.5 * b} - ${c} = ${kq}$.`,
        goiY: 'Lưu ý bình phương giá trị âm (cos² 135° = (-√2/2)² = 1/2) luôn dương, còn cos 180° = -1.',
      };
    },
  },

  // ================= 2. TRÚC CƠ =================
  {
    maMau: 'mau_tc_sk',
    canhGioi: 'trucCo',
    giaiDoan: 'soKy',
    dang: 'dienSo',
    dangBai: 'gocBuGocPhu',
    mucDo: 'de',
    nguon: { tep: '0C4B1.-Gi_-tr_-l__ng-gi_c-m_t-g_c-t_-0-180_fd168603.pdf', trang: 7, soBai: 'Biến thể Bài 4' },
    boThamSo: [
      { goc1: 25, goc2: 35, a: 5, b: 4 },
      { goc1: 18, goc2: 40, a: 7, b: 6 },
      { goc1: 32, goc2: 20, a: 9, b: 5 },
      { goc1: 12, goc2: 50, a: 11, b: 3 },
      { goc1: 22, goc2: 15, a: 8, b: 7 },
      { goc1: 38, goc2: 28, a: 12, b: 9 },
    ],
    taoCauHoi: (ts) => {
      const goc1 = Number(ts.goc1);
      const goc2 = Number(ts.goc2);
      const a = Number(ts.a);
      const b = Number(ts.b);
      const buGoc1 = 180 - goc1;
      const phuGoc2 = 90 - goc2;
      // S = a*(sin^2(goc2) + sin^2(90-goc2)) + b*(cos(goc1) + cos(180-goc1)) = a
      return {
        deBai: `Rút gọn cột đá trận đồ Trúc Cơ: $S = ${a}\\left(\\sin^2 ${goc2}^\\circ + \\sin^2 ${phuGoc2}^\\circ\\right) + ${b}\\left(\\cos ${goc1}^\\circ + \\cos ${buGoc1}^\\circ\\right)$.`,
        dapAn: String(a),
        saiSo: 0.01,
        loiGiai: `Vì $${goc2}^\\circ + ${phuGoc2}^\\circ = 90^\\circ$ nên $\\sin ${phuGoc2}^\\circ = \\cos ${goc2}^\\circ$, suy ra $\\sin^2 ${goc2}^\\circ + \\sin^2 ${phuGoc2}^\\circ = 1$. Lại có $${goc1}^\\circ + ${buGoc1}^\\circ = 180^\\circ$ nên $\\cos ${buGoc1}^\\circ = -\\cos ${goc1}^\\circ$. Vậy $S = ${a}\\cdot 1 + ${b}\\cdot 0 = ${a}$.`,
        goiY: 'Hai góc phụ nhau có sin góc này bằng cos góc kia; hai góc bù nhau có cos đối nhau.',
      };
    },
  },
  {
    maMau: 'mau_tc_tk',
    canhGioi: 'trucCo',
    giaiDoan: 'trungKy',
    dang: 'tracNghiem',
    dangBai: 'hangDangThucLuongGiac',
    mucDo: 'trungBinh',
    nguon: { tep: 'KHTT-SBT_56221071.pdf', trang: 31, soBai: 'Biến thể Bài 3.3' },
    boThamSo: [
      { sinTu: 3, mau: 5, gocTu: 1 },
      { sinTu: 4, mau: 5, gocTu: 0 },
      { sinTu: 5, mau: 13, gocTu: 1 },
      { sinTu: 12, mau: 13, gocTu: 0 },
      { sinTu: 8, mau: 17, gocTu: 1 },
      { sinTu: 7, mau: 25, gocTu: 1 },
    ],
    taoCauHoi: (ts) => {
      const sinTu = Number(ts.sinTu);
      const mau = Number(ts.mau);
      const gocTu = Number(ts.gocTu) === 1;
      const cosTuAbs = Math.round(Math.sqrt(mau * mau - sinTu * sinTu));
      const cosTu = gocTu ? -cosTuAbs : cosTuAbs;
      const dung = `$${dinhDangPhanSo(cosTu, mau)}$`;
      const saiDau = `$${dinhDangPhanSo(-cosTu, mau)}$`;
      const sai2 = `$${dinhDangPhanSo(mau - sinTu, mau)}$`;
      const sai3 = `$${dinhDangPhanSo(gocTu ? -sinTu : sinTu, cosTuAbs)}$`;
      const luaChon = chonBonPhuongAnDuyNhat(dung, [saiDau, sai2, sai3, `$0$`]);
      const khoang = gocTu ? '90^\\circ < \\alpha < 180^\\circ' : '0^\\circ < \\alpha < 90^\\circ';
      return {
        deBai: `Cho $\\sin\\alpha = \\dfrac{${sinTu}}{${mau}}$ với $${khoang}$. Giá trị $\\cos\\alpha$ bằng:`,
        luaChon,
        dapAn: 0,
        loiGiai: `Từ $\\sin^2\\alpha + \\cos^2\\alpha = 1 \\Rightarrow \\cos^2\\alpha = 1 - \\dfrac{${sinTu * sinTu}}{${mau * mau}} = \\dfrac{${cosTuAbs * cosTuAbs}}{${mau * mau}}$. Do $${khoang}$ nên $\\cos\\alpha ${gocTu ? '< 0' : '> 0'}$, suy ra $\\cos\\alpha = ${dinhDangPhanSo(cosTu, mau)}$.`,
        goiY: 'Dùng sin²α + cos²α = 1 rồi xét dấu của cos α theo góc nhọn (> 0) hay góc tù (< 0).',
      };
    },
  },
  {
    maMau: 'mau_tc_hk',
    canhGioi: 'trucCo',
    giaiDoan: 'hauKy',
    dang: 'tracNghiem',
    dangBai: 'tinhTheoTan',
    mucDo: 'kho',
    nguon: { tep: '7_1975a155.pdf', trang: 2, soBai: 'Biến thể Câu 8' },
    boThamSo: [
      { t: 2, a: 3, b: 1, c: 2, d: -1 },
      { t: 3, a: 2, b: -1, c: 1, d: 2 },
      { t: -2, a: 3, b: 2, c: 1, d: -1 },
      { t: 4, a: 1, b: 3, c: 2, d: -3 },
      { t: -3, a: 2, b: 4, c: 1, d: 2 },
      { t: 5, a: 2, b: -2, c: 1, d: 3 },
    ],
    taoCauHoi: (ts) => {
      const t = Number(ts.t);
      const a = Number(ts.a);
      const b = Number(ts.b);
      const c = Number(ts.c);
      const d = Number(ts.d);
      const tu = a * t + b;
      const mau = c * t + d;
      const dung = `$${dinhDangPhanSo(tu, mau)}$`;
      const sai1 = `$${dinhDangPhanSo(-tu, mau)}$`;
      const sai2 = `$${dinhDangPhanSo(a + b * t, c + d * t)}$`;
      const sai3 = `$${dinhDangPhanSo(tu + 1, mau)}$`;
      const bStr = b >= 0 ? `+ ${b}\\cos\\alpha` : `- ${Math.abs(b)}\\cos\\alpha`;
      const dStr = d >= 0 ? `+ ${d}\\cos\\alpha` : `- ${Math.abs(d)}\\cos\\alpha`;
      const cStr = c === 1 ? '\\sin\\alpha' : `${c}\\sin\\alpha`;
      return {
        deBai: `Cho $\\tan\\alpha = ${t}$. Tính giá trị biểu thức $A = \\dfrac{${a}\\sin\\alpha ${bStr}}{${cStr} ${dStr}}$.`,
        luaChon: chonBonPhuongAnDuyNhat(dung, [sai1, sai2, sai3, '$1$']),
        dapAn: 0,
        loiGiai: `Vì $\\tan\\alpha = ${t}$ xác định nên $\\cos\\alpha \\ne 0$. Chia cả tử và mẫu cho $\\cos\\alpha$: $A = \\dfrac{${a}\\tan\\alpha ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}}{${c === 1 ? '' : c}\\tan\\alpha ${d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`}} = \\dfrac{${tu}}{${mau}} = ${dinhDangPhanSo(tu, mau)}$.`,
        goiY: 'Chia cả tử và mẫu của biểu thức đồng bậc theo sin α, cos α cho cos α để đưa về tan α.',
      };
    },
  },
  {
    maMau: 'mau_tc_dp',
    canhGioi: 'trucCo',
    giaiDoan: 'dinhPhong',
    dang: 'tracNghiem',
    dangBai: 'ketHopHangDangThuc',
    mucDo: 'vanDungCao',
    nguon: { tep: '8_fdb0e6cb.pdf', trang: 5, soBai: 'Biến thể Câu 14' },
    boThamSo: [
      { k: 3, hoi: 'tan2' },
      { k: 4, hoi: 'tan2' },
      { k: 5, hoi: 'tan2' },
      { tu: 7, mau: 5, hoi: 'sinCos' },
      { tu: 6, mau: 5, hoi: 'sinCos' },
      { tu: 1, mau: 5, hoi: 'sinCos' },
    ],
    taoCauHoi: (ts) => {
      if (String(ts.hoi) === 'tan2') {
        const k = Number(ts.k);
        const kq = k * k - 2;
        const luaChon = chonBonPhuongAnDuyNhat(`$${kq}$`, [
          `$${k * k}$`,
          `$${k * k + 2}$`,
          `$${k * 2}$`,
          `$${kq + 1}$`,
        ]);
        return {
          deBai: `Biết $\\tan\\alpha + \\cot\\alpha = ${k}$. Giá trị của $P = \\tan^2\\alpha + \\cot^2\\alpha$ là:`,
          luaChon,
          dapAn: 0,
          loiGiai: `Ta có $\\tan^2\\alpha + \\cot^2\\alpha = (\\tan\\alpha + \\cot\\alpha)^2 - 2\\tan\\alpha\\cot\\alpha = ${k}^2 - 2\\cdot 1 = ${kq}$.`,
          goiY: 'Bình phương hai vế và dùng tan α · cot α = 1.',
        };
      }
      const tu = Number(ts.tu);
      const mau = Number(ts.mau);
      // (sin + cos)^2 = 1 + 2*sin*cos => sin*cos = (tu^2 - mau^2)/(2*mau^2)
      const tuKq = tu * tu - mau * mau;
      const mauKq = 2 * mau * mau;
      const dung = `$${dinhDangPhanSo(tuKq, mauKq)}$`;
      const sai1 = `$${dinhDangPhanSo(tuKq + mau * mau, mauKq)}$`;
      const sai2 = `$${dinhDangPhanSo(-tuKq, mauKq)}$`;
      const sai3 = `$${dinhDangPhanSo(tuKq, mau * mau)}$`;
      return {
        deBai: `Biết $\\sin\\alpha + \\cos\\alpha = \\dfrac{${tu}}{${mau}}$. Giá trị tích $M = \\sin\\alpha\\cos\\alpha$ là:`,
        luaChon: chonBonPhuongAnDuyNhat(dung, [sai1, sai2, sai3, '$0$']),
        dapAn: 0,
        loiGiai: `Bình phương hai vế: $(\\sin\\alpha + \\cos\\alpha)^2 = 1 + 2\\sin\\alpha\\cos\\alpha = \\dfrac{${tu * tu}}{${mau * mau}} \\Rightarrow \\sin\\alpha\\cos\\alpha = \\dfrac{\\frac{${tu * tu}}{${mau * mau}} - 1}{2} = ${dinhDangPhanSo(tuKq, mauKq)}$.`,
        goiY: 'Dùng hằng đẳng thức (sin α + cos α)² = sin²α + cos²α + 2 sin α cos α = 1 + 2 sin α cos α.',
      };
    },
  },

  // ================= 3. KIM ĐAN =================
  {
    maMau: 'mau_kd_sk',
    canhGioi: 'kimDan',
    giaiDoan: 'soKy',
    dang: 'dienSo',
    dangBai: 'dinhLiCosinTimCanh',
    mucDo: 'de',
    nguon: { tep: 'KNTT-SGK_1ee17597.pdf', trang: 38, soBai: 'Biến thể Bài 3.7' },
    boThamSo: [
      { b: 3, c: 8, goc: 60 },
      { b: 5, c: 8, goc: 60 },
      { b: 3, c: 5, goc: 120 },
      { b: 7, c: 8, goc: 120 },
      { b: 7, c: 15, goc: 60 },
      { b: 5, c: 16, goc: 120 },
    ],
    taoCauHoi: (ts) => {
      const b = Number(ts.b);
      const c = Number(ts.c);
      const goc = Number(ts.goc);
      const cosA = goc === 60 ? 0.5 : -0.5;
      const a2 = Math.round(b * b + c * c - 2 * b * c * cosA);
      const a = Math.round(Math.sqrt(a2));
      const hinhVe: HinhVe = {
        loai: 'tamGiac',
        dinh: ['A', 'B', 'C'],
        doDaiCanh: [a, c, b],
        hienCanh: ['?', `${b}`, `${c}`],
        hienGoc: [`${goc}°`, '', ''],
        canhCanTinh: 0,
      };
      return {
        deBai: `Tam giác $ABC$ có $AC = ${b}$, $AB = ${c}$ và $\\widehat{A} = ${goc}^\\circ$. Tính độ dài cạnh $BC$.`,
        hinhVe,
        dapAn: String(a),
        saiSo: 0.01,
        loiGiai: `Áp dụng định lí côsin: $BC^2 = AB^2 + AC^2 - 2\\cdot AB\\cdot AC\\cos ${goc}^\\circ = ${c}^2 + ${b}^2 - 2\\cdot${c}\\cdot${b}\\cdot(${goc === 60 ? '\\frac{1}{2}' : '-\\frac{1}{2}'}) = ${a2} \\Rightarrow BC = ${a}$.`,
        goiY: 'Dùng định lí côsin: a² = b² + c² - 2bc cos A.',
      };
    },
  },
  {
    maMau: 'mau_kd_tk',
    canhGioi: 'kimDan',
    giaiDoan: 'trungKy',
    dang: 'dienSo',
    dangBai: 'heQuaCosinTimGoc',
    mucDo: 'trungBinh',
    nguon: { tep: '3_bd501052.pdf', trang: 2, soBai: 'Biến thể Câu 7' },
    boThamSo: [
      { a: 7, b: 3, c: 5 },
      { a: 7, b: 5, c: 8 },
      { a: 13, b: 7, c: 8 },
      { a: 13, b: 7, c: 15 },
      { a: 19, b: 5, c: 16 },
      { a: 19, b: 5, c: 21 },
    ],
    taoCauHoi: (ts) => {
      const a = Number(ts.a);
      const b = Number(ts.b);
      const c = Number(ts.c);
      const cosA = (b * b + c * c - a * a) / (2 * b * c);
      const gocA = Math.round((Math.acos(cosA) * 180) / Math.PI);
      return {
        deBai: `Luyện Đan Lô có ba cạnh $BC = ${a}$, $AC = ${b}$, $AB = ${c}$. Tính số đo góc $\\widehat{A}$ (tính theo độ).`,
        hinhVe: {
          loai: 'tamGiac',
          dinh: ['A', 'B', 'C'],
          doDaiCanh: [a, c, b],
          hienCanh: [`${a}`, `${b}`, `${c}`],
          hienGoc: ['?', '', ''],
          gocCanTinh: 0,
        },
        dapAn: String(gocA),
        donVi: '°',
        saiSo: 0.1,
        loiGiai: `Theo hệ quả định lí côsin: $\\cos A = \\dfrac{b^2 + c^2 - a^2}{2bc} = \\dfrac{${b * b} + ${c * c} - ${a * a}}{${2 * b * c}} = ${cosA > 0 ? '\\dfrac{1}{2}' : '-\\dfrac{1}{2}'} \\Rightarrow \\widehat{A} = ${gocA}^\\circ$.`,
        goiY: 'Áp dụng hệ quả định lí côsin: cos A = (b² + c² - a²)/(2bc).',
      };
    },
  },
  {
    maMau: 'mau_kd_hk',
    canhGioi: 'kimDan',
    giaiDoan: 'hauKy',
    dang: 'dienSo',
    dangBai: 'doKhoangCachThucTeCosin',
    mucDo: 'kho',
    nguon: { tep: '0C4B3.-Gi_i-tam-gi_c-_ng-d_ng_829acff2.pdf', trang: 12, soBai: 'Biến thể Đo hồ' },
    boThamSo: [
      { ob: 30, oc: 80, goc: 60 },
      { ob: 50, oc: 80, goc: 60 },
      { ob: 30, oc: 50, goc: 120 },
      { ob: 70, oc: 80, goc: 120 },
      { ob: 70, oc: 150, goc: 60 },
      { ob: 60, oc: 160, goc: 60 },
    ],
    taoCauHoi: (ts) => {
      const ob = Number(ts.ob);
      const oc = Number(ts.oc);
      const goc = Number(ts.goc);
      const cosO = goc === 60 ? 0.5 : -0.5;
      const bc2 = Math.round(ob * ob + oc * oc - 2 * ob * oc * cosO);
      const bc = Math.round(Math.sqrt(bc2));
      return {
        deBai: `Để đo khoảng cách giữa hai bến $B$ và $C$ bị ngăn bởi linh hồ, đệ tử đứng tại điểm $A$ đo được $AB = ${ob}\\text{ m}$, $AC = ${oc}\\text{ m}$ và $\\widehat{BAC} = ${goc}^\\circ$. Khoảng cách $BC$ bằng bao nhiêu mét?`,
        hinhVe: {
          loai: 'canhThucTe',
          mauCanh: 'khoangCachSong',
          nhanA: 'A',
          nhanB: 'B',
          nhanC: 'C',
          nhanCanh1: `${ob} m`,
          nhanCanh2: `${oc} m`,
          nhanGoc1: `${goc}°`,
        },
        dapAn: String(bc),
        donVi: 'm',
        saiSo: 0.1,
        loiGiai: `Theo định lí côsin: $BC = \\sqrt{AB^2 + AC^2 - 2\\cdot AB\\cdot AC\\cos ${goc}^\\circ} = \\sqrt{${bc2}} = ${bc}\\text{ m}$.`,
        goiY: 'Mô hình hóa thành tam giác ABC biết hai cạnh và góc xen giữa tại A.',
      };
    },
  },
  {
    maMau: 'mau_kd_dp',
    canhGioi: 'kimDan',
    giaiDoan: 'dinhPhong',
    dang: 'dienSo',
    dangBai: 'doDaiTrungTuyen',
    mucDo: 'vanDungCao',
    nguon: { tep: '0C4B2.-__nh-l_-cosin-__nh-l_-sin_b3f97574.pdf', trang: 14, soBai: 'Biến thể Trung tuyến' },
    boThamSo: [
      { a: 10, b: 7, c: 9 },
      { a: 6, b: 5, c: 7 },
      { a: 14, b: 13, c: 15 },
      { a: 8, b: 7, c: 9 },
      { a: 12, b: 7, c: 11 },
      { a: 16, b: 11, c: 13 },
    ],
    taoCauHoi: (ts) => {
      const a = Number(ts.a);
      const b = Number(ts.b);
      const c = Number(ts.c);
      // m_a^2 = (2(b^2 + c^2) - a^2) / 4
      const ma2 = (2 * (b * b + c * c) - a * a) / 4;
      return {
        deBai: `Trong tam giác $ABC$ có $BC = ${a}$, $AC = ${b}$, $AB = ${c}$. Gọi $M$ là trung điểm $BC$. Tính giá trị bình phương độ dài đường trung tuyến $AM^2$.`,
        hinhVe: {
          loai: 'tamGiac',
          dinh: ['A', 'B', 'C'],
          doDaiCanh: [a, c, b],
          hienCanh: [`${a}`, `${b}`, `${c}`],
          veThem: ['trungTuyenA'],
        },
        dapAn: String(ma2),
        saiSo: 0.01,
        loiGiai: `Áp dụng công thức đường trung tuyến xuất phát từ định lí côsin: $m_a^2 = \\dfrac{2(b^2 + c^2) - a^2}{4} = \\dfrac{2(${b * b} + ${c * c}) - ${a * a}}{4} = ${ma2}$.`,
        goiY: 'Công thức trung tuyến: mₐ² = [2(b² + c²) - a²] / 4.',
      };
    },
  },

  // ================= 4. NGUYÊN ANH =================
  {
    maMau: 'mau_na_sk',
    canhGioi: 'nguyenAnh',
    giaiDoan: 'soKy',
    dang: 'tracNghiem',
    dangBai: 'dinhLiSinBanKinhR',
    mucDo: 'de',
    nguon: { tep: 'CTST-SGK_4daa7058.pdf', trang: 68, soBai: 'Biến thể Bài 2' },
    boThamSo: [
      { a: 10, goc: 30 },
      { a: 12, goc: 45 },
      { a: 18, goc: 60 },
      { a: 14, goc: 150 },
      { a: 16, goc: 135 },
      { a: 24, goc: 120 },
    ],
    taoCauHoi: (ts) => {
      const a = Number(ts.a);
      const goc = Number(ts.goc);
      let dung = '';
      let sai1 = '';
      let sai2 = '';
      let sai3 = '';
      if (goc === 30 || goc === 150) {
        dung = `$${a}$`;
        sai1 = `$${a * 2}$`;
        sai2 = `$${a / 2}$`;
        sai3 = `$${a}\\sqrt{3}$`;
      } else if (goc === 45 || goc === 135) {
        dung = `$${a / 2}\\sqrt{2}$`;
        sai1 = `$${a}\\sqrt{2}$`;
        sai2 = `$${a / 2}$`;
        sai3 = `$${a}$`;
      } else {
        // sin 60 = sin 120 = sqrt(3)/2 => R = a / sqrt(3) = (a/3) sqrt(3)
        const k = a / 3;
        dung = `$${k}\\sqrt{3}$`;
        sai1 = `$${a}\\sqrt{3}$`;
        sai2 = `$${2 * k}\\sqrt{3}$`;
        sai3 = `$${a / 2}$`;
      }
      return {
        deBai: `Tam giác $ABC$ có cạnh $BC = ${a}$ và góc đối diện $\\widehat{A} = ${goc}^\\circ$. Bán kính đường tròn ngoại tiếp $R$ của tam giác $ABC$ bằng:`,
        luaChon: chonBonPhuongAnDuyNhat(dung, [sai1, sai2, sai3]),
        dapAn: 0,
        loiGiai: `Áp dụng định lí sin: $2R = \\dfrac{a}{\\sin A} \\Rightarrow R = \\dfrac{${a}}{2\\sin ${goc}^\\circ} = ${dung.slice(1, -1)}$.`,
        goiY: 'Định lí sin: a / sin A = 2R ⇒ R = a / (2 sin A).',
      };
    },
  },
  {
    maMau: 'mau_na_tk',
    canhGioi: 'nguyenAnh',
    giaiDoan: 'trungKy',
    dang: 'tracNghiem',
    dangBai: 'dinhLiSinTimCanh',
    mucDo: 'trungBinh',
    nguon: { tep: '5_59b8d7d8.pdf', trang: 2, soBai: 'Biến thể Câu 6' },
    boThamSo: [
      { a: 10, A: 30, B: 45 },
      { a: 12, A: 30, B: 60 },
      { a: 8, A: 30, B: 135 },
      { a: 14, A: 150, B: 60 },
      { a: 6, A: 45, B: 60 },
      { a: 18, A: 120, B: 45 },
    ],
    taoCauHoi: (ts) => {
      const a = Number(ts.a);
      const A = Number(ts.A);
      const B = Number(ts.B);
      let dung = '';
      let sai1 = '';
      let sai2 = '';
      let sai3 = '';
      if (A === 30 || A === 150) {
        if (B === 45 || B === 135) {
          dung = `$${a}\\sqrt{2}$`;
          sai1 = `$${a / 2}\\sqrt{2}$`;
          sai2 = `$${a}\\sqrt{3}$`;
          sai3 = `$${2 * a}$`;
        } else {
          dung = `$${a}\\sqrt{3}$`;
          sai1 = `$${a / 2}\\sqrt{3}$`;
          sai2 = `$${a}\\sqrt{2}$`;
          sai3 = `$${a}$`;
        }
      } else if (A === 45 && B === 60) {
        dung = `$${a / 2}\\sqrt{6}$`;
        sai1 = `$${a}\\sqrt{6}$`;
        sai2 = `$${a / 2}\\sqrt{3}$`;
        sai3 = `$${a}\\sqrt{2}$`;
      } else {
        // a=18, A=120, B=45 => b = 18 * (sqrt(2)/2) / (sqrt(3)/2) = 6*sqrt(6)
        dung = `$6\\sqrt{6}$`;
        sai1 = `$9\\sqrt{6}$`;
        sai2 = `$6\\sqrt{2}$`;
        sai3 = `$12\\sqrt{3}$`;
      }
      return {
        deBai: `Tam giác $ABC$ có $BC = ${a}$, $\\widehat{A} = ${A}^\\circ$ và $\\widehat{B} = ${B}^\\circ$. Độ dài cạnh $AC$ bằng:`,
        luaChon: chonBonPhuongAnDuyNhat(dung, [sai1, sai2, sai3]),
        dapAn: 0,
        loiGiai: `Áp dụng định lí sin: $\\dfrac{AC}{\\sin B} = \\dfrac{BC}{\\sin A} \\Rightarrow AC = \\dfrac{${a}\\cdot\\sin ${B}^\\circ}{\\sin ${A}^\\circ} = ${dung.slice(1, -1)}$.`,
        goiY: 'Đặt tỉ lệ thức b / sin B = a / sin A rồi thay giá trị sin các góc đặc biệt.',
      };
    },
  },
  {
    maMau: 'mau_na_hk',
    canhGioi: 'nguyenAnh',
    giaiDoan: 'hauKy',
    dang: 'dienSo',
    dangBai: 'doChieuCaoThap',
    mucDo: 'kho',
    nguon: { tep: '4_28ebdcf2.pdf', trang: 2, soBai: 'Biến thể Đo tháp' },
    boThamSo: [
      { d: 40, goc1: 30, goc2: 60 },
      { d: 60, goc1: 30, goc2: 60 },
      { d: 80, goc1: 30, goc2: 60 },
      { d: 30, goc1: 30, goc2: 45 },
      { d: 50, goc1: 30, goc2: 45 },
      { d: 100, goc1: 30, goc2: 60 },
    ],
    taoCauHoi: (ts) => {
      const d = Number(ts.d);
      const goc1 = Number(ts.goc1);
      const goc2 = Number(ts.goc2);
      const h =
        (d * Math.sin((goc1 * Math.PI) / 180) * Math.sin((goc2 * Math.PI) / 180)) /
        Math.sin(((goc2 - goc1) * Math.PI) / 180);
      const hLamTron = Number(h.toFixed(1));
      return {
        deBai: `Từ hai vị trí $A$ và $B$ cách nhau $AB = ${d}\\text{ m}$ thẳng hàng hướng về chân cổ tháp $H$, đệ tử ngắm đỉnh tháp $C$ với hai góc nâng $\\widehat{CAH} = ${goc1}^\\circ$ và $\\widehat{CBH} = ${goc2}^\\circ$ ($B$ gần chân tháp hơn $A$). Tính chiều cao cổ tháp $CH$ (làm tròn đến hàng phần mười, đơn vị mét).`,
        hinhVe: {
          loai: 'canhThucTe',
          mauCanh: 'chieuCaoNui',
          nhanA: 'A',
          nhanB: 'B',
          nhanC: 'C',
          nhanCanh1: `${d} m`,
          nhanGoc1: `${goc1}°`,
          nhanGoc2: `${goc2}°`,
        },
        dapAn: String(hLamTron),
        donVi: 'm',
        saiSo: 0.15,
        loiGiai: `Trong $\\triangle ABC$ có $\\widehat{ACB} = ${goc2}^\\circ - ${goc1}^\\circ = ${goc2 - goc1}^\\circ$. Theo định lí sin: $BC = \\dfrac{AB\\sin ${goc1}^\\circ}{\\sin ${goc2 - goc1}^\\circ}$. Khi đó $CH = BC\\sin ${goc2}^\\circ \\approx ${hLamTron}\\text{ m}$.`,
        goiY: 'Tính góc đỉnh ACB = β - α, dùng định lí sin trong ΔABC tìm BC rồi nhân sin β để ra chiều cao CH.',
      };
    },
  },
  {
    maMau: 'mau_na_dp',
    canhGioi: 'nguyenAnh',
    giaiDoan: 'dinhPhong',
    dang: 'dienSo',
    dangBai: 'tongHopBaGocVaSin',
    mucDo: 'vanDungCao',
    nguon: { tep: '9_21cdce69.pdf', trang: 7, soBai: 'Biến thể Câu 15' },
    boThamSo: [
      { a: 12, B: 75, C: 75 },
      { a: 18, B: 50, C: 100 },
      { a: 14, B: 45, C: 105 },
      { a: 10, B: 85, C: 65 },
      { a: 20, B: 60, C: 90 },
      { a: 16, B: 110, C: 40 },
    ],
    taoCauHoi: (ts) => {
      const a = Number(ts.a);
      const B = Number(ts.B);
      const C = Number(ts.C);
      const A = 180 - B - C; // Luon bang 30 do nen R = a / (2 sin 30) = a
      const R = Math.round(a / (2 * Math.sin((A * Math.PI) / 180)));
      return {
        deBai: `Tam giác $ABC$ có cạnh $BC = ${a}$, $\\widehat{B} = ${B}^\\circ$, $\\widehat{C} = ${C}^\\circ$. Tính bán kính $R$ của đường tròn ngoại tiếp tam giác $ABC$.`,
        dapAn: String(R),
        saiSo: 0.05,
        loiGiai: `Ta có $\\widehat{A} = 180^\\circ - (${B}^\\circ + ${C}^\\circ) = ${A}^\\circ$. Áp dụng định lí sin: $R = \\dfrac{BC}{2\\sin A} = \\dfrac{${a}}{2\\sin ${A}^\\circ} = ${R}$.`,
        goiY: 'Tìm góc A = 180° - (B + C) trước, sau đó dùng R = a / (2 sin A).',
      };
    },
  },

  // ================= 5. HÓA THẦN =================
  {
    maMau: 'mau_ht_sk',
    canhGioi: 'hoaThan',
    giaiDoan: 'soKy',
    dang: 'dienSo',
    dangBai: 'dienTichHeronCoBan',
    mucDo: 'de',
    nguon: { tep: 'KNTT-SGK_1ee17597.pdf', trang: 41, soBai: 'Biến thể Ví dụ 3' },
    boThamSo: [
      { a: 13, b: 14, c: 15 },
      { a: 5, b: 12, c: 13 },
      { a: 6, b: 8, c: 10 },
      { a: 10, b: 17, c: 21 },
      { a: 17, b: 25, c: 28 },
      { a: 20, b: 21, c: 29 },
    ],
    taoCauHoi: (ts) => {
      const a = Number(ts.a);
      const b = Number(ts.b);
      const c = Number(ts.c);
      const p = (a + b + c) / 2;
      const S = Math.round(Math.sqrt(p * (p - a) * (p - b) * (p - c)));
      return {
        deBai: `Khu linh điền hình tam giác có ba cạnh $a = ${a}$, $b = ${b}$, $c = ${c}$. Áp dụng công thức Hê-rông tính diện tích $S$ của khu linh điền.`,
        hinhVe: {
          loai: 'tamGiac',
          dinh: ['A', 'B', 'C'],
          doDaiCanh: [a, c, b],
          hienCanh: [`${a}`, `${b}`, `${c}`],
        },
        dapAn: String(S),
        saiSo: 0.05,
        loiGiai: `Nửa chu vi $p = \\dfrac{${a} + ${b} + ${c}}{2} = ${p}$. Theo công thức Hê-rông: $S = \\sqrt{${p}(${p}-${a})(${p}-${b})(${p}-${c})} = ${S}$.`,
        goiY: 'Tính nửa chu vi p = (a+b+c)/2 rồi thay vào S = √(p(p-a)(p-b)(p-c)).',
      };
    },
  },
  {
    maMau: 'mau_ht_tk',
    canhGioi: 'hoaThan',
    giaiDoan: 'trungKy',
    dang: 'dienSo',
    dangBai: 'banKinhNoiTiepDuongCao',
    mucDo: 'trungBinh',
    nguon: { tep: 'CD-SGK_c9eb611b.pdf', trang: 10, soBai: 'Biến thể Bài 5' },
    boThamSo: [
      { a: 13, b: 14, c: 15, hoi: 'r' },
      { a: 5, b: 12, c: 13, hoi: 'r' },
      { a: 6, b: 8, c: 10, hoi: 'r' },
      { a: 9, b: 10, c: 17, hoi: 'r' },
      { a: 13, b: 14, c: 15, hoi: 'hb' },
      { a: 10, b: 17, c: 21, hoi: 'ha' },
    ],
    taoCauHoi: (ts) => {
      const a = Number(ts.a);
      const b = Number(ts.b);
      const c = Number(ts.c);
      const hoi = String(ts.hoi);
      const p = (a + b + c) / 2;
      const S = Math.round(Math.sqrt(p * (p - a) * (p - b) * (p - c)));
      if (hoi === 'r') {
        const r = S / p;
        return {
          deBai: `Tam giác $ABC$ có ba cạnh $a = ${a}$, $b = ${b}$, $c = ${c}$. Tính bán kính đường tròn nội tiếp $r$ của tam giác.`,
          dapAn: String(r),
          saiSo: 0.05,
          loiGiai: `Ta có $p = ${p}$, $S = \\sqrt{${p}(${p}-${a})(${p}-${b})(${p}-${c})} = ${S}$. Suy ra $r = \\dfrac{S}{p} = \\dfrac{${S}}{${p}} = ${r}$.`,
          goiY: 'Tính diện tích S bằng công thức Hê-rông, sau đó dùng S = p · r ⇒ r = S / p.',
        };
      }
      const canhDay = hoi === 'hb' ? b : a;
      const tenCanh = hoi === 'hb' ? 'AC' : 'BC';
      const tenDc = hoi === 'hb' ? 'h_b' : 'h_a';
      const h = (2 * S) / canhDay;
      return {
        deBai: `Tam giác $ABC$ có $BC = ${a}$, $AC = ${b}$, $AB = ${c}$. Tính độ dài đường cao $${tenDc}$ hạ xuống cạnh $${tenCanh}$.`,
        dapAn: String(h),
        saiSo: 0.05,
        loiGiai: `Theo Hê-rông, $p = ${p} \\Rightarrow S = ${S}$. Suy ra $${tenDc} = \\dfrac{2S}{${canhDay}} = \\dfrac{${2 * S}}{${canhDay}} = ${h}$.`,
        goiY: 'Tính diện tích S bằng Hê-rông rồi dùng công thức h = 2S / đáy.',
      };
    },
  },
  {
    maMau: 'mau_ht_hk',
    canhGioi: 'hoaThan',
    giaiDoan: 'hauKy',
    dang: 'dienSo',
    dangBai: 'dienTichTuGiacThucTe',
    mucDo: 'kho',
    nguon: { tep: '0C4B3.-Gi_i-tam-gi_c-_ng-d_ng_829acff2.pdf', trang: 18, soBai: 'Biến thể Tứ giác' },
    boThamSo: [
      { d1: 6, d2: 8, b: 13, c: 15 },
      { d1: 5, d2: 12, b: 14, c: 15 },
      { d1: 8, d2: 15, b: 10, c: 21 },
      { d1: 9, d2: 12, b: 13, c: 14 },
      { d1: 12, d2: 16, b: 25, c: 28 },
      { d1: 15, d2: 20, b: 26, c: 28 },
    ],
    taoCauHoi: (ts) => {
      const d1 = Number(ts.d1);
      const d2 = Number(ts.d2);
      const b = Number(ts.b);
      const c = Number(ts.c);
      const ac = Math.round(Math.hypot(d1, d2));
      const s1 = (d1 * d2) / 2;
      const p2 = (ac + b + c) / 2;
      const s2 = Math.round(Math.sqrt(p2 * (p2 - ac) * (p2 - b) * (p2 - c)));
      const tongS = s1 + s2;
      return {
        deBai: `Một mảnh linh địa tứ giác $ABCD$ có $\\widehat{B} = 90^\\circ$, $AB = ${d1}\\text{ m}$, $BC = ${d2}\\text{ m}$, $CD = ${b}\\text{ m}$ và $DA = ${c}\\text{ m}$. Tính tổng diện tích mảnh linh địa (đơn vị $\\text{m}^2$).`,
        dapAn: String(tongS),
        donVi: 'm²',
        saiSo: 0.1,
        loiGiai: `Tam giác vuông $ABC$ có $S_{ABC} = \\dfrac{1}{2}\\cdot ${d1}\\cdot ${d2} = ${s1}$ và $AC = \\sqrt{${d1}^2 + ${d2}^2} = ${ac}$. Tam giác $ACD$ có ba cạnh $(${ac}; ${b}; ${c})$, nửa chu vi $p = ${p2}$ nên $S_{ACD} = ${s2}$. Tổng diện tích $S = ${s1} + ${s2} = ${tongS}\\text{ m}^2$.`,
        goiY: 'Chia tứ giác theo đường chéo AC: dùng Pitago tìm AC và diện tích ΔABC vuông, rồi dùng Hê-rông cho ΔACD.',
      };
    },
  },
  {
    maMau: 'mau_ht_dp',
    canhGioi: 'hoaThan',
    giaiDoan: 'dinhPhong',
    dang: 'dienSo',
    dangBai: 'tongHopNgoaiTiepNoiTiep',
    mucDo: 'vanDungCao',
    nguon: { tep: '0C4B2.-__nh-l_-cosin-__nh-l_-sin_b3f97574.pdf', trang: 20, soBai: 'Biến thể Bán kính' },
    boThamSo: [
      { k: 1, a: 6, b: 8, c: 10 },
      { k: 2, a: 6, b: 8, c: 10 },
      { k: 1, a: 5, b: 12, c: 13 },
      { k: 2, a: 5, b: 12, c: 13 },
      { k: 1, a: 13, b: 14, c: 15 },
      { k: 2, a: 13, b: 14, c: 15 },
    ],
    taoCauHoi: (ts) => {
      const k = Number(ts.k);
      const a = Number(ts.a) * k;
      const b = Number(ts.b) * k;
      const c = Number(ts.c) * k;
      const p = (a + b + c) / 2;
      const S = Math.round(Math.sqrt(p * (p - a) * (p - b) * (p - c)));
      const R = (a * b * c) / (4 * S);
      const r = S / p;
      const tich8Rr = Math.round(8 * R * r);
      return {
        deBai: `Cho tam giác $ABC$ có độ dài ba cạnh $a = ${a}$, $b = ${b}$, $c = ${c}$. Gọi $R, r$ lần lượt là bán kính đường tròn ngoại tiếp và nội tiếp tam giác. Tính giá trị $8Rr$.`,
        dapAn: String(tich8Rr),
        saiSo: 0.05,
        loiGiai: `Ta có $p = ${p}$, $S = ${S}$. Do $R = \\dfrac{abc}{4S}$ và $r = \\dfrac{S}{p}$ nên $8Rr = \\dfrac{2abc}{p} = \\dfrac{2\\cdot ${a}\\cdot ${b}\\cdot ${c}}{${p}} = ${tich8Rr}$.`,
        goiY: 'Rút gọn biểu thức R·r = (abc)/(4S) · (S/p) = abc/(4p) trước khi thay số.',
      };
    },
  },

  // ================= 6. ĐỘ KIẾP =================
  {
    maMau: 'mau_dk_sk',
    canhGioi: 'doKiep',
    giaiDoan: 'soKy',
    dang: 'dienSo',
    dangBai: 'giaiTamGiacCoBan',
    mucDo: 'de',
    nguon: { tep: 'KNTT-SGK_1ee17597.pdf', trang: 43, soBai: 'Biến thể Bài 3.12' },
    boThamSo: [
      { b: 3, c: 5, goc: 120 },
      { b: 5, c: 8, goc: 60 },
      { b: 7, c: 8, goc: 120 },
      { b: 3, c: 8, goc: 60 },
      { b: 7, c: 15, goc: 60 },
      { b: 5, c: 16, goc: 120 },
    ],
    taoCauHoi: (ts) => {
      const b = Number(ts.b);
      const c = Number(ts.c);
      const goc = Number(ts.goc);
      const cosA = goc === 60 ? 0.5 : -0.5;
      const a = Math.round(Math.sqrt(b * b + c * c - 2 * b * c * cosA));
      const chuVi = a + b + c;
      return {
        deBai: `Giải tam giác $ABC$ biết $b = ${b}$, $c = ${c}$ và $\\widehat{A} = ${goc}^\\circ$. Tính chu vi của tam giác $ABC$.`,
        dapAn: String(chuVi),
        saiSo: 0.05,
        loiGiai: `Theo định lí côsin: $a = \\sqrt{${b}^2 + ${c}^2 - 2\\cdot${b}\\cdot${c}\\cos ${goc}^\\circ} = ${a}$. Chu vi $2p = ${a} + ${b} + ${c} = ${chuVi}$.`,
        goiY: 'Tìm cạnh a bằng định lí côsin rồi cộng cả ba cạnh.',
      };
    },
  },
  {
    maMau: 'mau_dk_tk',
    canhGioi: 'doKiep',
    giaiDoan: 'trungKy',
    dang: 'tracNghiem',
    dangBai: 'nhanDangTamGiac',
    mucDo: 'trungBinh',
    nguon: { tep: '0C4B4.-_n-t_p-ch__ng-IV_712e7a9a.pdf', trang: 6, soBai: 'Biến thể Câu 12' },
    boThamSo: [
      { a: 6, b: 8, c: 10, loai: 'Tam giác vuông' },
      { a: 5, b: 7, c: 9, loai: 'Tam giác tù' },
      { a: 6, b: 7, c: 8, loai: 'Tam giác nhọn' },
      { a: 5, b: 12, c: 13, loai: 'Tam giác vuông' },
      { a: 4, b: 6, c: 8, loai: 'Tam giác tù' },
      { a: 7, b: 8, c: 9, loai: 'Tam giác nhọn' },
    ],
    taoCauHoi: (ts) => {
      const a = Number(ts.a);
      const b = Number(ts.b);
      const c = Number(ts.c);
      const loai = String(ts.loai);
      const hieu = a * a + b * b - c * c;
      const dau = hieu === 0 ? '=' : hieu > 0 ? '>' : '<';
      return {
        deBai: `Cho tam giác $ABC$ có độ dài ba cạnh là $${a}$, $${b}$, $${c}$. Kết luận nào sau đây đúng nhất về dạng tam giác $ABC$?`,
        luaChon: chonBonPhuongAnDuyNhat(loai, [
          'Tam giác nhọn',
          'Tam giác vuông',
          'Tam giác tù',
          'Tam giác đều',
        ]),
        dapAn: 0,
        loiGiai: `Xét cạnh lớn nhất là $${c}$: ta có $${a}^2 + ${b}^2 = ${a * a + b * b} ${dau} ${c * c} = ${c}^2$, nên $\\cos C ${hieu === 0 ? '= 0' : hieu > 0 ? '> 0' : '< 0'}$. Vậy đây là ${loai.toLowerCase()}.`,
        goiY: 'So sánh tổng bình phương hai cạnh nhỏ với bình phương cạnh lớn nhất.',
      };
    },
  },
  {
    maMau: 'mau_dk_hk',
    canhGioi: 'doKiep',
    giaiDoan: 'hauKy',
    dang: 'dienSo',
    dangBai: 'haiTrinhTauThuyen',
    mucDo: 'kho',
    nguon: { tep: 'KHTT-SBT_56221071.pdf', trang: 41, soBai: 'Biến thể Bài 3.24' },
    boThamSo: [
      { v1: 15, v2: 25, gio: 2, goc: 120 },
      { v1: 25, v2: 40, gio: 2, goc: 60 },
      { v1: 15, v2: 40, gio: 2, goc: 60 },
      { v1: 35, v2: 40, gio: 1, goc: 120 },
      { v1: 21, v2: 35, gio: 1, goc: 120 },
      { v1: 18, v2: 48, gio: 1, goc: 60 },
    ],
    taoCauHoi: (ts) => {
      const v1 = Number(ts.v1);
      const v2 = Number(ts.v2);
      const gio = Number(ts.gio);
      const goc = Number(ts.goc);
      const d1 = v1 * gio;
      const d2 = v2 * gio;
      const cosG = goc === 60 ? 0.5 : -0.5;
      const khoangCach = Math.round(Math.sqrt(d1 * d1 + d2 * d2 - 2 * d1 * d2 * cosG));
      return {
        deBai: `Hai linh chu xuất phát cùng lúc từ Tiên Cảng theo hai hướng hợp với nhau góc $${goc}^\\circ$, giữ vận tốc lần lượt là $${v1}\\text{ km/h}$ và $${v2}\\text{ km/h}$. Sau $${gio}$ giờ, hai linh chu cách nhau bao nhiêu ki-lô-mét?`,
        hinhVe: {
          loai: 'canhThucTe',
          mauCanh: 'thuyenBien',
          nhanA: 'O',
          nhanB: 'A',
          nhanC: 'B',
          nhanCanh1: `${d1} km`,
          nhanCanh2: `${d2} km`,
          nhanGoc1: `${goc}°`,
        },
        dapAn: String(khoangCach),
        donVi: 'km',
        saiSo: 0.1,
        loiGiai: `Quãng đường hai linh chu đi được là $OA = ${d1}\\text{ km}$, $OB = ${d2}\\text{ km}$. Khoảng cách $AB = \\sqrt{${d1}^2 + ${d2}^2 - 2\\cdot${d1}\\cdot${d2}\\cos ${goc}^\\circ} = ${khoangCach}\\text{ km}$.`,
        goiY: 'Tính quãng đường d₁ = v₁·t, d₂ = v₂·t rồi dùng định lí côsin với góc xen giữa.',
      };
    },
  },
  {
    maMau: 'mau_dk_dp',
    canhGioi: 'doKiep',
    giaiDoan: 'dinhPhong',
    dang: 'dienSo',
    dangBai: 'tongOnHeThucLuong',
    mucDo: 'vanDungCao',
    nguon: { tep: '10_12b1b342.pdf', trang: 5, soBai: 'Biến thể Tổng ôn cuối chương' },
    boThamSo: [
      { a: 13, b: 14, c: 15 },
      { a: 5, b: 12, c: 13 },
      { a: 6, b: 8, c: 10 },
      { a: 10, b: 17, c: 21 },
      { a: 17, b: 25, c: 28 },
      { a: 20, b: 21, c: 29 },
    ],
    taoCauHoi: (ts) => {
      const a = Number(ts.a);
      const b = Number(ts.b);
      const c = Number(ts.c);
      const p = (a + b + c) / 2;
      const S = Math.round(Math.sqrt(p * (p - a) * (p - b) * (p - c)));
      const tong = S + p;
      return {
        deBai: `Tại Đài Độ Kiếp cuối cùng, xét tam giác $ABC$ có $a = ${a}$, $b = ${b}$, $c = ${c}$. Biết $r$ là bán kính đường tròn nội tiếp, tính giá trị biểu thức $K = S + \\dfrac{S}{r}$.`,
        dapAn: String(tong),
        saiSo: 0.05,
        loiGiai: `Vì $S = p\\cdot r$ nên $\\dfrac{S}{r} = p = \\dfrac{${a}+${b}+${c}}{2} = ${p}$. Theo Hê-rông, $S = ${S}$. Do đó $K = ${S} + ${p} = ${tong}$.`,
        goiY: 'Sử dụng đẳng thức S = p · r để thay S/r = p, sau đó tính S bằng Hê-rông.',
      };
    },
  },
];

export function sinhTatCaBienTheTuMau(): CauHoi[] {
  const ketQua: CauHoi[] = [];
  for (const mau of DANH_SACH_MAU_CAU_HOI) {
    mau.boThamSo.forEach((ts, idx) => {
      const noiDung = mau.taoCauHoi(ts, idx);
      ketQua.push({
        id: `${mau.maMau}_bt${idx + 1}`,
        canhGioi: mau.canhGioi,
        giaiDoan: mau.giaiDoan,
        dang: mau.dang,
        dangBai: mau.dangBai,
        mucDo: mau.mucDo,
        ...noiDung,
        nguon: {
          ...mau.nguon,
          soBai: `${mau.nguon.soBai || 'Mẫu'} #${idx + 1}`,
        },
        laBienThe: true,
        maGoc: mau.maMau,
        canDuyet: false,
        kinhLienQuan: maKinhMacDinhChoCau(mau.canhGioi, mau.giaiDoan),
      });
    });
  }
  return ketQua;
}

export interface BaoCaoToanVenNganHang {
  hopLe: boolean;
  tongCau: number;
  soCauGoc: number;
  soBienThe: number;
  tyLeBienThe: number;
  minMoiO: number;
  baoCaoO: Array<{
    canhGioi: MaCanhGioi;
    giaiDoan: MaGiaiDoan;
    tong: number;
    bienThe: number;
  }>;
  loiChiTiet: string[];
}

export function kiemTraToanVenNganHang(
  nganHang: CauHoi[]
): BaoCaoToanVenNganHang {
  const loiChiTiet: string[] = [];
  const tapId = new Set<string>();
  let soBienThe = 0;

  for (const ch of nganHang) {
    if (tapId.has(ch.id)) {
      loiChiTiet.push(`Trùng mã câu hỏi: ${ch.id}`);
    }
    tapId.add(ch.id);

    if (ch.laBienThe) soBienThe++;

    if (!ch.deBai || ch.deBai.trim().length < 10) {
      loiChiTiet.push(`Đề bài quá ngắn hoặc rỗng ở ${ch.id}`);
    }
    if (!ch.loiGiai || ch.loiGiai.trim().length < 5) {
      loiChiTiet.push(`Thiếu lời giải chi tiết ở ${ch.id}`);
    }
    if (!ch.goiY || ch.goiY.trim().length < 5) {
      loiChiTiet.push(`Thiếu gợi ý ở ${ch.id}`);
    }

    if (ch.dang === 'dienSo') {
      const val = Number(String(ch.dapAn).replace(',', '.'));
      if (!Number.isFinite(val)) {
        loiChiTiet.push(`Đáp án điền số không hợp lệ ở ${ch.id}: ${ch.dapAn}`);
      }
    } else {
      const luaChon = ch.luaChon || [];
      if (luaChon.length < 2) {
        loiChiTiet.push(`Thiếu lựa chọn ở ${ch.id}`);
      }
      const tapLc = new Set(luaChon.map((s) => s.trim()));
      if (tapLc.size !== luaChon.length) {
        loiChiTiet.push(`Trùng phương án lựa chọn ở ${ch.id}`);
      }
      const idx = Number(ch.dapAn);
      if (!Number.isInteger(idx) || idx < 0 || idx >= luaChon.length) {
        loiChiTiet.push(`Chỉ số đáp án sai phạm vi ở ${ch.id}: ${ch.dapAn}`);
      }
    }
  }

  const baoCaoO: BaoCaoToanVenNganHang['baoCaoO'] = [];
  let minMoiO = Infinity;
  for (const cg of THU_TU_CANH_GIOI) {
    for (const gd of THU_TU_GIAI_DOAN) {
      const trongO = nganHang.filter(
        (c) => c.canhGioi === cg && c.giaiDoan === gd
      );
      const btO = trongO.filter((c) => c.laBienThe).length;
      if (trongO.length < 12) {
        loiChiTiet.push(
          `Ô ${cg} · ${gd} chỉ có ${trongO.length} câu (yêu cầu ≥ 12 câu).`
        );
      }
      if (trongO.length < minMoiO) minMoiO = trongO.length;
      baoCaoO.push({
        canhGioi: cg,
        giaiDoan: gd,
        tong: trongO.length,
        bienThe: btO,
      });
    }
  }

  const tongCau = nganHang.length;
  const soCauGoc = tongCau - soBienThe;
  const tyLeBienThe = tongCau > 0 ? soBienThe / tongCau : 0;
  if (tyLeBienThe < 0.4) {
    loiChiTiet.push(
      `Tỷ lệ câu biến thể tham số hóa đạt ${Math.round(tyLeBienThe * 100)}% (< 40%).`
    );
  }

  return {
    hopLe: loiChiTiet.length === 0,
    tongCau,
    soCauGoc,
    soBienThe,
    tyLeBienThe,
    minMoiO: Number.isFinite(minMoiO) ? minMoiO : 0,
    baoCaoO,
    loiChiTiet,
  };
}
