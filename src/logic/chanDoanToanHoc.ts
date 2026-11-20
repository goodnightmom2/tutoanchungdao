import { DANH_SACH_CANH_GIOI } from '../duLieu/canhGioi';
import { DANH_SACH_KINH } from '../duLieu/tangKinhCac';
import { HoSoNguoiDung, KetQuaLuotDamMay } from '../kieuDuLieu/taiKhoan';
import {
  CauHoi,
  MaCanhGioi,
  MaGiaiDoan,
  TienTrinhNguoiChoi,
} from '../kieuDuLieu/troChoi';
import { khoaGiaiDoan, THU_TU_CANH_GIOI, THU_TU_GIAI_DOAN } from './tienTrinh';

export const TEN_GIAI_DOAN_NGAN: Record<MaGiaiDoan, string> = {
  soKy: 'Sơ kỳ',
  trungKy: 'Trung kỳ',
  hauKy: 'Hậu kỳ',
  dinhPhong: 'Đỉnh phong',
};

export const MUC_NHAN_THUC_GIAI_DOAN: Record<MaGiaiDoan, string> = {
  soKy: 'Nhận biết',
  trungKy: 'Thông hiểu',
  hauKy: 'Vận dụng',
  dinhPhong: 'Vận dụng cao',
};

export interface ChiSoKyNangCanhGioi {
  canhGioi: MaCanhGioi;
  tenCanhGioi: string;
  machKienThuc: string;
  soCauLam: number;
  soCauDung: number;
  tyLeDung: number | null; // null neu chua lam cau nao
  soSaoDat: number; // 0..12
  soGiaiDoanXong: number; // 0..4
  mucDanhGia: 'chuaHoc' | 'yeu' | 'trungBinh' | 'tot';
  kinhGoiY: string[];
}

export interface CauHoiTamMaChiTiet {
  ma: string;
  canhGioi: MaCanhGioi;
  giaiDoan: MaGiaiDoan;
  deBai: string;
  soLanLam: number;
  soLanSai: number;
}

export interface ChanDoanHocSinh {
  giaiDoanDangDung: {
    canhGioi: MaCanhGioi;
    tenCanhGioi: string;
    giaiDoan: MaGiaiDoan;
    tenGiaiDoan: string;
    mucNhanThuc: string;
  };
  kyNangTheoCanhGioi: ChiSoKyNangCanhGioi[];
  diemYeuUuTien: ChiSoKyNangCanhGioi[];
  tamMaChiTiet: CauHoiTamMaChiTiet[];
  tongSao: number;
}

export interface ThongKeCauHoiCtt {
  ma: string;
  deBai: string;
  canhGioi: MaCanhGioi;
  tenCanhGioi: string;
  giaiDoan: MaGiaiDoan;
  tenGiaiDoan: string;
  soLuotLam: number;
  soLuotDung: number;
  soLuotSai: number;
  chiSoDoKhoP: number; // P_j = soLuotDung / soLuotLam (CTT: 0..1)
  tyLeSai: number; // %
  phanLoaiDoKho: 'Rất khó' | 'Khó' | 'Trung bình' | 'Dễ';
}

export interface ChanDoanLopHoc {
  tongHocSinh: number;
  hoatDong7Ngay: number;
  diemSaoTrungBinh: number;
  tyLeDungTrungBinh: number;
  theoCanhGioi: {
    canhGioi: MaCanhGioi;
    tenCanhGioi: string;
    machKienThuc: string;
    soHocSinhDangO: number;
    tongCauLam: number;
    tongCauDung: number;
    tyLeDung: number | null;
    tyLeSai: number | null;
  }[];
  topCauSaiCtt: ThongKeCauHoiCtt[];
  machYeuNhat: { tenCanhGioi: string; machKienThuc: string; tyLeSai: number } | null;
}

function phanLoaiMuc(tyLe: number | null): 'chuaHoc' | 'yeu' | 'trungBinh' | 'tot' {
  if (tyLe === null) return 'chuaHoc';
  if (tyLe < 60) return 'yeu';
  if (tyLe < 80) return 'trungBinh';
  return 'tot';
}

