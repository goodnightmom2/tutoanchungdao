import React, { useState } from 'react';
import { boPhatAmThanh } from '../amThanh/boPhatAmThanh';
import {
  DANH_SACH_VAT_PHAM,
  MAU_PHAM_CHAT,
  timVatPham,
} from '../duLieu/vatPham';
import { LoaiVatPham, TienTrinhNguoiChoi } from '../kieuDuLieu/troChoi';
import { BieuTuongLinhThach, BieuTuongVatPham } from '../thanhPhan/BieuTuong';
import { NutLenhBai } from '../thanhPhan/KhungGiaoDien';

export const ManTuiDo: React.FC<{
  tienTrinh: TienTrinhNguoiChoi;
  khiTrangBiPhapBao: (id: string) => void;
  khiDungDanDuoc: (id: string) => void;
  khiMoCuaHang: () => void;
}> = ({ tienTrinh, khiTrangBiPhapBao, khiDungDanDuoc, khiMoCuaHang }) => {
  const [loc, setLoc] = useState<'tatCa' | LoaiVatPham>('tatCa');

  const vatPhamSoHuu = DANH_SACH_VAT_PHAM.filter(
    (vp) => (tienTrinh.tuiDo[vp.id] || 0) > 0
  ).filter((vp) => loc === 'tatCa' || vp.loai === loc);

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 pb-28 md:pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="tieu-de-vang text-2xl sm:text-3xl font-bold">
            Túi Đồ Trữ Vật
          </h1>
          <p className="text-sm text-[#9BA8BE]">
            Trang bị tối đa 3 Pháp bảo để nhận hào quang bổ trợ trong suốt hành trình.
          </p>
        </div>
        <NutLenhBai type="button" kieu="vang" onClick={khiMoCuaHang}>
          Đến Tiệm Linh Bảo
        </NutLenhBai>
      </div>

      {/* 3 O trang bi Phap Bao */}
      <section className="khung-ngoc-gian rounded-xl p-4 mb-6">
        <div className="text-sm font-semibold text-[#F2D88B] mb-3">
          Pháp Bảo Đang Trang Bị ({tienTrinh.phapBaoDangTrangBi.length}/3)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[0, 1, 2].map((slot) => {
            const pbId = tienTrinh.phapBaoDangTrangBi[slot];
            const vp = pbId ? timVatPham(pbId) : undefined;
            if (!vp) {
              return (
                <div
                  key={slot}
                  className="rounded-lg border border-dashed border-[#2C3B5E] bg-[#070B14]/60 p-3 flex items-center justify-center text-xs text-[#6E7C94] min-h-[76px]"
                >
                  Ô Pháp bảo trống
                </div>
              );
            }
            const mau = MAU_PHAM_CHAT[vp.phamChat];
            return (
              <div
                key={vp.id}
                className="rounded-lg border p-3 flex items-center justify-between gap-2.5"
                style={{ borderColor: mau.vien, backgroundColor: mau.nen }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <BieuTuongVatPham vatPhamId={vp.id} className="w-9 h-9 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate" style={{ color: mau.chu }}>
                      {vp.ten}
                    </div>
                    <div className="text-[11px] text-[#DCE6EA]/80 line-clamp-2">
                      {vp.tacDung}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    boPhatAmThanh.phatAmNhanNut();
                    khiTrangBiPhapBao(vp.id);
                  }}
                  className="min-h-[36px] px-2.5 rounded border border-[#E4BC5A]/30 bg-[#0D1424] text-xs text-[#DCE6EA] hover:bg-[#1F2A4D] shrink-0 cursor-pointer"
                >
                  Gỡ
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bo loc loai */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(
          [
            ['tatCa', 'Tất cả'],
            ['phapBao', 'Pháp bảo'],
            ['phu', 'Phù chú'],
            ['danDuoc', 'Đan dược'],
          ] as ['tatCa' | LoaiVatPham, string][]
        ).map(([ma, nhan]) => (
          <button
            key={ma}
            type="button"
            onClick={() => setLoc(ma)}
            className={`min-h-[40px] px-3.5 rounded-lg border text-xs sm:text-sm font-medium cursor-pointer ${
              loc === ma
                ? 'bg-[#1E7F6B] border-[#62D1B5] text-[#F8F6EE]'
                : 'bg-[#0D1424] border-[#1F2A4D] text-[#DCE6EA]'
            }`}
          >
            {nhan}
          </button>
        ))}
      </div>

      {vatPhamSoHuu.length === 0 ? (
        <div className="khung-ngoc-gian rounded-xl p-8 text-center text-sm text-[#9BA8BE]">
          Chưa có vật phẩm nào trong mục này. Hãy ghé Tiệm Linh Bảo hoặc hoàn thành các giai đoạn để thu thập!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {vatPhamSoHuu.map((vp) => {
            const soLuong = tienTrinh.tuiDo[vp.id] || 0;
            const mau = MAU_PHAM_CHAT[vp.phamChat];
            const dangTrangBi = tienTrinh.phapBaoDangTrangBi.includes(vp.id);
            const coTheDungNgay = vp.id === 'hoiKhiDan' || vp.id === 'tuLinhDan';

            return (
              <div
                key={vp.id}
                className="rounded-xl border p-4 flex flex-col justify-between gap-3 bg-[#0D1424]/90"
                style={{ borderColor: `${mau.vien}88` }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-lg border flex items-center justify-center shrink-0"
                    style={{ borderColor: mau.vien, backgroundColor: mau.nen }}
                  >
                    <BieuTuongVatPham vatPhamId={vp.id} className="w-9 h-9" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif text-base font-bold" style={{ color: mau.chu }}>
                        {vp.ten}
                      </h3>
                      <span className="text-xs font-semibold text-[#F2D88B] chu-so-bang">
                        SL: {soLuong}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#9BA8BE] mt-0.5">
                      {mau.ten} ·{' '}
                      {vp.loai === 'phapBao'
                        ? 'Pháp bảo bị động'
                        : vp.loai === 'phu'
                        ? 'Dùng khi làm bài'
                        : 'Đan dược hồi phục'}
                    </div>
                    <p className="text-xs text-[#DCE6EA]/90 mt-1.5">{vp.tacDung}</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  {vp.loai === 'phapBao' ? (
                    <NutLenhBai
                      type="button"
                      kieu={dangTrangBi ? 'tram' : 'ngoc'}
                      className="text-xs px-4 py-2"
                      onClick={() => {
                        boPhatAmThanh.phatAmNhanNut();
                        khiTrangBiPhapBao(vp.id);
                      }}
                    >
                      {dangTrangBi ? 'Gỡ xuống' : 'Trang bị'}
                    </NutLenhBai>
                  ) : coTheDungNgay ? (
                    <NutLenhBai
                      type="button"
                      kieu="vang"
                      className="text-xs px-4 py-2"
                      onClick={() => {
                        boPhatAmThanh.phatAmNgoDao();
                        khiDungDanDuoc(vp.id);
                      }}
                    >
                      Luyện hóa ngay
                    </NutLenhBai>
                  ) : (
                    <span className="text-xs text-[#62D1B5]">
                      Sử dụng trực tiếp trong màn làm bài
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const ManCuaHang: React.FC<{
  tienTrinh: TienTrinhNguoiChoi;
  khiMuaVatPham: (id: string) => void;
  khiQuayLaiTuiDo?: () => void;
}> = ({ tienTrinh, khiMuaVatPham, khiQuayLaiTuiDo }) => {
  const [loc, setLoc] = useState<'tatCa' | LoaiVatPham>('tatCa');

  const danhSach = DANH_SACH_VAT_PHAM.filter(
    (vp) => loc === 'tatCa' || vp.loai === loc
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 pb-28 md:pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            {khiQuayLaiTuiDo && (
              <NutLenhBai
                type="button"
                kieu="tram"
                className="text-xs px-3 py-1.5 min-h-[36px]"
                onClick={khiQuayLaiTuiDo}
              >
                Quay lại Túi đồ
              </NutLenhBai>
            )}
            <h1 className="tieu-de-vang text-2xl sm:text-3xl font-bold">
              Tiệm Linh Bảo
            </h1>
          </div>
          <p className="text-sm text-[#9BA8BE] mt-1">
            Dùng Linh thạch tích lũy để thỉnh Pháp bảo, Phù chú và Linh đan thượng phẩm.
          </p>
        </div>

        <div className="px-4 py-2 rounded-lg bg-[#0D1424] border border-[#E4BC5A]/45 flex items-center gap-2">
          <BieuTuongLinhThach className="w-5 h-5" />
          <span className="text-base font-bold text-[#F2D88B] chu-so-bang">
            {tienTrinh.linhThach} Linh thạch
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {(
          [
            ['tatCa', 'Tất cả bảo vật'],
            ['phapBao', 'Pháp bảo'],
            ['phu', 'Phù chú'],
            ['danDuoc', 'Đan dược'],
          ] as ['tatCa' | LoaiVatPham, string][]
        ).map(([ma, nhan]) => (
          <button
            key={ma}
            type="button"
            onClick={() => setLoc(ma)}
            className={`min-h-[40px] px-3.5 rounded-lg border text-xs sm:text-sm font-medium cursor-pointer ${
              loc === ma
                ? 'bg-[#1E7F6B] border-[#62D1B5] text-[#F8F6EE]'
                : 'bg-[#0D1424] border-[#1F2A4D] text-[#DCE6EA]'
            }`}
          >
            {nhan}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {danhSach.map((vp) => {
          const mau = MAU_PHAM_CHAT[vp.phamChat];
          const soHuu = tienTrinh.tuiDo[vp.id] || 0;
          const daCoPhapBao = vp.loai === 'phapBao' && soHuu > 0;
          const duTien = tienTrinh.linhThach >= vp.giaLinhThach;

          return (
            <div
              key={vp.id}
              className="khung-ngoc-gian rounded-xl p-4 flex flex-col justify-between gap-3"
              style={{ borderColor: `${mau.vien}75` }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-lg border flex items-center justify-center shrink-0"
                  style={{ borderColor: mau.vien, backgroundColor: mau.nen }}
                >
                  <BieuTuongVatPham vatPhamId={vp.id} className="w-9 h-9" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-base font-bold" style={{ color: mau.chu }}>
                      {vp.ten}
                    </h3>
                    <span className="text-[11px]" style={{ color: mau.chu }}>
                      {mau.ten}
                    </span>
                  </div>
                  <p className="text-xs text-[#9BA8BE] mt-0.5">{vp.moTa}</p>
                  <p className="text-xs text-[#62D1B5] mt-1 font-medium">
                    {vp.tacDung}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-[#1F2A4D]">
                <span className="text-xs text-[#9BA8BE] chu-so-bang">
                  Đang có: {soHuu}
                </span>

                <NutLenhBai
                  type="button"
                  kieu={daCoPhapBao ? 'tram' : duTien ? 'vang' : 'tram'}
                  disabled={daCoPhapBao || !duTien}
                  className="text-xs px-4 py-2"
                  onClick={() => {
                    boPhatAmThanh.phatAmDung();
                    khiMuaVatPham(vp.id);
                  }}
                >
                  {daCoPhapBao ? (
                    'Đã sở hữu'
                  ) : (
                    <>
                      <BieuTuongLinhThach className="w-4 h-4" />
                      Mua ({vp.giaLinhThach})
                    </>
                  )}
                </NutLenhBai>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
