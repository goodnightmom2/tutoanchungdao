import test from 'node:test';
import assert from 'node:assert/strict';
import {
  chuanHoaDaoHieuTuGoogle,
  coTienTrinhKhachDangKe,
  danhGiaDoManhMatKhau,
  doiMaLoiFirebase,
  emailLaEmailAo,
  kiemTraDaoHieu,
  kiemTraEmailThat,
  kiemTraMatKhau,
  kiemTraTenDangNhap,
  phanTichDanhSachHangLoat,
  SO_TAI_KHOAN_HANG_LOAT_TOI_DA,
  taoChuoiCsvUtf8Bom,
  taoMatKhauTam,
  taoTenDangNhapTuHoTen,
  taoTomTatTuTienTrinh,
  tenDangNhapSangEmail,
  tinhThongKeQuanTri,
} from './taiKhoanLogic';
import { chuyenDoiTienTrinhCu } from './luuTru';
import { PHIEN_BAN_LUU_TRU, taoTienTrinhMacDinh } from './tienTrinh';
import { HoSoNguoiDung, KetQuaLuotDamMay } from '../kieuDuLieu/taiKhoan';

test('kiemTraTenDangNhap chap nhan ten hop le va tu choi ten sai dinh dang', () => {
  assert.equal(kiemTraTenDangNhap('minh_10a1').hopLe, true);
  assert.equal(kiemTraTenDangNhap('  MINH_10A1 ').chuanHoa, 'minh_10a1');
  assert.equal(kiemTraTenDangNhap('abc').hopLe, false);
  assert.equal(kiemTraTenDangNhap('a'.repeat(21)).hopLe, false);
  assert.equal(kiemTraTenDangNhap('minh 10a').hopLe, false);
  assert.equal(kiemTraTenDangNhap('nguyễn').hopLe, false);
  assert.equal(kiemTraTenDangNhap('minh-10a').hopLe, false);
});

test('kiemTraMatKhau va danhGiaDoManhMatKhau hoat dong dung', () => {
  assert.equal(kiemTraMatKhau('1234567').hopLe, false);
  assert.equal(kiemTraMatKhau('abcdefgh').hopLe, false);
  assert.equal(kiemTraMatKhau('12345678').hopLe, false);
  assert.equal(kiemTraMatKhau('toan10a1').hopLe, true);

  assert.equal(danhGiaDoManhMatKhau('').phanTram, 0);
  assert.equal(danhGiaDoManhMatKhau('toan10a1').cap, 'yeu');
  assert.equal(danhGiaDoManhMatKhau('Toan10a1').cap, 'vua');
  assert.equal(danhGiaDoManhMatKhau('Toan10a1!@#').cap, 'manh');
});

test('kiemTraDaoHieu loc tu cam tieng Viet (co dau va khong dau)', () => {
  assert.equal(kiemTraDaoHieu('Thanh Phong').hopLe, true);
  assert.equal(kiemTraDaoHieu('A').hopLe, false);
  assert.equal(kiemTraDaoHieu('Đạo Hữu Rất Dài Vượt Quá 20 Ký Tự').hopLe, false);
  assert.equal(kiemTraDaoHieu('Đồ ngu ngốc').hopLe, false);
  assert.equal(kiemTraDaoHieu('Do Ngu').hopLe, false);
  assert.equal(chuanHoaDaoHieuTuGoogle('Nguyễn Văn An'), 'Nguyễn Văn An');
  assert.equal(chuanHoaDaoHieuTuGoogle(''), 'Đạo Hữu Mới');
});

test('tenDangNhapSangEmail, emailLaEmailAo, kiemTraEmailThat va doiMaLoiFirebase', () => {
  const emailAo = tenDangNhapSangEmail('Minh_10A');
  assert.equal(emailAo, 'minh_10a@tutoan.example');
  assert.equal(emailLaEmailAo(emailAo), true);
  assert.equal(emailLaEmailAo('hocsinh@gmail.com'), false);

  assert.equal(kiemTraEmailThat('').hopLe, true);
  assert.equal(kiemTraEmailThat('hocsinh@gmail.com').hopLe, true);
  assert.equal(kiemTraEmailThat('sai-dinh-dang').hopLe, false);

  assert.match(doiMaLoiFirebase({ code: 'auth/invalid-credential' }), /chưa đúng/);
  assert.match(doiMaLoiFirebase({ code: 'auth/email-already-in-use' }), /đã có người/);
  assert.match(doiMaLoiFirebase({ code: 'permission-denied' }), /không có quyền/);
});

