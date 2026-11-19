import {
  MaCanhGioi,
  TrangThaiBeQuan,
  TrangThaiDongPhu,
} from '../kieuDuLieu/troChoi';

export const GIOI_HAN_BE_QUAN_NGAY = 3;
export const CAP_NANG_CAP_TOI_DA = 5;

export function layNgayHomNay(bayGio = Date.now()): string {
  const d = new Date(bayGio);
  const nam = d.getFullYear();
  const thang = String(d.getMonth() + 1).padStart(2, '0');
  const ngay = String(d.getDate()).padStart(2, '0');
  return `${nam}-${thang}-${ngay}`;
}

export function soLuotBeQuanConLaiHomNay(
  dongPhu: TrangThaiDongPhu,
  bayGio = Date.now()
): number {
  const homNay = layNgayHomNay(bayGio);
  if (dongPhu.ngayBeQuanCuoi !== homNay) return GIOI_HAN_BE_QUAN_NGAY;
  return Math.max(0, GIOI_HAN_BE_QUAN_NGAY - dongPhu.soLanBeQuanHomNay);
}

export function tinhTienDoBeQuan(
  beQuan: TrangThaiBeQuan | null,
  bayGio = Date.now()
): {
  dangHoatDong: boolean;
  daHoanThanh: boolean;
  msDaQua: number;
  msConLai: number;
  phanTram: number;
} {
  if (!beQuan || !beQuan.dangBeQuan) {
    return {
      dangHoatDong: false,
      daHoanThanh: false,
      msDaQua: 0,
      msConLai: 0,
      phanTram: 0,
    };
  }
  const tongMs = beQuan.thoiLuongPhut * 60 * 1000;
  const msDaQua = Math.max(0, bayGio - beQuan.thoiDiemBatDau);
  const msConLai = Math.max(0, tongMs - msDaQua);
  const phanTram = Math.min(100, Math.round((msDaQua / Math.max(1, tongMs)) * 100));
  return {
    dangHoatDong: true,
    daHoanThanh: msConLai === 0,
    msDaQua,
    msConLai,
    phanTram,
  };
}

export function tinhPhanThuongBeQuan(thamSo: {
  thoiLuongPhut: 15 | 60 | 240;
  capLinhMach: number;
  soCauDungNgoDao: number;
}): {
  linhKhi: number;
  heSoNgoDao: number;
  heSoLinhMach: number;
} {
  const coBan =
    thamSo.thoiLuongPhut === 15 ? 20 : thamSo.thoiLuongPhut === 60 ? 50 : 110;
  const heSoLinhMach = 1 + Math.max(0, thamSo.capLinhMach - 1) * 0.1;
  const heSoNgoDao =
    thamSo.soCauDungNgoDao >= 2 ? 2 : thamSo.soCauDungNgoDao === 1 ? 1.5 : 1;
  return {
    linhKhi: Math.round(coBan * heSoLinhMach * heSoNgoDao),
    heSoNgoDao,
    heSoLinhMach,
  };
}

export function chiPhiNangCapLinhMach(capHienTai: number): number {
  return capHienTai * 75;
}

export function chiPhiNangCapLinhTuyen(capHienTai: number): number {
  return capHienTai * 85;
}

export function capNhatSoTamMa(
  dongPhu: TrangThaiDongPhu,
  cauId: string,
  dung: boolean,
  canhGioi: MaCanhGioi
): { dongPhuMoi: TrangThaiDongPhu; daXoaTamMa: boolean } {
  const tkCu = dongPhu.thongKeCanhGioi[canhGioi] || { dung: 0, tong: 0 };
  const thongKeCanhGioi = {
    ...dongPhu.thongKeCanhGioi,
    [canhGioi]: {
      dung: tkCu.dung + (dung ? 1 : 0),
      tong: tkCu.tong + 1,
    },
  };

  if (!dung) {
    const soTamMa = dongPhu.soTamMa.includes(cauId)
      ? dongPhu.soTamMa
      : [cauId, ...dongPhu.soTamMa].slice(0, 40);
    return {
      dongPhuMoi: {
        ...dongPhu,
        soTamMa,
        chuoiDungTamMa: {
          ...dongPhu.chuoiDungTamMa,
          [cauId]: 0,
        },
        thongKeCanhGioi,
      },
      daXoaTamMa: false,
    };
  }

  const dangCoTrongSo = dongPhu.soTamMa.includes(cauId);
  if (!dangCoTrongSo) {
    return {
      dongPhuMoi: {
        ...dongPhu,
        thongKeCanhGioi,
      },
      daXoaTamMa: false,
    };
  }

  const chuoiMoi = (dongPhu.chuoiDungTamMa[cauId] || 0) + 1;
  if (chuoiMoi >= 2) {
    const chuoiDungTamMa = { ...dongPhu.chuoiDungTamMa };
    delete chuoiDungTamMa[cauId];
    return {
      dongPhuMoi: {
        ...dongPhu,
        soTamMa: dongPhu.soTamMa.filter((id) => id !== cauId),
        chuoiDungTamMa,
        thongKeCanhGioi,
      },
      daXoaTamMa: true,
    };
  }

  return {
    dongPhuMoi: {
      ...dongPhu,
      chuoiDungTamMa: {
        ...dongPhu.chuoiDungTamMa,
        [cauId]: chuoiMoi,
      },
      thongKeCanhGioi,
    },
    daXoaTamMa: false,
  };
}
