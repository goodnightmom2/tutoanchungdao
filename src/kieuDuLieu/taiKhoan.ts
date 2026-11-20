import { CauHoi, MaCanhGioi, MaGiaiDoan, TienTrinhNguoiChoi } from './troChoi';

export type CheDoLuuTru = 'cucBo' | 'damMay';

export type PhuongThucDangNhap = 'tenDangNhap' | 'google';

export interface TomTatNguoiDung {
  canhGioiHienTai: MaCanhGioi;
  tongSao: number;
  tongCauLam: number;
  tongCauDung: number;
  soLuotChoi: number;
  hoatDongCuoi: number; // epoch ms trong client
}

export interface TongMon {
  id: string;
  tenTongMon: string;
  tenLop: string;
  uidGiaoVien: string;
  moTa: string;
  taoLuc: number;
}

export interface HoSoNguoiDung {
  uid: string;
  daoHieu: string;
  tenDangNhap: string | null;
  email: string | null;
  lop: string | null;
  phuongThuc: PhuongThucDangNhap;
  taoLuc: number;
  dangNhapCuoi: number;
  canDoiMatKhau: boolean;
  hienTrenXepHang: boolean;
  tomTat: TomTatNguoiDung;
  maTongMon?: string | null;
  uidGiaoVien?: string | null;
  laQuanTri?: boolean;
  laGiaoVien?: boolean;
  biKhoa?: boolean;
  lyDoKhoa?: string;
}

export interface ChiTietCauLuot {
  ma: string;
  dung: boolean;
  giay: number;
}

export type CheDoLuotChoi =
  | 'vuotAi'
  | 'yeuVuong'
  | 'dauPhap'
  | 'luyenCong'
  | 'beQuan';

export interface KetQuaLuotDamMay {
  maLuot?: string;
  uid: string;
  canhGioi: MaCanhGioi;
  giaiDoan: MaGiaiDoan | 'tuDo';
  cheDo: CheDoLuotChoi;
  soCau: number;
  soCauDung: number;
  sao: number;
  thoiLuongGiay: number;
  chiTiet: ChiTietCauLuot[];
  taoLuc: number;
}

export interface MucXepHang {
  uid: string;
  daoHieu: string;
  tongSao: number;
  canhGioi: MaCanhGioi;
  capNhatLuc: number;
}

export interface CauHinhCongKhai {
  choPhepDangKy: boolean;
  thongBao: string;
  thongBaoLuc: number | null;
}

export interface ThongTinKhoaTaiKhoan {
  biKhoa: boolean;
  lyDo: string;
  luc: number;
  khoaBoi?: string;
}

export interface NhatKyQuanTri {
  id: string;
  uidQuanTri: string;
  hanhDong: string;
  doiTuong: string;
  chiTiet: string;
  luc: number;
}

export type TrangThaiDongBoLoai =
  | 'khach'
  | 'sanSang'
  | 'dangLuu'
  | 'daLuu'
  | 'ngoaiTuyen'
  | 'loi';

export interface TrangThaiDongBo {
  loai: TrangThaiDongBoLoai;
  lucCuoi: number | null;
  thongDiep?: string;
}

export interface XungDotTienTrinh {
  banDamMay: TienTrinhNguoiChoi;
  capNhatDamMayLuc: number;
  banCucBo: TienTrinhNguoiChoi;
  capNhatCucBoLuc: number;
}

export interface KetQuaTaoHangLoatMuc {
  stt: number;
  daoHieu: string;
  lop: string;
  tenDangNhap: string;
  matKhauTam: string;
  thanhCong: boolean;
  loi?: string;
  uid?: string;
}

export interface CauHoiTuyChinhDamMay extends CauHoi {
  daAn?: boolean;
  capNhatLuc?: number;
  suaBoi?: string;
}
