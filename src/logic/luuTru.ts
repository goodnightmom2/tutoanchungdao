import {
  BANG_MAU_DA,
  BANG_MAU_MAT,
  DANH_SACH_LINH_THU,
  KIEU_AO_NGOAI,
  KIEU_KHUON_MAT,
  KIEU_LONG_MAY,
  KIEU_MAT,
  KIEU_MIENG,
  KIEU_TOC,
  MU_PHU_KIEN_DAU,
  NHAN_VAT_GOC,
  PHAP_KHI_TAY,
  PHU_KIEN_THEM,
} from '../duLieu/ngoaiHinh';
import {
  CauHoi,
  DangNguoi,
  NgoaiHinh,
  NguHanh,
  TienTrinhNguoiChoi,
} from '../kieuDuLieu/troChoi';
import { PHIEN_BAN_LUU_TRU, taoTienTrinhMacDinh } from './tienTrinh';

export const KHOA_LUU_TRU_CU = 'tu_toan_chung_dao_tien_trinh_v1';
export const KHOA_LUU_TRU = 'tu_toan_chung_dao_khach_v4';

// Bo nho tam phong truong hop localStorage bi chan
let boNhoTam: string | null = null;

interface NgoaiHinhV1 {
  nhanVatGocId?: string;
  ten?: string;
  theHinh?: DangNguoi;
  mauDa?: number;
  kieuMat?: number;
  kieuMatMat?: number;
  mauMat?: number;
  longMay?: number;
  kieuMieng?: number;
  kieuToc?: number;
  mauToc?: string;
  aoDao?: number;
  mauAoChinh?: string;
  mauAoVien?: string;
  trangSucDau?: number;
  phapKhiTay?: number;
  phuKienThem?: number;
  linhThu?: number;
  haoQuang?: NguHanh;
}

export function chuyenDoiNgoaiHinhV1SangV2(
  raw: unknown,
  macDinh: NgoaiHinh
): NgoaiHinh {
  if (!raw || typeof raw !== 'object') {
    return { ...macDinh, trangPhuc: { ...macDinh.trangPhuc } };
  }
  const obj = raw as Record<string, unknown>;

  // Da la cau truc v2
  if (typeof obj.maMau === 'string' && obj.trangPhuc && typeof obj.trangPhuc === 'object') {
    const v2 = obj as unknown as NgoaiHinh;
    return {
      ...macDinh,
      ...v2,
      trangPhuc: {
        ...macDinh.trangPhuc,
        ...(v2.trangPhuc || {}),
      },
    };
  }

  // Cau truc v1 -> anh xa sang v2 giu nguyen tinh than nhan vat cu
  const v1 = obj as NgoaiHinhV1;
  const goc =
    NHAN_VAT_GOC.find((n) => n.id === v1.nhanVatGocId) || NHAN_VAT_GOC[0];
  const nen = goc.ngoaiHinhMacDinh;

  const mapAoIdx = [
    'xanhNgocCoCheo',
    'vangKemTayRong',
    'thanhY',
    'bachY',
    'hacY',
    'hongY',
    'hoangY',
    'tongMon',
  ];
  const mapMuIdx = [
    'khong',
    'ngocQuanDaiLua',
    'maoBac',
    'bangTranHoTam',
    'hoaSuTrang',
    'longVuBachHac',
    'matNaHuyenBi',
    'vongNhatNguyet',
  ];
  const mapPhapKhiIdx = [
    'khong',
    'kiemGo',
    'quatThuyMac',
    'butChuSa',
    'truongNgoc',
    'denLong',
  ];
  const mapPhuKienIdx = ['maHong', 'anChuSa', 'notRuoiLe', 'khuyenTaiNgoc'];

  const idxDa = typeof v1.mauDa === 'number' ? v1.mauDa : -1;
  const idxKMat = typeof v1.kieuMat === 'number' ? v1.kieuMat : -1;
  const idxMat = typeof v1.kieuMatMat === 'number' ? v1.kieuMatMat : -1;
  const idxMMat = typeof v1.mauMat === 'number' ? v1.mauMat : -1;
  const idxLM = typeof v1.longMay === 'number' ? v1.longMay : -1;
  const idxMieng = typeof v1.kieuMieng === 'number' ? v1.kieuMieng : -1;
  const idxToc = typeof v1.kieuToc === 'number' ? v1.kieuToc : -1;
  const idxAo = typeof v1.aoDao === 'number' ? v1.aoDao : -1;
  const idxMu = typeof v1.trangSucDau === 'number' ? v1.trangSucDau : -1;
  const idxPk = typeof v1.phapKhiTay === 'number' ? v1.phapKhiTay : -1;
  const idxPkt = typeof v1.phuKienThem === 'number' ? v1.phuKienThem : -1;
  const idxLt = typeof v1.linhThu === 'number' ? v1.linhThu : -1;

  return {
    maMau: goc.id,
    ten: typeof v1.ten === 'string' && v1.ten.trim() ? v1.ten : nen.ten,
    dangNguoi: v1.theHinh || nen.dangNguoi,
    mauDa: BANG_MAU_DA[idxDa]?.ma || nen.mauDa,
    kieuMat: KIEU_KHUON_MAT[idxKMat]?.ma || nen.kieuMat,
    mat: KIEU_MAT[idxMat]?.ma || nen.mat,
    mauMat: BANG_MAU_MAT[idxMMat]?.ma || nen.mauMat,
    longMay: KIEU_LONG_MAY[idxLM]?.ma || nen.longMay,
    mieng: KIEU_MIENG[idxMieng]?.ma || nen.mieng,
    toc: KIEU_TOC[idxToc]?.ma || nen.toc,
    mauToc: typeof v1.mauToc === 'string' ? v1.mauToc : nen.mauToc,
    muPhuKienDau:
      (idxMu >= 0 && MU_PHU_KIEN_DAU.some((m) => m.ma === mapMuIdx[idxMu])
        ? mapMuIdx[idxMu]
        : nen.muPhuKienDau),
    trangPhuc: {
      ...nen.trangPhuc,
      aoNgoai:
        (idxAo >= 0 && KIEU_AO_NGOAI.some((a) => a.ma === mapAoIdx[idxAo])
          ? mapAoIdx[idxAo]
          : nen.trangPhuc.aoNgoai),
      mauAoNgoai:
        typeof v1.mauAoChinh === 'string'
          ? v1.mauAoChinh
          : nen.trangPhuc.mauAoNgoai,
      mauVienAo:
        typeof v1.mauAoVien === 'string'
          ? v1.mauAoVien
          : nen.trangPhuc.mauVienAo,
    },
    phapKhi:
      (idxPk >= 0 && PHAP_KHI_TAY.some((p) => p.ma === mapPhapKhiIdx[idxPk])
        ? mapPhapKhiIdx[idxPk]
        : nen.phapKhi),
    phuKienThem:
      (idxPkt >= 0 && PHU_KIEN_THEM.some((p) => p.ma === mapPhuKienIdx[idxPkt])
        ? mapPhuKienIdx[idxPkt]
        : nen.phuKienThem),
    haoQuang: v1.haoQuang || nen.haoQuang,
    linhThu:
      idxLt === 0
        ? 'tieuNon'
        : DANH_SACH_LINH_THU[idxLt]?.ma || 'tieuNon',
  };
}

