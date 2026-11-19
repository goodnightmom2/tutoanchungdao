import assert from 'node:assert/strict';
import test from 'node:test';
import { DANH_SACH_CANH_GIOI } from '../duLieu/canhGioi';
import { CAU_HOI_MAC_DINH } from '../duLieu/cauHoi';
import { BAO_CAO_NHAP_PDF } from '../duLieu/nganHang/baoCaoNhap';
import { DANH_SACH_KINH } from '../duLieu/tangKinhCac';
import { DANH_SACH_YEU_VUONG } from '../duLieu/yeuVuong';
import { bocCauHoi, ghiNhanLichSuCauHoi } from './bocCauHoi';
import {
  capNhatSoTamMa,
  chiPhiNangCapLinhMach,
  soLuotBeQuanConLaiHomNay,
  tinhPhanThuongBeQuan,
  tinhTienDoBeQuan,
} from './dongPhu';
import {
  chuyenDoiTienTrinhCu,
  docTienTrinh,
  kiemTraHopLeNganHangCauHoi,
  luuTienTrinh,
  xoaTienTrinh,
} from './luuTru';
import {
  kiemTraToanVenNganHang,
  sinhTatCaBienTheTuMau,
} from './mauCauHoi';
import {
  laKinhDaMo,
  laTangDaMo,
  layKinhLienQuanChoCauHoi,
  locVaTimKiemKinh,
} from './tangKinhCac';
import {
  duDieuKienDotPha,
  laCanhGioiDaMo,
  laGiaiDoanDaMo,
  PHIEN_BAN_LUU_TRU,
  taoTienTrinhMacDinh,
  THU_TU_CANH_GIOI,
  THU_TU_GIAI_DOAN,
  tinhChiSoNhanVat,
  tinhKetQuaPhiThang,
  tinhSoSaoMan,
} from './tienTrinh';
import {
  chamDapAn,
  chuanBiCauHoiNgauNhien,
  chuanHoaSoNhap,
  tinhBieuThucDo,
  tinhToaDoTamGiac,
} from './toanHoc';
import {
  kiemTraDuongDiHopLe,
  taoBanDoVuotAi,
  timDuongNganNhat,
  tinhNhayQuaHo,
  tinhSaoVuotAi,
} from './vuotAi';
import {
  layPhaYeuVuongHienTai,
  tinhSatThuongLenYeuVuong,
} from './yeuVuong';

test('Ngân hàng câu hỏi mặc định đủ >= 288 câu, phủ >= 12 câu mỗi ô 6x4, >= 40% tham số hóa và có kinhLienQuan', () => {
  assert.ok(CAU_HOI_MAC_DINH.length >= 288, `Chỉ có ${CAU_HOI_MAC_DINH.length} câu`);

  const kqToanVen = kiemTraToanVenNganHang(CAU_HOI_MAC_DINH);
  assert.equal(kqToanVen.hopLe, true, `Lỗi toàn vẹn ngân hàng: ${kqToanVen.loiChiTiet.join('; ')}`);
  assert.ok(kqToanVen.tyLeBienThe >= 0.4, `Tỷ lệ biến thể ${kqToanVen.tyLeBienThe} < 0.4`);
  assert.ok(kqToanVen.minMoiO >= 12, `Ít nhất mỗi ô ${kqToanVen.minMoiO} < 12`);

  const tapId = new Set<string>();
  for (const ch of CAU_HOI_MAC_DINH) {
    assert.ok(!tapId.has(ch.id), `Trùng ID câu hỏi: ${ch.id}`);
    tapId.add(ch.id);
    assert.ok(ch.deBai.length > 10, `Đề bài quá ngắn: ${ch.id}`);
    assert.ok(ch.loiGiai.length > 5, `Thiếu lời giải: ${ch.id}`);
    assert.ok(ch.goiY.length > 5, `Thiếu gợi ý: ${ch.id}`);
    assert.ok(layKinhLienQuanChoCauHoi(ch).length >= 1, `Thiếu kinhLienQuan: ${ch.id}`);

    if (ch.dang === 'dienSo') {
      assert.ok(chamDapAn(ch, String(ch.dapAn)), `Chấm số thất bại: ${ch.id}`);
      const dauPhay = String(ch.dapAn).replace('.', ',');
      assert.ok(chamDapAn(ch, dauPhay), `Chấm dấu phẩy thất bại: ${ch.id}`);
    } else {
      assert.ok(Array.isArray(ch.luaChon) && ch.luaChon.length >= 2, `Thiếu lựa chọn: ${ch.id}`);
      const dapAnIdx = Number(ch.dapAn);
      assert.ok(dapAnIdx >= 0 && dapAnIdx < ch.luaChon.length, `Đáp án sai phạm vi: ${ch.id}`);
      assert.ok(chamDapAn(ch, dapAnIdx), `Chấm trắc nghiệm thất bại: ${ch.id}`);
      const saiIdx = (dapAnIdx + 1) % ch.luaChon.length;
      assert.equal(chamDapAn(ch, saiIdx), false, `Chấm sai không trả về false: ${ch.id}`);
    }
  }

  for (const cg of THU_TU_CANH_GIOI) {
    for (const gd of THU_TU_GIAI_DOAN) {
      const dem = CAU_HOI_MAC_DINH.filter((c) => c.canhGioi === cg && c.giaiDoan === gd).length;
      assert.ok(dem >= 12, `Thiếu câu hỏi cho ${cg} - ${gd}: chỉ có ${dem}`);
    }
  }

  assert.equal(BAO_CAO_NHAP_PDF.tongSoTep, 20);
  assert.equal(BAO_CAO_NHAP_PDF.tepNguon.length, 20);
  assert.ok(BAO_CAO_NHAP_PDF.danhSachBoQua.length >= 8);
  assert.ok(sinhTatCaBienTheTuMau().length >= 140);
});

