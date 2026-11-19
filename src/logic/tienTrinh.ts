import { DANH_SACH_CANH_GIOI } from '../duLieu/canhGioi';
import { NHAN_VAT_GOC } from '../duLieu/ngoaiHinh';
import { DANH_SACH_THANH_TICH, timVatPham } from '../duLieu/vatPham';
import {
  BienTheHaoQuang,
  CanhGioi,
  MaCanhGioi,
  MaGiaiDoan,
  NguonCau,
  TienTrinhNguoiChoi,
  TrangThaiAnhCanhGioi,
} from '../kieuDuLieu/troChoi';

export const PHIEN_BAN_LUU_TRU = 4;
export const CHU_KY_RUONG_CO_DUYEN_MS = 12 * 60 * 60 * 1000;

export const THU_TU_CANH_GIOI: MaCanhGioi[] = [
  'luyenKhi',
  'trucCo',
  'kimDan',
  'nguyenAnh',
  'hoaThan',
  'doKiep',
];

export const THU_TU_GIAI_DOAN: MaGiaiDoan[] = [
  'soKy',
  'trungKy',
  'hauKy',
  'dinhPhong',
];

export interface ThongTinHaoQuang {
  tenHaoQuang: string;
  tenTuThe: string;
  mauChinh: string;
  mauPhu: string;
  mauVien: string;
  moTa: string;
}

export const BANG_HAO_QUANG: Record<CanhGioi | 'tienQuang', ThongTinHaoQuang> = {
  phamNhan: {
    tenHaoQuang: 'Phàm Trần Thanh Phong',
    tenTuThe: 'Sơ Tâm Nhập Đạo',
    mauChinh: '#94A3B8',
    mauPhu: '#E2E8F0',
    mauVien: '#CBD5E1',
    moTa: 'Gió nhẹ làng Vân Hải mang theo hơi thở ban sơ trước khi mở mạch.',
  },
  luyenKhi: {
    tenHaoQuang: 'Thanh Phong Tụ Khí',
    tenTuThe: 'Linh Khí Phiêu Diêu',
    mauChinh: '#3FB59A',
    mauPhu: '#62D1B5',
    mauVien: '#7AE7C7',
    moTa: 'Linh khí ngọc bích cuộn xoáy quanh thân, khai mở mạch dẫn đầu tiên.',
  },
  trucCo: {
    tenHaoQuang: 'Lục Bích Đạo Đài',
    tenTuThe: 'Cơ Đài Quang Hoàn',
    mauChinh: '#4A9BE0',
    mauPhu: '#62D1B5',
    mauVien: '#7DD3FC',
    moTa: 'Bát quái đạo đài lam ngọc vững chãi như bàn thạch dưới chân.',
  },
  kimDan: {
    tenHaoQuang: 'Cửu Chuyển Kim Quang',
    tenTuThe: 'Kim Đan Thần Huy',
    mauChinh: '#E4BC5A',
    mauPhu: '#FFF1A8',
    mauVien: '#F2D88B',
    moTa: 'Kim đan chín chuyển tỏa vầng nhật luân vàng rực sau lưng.',
  },
  nguyenAnh: {
    tenHaoQuang: 'Tử Khí Linh Anh',
    tenTuThe: 'Nguyên Anh Linh Ảnh',
    mauChinh: '#B79CFF',
    mauPhu: '#E9D8FF',
    mauVien: '#D8B4FE',
    moTa: 'Tử khí linh anh ngưng tụ thành tinh tú quang luân thông linh.',
  },
  hoaThan: {
    tenHaoQuang: 'Xích Hỏa Thần Hoàn',
    tenTuThe: 'Thần Hoàn Vạn Tượng',
    mauChinh: '#E4623A',
    mauPhu: '#F2C14E',
    mauVien: '#FB923C',
    moTa: 'Thần hỏa phượng hoàng vờn quanh thân ảnh, dung hòa vạn tượng.',
  },
  doKiep: {
    tenHaoQuang: 'Tử Lôi Thiên Uy',
    tenTuThe: 'Lôi Kiếp Thiên Uy',
    mauChinh: '#7A4DFF',
    mauPhu: '#D6C2FF',
    mauVien: '#A78BFA',
    moTa: 'Tử lôi thiên kiếp hội tụ thành giáp ấn uy nghiêm trước Thiên Môn.',
  },
  tienQuang: {
    tenHaoQuang: 'Tiên Quang Phi Thăng',
    tenTuThe: 'Tiên Quang Phi Thăng',
    mauChinh: '#F2D88B',
    mauPhu: '#62D1B5',
    mauVien: '#FDE68A',
    moTa: 'Thất sắc tiên quang hòa cùng mây lành chứng đạo phi thăng.',
  },
};

