import React, { useEffect, useMemo, useState } from 'react';
import { boPhatAmThanh } from '../amThanh/boPhatAmThanh';
import { DANH_SACH_CANH_GIOI, layThongTinCanhGioi } from '../duLieu/canhGioi';
import {
  HoSoNguoiDung,
  KetQuaLuotDamMay,
  KetQuaTaoHangLoatMuc,
  TongMon,
} from '../kieuDuLieu/taiKhoan';
import { CauHoi, TienTrinhNguoiChoi } from '../kieuDuLieu/troChoi';
import {
  chanDoanHocSinhChiTiet,
  chanDoanLopHocToanDien,
  TEN_GIAI_DOAN_NGAN,
} from '../logic/chanDoanToanHoc';
import { khoLuuTru } from '../logic/khoLuuTru';
import {
  doiMaLoiFirebase,
  kiemTraTenDangNhap,
  phanTichDanhSachHangLoat,
  SO_TAI_KHOAN_HANG_LOAT_TOI_DA,
  taoChuoiCsvUtf8Bom,
} from '../logic/taiKhoanLogic';
import {
  khoaGiaiDoan,
  THU_TU_CANH_GIOI,
  THU_TU_GIAI_DOAN,
} from '../logic/tienTrinh';
import { CongThucToan } from '../thanhPhan/CongThucToan';
import { NutLenhBai } from '../thanhPhan/KhungGiaoDien';

type TheTongMon = 'danhSachLop' | 'hocSinh' | 'chanDoan' | 'capTaiKhoan';

