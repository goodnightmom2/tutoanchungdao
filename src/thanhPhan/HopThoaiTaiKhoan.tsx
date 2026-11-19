import React, { useState } from 'react';
import { layThongTinCanhGioi } from '../duLieu/canhGioi';
import {
  ThongTinKhoaTaiKhoan,
  XungDotTienTrinh,
} from '../kieuDuLieu/taiKhoan';
import { kiemTraDaoHieu, kiemTraMatKhau } from '../logic/taiKhoanLogic';
import { tinhTongSao } from '../logic/tienTrinh';
import { NutLenhBai } from './KhungGiaoDien';

function dinhDangNgayGio(ms: number): string {
  if (!ms) return 'Không rõ';
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} · ${String(
    d.getDate()
  ).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

// 1. Man chan toan man hinh khi tai khoan bi khoa
export const ManTaiKhoanBiKhoa: React.FC<{
  thongTin: ThongTinKhoaTaiKhoan;
  khiDangXuat: () => void;
}> = ({ thongTin, khiDangXuat }) => (
  <main className="min-h-[100dvh] flex items-center justify-center p-4">
    <div className="max-w-md w-full khung-ngoc-gian rounded-2xl p-6 text-center space-y-4 border-[#C8372D]">
      <div className="dau-an-trang-tri text-xs uppercase font-bold text-[#F28A80]">
        Lệnh Phong Ấn · Sơn Môn
      </div>
      <h1 className="tieu-de-vang text-2xl font-bold">
        Tài khoản đang tạm khóa
      </h1>
      <p className="text-sm text-[#DCE6EA]/90 leading-relaxed">
        Tài khoản đang tạm khóa, hãy liên hệ thầy/cô để được hỗ trợ mở khóa.
      </p>
      {thongTin.lyDo && (
        <div className="rounded-xl border border-[#C8372D]/50 bg-[#070B14]/85 p-3 text-xs text-[#FFB4AD]">
          Lý do: {thongTin.lyDo}
        </div>
      )}
      <NutLenhBai type="button" kieu="chuSa" onClick={khiDangXuat}>
        Đăng xuất
      </NutLenhBai>
    </div>
  </main>
);

// 2. Hop thoai bat buoc doi mat khau lan dau (canDoiMatKhau = true)
export const HopThoaiDoiMatKhauBatBuoc: React.FC<{
  khiXacNhan: (matKhauMoi: string) => Promise<{ ok: boolean; thongDiep: string }>;
  khiDangXuat: () => void;
}> = ({ khiXacNhan, khiDangXuat }) => {
  const [mkMoi, setMkMoi] = useState('');
  const [mkLap, setMkLap] = useState('');
  const [loi, setLoi] = useState<string | null>(null);
  const [dangLuu, setDangLuu] = useState(false);

  const gui = async (e: React.FormEvent) => {
    e.preventDefault();
    const kt = kiemTraMatKhau(mkMoi);
    if (!kt.hopLe) {
      setLoi(kt.loi || 'Mật khẩu chưa đạt yêu cầu.');
      return;
    }
    if (mkMoi !== mkLap) {
      setLoi('Mật khẩu nhập lại chưa khớp.');
      return;
    }
    setDangLuu(true);
    setLoi(null);
    try {
      const kq = await khiXacNhan(mkMoi);
      if (!kq.ok) setLoi(kq.thongDiep);
    } finally {
      setDangLuu(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md khung-ngoc-gian rounded-2xl p-5 space-y-4 shadow-2xl"
      >
        <div>
          <div className="dau-an-trang-tri text-xs uppercase font-bold text-[#E4BC5A]">
            Bảo Mật Lần Đầu
          </div>
          <h2 className="tieu-de-vang text-xl font-bold mt-0.5">
            Đặt Mật Khẩu Mới Cho Tài Khoản
          </h2>
          <p className="text-xs text-[#9BA8BE] mt-1">
            Tài khoản này đang dùng mật khẩu tạm do thầy/cô cấp. Vui lòng đổi sang mật khẩu riêng trước khi bắt đầu tu luyện.
          </p>
        </div>

        {loi && (
          <div className="rounded-xl border border-[#C8372D]/70 bg-[#C8372D]/18 px-3 py-2 text-xs text-[#FFB4AD]">
            {loi}
          </div>
        )}

        <form onSubmit={gui} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#F2D88B] mb-1">
              Mật khẩu mới (ít nhất 8 ký tự, gồm chữ và số)
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
              value={mkLap}
              onChange={(e) => setMkLap(e.target.value)}
              className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] text-sm text-[#F6EEDB]"
            />
          </div>
          <div className="flex items-center justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={khiDangXuat}
              className="text-xs text-[#9BA8BE] hover:text-white cursor-pointer"
            >
              Đăng xuất
            </button>
            <NutLenhBai type="submit" kieu="ngoc" disabled={dangLuu}>
              {dangLuu ? 'Đang lưu...' : 'Lưu mật khẩu & Tiếp tục'}
            </NutLenhBai>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. Hop thoai xac nhan / doi Dao hieu lan dau khi dang nhap Google
export const HopThoaiChonDaoHieuLanDau: React.FC<{
  daoHieuGoiY: string;
  khiXacNhan: (daoHieu: string, lop: string) => Promise<void>;
}> = ({ daoHieuGoiY, khiXacNhan }) => {
  const [daoHieu, setDaoHieu] = useState(daoHieuGoiY);
  const [lop, setLop] = useState('');
  const [loi, setLoi] = useState<string | null>(null);
  const [dangLuu, setDangLuu] = useState(false);

  const gui = async (e: React.FormEvent) => {
    e.preventDefault();
    const kt = kiemTraDaoHieu(daoHieu);
    if (!kt.hopLe) {
      setLoi(kt.loi || 'Đạo hiệu chưa hợp lệ.');
      return;
    }
    setDangLuu(true);
    setLoi(null);
    try {
      await khiXacNhan(kt.chuanHoa, lop.trim().slice(0, 20));
    } finally {
      setDangLuu(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/78 flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md khung-ngoc-gian rounded-2xl p-5 space-y-4 shadow-2xl"
      >
        <div>
          <div className="dau-an-trang-tri text-xs uppercase font-bold text-[#62D1B5]">
            Danh Xưng Nhập Môn
          </div>
          <h2 className="tieu-de-vang text-xl font-bold mt-0.5">
            Xác nhận Đạo hiệu của bạn
          </h2>
          <p className="text-xs text-[#9BA8BE] mt-1">
            Đạo hiệu này sẽ hiển thị trong hành trình tu luyện và trên Thiên Bảng. Bạn có thể giữ nguyên hoặc đặt lại ngay bây giờ.
          </p>
        </div>

        {loi && (
          <div className="rounded-xl border border-[#C8372D]/70 bg-[#C8372D]/18 px-3 py-2 text-xs text-[#FFB4AD]">
            {loi}
          </div>
        )}

        <form onSubmit={gui} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#F2D88B] mb-1">
              Đạo hiệu (2–20 ký tự)
            </label>
            <input
              type="text"
              value={daoHieu}
              onChange={(e) => setDaoHieu(e.target.value)}
              className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] text-sm text-[#F6EEDB]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#9BA8BE] mb-1">
              Lớp (không bắt buộc)
            </label>
            <input
              type="text"
              value={lop}
              onChange={(e) => setLop(e.target.value)}
              placeholder="Ví dụ: 10A2"
              className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] text-sm text-[#F6EEDB]"
            />
          </div>
          <div className="flex justify-end">
            <NutLenhBai type="submit" kieu="vang" disabled={dangLuu}>
              {dangLuu ? 'Đang lưu...' : 'Xác nhận nhập môn'}
            </NutLenhBai>
          </div>
        </form>
      </div>
    </div>
  );
};

// 4. Hop thoai hoi chuyen tien trinh choi thu vao tai khoan moi
export const HopThoaiChuyenTienTrinhKhach: React.FC<{
  soSaoKhach: number;
  tenCanhGioiKhach: string;
  khiChuyen: () => Promise<void>;
  khiBoQua: () => void;
}> = ({ soSaoKhach, tenCanhGioiKhach, khiChuyen, khiBoQua }) => {
  const [dangChuyen, setDangChuyen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/78 flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md khung-ngoc-gian rounded-2xl p-5 space-y-4 shadow-2xl"
      >
        <h2 className="tieu-de-vang text-xl font-bold">
          Chuyển tiến trình chơi thử?
        </h2>
        <p className="text-sm text-[#DCE6EA]/90 leading-relaxed">
          Bạn có tiến trình chơi thử trên máy này ({tenCanhGioiKhach} · {soSaoKhach} sao), có muốn chuyển toàn bộ vào tài khoản không?
        </p>
        <div className="flex flex-wrap justify-end gap-2">
          <NutLenhBai type="button" kieu="tram" onClick={khiBoQua}>
            Giữ bản đám mây
          </NutLenhBai>
          <NutLenhBai
            type="button"
            kieu="vang"
            disabled={dangChuyen}
            onClick={async () => {
              setDangChuyen(true);
              try {
                await khiChuyen();
              } finally {
                setDangChuyen(false);
              }
            }}
          >
            {dangChuyen ? 'Đang chuyển...' : 'Chuyển vào tài khoản'}
          </NutLenhBai>
        </div>
      </div>
    </div>
  );
};

// 5. Hop thoai xu ly xung dot tien trinh giua 2 thiet bi
export const HopThoaiXungDotTienTrinh: React.FC<{
  xungDot: XungDotTienTrinh;
  khiDungDamMay: () => void;
  khiGiuMayNay: () => void;
}> = ({ xungDot, khiDungDamMay, khiGiuMayNay }) => {
  const saoDamMay = tinhTongSao(xungDot.banDamMay);
  const saoCucBo = tinhTongSao(xungDot.banCucBo);
  const cgDamMay = layThongTinCanhGioi(xungDot.banDamMay.canhGioiHienTai).ten;
  const cgCucBo = layThongTinCanhGioi(xungDot.banCucBo.canhGioiHienTai).ten;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg khung-ngoc-gian rounded-2xl p-5 space-y-4 shadow-2xl"
      >
        <div>
          <div className="dau-an-trang-tri text-xs uppercase font-bold text-[#E4BC5A]">
            Đồng Bộ Hai Thiết Bị
          </div>
          <h2 className="tieu-de-vang text-xl font-bold mt-0.5">
            Phát hiện hai bản lưu khác nhau
          </h2>
          <p className="text-xs text-[#9BA8BE] mt-1">
            Tài khoản của bạn vừa được cập nhật từ một thiết bị khác. Hãy chọn bản tiến trình muốn giữ lại:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#3FB59A]/50 bg-[#070B14]/85 p-3.5 space-y-1">
            <div className="text-xs font-bold text-[#62D1B5]">Bản trên đám mây</div>
            <div className="text-sm font-bold text-[#F2D88B]">{cgDamMay}</div>
            <div className="text-xs text-[#DCE6EA] chu-so-bang">
              {saoDamMay}/72 sao · {xungDot.banDamMay.linhKhi} Linh khí
            </div>
            <div className="text-[11px] text-[#9BA8BE]">
              Lưu lúc: {dinhDangNgayGio(xungDot.capNhatDamMayLuc)}
            </div>
          </div>

          <div className="rounded-xl border border-[#E4BC5A]/50 bg-[#070B14]/85 p-3.5 space-y-1">
            <div className="text-xs font-bold text-[#F2D88B]">Bản trên máy này</div>
            <div className="text-sm font-bold text-[#F6EEDB]">{cgCucBo}</div>
            <div className="text-xs text-[#DCE6EA] chu-so-bang">
              {saoCucBo}/72 sao · {xungDot.banCucBo.linhKhi} Linh khí
            </div>
            <div className="text-[11px] text-[#9BA8BE]">
              Vừa cập nhật: {dinhDangNgayGio(xungDot.capNhatCucBoLuc)}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <NutLenhBai type="button" kieu="ngoc" onClick={khiDungDamMay}>
            Dùng bản trên đám mây
          </NutLenhBai>
          <NutLenhBai type="button" kieu="vang" onClick={khiGiuMayNay}>
            Giữ bản trên máy này
          </NutLenhBai>
        </div>
      </div>
    </div>
  );
};