export function layThongTinHaoQuang(
  canhGioi: CanhGioi,
  bienThe: BienTheHaoQuang = 'macDinh'
): ThongTinHaoQuang {
  if (bienThe === 'tienQuang') {
    return BANG_HAO_QUANG.tienQuang;
  }
  return BANG_HAO_QUANG[canhGioi] || BANG_HAO_QUANG.luyenKhi;
}

export function tinhCuongDoHaoQuang(
  tienTrinh: TienTrinhNguoiChoi,
  canhGioi: CanhGioi,
  trangThai: TrangThaiAnhCanhGioi
): number {
  if (trangThai === 'daDotPha') return 1.0;
  if (trangThai === 'chuaMo') return 0.25;
  if (canhGioi === 'phamNhan') return 0.55;
  const soGdXong = demSoGiaiDoanHoanThanh(tienTrinh, canhGioi);
  return Number((0.35 + 0.65 * (soGdXong / 4)).toFixed(2));
}

export function dinhDangNguonCau(nguon: NguonCau | string | undefined): string {
  if (!nguon) return 'Tài liệu Chương III';
  if (typeof nguon === 'string') return nguon;
  const phan: string[] = [nguon.tep];
  if (typeof nguon.trang === 'number' && nguon.trang > 0) {
    phan.push(`trang ${nguon.trang}`);
  }
  if (nguon.soBai) {
    phan.push(nguon.soBai);
  }
  return phan.join(' · ');
}

export function taoMaNguoiChoi(): string {
  const thoiGian = Date.now().toString(36);
  const ngauNhien = Math.floor(Math.random() * 1_000_000)
    .toString(36)
    .padStart(4, '0');
  return `ts_${thoiGian}_${ngauNhien}`;
}

export interface ChiSoNhanVat {
  linhLucToiDa: number;
  heSoLinhKhi: number;
  heSoLinhThach: number;
  congThoiGianDauPhap: number;
  mienSaiLanDau: boolean;
  tangPhuThoiDienDauTran: boolean;
  heSoNgoDao: number;
  tangSatThuongYeuVuong: number;
}