function dinhDangNgay(epochMs: number): string {
  if (!epochMs) return 'Chưa rõ';
  const d = new Date(epochMs);
  return `${String(d.getDate()).padStart(2, '0')}/${String(
    d.getMonth() + 1
  ).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(
    2,
    '0'
  )}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function taiTepCsv(tenTep: string, noiDung: string): void {
  const blob = new Blob([noiDung], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = tenTep;
  a.click();
  URL.revokeObjectURL(url);
}

export const ManTongMon: React.FC<{
  nganHangCauHoi: CauHoi[];
  laQuanTri: boolean;
  khiQuayLai: () => void;
}> = ({ nganHangCauHoi, laQuanTri, khiQuayLai }) => {
  const [the, setThe] = useState<TheTongMon>('hocSinh');
  const [dangTai, setDangTai] = useState(true);
  const [thongBao, setThongBao] = useState<string | null>(null);
  const [loi, setLoi] = useState<string | null>(null);

  const [dsTongMon, setDsTongMon] = useState<TongMon[]>([]);
  const [maTongMonChon, setMaTongMonChon] = useState<string>('tatCa');
  const [dsHocSinh, setDsHocSinh] = useState<HoSoNguoiDung[]>([]);
  const [dsLuot, setDsLuot] = useState<KetQuaLuotDamMay[]>([]);
  const [tuKhoa, setTuKhoa] = useState('');

  // Form lap / sua Tong Mon
  const [tenTmMoi, setTenTmMoi] = useState('');
  const [tenLopMoi, setTenLopMoi] = useState('');
  const [moTaTmMoi, setMoTaTmMoi] = useState('');
  const [dangLuuTm, setDangLuuTm] = useState(false);

  // Soi chi tiet & diem yeu 1 hoc sinh
  const [hsDangSoi, setHsDangSoi] = useState<{
    hoSo: HoSoNguoiDung;
    tienTrinh: TienTrinhNguoiChoi;
    luotGanDay: KetQuaLuotDamMay[];
  } | null>(null);
  const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);

  // Khoa & cap thay the
  const [hsCanKhoa, setHsCanKhoa] = useState<HoSoNguoiDung | null>(null);
  const [lyDoKhoa, setLyDoKhoa] = useState('');
  const [hsThayThe, setHsThayThe] = useState<HoSoNguoiDung | null>(null);
  const [tenMoiThayThe, setTenMoiThayThe] = useState('');
  const [kqThayThe, setKqThayThe] = useState<{
    tenDangNhap: string;
    matKhauTam: string;
  } | null>(null);

  // Cap tai khoan hang loat theo Tong Mon
  const [maTongMonCapTk, setMaTongMonCapTk] = useState<string>('');
  const [vanBanDanhSach, setVanBanDanhSach] = useState('');
  const [dangTaoHangLoat, setDangTaoHangLoat] = useState(false);
  const [tienDoTao, setTienDoTao] = useState({ xong: 0, tong: 0 });
  const [kqHangLoat, setKqHangLoat] = useState<KetQuaTaoHangLoatMuc[]>([]);

  const taiDuLieu = async (maTm?: string) => {
    setDangTai(true);
    setLoi(null);
    try {
      const dsTm = await khoLuuTru.gvDocDanhSachTongMon(!laQuanTri);
      setDsTongMon(dsTm);

      const maLoc = maTm ?? maTongMonChon;
      if (!maTongMonCapTk && dsTm.length > 0) {
        setMaTongMonCapTk(dsTm[0].id);
      }

      const dsHs = await khoLuuTru.gvDocHocSinhCuaToi(
        maLoc === 'tatCa' ? null : maLoc,
        laQuanTri
      );
      setDsHocSinh(dsHs);

      const uids = dsHs.map((h) => h.uid);
      const luot = await khoLuuTru.gvDocKetQuaLuotCuaHocSinh(uids, 600);
      setDsLuot(luot);
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    void taiDuLieu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doiBoLocTongMon = (maMoi: string) => {
    setMaTongMonChon(maMoi);
    void taiDuLieu(maMoi);
  };

  const mapTenTongMon = useMemo(() => {
    const m = new Map<string, TongMon>();
    for (const tm of dsTongMon) m.set(tm.id, tm);
    return m;
  }, [dsTongMon]);

  const dsHocSinhLoc = useMemo(() => {
    const q = tuKhoa.trim().toLowerCase();
    if (!q) return dsHocSinh;
    return dsHocSinh.filter(
      (h) =>
        h.daoHieu.toLowerCase().includes(q) ||
        (h.tenDangNhap || '').toLowerCase().includes(q) ||
        (h.lop || '').toLowerCase().includes(q)
    );
  }, [dsHocSinh, tuKhoa]);

  const chanDoanLop = useMemo(
    () => chanDoanLopHocToanDien(dsHocSinh, dsLuot, nganHangCauHoi),
    [dsHocSinh, dsLuot, nganHangCauHoi]
  );

  const chanDoanCaNhan = useMemo(() => {
    if (!hsDangSoi) return null;
    return chanDoanHocSinhChiTiet(
      hsDangSoi.tienTrinh,
      hsDangSoi.luotGanDay,
      nganHangCauHoi
    );
  }, [hsDangSoi, nganHangCauHoi]);

  const phanTichDanhSach = useMemo(
    () => phanTichDanhSachHangLoat(vanBanDanhSach),
    [vanBanDanhSach]
  );

  // === CAC THAO TAC ===
  const xuLyTaoTongMon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tenTmMoi.trim().length < 2 || tenLopMoi.trim().length < 1) {
      setLoi('Vui lòng nhập tên Tông Môn (≥2 ký tự) và tên lớp (ví dụ: 10A1).');
      return;
    }
    setDangLuuTm(true);
    setLoi(null);
    try {
      const moi = await khoLuuTru.gvTaoTongMon({
        tenTongMon: tenTmMoi,
        tenLop: tenLopMoi,
        moTa: moTaTmMoi,
      });
      setDsTongMon((cu) => [moi, ...cu]);
      if (!maTongMonCapTk) setMaTongMonCapTk(moi.id);
      setTenTmMoi('');
      setTenLopMoi('');
      setMoTaTmMoi('');
      setThongBao(`Đã khai lập "${moi.tenTongMon}" (Lớp ${moi.tenLop}) thành công!`);
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    } finally {
      setDangLuuTm(false);
    }
  };

  const xuLyXoaTongMon = async (tm: TongMon) => {
    if (
      !window.confirm(
        `Xóa "${tm.tenTongMon}"? (Tài khoản học sinh vẫn giữ nguyên, chỉ gỡ liên kết khỏi Tông Môn này.)`
      )
    ) {
      return;
    }
    try {
      await khoLuuTru.gvXoaTongMon(tm.id);
      setDsTongMon((cu) => cu.filter((x) => x.id !== tm.id));
      if (maTongMonChon === tm.id) {
        doiBoLocTongMon('tatCa');
      }
      setThongBao(`Đã xóa ${tm.tenTongMon}.`);
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    }
  };

  const xuLySoiHocSinh = async (hs: HoSoNguoiDung) => {
    setDangTaiChiTiet(true);
    setLoi(null);
    try {
      const ct = await khoLuuTru.qtDocChiTietNguoiDung(hs.uid);
      setHsDangSoi({
        hoSo: hs,
        tienTrinh: ct.tienTrinh,
        luotGanDay: ct.luotGanDay,
      });
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    } finally {
      setDangTaiChiTiet(false);
    }
  };

  const xuLyKhoa = async () => {
    if (!hsCanKhoa) return;
    try {
      await khoLuuTru.gvKhoaTaiKhoan(
        hsCanKhoa.uid,
        lyDoKhoa || 'Tạm khóa bởi Giáo viên phụ trách'
      );
      setDsHocSinh((cu) =>
        cu.map((h) =>
          h.uid === hsCanKhoa.uid
            ? { ...h, biKhoa: true, lyDoKhoa: lyDoKhoa || 'Tạm khóa' }
            : h
        )
      );
      setHsCanKhoa(null);
      setLyDoKhoa('');
      setThongBao('Đã tạm khóa tài khoản học sinh.');
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    }
  };

  const xuLyMoKhoa = async (hs: HoSoNguoiDung) => {
    try {
      await khoLuuTru.gvMoKhoaTaiKhoan(hs.uid);
      setDsHocSinh((cu) =>
        cu.map((h) =>
          h.uid === hs.uid ? { ...h, biKhoa: false, lyDoKhoa: undefined } : h
        )
      );
      setThongBao(`Đã mở khóa tài khoản ${hs.daoHieu}.`);
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    }
  };

  const xuLyCapThayThe = async () => {
    if (!hsThayThe) return;
    const kt = kiemTraTenDangNhap(tenMoiThayThe);
    if (!kt.hopLe) {
      setLoi(kt.loi || 'Tên đăng nhập mới không hợp lệ.');
      return;
    }
    try {
      const kq = await khoLuuTru.gvCapTaiKhoanThayThe(hsThayThe, kt.chuanHoa);
      setKqThayThe({
        tenDangNhap: kq.tenDangNhap,
        matKhauTam: kq.matKhauTam,
      });
      setThongBao('Đã cấp tài khoản thay thế và bảo toàn toàn bộ tiến trình học tập!');
      void taiDuLieu();
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    }
  };

  const xuLyTaoHangLoat = async () => {
    const tm = mapTenTongMon.get(maTongMonCapTk);
    if (!tm) {
      setLoi('Vui lòng chọn hoặc lập ít nhất 1 Tông Môn trước khi cấp tài khoản.');
      return;
    }
    if (phanTichDanhSach.danhSach.length === 0) {
      setLoi('Vui lòng nhập danh sách học sinh (mỗi dòng 1 họ tên, tối thiểu 2 ký tự).');
      return;
    }
    setDangTaoHangLoat(true);
    setLoi(null);
    setKqHangLoat([]);
    setTienDoTao({ xong: 0, tong: phanTichDanhSach.danhSach.length });
    try {
      const dsKq = await khoLuuTru.gvTaoTaiKhoanHocSinhHangLoat(
        tm,
        phanTichDanhSach.danhSach,
        (xong, tong, mucMoi) => {
          setTienDoTao({ xong, tong });
          setKqHangLoat((cu) => [...cu, mucMoi]);
        }
      );
      const okCount = dsKq.filter((k) => k.thanhCong).length;
      setThongBao(
        `Đã cấp xong ${okCount}/${dsKq.length} tài khoản Đệ Tử vào "${tm.tenTongMon}".`
      );
      void taiDuLieu();
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    } finally {
      setDangTaoHangLoat(false);
    }
  };

  const xuatCsvTaiKhoanMoi = () => {
    const tm = mapTenTongMon.get(maTongMonCapTk);
    const csv = taoChuoiCsvUtf8Bom(
      ['STT', 'Tông Môn', 'Lớp', 'Đạo hiệu / Họ tên', 'Tên đăng nhập', 'Mật khẩu tạm', 'Trạng thái'],
      kqHangLoat.map((k) => [
        k.stt,
        tm?.tenTongMon || '',
        k.lop,
        k.daoHieu,
        k.tenDangNhap,
        k.matKhauTam,
        k.thanhCong ? 'Thành công (Đổi MK lần đầu)' : `Lỗi: ${k.loi || ''}`,
      ])
    );
    taiTepCsv(`danh-sach-tai-khoan-${tm?.tenLop || 'tong-mon'}.csv`, csv);
  };

  const xuatCsvBaoCaoKhkt = () => {
    const csv = taoChuoiCsvUtf8Bom(
      [
        'Mã ẩn danh HS',
        'Tông Môn',
        'Lớp',
        'Cảnh giới hiện tại',
        'Tổng sao (/72)',
        'Tổng câu làm',
        'Tổng câu đúng',
        'Tỷ lệ đúng (%)',
        'Số lượt luyện',
      ],
      dsHocSinh.map((h, idx) => {
        const tyLe =
          h.tomTat.tongCauLam > 0
            ? Math.round((h.tomTat.tongCauDung / h.tomTat.tongCauLam) * 100)
            : 0;
        const tm = h.maTongMon ? mapTenTongMon.get(h.maTongMon) : null;
        return [
          `HS_${String(idx + 1).padStart(3, '0')}`,
          tm?.tenTongMon || 'Chưa gắn',
          h.lop || tm?.tenLop || '',
          layThongTinCanhGioi(h.tomTat.canhGioiHienTai).ten,
          h.tomTat.tongSao,
          h.tomTat.tongCauLam,
          h.tomTat.tongCauDung,
          tyLe,
          h.tomTat.soLuotChoi,
        ];
      })
    );
    taiTepCsv(`bao-cao-thong-ke-toan-hoc-khkt.csv`, csv);
    setThongBao('Đã xuất file CSV ẩn danh phục vụ thống kê & báo cáo KHKT!');
  };

  const cacThe: { id: TheTongMon; nhan: string }[] = [
    { id: 'hocSinh', nhan: `Đệ Tử & Tiến độ (${dsHocSinh.length})` },
    { id: 'chanDoan', nhan: 'Chẩn đoán điểm yếu Toán' },
    { id: 'capTaiKhoan', nhan: 'Cấp tài khoản theo danh sách' },
    { id: 'danhSachLop', nhan: `Tông Môn / Lớp (${dsTongMon.length})` },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 pb-28 md:pb-12 space-y-5">
      {/* Tieu de & bo loc Tong Mon */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="tieu-de-vang text-2xl sm:text-3xl font-bold">
            Tông Môn Chưởng Ấn · Quản Lý Lớp & Điểm Yếu Toán Học
          </h1>
          <p className="text-sm text-[#9BA8BE]">
            {laQuanTri
              ? 'Chế độ Quản trị viên: theo dõi toàn bộ Tông Môn, giáo viên và học sinh.'
              : 'Chưởng Môn (Giáo viên): lập nhiều lớp dạy, cấp tài khoản học sinh và chẩn đoán lỗ hổng kiến thức Chương III.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={maTongMonChon}
            onChange={(e) => doiBoLocTongMon(e.target.value)}
            className="min-h-[40px] px-3 rounded-xl bg-[#0D1424] border border-[#E4BC5A]/45 text-sm text-[#F2D88B]"
            aria-label="Lọc theo Tông Môn"
          >
            <option value="tatCa">Tất cả Tông Môn của tôi ({dsTongMon.length})</option>
            {dsTongMon.map((tm) => (
              <option key={tm.id} value={tm.id}>
                {tm.tenTongMon} (Lớp {tm.tenLop})
              </option>
            ))}
          </select>
          <NutLenhBai type="button" kieu="tram" onClick={khiQuayLai}>
            Quay lại Vân Hải
          </NutLenhBai>
        </div>
      </div>

      {thongBao && (
        <div className="rounded-xl border border-[#62D1B5]/50 bg-[#1E7F6B]/20 px-4 py-2.5 text-sm text-[#62D1B5] flex items-center justify-between gap-2">
          <span>{thongBao}</span>
          <button
            type="button"
            onClick={() => setThongBao(null)}
            className="text-xs underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {loi && (
        <div className="rounded-xl border border-[#C8372D]/60 bg-[#8F1F1A]/25 px-4 py-2.5 text-sm text-[#FCA5A5] flex items-center justify-between gap-2">
          <span>{loi}</span>
          <button
            type="button"
            onClick={() => setLoi(null)}
            className="text-xs underline cursor-pointer"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Thanh chuyen the */}
      <div className="flex flex-wrap gap-2 border-b border-[#1F2A4D] pb-3">
        {cacThe.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              boPhatAmThanh.phatAmNhanNut();
              setThe(t.id);
            }}
            className={`min-h-[40px] px-4 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
              the === t.id
                ? 'bg-[#141D33] border-[#E4BC5A] text-[#F2D88B]'
                : 'bg-[#070B14]/70 border-[#1F2A4D] text-[#9BA8BE] hover:text-[#DCE6EA]'
            }`}
          >
            {t.nhan}
          </button>
        ))}
      </div>

      {dangTai ? (
        <div className="khung-ngoc-gian rounded-xl p-8 text-center text-sm text-[#9BA8BE]">
          Đang tải dữ liệu Tông Môn...
        </div>
      ) : (
        <>
          {/* === TAB 1: DANH SACH TONG MON (NHIEU LOP) === */}
          {the === 'danhSachLop' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <form
                onSubmit={xuLyTaoTongMon}
                className="khung-ngoc-gian rounded-xl p-5 space-y-3 h-fit"
              >
                <h2 className="tieu-de-vang text-lg font-bold">
                  Khai lập Tông Môn (Lớp mới)
                </h2>
                <p className="text-xs text-[#9BA8BE]">
                  Mỗi giáo viên có thể tạo nhiều Tông Môn tương ứng các lớp đang giảng dạy (ví dụ: 10A1, 10A2, 10C3).
                </p>
                <div>
                  <label className="block text-xs text-[#9BA8BE] mb-1">
                    Tên Tông Môn *
                  </label>
                  <input
                    value={tenTmMoi}
                    onChange={(e) => setTenTmMoi(e.target.value)}
                    placeholder="VD: Tông Môn 10A2 - Thanh Vân"
                    maxLength={60}
                    className="w-full min-h-[40px] px-3 rounded-lg bg-[#070B14] border border-[#2C3B5E] text-sm text-[#DCE6EA]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9BA8BE] mb-1">
                    Tên Lớp *
                  </label>
                  <input
                    value={tenLopMoi}
                    onChange={(e) => setTenLopMoi(e.target.value)}
                    placeholder="VD: 10A2"
                    maxLength={20}
                    className="w-full min-h-[40px] px-3 rounded-lg bg-[#070B14] border border-[#2C3B5E] text-sm text-[#DCE6EA]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#9BA8BE] mb-1">
                    Ghi chú / Mục tiêu học tập
                  </label>
                  <textarea
                    value={moTaTmMoi}
                    onChange={(e) => setMoTaTmMoi(e.target.value)}
                    placeholder="VD: Ôn tập Chương III Hệ thức lượng - HK1"
                    rows={2}
                    maxLength={200}
                    className="w-full p-3 rounded-lg bg-[#070B14] border border-[#2C3B5E] text-sm text-[#DCE6EA]"
                  />
                </div>
                <NutLenhBai
                  type="submit"
                  kieu="ngoc"
                  disabled={dangLuuTm}
                  className="w-full"
                >
                  {dangLuuTm ? 'Đang khai lập...' : '+ Khai lập Tông Môn mới'}
                </NutLenhBai>
              </form>

              <div className="lg:col-span-2 space-y-3">
                {dsTongMon.length === 0 ? (
                  <div className="khung-ngoc-gian rounded-xl p-6 text-center text-sm text-[#9BA8BE]">
                    Bạn chưa lập Tông Môn nào. Hãy tạo Tông Môn đầu tiên ở khung bên trái để bắt đầu cấp tài khoản cho học sinh!
                  </div>
                ) : (
                  dsTongMon.map((tm) => (
                    <div
                      key={tm.id}
                      className="khung-ngoc-gian rounded-xl p-4 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-[#F2D88B]">
                            {tm.tenTongMon}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-xs bg-[#1E7F6B]/25 border border-[#62D1B5]/45 text-[#62D1B5]">
                            Lớp {tm.tenLop}
                          </span>
                        </div>
                        {tm.moTa && (
                          <p className="text-xs text-[#9BA8BE] mt-1">{tm.moTa}</p>
                        )}
                        <p className="text-[11px] text-[#9BA8BE]/75 mt-1">
                          Mã Tông Môn: <code>{tm.id}</code> · Lập ngày {dinhDangNgay(tm.taoLuc)}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <NutLenhBai
                          type="button"
                          kieu="vang"
                          className="text-xs"
                          onClick={() => {
                            doiBoLocTongMon(tm.id);
                            setThe('hocSinh');
                          }}
                        >
                          Xem học sinh
                        </NutLenhBai>
                        <NutLenhBai
                          type="button"
                          kieu="ngoc"
                          className="text-xs"
                          onClick={() => {
                            setMaTongMonCapTk(tm.id);
                            setThe('capTaiKhoan');
                          }}
                        >
                          Cấp tài khoản
                        </NutLenhBai>
                        <button
                          type="button"
                          onClick={() => void xuLyXoaTongMon(tm)}
                          className="px-3 py-1.5 rounded-lg border border-[#C8372D]/50 text-xs text-[#FCA5A5] hover:bg-[#8F1F1A]/25 cursor-pointer"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* === TAB 2: HOC SINH & TIEN DO === */}
          {the === 'hocSinh' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <input
                  value={tuKhoa}
                  onChange={(e) => setTuKhoa(e.target.value)}
                  placeholder="Tìm học sinh theo Đạo hiệu, tên đăng nhập hoặc lớp..."
                  className="flex-1 min-w-[240px] min-h-[40px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] text-sm text-[#DCE6EA]"
                />
                <NutLenhBai
                  type="button"
                  kieu="ngoc"
                  className="text-xs"
                  onClick={() => setThe('capTaiKhoan')}
                >
                  + Cấp thêm tài khoản Đệ Tử
                </NutLenhBai>
              </div>

              {dsHocSinhLoc.length === 0 ? (
                <div className="khung-ngoc-gian rounded-xl p-8 text-center text-sm text-[#9BA8BE]">
                  Chưa có học sinh nào trong Tông Môn này. Chuyển sang thẻ{' '}
                  <strong className="text-[#F2D88B]">Cấp tài khoản theo danh sách</strong> để tự tạo tài khoản cho học sinh lớp bạn!
                </div>
              ) : (
                <div className="khung-ngoc-gian rounded-xl overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[#1F2A4D] text-xs text-[#9BA8BE] uppercase">
                        <th className="p-3">Đệ Tử (Học sinh)</th>
                        <th className="p-3">Tông Môn / Lớp</th>
                        <th className="p-3">Cảnh giới</th>
                        <th className="p-3">Sao (/72)</th>
                        <th className="p-3">Tỷ lệ đúng</th>
                        <th className="p-3">Hoạt động cuối</th>
                        <th className="p-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1F2A4D]/60">
                      {dsHocSinhLoc.map((hs) => {
                        const tyLe =
                          hs.tomTat.tongCauLam > 0
                            ? Math.round(
                                (hs.tomTat.tongCauDung / hs.tomTat.tongCauLam) * 100
                              )
                            : null;
                        const tm = hs.maTongMon
                          ? mapTenTongMon.get(hs.maTongMon)
                          : null;
                        return (
                          <tr key={hs.uid} className="hover:bg-[#141D33]/40">
                            <td className="p-3">
                              <div className="font-semibold text-[#F6EEDB] flex items-center gap-2">
                                <span>{hs.daoHieu}</span>
                                {hs.biKhoa && (
                                  <span className="px-1.5 py-0.5 text-[10px] rounded bg-[#8F1F1A]/40 text-[#FCA5A5] border border-[#C8372D]/50">
                                    Đã khóa
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-[#9BA8BE]">
                                @{hs.tenDangNhap || '—'}
                              </div>
                            </td>
                            <td className="p-3 text-xs text-[#DCE6EA]">
                              <div>{tm?.tenTongMon || '—'}</div>
                              <div className="text-[#9BA8BE]">
                                Lớp {hs.lop || tm?.tenLop || '—'}
                              </div>
                            </td>
                            <td className="p-3 text-xs font-semibold text-[#62D1B5]">
                              {layThongTinCanhGioi(hs.tomTat.canhGioiHienTai).ten}
                            </td>
                            <td className="p-3 font-bold text-[#F2D88B] chu-so-bang">
                              {hs.tomTat.tongSao}/72 ★
                            </td>
                            <td className="p-3 text-xs">
                              {tyLe === null ? (
                                <span className="text-[#9BA8BE]">Chưa luyện</span>
                              ) : (
                                <span
                                  className={`px-2 py-0.5 rounded-full font-semibold ${
                                    tyLe < 60
                                      ? 'bg-[#8F1F1A]/40 text-[#FCA5A5]'
                                      : tyLe < 80
                                      ? 'bg-[#B98B2E]/25 text-[#F2D88B]'
                                      : 'bg-[#1E7F6B]/30 text-[#62D1B5]'
                                  }`}
                                >
                                  {tyLe}% ({hs.tomTat.tongCauDung}/{hs.tomTat.tongCauLam})
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-xs text-[#9BA8BE]">
                              {dinhDangNgay(
                                Math.max(hs.dangNhapCuoi || 0, hs.tomTat.hoatDongCuoi || 0)
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex flex-wrap justify-end gap-1.5">
                                <button
                                  type="button"
                                  disabled={dangTaiChiTiet}
                                  onClick={() => void xuLySoiHocSinh(hs)}
                                  className="px-2.5 py-1 rounded-lg bg-[#1E7F6B]/30 border border-[#62D1B5]/50 text-xs font-semibold text-[#62D1B5] hover:bg-[#1E7F6B]/50 cursor-pointer"
                                >
                                  Soi điểm yếu
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setHsThayThe(hs);
                                    setTenMoiThayThe(`${hs.tenDangNhap || 'hs'}_2`.slice(0, 20));
                                    setKqThayThe(null);
                                  }}
                                  className="px-2 py-1 rounded-lg border border-[#E4BC5A]/45 text-xs text-[#F2D88B] hover:bg-[#141D33] cursor-pointer"
                                >
                                  Cấp lại TK
                                </button>
                                {hs.biKhoa ? (
                                  <button
                                    type="button"
                                    onClick={() => void xuLyMoKhoa(hs)}
                                    className="px-2 py-1 rounded-lg border border-[#62D1B5]/45 text-xs text-[#62D1B5] cursor-pointer"
                                  >
                                    Mở khóa
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setHsCanKhoa(hs)}
                                    className="px-2 py-1 rounded-lg border border-[#C8372D]/45 text-xs text-[#FCA5A5] cursor-pointer"
                                  >
                                    Khóa
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* === TAB 3: CHAN DOAN DIEM YEU LOP & THONG KE TOAN HOC (CTT) === */}
          {the === 'chanDoan' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="khung-ngoc-gian rounded-xl p-4">
                  <div className="text-xs text-[#9BA8BE]">Tổng Đệ Tử trong lớp</div>
                  <div className="text-2xl font-bold text-[#F2D88B] mt-1 chu-so-bang">
                    {chanDoanLop.tongHocSinh}
                  </div>
                </div>
                <div className="khung-ngoc-gian rounded-xl p-4">
                  <div className="text-xs text-[#9BA8BE]">Hoạt động 7 ngày qua</div>
                  <div className="text-2xl font-bold text-[#62D1B5] mt-1 chu-so-bang">
                    {chanDoanLop.hoatDong7Ngay}/{chanDoanLop.tongHocSinh}
                  </div>
                </div>
                <div className="khung-ngoc-gian rounded-xl p-4">
                  <div className="text-xs text-[#9BA8BE]">Số sao trung bình</div>
                  <div className="text-2xl font-bold text-[#F2D88B] mt-1 chu-so-bang">
                    {chanDoanLop.diemSaoTrungBinh} ★
                  </div>
                </div>
                <div className="khung-ngoc-gian rounded-xl p-4">
                  <div className="text-xs text-[#9BA8BE]">Tỷ lệ làm đúng TB</div>
                  <div className="text-2xl font-bold text-[#62D1B5] mt-1 chu-so-bang">
                    {chanDoanLop.tyLeDungTrungBinh}%
                  </div>
                </div>
              </div>

              {chanDoanLop.machYeuNhat && (
                <div className="rounded-xl border border-[#E4BC5A]/55 bg-[#8F1F1A]/20 p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold uppercase text-[#FCA5A5]">
                      Cảnh báo mạch kiến thức yếu nhất của lớp
                    </div>
                    <div className="text-base font-bold text-[#F2D88B] mt-0.5">
                      {chanDoanLop.machYeuNhat.tenCanhGioi} — {chanDoanLop.machYeuNhat.machKienThuc}
                    </div>
                    <div className="text-xs text-[#DCE6EA]/85 mt-0.5">
                      Tỷ lệ sai của lớp đang ở mức{' '}
                      <strong className="text-[#FCA5A5]">
                        {chanDoanLop.machYeuNhat.tyLeSai}%
                      </strong>
                      . Giáo viên nên ưu tiên củng cố lại mảng này trên lớp.
                    </div>
                  </div>
                  <NutLenhBai
                    type="button"
                    kieu="vang"
                    className="text-xs"
                    onClick={xuatCsvBaoCaoKhkt}
                  >
                    Xuất CSV Thống kê KHKT (Ẩn danh)
                  </NutLenhBai>
                </div>
              )}

              {!chanDoanLop.machYeuNhat && (
                <div className="flex justify-end">
                  <NutLenhBai
                    type="button"
                    kieu="vang"
                    className="text-xs"
                    onClick={xuatCsvBaoCaoKhkt}
                  >
                    Xuất CSV Thống kê KHKT (Ẩn danh)
                  </NutLenhBai>
                </div>
              )}

              {/* Phan bo va ty le dung theo 6 mach kien thuc */}
              <div className="khung-ngoc-gian rounded-xl p-5 space-y-3">
                <h2 className="tieu-de-vang text-lg font-bold">
                  Bản đồ Năng lực 6 Mạch kiến thức Chương III của lớp
                </h2>
                <div className="space-y-3">
                  {chanDoanLop.theoCanhGioi.map((cg) => {
                    const pct = cg.tyLeDung ?? 0;
                    const barColor =
                      cg.tyLeDung === null
                        ? 'bg-[#2C3B5E]'
                        : pct < 60
                        ? 'bg-[#C8372D]'
                        : pct < 80
                        ? 'bg-[#E4BC5A]'
                        : 'bg-[#3FB59A]';
                    return (
                      <div key={cg.canhGioi} className="space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="font-bold text-[#F2D88B]">
                              {cg.tenCanhGioi}
                            </span>{' '}
                            <span className="text-[#9BA8BE]">({cg.machKienThuc})</span>
                          </div>
                          <div className="text-[#DCE6EA] chu-so-bang">
                            Đang ở chặng này: <strong>{cg.soHocSinhDangO} HS</strong> ·{' '}
                            {cg.tyLeDung === null
                              ? 'Chưa có lượt luyện'
                              : `Đúng ${cg.tyLeDung}% (${cg.tongCauDung}/${cg.tongCauLam} câu)`}
                          </div>
                        </div>
                        <div className="h-2.5 rounded-full bg-[#070B14] border border-[#1F2A4D] overflow-hidden">
                          <div
                            className={`h-full transition-all ${barColor}`}
                            style={{ width: `${cg.tyLeDung === null ? 0 : pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top cau hoi sai nhieu nhat kem Chi so Do kho CTT (P_j) */}
              <div className="khung-ngoc-gian rounded-xl p-5 space-y-3">
                <div>
                  <h2 className="tieu-de-vang text-lg font-bold">
                    Top Câu Hỏi Lớp Mắc Lỗi Nhiều Nhất (Chỉ số Độ khó CTT P_j)
                  </h2>
                  <p className="text-xs text-[#9BA8BE]">
                    Chỉ số độ khó theo Lý thuyết Trắc nghiệm Cổ điển: P = (Số lượt đúng) / (Tổng lượt làm). P càng thấp câu càng khó và lớp hổng càng sâu.
                  </p>
                </div>

                {chanDoanLop.topCauSaiCtt.length === 0 ? (
                  <p className="text-sm text-[#9BA8BE] py-4 text-center">
                    Chưa ghi nhận lượt làm bài sai nào trong Tông Môn này. Khi học sinh bắt đầu làm bài, thống kê câu sai & chỉ số P sẽ tự động hiển thị tại đây.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {chanDoanLop.topCauSaiCtt.map((c, idx) => (
                      <div
                        key={c.ma}
                        className="rounded-xl border border-[#1F2A4D] bg-[#070B14]/75 p-3.5 space-y-1.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#F2D88B]">#{idx + 1}</span>
                            <span className="px-2 py-0.5 rounded bg-[#141D33] text-[#62D1B5]">
                              {c.tenCanhGioi} · {c.tenGiaiDoan}
                            </span>
                            <span className="text-[#9BA8BE]">Mã: {c.ma}</span>
                          </div>
                          <div className="flex items-center gap-2 chu-so-bang">
                            <span className="text-[#FCA5A5] font-bold">
                              Sai {c.tyLeSai}% ({c.soLuotSai}/{c.soLuotLam})
                            </span>
                            <span className="px-2 py-0.5 rounded border border-[#E4BC5A]/40 text-[#F2D88B]">
                              P = {c.chiSoDoKhoP} ({c.phanLoaiDoKho})
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-[#DCE6EA]">
                          <CongThucToan noiDung={c.deBai} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* === TAB 4: CAP TAI KHOAN DE TU THEO DANH SACH === */}
          {the === 'capTaiKhoan' && (
            <div className="khung-ngoc-gian rounded-xl p-5 space-y-4">
              <div>
                <h2 className="tieu-de-vang text-lg font-bold">
                  Cấp Tài Khoản Học Sinh Tự Động Theo Tông Môn
                </h2>
                <p className="text-xs text-[#9BA8BE] mt-1">
                  Chọn Tông Môn (lớp) của bạn rồi dán danh sách học sinh (mỗi dòng 1 em, tối đa{' '}
                  {SO_TAI_KHOAN_HANG_LOAT_TOI_DA} học sinh/lần). Hệ thống sẽ tự tạo tên đăng nhập, mật khẩu tạm (yêu cầu đổi ở lần đăng nhập đầu tiên) và gắn trực tiếp vào Tông Môn của bạn.
                </p>
              </div>

              {dsTongMon.length === 0 ? (
                <div className="rounded-xl border border-[#E4BC5A]/45 bg-[#141D33]/60 p-4 text-sm text-[#F2D88B] flex flex-wrap items-center justify-between gap-3">
                  <span>Bạn cần khai lập ít nhất 1 Tông Môn (lớp) trước khi cấp tài khoản học sinh.</span>
                  <NutLenhBai
                    type="button"
                    kieu="ngoc"
                    onClick={() => setThe('danhSachLop')}
                  >
                    Tạo Tông Môn ngay
                  </NutLenhBai>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#9BA8BE] mb-1">
                        Chọn Tông Môn nhận Đệ Tử *
                      </label>
                      <select
                        value={maTongMonCapTk}
                        onChange={(e) => setMaTongMonCapTk(e.target.value)}
                        className="w-full min-h-[42px] px-3 rounded-lg bg-[#070B14] border border-[#E4BC5A]/45 text-sm text-[#F2D88B]"
                      >
                        {dsTongMon.map((tm) => (
                          <option key={tm.id} value={tm.id}>
                            {tm.tenTongMon} (Lớp {tm.tenLop})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="text-xs text-[#9BA8BE] flex items-end pb-2">
                      Đã nhận diện hợp lệ:{' '}
                      <strong className="text-[#62D1B5] mx-1">
                        {phanTichDanhSach.danhSach.length}
                      </strong>{' '}
                      học sinh.
                      {phanTichDanhSach.vuotGioiHan && (
                        <span className="text-[#FCA5A5] ml-2">
                          (Chỉ lấy {SO_TAI_KHOAN_HANG_LOAT_TOI_DA} dòng đầu)
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#9BA8BE] mb-1">
                      Danh sách học sinh (mỗi dòng 1 em, ví dụ: Nguyễn Văn An)
                    </label>
                    <textarea
                      value={vanBanDanhSach}
                      onChange={(e) => setVanBanDanhSach(e.target.value)}
                      rows={6}
                      placeholder={'Nguyễn Văn An\nTrần Thị Bình\nLê Minh Cường'}
                      className="w-full p-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] text-sm text-[#DCE6EA] font-mono"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <NutLenhBai
                      type="button"
                      kieu="ngoc"
                      disabled={dangTaoHangLoat || phanTichDanhSach.danhSach.length === 0}
                      onClick={() => void xuLyTaoHangLoat()}
                    >
                      {dangTaoHangLoat
                        ? `Đang cấp tài khoản (${tienDoTao.xong}/${tienDoTao.tong})...`
                        : `Tự động cấp ${phanTichDanhSach.danhSach.length} tài khoản Đệ Tử`}
                    </NutLenhBai>
                    {kqHangLoat.length > 0 && (
                      <NutLenhBai
                        type="button"
                        kieu="vang"
                        onClick={xuatCsvTaiKhoanMoi}
                      >
                        Tải file Excel/CSV phát cho học sinh
                      </NutLenhBai>
                    )}
                  </div>

                  {kqHangLoat.length > 0 && (
                    <div className="overflow-x-auto border border-[#1F2A4D] rounded-xl">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#1F2A4D] text-[#9BA8BE]">
                            <th className="p-2.5">#</th>
                            <th className="p-2.5">Họ tên / Đạo hiệu</th>
                            <th className="p-2.5">Tên đăng nhập</th>
                            <th className="p-2.5">Mật khẩu tạm</th>
                            <th className="p-2.5">Kết quả</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1F2A4D]/60">
                          {kqHangLoat.map((k) => (
                            <tr key={k.stt}>
                              <td className="p-2.5 text-[#9BA8BE]">{k.stt}</td>
                              <td className="p-2.5 font-semibold text-[#F6EEDB]">
                                {k.daoHieu}
                              </td>
                              <td className="p-2.5 font-mono text-[#62D1B5]">
                                {k.tenDangNhap}
                              </td>
                              <td className="p-2.5 font-mono text-[#F2D88B]">
                                {k.matKhauTam}
                              </td>
                              <td className="p-2.5">
                                {k.thanhCong ? (
                                  <span className="text-[#62D1B5]">Thành công</span>
                                ) : (
                                  <span className="text-[#FCA5A5]">{k.loi}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* === MODAL SOI CHI TIET TIEN DO & DIEM YEU HOC SINH === */}
      {hsDangSoi && chanDoanCaNhan && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="khung-ngoc-gian rounded-2xl p-5 max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-5 border-[#E4BC5A]/55">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#1F2A4D] pb-3">
              <div>
                <h2 className="tieu-de-vang text-xl font-bold">
                  Hồ Sơ Chẩn Đoán Toán Học · {hsDangSoi.hoSo.daoHieu}
                </h2>
                <p className="text-xs text-[#9BA8BE] mt-0.5">
                  @{hsDangSoi.hoSo.tenDangNhap || '—'} · Lớp {hsDangSoi.hoSo.lop || '—'} · Đang ở:{' '}
                  <strong className="text-[#62D1B5]">
                    {chanDoanCaNhan.giaiDoanDangDung.tenCanhGioi} –{' '}
                    {chanDoanCaNhan.giaiDoanDangDung.tenGiaiDoan} (
                    {chanDoanCaNhan.giaiDoanDangDung.mucNhanThuc})
                  </strong>{' '}
                  · Tổng sao: <strong className="text-[#F2D88B]">{chanDoanCaNhan.tongSao}/72 ★</strong>
                </p>
              </div>
              <NutLenhBai
                type="button"
                kieu="tram"
                className="text-xs"
                onClick={() => setHsDangSoi(null)}
              >
                Đóng
              </NutLenhBai>
            </div>

            {/* 1. Ma tran 6 Canh gioi x 4 Giai doan (24 giai doan) */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#F2D88B]">
                1. Lộ trình 24 giai đoạn (6 Cảnh giới × 4 Mức nhận thức)
              </h3>
              <div className="overflow-x-auto border border-[#1F2A4D] rounded-xl">
                <table className="w-full text-xs text-center">
                  <thead>
                    <tr className="border-b border-[#1F2A4D] text-[#9BA8BE] bg-[#070B14]/70">
                      <th className="p-2 text-left">Cảnh giới</th>
                      {THU_TU_GIAI_DOAN.map((gd) => (
                        <th key={gd} className="p-2">
                          {TEN_GIAI_DOAN_NGAN[gd]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F2A4D]/60">
                    {THU_TU_CANH_GIOI.map((cg) => {
                      const info = DANH_SACH_CANH_GIOI.find((c) => c.id === cg)!;
                      return (
                        <tr key={cg}>
                          <td className="p-2 text-left font-semibold text-[#DCE6EA]">
                            {info.ten}
                          </td>
                          {THU_TU_GIAI_DOAN.map((gd) => {
                            const td =
                              hsDangSoi.tienTrinh.tienDoGiaiDoan?.[
                                khoaGiaiDoan(cg, gd)
                              ];
                            const sao = td?.sao || 0;
                            const done = Boolean(td?.hoanThanh);
                            return (
                              <td key={gd} className="p-2">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-md font-semibold ${
                                    done
                                      ? 'bg-[#1E7F6B]/35 text-[#F2D88B] border border-[#62D1B5]/40'
                                      : 'bg-[#070B14] text-[#9BA8BE]/60 border border-[#1F2A4D]'
                                  }`}
                                >
                                  {done ? `${'★'.repeat(sao)}${'☆'.repeat(3 - sao)}` : 'Chưa qua'}
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Chan doan 6 mach kien thuc */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#F2D88B]">
                2. Chẩn đoán mức độ thành thạo theo 6 mạch kiến thức Toán
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {chanDoanCaNhan.kyNangTheoCanhGioi.map((k) => {
                  const mau =
                    k.mucDanhGia === 'yeu'
                      ? 'border-[#C8372D]/60 bg-[#8F1F1A]/15'
                      : k.mucDanhGia === 'trungBinh'
                      ? 'border-[#E4BC5A]/50 bg-[#B98B2E]/10'
                      : k.mucDanhGia === 'tot'
                      ? 'border-[#62D1B5]/45 bg-[#1E7F6B]/15'
                      : 'border-[#1F2A4D] bg-[#070B14]/60';
                  return (
                    <div key={k.canhGioi} className={`rounded-xl border p-3 ${mau}`}>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-bold text-[#F6EEDB]">
                          {k.tenCanhGioi}
                        </span>
                        <span className="font-bold chu-so-bang">
                          {k.tyLeDung === null
                            ? 'Chưa có dữ liệu'
                            : `${k.tyLeDung}% (${k.soCauDung}/${k.soCauLam})`}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#9BA8BE] mt-0.5">
                        {k.machKienThuc} · {k.soGiaiDoanXong}/4 giai đoạn ({k.soSaoDat}/12 ★)
                      </div>
                      {k.mucDanhGia === 'yeu' && k.kinhGoiY.length > 0 && (
                        <div className="text-[11px] text-[#FCA5A5] mt-1.5">
                          Cần ôn gấp Tàng Kinh Các: {k.kinhGoiY.join(' · ')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. So Tam Ma (cau dang lam sai) */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#FCA5A5]">
                3. Sổ Tâm Ma – Các câu hỏi học sinh đang bị kẹt ({chanDoanCaNhan.tamMaChiTiet.length} câu)
              </h3>
              {chanDoanCaNhan.tamMaChiTiet.length === 0 ? (
                <p className="text-xs text-[#62D1B5]">
                  Hiện không còn câu nào kẹt trong Sổ Tâm Ma.
                </p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {chanDoanCaNhan.tamMaChiTiet.map((tm) => (
                    <div
                      key={tm.ma}
                      className="rounded-lg border border-[#C8372D]/40 bg-[#070B14]/80 p-2.5 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[#9BA8BE]">
                        <span>
                          {layThongTinCanhGioi(tm.canhGioi).ten} ·{' '}
                          {TEN_GIAI_DOAN_NGAN[tm.giaiDoan]} ({tm.ma})
                        </span>
                        <span className="text-[#FCA5A5] font-semibold">
                          Sai {tm.soLanSai}/{tm.soLanLam} lần
                        </span>
                      </div>
                      <div className="text-[#DCE6EA]">
                        <CongThucToan noiDung={tm.deBai} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* === MODAL KHOA TAI KHOAN HOC SINH === */}
      {hsCanKhoa && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="khung-ngoc-gian rounded-xl p-5 max-w-md w-full space-y-3 border-[#C8372D]">
            <h3 className="tieu-de-vang text-lg font-bold">
              Tạm khóa tài khoản {hsCanKhoa.daoHieu}
            </h3>
            <input
              value={lyDoKhoa}
              onChange={(e) => setLyDoKhoa(e.target.value)}
              placeholder="Lý do khóa (VD: Đổi sang tài khoản mới)..."
              className="w-full min-h-[40px] px-3 rounded-lg bg-[#070B14] border border-[#2C3B5E] text-sm text-[#DCE6EA]"
            />
            <div className="flex justify-end gap-2">
              <NutLenhBai
                type="button"
                kieu="tram"
                onClick={() => setHsCanKhoa(null)}
              >
                Hủy
              </NutLenhBai>
              <NutLenhBai
                type="button"
                kieu="chuSa"
                onClick={() => void xuLyKhoa()}
              >
                Xác nhận khóa
              </NutLenhBai>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL CAP TAI KHOAN THAY THE === */}
      {hsThayThe && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="khung-ngoc-gian rounded-xl p-5 max-w-md w-full space-y-3 border-[#E4BC5A]">
            <h3 className="tieu-de-vang text-lg font-bold">
              Cấp tài khoản thay thế · {hsThayThe.daoHieu}
            </h3>
            <p className="text-xs text-[#9BA8BE]">
              Chuyển toàn bộ tiến trình sao, cảnh giới sang tài khoản mới và tự động khóa tài khoản cũ khi học sinh quên mật khẩu.
            </p>
            {kqThayThe ? (
              <div className="rounded-lg border border-[#62D1B5]/50 bg-[#1E7F6B]/20 p-3 text-sm space-y-1">
                <div>
                  Tên đăng nhập mới:{' '}
                  <strong className="font-mono text-[#62D1B5]">
                    {kqThayThe.tenDangNhap}
                  </strong>
                </div>
                <div>
                  Mật khẩu tạm:{' '}
                  <strong className="font-mono text-[#F2D88B]">
                    {kqThayThe.matKhauTam}
                  </strong>
                </div>
              </div>
            ) : (
              <input
                value={tenMoiThayThe}
                onChange={(e) => setTenMoiThayThe(e.target.value)}
                placeholder="Tên đăng nhập mới (4–20 ký tự, a-z, 0-9, _)"
                className="w-full min-h-[40px] px-3 rounded-lg bg-[#070B14] border border-[#2C3B5E] text-sm text-[#DCE6EA]"
              />
            )}
            <div className="flex justify-end gap-2">
              <NutLenhBai
                type="button"
                kieu="tram"
                onClick={() => {
                  setHsThayThe(null);
                  setKqThayThe(null);
                }}
              >
                Đóng
              </NutLenhBai>
              {!kqThayThe && (
                <NutLenhBai
                  type="button"
                  kieu="ngoc"
                  onClick={() => void xuLyCapThayThe()}
                >
                  Cấp tài khoản mới
                </NutLenhBai>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