test('Bốc câu hỏi tất định theo hạt giống, loại 40 câu gần đây và ghi nhận lịch sử', () => {
  const tt = taoTienTrinhMacDinh();
  const bo1 = bocCauHoi({
    nganHang: CAU_HOI_MAC_DINH,
    tienTrinh: tt,
    canhGioi: 'luyenKhi',
    giaiDoan: 'soKy',
    soLuong: 5,
    thoiGianMo: 1_700_000_000_000,
    luotMo: 1,
  });
  const bo2 = bocCauHoi({
    nganHang: CAU_HOI_MAC_DINH,
    tienTrinh: tt,
    canhGioi: 'luyenKhi',
    giaiDoan: 'soKy',
    soLuong: 5,
    thoiGianMo: 1_700_000_000_000,
    luotMo: 1,
  });
  assert.equal(bo1.length, 5);
  assert.deepEqual(
    bo1.map((c) => c.id),
    bo2.map((c) => c.id)
  );

  // Ghi nhan 5 cau vua boc vao lichSuGanDay roi boc lai phai uu tien cau khac
  let ttSau = tt;
  for (const c of bo1) {
    ttSau = ghiNhanLichSuCauHoi(ttSau, c.id, true, 1_700_000_000_000);
  }
  assert.equal(ttSau.lichSuGanDay.length, 5);

  const boMoi = bocCauHoi({
    nganHang: CAU_HOI_MAC_DINH,
    tienTrinh: ttSau,
    canhGioi: 'luyenKhi',
    giaiDoan: 'soKy',
    soLuong: 5,
    luotMo: 2,
  });
  const tapCu = new Set(bo1.map((c) => c.id));
  const soTrung = boMoi.filter((c) => tapCu.has(c.id)).length;
  assert.equal(soTrung, 0, 'Không được bốc lại các câu vừa làm trong lịch sử gần đây khi kho còn dư');

  // Kiem tra boc cho Yeu Vuong Do Kiep co tron nhieu canh gioi
  const boBossDoKiep = bocCauHoi({
    nganHang: CAU_HOI_MAC_DINH,
    tienTrinh: tt,
    canhGioi: 'doKiep',
    giaiDoan: 'yeuVuong',
    soLuong: 18,
    luotMo: 1,
  });
  const tapCanhGioi = new Set(boBossDoKiep.map((c) => c.canhGioi));
  assert.ok(tapCanhGioi.size >= 3, 'Trận Độ Kiếp phải trộn câu hỏi từ nhiều cảnh giới');
});