export function chuyenDoiTienTrinhCu(duLieu: unknown): TienTrinhNguoiChoi {
  const macDinh = taoTienTrinhMacDinh();
  if (!duLieu || typeof duLieu !== 'object') return macDinh;
  const parsed = duLieu as Partial<TienTrinhNguoiChoi> & Record<string, unknown>;

  const ngoaiHinh = chuyenDoiNgoaiHinhV1SangV2(
    parsed.ngoaiHinh,
    macDinh.ngoaiHinh
  );

  const canhGioiHienTai = CANH_GIOI_HOP_LE.has(String(parsed.canhGioiHienTai))
    ? (parsed.canhGioiHienTai as TienTrinhNguoiChoi['canhGioiHienTai'])
    : macDinh.canhGioiHienTai;

  const daoCuoiDaXem =
    parsed.daoCuoiDaXem === 'phamNhan' ||
    CANH_GIOI_HOP_LE.has(String(parsed.daoCuoiDaXem))
      ? (parsed.daoCuoiDaXem as TienTrinhNguoiChoi['daoCuoiDaXem'])
      : canhGioiHienTai;

  const cauHoiDaAn = Array.isArray(parsed.cauHoiDaAn)
    ? parsed.cauHoiDaAn.filter((x): x is string => typeof x === 'string')
    : [];

  const lichSuGanDay = Array.isArray(parsed.lichSuGanDay)
    ? parsed.lichSuGanDay.filter((x): x is string => typeof x === 'string').slice(-40)
    : cauHoiDaAn.slice(-40);

  const lichSuCauHoi =
    parsed.lichSuCauHoi && typeof parsed.lichSuCauHoi === 'object'
      ? parsed.lichSuCauHoi
      : {};

  return {
    ...macDinh,
    ...parsed,
    phienBan: PHIEN_BAN_LUU_TRU,
    maNguoiChoi:
      typeof parsed.maNguoiChoi === 'string' && parsed.maNguoiChoi.trim()
        ? parsed.maNguoiChoi
        : macDinh.maNguoiChoi,
    canhGioiHienTai,
    daoCuoiDaXem,
    daoVuaDotPha: parsed.daoVuaDotPha ?? null,
    ngoaiHinh,
    cauHoiDaAn,
    lichSuGanDay,
    lichSuCauHoi,
    caiDat: {
      ...macDinh.caiDat,
      ...(parsed.caiDat || {}),
      sinhDeMoiAI: Boolean(parsed.caiDat?.sinhDeMoiAI),
    },
    tuiDo: {
      ...macDinh.tuiDo,
      ...(parsed.tuiDo || {}),
    },
    tangKinhCac: {
      ...macDinh.tangKinhCac,
      ...(parsed.tangKinhCac || {}),
    },
    dongPhu: {
      ...macDinh.dongPhu,
      ...(parsed.dongPhu || {}),
    },
  };
}