export function taoTienTrinhMacDinh(): TienTrinhNguoiChoi {
  const macDinh = NHAN_VAT_GOC[0].ngoaiHinhMacDinh;
  return {
    phienBan: PHIEN_BAN_LUU_TRU,
    maNguoiChoi: taoMaNguoiChoi(),
    daTaoNhanVat: false,
    daXemCotTruyen: false,
    ngoaiHinh: {
      ...macDinh,
      trangPhuc: { ...macDinh.trangPhuc },
    },
    canhGioiHienTai: 'luyenKhi',
    daoCuoiDaXem: 'luyenKhi',
    daoVuaDotPha: null,
    linhKhi: 0,
    linhThach: 60,
    chuoiNgoDaoCaoNhat: 0,
    tongCauDung: 0,
    tongCauDaLam: 0,
    soLanDoKiepThanhCong: 0,
    danhHieuCuoi: null,
    tienDoGiaiDoan: {},
    daDotPhaQua: [],
    tuiDo: {
      phuThoiDien: 2,
      phuKhamPha: 1,
      phuHoiLinh: 1,
      buaChiDuong: 1,
      loiPhu: 1,
      hoiKhiDan: 1,
      thanhTamDan: 1,
    },
    phapBaoDangTrangBi: [],
    daMoKhoaNgoaiHinh: [],
    thanhTichDaDat: [],
    ruongMocDaMo: [],
    thoiGianMoRuongCoDuyenCuoi: 0,
    cauHoiTuyChinh: [],
    cauHoiGhiDe: {},
    cauHoiDaAn: [],
    lichSuCauHoi: {},
    lichSuGanDay: [],
    lichSu: [],
    caiDat: {
      batAmThanh: true,
      batNhacNen: false,
      batMayTinh: true,
      giamHieuUng: false,
      cheDoTraLoiNhanh: false,
      batDongHoYeuVuong: true,
      sinhDeMoiAI: false,
    },
    tangKinhCac: {
      daDoc: [],
      daThuoc: [],
      soTay: [],
    },
    dongPhu: {
      beQuan: null,
      ngayBeQuanCuoi: '',
      soLanBeQuanHomNay: 0,
      ngayLuyenCong: '',
      soLanLuyenCongHomNay: 0,
      capLinhMach: 1,
      capLinhTuyen: 1,
      soTamMa: [],
      chuoiDungTamMa: {},
      thongKeCanhGioi: {},
    },
  };
}

export function khoaGiaiDoan(canhGioi: MaCanhGioi, giaiDoan: MaGiaiDoan): string {
  return `${canhGioi}_${giaiDoan}`;
}

export function laCanhGioiDaMo(
  tienTrinh: TienTrinhNguoiChoi,
  canhGioi: MaCanhGioi
): boolean {
  const idx = THU_TU_CANH_GIOI.indexOf(canhGioi);
  if (idx <= 0) return true;
  const canhTruoc = THU_TU_CANH_GIOI[idx - 1];
  return (
    tienTrinh.daDotPhaQua.includes(canhTruoc) ||
    THU_TU_CANH_GIOI.indexOf(tienTrinh.canhGioiHienTai) >= idx
  );
}

export function laGiaiDoanDaMo(
  tienTrinh: TienTrinhNguoiChoi,
  canhGioi: MaCanhGioi,
  giaiDoan: MaGiaiDoan
): boolean {
  if (!laCanhGioiDaMo(tienTrinh, canhGioi)) return false;
  const idx = THU_TU_GIAI_DOAN.indexOf(giaiDoan);
  if (idx <= 0) return true;
  const giaiDoanTruoc = THU_TU_GIAI_DOAN[idx - 1];
  const tt = tienTrinh.tienDoGiaiDoan[khoaGiaiDoan(canhGioi, giaiDoanTruoc)];
  return Boolean(tt?.daHoanThanh);
}

export function demSoGiaiDoanHoanThanh(
  tienTrinh: TienTrinhNguoiChoi,
  canhGioi: MaCanhGioi
): number {
  return THU_TU_GIAI_DOAN.filter(
    (gd) => tienTrinh.tienDoGiaiDoan[khoaGiaiDoan(canhGioi, gd)]?.daHoanThanh
  ).length;
}