test('Chuẩn hóa số nhập và chấm sai số chính xác', () => {
  assert.equal(chuanHoaSoNhap('3,5'), 3.5);
  assert.equal(chuanHoaSoNhap(' 120° '), 120);
  assert.equal(chuanHoaSoNhap('3/2'), 1.5);
  assert.equal(chuanHoaSoNhap('-4/5'), -0.8);
  assert.equal(chuanHoaSoNhap('abc'), null);

  const cauSo = CAU_HOI_MAC_DINH.find((c) => c.id === 'kd_hk_01')!;
  assert.equal(chamDapAn(cauSo, '436'), true);
  assert.equal(chamDapAn(cauSo, '435.5'), true);
  assert.equal(chamDapAn(cauSo, '438'), false);
});

test('Xáo trộn đáp án bảo toàn tính đúng đắn', () => {
  const cau = CAU_HOI_MAC_DINH.find((c) => c.id === 'lk_sk_01')!;
  const chuoiDungGoc = cau.luaChon![Number(cau.dapAn)];
  const daXao = chuanBiCauHoiNgauNhien(cau);
  assert.equal(daXao.luaChon![Number(daXao.dapAn)], chuoiDungGoc);
});

test('Thiên Cơ Toán Bàn tính toán chính xác ở chế độ Độ', () => {
  assert.ok(Math.abs((tinhBieuThucDo('sin(30)') ?? -1) - 0.5) < 1e-6);
  assert.ok(Math.abs((tinhBieuThucDo('cos(120)') ?? 1) - -0.5) < 1e-6);
  assert.ok(Math.abs((tinhBieuThucDo('tan(45) + 2*sin(30)') ?? 0) - 2) < 1e-6);
  assert.ok(Math.abs((tinhBieuThucDo('asin(0.5)') ?? 0) - 30) < 1e-6);
  assert.ok(Math.abs((tinhBieuThucDo('acos(-0.5)') ?? 0) - 120) < 1e-6);
  assert.ok(Math.abs((tinhBieuThucDo('sqrt(3^2 + 4^2)') ?? 0) - 5) < 1e-6);
  assert.equal(tinhBieuThucDo('1 / 0'), null);
});

test('Giải tọa độ tam giác 2D cho HinhVe chuẩn xác', () => {
  const kq = tinhToaDoTamGiac({
    loai: 'tamGiac',
    dinh: ['A', 'B', 'C'],
    doDaiCanh: [5, 4, 3],
    veThem: ['ngoaiTiep', 'noiTiep', 'duongCaoA', 'trungTuyenA'],
  });
  assert.ok(Number.isFinite(kq.A.x) && Number.isFinite(kq.A.y));
  assert.ok(kq.banKinhNgoaiTiep > kq.banKinhNoiTiep);
  const canhBC = Math.hypot(kq.C.x - kq.B.x, kq.C.y - kq.B.y);
  const canhAC = Math.hypot(kq.C.x - kq.A.x, kq.C.y - kq.A.y);
  const canhAB = Math.hypot(kq.B.x - kq.A.x, kq.B.y - kq.A.y);
  assert.ok(Math.abs(canhAC / canhAB - 4 / 3) < 0.02);
  assert.ok(Math.abs(canhBC / canhAB - 5 / 3) < 0.02);
});

