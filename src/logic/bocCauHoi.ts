import {
  CauHoi,
  MaCanhGioi,
  MaGiaiDoan,
  TienTrinhNguoiChoi,
} from '../kieuDuLieu/troChoi';
import { THU_TU_CANH_GIOI } from './tienTrinh';

/**
 * Bam chuoi FNV-1a 32-bit de tao hat giong tat dinh.
 */
export function bamFNV1a(chuoi: string): number {
  let hash = 2166136261;
  for (let i = 0; i < chuoi.length; i++) {
    hash ^= chuoi.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Bo sinh so gia ngau nhien Mulberry32 cho phep tai lap hoan hao theo seed.
 */
export function taoBoSinhNgauNhien(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Xao tron cac phuong an trac nghiem theo PRNG, giu phuong an "ca ... deu dung" o cuoi.
 */
export function xaoTronPhuongAnAnToan(
  cauHoi: CauHoi,
  rng: () => number = Math.random
): CauHoi {
  if (
    cauHoi.dang !== 'tracNghiem' ||
    !cauHoi.luaChon ||
    cauHoi.luaChon.length < 2
  ) {
    return cauHoi;
  }

  const chiSoDungGoc = Number(cauHoi.dapAn);
  const coDinhCuoi = cauHoi.luaChon.map((noiDung, idx) => ({
    noiDung,
    laDung: idx === chiSoDungGoc,
    giuCuoi: /cả\s+(ba|bốn|hai|3|4|2)?\s*(ý|phương án|đáp án)?\s*đều\s+đúng/i.test(
      noiDung
    ),
  }));

  const phanXao = coDinhCuoi.filter((x) => !x.giuCuoi);
  const phanCuoi = coDinhCuoi.filter((x) => x.giuCuoi);

  for (let i = phanXao.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [phanXao[i], phanXao[j]] = [phanXao[j], phanXao[i]];
  }

  const gop = [...phanXao, ...phanCuoi];
  return {
    ...cauHoi,
    luaChon: gop.map((c) => c.noiDung),
    dapAn: Math.max(0, gop.findIndex((c) => c.laDung)),
  };
}

export interface ThamSoBocCauHoi {
  nganHang: CauHoi[];
  tienTrinh: TienTrinhNguoiChoi;
  canhGioi: MaCanhGioi;
  giaiDoan?: MaGiaiDoan | 'yeuVuong' | 'tatCa';
  soLuong: number;
  loaiTruIds?: string[];
  thoiGianMo?: number;
  luotMo?: number;
  choPhepGiaiDoanLanCan?: boolean;
}

/**
 * Boc cau hoi thong minh khong trung lap gan day:
 * - Hat giong tu maNguoiChoi + canhGioi + giaiDoan + thoiGianMo + luotMo.
 * - Uu tien loai bo cau trong lichSuGanDay (40 cau) neu nguon con du.
 * - Trong so: chua lam x3, lau chua lam x2, trong soTamMa x2.5, dungLienTiep >= 2 x0.3.
 * - Tranh 2 cau lien tiep cung dangBai.
 * - Yeu Vuong lay hauKy + dinhPhong (Do Kiep tron toan chuong).
 */
export function bocCauHoi({
  nganHang,
  tienTrinh,
  canhGioi,
  giaiDoan = 'soKy',
  soLuong,
  loaiTruIds = [],
  thoiGianMo = Date.now(),
  luotMo = 0,
  choPhepGiaiDoanLanCan = true,
}: ThamSoBocCauHoi): CauHoi[] {
  const chuoiSeed = `${tienTrinh.maNguoiChoi}|${canhGioi}|${giaiDoan}|${thoiGianMo}|${luotMo}`;
  const rng = taoBoSinhNgauNhien(bamFNV1a(chuoiSeed));

  const loaiTruSet = new Set(loaiTruIds);
  const ganDaySet = new Set(tienTrinh.lichSuGanDay || []);
  const tamMaSet = new Set(tienTrinh.dongPhu?.soTamMa || []);

  let nguonChinh: CauHoi[] = [];
  if (giaiDoan === 'yeuVuong') {
    if (canhGioi === 'doKiep') {
      nguonChinh = nganHang.filter(
        (c) => c.giaiDoan === 'dinhPhong' || c.giaiDoan === 'hauKy'
      );
    } else {
      nguonChinh = nganHang.filter(
        (c) =>
          c.canhGioi === canhGioi &&
          (c.giaiDoan === 'dinhPhong' || c.giaiDoan === 'hauKy')
      );
    }
  } else if (giaiDoan === 'tatCa') {
    nguonChinh = nganHang.filter((c) => c.canhGioi === canhGioi);
  } else {
    nguonChinh = nganHang.filter(
      (c) => c.canhGioi === canhGioi && c.giaiDoan === giaiDoan
    );
  }

  // Bo sung du phong neu kho nho hon soLuong
  let tapUngVien = nguonChinh.filter((c) => !loaiTruSet.has(c.id));
  if (tapUngVien.length < soLuong && choPhepGiaiDoanLanCan) {
    const boSungCungCanh = nganHang.filter(
      (c) =>
        c.canhGioi === canhGioi &&
        !loaiTruSet.has(c.id) &&
        !tapUngVien.some((u) => u.id === c.id)
    );
    tapUngVien = [...tapUngVien, ...boSungCungCanh];
  }
  if (tapUngVien.length < soLuong) {
    const idxCg = THU_TU_CANH_GIOI.indexOf(canhGioi);
    const boSungLanCan = nganHang.filter(
      (c) =>
        Math.abs(THU_TU_CANH_GIOI.indexOf(c.canhGioi) - idxCg) <= 1 &&
        !loaiTruSet.has(c.id) &&
        !tapUngVien.some((u) => u.id === c.id)
    );
    tapUngVien = [...tapUngVien, ...boSungLanCan];
  }
  if (tapUngVien.length < soLuong) {
    tapUngVien = [...nguonChinh];
  }

  // Uu tien cac cau khong nam trong 40 cau gan day
  const khongGanDay = tapUngVien.filter((c) => !ganDaySet.has(c.id));
  const tapLoc = khongGanDay.length >= soLuong ? khongGanDay : tapUngVien;

  const bayGio = thoiGianMo || Date.now();
  const baNgayMs = 3 * 24 * 60 * 60 * 1000;

  const tinhTrongSo = (c: CauHoi): number => {
    const ls = tienTrinh.lichSuCauHoi?.[c.id];
    let w = 1;
    if (!ls || ls.soLanLam === 0) {
      w *= 3;
    } else {
      if (bayGio - ls.lanCuoiTimestamp >= baNgayMs) {
        w *= 2;
      }
      if (ls.dungLienTiep >= 2) {
        w *= 0.3;
      }
    }
    if (tamMaSet.has(c.id)) {
      w *= 2.5;
    }
    if (ganDaySet.has(c.id)) {
      w *= 0.2;
    }
    return Math.max(0.05, w);
  };

  const conLai = [...tapLoc];
  const ketQua: CauHoi[] = [];
  let dangBaiTruoc: string | undefined;

  while (ketQua.length < soLuong && conLai.length > 0) {
    // Tranh 2 cau lien tiep cung dangBai neu van con lua chon khac
    const ungVienKhacDang = dangBaiTruoc
      ? conLai.filter((c) => !c.dangBai || c.dangBai !== dangBaiTruoc)
      : conLai;
    const beChon = ungVienKhacDang.length > 0 ? ungVienKhacDang : conLai;

    let tongW = 0;
    const dsW = beChon.map((c) => {
      const w = tinhTrongSo(c);
      tongW += w;
      return w;
    });

    let r = rng() * tongW;
    let idxChon = beChon.length - 1;
    for (let i = 0; i < beChon.length; i++) {
      r -= dsW[i];
      if (r <= 0) {
        idxChon = i;
        break;
      }
    }

    const cauDuocChon = beChon[idxChon];
    ketQua.push(xaoTronPhuongAnAnToan(cauDuocChon, rng));
    dangBaiTruoc = cauDuocChon.dangBai;

    const viTriTrongConLai = conLai.findIndex((c) => c.id === cauDuocChon.id);
    if (viTriTrongConLai >= 0) {
      conLai.splice(viTriTrongConLai, 1);
    }
  }

  return ketQua;
}

/**
 * Cap nhat lich su tung cau hoi va danh sach 40 cau gan day sau khi tra loi.
 */
export function ghiNhanLichSuCauHoi(
  tienTrinh: TienTrinhNguoiChoi,
  cauId: string,
  dung: boolean,
  thoiGian = Date.now()
): TienTrinhNguoiChoi {
  const cu = tienTrinh.lichSuCauHoi?.[cauId];
  const moi = {
    soLanLam: (cu?.soLanLam || 0) + 1,
    soLanDung: (cu?.soLanDung || 0) + (dung ? 1 : 0),
    dungLienTiep: dung ? (cu?.dungLienTiep || 0) + 1 : 0,
    lanCuoiTimestamp: thoiGian,
  };

  const ganDay = [
    ...(tienTrinh.lichSuGanDay || []).filter((id) => id !== cauId),
    cauId,
  ].slice(-40);

  return {
    ...tienTrinh,
    lichSuCauHoi: {
      ...(tienTrinh.lichSuCauHoi || {}),
      [cauId]: moi,
    },
    lichSuGanDay: ganDay,
  };
}
