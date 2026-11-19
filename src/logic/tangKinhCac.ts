import { DANH_SACH_KINH } from '../duLieu/tangKinhCac';
import {
  CauHoi,
  Kinh,
  MaCanhGioi,
  MaGiaiDoan,
  MucKinh,
  TienTrinhNguoiChoi,
} from '../kieuDuLieu/troChoi';
import {
  khoaGiaiDoan,
  laCanhGioiDaMo,
  THU_TU_CANH_GIOI,
} from './tienTrinh';

export function laKinhDaMo(
  tienTrinh: TienTrinhNguoiChoi,
  kinh: Kinh
): boolean {
  const moCanh = laCanhGioiDaMo(tienTrinh, kinh.canhGioiMo);
  if (!moCanh) return false;

  switch (kinh.dieuKienMo) {
    case 'vaoCanhGioi':
      return true;
    case 'quaTrungKy':
      return (
        Boolean(
          tienTrinh.tienDoGiaiDoan[khoaGiaiDoan(kinh.canhGioiMo, 'soKy')]
            ?.daHoanThanh
        ) ||
        THU_TU_CANH_GIOI.indexOf(tienTrinh.canhGioiHienTai) >
          THU_TU_CANH_GIOI.indexOf(kinh.canhGioiMo)
      );
    case 'quaHauKy':
      return (
        Boolean(
          tienTrinh.tienDoGiaiDoan[khoaGiaiDoan(kinh.canhGioiMo, 'trungKy')]
            ?.daHoanThanh
        ) ||
        THU_TU_CANH_GIOI.indexOf(tienTrinh.canhGioiHienTai) >
          THU_TU_CANH_GIOI.indexOf(kinh.canhGioiMo)
      );
    case 'haYeuVuong':
      return tienTrinh.daDotPhaQua.includes(kinh.canhGioiMo);
    case 'hoanThanhChuong':
      return tienTrinh.daDotPhaQua.includes('doKiep');
    default:
      return false;
  }
}

export function laTangDaMo(
  tienTrinh: TienTrinhNguoiChoi,
  tang: number
): boolean {
  return DANH_SACH_KINH.some((k) => k.tang === tang && laKinhDaMo(tienTrinh, k));
}

export function tinhTienDoTangKinhCac(tienTrinh: TienTrinhNguoiChoi): {
  tongKinh: number;
  daMo: number;
  daDoc: number;
  daThuoc: number;
  soTay: number;
} {
  const daMo = DANH_SACH_KINH.filter((k) => laKinhDaMo(tienTrinh, k)).length;
  return {
    tongKinh: DANH_SACH_KINH.length,
    daMo,
    daDoc: tienTrinh.tangKinhCac.daDoc.length,
    daThuoc: tienTrinh.tangKinhCac.daThuoc.length,
    soTay: tienTrinh.tangKinhCac.soTay.length,
  };
}

export function locVaTimKiemKinh(
  danhSach: Kinh[],
  thamSo: {
    tang?: number | null;
    muc?: MucKinh | 'tatCa';
    tuKhoa?: string;
    chiSoTay?: boolean;
    chiChuaThuoc?: boolean;
    tienTrinh: TienTrinhNguoiChoi;
  }
): Kinh[] {
  const tuKhoa = (thamSo.tuKhoa || '').trim().toLowerCase();
  return danhSach.filter((k) => {
    if (thamSo.tang && k.tang !== thamSo.tang) return false;
    if (thamSo.muc && thamSo.muc !== 'tatCa' && k.muc !== thamSo.muc) return false;
    if (thamSo.chiSoTay && !thamSo.tienTrinh.tangKinhCac.soTay.includes(k.ma)) {
      return false;
    }
    if (
      thamSo.chiChuaThuoc &&
      thamSo.tienTrinh.tangKinhCac.daThuoc.includes(k.ma)
    ) {
      return false;
    }
    if (tuKhoa) {
      const khop =
        k.tieuDe.toLowerCase().includes(tuKhoa) ||
        k.noiDung.toLowerCase().includes(tuKhoa);
      if (!khop) return false;
    }
    return true;
  });
}

const BAN_DO_KINH_MAC_DINH: Record<MaCanhGioi, Record<MaGiaiDoan, string[]>> = {
  luyenKhi: {
    soKy: ['lk_dinh_nghia', 'lk_dau_goc'],
    trungKy: ['lk_bang_gia_tri', 'lk_meo_nho'],
    hauKy: ['lk_bang_gia_tri', 'lk_loi_thuong_gap'],
    dinhPhong: ['lk_dau_goc', 'lk_bang_gia_tri'],
  },
  trucCo: {
    soKy: ['tc_bu_phu'],
    trungKy: ['tc_hang_dang_thuc'],
    hauKy: ['tc_vi_du_mau', 'tc_loi_thuong_gap'],
    dinhPhong: ['tc_bu_phu', 'tc_hang_dang_thuc'],
  },
  kimDan: {
    soKy: ['kd_dinh_li_cosin'],
    trungKy: ['kd_he_qua_goc'],
    hauKy: ['kd_vi_du_do_dac', 'kd_loi_thuong_gap'],
    dinhPhong: ['kd_dinh_li_cosin', 'kd_he_qua_goc'],
  },
  nguyenAnh: {
    soKy: ['na_dinh_li_sin'],
    trungKy: ['na_meo_giai_goc', 'na_loi_thuong_gap'],
    hauKy: ['na_vi_du_chieu_cao'],
    dinhPhong: ['na_dinh_li_sin', 'na_meo_giai_goc'],
  },
  hoaThan: {
    soKy: ['ht_nam_cong_thuc'],
    trungKy: ['ht_vi_du_heron', 'ht_loi_thuong_gap'],
    hauKy: ['ht_meo_chon_cong_thuc', 'ht_nam_cong_thuc'],
    dinhPhong: ['ht_nam_cong_thuc', 'ht_vi_du_heron'],
  },
  doKiep: {
    soKy: ['dk_giai_tam_giac'],
    trungKy: ['dk_giai_tam_giac', 'kd_he_qua_goc'],
    hauKy: ['dk_meo_chuyen_do_dac', 'dk_loi_thuong_gap'],
    dinhPhong: ['dt_tong_hop_chuong_3', 'dk_giai_tam_giac'],
  },
};

export function maKinhMacDinhChoCau(
  canhGioi: MaCanhGioi,
  giaiDoan: MaGiaiDoan
): string[] {
  return BAN_DO_KINH_MAC_DINH[canhGioi]?.[giaiDoan] || ['lk_dinh_nghia'];
}

export function layKinhLienQuanChoCauHoi(cauHoi: CauHoi): Kinh[] {
  const dsMa =
    cauHoi.kinhLienQuan && cauHoi.kinhLienQuan.length > 0
      ? cauHoi.kinhLienQuan
      : maKinhMacDinhChoCau(cauHoi.canhGioi, cauHoi.giaiDoan);
  return dsMa
    .map((ma) => DANH_SACH_KINH.find((k) => k.ma === ma))
    .filter((k): k is Kinh => Boolean(k));
}