test('Luồng mở khóa cảnh giới, giai đoạn, sao và Phi Thăng Kiếp', () => {
  const tt = taoTienTrinhMacDinh();
  assert.equal(laCanhGioiDaMo(tt, 'luyenKhi'), true);
  assert.equal(laCanhGioiDaMo(tt, 'trucCo'), false);
  assert.equal(laGiaiDoanDaMo(tt, 'luyenKhi', 'soKy'), true);
  assert.equal(laGiaiDoanDaMo(tt, 'luyenKhi', 'trungKy'), false);

  for (const gd of ['soKy', 'trungKy', 'hauKy'] as const) {
    tt.tienDoGiaiDoan[`luyenKhi_${gd}`] = { daHoanThanh: true, soSao: 3, diemCaoNhat: 5 };
  }
  assert.equal(duDieuKienDotPha(tt, 'luyenKhi').duDieuKien, false);

  tt.linhKhi = DANH_SACH_CANH_GIOI[0].linhKhiCan;
  assert.equal(duDieuKienDotPha(tt, 'luyenKhi').duDieuKien, true);

  assert.equal(tinhSoSaoMan(5, 5), 3);
  assert.equal(tinhSoSaoMan(4, 5), 2);
  assert.equal(tinhSoSaoMan(3, 5), 1);
  assert.equal(tinhSoSaoMan(2, 5), 0);

  assert.equal(tinhKetQuaPhiThang(9, 12, true, 4), 'chanTien');
  assert.equal(tinhKetQuaPhiThang(9, 12, true, 2), 'tanTien');
  assert.equal(tinhKetQuaPhiThang(9, 12, false, 0), null);
});

test('Chỉ số nhân vật và pháp bảo cộng dồn hợp lệ (kể cả Phi Kiếm)', () => {
  const tt = taoTienTrinhMacDinh();
  tt.ngoaiHinh.maMau = 'mocLan';
  tt.phapBaoDangTrangBi = ['ngocBoiThanhTam', 'laBanBatQuai', 'phiKiem'];
  const chiSo = tinhChiSoNhanVat(tt);
  assert.equal(chiSo.linhLucToiDa, 7); // 5 + 1 (Moc Lan) + 1 (Ngoc Boi)
  assert.ok(Math.abs(chiSo.heSoLinhKhi - 1.15) < 1e-6);
  assert.ok(Math.abs(chiSo.tangSatThuongYeuVuong - 0.2) < 1e-6);
});

test('Chuyển đổi dữ liệu lưu v1 sang v2 không làm mất tiến trình', () => {
  const duLieuV1 = {
    phienBan: 1,
    daTaoNhanVat: true,
    daXemCotTruyen: true,
    canhGioiHienTai: 'trucCo',
    linhKhi: 310,
    linhThach: 420,
    daDotPhaQua: ['luyenKhi'],
    tienDoGiaiDoan: {
      luyenKhi_soKy: { daHoanThanh: true, soSao: 3, diemCaoNhat: 5 },
    },
    tuiDo: { phuThoiDien: 0, hoiKhiDan: 3 },
    ngoaiHinh: {
      nhanVatGocId: 'mocLan',
      ten: 'Mộc Lan Cũ',
      theHinh: 'thieuNu',
      mauDa: 1,
      kieuMat: 0,
      kieuMatMat: 1,
      mauMat: 0,
      longMay: 0,
      kieuMieng: 1,
      kieuToc: 1,
      mauToc: '#634029',
      aoDao: 1,
      mauAoChinh: '#FFF2B2',
      mauAoVien: '#3FB59A',
      trangSucDau: 4,
      phapKhiTay: 0,
      phuKienThem: 0,
      linhThu: 0,
      haoQuang: 'moc',
    },
  };

  const v2 = chuyenDoiTienTrinhCu(duLieuV1);
  assert.equal(v2.phienBan, PHIEN_BAN_LUU_TRU);
  assert.equal(v2.linhKhi, 310);
  assert.equal(v2.linhThach, 420);
  assert.equal(v2.canhGioiHienTai, 'trucCo');
  assert.equal(v2.tuiDo.phuThoiDien, 0);
  assert.equal(v2.tuiDo.hoiKhiDan, 3);
  assert.equal(v2.ngoaiHinh.maMau, 'mocLan');
  assert.equal(v2.ngoaiHinh.ten, 'Mộc Lan Cũ');
  assert.equal(v2.ngoaiHinh.linhThu, 'tieuNon');
  assert.ok(Array.isArray(v2.dongPhu.soTamMa));
  assert.ok(Array.isArray(v2.tangKinhCac.daDoc));
});

