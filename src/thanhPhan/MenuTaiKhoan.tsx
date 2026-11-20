import React, { useState } from 'react';
import { boPhatAmThanh } from '../amThanh/boPhatAmThanh';
import { HoSoNguoiDung, TrangThaiDongBo } from '../kieuDuLieu/taiKhoan';
import { kiemTraDaoHieu, kiemTraMatKhau } from '../logic/taiKhoanLogic';
import { NutLenhBai } from './KhungGiaoDien';
import { CuonThuQuyDinh, LoaiQuyDinh } from './CuonThuQuyDinh';

function dinhDangGioPhut(epochMs: number | null): string {
  if (!epochMs) return '';
  const d = new Date(epochMs);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export const MenuTaiKhoan: React.FC<{
  dangMo: boolean;
  laKhach: boolean;
  hoSo: HoSoNguoiDung | null;
  laQuanTri: boolean;
  laGiaoVien?: boolean;
  trangThaiDongBo: TrangThaiDongBo;
  mayDungChung: boolean;
  khiDong: () => void;
  khiMoDangNhap: () => void;
  khiMoTongMon?: () => void;
  khiMoBangQuanTri: () => void;
  khiCapNhatHoSo: (daoHieu: string, lop: string) => Promise<{ ok: boolean; thongDiep: string }>;
  khiDoiMatKhau: (matKhauCu: string, matKhauMoi: string) => Promise<{ ok: boolean; thongDiep: string }>;
  khiChuyenHienXepHang: (hien: boolean) => Promise<void>;
  khiLuuNgay: () => Promise<void>;
  khiDangXuat: () => Promise<void>;
  khiXoaTaiKhoan: (xacNhan: string, matKhau?: string) => Promise<{ ok: boolean; thongDiep: string }>;
}> = ({
  dangMo,
  laKhach,
  hoSo,
  laQuanTri,
  laGiaoVien = false,
  trangThaiDongBo,
  mayDungChung,
  khiDong,
  khiMoDangNhap,
  khiMoTongMon,
  khiMoBangQuanTri,
  khiCapNhatHoSo,
  khiDoiMatKhau,
  khiChuyenHienXepHang,
  khiLuuNgay,
  khiDangXuat,
  khiXoaTaiKhoan,
}) => {
  const [mucDangMo, setMucDangMo] = useState<'chinh' | 'suaHoSo' | 'doiMatKhau' | 'xoaTaiKhoan'>('chinh');
  const [daoHieuMoi, setDaoHieuMoi] = useState(hoSo?.daoHieu || '');
  const [lopMoi, setLopMoi] = useState(hoSo?.lop || '');
  const [mkCu, setMkCu] = useState('');
  const [mkMoi, setMkMoi] = useState('');
  const [mkLapLai, setMkLapLai] = useState('');
  const [oXacNhanXoa, setOXacNhanXoa] = useState('');
  const [mkXoa, setMkXoa] = useState('');
  const [dangXuLy, setDangXuLy] = useState(false);
  const [thongBao, setThongBao] = useState<{ loai: 'tot' | 'loi'; noiDung: string } | null>(null);
  const [quyDinhXem, setQuyDinhXem] = useState<LoaiQuyDinh | null>(null);

  if (!dangMo) return null;

  const nhanTrangThaiDongBo = (() => {
    if (laKhach) return 'Chế độ chơi thử (lưu trên máy này)';
    if (trangThaiDongBo.loai === 'dangLuu') return 'Đang lưu lên đám mây…';
    if (trangThaiDongBo.loai === 'ngoaiTuyen') return 'Ngoại tuyến – sẽ lưu khi có mạng';
    if (trangThaiDongBo.loai === 'loi') return 'Tạm chưa đồng bộ – sẽ thử lại';
    if (trangThaiDongBo.lucCuoi) {
      return `Đã lưu lúc ${dinhDangGioPhut(trangThaiDongBo.lucCuoi)}`;
    }
    return 'Đã kết nối đám mây';
  })();

  const xuLyLuuHoSo = async (e: React.FormEvent) => {
    e.preventDefault();
    const kt = kiemTraDaoHieu(daoHieuMoi);
    if (!kt.hopLe) {
      setThongBao({ loai: 'loi', noiDung: kt.loi || 'Đạo hiệu không hợp lệ.' });
      return;
    }
    setDangXuLy(true);
    setThongBao(null);
    try {
      const kq = await khiCapNhatHoSo(kt.chuanHoa, lopMoi.trim().slice(0, 20));
      setThongBao({ loai: kq.ok ? 'tot' : 'loi', noiDung: kq.thongDiep });
      if (kq.ok) setMucDangMo('chinh');
    } finally {
      setDangXuLy(false);
    }
  };

  const xuLyDoiMk = async (e: React.FormEvent) => {
    e.preventDefault();
    const kt = kiemTraMatKhau(mkMoi);
    if (!kt.hopLe) {
      setThongBao({ loai: 'loi', noiDung: kt.loi || 'Mật khẩu mới chưa đạt yêu cầu.' });
      return;
    }
    if (mkMoi !== mkLapLai) {
      setThongBao({ loai: 'loi', noiDung: 'Mật khẩu mới nhập lại chưa khớp.' });
      return;
    }
    setDangXuLy(true);
    setThongBao(null);
    try {
      const kq = await khiDoiMatKhau(mkCu, mkMoi);
      setThongBao({ loai: kq.ok ? 'tot' : 'loi', noiDung: kq.thongDiep });
      if (kq.ok) {
        setMkCu('');
        setMkMoi('');
        setMkLapLai('');
        setMucDangMo('chinh');
      }
    } finally {
      setDangXuLy(false);
    }
  };

  const xuLyXoa = async (e: React.FormEvent) => {
    e.preventDefault();
    const tuCanGoi = hoSo?.tenDangNhap || hoSo?.daoHieu || '';
    if (oXacNhanXoa.trim() !== tuCanGoi) {
      setThongBao({
        loai: 'loi',
        noiDung: `Hãy gõ chính xác "${tuCanGoi}" để xác nhận xóa tài khoản.`,
      });
      return;
    }
    setDangXuLy(true);
    setThongBao(null);
    try {
      const kq = await khiXoaTaiKhoan(oXacNhanXoa.trim(), mkXoa || undefined);
      if (!kq.ok) {
        setThongBao({ loai: 'loi', noiDung: kq.thongDiep });
      }
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/72 flex items-center justify-center p-4"
      onClick={khiDong}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tieu-de-menu-tk"
        className="w-full max-w-md khung-ngoc-gian rounded-2xl p-5 space-y-4 max-h-[88dvh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 id="tieu-de-menu-tk" className="tieu-de-vang text-xl font-bold">
              {laKhach ? 'Tài Khoản Chơi Thử' : 'Hồ Sơ Tài Khoản'}
            </h2>
            <p className="text-xs text-[#62D1B5] mt-0.5">{nhanTrangThaiDongBo}</p>
          </div>
          <button
            type="button"
            onClick={khiDong}
            className="min-h-[36px] px-3 rounded-lg border border-[#1F2A4D] bg-[#070B14] text-xs text-[#9BA8BE] hover:text-white cursor-pointer"
          >
            Đóng
          </button>
        </div>

        {thongBao && (
          <div
            className={`rounded-xl border px-3 py-2 text-xs ${
              thongBao.loai === 'tot'
                ? 'border-[#3FB59A]/60 bg-[#1E7F6B]/20 text-[#62D1B5]'
                : 'border-[#C8372D]/70 bg-[#C8372D]/18 text-[#FFB4AD]'
            }`}
          >
            {thongBao.noiDung}
          </div>
        )}

        {laKhach ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#E4BC5A]/35 bg-[#070B14]/85 p-4 text-xs sm:text-sm text-[#DCE6EA]/90 leading-relaxed">
              Bạn đang ở chế độ chơi thử. Dữ liệu chỉ lưu trên trình duyệt hiện tại và có thể mất nếu xóa bộ nhớ máy. Hãy đăng ký hoặc đăng nhập để lưu tiến trình trên mọi thiết bị và tham gia Thiên Bảng.
            </div>
            <NutLenhBai
              type="button"
              kieu="vang"
              className="w-full"
              onClick={() => {
                boPhatAmThanh.phatAmNhanNut();
                khiDong();
                khiMoDangNhap();
              }}
            >
              Đăng nhập / Đăng ký ngay
            </NutLenhBai>
          </div>
        ) : hoSo ? (
          mucDangMo === 'chinh' ? (
            <div className="space-y-3">
              {/* Thong tin tom tat */}
              <div className="rounded-xl border border-[#1F2A4D] bg-[#070B14]/85 p-3.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base font-bold text-[#F2D88B]">
                    {hoSo.daoHieu}
                  </span>
                  {laQuanTri && (
                    <span className="px-2 py-0.5 rounded bg-[#8F1F1A] border border-[#E4BC5A]/60 text-[11px] font-bold text-[#F2D88B]">
                      Quản trị viên
                    </span>
                  )}
                </div>
                {hoSo.tenDangNhap && (
                  <div className="text-[#9BA8BE]">
                    Tên đăng nhập: <strong className="text-[#DCE6EA]">{hoSo.tenDangNhap}</strong>
                  </div>
                )}
                {hoSo.email && (
                  <div className="text-[#9BA8BE]">
                    Thư điện tử: <strong className="text-[#DCE6EA]">{hoSo.email}</strong>
                  </div>
                )}
                <div className="text-[#9BA8BE]">
                  Lớp: <strong className="text-[#DCE6EA]">{hoSo.lop || 'Chưa cập nhật'}</strong>
                  {mayDungChung && (
                    <span className="ml-2 text-[#F2D88B]">· Máy dùng chung</span>
                  )}
                </div>
              </div>

              {/* Cong tac hien ten tren bang xep hang */}
              <div className="rounded-xl border border-[#1F2A4D] bg-[#070B14]/75 p-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-[#F6EEDB]">
                    Hiện tên trên Thiên Bảng
                  </div>
                  <div className="text-[11px] text-[#9BA8BE]">
                    Chỉ hiện Đạo hiệu, cảnh giới và số sao.
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={hoSo.hienTrenXepHang}
                  onClick={() => {
                    boPhatAmThanh.phatAmNhanNut();
                    void khiChuyenHienXepHang(!hoSo.hienTrenXepHang);
                  }}
                  className={`min-w-[60px] min-h-[34px] px-2.5 rounded-lg border text-xs font-bold cursor-pointer ${
                    hoSo.hienTrenXepHang
                      ? 'bg-[#1E7F6B] border-[#62D1B5] text-white'
                      : 'bg-[#0D1424] border-[#2C3B5E] text-[#9BA8BE]'
                  }`}
                >
                  {hoSo.hienTrenXepHang ? 'Bật' : 'Tắt'}
                </button>
              </div>

              {/* Nut Quan ly Tong Mon (hien khi laGiaoVien hoac laQuanTri) */}
              {(laGiaoVien || laQuanTri) && khiMoTongMon && (
                <NutLenhBai
                  type="button"
                  kieu="ngoc"
                  className="w-full"
                  onClick={() => {
                    boPhatAmThanh.phatAmNhanNut();
                    khiDong();
                    khiMoTongMon();
                  }}
                >
                  Quản Lý Tông Môn (Lớp & Điểm yếu Toán)
                </NutLenhBai>
              )}

              {/* Nut Bang Quan Tri (chi hien khi laQuanTri) */}
              {laQuanTri && (
                <NutLenhBai
                  type="button"
                  kieu="vang"
                  className="w-full"
                  onClick={() => {
                    boPhatAmThanh.phatAmNhanNut();
                    khiDong();
                    khiMoBangQuanTri();
                  }}
                >
                  Mở Bảng Quản Trị (Thiên Cơ Các)
                </NutLenhBai>
              )}

              {/* Cac nut thao tac tai khoan */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDaoHieuMoi(hoSo.daoHieu);
                    setLopMoi(hoSo.lop || '');
                    setThongBao(null);
                    setMucDangMo('suaHoSo');
                  }}
                  className="min-h-[40px] px-3 rounded-xl border border-[#2C3B5E] bg-[#0D1424] hover:border-[#E4BC5A]/60 text-xs font-semibold text-[#F6EEDB] cursor-pointer"
                >
                  Sửa Đạo hiệu / Lớp
                </button>

                {hoSo.phuongThuc === 'tenDangNhap' ? (
                  <button
                    type="button"
                    onClick={() => {
                      setThongBao(null);
                      setMucDangMo('doiMatKhau');
                    }}
                    className="min-h-[40px] px-3 rounded-xl border border-[#2C3B5E] bg-[#0D1424] hover:border-[#E4BC5A]/60 text-xs font-semibold text-[#F6EEDB] cursor-pointer"
                  >
                    Đổi mật khẩu
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void khiLuuNgay()}
                    className="min-h-[40px] px-3 rounded-xl border border-[#2C3B5E] bg-[#0D1424] hover:border-[#62D1B5]/60 text-xs font-semibold text-[#62D1B5] cursor-pointer"
                  >
                    Đồng bộ ngay
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#1F2A4D]">
                <button
                  type="button"
                  onClick={() => {
                    setOXacNhanXoa('');
                    setMkXoa('');
                    setThongBao(null);
                    setMucDangMo('xoaTaiKhoan');
                  }}
                  className="text-xs text-[#F28A80] hover:underline cursor-pointer"
                >
                  Xóa tài khoản
                </button>
                <NutLenhBai
                  type="button"
                  kieu="chuSa"
                  className="text-xs"
                  onClick={() => {
                    boPhatAmThanh.phatAmNhanNut();
                    void khiDangXuat();
                  }}
                >
                  Đăng xuất
                </NutLenhBai>
              </div>

              <div className="flex items-center justify-center gap-3 text-[11px] text-[#9BA8BE]">
                <button
                  type="button"
                  onClick={() => setQuyDinhXem('quyDinh')}
                  className="hover:text-[#F2D88B] underline cursor-pointer"
                >
                  Quy định sử dụng
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setQuyDinhXem('quyenRiengTu')}
                  className="hover:text-[#F2D88B] underline cursor-pointer"
                >
                  Quyền riêng tư
                </button>
              </div>
            </div>
          ) : mucDangMo === 'suaHoSo' ? (
            <form onSubmit={xuLyLuuHoSo} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#F2D88B] mb-1">
                  Đạo hiệu mới (2–20 ký tự)
                </label>
                <input
                  type="text"
                  value={daoHieuMoi}
                  onChange={(e) => setDaoHieuMoi(e.target.value)}
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] text-sm text-[#F6EEDB]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#9BA8BE] mb-1">
                  Lớp
                </label>
                <input
                  type="text"
                  value={lopMoi}
                  onChange={(e) => setLopMoi(e.target.value)}
                  placeholder="Ví dụ: 10A1"
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] text-sm text-[#F6EEDB]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <NutLenhBai
                  type="button"
                  kieu="tram"
                  onClick={() => setMucDangMo('chinh')}
                >
                  Quay lại
                </NutLenhBai>
                <NutLenhBai type="submit" kieu="ngoc" disabled={dangXuLy}>
                  {dangXuLy ? 'Đang lưu...' : 'Lưu thay đổi'}
                </NutLenhBai>
              </div>
            </form>
          ) : mucDangMo === 'doiMatKhau' ? (
            <form onSubmit={xuLyDoiMk} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#F2D88B] mb-1">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={mkCu}
                  onChange={(e) => setMkCu(e.target.value)}
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] text-sm text-[#F6EEDB]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#F2D88B] mb-1">
                  Mật khẩu mới (tối thiểu 8 ký tự, có chữ và số)
                </label>
                <input
                  type="password"
                  value={mkMoi}
                  onChange={(e) => setMkMoi(e.target.value)}
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] text-sm text-[#F6EEDB]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#F2D88B] mb-1">
                  Nhập lại mật khẩu mới
                </label>
                <input
                  type="password"
                  value={mkLapLai}
                  onChange={(e) => setMkLapLai(e.target.value)}
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] text-sm text-[#F6EEDB]"
                />
              </div>
              <div className="flex justify-end gap-2">
                <NutLenhBai
                  type="button"
                  kieu="tram"
                  onClick={() => setMucDangMo('chinh')}
                >
                  Quay lại
                </NutLenhBai>
                <NutLenhBai type="submit" kieu="ngoc" disabled={dangXuLy}>
                  {dangXuLy ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                </NutLenhBai>
              </div>
            </form>
          ) : (
            <form onSubmit={xuLyXoa} className="space-y-3">
              <div className="rounded-xl border border-[#C8372D]/70 bg-[#C8372D]/15 p-3 text-xs text-[#FFB4AD] leading-relaxed">
                Hành động này sẽ xóa vĩnh viễn tài khoản và toàn bộ tiến trình tu luyện của bạn, không thể hoàn tác.
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#F2D88B] mb-1">
                  Gõ lại “{hoSo.tenDangNhap || hoSo.daoHieu}” để xác nhận
                </label>
                <input
                  type="text"
                  value={oXacNhanXoa}
                  onChange={(e) => setOXacNhanXoa(e.target.value)}
                  className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#C8372D]/60 text-sm text-[#F6EEDB]"
                />
              </div>
              {hoSo.phuongThuc === 'tenDangNhap' && (
                <div>
                  <label className="block text-xs font-semibold text-[#F2D88B] mb-1">
                    Nhập mật khẩu hiện tại để xác thực
                  </label>
                  <input
                    type="password"
                    value={mkXoa}
                    onChange={(e) => setMkXoa(e.target.value)}
                    className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] text-sm text-[#F6EEDB]"
                  />
                </div>
              )}
              <div className="flex justify-end gap-2">
                <NutLenhBai
                  type="button"
                  kieu="tram"
                  onClick={() => setMucDangMo('chinh')}
                >
                  Hủy
                </NutLenhBai>
                <NutLenhBai type="submit" kieu="chuSa" disabled={dangXuLy}>
                  {dangXuLy ? 'Đang xóa...' : 'Xác nhận xóa vĩnh viễn'}
                </NutLenhBai>
              </div>
            </form>
          )
        ) : null}
      </div>

      <CuonThuQuyDinh
        loai={quyDinhXem}
        khiDong={() => setQuyDinhXem(null)}
      />
    </div>
  );
};
