import luyenKhi from './nganHang/luyenKhi.json';
import trucCo from './nganHang/trucCo.json';
import kimDan from './nganHang/kimDan.json';
import nguyenAnh from './nganHang/nguyenAnh.json';
import hoaThan from './nganHang/hoaThan.json';
import doKiep from './nganHang/doKiep.json';
import { CauHoi } from '../kieuDuLieu/troChoi';
import { sinhTatCaBienTheTuMau } from '../logic/mauCauHoi';
import { maKinhMacDinhChoCau } from '../logic/tangKinhCac';

const CAU_HOI_GOC_PDF: CauHoi[] = [
  ...(luyenKhi as CauHoi[]),
  ...(trucCo as CauHoi[]),
  ...(kimDan as CauHoi[]),
  ...(nguyenAnh as CauHoi[]),
  ...(hoaThan as CauHoi[]),
  ...(doKiep as CauHoi[]),
];

const CAU_HOI_BIEN_THE: CauHoi[] = sinhTatCaBienTheTuMau();

export const CAU_HOI_MAC_DINH: CauHoi[] = [
  ...CAU_HOI_GOC_PDF,
  ...CAU_HOI_BIEN_THE,
].map((cau) => ({
  ...cau,
  kinhLienQuan:
    cau.kinhLienQuan && cau.kinhLienQuan.length > 0
      ? cau.kinhLienQuan
      : maKinhMacDinhChoCau(cau.canhGioi, cau.giaiDoan),
}));

