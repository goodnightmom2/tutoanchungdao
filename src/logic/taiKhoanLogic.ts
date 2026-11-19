import { chuanHoaKhongDau, chuaTuCam } from '../duLieu/tuCam';
import {
  HoSoNguoiDung,
  KetQuaLuotDamMay,
  TomTatNguoiDung,
} from '../kieuDuLieu/taiKhoan';
import { MaCanhGioi, TienTrinhNguoiChoi } from '../kieuDuLieu/troChoi';
import { THU_TU_CANH_GIOI, tinhTongSao } from './tienTrinh';

export const TEN_MIEN_AO = 'tutoan.example';
export const SO_TAI_KHOAN_HANG_LOAT_TOI_DA = 60;

export function kiemTraTenDangNhap(raw: string): {
  hopLe: boolean;
  chuanHoa: string;
  loi?: string;
} {
  const chuanHoa = raw.trim().toLowerCase();
  if (!chuanHoa) {
    return { hopLe: false, chuanHoa, loi: 'Vui lòng nhập tên đăng nhập.' };
  }
  if (chuanHoa.length < 4 || chuanHoa.length > 20) {
    return {
      hopLe: false,
      chuanHoa,
      loi: 'Tên đăng nhập phải dài từ 4 đến 20 ký tự.',
    };
  }
  if (!/^[a-z0-9_]+$/.test(chuanHoa)) {
    return {
      hopLe: false,
      chuanHoa,
      loi: 'Tên đăng nhập chỉ dùng chữ thường không dấu, số và dấu gạch dưới (_).',
    };
  }
  return { hopLe: true, chuanHoa };
}

export function kiemTraMatKhau(matKhau: string): {
  hopLe: boolean;
  loi?: string;
} {
  if (!matKhau) {
    return { hopLe: false, loi: 'Vui lòng nhập mật khẩu.' };
  }
  if (matKhau.length < 8) {
    return { hopLe: false, loi: 'Mật khẩu cần tối thiểu 8 ký tự.' };
  }
  if (!/[a-zA-Z]/.test(matKhau) || !/[0-9]/.test(matKhau)) {
    return {
      hopLe: false,
      loi: 'Mật khẩu phải có ít nhất 1 chữ cái và 1 chữ số.',
    };
  }
  return { hopLe: true };
}

export function danhGiaDoManhMatKhau(matKhau: string): {
  cap: 'yeu' | 'vua' | 'manh';
  nhan: string;
  phanTram: number;
} {
  if (!matKhau) {
    return { cap: 'yeu', nhan: 'Chưa nhập', phanTram: 0 };
  }
  let diem = 0;
  if (matKhau.length >= 8) diem += 1;
  if (matKhau.length >= 11) diem += 1;
  if (/[a-z]/.test(matKhau) && /[A-Z]/.test(matKhau)) diem += 1;
  if (/[0-9]/.test(matKhau)) diem += 1;
  if (/[^a-zA-Z0-9]/.test(matKhau)) diem += 1;

  if (matKhau.length < 8 || diem <= 2) {
    return { cap: 'yeu', nhan: 'Yếu', phanTram: 33 };
  }
  if (diem <= 3) {
    return { cap: 'vua', nhan: 'Vừa', phanTram: 66 };
  }
  return { cap: 'manh', nhan: 'Mạnh', phanTram: 100 };
}

export function kiemTraDaoHieu(raw: string): {
  hopLe: boolean;
  chuanHoa: string;
  loi?: string;
} {
  const chuanHoa = raw.trim().replace(/\s+/g, ' ');
  if (chuanHoa.length < 2 || chuanHoa.length > 20) {
    return {
      hopLe: false,
      chuanHoa,
      loi: 'Đạo hiệu phải dài từ 2 đến 20 ký tự.',
    };
  }
  if (chuaTuCam(chuanHoa)) {
    return {
      hopLe: false,
      chuanHoa,
      loi: 'Đạo hiệu chứa từ ngữ không phù hợp. Hãy chọn tên khác thanh tao hơn.',
    };
  }
  return { hopLe: true, chuanHoa };
}

