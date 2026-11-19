import React from 'react';
import { boPhatAmThanh } from '../amThanh/boPhatAmThanh';
import { layThongTinCanhGioi } from '../duLieu/canhGioi';
import {
  CanhGioi,
  MaCanhGioi,
  MaGiaiDoan,
  TienTrinhNguoiChoi,
} from '../kieuDuLieu/troChoi';
import {
  duDieuKienDotPha,
  khoaGiaiDoan,
  laGiaiDoanDaMo,
} from '../logic/tienTrinh';
import {
  BieuTuongKhoa,
  BieuTuongKiem,
  BieuTuongSamSet,
  BieuTuongSao,
} from '../thanhPhan/BieuTuong';
import { NutLenhBai } from '../thanhPhan/KhungGiaoDien';
import { ThienLoTuVi } from './ThienLoTuVi';

export const VanHaiDo: React.FC<{
  tienTrinh: TienTrinhNguoiChoi;
  khiChonCanhGioi: (id: MaCanhGioi) => void;
  khiMoRuongMoc: (moc: number) => void;
  khiCapNhatDaoCuoiDaXem?: (dao: CanhGioi) => void;
  khiHoanTatHieuUngDotPha?: () => void;
  laKhach?: boolean;
  khiMoDangKy?: () => void;
  thongBaoQuanTri?: string | null;
  khiAnThongBaoQuanTri?: () => void;
}> = ({
  tienTrinh,
  khiChonCanhGioi,
  khiMoRuongMoc,
  khiCapNhatDaoCuoiDaXem,
  khiHoanTatHieuUngDotPha,
  laKhach,
  khiMoDangKy,
  thongBaoQuanTri,
  khiAnThongBaoQuanTri,
}) => (
  <ThienLoTuVi
    tienTrinh={tienTrinh}
    khiChonCanhGioi={khiChonCanhGioi}
    khiMoRuongMoc={khiMoRuongMoc}
    khiCapNhatDaoCuoiDaXem={khiCapNhatDaoCuoiDaXem}
    khiHoanTatHieuUngDotPha={khiHoanTatHieuUngDotPha}
    laKhach={laKhach}
    khiMoDangKy={khiMoDangKy}
    thongBaoQuanTri={thongBaoQuanTri}
    khiAnThongBaoQuanTri={khiAnThongBaoQuanTri}
  />
);

import { layThongTinYeuVuong } from '../duLieu/yeuVuong';
import { YeuVuongSvg } from '../thanhPhan/YeuVuongSvg';