test('Vượt Ải 9x14 sinh bản đồ tất định hợp lệ cho cả 18 ải và nhảy qua hố', () => {
  const cacGiaiDoanVuotAi = ['soKy', 'trungKy', 'hauKy'] as const;
  for (const cg of THU_TU_CANH_GIOI) {
    for (const gd of cacGiaiDoanVuotAi) {
      const bd = taoBanDoVuotAi(cg, gd);
      assert.equal(Object.keys(bd.chuongNgai).length, 5, `Thieu 5 chuong ngai o ${cg}_${gd}`);
      assert.equal(kiemTraDuongDiHopLe(bd), true, `Duong di khong thong o ${cg}_${gd}`);
      const duong = timDuongNganNhat(bd, bd.batDau, bd.dich);
      assert.ok(duong.length >= 10);
      let demHo = 0;
      for (let y = 0; y < bd.chieuCao; y++) {
        for (let x = 0; x < bd.chieuRong; x++) {
          if (bd.luoi[y][x] === 'hoNho') demHo++;
        }
      }
      assert.ok(demHo >= 1 && demHo <= 2, `So hoNho o ${cg}_${gd} phai tu 1..2, hien tai ${demHo}`);
    }
  }

  // Test tinhNhayQuaHo tren ban do mau co hoNho (ngang hoac doc)
  const bdMau = taoBanDoVuotAi('luyenKhi', 'soKy');
  let timThayHo = false;
  for (let y = 1; y < bdMau.chieuCao - 1 && !timThayHo; y++) {
    for (let x = 1; x < bdMau.chieuRong - 1 && !timThayHo; x++) {
      if (bdMau.luoi[y][x] === 'hoNho') {
        const doc =
          bdMau.luoi[y + 1][x] !== 'tuongNui' &&
          bdMau.luoi[y - 1][x] !== 'tuongNui' &&
          bdMau.luoi[y + 1][x] !== 'hoNuoc' &&
          bdMau.luoi[y - 1][x] !== 'hoNuoc';
        const ngang =
          bdMau.luoi[y][x + 1] !== 'tuongNui' &&
          bdMau.luoi[y][x - 1] !== 'tuongNui' &&
          bdMau.luoi[y][x + 1] !== 'hoNuoc' &&
          bdMau.luoi[y][x - 1] !== 'hoNuoc';
        if (doc) {
          const kq = tinhNhayQuaHo(bdMau, { x, y: y + 1 }, 'len', new Set());
          assert.equal(kq.thanhCong, true);
          assert.equal(kq.quaHoNho, true);
          assert.deepEqual(kq.viTriMoi, { x, y: y - 1 });
          timThayHo = true;
        } else if (ngang) {
          const kq = tinhNhayQuaHo(bdMau, { x: x - 1, y }, 'phai', new Set());
          assert.equal(kq.thanhCong, true);
          assert.equal(kq.quaHoNho, true);
          assert.deepEqual(kq.viTriMoi, { x: x + 1, y });
          timThayHo = true;
        }
      }
    }
  }
  assert.equal(timThayHo, true, 'Phai co it nhat 1 hoNho nhay qua duoc');

  assert.equal(tinhSaoVuotAi(5, 5), 3);
  assert.equal(tinhSaoVuotAi(4, 5), 2);
  assert.equal(tinhSaoVuotAi(2, 5), 1);
});

test('Chiến đấu Yêu Vương: sát thương %, Chí Mạng, Phi Kiếm và ngưỡng pha', () => {
  assert.equal(Object.keys(DANH_SACH_YEU_VUONG).length, 6);

  const donThuong = tinhSatThuongLenYeuVuong({
    tongDonN: 10,
    giayTraLoi: 15,
    chuoiNgoDao: 1,
    heSoPhiKiem: 0,
  });
  assert.equal(donThuong.satThuong, 10);
  assert.equal(donThuong.chiMang, false);

  const donChiMangPhiKiem = tinhSatThuongLenYeuVuong({
    tongDonN: 10,
    giayTraLoi: 8,
    chuoiNgoDao: 1,
    heSoPhiKiem: 0.2,
  });
  // 10 * 1.5 * 1.2 = 18
  assert.equal(donChiMangPhiKiem.satThuong, 18);
  assert.equal(donChiMangPhiKiem.chiMang, true);
  assert.equal(donChiMangPhiKiem.coPhiKiem, true);

  assert.equal(layPhaYeuVuongHienTai(80, 3), 1);
  assert.equal(layPhaYeuVuongHienTai(50, 3), 2);
  assert.equal(layPhaYeuVuongHienTai(20, 3), 3);
  assert.equal(layPhaYeuVuongHienTai(45, 2), 2);
});