export function chuanHoaDaoHieuTuGoogle(tenGoogle: string | null | undefined): string {
  const sach = (tenGoogle || '').trim().replace(/\s+/g, ' ').slice(0, 20);
  const kt = kiemTraDaoHieu(sach);
  if (kt.hopLe) return kt.chuanHoa;
  return 'Đạo Hữu Mới';
}

export function tenDangNhapSangEmail(tenDangNhap: string): string {
  return `${tenDangNhap.trim().toLowerCase()}@${TEN_MIEN_AO}`;
}

export function emailLaEmailAo(email: string | null | undefined): boolean {
  if (!email) return true;
  return email.toLowerCase().endsWith(`@${TEN_MIEN_AO}`);
}

export function kiemTraEmailThat(raw: string): {
  hopLe: boolean;
  chuanHoa: string;
  loi?: string;
} {
  const chuanHoa = raw.trim().toLowerCase();
  if (!chuanHoa) {
    return { hopLe: true, chuanHoa: '' };
  }
  if (chuanHoa.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(chuanHoa)) {
    return { hopLe: false, chuanHoa, loi: 'Địa chỉ thư điện tử không đúng định dạng.' };
  }
  return { hopLe: true, chuanHoa };
}

export function doiMaLoiFirebase(err: unknown): string {
  const code =
    typeof err === 'object' && err !== null && 'code' in err
      ? String((err as { code?: unknown }).code || '')
      : '';
  const rawMsg =
    err instanceof Error
      ? err.message
      : typeof err === 'object' && err !== null && 'message' in err
      ? String((err as { message?: unknown }).message || '')
      : String(err || '');
  const msg = rawMsg.toLowerCase();

  if (
    code === 'auth/invalid-credential' ||
    code === 'auth/wrong-password' ||
    code === 'auth/user-not-found' ||
    code === 'invalid_credentials' ||
    msg.includes('invalid login credentials') ||
    msg.includes('invalid_credentials')
  ) {
    return 'Tên đăng nhập hoặc mật khẩu chưa đúng.';
  }
  if (
    code === 'auth/email-already-in-use' ||
    code === 'user_already_exists' ||
    code === '23505' ||
    msg.includes('user already registered') ||
    msg.includes('already been registered') ||
    msg.includes('duplicate key')
  ) {
    return 'Tên đăng nhập này đã có người sử dụng. Hãy chọn tên khác.';
  }
  if (
    code === 'auth/weak-password' ||
    code === 'weak_password' ||
    msg.includes('password should be at least') ||
    msg.includes('weak password')
  ) {
    return 'Mật khẩu quá yếu. Vui lòng dùng ít nhất 8 ký tự gồm chữ và số.';
  }
  if (
    code === 'auth/too-many-requests' ||
    code === 'over_request_rate_limit' ||
    code === 'over_email_send_rate_limit' ||
    msg.includes('rate limit') ||
    msg.includes('too many requests')
  ) {
    return 'Thao tác quá nhiều lần liên tiếp. Vui lòng đợi ít phút rồi thử lại.';
  }
  if (
    code === 'email_not_confirmed' ||
    msg.includes('email not confirmed')
  ) {
    return 'Tài khoản cần xác nhận email hoặc quản trị viên cần tắt "Confirm email" trong Supabase Auth.';
  }
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
    return 'Bạn đã đóng cửa sổ đăng nhập Google trước khi hoàn tất.';
  }
  if (code === 'auth/popup-blocked') {
    return 'Trình duyệt đang chặn cửa sổ bật lên. Hãy cho phép bật cửa sổ cho trang này rồi thử lại.';
  }
  if (
    code === 'auth/network-request-failed' ||
    msg.includes('offline') ||
    msg.includes('failed to fetch') ||
    msg.includes('networkerror')
  ) {
    return 'Mất kết nối mạng. Vui lòng kiểm tra đường truyền rồi thử lại.';
  }
  if (
    code === 'auth/operation-not-allowed' ||
    code === 'signup_disabled' ||
    msg.includes('provider is not enabled') ||
    msg.includes('signups not allowed')
  ) {
    return 'Phương thức đăng nhập này chưa được bật trong bảng điều khiển Supabase.';
  }
  if (code === 'auth/requires-recent-login') {
    return 'Vì lý do bảo mật, bạn cần xác thực lại mật khẩu hoặc đăng nhập lại trước khi thực hiện thao tác này.';
  }
  if (
    code === 'permission-denied' ||
    code === '42501' ||
    msg.includes('permission_denied') ||
    msg.includes('row-level security') ||
    msg.includes('permission denied')
  ) {
    return 'Bạn không có quyền thực hiện thao tác này hoặc tài khoản đang bị tạm khóa.';
  }
  if (code === 'unavailable') {
    return 'Máy chủ lưu trữ tạm thời không phản hồi. Dữ liệu sẽ tự đồng bộ khi có mạng.';
  }
  return 'Có trục trặc xảy ra khi xử lý tài khoản. Vui lòng thử lại sau ít giây.';
}

