import React, { useState } from 'react';
import { boPhatAmThanh } from '../amThanh/boPhatAmThanh';
import {
  danhGiaDoManhMatKhau,
  kiemTraDaoHieu,
  kiemTraEmailThat,
  kiemTraMatKhau,
  kiemTraTenDangNhap,
} from '../logic/taiKhoanLogic';
import { NutLenhBai } from '../thanhPhan/KhungGiaoDien';
import { TieuNon } from '../thanhPhan/TieuNon';
import { CuonThuQuyDinh, LoaiQuyDinh } from '../thanhPhan/CuonThuQuyDinh';

export interface DuLieuDangKy {
  tenDangNhap: string;
  matKhau: string;
  daoHieu: string;
  lop: string;
  emailKhoiPhuc: string;
  mayDungChung: boolean;
}

export interface DuLieuDangNhap {
  tenDangNhap: string;
  matKhau: string;
  mayDungChung: boolean;
}

export const ManSonMon: React.FC<{
  choPhepDangKy: boolean;
  dangXuLy: boolean;
  loiHeThong: string | null;
  khiDangNhap: (duLieu: DuLieuDangNhap) => Promise<void>;
  khiDangKy: (duLieu: DuLieuDangKy) => Promise<void>;
  khiDangNhapGoogle: (mayDungChung: boolean) => Promise<void>;
  khiQuenMatKhau: (email: string) => Promise<{ thanhCong: boolean; thongDiep: string }>;
  khiChoiThuKhach: () => void;
}> = ({
  choPhepDangKy,
  dangXuLy,
  loiHeThong,
  khiDangNhap,
  khiDangKy,
  khiDangNhapGoogle,
  khiQuenMatKhau,
  khiChoiThuKhach,
}) => {
  const [theDangChon, setTheDangChon] = useState<'dangNhap' | 'dangKy'>('dangNhap');
  const [mayDungChung, setMayDungChung] = useState(false);

  // Truong Dang nhap
  const [dnTen, setDnTen] = useState('');
  const [dnMatKhau, setDnMatKhau] = useState('');
  const [hienMatKhauDn, setHienMatKhauDn] = useState(false);

  // Truong Dang ky
  const [dkTen, setDkTen] = useState('');
  const [dkMatKhau, setDkMatKhau] = useState('');
  const [dkNhapLai, setDkNhapLai] = useState('');
  const [dkDaoHieu, setDkDaoHieu] = useState('');
  const [dkLop, setDkLop] = useState('');
  const [dkEmail, setDkEmail] = useState('');
  const [hienMatKhauDk, setHienMatKhauDk] = useState(false);

  const [loiCucBo, setLoiCucBo] = useState<string | null>(null);
  const [moQuenMatKhau, setMoQuenMatKhau] = useState(false);
  const [emailQuen, setEmailQuen] = useState('');
  const [thongBaoQuen, setThongBaoQuen] = useState<string | null>(null);
  const [dangGuiQuen, setDangGuiQuen] = useState(false);
  const [quyDinhDangXem, setQuyDinhDangXem] = useState<LoaiQuyDinh | null>(null);

  // Kiem tra truc tiep khi nhap o the Dang ky
  const ktTenDk = dkTen ? kiemTraTenDangNhap(dkTen) : null;
  const ktMkDk = dkMatKhau ? kiemTraMatKhau(dkMatKhau) : null;
  const doManhMk = danhGiaDoManhMatKhau(dkMatKhau);
  const ktDaoHieuDk = dkDaoHieu ? kiemTraDaoHieu(dkDaoHieu) : null;
  const ktEmailDk = dkEmail ? kiemTraEmailThat(dkEmail) : null;

  const xuLyGuiDangNhap = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoiCucBo(null);
    const ktTen = kiemTraTenDangNhap(dnTen);
    if (!ktTen.hopLe) {
      setLoiCucBo(ktTen.loi || 'Tên đăng nhập không hợp lệ.');
      return;
    }
    if (!dnMatKhau) {
      setLoiCucBo('Vui lòng nhập mật khẩu.');
      return;
    }
    boPhatAmThanh.phatAmNhanNut();
    await khiDangNhap({
      tenDangNhap: ktTen.chuanHoa,
      matKhau: dnMatKhau,
      mayDungChung,
    });
  };

  const xuLyGuiDangKy = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoiCucBo(null);
    if (!choPhepDangKy) {
      setLoiCucBo('Hiện tại hệ thống đang tạm đóng đăng ký mới. Hãy liên hệ thầy/cô.');
      return;
    }
    const ktTen = kiemTraTenDangNhap(dkTen);
    if (!ktTen.hopLe) {
      setLoiCucBo(ktTen.loi || 'Tên đăng nhập không hợp lệ.');
      return;
    }
    const ktMk = kiemTraMatKhau(dkMatKhau);
    if (!ktMk.hopLe) {
      setLoiCucBo(ktMk.loi || 'Mật khẩu chưa đạt yêu cầu.');
      return;
    }
    if (dkMatKhau !== dkNhapLai) {
      setLoiCucBo('Mật khẩu nhập lại chưa khớp.');
      return;
    }
    const ktDh = kiemTraDaoHieu(dkDaoHieu);
    if (!ktDh.hopLe) {
      setLoiCucBo(ktDh.loi || 'Đạo hiệu chưa hợp lệ.');
      return;
    }
    const ktEm = kiemTraEmailThat(dkEmail);
    if (!ktEm.hopLe) {
      setLoiCucBo(ktEm.loi || 'Thư điện tử không hợp lệ.');
      return;
    }
    boPhatAmThanh.phatAmNgoDao();
    await khiDangKy({
      tenDangNhap: ktTen.chuanHoa,
      matKhau: dkMatKhau,
      daoHieu: ktDh.chuanHoa,
      lop: dkLop.trim().slice(0, 20),
      emailKhoiPhuc: ktEm.chuanHoa,
      mayDungChung,
    });
  };

  const xuLyGuiQuenMatKhau = async (e: React.FormEvent) => {
    e.preventDefault();
    setThongBaoQuen(null);
    const ktEm = kiemTraEmailThat(emailQuen);
    if (!emailQuen.trim() || !ktEm.hopLe) {
      setThongBaoQuen('Vui lòng nhập địa chỉ thư điện tử hợp lệ.');
      return;
    }
    setDangGuiQuen(true);
    try {
      const kq = await khiQuenMatKhau(ktEm.chuanHoa);
      setThongBaoQuen(kq.thongDiep);
    } finally {
      setDangGuiQuen(false);
    }
  };

  const thongBaoLoiHienThi = loiCucBo || loiHeThong;

  return (
    <main className="relative min-h-[100dvh] flex flex-col items-center justify-between px-4 py-6 sm:py-10">
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-2 text-xs text-[#9BA8BE]">
        <span>Toán 10 · Chương III · Hệ thức lượng trong tam giác</span>
        <span>Bộ sách Kết nối tri thức</span>
      </div>

      <div className="w-full max-w-5xl my-auto py-5 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Cot trai: Con dau thuy mac, tieu de va Tieu Non vay tay */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
          <div className="relative flex items-center gap-4">
            <svg
              viewBox="0 0 220 220"
              className="w-32 h-32 sm:w-40 sm:h-40 shrink-0 drop-shadow-[0_0_24px_rgba(228,188,90,0.22)]"
              aria-hidden="true"
            >
              <circle
                cx="110"
                cy="110"
                r="96"
                fill="rgba(13,20,36,0.6)"
                stroke="#E4BC5A"
                strokeWidth="1.5"
                strokeDasharray="8 5"
                className="origin-center anim-xoay-tran"
              />
              <circle
                cx="110"
                cy="110"
                r="78"
                fill="none"
                stroke="#3FB59A"
                strokeWidth="1.2"
                opacity="0.7"
              />
              <polygon
                points="110,36 174,148 46,148"
                fill="rgba(63,181,154,0.12)"
                stroke="#E4BC5A"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <rect
                x="72"
                y="93"
                width="76"
                height="48"
                rx="6"
                fill="rgba(143,31,26,0.9)"
                stroke="#F2D88B"
                strokeWidth="1.5"
              />
              <text
                x="110"
                y="113"
                textAnchor="middle"
                fill="#F6EEDB"
                fontSize="10.5"
                fontWeight="700"
                className="dau-an-trang-tri"
              >
                TU TOÁN
              </text>
              <text
                x="110"
                y="131"
                textAnchor="middle"
                fill="#F2D88B"
                fontSize="10.5"
                fontWeight="700"
                className="dau-an-trang-tri"
              >
                CHỨNG ĐẠO
              </text>
            </svg>

            <div className="bg-[#0D1424]/92 border border-[#E4BC5A]/45 rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-lg">
              <TieuNon bieuCam="vui" className="w-12 h-14 shrink-0" />
              <div className="text-left">
                <div className="text-xs font-bold text-[#F2D88B]">Sơn Môn Khai Mở</div>
                <div className="text-[11px] text-[#DCE6EA]/85 leading-snug">
                  Tiểu Nón chào mừng đạo hữu nhập môn!
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="dau-an-trang-tri text-xs font-semibold uppercase text-[#E4BC5A]/90 mb-1">
              Sơn Môn · Tiên Lộ Toán Học
            </div>
            <h1 className="tieu-de-vang text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              Tu Toán Chứng Đạo
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-[#DCE6EA]/88 leading-relaxed max-w-md">
              Đăng nhập để lưu tiến trình qua sáu tầng tiên đảo, ghi danh Thiên Bảng và học tiếp mọi lúc trên mọi thiết bị.
            </p>
          </div>
        </div>

        {/* Cot phai: The dang nhap / dang ky Son Mon */}
        <section
          aria-label="Cổng đăng nhập Sơn Môn"
          className="lg:col-span-7 khung-ngoc-gian rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4"
        >
          {/* Hai the: Dang nhap | Dang ky */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#070B14] border border-[#1F2A4D]">
            <button
              type="button"
              onClick={() => {
                boPhatAmThanh.phatAmNhanNut();
                setTheDangChon('dangNhap');
                setLoiCucBo(null);
              }}
              className={`min-h-[42px] rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                theDangChon === 'dangNhap'
                  ? 'bg-[#141D33] text-[#F2D88B] border border-[#E4BC5A]/60'
                  : 'text-[#9BA8BE] hover:text-[#DCE6EA]'
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => {
                boPhatAmThanh.phatAmNhanNut();
                setTheDangChon('dangKy');
                setLoiCucBo(null);
              }}
              className={`min-h-[42px] rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                theDangChon === 'dangKy'
                  ? 'bg-[#141D33] text-[#F2D88B] border border-[#E4BC5A]/60'
                  : 'text-[#9BA8BE] hover:text-[#DCE6EA]'
              }`}
            >
              Đăng ký mới
            </button>
          </div>

          {thongBaoLoiHienThi && (
            <div
              role="alert"
              className="rounded-xl border border-[#C8372D]/80 bg-[#C8372D]/18 px-3.5 py-2.5 text-xs sm:text-sm text-[#FFB4AD]"
            >
              {thongBaoLoiHienThi}
            </div>
          )}

          {theDangChon === 'dangNhap' ? (
            <form onSubmit={xuLyGuiDangNhap} className="space-y-3.5">
              <div>
                <label
                  htmlFor="dn-ten"
                  className="block text-xs font-semibold text-[#F2D88B] mb-1"
                >
                  Tên đăng nhập
                </label>
                <input
                  id="dn-ten"
                  type="text"
                  autoComplete="username"
                  value={dnTen}
                  onChange={(e) => setDnTen(e.target.value)}
                  placeholder="Ví dụ: 10a1_minh_01"
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-[#070B14] border border-[#2C3B5E] focus:border-[#E4BC5A] focus:outline-none text-sm text-[#F6EEDB]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="dn-matkhau"
                    className="text-xs font-semibold text-[#F2D88B]"
                  >
                    Mật khẩu
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMoQuenMatKhau(true);
                      setThongBaoQuen(null);
                    }}
                    className="text-xs text-[#62D1B5] hover:underline cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="dn-matkhau"
                    type={hienMatKhauDn ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={dnMatKhau}
                    onChange={(e) => setDnMatKhau(e.target.value)}
                    placeholder="Nhập mật khẩu của bạn"
                    className="w-full min-h-[44px] pl-3.5 pr-16 rounded-xl bg-[#070B14] border border-[#2C3B5E] focus:border-[#E4BC5A] focus:outline-none text-sm text-[#F6EEDB]"
                  />
                  <button
                    type="button"
                    onClick={() => setHienMatKhauDn((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-[#9BA8BE] hover:text-[#F2D88B] cursor-pointer"
                  >
                    {hienMatKhauDn ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-[#DCE6EA]/85 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={mayDungChung}
                  onChange={(e) => setMayDungChung(e.target.checked)}
                  className="mt-0.5 accent-[#3FB59A]"
                />
                <span>
                  <strong className="text-[#F2D88B]">Đây là máy dùng chung</strong> (không giữ đăng nhập khi đóng trình duyệt và không lưu bộ đệm tài khoản trên máy này).
                </span>
              </label>

              <NutLenhBai
                type="submit"
                kieu="ngoc"
                disabled={dangXuLy}
                className="w-full text-base py-3"
              >
                {dangXuLy ? 'Đang mở Sơn Môn...' : 'Bước vào Sơn Môn'}
              </NutLenhBai>
            </form>
          ) : (
            <form onSubmit={xuLyGuiDangKy} className="space-y-3">
              {!choPhepDangKy && (
                <div className="rounded-xl border border-[#E4BC5A]/60 bg-[#E4BC5A]/12 px-3.5 py-2.5 text-xs text-[#F2D88B]">
                  Hệ thống hiện đang tạm đóng tự đăng ký mới. Nếu chưa có tài khoản, hãy liên hệ thầy/cô để được cấp.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="dk-ten"
                    className="block text-xs font-semibold text-[#F2D88B] mb-1"
                  >
                    Tên đăng nhập *
                  </label>
                  <input
                    id="dk-ten"
                    type="text"
                    autoComplete="username"
                    value={dkTen}
                    onChange={(e) => setDkTen(e.target.value)}
                    placeholder="4–20 ký tự, chữ thường/số/_"
                    className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] focus:border-[#E4BC5A] focus:outline-none text-sm text-[#F6EEDB]"
                  />
                  {ktTenDk && !ktTenDk.hopLe && (
                    <p className="text-[11px] text-[#FFB4AD] mt-1">{ktTenDk.loi}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="dk-daohieu"
                    className="block text-xs font-semibold text-[#F2D88B] mb-1"
                  >
                    Đạo hiệu (tên hiển thị) *
                  </label>
                  <input
                    id="dk-daohieu"
                    type="text"
                    value={dkDaoHieu}
                    onChange={(e) => setDkDaoHieu(e.target.value)}
                    placeholder="Ví dụ: Thanh Phong"
                    className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] focus:border-[#E4BC5A] focus:outline-none text-sm text-[#F6EEDB]"
                  />
                  {ktDaoHieuDk && !ktDaoHieuDk.hopLe && (
                    <p className="text-[11px] text-[#FFB4AD] mt-1">{ktDaoHieuDk.loi}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="dk-matkhau"
                    className="block text-xs font-semibold text-[#F2D88B] mb-1"
                  >
                    Mật khẩu *
                  </label>
                  <div className="relative">
                    <input
                      id="dk-matkhau"
                      type={hienMatKhauDk ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={dkMatKhau}
                      onChange={(e) => setDkMatKhau(e.target.value)}
                      placeholder="Tối thiểu 8 ký tự, có chữ và số"
                      className="w-full min-h-[42px] pl-3 pr-14 rounded-xl bg-[#070B14] border border-[#2C3B5E] focus:border-[#E4BC5A] focus:outline-none text-sm text-[#F6EEDB]"
                    />
                    <button
                      type="button"
                      onClick={() => setHienMatKhauDk((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-1 text-xs text-[#9BA8BE] hover:text-[#F2D88B] cursor-pointer"
                    >
                      {hienMatKhauDk ? 'Ẩn' : 'Hiện'}
                    </button>
                  </div>
                  {dkMatKhau && (
                    <div className="mt-1.5 space-y-1">
                      <div className="h-1.5 w-full rounded-full bg-[#1F2A4D] overflow-hidden">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${doManhMk.phanTram}%`,
                            backgroundColor:
                              doManhMk.cap === 'manh'
                                ? '#3FB59A'
                                : doManhMk.cap === 'vua'
                                ? '#E4BC5A'
                                : '#C8372D',
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#9BA8BE]">
                          Độ mạnh:{' '}
                          <strong
                            style={{
                              color:
                                doManhMk.cap === 'manh'
                                  ? '#62D1B5'
                                  : doManhMk.cap === 'vua'
                                  ? '#F2D88B'
                                  : '#FFB4AD',
                            }}
                          >
                            {doManhMk.nhan}
                          </strong>
                        </span>
                        {ktMkDk && !ktMkDk.hopLe && (
                          <span className="text-[#FFB4AD]">{ktMkDk.loi}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="dk-nhaplai"
                    className="block text-xs font-semibold text-[#F2D88B] mb-1"
                  >
                    Nhập lại mật khẩu *
                  </label>
                  <input
                    id="dk-nhaplai"
                    type={hienMatKhauDk ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={dkNhapLai}
                    onChange={(e) => setDkNhapLai(e.target.value)}
                    placeholder="Gõ lại mật khẩu"
                    className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] focus:border-[#E4BC5A] focus:outline-none text-sm text-[#F6EEDB]"
                  />
                  {dkNhapLai && dkNhapLai !== dkMatKhau && (
                    <p className="text-[11px] text-[#FFB4AD] mt-1">
                      Mật khẩu nhập lại chưa khớp.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="dk-lop"
                    className="block text-xs font-semibold text-[#9BA8BE] mb-1"
                  >
                    Lớp (không bắt buộc)
                  </label>
                  <input
                    id="dk-lop"
                    type="text"
                    value={dkLop}
                    onChange={(e) => setDkLop(e.target.value)}
                    placeholder="Ví dụ: 10A1"
                    className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] focus:border-[#E4BC5A] focus:outline-none text-sm text-[#F6EEDB]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="dk-email"
                    className="block text-xs font-semibold text-[#9BA8BE] mb-1"
                  >
                    Thư điện tử khôi phục (không bắt buộc)
                  </label>
                  <input
                    id="dk-email"
                    type="email"
                    value={dkEmail}
                    onChange={(e) => setDkEmail(e.target.value)}
                    placeholder="Để trống nếu chưa có"
                    className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] focus:border-[#E4BC5A] focus:outline-none text-sm text-[#F6EEDB]"
                  />
                  {ktEmailDk && !ktEmailDk.hopLe && (
                    <p className="text-[11px] text-[#FFB4AD] mt-1">{ktEmailDk.loi}</p>
                  )}
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-xs text-[#DCE6EA]/85 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={mayDungChung}
                  onChange={(e) => setMayDungChung(e.target.checked)}
                  className="mt-0.5 accent-[#3FB59A]"
                />
                <span>
                  <strong className="text-[#F2D88B]">Đây là máy dùng chung</strong> (không giữ phiên sau khi đóng trình duyệt).
                </span>
              </label>

              <NutLenhBai
                type="submit"
                kieu="vang"
                disabled={dangXuLy || !choPhepDangKy}
                className="w-full text-base py-3"
              >
                {dangXuLy ? 'Đang lập hồ sơ tu luyện...' : 'Tạo tài khoản & Nhập môn'}
              </NutLenhBai>
            </form>
          )}

          {/* Phan cach + Google + Choi thu */}
          <div className="relative flex items-center py-1">
            <div className="flex-1 border-t border-[#1F2A4D]" />
            <span className="px-3 text-xs text-[#9BA8BE]">hoặc</span>
            <div className="flex-1 border-t border-[#1F2A4D]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={dangXuLy}
              onClick={() => {
                boPhatAmThanh.phatAmNhanNut();
                setLoiCucBo(null);
                void khiDangNhapGoogle(mayDungChung);
              }}
              className="min-h-[44px] px-4 rounded-xl border border-[#E4BC5A]/45 bg-[#141D33] hover:bg-[#1B2742] text-sm font-semibold text-[#F6EEDB] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.8-5.5 3.8-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.9 1.5l2.6-2.5C16.8 3.3 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12S6.7 21.6 12 21.6c6.9 0 9.2-4.8 9.2-7.3 0-.5-.1-.9-.1-1.3H12z"
                />
              </svg>
              <span>Đăng nhập bằng Google</span>
            </button>

            <button
              type="button"
              data-start="true"
              disabled={dangXuLy}
              onClick={() => {
                boPhatAmThanh.phatAmNgoDao();
                khiChoiThuKhach();
              }}
              className="min-h-[44px] px-4 rounded-xl border border-[#2C3B5E] bg-[#070B14] hover:border-[#62D1B5]/60 text-sm font-semibold text-[#62D1B5] cursor-pointer disabled:opacity-50"
            >
              Chơi thử không cần tài khoản
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-xs text-[#9BA8BE]">
            <button
              type="button"
              onClick={() => setQuyDinhDangXem('quyDinh')}
              className="hover:text-[#F2D88B] underline cursor-pointer"
            >
              Quy định sử dụng
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setQuyDinhDangXem('quyenRiengTu')}
              className="hover:text-[#F2D88B] underline cursor-pointer"
            >
              Quyền riêng tư
            </button>
          </div>
        </section>
      </div>

      <p className="text-xs text-[#9BA8BE] text-center">
        Phím 1–4 / A–D chọn đáp án · Phím mũi tên hoặc W A S D di chuyển Vượt Ải
      </p>

      {/* Hop thoai Quen mat khau */}
      {moQuenMatKhau && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
          onClick={() => setMoQuenMatKhau(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tieu-de-quen-mk"
            className="w-full max-w-md khung-ngoc-gian rounded-2xl p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <h2 id="tieu-de-quen-mk" className="tieu-de-vang text-xl font-bold">
                Khôi phục mật khẩu
              </h2>
              <button
                type="button"
                onClick={() => setMoQuenMatKhau(false)}
                className="text-xs text-[#9BA8BE] hover:text-white px-2 py-1 cursor-pointer"
              >
                Đóng
              </button>
            </div>

            <div className="rounded-xl border border-[#3FB59A]/40 bg-[#070B14]/85 p-3 text-xs text-[#DCE6EA]/90 leading-relaxed space-y-1.5">
              <p>
                <strong>Nếu bạn đăng ký bằng tên đăng nhập (không dùng thư điện tử thật):</strong> hãy liên hệ thầy/cô để được cấp tài khoản thay thế và giữ nguyên toàn bộ tiến trình tu luyện.
              </p>
              <p>
                <strong>Nếu tài khoản có gắn thư điện tử thật:</strong> nhập địa chỉ bên dưới để nhận liên kết đặt lại mật khẩu.
              </p>
            </div>

            <form onSubmit={xuLyGuiQuenMatKhau} className="space-y-3">
              <input
                type="email"
                value={emailQuen}
                onChange={(e) => setEmailQuen(e.target.value)}
                placeholder="Nhập thư điện tử đã đăng ký"
                className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] focus:border-[#E4BC5A] focus:outline-none text-sm text-[#F6EEDB]"
              />
              {thongBaoQuen && (
                <p className="text-xs text-[#62D1B5]">{thongBaoQuen}</p>
              )}
              <div className="flex justify-end gap-2">
                <NutLenhBai
                  type="button"
                  kieu="tram"
                  onClick={() => setMoQuenMatKhau(false)}
                >
                  Đóng
                </NutLenhBai>
                <NutLenhBai
                  type="submit"
                  kieu="ngoc"
                  disabled={dangGuiQuen}
                >
                  {dangGuiQuen ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
                </NutLenhBai>
              </div>
            </form>
          </div>
        </div>
      )}

      <CuonThuQuyDinh
        loai={quyDinhDangXem}
        khiDong={() => setQuyDinhDangXem(null)}
      />
    </main>
  );
};