export function duDieuKienDotPha(
  tienTrinh: TienTrinhNguoiChoi,
  canhGioi: MaCanhGioi
): { duDieuKien: boolean; lyDo?: string } {
  if (!laCanhGioiDaMo(tienTrinh, canhGioi)) {
    return { duDieuKien: false, lyDo: 'Chưa khai mở cảnh giới này.' };
  }
  if (tienTrinh.daDotPhaQua.includes(canhGioi) && canhGioi !== 'doKiep') {
    return { duDieuKien: false, lyDo: 'Đã đột phá qua cảnh giới này.' };
  }
  const soGdTruoc = (['soKy', 'trungKy', 'hauKy'] as MaGiaiDoan[]).filter(
    (gd) => tienTrinh.tienDoGiaiDoan[khoaGiaiDoan(canhGioi, gd)]?.daHoanThanh
  ).length;
  if (soGdTruoc < 3) {
    return {
      duDieuKien: false,
      lyDo: `Cần hoàn thành đủ 3 chặng Sơ kỳ – Trung kỳ – Hậu kỳ (${soGdTruoc}/3).`,
    };
  }
  const info = DANH_SACH_CANH_GIOI.find((c) => c.id === canhGioi);
  const linhKhiCan = info?.linhKhiCan ?? 0;
  if (tienTrinh.linhKhi < linhKhiCan) {
    return {
      duDieuKien: false,
      lyDo: `Cần đủ ${linhKhiCan} Linh khí để nghênh chiến Yêu Vương (hiện có ${tienTrinh.linhKhi}).`,
    };
  }
  return { duDieuKien: true };
}

export function tinhSoSaoMan(soCauDung: number, tongCau: number): number {
  if (tongCau <= 0) return 0;
  if (soCauDung >= tongCau) return 3;
  if (soCauDung >= tongCau - 1) return 2;
  if (soCauDung >= Math.ceil(tongCau * 0.6)) return 1;
  return 0;
}

export function tinhTongSao(tienTrinh: TienTrinhNguoiChoi): number {
  return Object.values(tienTrinh.tienDoGiaiDoan).reduce(
    (tong, td) => tong + (td.soSao || 0),
    0
  );
}

export function tinhChiSoNhanVat(tienTrinh: TienTrinhNguoiChoi): ChiSoNhanVat {
  const gocId = tienTrinh.ngoaiHinh.maMau;
  let linhLucToiDa = 5;
  let heSoLinhKhi = 1;
  let heSoLinhThach = 1;
  let congThoiGianDauPhap = 0;
  let mienSaiLanDau = false;
  let tangPhuThoiDienDauTran = false;
  let heSoNgoDao = 1;
  let tangSatThuongYeuVuong = 0;

  // Noi tai nhan vat goc
  if (gocId === 'haiMinh') congThoiGianDauPhap += 3;
  if (gocId === 'mocLan') linhLucToiDa += 1;
  if (gocId === 'kimPhong') heSoLinhThach += 0.15;
  if (gocId === 'hoaNhi') heSoNgoDao += 0.2;
  if (gocId === 'thoBao') mienSaiLanDau = true;
  if (gocId === 'tieuVan') tangPhuThoiDienDauTran = true;

  // Phap bao dang trang bi (toi da 3)
  for (const pbId of tienTrinh.phapBaoDangTrangBi.slice(0, 3)) {
    const vp = timVatPham(pbId);
    if (!vp?.hieuUng) continue;
    switch (vp.hieuUng.loai) {
      case 'tangLinhKhi':
        heSoLinhKhi += vp.hieuUng.giaTri;
        break;
      case 'tangLinhThach':
        heSoLinhThach += vp.hieuUng.giaTri;
        break;
      case 'themLinhLucToiDa':
        linhLucToiDa += vp.hieuUng.giaTri;
        if (pbId === 'chuongLoiCong') heSoLinhKhi += 0.1;
        break;
      case 'tangThoiGianDauPhap':
        congThoiGianDauPhap += vp.hieuUng.giaTri;
        break;
      case 'tangSatThuongYeuVuong':
        tangSatThuongYeuVuong += vp.hieuUng.giaTri;
        break;
      default:
        break;
    }
  }

  return {
    linhLucToiDa,
    heSoLinhKhi,
    heSoLinhThach,
    congThoiGianDauPhap,
    mienSaiLanDau,
    tangPhuThoiDienDauTran,
    heSoNgoDao,
    tangSatThuongYeuVuong,
  };
}