test('taoTenDangNhapTuHoTen dam bao duy nhat va dung dinh dang 4-20 ky tu', () => {
  const tap = new Set<string>();
  const u1 = taoTenDangNhapTuHoTen('Nguyễn Văn An', '10A1', 1, tap);
  const u2 = taoTenDangNhapTuHoTen('Nguyễn Văn An', '10A1', 1, tap);
  assert.notEqual(u1, u2);
  assert.equal(kiemTraTenDangNhap(u1).hopLe, true);
  assert.equal(kiemTraTenDangNhap(u2).hopLe, true);
});

test('taoMatKhauTam dat do dai >= 8, co chu va so, khong chua 0/O/o/1/l/I', () => {
  for (let i = 0; i < 40; i++) {
    const mk = taoMatKhauTam(8);
    assert.equal(mk.length, 8);
    assert.equal(kiemTraMatKhau(mk).hopLe, true);
    assert.equal(/[0Oo1lI]/.test(mk), false, `Phat hien ky tu de nham trong ${mk}`);
  }
});

test('phanTichDanhSachHangLoat bo dong tieu de va gioi han toi da 60 dong', () => {
  const dong: string[] = ['Đạo hiệu,Lớp'];
  for (let i = 1; i <= 65; i++) {
    dong.push(`Học Sinh ${i},10A1`);
  }
  const kq = phanTichDanhSachHangLoat(dong.join('\n'));
  assert.equal(kq.danhSach.length, SO_TAI_KHOAN_HANG_LOAT_TOI_DA);
  assert.equal(kq.vuotGioiHan, true);
  assert.equal(kq.danhSach[0].daoHieu, 'Học Sinh 1');
  assert.equal(kq.danhSach[0].lop, '10A1');
});

test('taoChuoiCsvUtf8Bom bat dau bang UTF-8 BOM va thoat dau phay, dau ngoac kep', () => {
  const csv = taoChuoiCsvUtf8Bom(
    ['Đạo hiệu', 'Ghi chú'],
    [['Nguyễn, An', 'Nói "xin chào"']]
  );
  assert.equal(csv.startsWith('\uFEFF'), true);
  assert.ok(csv.includes('"Nguyễn, An"'));
  assert.ok(csv.includes('"Nói ""xin chào"""'));
});

test('coTienTrinhKhachDangKe va taoTomTatTuTienTrinh hoat dong dung', () => {
  const tt = taoTienTrinhMacDinh();
  assert.equal(coTienTrinhKhachDangKe(tt), false);
  tt.daTaoNhanVat = true;
  tt.tongCauDaLam = 12;
  tt.tongCauDung = 9;
  assert.equal(coTienTrinhKhachDangKe(tt), true);
  const tomTat = taoTomTatTuTienTrinh(tt, 3, 1700000000000);
  assert.equal(tomTat.tongCauLam, 12);
  assert.equal(tomTat.tongCauDung, 9);
  assert.equal(tomTat.soLuotChoi, 3);
  assert.equal(tomTat.hoatDongCuoi, 1700000000000);
});

