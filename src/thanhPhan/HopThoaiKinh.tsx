import React from 'react';
import { boPhatAmThanh } from '../amThanh/boPhatAmThanh';
import { TEN_MUC_KINH } from '../duLieu/tangKinhCac';
import { Kinh, TienTrinhNguoiChoi } from '../kieuDuLieu/troChoi';
import { BieuTuongLinhKhi, BieuTuongTangKinhCac } from './BieuTuong';
import { CongThucToan } from './CongThucToan';
import { HinhVe } from './HinhVe';
import { CuonThuGiayDo, NutLenhBai } from './KhungGiaoDien';

export const HopThoaiKinh: React.FC<{
  mo: boolean;
  dong: () => void;
  danhSachKinh: Kinh[];
  tienTrinh: TienTrinhNguoiChoi;
  khiDocLanDau?: (maKinh: string) => void;
  khiChuyenDaThuoc?: (maKinh: string) => void;
  khiChuyenSoTay?: (maKinh: string) => void;
}> = ({
  mo,
  dong,
  danhSachKinh,
  tienTrinh,
  khiDocLanDau,
  khiChuyenDaThuoc,
  khiChuyenSoTay,
}) => {
  if (!mo || danhSachKinh.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Kinh văn liên quan trong Tàng Kinh Các"
    >
      <div className="max-w-xl w-full max-h-[86dvh] overflow-y-auto space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-[#F2D88B]">
            <BieuTuongTangKinhCac className="w-5 h-5" />
            <span className="font-serif font-bold text-lg">
              Kinh Văn Liên Quan · Tàng Kinh Các
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              boPhatAmThanh.phatAmNhanNut();
              dong();
            }}
            className="min-h-[40px] px-3.5 rounded-lg bg-[#0D1424] border border-[#E4BC5A]/45 text-xs font-semibold text-[#F6EEDB] hover:bg-[#1F2A4D] cursor-pointer"
          >
            Đóng
          </button>
        </div>

        {danhSachKinh.map((kinh) => {
          const daDoc = tienTrinh.tangKinhCac.daDoc.includes(kinh.ma);
          const daThuoc = tienTrinh.tangKinhCac.daThuoc.includes(kinh.ma);
          const trongSoTay = tienTrinh.tangKinhCac.soTay.includes(kinh.ma);

          return (
            <CuonThuGiayDo key={kinh.ma}>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B3B2A] mb-1.5">
                <span className="font-bold">
                  Tầng {kinh.tang} · {TEN_MUC_KINH[kinh.muc]}
                </span>
                {daDoc ? (
                  <span className="text-[#1E7F6B] font-semibold">Đã lĩnh hội</span>
                ) : (
                  <span className="text-[#8F1F1A] font-semibold">Chưa đọc</span>
                )}
              </div>

              <h3 className="font-serif text-lg font-bold text-[#2B2118] mb-2">
                {kinh.tieuDe}
              </h3>

              <div className="text-sm text-[#2B2118] leading-relaxed whitespace-pre-line">
                <CongThucToan noiDung={kinh.noiDung} />
              </div>

              {kinh.hinhVe && (
                <div className="mt-3">
                  <HinhVe hinh={kinh.hinhVe} />
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-[#B98B2E]/35 flex flex-wrap items-center gap-2">
                {!daDoc && khiDocLanDau && (
                  <NutLenhBai
                    type="button"
                    kieu="vang"
                    className="text-xs px-3 py-1.5 min-h-[38px]"
                    onClick={() => {
                      boPhatAmThanh.phatAmNgoDao();
                      khiDocLanDau(kinh.ma);
                    }}
                  >
                    <BieuTuongLinhKhi className="w-4 h-4" />
                    Lĩnh hội (+5 Linh khí)
                  </NutLenhBai>
                )}

                {khiChuyenDaThuoc && (
                  <button
                    type="button"
                    onClick={() => {
                      boPhatAmThanh.phatAmNhanNut();
                      khiChuyenDaThuoc(kinh.ma);
                    }}
                    className={`min-h-[38px] px-3 rounded-lg border text-xs font-semibold cursor-pointer ${
                      daThuoc
                        ? 'bg-[#1E7F6B] border-[#0E4A3E] text-[#F8F6EE]'
                        : 'bg-[#FFFDF8] border-[#B98B2E]/50 text-[#2B2118]'
                    }`}
                  >
                    {daThuoc ? 'Đã thuộc' : 'Đánh dấu đã thuộc'}
                  </button>
                )}

                {khiChuyenSoTay && (
                  <button
                    type="button"
                    onClick={() => {
                      boPhatAmThanh.phatAmNhanNut();
                      khiChuyenSoTay(kinh.ma);
                    }}
                    className={`min-h-[38px] px-3 rounded-lg border text-xs font-semibold cursor-pointer ${
                      trongSoTay
                        ? 'bg-[#141D33] border-[#E4BC5A] text-[#F2D88B]'
                        : 'bg-[#FFFDF8] border-[#B98B2E]/50 text-[#2B2118]'
                    }`}
                  >
                    {trongSoTay ? 'Đã lưu Sổ Tay' : 'Lưu vào Sổ Tay'}
                  </button>
                )}
              </div>
            </CuonThuGiayDo>
          );
        })}
      </div>
    </div>
  );
};
