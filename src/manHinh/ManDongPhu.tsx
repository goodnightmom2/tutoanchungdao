import React, { useEffect, useMemo, useState } from 'react';
import { boPhatAmThanh } from '../amThanh/boPhatAmThanh';
import { DANH_SACH_CANH_GIOI } from '../duLieu/canhGioi';
import {
  CauHoi,
  MaCanhGioi,
  MaGiaiDoan,
  TienTrinhNguoiChoi,
} from '../kieuDuLieu/troChoi';
import {
  CAP_NANG_CAP_TOI_DA,
  chiPhiNangCapLinhMach,
  chiPhiNangCapLinhTuyen,
  soLuotBeQuanConLaiHomNay,
  tinhPhanThuongBeQuan,
  tinhTienDoBeQuan,
} from '../logic/dongPhu';
import { bocCauHoi } from '../logic/bocCauHoi';
import { dinhDangNguonCau, laCanhGioiDaMo } from '../logic/tienTrinh';
import { chamDapAn } from '../logic/toanHoc';
import {
  BieuTuongLinhKhi,
  BieuTuongLinhThach,
  BieuTuongTamMa,
} from '../thanhPhan/BieuTuong';
import { CanhNenChibi } from '../thanhPhan/CanhNenChibi';
import { CongThucToan } from '../thanhPhan/CongThucToan';
import { HinhVe } from '../thanhPhan/HinhVe';
import {
  AnTrienChuSa,
  CuonThuGiayDo,
  NutLenhBai,
} from '../thanhPhan/KhungGiaoDien';
import { NhanVat } from '../thanhPhan/NhanVat';
import { TieuNon } from '../thanhPhan/TieuNon';

type TabDongPhu = 'beQuan' | 'luyenCong' | 'soTamMa' | 'nangCap';

function dinhDangThoiGian(ms: number): string {
  const tongGiay = Math.max(0, Math.ceil(ms / 1000));
  const gio = Math.floor(tongGiay / 3600);
  const phut = Math.floor((tongGiay % 3600) / 60);
  const giay = tongGiay % 60;
  return `${String(gio).padStart(2, '0')}:${String(phut).padStart(2, '0')}:${String(
    giay
  ).padStart(2, '0')}`;
}