test('tinhThongKeQuanTri tinh dung hoat dong 7 ngay, phan bo canh gioi, top cau sai va 14 ngay', () => {
  const bayGio = new Date('2026-11-18T12:00:00Z').getTime();
  const dsNd: HoSoNguoiDung[] = [
    {
      uid: 'u1',
      daoHieu: 'An',
      tenDangNhap: 'an_10a1',
      email: 'an_10a1@tutoan.example',
      lop: '10A1',
      phuongThuc: 'tenDangNhap',
      canDoiMatKhau: false,
      hienTrenXepHang: true,
      taoLuc: bayGio - 2 * 86400000,
      dangNhapCuoi: bayGio - 1 * 86400000,
      tomTat: {
        canhGioiHienTai: 'trucCo',
        tongSao: 15,
        tongCauLam: 20,
        tongCauDung: 15,
        soLuotChoi: 4,
        hoatDongCuoi: bayGio - 1 * 86400000,
      },
    },
    {
      uid: 'u2',
      daoHieu: 'Bình',
      tenDangNhap: 'binh_10a1',
      email: 'binh_10a1@tutoan.example',
      lop: '10A1',
      phuongThuc: 'tenDangNhap',
      canDoiMatKhau: false,
      hienTrenXepHang: true,
      taoLuc: bayGio - 20 * 86400000,
      dangNhapCuoi: bayGio - 10 * 86400000,
      tomTat: {
        canhGioiHienTai: 'luyenKhi',
        tongSao: 3,
        tongCauLam: 5,
        tongCauDung: 3,
        soLuotChoi: 1,
        hoatDongCuoi: bayGio - 10 * 86400000,
      },
    },
  ];

  const dsLuot: KetQuaLuotDamMay[] = [
    {
      maLuot: 'k1',
      uid: 'u1',
      canhGioi: 'trucCo',
      giaiDoan: 'soKy',
      cheDo: 'vuotAi',
      soCau: 2,
      soCauDung: 1,
      sao: 2,
      thoiLuongGiay: 60,
      taoLuc: bayGio - 1 * 86400000,
      chiTiet: [
        { ma: 'TC_01', dung: false, giay: 25 },
        { ma: 'TC_02', dung: true, giay: 35 },
      ],
    },
    {
      maLuot: 'k2',
      uid: 'u1',
      canhGioi: 'trucCo',
      giaiDoan: 'soKy',
      cheDo: 'vuotAi',
      soCau: 1,
      soCauDung: 0,
      sao: 0,
      thoiLuongGiay: 30,
      taoLuc: bayGio,
      chiTiet: [{ ma: 'TC_01', dung: false, giay: 30 }],
    },
  ];

  const tk = tinhThongKeQuanTri(dsNd, dsLuot, bayGio);
  assert.equal(tk.tongTaiKhoan, 2);
  assert.equal(tk.hoatDong7Ngay, 1);
  assert.equal(tk.phanBoCanhGioi.trucCo, 1);
  assert.equal(tk.phanBoCanhGioi.luyenKhi, 1);
  assert.equal(tk.tyLeDungTheoCanhGioi.trucCo.phanTram, 33);
  assert.equal(tk.top10CauSaiNhieu[0].ma, 'TC_01');
  assert.equal(tk.top10CauSaiNhieu[0].soLanSai, 2);
  assert.equal(tk.luot14Ngay.length, 14);
  assert.equal(tk.luot14Ngay[13].soLuot, 1);
  assert.equal(tk.luot14Ngay[12].soLuot, 1);
});

test('chuyenDoiTienTrinhCu nang cap du lieu v3 len v4 ma khong mat sao va vat pham', () => {
  const duLieuV3 = {
    phienBan: 3,
    maNguoiChoi: 'cu_12345',
    daTaoNhanVat: true,
    canhGioiHienTai: 'kimDan',
    linhKhi: 450,
    linhThach: 320,
    tienDoGiaiDoan: {
      'luyenKhi:soKy': { daHoanThanh: true, soSao: 3, diemCaoNhat: 100 },
    },
    tuiDo: {
      phuGoiY: 2,
    },
  };
  const ketQua = chuyenDoiTienTrinhCu(duLieuV3);
  assert.equal(ketQua.phienBan, PHIEN_BAN_LUU_TRU);
  assert.equal(ketQua.maNguoiChoi, 'cu_12345');
  assert.equal(ketQua.canhGioiHienTai, 'kimDan');
  assert.equal(ketQua.linhKhi, 450);
  assert.equal(ketQua.linhThach, 320);
  assert.equal(ketQua.tuiDo.phuGoiY, 2);
  assert.equal(ketQua.tienDoGiaiDoan['luyenKhi:soKy']?.soSao, 3);
});
