export type MaCanhGioi =
  | 'luyenKhi'
  | 'trucCo'
  | 'kimDan'
  | 'nguyenAnh'
  | 'hoaThan'
  | 'doKiep';

export type CanhGioi = 'phamNhan' | MaCanhGioi;

export type TrangThaiAnhCanhGioi = 'daDotPha' | 'dangTuLuyen' | 'chuaMo';

export type BienTheHaoQuang = 'macDinh' | 'tienQuang';

export type MaGiaiDoan = 'soKy' | 'trungKy' | 'hauKy' | 'dinhPhong';

export type DangCauHoi = 'tracNghiem' | 'dienSo' | 'dungSai';

export type NguHanh = 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho';

export type DangNguoi = 'thieuNien' | 'thieuNu' | 'tuDo';

export type TuThe =
  | 'dungYen'
  | 'di'
  | 'chay'
  | 'nhay'
  | 'tanCong'
  | 'niemChu'
  | 'biThuong'
  | 'vuiMung'
  | 'chao'
  | 'ngoiThien'
  | 'chiDuong';

export type PhamChatVatPham = 'pham' | 'linh' | 'huyen' | 'dia' | 'thien';

export type LoaiVatPham = 'phapBao' | 'phu' | 'danDuoc';

export type ManHinh =
  | 'moDau'
  | 'cotTruyen'
  | 'taoNhanVat'
  | 'phongThayDo'
  | 'banDoTheGioi'
  | 'banDoGiaiDoan'
  | 'vuotAi'
  | 'manChoi'
  | 'yeuVuong'
  | 'dongPhu'
  | 'tangKinhCac'
  | 'tuiDo'
  | 'cuaHang'
  | 'hoSo'
  | 'caiDat'
  | 'bangQuanTri';

export interface HinhVeTamGiac {
  loai: 'tamGiac';
  dinh: [string, string, string];
  doDaiCanh?: [number, number, number];
  goc?: [number, number, number];
  hienCanh?: [string?, string?, string?];
  hienGoc?: [string?, string?, string?];
  veThem?: ('duongCaoA' | 'trungTuyenA' | 'ngoaiTiep' | 'noiTiep')[];
  canhCanTinh?: number;
  gocCanTinh?: number;
}

export interface HinhVeNuaDuongTron {
  loai: 'nuaDuongTronDonVi';
  gocAlpha: number;
  hienToaDo?: boolean;
  nhanDiem?: string;
  anSoDoGoc?: boolean;
}

export interface HinhVeCanhThucTe {
  loai: 'canhThucTe';
  mauCanh: 'chieuCaoNui' | 'khoangCachSong' | 'haiThapCanh' | 'thuyenBien';
  nhanA: string;
  nhanB: string;
  nhanC: string;
  nhanCanh1?: string;
  nhanCanh2?: string;
  nhanGoc1?: string;
  nhanGoc2?: string;
}

export type HinhVe = HinhVeTamGiac | HinhVeNuaDuongTron | HinhVeCanhThucTe;

export interface NguonCau {
  tep: string;
  trang?: number;
  soBai?: string;
}

export type MucDoCauHoi = 'de' | 'trungBinh' | 'kho' | 'vanDungCao';

export interface CauHoi {
  id: string;
  canhGioi: MaCanhGioi;
  giaiDoan: MaGiaiDoan;
  dang: DangCauHoi;
  dangBai?: string;
  mucDo?: MucDoCauHoi;
  deBai: string;
  deBaiGoc?: string;
  hinhVe?: HinhVe;
  luaChon?: string[];
  dapAn: string | number;
  saiSo?: number;
  donVi?: string;
  loiGiai: string;
  goiY: string;
  nguon: NguonCau | string;
  laBienThe?: boolean;
  maGoc?: string;
  laAISinh?: boolean;
  canDuyet: boolean;
  daAn?: boolean;
  kinhLienQuan?: string[];
}

export interface TrangPhuc {
  aoNgoai: string;
  mauAoNgoai: string;
  mauVienAo: string;
  vayQuan: string;
  mauVayQuan: string;
  giapVai: string;
  hoUyen: string;
  thatLung: string;
  mauThatLung: string;
  giay: string;
  mauGiay: string;
  baLo: string;
  mauBaLo: string;
}

export interface NgoaiHinh {
  maMau: string;
  ten: string;
  dangNguoi: DangNguoi;
  mauDa: string;
  kieuMat: string;
  mat: string;
  mauMat: string;
  longMay: string;
  mieng: string;
  toc: string;
  mauToc: string;
  muPhuKienDau: string;
  trangPhuc: TrangPhuc;
  phapKhi: string;
  phuKienThem: string;
  haoQuang: NguHanh;
  linhThu: string;
}

export interface NhanVatGoc {
  id: string;
  ten: string;
  danhHieu: string;
  nguHanh: NguHanh;
  xuatThan: string;
  noiTaiTen: string;
  noiTaiMoTa: string;
  tuTheMacDinh: TuThe;
  ngoaiHinhMacDinh: NgoaiHinh;
}

