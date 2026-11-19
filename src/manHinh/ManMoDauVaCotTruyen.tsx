import React, { useEffect, useState } from 'react';
import { boPhatAmThanh } from '../amThanh/boPhatAmThanh';
import { COT_TRUYEN_MO_DAU } from '../duLieu/canhGioi';
import { NgoaiHinh } from '../kieuDuLieu/troChoi';
import { CanhNenChibi } from '../thanhPhan/CanhNenChibi';
import { CuonThuGiayDo, NutLenhBai } from '../thanhPhan/KhungGiaoDien';
import { NhanVat } from '../thanhPhan/NhanVat';
import { TieuNon } from '../thanhPhan/TieuNon';

export const ManMoDau: React.FC<{
  daCoNhanVat: boolean;
  ngoaiHinh: NgoaiHinh;
  tenCanhGioi: string;
  khiBatDau: () => void;
  khiChoiLaiTuDau?: () => void;
}> = ({ daCoNhanVat, ngoaiHinh, tenCanhGioi, khiBatDau, khiChoiLaiTuDau }) => {
  useEffect(() => {
    const xuLyPhim = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        boPhatAmThanh.phatAmNgoDao();
        khiBatDau();
      }
    };
    window.addEventListener('keydown', xuLyPhim);
    return () => window.removeEventListener('keydown', xuLyPhim);
  }, [khiBatDau]);

  return (
    <main className="relative min-h-[100dvh] flex flex-col items-center justify-between px-4 py-8 sm:py-12">
      <div className="w-full max-w-4xl flex items-center justify-between text-xs text-[#9BA8BE]">
        <span>Toán 10 · Chương III · Hệ thức lượng trong tam giác</span>
        <span>Bộ sách Kết nối tri thức</span>
      </div>

      <div className="w-full max-w-3xl flex flex-col items-center text-center my-auto py-6">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="relative flex flex-col items-center">
            <svg
              viewBox="0 0 220 220"
              className="w-44 h-44 sm:w-52 sm:h-52 drop-shadow-[0_0_24px_rgba(228,188,90,0.22)]"
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

            {daCoNhanVat ? (
              <div className="relative z-10 mt-3 bg-[#0D1424]/92 border border-[#E4BC5A]/45 rounded-xl px-3.5 py-2 flex items-center gap-3 shadow-lg">
                <NhanVat ngoaiHinh={ngoaiHinh} kichCo="nho" tuThe="chao" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-[#F2D88B]">
                    {ngoaiHinh.ten}
                  </div>
                  <div className="text-xs text-[#62D1B5]">
                    Cảnh giới {tenCanhGioi}
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative z-10 mt-3 bg-[#0D1424]/92 border border-[#E4BC5A]/45 rounded-xl px-3.5 py-1.5 flex items-center gap-2 shadow-lg">
                <TieuNon bieuCam="vui" className="w-10 h-11 shrink-0" />
                <span className="text-xs font-medium text-[#F2D88B]">
                  Tiểu Nón chờ bạn đồng hành!
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xl">
            <div className="dau-an-trang-tri text-xs font-semibold uppercase text-[#E4BC5A]/85 mb-1">
              Tiên Lộ Toán Học
            </div>
            <h1 className="tieu-de-vang text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              Tu Toán Chứng Đạo
            </h1>
            <p className="mt-3 text-base text-[#DCE6EA]/90 leading-relaxed">
              Vượt sáu tầng tiên đảo cùng Tiểu Nón qua những ải giải đố, đại chiến Yêu Vương,
              tra cứu Tàng Kinh Các và tu luyện Động Phủ để ngộ trọn Hệ thức lượng trong tam giác.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <NutLenhBai
                type="button"
                data-start="true"
                kieu="ngoc"
                className="text-base px-7 py-3"
                onClick={() => {
                  boPhatAmThanh.phatAmNgoDao();
                  khiBatDau();
                }}
              >
                {daCoNhanVat ? 'Tiếp tục tu luyện' : 'Bắt đầu hành trình'}
              </NutLenhBai>

              {daCoNhanVat && khiChoiLaiTuDau && (
                <NutLenhBai
                  type="button"
                  kieu="tram"
                  onClick={() => {
                    boPhatAmThanh.phatAmNhanNut();
                    khiChoiLaiTuDau();
                  }}
                >
                  Tạo nhân vật mới
                </NutLenhBai>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#9BA8BE] text-center">
        Enter để bắt đầu · Phím 1–4 / A–D chọn đáp án · WASD hoặc phím mũi tên di chuyển Vượt Ải
      </p>
    </main>
  );
};

export const ManCotTruyen: React.FC<{
  ngoaiHinh: NgoaiHinh;
  khiHoanThanh: () => void;
}> = ({ ngoaiHinh, khiHoanThanh }) => {
  const [khung, setKhung] = useState(0);
  const hienTai = COT_TRUYEN_MO_DAU[khung];
  const laCuoi = khung === COT_TRUYEN_MO_DAU.length - 1;

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-[#E4BC5A] font-medium">
            Khởi Nguyên · Hồi {khung + 1}/{COT_TRUYEN_MO_DAU.length}
          </span>
          <button
            type="button"
            onClick={() => {
              boPhatAmThanh.phatAmNhanNut();
              khiHoanThanh();
            }}
            className="min-h-[40px] px-3 text-sm text-[#9BA8BE] hover:text-[#F2D88B] cursor-pointer"
          >
            Bỏ qua
          </button>
        </div>

        <CuonThuGiayDo>
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="shrink-0 relative rounded-xl overflow-hidden border border-[#B98B2E]/60 w-44 h-44 flex flex-col items-center justify-end pb-1">
              <CanhNenChibi className="absolute inset-0 w-full h-full" hienHoaDaoRoi={false} />
              <div className="relative z-10 flex items-end justify-center gap-1">
                <NhanVat ngoaiHinh={ngoaiHinh} kichCo="vua" tuThe="chiDuong" />
                {hienTai.nguoiDan === 'tieuNon' && (
                  <TieuNon bieuCam="coVu" className="w-12 h-14 -ml-3" />
                )}
              </div>
              <span className="relative z-10 px-2 py-0.5 rounded bg-[#0D1424]/80 text-xs font-semibold text-[#F2D88B]">
                {ngoaiHinh.ten}
              </span>
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-1">
                <span className="dau-an-trang-tri text-xs font-bold uppercase text-[#8F1F1A]">
                  {hienTai.danhHieu} ·
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2B2118]">
                  {hienTai.tieuDe}
                </h2>
              </div>
              <p className="text-base text-[#2B2118]/90 leading-relaxed mt-2">
                {hienTai.noiDung}
              </p>
              <blockquote className="mt-3 pt-3 border-t border-[#B98B2E]/35 italic text-sm text-[#6B3B2A]">
                “{hienTai.nhanVatNoi}”
              </blockquote>
            </div>
          </div>
        </CuonThuGiayDo>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            {COT_TRUYEN_MO_DAU.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === khung ? 'w-7 bg-[#E4BC5A]' : 'w-2 bg-[#1F2A4D]'
                }`}
              />
            ))}
          </div>

          <NutLenhBai
            type="button"
            kieu={laCuoi ? 'vang' : 'ngoc'}
            onClick={() => {
              boPhatAmThanh.phatAmNhanNut();
              if (laCuoi) khiHoanThanh();
              else setKhung((k) => k + 1);
            }}
          >
            {laCuoi ? 'Bước vào Vân Hải' : 'Tiếp theo'}
          </NutLenhBai>
        </div>
      </div>
    </main>
  );
};