export function taoTenDangNhapTuHoTen(
  daoHieu: string,
  lop: string,
  soThuTu: number,
  tapDaDung: Set<string>
): string {
  const lopSach = chuanHoaKhongDau(lop).replace(/[^a-z0-9]/g, '').slice(0, 6);
  const tenSach = chuanHoaKhongDau(daoHieu)
    .split(' ')
    .filter(Boolean)
    .map((tu, idx, arr) => (idx === arr.length - 1 ? tu : tu[0]))
    .join('')
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 8);

  const gocLop = lopSach || 'hs';
  const gocTen = tenSach || 'daohuu';
  const so = String(soThuTu).padStart(2, '0');

  let ungVien = `${gocLop}_${gocTen}_${so}`.slice(0, 20);
  if (ungVien.length < 4) {
    ungVien = `${ungVien}_01`.slice(0, 20);
  }
  let dem = 1;
  while (tapDaDung.has(ungVien)) {
    const duoi = `_${soThuTu + dem}`;
    ungVien = `${gocLop}_${gocTen}`.slice(0, 20 - duoi.length) + duoi;
    dem += 1;
  }
  tapDaDung.add(ungVien);
  return ungVien;
}

const KY_TU_CHU_DE_DOC = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
const KY_TU_SO_DE_DOC = '23456789';
const TAT_CA_DE_DOC = KY_TU_CHU_DE_DOC + KY_TU_SO_DE_DOC;

export function taoMatKhauTam(doDai = 8): string {
  const len = Math.max(8, doDai);
  const ketQua: string[] = [];
  // Dam bao it nhat 1 chu thuong, 1 chu hoa, 2 chu so va khong co 0/O/o/1/l/I
  ketQua.push(
    KY_TU_CHU_DE_DOC[Math.floor(Math.random() * 23)] // chu thuong
  );
  ketQua.push(
    KY_TU_CHU_DE_DOC[23 + Math.floor(Math.random() * (KY_TU_CHU_DE_DOC.length - 23))] // chu hoa
  );
  ketQua.push(KY_TU_SO_DE_DOC[Math.floor(Math.random() * KY_TU_SO_DE_DOC.length)]);
  ketQua.push(KY_TU_SO_DE_DOC[Math.floor(Math.random() * KY_TU_SO_DE_DOC.length)]);

  while (ketQua.length < len) {
    ketQua.push(TAT_CA_DE_DOC[Math.floor(Math.random() * TAT_CA_DE_DOC.length)]);
  }
  // Xao tron Fisher-Yates
  for (let i = ketQua.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ketQua[i], ketQua[j]] = [ketQua[j], ketQua[i]];
  }
  return ketQua.join('');
}

export interface DongDanhSachHocSinh {
  daoHieu: string;
  lop: string;
}