export interface HieuUngPhapBao {
  loai:
    | 'tangLinhKhi'
    | 'giamMatLinhLuc'
    | 'tangLinhThach'
    | 'themLinhLucToiDa'
    | 'tangThoiGianDauPhap'
    | 'tangTyLeHoiTamMa'
    | 'tangSatThuongYeuVuong';
  giaTri: number;
}

export interface VatPham {
  id: string;
  ten: string;
  loai: LoaiVatPham;
  phamChat: PhamChatVatPham;
  moTa: string;
  tacDung: string;
  giaLinhThach: number;
  soHuuSan?: boolean;
  hieuUng?: HieuUngPhapBao;
}

export interface ThongTinGiaiDoan {
  ma: MaGiaiDoan;
  ten: string;
  chuDe: string;
  moTa: string;
  laDauPhap?: boolean;
  laYeuVuong?: boolean;
}

export interface ThongTinCanhGioi {
  id: MaCanhGioi;
  thuTu: number;
  ten: string;
  danhHieu: string;
  baiHoc: string;
  moTa: string;
  mauChuDao: string;
  linhKhiCan: number;
  nguongLinhCan: string;
  giaiDoan: ThongTinGiaiDoan[];
  cauHoiTruyenMo: string[];
  cauHoiTruyenKet: string[];
}

export interface ThanhTich {
  id: string;
  ten: string;
  moTa: string;
  linhThachThuong: number;
  vatPhamThuong?: string;
}

export interface TienTrinhGiaiDoan {
  daHoanThanh: boolean;
  soSao: number;
  diemCaoNhat: number;
}

export interface LichSuLamBai {
  thoiGian: number;
  canhGioi: MaCanhGioi;
  giaiDoan: MaGiaiDoan;
  soCauDung: number;
  tongCau: number;
  loaiTran: 'thuong' | 'dauPhap' | 'doKiep' | 'yeuVuong' | 'vuotAi';
}

export interface CaiDatTroChoi {
  batAmThanh: boolean;
  batNhacNen: boolean;
  batMayTinh: boolean;
  giamHieuUng: boolean;
  cheDoTraLoiNhanh: boolean;
  batDongHoYeuVuong: boolean;
  sinhDeMoiAI: boolean;
}

export interface LichSuCauHoiItem {
  soLanLam: number;
  soLanDung: number;
  dungLienTiep: number;
  lanCuoiTimestamp: number;
}

export type MucKinh =
  | 'dinhNghia'
  | 'congThuc'
  | 'bangGiaTri'
  | 'meoNho'
  | 'viDuMau'
  | 'loiThuongGap'
  | 'tongHop';

export interface Kinh {
  ma: string;
  tang: number;
  muc: MucKinh;
  tieuDe: string;
  noiDung: string;
  hinhVe?: HinhVe;
  canhGioiMo: MaCanhGioi;
  dieuKienMo:
    | 'vaoCanhGioi'
    | 'quaTrungKy'
    | 'quaHauKy'
    | 'haYeuVuong'
    | 'hoanThanhChuong';
  canDuyet?: boolean;
}

export interface TrangThaiTangKinhCac {
  daDoc: string[];
  daThuoc: string[];
  soTay: string[];
}

export interface TrangThaiBeQuan {
  dangBeQuan: boolean;
  thoiDiemBatDau: number;
  thoiLuongPhut: 15 | 60 | 240;
}

export interface TrangThaiDongPhu {
  beQuan: TrangThaiBeQuan | null;
  ngayBeQuanCuoi: string;
  soLanBeQuanHomNay: number;
  ngayLuyenCong: string;
  soLanLuyenCongHomNay: number;
  capLinhMach: number;
  capLinhTuyen: number;
  soTamMa: string[];
  chuoiDungTamMa: Record<string, number>;
  thongKeCanhGioi: Record<string, { dung: number; tong: number }>;
}

export interface TienTrinhNguoiChoi {
  phienBan: number;
  maNguoiChoi: string;
  daTaoNhanVat: boolean;
  daXemCotTruyen: boolean;
  ngoaiHinh: NgoaiHinh;
  canhGioiHienTai: MaCanhGioi;
  daoCuoiDaXem: CanhGioi;
  daoVuaDotPha?: MaCanhGioi | null;
  linhKhi: number;
  linhThach: number;
  chuoiNgoDaoCaoNhat: number;
  tongCauDung: number;
  tongCauDaLam: number;
  soLanDoKiepThanhCong: number;
  danhHieuCuoi?: 'chanTien' | 'tanTien' | null;
  tienDoGiaiDoan: Record<string, TienTrinhGiaiDoan>;
  daDotPhaQua: MaCanhGioi[];
  tuiDo: Record<string, number>;
  phapBaoDangTrangBi: string[];
  daMoKhoaNgoaiHinh: string[];
  thanhTichDaDat: string[];
  ruongMocDaMo: number[];
  thoiGianMoRuongCoDuyenCuoi: number;
  cauHoiTuyChinh: CauHoi[];
  cauHoiGhiDe: Record<string, CauHoi>;
  cauHoiDaAn: string[];
  lichSuCauHoi: Record<string, LichSuCauHoiItem>;
  lichSuGanDay: string[];
  lichSu: LichSuLamBai[];
  caiDat: CaiDatTroChoi;
  tangKinhCac: TrangThaiTangKinhCac;
  dongPhu: TrangThaiDongPhu;
}