export const ManDongPhu: React.FC<{
  tienTrinh: TienTrinhNguoiChoi;
  nganHangCauHoi: CauHoi[];
  khiBatDauBeQuan: (thoiLuongPhut: 15 | 60 | 240) => void;
  khiHoanTatBeQuan: (linhKhiNhan: number) => void;
  khiHuyBeQuan: () => void;
  khiNangCapLinhMach: () => void;
  khiNangCapLinhTuyen: () => void;
  khiGhiNhanKetQuaCau: (cauId: string, dung: boolean, canhGioi: MaCanhGioi) => void;
  khiBaoCauSai?: (cau: CauHoi) => void;
}> = ({
  tienTrinh,
  nganHangCauHoi,
  khiBatDauBeQuan,
  khiHoanTatBeQuan,
  khiHuyBeQuan,
  khiNangCapLinhMach,
  khiNangCapLinhTuyen,
  khiGhiNhanKetQuaCau,
  khiBaoCauSai,
}) => {
  const [tab, setTab] = useState<TabDongPhu>('beQuan');
  const [bayGio, setBayGio] = useState(() => Date.now());

  // 2 cau hoi thuc tinh Ngo Dao sau Be Quan
  const [boCauNgoDao, setBoCauNgoDao] = useState<CauHoi[] | null>(null);
  const [idxNgoDao, setIdxNgoDao] = useState(0);
  const [soDungNgoDao, setSoDungNgoDao] = useState(0);

  // Luyen Cong Phong
  const [lcCanhGioi, setLcCanhGioi] = useState<MaCanhGioi>(tienTrinh.canhGioiHienTai);
  const [lcGiaiDoan, setLcGiaiDoan] = useState<MaGiaiDoan | 'tatCa'>('tatCa');
  const [lcSoCau, setLcSoCau] = useState<5 | 10 | 20>(5);
  const [boCauLuyenCong, setBoCauLuyenCong] = useState<CauHoi[] | null>(null);
  const [idxLc, setIdxLc] = useState(0);
  const [soDungLc, setSoDungLc] = useState(0);

  // On tap 1 cau trong So Tam Ma
  const [cauTamMaDangOn, setCauTamMaDangOn] = useState<CauHoi | null>(null);

  // Trang thai lam bai chung cho ca Ngo Dao / Luyen Cong / So Tam Ma
  const [phuongAnChon, setPhuongAnChon] = useState<number | null>(null);
  const [soNhap, setSoNhap] = useState('');
  const [daCham, setDaCham] = useState(false);
  const [vuaDung, setVuaDung] = useState(false);

  useEffect(() => {
    const t = window.setInterval(() => setBayGio(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const tienDoBeQuan = tinhTienDoBeQuan(tienTrinh.dongPhu.beQuan, bayGio);
  const luotConLai = soLuotBeQuanConLaiHomNay(tienTrinh.dongPhu, bayGio);

  const danhSachTamMa = useMemo(
    () =>
      tienTrinh.dongPhu.soTamMa
        .map((id) => nganHangCauHoi.find((c) => c.id === id))
        .filter((c): c is CauHoi => Boolean(c)),
    [tienTrinh.dongPhu.soTamMa, nganHangCauHoi]
  );

  const resetTrangThaiCau = () => {
    setPhuongAnChon(null);
    setSoNhap('');
    setDaCham(false);
    setVuaDung(false);
  };

  const batDauThucTinhNgoDao = () => {
    const chon = bocCauHoi({
      nganHang: nganHangCauHoi,
      tienTrinh,
      canhGioi: tienTrinh.canhGioiHienTai,
      giaiDoan: 'tatCa',
      soLuong: 2,
      luotMo: tienTrinh.dongPhu.soLanBeQuanHomNay + 1,
    });
    setBoCauNgoDao(chon);
    setIdxNgoDao(0);
    setSoDungNgoDao(0);
    resetTrangThaiCau();
  };

  const batDauLuyenCong = () => {
    const chon = bocCauHoi({
      nganHang: nganHangCauHoi,
      tienTrinh,
      canhGioi: lcCanhGioi,
      giaiDoan: lcGiaiDoan,
      soLuong: lcSoCau,
      luotMo: tienTrinh.dongPhu.soLanLuyenCongHomNay + 1,
    });
    if (chon.length === 0) return;
    boPhatAmThanh.phatAmNhanNut();
    setBoCauLuyenCong(chon);
    setIdxLc(0);
    setSoDungLc(0);
    resetTrangThaiCau();
  };

  const cauHienTaiDangLam =
    boCauNgoDao?.[idxNgoDao] || boCauLuyenCong?.[idxLc] || cauTamMaDangOn;

  const xuLyNopCau = () => {
    if (!cauHienTaiDangLam || daCham) return;
    const dung = chamDapAn(
      cauHienTaiDangLam,
      cauHienTaiDangLam.dang === 'dienSo' ? soNhap : (phuongAnChon ?? -1)
    );
    setDaCham(true);
    setVuaDung(dung);
    if (dung) boPhatAmThanh.phatAmDung();
    else boPhatAmThanh.phatAmSai();

    if (boCauNgoDao) {
      if (dung) setSoDungNgoDao((s) => s + 1);
    } else if (boCauLuyenCong) {
      if (dung) setSoDungLc((s) => s + 1);
      khiGhiNhanKetQuaCau(cauHienTaiDangLam.id, dung, cauHienTaiDangLam.canhGioi);
    } else if (cauTamMaDangOn) {
      khiGhiNhanKetQuaCau(cauHienTaiDangLam.id, dung, cauHienTaiDangLam.canhGioi);
    }
  };

  const tiepTucCau = () => {
    boPhatAmThanh.phatAmNhanNut();
    if (boCauNgoDao) {
      if (idxNgoDao + 1 < boCauNgoDao.length) {
        setIdxNgoDao((i) => i + 1);
        resetTrangThaiCau();
      } else {
        const phut = tienTrinh.dongPhu.beQuan?.thoiLuongPhut || 15;
        const kq = tinhPhanThuongBeQuan({
          thoiLuongPhut: phut,
          capLinhMach: tienTrinh.dongPhu.capLinhMach,
          soCauDungNgoDao: soDungNgoDao,
        });
        setBoCauNgoDao(null);
        resetTrangThaiCau();
        khiHoanTatBeQuan(kq.linhKhi);
      }
      return;
    }

    if (boCauLuyenCong) {
      if (idxLc + 1 < boCauLuyenCong.length) {
        setIdxLc((i) => i + 1);
        resetTrangThaiCau();
      } else {
        setBoCauLuyenCong(null);
        resetTrangThaiCau();
      }
      return;
    }

    if (cauTamMaDangOn) {
      setCauTamMaDangOn(null);
      resetTrangThaiCau();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 pb-28 md:pb-12 space-y-5">
      {/* Khung canh Dong Phu sinh dong */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-[#E4BC5A]/45 shadow-lg">
        <div className="absolute inset-0">
          <CanhNenChibi canhGioi={tienTrinh.canhGioiHienTai} className="w-full h-full" />
        </div>
        <div className="relative z-10 p-4 sm:p-5 bg-gradient-to-t from-[#070B14]/88 via-[#070B14]/35 to-transparent flex flex-col sm:flex-row sm:items-end justify-between gap-4 min-h-[180px]">
          <div className="flex items-end gap-3">
            <NhanVat
              ngoaiHinh={tienTrinh.ngoaiHinh}
              kichCo="vua"
              tuThe={tienDoBeQuan.dangHoatDong ? 'ngoiThien' : 'dungYen'}
              canhGioi={tienTrinh.canhGioiHienTai}
            />
            <TieuNon
              bieuCam={tienDoBeQuan.daHoanThanh ? 'coVu' : 'vui'}
              className="w-11 h-11 mb-2"
            />
          </div>
          <div className="text-left sm:text-right">
            <div className="text-xs font-semibold text-[#62D1B5]">
              Động Phủ · Nơi Tĩnh Tọa & Luyện Công Tự Do
            </div>
            <h1 className="tieu-de-vang text-2xl sm:text-3xl font-bold">
              Động Phủ Của {tienTrinh.ngoaiHinh.ten}
            </h1>
            <p className="text-xs text-[#DCE6EA]/90 mt-0.5">
              Linh Mạch cấp {tienTrinh.dongPhu.capLinhMach} · Linh Tuyền cấp {tienTrinh.dongPhu.capLinhTuyen}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Tab chuc nang Dong Phu */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(
          [
            ['beQuan', 'Bế Quan'],
            ['luyenCong', 'Luyện Công'],
            ['soTamMa', `Sổ Tâm Ma (${danhSachTamMa.length})`],
            ['nangCap', 'Nâng Cấp'],
          ] as [TabDongPhu, string][]
        ).map(([ma, nhan]) => (
          <button
            key={ma}
            type="button"
            onClick={() => {
              boPhatAmThanh.phatAmNhanNut();
              setTab(ma);
            }}
            className={`min-h-[44px] px-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer ${
              tab === ma
                ? 'bg-[#1E7F6B] border-[#62D1B5] text-[#F8F6EE]'
                : 'bg-[#0D1424] border-[#1F2A4D] text-[#DCE6EA] hover:border-[#E4BC5A]/45'
            }`}
          >
            {nhan}
          </button>
        ))}
      </div>

      {/* Hop thoai lam bai Ngo Dao / Luyen Cong / So Tam Ma */}
      {cauHienTaiDangLam ? (
        <CuonThuGiayDo>
          <div className="flex items-center justify-between text-xs text-[#6B3B2A] mb-2">
            <span className="font-bold">
              {boCauNgoDao
                ? `Thức Tỉnh Ngộ Đạo (${idxNgoDao + 1}/2)`
                : boCauLuyenCong
                ? `Luyện Công Phòng (${idxLc + 1}/${boCauLuyenCong.length}) · Đúng ${soDungLc}`
                : 'Hóa Giải Sổ Tâm Ma (Đúng 2 lần liên tiếp để xóa)'}
            </span>
            {boCauLuyenCong && (
              <button
                type="button"
                onClick={() => {
                  setBoCauLuyenCong(null);
                  resetTrangThaiCau();
                }}
                className="text-[#8F1F1A] font-semibold hover:underline cursor-pointer"
              >
                Kết thúc sớm
              </button>
            )}
          </div>

          <div className="text-base font-medium text-[#2B2118] leading-relaxed">
            <CongThucToan noiDung={cauHienTaiDangLam.deBai} />
          </div>
          {cauHienTaiDangLam.hinhVe && <HinhVe hinh={cauHienTaiDangLam.hinhVe} />}

          <div className="mt-4">
            {cauHienTaiDangLam.dang === 'dienSo' ? (
              <input
                type="text"
                inputMode="decimal"
                disabled={daCham}
                value={soNhap}
                onChange={(e) => setSoNhap(e.target.value)}
                placeholder="Nhập đáp án số..."
                aria-label="Nhập đáp án số"
                className="w-full min-h-[46px] px-3.5 rounded-lg bg-white/85 border-2 border-[#B98B2E]/60 text-[#2B2118] text-base font-semibold chu-so-bang"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(cauHienTaiDangLam.luaChon || []).map((lc, idx) => {
                  const dangChon = phuongAnChon === idx;
                  const laDung = idx === Number(cauHienTaiDangLam.dapAn);
                  let lop = 'bg-[#FFFDF8] border-[#B98B2E]/45 text-[#2B2118]';
                  if (daCham) {
                    if (laDung) lop = 'bg-[#1E7F6B] border-[#0E4A3E] text-[#F8F6EE]';
                    else if (dangChon) lop = 'bg-[#C8372D] border-[#8F1F1A] text-[#FAF4E8]';
                  } else if (dangChon) {
                    lop = 'bg-[#141D33] border-[#E4BC5A] text-[#F2D88B]';
                  }
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={daCham}
                      onClick={() => {
                        boPhatAmThanh.phatAmNhanNut();
                        setPhuongAnChon(idx);
                      }}
                      className={`min-h-[48px] px-3 py-2 rounded-lg border-2 text-left flex items-center gap-2.5 cursor-pointer ${lop}`}
                    >
                      <AnTrienChuSa
                        chu={['A', 'B', 'C', 'D'][idx] || String(idx + 1)}
                        kichThuoc="nho"
                      />
                      <span className="text-sm font-medium">
                        <CongThucToan noiDung={lc} />
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {daCham && (
            <div
              className={`mt-4 rounded-lg border p-3 text-sm ${
                vuaDung
                  ? 'bg-[#1E7F6B]/14 border-[#1E7F6B] text-[#124238]'
                  : 'bg-[#C8372D]/12 border-[#C8372D] text-[#6E1A15]'
              }`}
            >
              <div className="font-bold mb-1">
                {vuaDung ? 'Chính xác!' : 'Chưa chuẩn xác — xem lại lời giải:'}
              </div>
              <div className="text-[#2B2118]">
                <CongThucToan noiDung={cauHienTaiDangLam.loiGiai} />
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-[#6B3B2A]">
                  Nguồn: {dinhDangNguonCau(cauHienTaiDangLam.nguon)}
                  {cauHienTaiDangLam.laAISinh ? ' · AI sinh' : ''}
                </span>
                {khiBaoCauSai && (
                  <button
                    type="button"
                    onClick={() => khiBaoCauSai(cauHienTaiDangLam)}
                    className="px-2.5 py-1 rounded border border-[#8F1F1A]/40 text-[#8F1F1A] hover:bg-[#C8372D]/10 text-xs font-semibold cursor-pointer"
                  >
                    Báo câu sai
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            {!daCham ? (
              <NutLenhBai
                type="button"
                kieu="ngoc"
                disabled={
                  cauHienTaiDangLam.dang === 'dienSo'
                    ? !soNhap.trim()
                    : phuongAnChon === null
                }
                onClick={xuLyNopCau}
              >
                Kiểm tra đáp án
              </NutLenhBai>
            ) : (
              <NutLenhBai type="button" kieu="vang" onClick={tiepTucCau}>
                {boCauNgoDao && idxNgoDao + 1 >= boCauNgoDao.length
                  ? 'Thu Linh Khí Bế Quan'
                  : 'Tiếp tục'}
              </NutLenhBai>
            )}
          </div>
        </CuonThuGiayDo>
      ) : (
        <>
          {/* TAB 1: BE QUAN */}
          {tab === 'beQuan' && (
            <section className="khung-ngoc-gian rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="tieu-de-vang text-lg font-bold">
                    Bế Quan Tĩnh Tọa Tu Luyện
                  </h2>
                  <p className="text-xs text-[#9BA8BE]">
                    Bộ đếm chạy theo đồng hồ thực tế dù thoát trình duyệt. Hôm nay còn{' '}
                    <strong className="text-[#62D1B5]">{luotConLai}/3</strong> lượt Bế Quan.
                  </p>
                </div>
                <span className="text-xs font-semibold text-[#E4BC5A]">
                  Linh Mạch +{Math.max(0, tienTrinh.dongPhu.capLinhMach - 1) * 10}% Linh khí
                </span>
              </div>

              {tienDoBeQuan.dangHoatDong ? (
                <div className="rounded-xl border border-[#3FB59A]/45 bg-[#070B14]/80 p-5 text-center space-y-3">
                  <div className="text-xs text-[#62D1B5] font-semibold">
                    {tienDoBeQuan.daHoanThanh
                      ? 'Đã tụ đủ Linh khí Bế Quan! Sẵn sàng Thức Tỉnh Ngộ Đạo!'
                      : 'Đang tĩnh tọa dẫn linh khí vào đan điền...'}
                  </div>
                  <div className="text-3xl font-bold text-[#F2D88B] chu-so-bang">
                    {dinhDangThoiGian(tienDoBeQuan.msConLai)}
                  </div>
                  <div className="h-2.5 rounded-full bg-[#0D1424] border border-[#1F2A4D] overflow-hidden max-w-md mx-auto">
                    <div
                      className="h-full bg-gradient-to-r from-[#3FB59A] to-[#E4BC5A]"
                      style={{ width: `${tienDoBeQuan.phanTram}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    {tienDoBeQuan.daHoanThanh ? (
                      <NutLenhBai type="button" kieu="vang" onClick={batDauThucTinhNgoDao}>
                        Thức Tỉnh Ngộ Đạo (2 câu)
                      </NutLenhBai>
                    ) : (
                      <NutLenhBai
                        type="button"
                        kieu="tram"
                        onClick={() => {
                          boPhatAmThanh.phatAmNhanNut();
                          khiHuyBeQuan();
                        }}
                      >
                        Xuất quan sớm (Hủy lượt)
                      </NutLenhBai>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(
                    [
                      { phut: 15 as const, nhan: '15 Phút · Tiểu Chu Thiên', coBan: 20 },
                      { phut: 60 as const, nhan: '1 Giờ · Đại Chu Thiên', coBan: 50 },
                      { phut: 240 as const, nhan: '4 Giờ · Bế Quan Dài', coBan: 110 },
                    ]
                  ).map((muc) => {
                    const maxThuong = tinhPhanThuongBeQuan({
                      thoiLuongPhut: muc.phut,
                      capLinhMach: tienTrinh.dongPhu.capLinhMach,
                      soCauDungNgoDao: 2,
                    });
                    return (
                      <div
                        key={muc.phut}
                        className="rounded-xl border border-[#1F2A4D] bg-[#070B14]/80 p-4 flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="font-serif text-base font-bold text-[#F2D88B]">
                            {muc.nhan}
                          </div>
                          <div className="text-xs text-[#62D1B5] mt-1 flex items-center gap-1">
                            <BieuTuongLinhKhi className="w-3.5 h-3.5" />
                            +{muc.coBan} đến +{maxThuong.linhKhi} Linh khí (x2 nếu đúng 2 câu Ngộ Đạo)
                          </div>
                        </div>
                        <NutLenhBai
                          type="button"
                          kieu="ngoc"
                          disabled={luotConLai <= 0}
                          onClick={() => {
                            boPhatAmThanh.phatAmNgoDao();
                            khiBatDauBeQuan(muc.phut);
                          }}
                        >
                          Bắt đầu Bế Quan
                        </NutLenhBai>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* TAB 2: LUYEN CONG PHONG */}
          {tab === 'luyenCong' && (
            <section className="khung-ngoc-gian rounded-xl p-5 space-y-5">
              <div>
                <h2 className="tieu-de-vang text-lg font-bold">
                  Luyện Công Phòng · Ôn Luyện Tự Do
                </h2>
                <p className="text-xs text-[#9BA8BE]">
                  Luyện tập không giới hạn, không mất Linh lực khi trả lời sai, xem lời giải ngay.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={lcCanhGioi}
                  onChange={(e) => setLcCanhGioi(e.target.value as MaCanhGioi)}
                  aria-label="Chọn cảnh giới luyện công"
                  className="min-h-[42px] px-3 rounded-lg bg-[#070B14] border border-[#1F2A4D] text-sm text-[#DCE6EA]"
                >
                  {DANH_SACH_CANH_GIOI.filter((c) => laCanhGioiDaMo(tienTrinh, c.id)).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.ten} ({c.baiHoc})
                    </option>
                  ))}
                </select>

                <select
                  value={lcGiaiDoan}
                  onChange={(e) => setLcGiaiDoan(e.target.value as MaGiaiDoan | 'tatCa')}
                  aria-label="Chọn giai đoạn luyện công"
                  className="min-h-[42px] px-3 rounded-lg bg-[#070B14] border border-[#1F2A4D] text-sm text-[#DCE6EA]"
                >
                  <option value="tatCa">Tất cả giai đoạn</option>
                  <option value="soKy">Sơ kỳ</option>
                  <option value="trungKy">Trung kỳ</option>
                  <option value="hauKy">Hậu kỳ</option>
                  <option value="dinhPhong">Đỉnh phong</option>
                </select>

                <select
                  value={lcSoCau}
                  onChange={(e) => setLcSoCau(Number(e.target.value) as 5 | 10 | 20)}
                  aria-label="Chọn số câu luyện công"
                  className="min-h-[42px] px-3 rounded-lg bg-[#070B14] border border-[#1F2A4D] text-sm text-[#DCE6EA]"
                >
                  <option value={5}>5 câu hỏi</option>
                  <option value={10}>10 câu hỏi</option>
                  <option value={20}>20 câu hỏi</option>
                </select>
              </div>

              <NutLenhBai type="button" kieu="vang" onClick={batDauLuyenCong}>
                Bắt đầu Luyện Công ({lcSoCau} câu)
              </NutLenhBai>

              {/* Thong ke ti le dung theo tung canh gioi */}
              <div className="pt-3 border-t border-[#1F2A4D] space-y-2.5">
                <h3 className="text-xs font-bold text-[#62D1B5]">
                  Thống Kê Độ Chính Xác Theo Cảnh Giới
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DANH_SACH_CANH_GIOI.map((cg) => {
                    const tk = tienTrinh.dongPhu.thongKeCanhGioi[cg.id] || {
                      dung: 0,
                      tong: 0,
                    };
                    const tyLe = tk.tong > 0 ? Math.round((tk.dung / tk.tong) * 100) : 0;
                    return (
                      <div
                        key={cg.id}
                        className="rounded-lg bg-[#070B14]/75 border border-[#1F2A4D] p-2.5"
                      >
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#F6EEDB] font-semibold">{cg.ten}</span>
                          <span className="text-[#9BA8BE] chu-so-bang">
                            {tk.dung}/{tk.tong} ({tyLe}%)
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[#0D1424] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${tyLe}%`, backgroundColor: cg.mauChuDao }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* TAB 3: SO TAM MA */}
          {tab === 'soTamMa' && (
            <section className="khung-ngoc-gian rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2.5">
                <BieuTuongTamMa className="w-6 h-6" />
                <div>
                  <h2 className="tieu-de-vang text-lg font-bold">
                    Sổ Tâm Ma · Ghi Chép Câu Làm Sai
                  </h2>
                  <p className="text-xs text-[#9BA8BE]">
                    Trả lời đúng 2 lần liên tiếp một câu trong Sổ để xóa Tâm Ma và nhận +10 Linh thạch!
                  </p>
                </div>
              </div>

              {danhSachTamMa.length === 0 ? (
                <div className="rounded-xl border border-[#3FB59A]/35 bg-[#070B14]/75 p-6 text-center text-sm text-[#62D1B5]">
                  Đạo tâm thanh tịnh! Hiện chưa có câu hỏi nào vướng Tâm Ma.
                </div>
              ) : (
                <div className="space-y-3">
                  {danhSachTamMa.map((cau) => {
                    const chuoi = tienTrinh.dongPhu.chuoiDungTamMa[cau.id] || 0;
                    return (
                      <div
                        key={cau.id}
                        className="rounded-xl border border-[#B79CFF]/40 bg-[#070B14]/85 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="text-[11px] text-[#B79CFF] font-semibold">
                            Chuỗi đúng hiện tại: {chuoi}/2
                          </div>
                          <div className="text-sm text-[#DCE6EA] mt-0.5">
                            <CongThucToan noiDung={cau.deBai} />
                          </div>
                        </div>
                        <NutLenhBai
                          type="button"
                          kieu="ngoc"
                          className="text-xs px-3 py-2 shrink-0"
                          onClick={() => {
                            boPhatAmThanh.phatAmNhanNut();
                            setCauTamMaDangOn(cau);
                            resetTrangThaiCau();
                          }}
                        >
                          Ôn lại câu này
                        </NutLenhBai>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* TAB 4: NANG CAP LINH MACH & LINH TUYEN */}
          {tab === 'nangCap' && (
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Linh Mach */}
              <div className="khung-ngoc-gian rounded-xl p-5 flex flex-col justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-[#62D1B5]">
                    Cấp {tienTrinh.dongPhu.capLinhMach}/{CAP_NANG_CAP_TOI_DA}
                  </div>
                  <h3 className="tieu-de-vang text-lg font-bold mt-0.5">
                    Nâng Cấp Linh Mạch
                  </h3>
                  <p className="text-xs text-[#DCE6EA]/85 mt-1">
                    Tăng +10% Linh khí thu được mỗi lần Bế Quan cho từng cấp. Hiện tại:{' '}
                    <strong className="text-[#62D1B5]">
                      +{Math.max(0, tienTrinh.dongPhu.capLinhMach - 1) * 10}%
                    </strong>
                    .
                  </p>
                </div>

                {tienTrinh.dongPhu.capLinhMach >= CAP_NANG_CAP_TOI_DA ? (
                  <div className="text-xs font-bold text-[#E4BC5A]">Đã đạt cấp tối đa</div>
                ) : (
                  <NutLenhBai
                    type="button"
                    kieu="vang"
                    disabled={
                      tienTrinh.linhThach <
                      chiPhiNangCapLinhMach(tienTrinh.dongPhu.capLinhMach)
                    }
                    onClick={() => {
                      boPhatAmThanh.phatAmNgoDao();
                      khiNangCapLinhMach();
                    }}
                  >
                    <BieuTuongLinhThach className="w-4 h-4" />
                    Nâng cấp ({chiPhiNangCapLinhMach(tienTrinh.dongPhu.capLinhMach)} Linh thạch)
                  </NutLenhBai>
                )}
              </div>

              {/* Linh Tuyen */}
              <div className="khung-ngoc-gian rounded-xl p-5 flex flex-col justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-[#62D1B5]">
                    Cấp {tienTrinh.dongPhu.capLinhTuyen}/{CAP_NANG_CAP_TOI_DA}
                  </div>
                  <h3 className="tieu-de-vang text-lg font-bold mt-0.5">
                    Nâng Cấp Linh Tuyền
                  </h3>
                  <p className="text-xs text-[#DCE6EA]/85 mt-1">
                    Gia tăng Linh lực khởi đầu khi bước vào Vượt Ải (+1 tại cấp 3 và +2 tại cấp 5). Hiện tại:{' '}
                    <strong className="text-[#62D1B5]">
                      +{Math.floor(Math.max(0, tienTrinh.dongPhu.capLinhTuyen - 1) / 2)} Linh lực
                    </strong>
                    .
                  </p>
                </div>

                {tienTrinh.dongPhu.capLinhTuyen >= CAP_NANG_CAP_TOI_DA ? (
                  <div className="text-xs font-bold text-[#E4BC5A]">Đã đạt cấp tối đa</div>
                ) : (
                  <NutLenhBai
                    type="button"
                    kieu="ngoc"
                    disabled={
                      tienTrinh.linhThach <
                      chiPhiNangCapLinhTuyen(tienTrinh.dongPhu.capLinhTuyen)
                    }
                    onClick={() => {
                      boPhatAmThanh.phatAmNgoDao();
                      khiNangCapLinhTuyen();
                    }}
                  >
                    <BieuTuongLinhThach className="w-4 h-4" />
                    Nâng cấp ({chiPhiNangCapLinhTuyen(tienTrinh.dongPhu.capLinhTuyen)} Linh thạch)
                  </NutLenhBai>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};