export const BanDoGiaiDoan: React.FC<{
  canhGioiId: MaCanhGioi;
  tienTrinh: TienTrinhNguoiChoi;
  khiQuayLai: () => void;
  khiChonGiaiDoan: (gd: MaGiaiDoan) => void;
  khiBatDauYeuVuong: () => void;
}> = ({
  canhGioiId,
  tienTrinh,
  khiQuayLai,
  khiChonGiaiDoan,
  khiBatDauYeuVuong,
}) => {
  const cg = layThongTinCanhGioi(canhGioiId);
  const boss = layThongTinYeuVuong(canhGioiId);
  const kiemTraDotPha = duDieuKienDotPha(tienTrinh, canhGioiId);
  const daDotPhaQua = tienTrinh.daDotPhaQua.includes(canhGioiId);

  return (
    <div className="max-w-3xl mx-auto px-4 py-5 pb-28 md:pb-12">
      <div className="flex items-center justify-between gap-3 mb-5">
        <NutLenhBai type="button" kieu="tram" onClick={khiQuayLai}>
          Quay lại Vân Hải Đồ
        </NutLenhBai>
        <span className="dau-an-trang-tri text-sm font-semibold uppercase text-[#E4BC5A]">
          {cg.danhHieu}
        </span>
      </div>

      {/* Tieu de dao */}
      <div className="khung-ngoc-gian rounded-xl p-5 mb-6">
        <div className="text-xs text-[#62D1B5] font-semibold">
          Tầng {cg.thuTu} · {cg.baiHoc}
        </div>
        <h1 className="tieu-de-vang text-2xl sm:text-3xl font-bold mt-1">
          Đảo {cg.ten}
        </h1>
        <p className="text-sm text-[#DCE6EA]/90 mt-1.5">{cg.moTa}</p>
        <div className="mt-3 pt-3 border-t border-[#E4BC5A]/20 flex flex-wrap items-center justify-between gap-2 text-xs text-[#9BA8BE]">
          <span>
            Ngưỡng tiến hóa: <span className="text-[#F2D88B]">{cg.nguongLinhCan}</span>
          </span>
          <span className="text-[#62D1B5]">
            {tienTrinh.caiDat.cheDoTraLoiNhanh
              ? 'Chế độ: Trả lời nhanh'
              : 'Chế độ: Vượt Ải 9×14'}
          </span>
        </div>
      </div>

      {/* 4 Giai doan tu duoi len */}
      <h2 className="text-sm font-semibold text-[#E4BC5A] mb-3">
        Tứ Đại Giai Đoạn Tu Luyện (Từ Dễ đến Khó)
      </h2>

      <div className="space-y-3.5">
        {cg.giaiDoan.map((gd, idx) => {
          const laYeuVuong = gd.ma === 'dinhPhong';
          const daMo = laYeuVuong
            ? kiemTraDotPha.duDieuKien || daDotPhaQua
            : laGiaiDoanDaMo(tienTrinh, canhGioiId, gd.ma);
          const tt = tienTrinh.tienDoGiaiDoan[khoaGiaiDoan(canhGioiId, gd.ma)];
          const sao = tt?.soSao || 0;

          if (laYeuVuong) {
            return (
              <div
                key={gd.ma}
                className={`rounded-xl border p-4 sm:p-5 transition-all ${
                  daMo
                    ? 'bg-gradient-to-r from-[#241642] to-[#141D33] border-[#B79CFF] shadow-[0_0_24px_rgba(122,77,255,0.28)]'
                    : 'bg-[#0B101D]/75 border-[#2A3759] opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <YeuVuongSvg
                      maYeuVuong={boss.ma}
                      trangThai={daMo ? 'noiGian' : 'binhThuong'}
                      className="w-16 h-16 shrink-0"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-[#E4BC5A] chu-so-bang">
                          Giai đoạn 4 · Đỉnh phong
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#E5DAFF]">
                          <BieuTuongSamSet className="w-3.5 h-3.5" />
                          Yêu Vương {boss.soPha} pha · {boss.soDonCanN} đòn
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#F2D88B] mt-0.5">
                        {boss.ten}
                      </h3>
                      <p className="text-xs text-[#DCE6EA]/85 mt-0.5">{boss.moTa}</p>
                      {!daMo && kiemTraDotPha.lyDo && (
                        <p className="text-xs text-[#F28A80] mt-1 font-medium">
                          Điều kiện mở: {kiemTraDotPha.lyDo}
                        </p>
                      )}
                    </div>
                  </div>

                  <NutLenhBai
                    type="button"
                    kieu={daMo ? 'vang' : 'tram'}
                    disabled={!daMo}
                    onClick={() => {
                      boPhatAmThanh.phatAmSamSet();
                      khiBatDauYeuVuong();
                    }}
                  >
                    {!daMo ? (
                      <>
                        <BieuTuongKhoa className="w-4 h-4" />
                        Chưa mở
                      </>
                    ) : daDotPhaQua ? (
                      'Khiêu chiến lại'
                    ) : (
                      'Khiêu chiến Yêu Vương'
                    )}
                  </NutLenhBai>
                </div>
              </div>
            );
          }

          return (
            <div
              key={gd.ma}
              className={`rounded-xl border p-4 transition-all ${
                daMo
                  ? 'bg-[#111A30]/95 border-[#3FB59A]/45'
                  : 'bg-[#0B101D]/70 border-[#1F2A4D]/60 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-[#E4BC5A] chu-so-bang">
                      Giai đoạn {idx + 1}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#F6EEDB]">
                      {gd.ten}
                    </h3>
                    <span className="text-xs font-semibold text-[#62D1B5]">
                      · {tienTrinh.caiDat.cheDoTraLoiNhanh ? 'Trả lời nhanh' : 'Vượt Ải'}
                    </span>
                    {gd.laDauPhap && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#F28A80]">
                        <BieuTuongKiem className="w-3.5 h-3.5" />
                        Đấu Pháp định thời
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-[#62D1B5] mt-0.5">
                    {gd.chuDe}
                  </div>
                  <p className="text-sm text-[#DCE6EA]/85 mt-1">{gd.moTa}</p>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
                  <div className="flex items-center gap-1" aria-label={`Đạt ${sao} trên 3 sao`}>
                    {[1, 2, 3].map((s) => (
                      <BieuTuongSao key={s} sang={s <= sao} className="w-4 h-4" />
                    ))}
                  </div>

                  <NutLenhBai
                    type="button"
                    kieu={daMo ? (tt?.daHoanThanh ? 'tram' : 'ngoc') : 'tram'}
                    disabled={!daMo}
                    onClick={() => {
                      boPhatAmThanh.phatAmNhanNut();
                      khiChonGiaiDoan(gd.ma);
                    }}
                  >
                    {!daMo ? (
                      <>
                        <BieuTuongKhoa className="w-4 h-4" />
                        Chưa mở
                      </>
                    ) : tt?.daHoanThanh ? (
                      'Ôn luyện lại'
                    ) : tienTrinh.caiDat.cheDoTraLoiNhanh ? (
                      'Vào trả lời nhanh'
                    ) : (
                      'Vào Vượt Ải'
                    )}
                  </NutLenhBai>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