export function chanDoanHocSinhChiTiet(
  tienTrinh: TienTrinhNguoiChoi,
  luotGanDay: KetQuaLuotDamMay[],
  nganHangCauHoi: CauHoi[]
): ChanDoanHocSinh {
  const mapCau = new Map<string, CauHoi>();
  for (const c of nganHangCauHoi) {
    mapCau.set(c.id, c);
  }

  // Xac dinh giai doan hien tai dang dung (giai doan dau tien chua hoan thanh trong canh gioi hien tai)
  const cgHienTai = tienTrinh.canhGioiHienTai || 'luyenKhi';
  let gdDangDung: MaGiaiDoan = 'dinhPhong';
  for (const gd of THU_TU_GIAI_DOAN) {
    const k = khoaGiaiDoan(cgHienTai, gd);
    if (!tienTrinh.tienDoGiaiDoan?.[k]?.hoanThanh) {
      gdDangDung = gd;
      break;
    }
  }
  const infoCgHienTai = DANH_SACH_CANH_GIOI.find((c) => c.id === cgHienTai) || DANH_SACH_CANH_GIOI[0];

  // Thong ke so cau lam / dung theo tung canh gioi tu lichSuCauHoi + ketQuaLuot + dongPhu
  const demTheoCg: Record<MaCanhGioi, { lam: number; dung: number }> = {
    luyenKhi: { lam: 0, dung: 0 },
    trucCo: { lam: 0, dung: 0 },
    kimDan: { lam: 0, dung: 0 },
    nguyenAnh: { lam: 0, dung: 0 },
    hoaThan: { lam: 0, dung: 0 },
    doKiep: { lam: 0, dung: 0 },
  };

  for (const [maCau, tk] of Object.entries(tienTrinh.lichSuCauHoi || {})) {
    const cau = mapCau.get(maCau);
    if (!cau) continue;
    demTheoCg[cau.canhGioi].lam += Number(tk.soLanLam || 0);
    demTheoCg[cau.canhGioi].dung += Number(tk.soLanDung || 0);
  }

  // Bo sung tu luotGanDay neu lichSuCauHoi rong
  for (const luot of luotGanDay) {
    if (demTheoCg[luot.canhGioi].lam === 0) {
      demTheoCg[luot.canhGioi].lam += luot.soCau || 0;
      demTheoCg[luot.canhGioi].dung += luot.soCauDung || 0;
    }
  }

  let tongSao = 0;
  const kyNangTheoCanhGioi: ChiSoKyNangCanhGioi[] = THU_TU_CANH_GIOI.map((cg) => {
    const info = DANH_SACH_CANH_GIOI.find((c) => c.id === cg)!;
    let saoCg = 0;
    let soGdXong = 0;
    for (const gd of THU_TU_GIAI_DOAN) {
      const td = tienTrinh.tienDoGiaiDoan?.[khoaGiaiDoan(cg, gd)];
      if (td?.hoanThanh) soGdXong += 1;
      saoCg += Number(td?.sao || 0);
    }
    tongSao += saoCg;

    const { lam, dung } = demTheoCg[cg];
    const tyLeDung = lam > 0 ? Math.round((dung / lam) * 100) : null;
    const kinhGoiY = DANH_SACH_KINH.filter(
      (k) => k.canhGioiMo === cg && (k.muc === 'loiThuongGap' || k.muc === 'congThuc')
    )
      .slice(0, 2)
      .map((k) => k.tieuDe);

    return {
      canhGioi: cg,
      tenCanhGioi: info.ten,
      machKienThuc: info.baiHoc,
      soCauLam: lam,
      soCauDung: dung,
      tyLeDung,
      soSaoDat: saoCg,
      soGiaiDoanXong: soGdXong,
      mucDanhGia: phanLoaiMuc(tyLeDung),
      kinhGoiY,
    };
  });

  const diemYeuUuTien = kyNangTheoCanhGioi
    .filter((k) => k.tyLeDung !== null && k.tyLeDung < 75)
    .sort((a, b) => (a.tyLeDung ?? 100) - (b.tyLeDung ?? 100));

  const soTamMa = tienTrinh.dongPhu?.soTamMa || [];
  const tamMaChiTiet: CauHoiTamMaChiTiet[] = soTamMa.map((ma) => {
    const cau = mapCau.get(ma);
    const ls = tienTrinh.lichSuCauHoi?.[ma];
    const lam = Number(ls?.soLanLam || 1);
    const dung = Number(ls?.soLanDung || 0);
    return {
      ma,
      canhGioi: cau?.canhGioi || 'luyenKhi',
      giaiDoan: cau?.giaiDoan || 'soKy',
      deBai: cau?.deBai || `Câu hỏi mã ${ma}`,
      soLanLam: lam,
      soLanSai: Math.max(1, lam - dung),
    };
  });

  return {
    giaiDoanDangDung: {
      canhGioi: cgHienTai,
      tenCanhGioi: infoCgHienTai.ten,
      giaiDoan: gdDangDung,
      tenGiaiDoan: TEN_GIAI_DOAN_NGAN[gdDangDung],
      mucNhanThuc: MUC_NHAN_THUC_GIAI_DOAN[gdDangDung],
    },
    kyNangTheoCanhGioi,
    diemYeuUuTien,
    tamMaChiTiet,
    tongSao,
  };
}