test('Tàng Kinh Các mở khóa theo tiến trình và lọc tìm kiếm chuẩn', () => {
  const tt = taoTienTrinhMacDinh();
  assert.equal(laTangDaMo(tt, 1), true);
  assert.equal(laTangDaMo(tt, 2), false);

  const kinhLk = DANH_SACH_KINH.find((k) => k.ma === 'lk_dinh_nghia')!;
  const kinhLoi = DANH_SACH_KINH.find((k) => k.ma === 'lk_loi_thuong_gap')!;
  assert.equal(laKinhDaMo(tt, kinhLk), true);
  assert.equal(laKinhDaMo(tt, kinhLoi), false);

  const timCosin = locVaTimKiemKinh(DANH_SACH_KINH, {
    tuKhoa: 'côsin',
    tienTrinh: tt,
  });
  assert.ok(timCosin.some((k) => k.ma === 'kd_dinh_li_cosin'));
});

test('Động Phủ: Bế Quan thời gian thực, nâng cấp và Sổ Tâm Ma', () => {
  const bd = 1_700_000_000_000;
  const tt = taoTienTrinhMacDinh();
  assert.equal(soLuotBeQuanConLaiHomNay(tt.dongPhu, bd), 3);

  const tienDoNua = tinhTienDoBeQuan(
    { dangBeQuan: true, thoiDiemBatDau: bd, thoiLuongPhut: 15 },
    bd + 7.5 * 60 * 1000
  );
  assert.equal(tienDoNua.daHoanThanh, false);
  assert.equal(tienDoNua.phanTram, 50);

  const tienDoXong = tinhTienDoBeQuan(
    { dangBeQuan: true, thoiDiemBatDau: bd, thoiLuongPhut: 15 },
    bd + 16 * 60 * 1000
  );
  assert.equal(tienDoXong.daHoanThanh, true);

  const thuong = tinhPhanThuongBeQuan({
    thoiLuongPhut: 60,
    capLinhMach: 3, // +20%
    soCauDungNgoDao: 2, // x2
  });
  assert.equal(thuong.linhKhi, 120); // 50 * 1.2 * 2
  assert.equal(chiPhiNangCapLinhMach(1), 75);

  const sauSai = capNhatSoTamMa(tt.dongPhu, 'lk_sk_1', false, 'luyenKhi');
  assert.deepEqual(sauSai.dongPhuMoi.soTamMa, ['lk_sk_1']);

  const dung1 = capNhatSoTamMa(sauSai.dongPhuMoi, 'lk_sk_1', true, 'luyenKhi');
  assert.equal(dung1.daXoaTamMa, false);

  const dung2 = capNhatSoTamMa(dung1.dongPhuMoi, 'lk_sk_1', true, 'luyenKhi');
  assert.equal(dung2.daXoaTamMa, true);
  assert.deepEqual(dung2.dongPhuMoi.soTamMa, []);
});

test('Bộ nhớ tạm dự phòng và kiểm tra JSON giáo viên hoạt động chuẩn', () => {
  const tt = taoTienTrinhMacDinh();
  tt.ngoaiHinh.ten = 'Lâm Thanh Phong';
  tt.linhThach = 250;
  assert.equal(luuTienTrinh(tt), true);
  const daDoc = docTienTrinh();
  assert.equal(daDoc.ngoaiHinh.ten, 'Lâm Thanh Phong');
  assert.equal(daDoc.linhThach, 250);
  xoaTienTrinh();

  const kqHopLe = kiemTraHopLeNganHangCauHoi(CAU_HOI_MAC_DINH.slice(0, 3));
  assert.equal(kqHopLe.hopLe, true);
  assert.equal(kqHopLe.danhSach.length, 3);

  const kqLoi = kiemTraHopLeNganHangCauHoi([{ id: 'x', canhGioi: 'sai' }]);
  assert.equal(kqLoi.hopLe, false);
});