export function tinhKetQuaPhiThang(
  soCauDung: number,
  tongCau: number,
  conSong: boolean,
  linhLucConLai?: number
): 'chanTien' | 'tanTien' | null {
  if (!conSong) return null;
  if (typeof linhLucConLai === 'number') {
    if (linhLucConLai >= 3) return 'chanTien';
    if (linhLucConLai >= 1) return 'tanTien';
    return null;
  }
  if (soCauDung >= 7 && tongCau >= 9) return 'chanTien';
  if (soCauDung >= 5) return 'tanTien';
  return null;
}

export function laDoMoKhoa(
  tienTrinh: TienTrinhNguoiChoi,
  moKhoaCanhGioi?: string
): boolean {
  if (!moKhoaCanhGioi) return true;
  const idxCan = THU_TU_CANH_GIOI.indexOf(moKhoaCanhGioi as MaCanhGioi);
  const idxHien = THU_TU_CANH_GIOI.indexOf(tienTrinh.canhGioiHienTai);
  return (
    idxHien >= idxCan ||
    tienTrinh.daDotPhaQua.includes(moKhoaCanhGioi as MaCanhGioi)
  );
}

export function kiemTraThanhTichMoi(
  tienTrinh: TienTrinhNguoiChoi
): { maMoi: string[]; tongLinhThachThuong: number; vatPhamMoi: string[] } {
  const maMoi: string[] = [];
  let tongLinhThachThuong = 0;
  const vatPhamMoi: string[] = [];

  const daDat = (id: string) => tienTrinh.thanhTichDaDat.includes(id);

  const dk: Record<string, boolean> = {
    buocChanVaoDao: Boolean(
      tienTrinh.tienDoGiaiDoan['luyenKhi_soKy']?.daHoanThanh
    ),
    ngoDaoLienHoan: tienTrinh.chuoiNgoDaoCaoNhat >= 5,
    tramTamMa: tienTrinh.daMoKhoaNgoaiHinh.includes('tramTamMa'),
    thangDauPhap: tienTrinh.lichSu.some(
      (ls) =>
        (ls.loaiTran === 'dauPhap' ||
          (ls.loaiTran === 'vuotAi' && ls.giaiDoan === 'hauKy')) &&
        ls.soCauDung >= 2
    ),
    trucCoThanhCong: tienTrinh.daDotPhaQua.includes('luyenKhi'),
    kimDanKetTinh: tienTrinh.daDotPhaQua.includes('trucCo'),
    tamHoaTuDinh: tienTrinh.daDotPhaQua.includes('kimDan'),
    chungDaoPhiThang: tienTrinh.danhHieuCuoi === 'chanTien',
  };

  for (const tt of DANH_SACH_THANH_TICH) {
    if (!daDat(tt.id) && dk[tt.id]) {
      maMoi.push(tt.id);
      tongLinhThachThuong += tt.linhThachThuong;
      if (tt.vatPhamThuong) {
        vatPhamMoi.push(tt.vatPhamThuong);
      }
    }
  }

  return { maMoi, tongLinhThachThuong, vatPhamMoi };
}

export function moRuongCoDuyenSanSang(
  tienTrinh: TienTrinhNguoiChoi,
  bayGio = Date.now()
): boolean {
  if (!tienTrinh.thoiGianMoRuongCoDuyenCuoi) return true;
  return (
    bayGio - tienTrinh.thoiGianMoRuongCoDuyenCuoi >= CHU_KY_RUONG_CO_DUYEN_MS
  );
}

export function layTenLinhCanHienTai(tienTrinh: TienTrinhNguoiChoi): string {
  const cap = tienTrinh.daDotPhaQua.length;
  const cacBac = [
    'Ngũ Hành Tạp Linh Căn',
    'Khai Mạch Linh Căn',
    'Thanh Tinh Linh Căn',
    'Địa Phẩm Linh Căn',
    'Thiên Phẩm Linh Căn',
    'Hỗn Độn Linh Căn',
    'Tiên Thiên Đạo Thể',
  ];
  return cacBac[Math.min(cap, cacBac.length - 1)];
}