export function chanDoanLopHocToanDien(
  dsHocSinh: HoSoNguoiDung[],
  dsLuot: KetQuaLuotDamMay[],
  nganHangCauHoi: CauHoi[],
  bayGio = Date.now()
): ChanDoanLopHoc {
  const mapCau = new Map<string, CauHoi>();
  for (const c of nganHangCauHoi) {
    mapCau.set(c.id, c);
  }

  const bayNgayTruoc = bayGio - 7 * 24 * 60 * 60 * 1000;
  let hoatDong7Ngay = 0;
  let tongSaoLop = 0;
  let tongCauLamHs = 0;
  let tongCauDungHs = 0;

  const phanBoCg: Record<MaCanhGioi, number> = {
    luyenKhi: 0,
    trucCo: 0,
    kimDan: 0,
    nguyenAnh: 0,
    hoaThan: 0,
    doKiep: 0,
  };

  for (const hs of dsHocSinh) {
    const cg = hs.tomTat?.canhGioiHienTai || 'luyenKhi';
    if (cg in phanBoCg) phanBoCg[cg] += 1;
    tongSaoLop += Number(hs.tomTat?.tongSao || 0);
    tongCauLamHs += Number(hs.tomTat?.tongCauLam || 0);
    tongCauDungHs += Number(hs.tomTat?.tongCauDung || 0);
    const cuoi = Math.max(hs.dangNhapCuoi || 0, hs.tomTat?.hoatDongCuoi || 0);
    if (cuoi >= bayNgayTruoc) hoatDong7Ngay += 1;
  }

  const demCg: Record<MaCanhGioi, { lam: number; dung: number }> = {
    luyenKhi: { lam: 0, dung: 0 },
    trucCo: { lam: 0, dung: 0 },
    kimDan: { lam: 0, dung: 0 },
    nguyenAnh: { lam: 0, dung: 0 },
    hoaThan: { lam: 0, dung: 0 },
    doKiep: { lam: 0, dung: 0 },
  };

  const demCau: Record<string, { lam: number; dung: number }> = {};

  for (const luot of dsLuot) {
    if (luot.canhGioi in demCg) {
      demCg[luot.canhGioi].lam += Number(luot.soCau || 0);
      demCg[luot.canhGioi].dung += Number(luot.soCauDung || 0);
    }
    for (const ct of luot.chiTiet || []) {
      if (!ct?.ma) continue;
      if (!demCau[ct.ma]) demCau[ct.ma] = { lam: 0, dung: 0 };
      demCau[ct.ma].lam += 1;
      if (ct.dung) demCau[ct.ma].dung += 1;
    }
  }

  const theoCanhGioi = THU_TU_CANH_GIOI.map((cg) => {
    const info = DANH_SACH_CANH_GIOI.find((c) => c.id === cg)!;
    const { lam, dung } = demCg[cg];
    const tyLeDung = lam > 0 ? Math.round((dung / lam) * 100) : null;
    const tyLeSai = tyLeDung !== null ? 100 - tyLeDung : null;
    return {
      canhGioi: cg,
      tenCanhGioi: info.ten,
      machKienThuc: info.baiHoc,
      soHocSinhDangO: phanBoCg[cg],
      tongCauLam: lam,
      tongCauDung: dung,
      tyLeDung,
      tyLeSai,
    };
  });

  const topCauSaiCtt: ThongKeCauHoiCtt[] = Object.entries(demCau)
    .map(([ma, tk]) => {
      const cau = mapCau.get(ma);
      const sai = tk.lam - tk.dung;
      const p = tk.lam > 0 ? Number((tk.dung / tk.lam).toFixed(2)) : 0;
      const tyLeSai = tk.lam > 0 ? Math.round((sai / tk.lam) * 100) : 0;
      const phanLoaiDoKho: ThongKeCauHoiCtt['phanLoaiDoKho'] =
        p < 0.35 ? 'Rất khó' : p < 0.6 ? 'Khó' : p < 0.85 ? 'Trung bình' : 'Dễ';
      const cg = cau?.canhGioi || 'luyenKhi';
      const gd = cau?.giaiDoan || 'soKy';
      const infoCg = DANH_SACH_CANH_GIOI.find((c) => c.id === cg);
      return {
        ma,
        deBai: cau?.deBai || `Câu hỏi mã ${ma}`,
        canhGioi: cg,
        tenCanhGioi: infoCg?.ten || cg,
        giaiDoan: gd,
        tenGiaiDoan: TEN_GIAI_DOAN_NGAN[gd] || gd,
        soLuotLam: tk.lam,
        soLuotDung: tk.dung,
        soLuotSai: sai,
        chiSoDoKhoP: p,
        tyLeSai,
        phanLoaiDoKho,
      };
    })
    .filter((c) => c.soLuotSai > 0)
    .sort((a, b) => b.tyLeSai - a.tyLeSai || b.soLuotSai - a.soLuotSai)
    .slice(0, 15);

  const coDuLieu = theoCanhGioi.filter((c) => c.tyLeSai !== null && c.tongCauLam > 0);
  coDuLieu.sort((a, b) => (b.tyLeSai ?? 0) - (a.tyLeSai ?? 0));
  const yeuNhat = coDuLieu[0];

  return {
    tongHocSinh: dsHocSinh.length,
    hoatDong7Ngay,
    diemSaoTrungBinh:
      dsHocSinh.length > 0 ? Number((tongSaoLop / dsHocSinh.length).toFixed(1)) : 0,
    tyLeDungTrungBinh:
      tongCauLamHs > 0 ? Math.round((tongCauDungHs / tongCauLamHs) * 100) : 0,
    theoCanhGioi,
    topCauSaiCtt,
    machYeuNhat: yeuNhat
      ? {
          tenCanhGioi: yeuNhat.tenCanhGioi,
          machKienThuc: yeuNhat.machKienThuc,
          tyLeSai: yeuNhat.tyLeSai ?? 0,
        }
      : null,
  };
}