export function phanTichDanhSachHangLoat(noiDung: string): {
  danhSach: DongDanhSachHocSinh[];
  vuotGioiHan: boolean;
} {
  const dong = noiDung
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const ketQua: DongDanhSachHocSinh[] = [];
  for (let i = 0; i < dong.length; i++) {
    const line = dong[i];
    // Bo qua dong tieu de CSV neu co
    const khongDau = chuanHoaKhongDau(line);
    if (
      i === 0 &&
      (khongDau.startsWith('dao hieu') ||
        khongDau.startsWith('ho ten') ||
        khongDau.startsWith('ho va ten') ||
        khongDau.startsWith('ten,'))
    ) {
      continue;
    }
    const phan = line.includes('\t')
      ? line.split('\t')
      : line.includes(';')
      ? line.split(';')
      : line.split(',');

    const daoHieu = (phan[0] || '').replace(/^["']|["']$/g, '').trim().slice(0, 20);
    const lop = (phan[1] || '').replace(/^["']|["']$/g, '').trim().slice(0, 20);
    if (daoHieu.length >= 2) {
      ketQua.push({ daoHieu, lop });
    }
  }

  return {
    danhSach: ketQua.slice(0, SO_TAI_KHOAN_HANG_LOAT_TOI_DA),
    vuotGioiHan: ketQua.length > SO_TAI_KHOAN_HANG_LOAT_TOI_DA,
  };
}

export function thoatOExcelCsv(giaTri: string | number | boolean | null | undefined): string {
  const s = giaTri === null || giaTri === undefined ? '' : String(giaTri);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function taoChuoiCsvUtf8Bom(
  tieuDeCot: string[],
  cacDong: (string | number | boolean | null | undefined)[][]
): string {
  const dongHeader = tieuDeCot.map(thoatOExcelCsv).join(',');
  const dongDuLieu = cacDong.map((r) => r.map(thoatOExcelCsv).join(','));
  return '\uFEFF' + [dongHeader, ...dongDuLieu].join('\r\n');
}

export function coTienTrinhKhachDangKe(tt: TienTrinhNguoiChoi): boolean {
  return (
    tt.daTaoNhanVat ||
    tt.tongCauDaLam > 0 ||
    tt.linhKhi > 0 ||
    Object.keys(tt.tienDoGiaiDoan || {}).length > 0
  );
}

export function taoTomTatTuTienTrinh(
  tt: TienTrinhNguoiChoi,
  soLuotChoi?: number,
  bayGio = Date.now()
): TomTatNguoiDung {
  return {
    canhGioiHienTai: tt.canhGioiHienTai,
    tongSao: Math.min(72, Math.max(0, tinhTongSao(tt))),
    tongCauLam: Math.max(0, Math.floor(tt.tongCauDaLam || 0)),
    tongCauDung: Math.min(
      Math.max(0, Math.floor(tt.tongCauDaLam || 0)),
      Math.max(0, Math.floor(tt.tongCauDung || 0))
    ),
    soLuotChoi: Math.max(0, Math.floor(soLuotChoi ?? tt.lichSu.length)),
    hoatDongCuoi: bayGio,
  };
}

export interface ThongKeQuanTriTongQuan {
  tongTaiKhoan: number;
  hoatDong7Ngay: number;
  phanBoCanhGioi: Record<MaCanhGioi, number>;
  tyLeDungTheoCanhGioi: Record<MaCanhGioi, { dung: number; tong: number; phanTram: number }>;
  top10CauSaiNhieu: {
    ma: string;
    soLanLam: number;
    soLanSai: number;
    tyLeSai: number;
  }[];
  luot14Ngay: {
    ngay: string; // DD/MM
    khoaNgay: string; // YYYY-MM-DD
    soLuot: number;
  }[];
}

export function tinhThongKeQuanTri(
  dsNguoiDung: HoSoNguoiDung[],
  dsKetQuaLuot: KetQuaLuotDamMay[],
  bayGio = Date.now()
): ThongKeQuanTriTongQuan {
  const bayNgayTruoc = bayGio - 7 * 24 * 60 * 60 * 1000;
  const phanBoCanhGioi: Record<MaCanhGioi, number> = {
    luyenKhi: 0,
    trucCo: 0,
    kimDan: 0,
    nguyenAnh: 0,
    hoaThan: 0,
    doKiep: 0,
  };
  let hoatDong7Ngay = 0;

  for (const nd of dsNguoiDung) {
    const cg = nd.tomTat?.canhGioiHienTai || 'luyenKhi';
    if (cg in phanBoCanhGioi) {
      phanBoCanhGioi[cg] += 1;
    }
    const lanCuoi = Math.max(nd.dangNhapCuoi || 0, nd.tomTat?.hoatDongCuoi || 0);
    if (lanCuoi >= bayNgayTruoc) {
      hoatDong7Ngay += 1;
    }
  }

  const tyLeDungTheoCanhGioi: Record<
    MaCanhGioi,
    { dung: number; tong: number; phanTram: number }
  > = {
    luyenKhi: { dung: 0, tong: 0, phanTram: 0 },
    trucCo: { dung: 0, tong: 0, phanTram: 0 },
    kimDan: { dung: 0, tong: 0, phanTram: 0 },
    nguyenAnh: { dung: 0, tong: 0, phanTram: 0 },
    hoaThan: { dung: 0, tong: 0, phanTram: 0 },
    doKiep: { dung: 0, tong: 0, phanTram: 0 },
  };

  const thongKeCau: Record<string, { lam: number; sai: number }> = {};

  // Khoi tao 14 ngay gan nhat
  const luot14Ngay: { ngay: string; khoaNgay: string; soLuot: number }[] = [];
  const mapNgay = new Map<string, number>();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(bayGio - i * 24 * 60 * 60 * 1000);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const khoaNgay = `${yyyy}-${mm}-${dd}`;
    mapNgay.set(khoaNgay, luot14Ngay.length);
    luot14Ngay.push({ ngay: `${dd}/${mm}`, khoaNgay, soLuot: 0 });
  }

  for (const luot of dsKetQuaLuot.slice(0, 500)) {
    const cg = luot.canhGioi;
    if (cg in tyLeDungTheoCanhGioi) {
      tyLeDungTheoCanhGioi[cg].dung += luot.soCauDung || 0;
      tyLeDungTheoCanhGioi[cg].tong += luot.soCau || 0;
    }
    for (const ct of luot.chiTiet || []) {
      if (!ct?.ma) continue;
      if (!thongKeCau[ct.ma]) thongKeCau[ct.ma] = { lam: 0, sai: 0 };
      thongKeCau[ct.ma].lam += 1;
      if (!ct.dung) thongKeCau[ct.ma].sai += 1;
    }
    if (luot.taoLuc) {
      const d = new Date(luot.taoLuc);
      const khoa = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const idx = mapNgay.get(khoa);
      if (idx !== undefined) {
        luot14Ngay[idx].soLuot += 1;
      }
    }
  }

  for (const cg of THU_TU_CANH_GIOI) {
    const o = tyLeDungTheoCanhGioi[cg];
    o.phanTram = o.tong > 0 ? Math.round((o.dung / o.tong) * 100) : 0;
  }

  const top10CauSaiNhieu = Object.entries(thongKeCau)
    .map(([ma, tk]) => ({
      ma,
      soLanLam: tk.lam,
      soLanSai: tk.sai,
      tyLeSai: tk.lam > 0 ? Math.round((tk.sai / tk.lam) * 100) : 0,
    }))
    .filter((c) => c.soLanSai > 0)
    .sort((a, b) => b.tyLeSai - a.tyLeSai || b.soLanSai - a.soLanSai)
    .slice(0, 10);

  return {
    tongTaiKhoan: dsNguoiDung.length,
    hoatDong7Ngay,
    phanBoCanhGioi,
    tyLeDungTheoCanhGioi,
    top10CauSaiNhieu,
    luot14Ngay,
  };
}