export function docTienTrinh(): TienTrinhNguoiChoi {
  try {
    let raw: string | null = boNhoTam;
    if (typeof window !== 'undefined' && window.localStorage) {
      raw =
        window.localStorage.getItem(KHOA_LUU_TRU) ||
        window.localStorage.getItem(KHOA_LUU_TRU_CU);
    }
    if (!raw) return taoTienTrinhMacDinh();
    const parsed = JSON.parse(raw);
    return chuyenDoiTienTrinhCu(parsed);
  } catch {
    return taoTienTrinhMacDinh();
  }
}

export function luuTienTrinh(tienTrinh: TienTrinhNguoiChoi): boolean {
  try {
    const chuoi = JSON.stringify({
      ...tienTrinh,
      phienBan: PHIEN_BAN_LUU_TRU,
    });
    boNhoTam = chuoi;
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(KHOA_LUU_TRU, chuoi);
    }
    return true;
  } catch {
    return false;
  }
}

export function xoaTienTrinh(): TienTrinhNguoiChoi {
  boNhoTam = null;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(KHOA_LUU_TRU);
      window.localStorage.removeItem(KHOA_LUU_TRU_CU);
    }
  } catch {
    // Bo qua loi bo nho
  }
  return taoTienTrinhMacDinh();
}

const CANH_GIOI_HOP_LE = new Set([
  'luyenKhi',
  'trucCo',
  'kimDan',
  'nguyenAnh',
  'hoaThan',
  'doKiep',
]);
const GIAI_DOAN_HOP_LE = new Set(['soKy', 'trungKy', 'hauKy', 'dinhPhong']);
const DANG_HOP_LE = new Set(['tracNghiem', 'dienSo', 'dungSai']);

export function kiemTraHopLeNganHangCauHoi(duLieu: unknown): {
  hopLe: boolean;
  danhSach: CauHoi[];
  loi?: string;
} {
  if (!Array.isArray(duLieu)) {
    return {
      hopLe: false,
      danhSach: [],
      loi: 'Tệp JSON phải là một mảng danh sách câu hỏi.',
    };
  }

  const ketQua: CauHoi[] = [];
  for (let i = 0; i < duLieu.length; i++) {
    const c = duLieu[i] as Record<string, unknown>;
    if (!c || typeof c !== 'object') {
      return { hopLe: false, danhSach: [], loi: `Phần tử thứ ${i + 1} không hợp lệ.` };
    }
    if (
      typeof c.id !== 'string' ||
      !CANH_GIOI_HOP_LE.has(String(c.canhGioi)) ||
      !GIAI_DOAN_HOP_LE.has(String(c.giaiDoan)) ||
      !DANG_HOP_LE.has(String(c.dang)) ||
      typeof c.deBai !== 'string' ||
      typeof c.loiGiai !== 'string' ||
      typeof c.goiY !== 'string'
    ) {
      return {
        hopLe: false,
        danhSach: [],
        loi: `Câu hỏi thứ ${i + 1} thiếu trường bắt buộc hoặc mã cảnh giới/giai đoạn không khớp.`,
      };
    }

    if (c.dang !== 'dienSo') {
      if (!Array.isArray(c.luaChon) || c.luaChon.length < 2) {
        return {
          hopLe: false,
          danhSach: [],
          loi: `Câu "${c.id}" thiếu mảng lựa chọn đáp án.`,
        };
      }
      const idx = Number(c.dapAn);
      if (!Number.isInteger(idx) || idx < 0 || idx >= c.luaChon.length) {
        return {
          hopLe: false,
          danhSach: [],
          loi: `Câu "${c.id}" có chỉ số đáp án không hợp lệ.`,
        };
      }
    } else if (c.dapAn === undefined || c.dapAn === null || c.dapAn === '') {
      return {
        hopLe: false,
        danhSach: [],
        loi: `Câu điền số "${c.id}" thiếu đáp án.`,
      };
    }

    const nguonHopLe =
      c.nguon && typeof c.nguon === 'object' && typeof (c.nguon as { tep?: unknown }).tep === 'string'
        ? (c.nguon as CauHoi['nguon'])
        : typeof c.nguon === 'string'
        ? c.nguon
        : 'Giáo viên nhập';

    ketQua.push({
      ...(c as unknown as CauHoi),
      nguon: nguonHopLe,
      canDuyet: Boolean(c.canDuyet),
    });
  }

  return { hopLe: true, danhSach: ketQua };
}
