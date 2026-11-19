import React, { useEffect, useRef, useState } from 'react';
import { DANH_SACH_CANH_GIOI, layThongTinCanhGioi } from '../duLieu/canhGioi';
import { NHAN_VAT_GOC, THONG_TIN_NGU_HANH } from '../duLieu/ngoaiHinh';
import { DANH_SACH_THANH_TICH } from '../duLieu/vatPham';
import { MucXepHang } from '../kieuDuLieu/taiKhoan';
import {
  MaCanhGioi,
  NgoaiHinh,
  TienTrinhNguoiChoi,
  TrangThaiAnhCanhGioi,
} from '../kieuDuLieu/troChoi';
import { khoLuuTru } from '../logic/khoLuuTru';
import {
  layTenLinhCanHienTai,
  layThongTinHaoQuang,
  tinhChiSoNhanVat,
  tinhTongSao,
} from '../logic/tienTrinh';
import { xuatSvgThanhPng } from '../logic/xuatAnhPng';
import { AnhCanhGioi } from '../thanhPhan/AnhCanhGioi';
import {
  BieuTuongCaiDat,
  BieuTuongLinhKhi,
  BieuTuongLinhThach,
  BieuTuongPhongThayDo,
  BieuTuongSao,
} from '../thanhPhan/BieuTuong';
import { CanhNenChibi } from '../thanhPhan/CanhNenChibi';
import { CuonThuGiayDo, NutLenhBai } from '../thanhPhan/KhungGiaoDien';
import { NhanVat } from '../thanhPhan/NhanVat';
import { ManTaoNhanVat } from './ManTaoNhanVat';

export const ManHoSo: React.FC<{
  tienTrinh: TienTrinhNguoiChoi;
  khiCapNhatNgoaiHinh: (nh: NgoaiHinh) => void;
  khiMoPhongThayDo: () => void;
  khiMoCaiDat: () => void;
  laKhach?: boolean;
  laQuanTri?: boolean;
  uidNguoiDung?: string | null;
  khiMoDangNhap?: () => void;
}> = ({
  tienTrinh,
  khiCapNhatNgoaiHinh,
  khiMoPhongThayDo,
  khiMoCaiDat,
  laKhach = true,
  laQuanTri = false,
  uidNguoiDung = null,
  khiMoDangNhap,
}) => {
  const [dangChinhSua, setDangChinhSua] = useState(false);
  const [canhGioiXem, setCanhGioiXem] = useState<MaCanhGioi>(
    tienTrinh.canhGioiHienTai
  );
  const [thongBaoAnh, setThongBaoAnh] = useState('');
  const [theThienBang, setTheThienBang] = useState<'thanhTuu' | 'xepHang'>('thanhTuu');
  const [top20, setTop20] = useState<MucXepHang[]>([]);
  const [hangCuaBan, setHangCuaBan] = useState<number | null>(null);
  const [mucCuaBan, setMucCuaBan] = useState<MucXepHang | null>(null);
  const [dangTaiBxh, setDangTaiBxh] = useState(false);
  const svgXemRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (theThienBang !== 'xepHang' || laKhach) return;
    let conHoatDong = true;
    setDangTaiBxh(true);
    void khoLuuTru
      .docBangXepHang(uidNguoiDung)
      .then((kq) => {
        if (!conHoatDong) return;
        setTop20(kq.top20);
        setHangCuaBan(kq.hangCuaBan);
        setMucCuaBan(kq.mucCuaBan);
      })
      .finally(() => {
        if (conHoatDong) setDangTaiBxh(false);
      });
    return () => {
      conHoatDong = false;
    };
  }, [theThienBang, laKhach, uidNguoiDung]);

  if (dangChinhSua) {
    return (
      <ManTaoNhanVat
        ngoaiHinhBanDau={tienTrinh.ngoaiHinh}
        tienTrinh={tienTrinh}
        cheDoChinhSua
        khiMoPhongThayDo={() => {
          setDangChinhSua(false);
          khiMoPhongThayDo();
        }}
        khiXacNhan={(nhMoi) => {
          khiCapNhatNgoaiHinh(nhMoi);
          setDangChinhSua(false);
        }}
        khiHuy={() => setDangChinhSua(false)}
      />
    );
  }

  const goc =
    NHAN_VAT_GOC.find((n) => n.id === tienTrinh.ngoaiHinh.maMau) ||
    NHAN_VAT_GOC[0];
  const canhGioi = layThongTinCanhGioi(tienTrinh.canhGioiHienTai);
  const chiSo = tinhChiSoNhanVat(tienTrinh);
  const tongSao = tinhTongSao(tienTrinh);
  const tiLeDung =
    tienTrinh.tongCauDaLam > 0
      ? Math.round((tienTrinh.tongCauDung / tienTrinh.tongCauDaLam) * 100)
      : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 pb-28 md:pb-12 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="tieu-de-vang text-2xl sm:text-3xl font-bold">
            Hồ Sơ Đạo Lữ
          </h1>
          <p className="text-sm text-[#9BA8BE]">
            Căn cơ tu luyện, dung mạo và Thiên Bảng chiến tích.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <NutLenhBai type="button" kieu="ngoc" onClick={khiMoPhongThayDo}>
            <BieuTuongPhongThayDo className="w-4 h-4" />
            Phòng Thay Đồ
          </NutLenhBai>
          <NutLenhBai
            type="button"
            kieu="vang"
            onClick={() => setDangChinhSua(true)}
          >
            Sửa dung mạo
          </NutLenhBai>
          <NutLenhBai type="button" kieu="tram" onClick={khiMoCaiDat}>
            <BieuTuongCaiDat className="w-4 h-4" />
            {laQuanTri ? 'Cài đặt & Thầy/Cô' : 'Cài đặt'}
          </NutLenhBai>
        </div>
      </div>

      <CuonThuGiayDo>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative rounded-xl overflow-hidden border border-[#B98B2E]/60 w-44 h-48 flex items-end justify-center pb-1 shrink-0">
            <CanhNenChibi
              canhGioi={tienTrinh.canhGioiHienTai}
              className="absolute inset-0 w-full h-full"
              hienHoaDaoRoi={false}
            />
            <div className="relative z-10">
              <NhanVat
                ngoaiHinh={tienTrinh.ngoaiHinh}
                kichCo="vua"
                tuThe={goc.tuTheMacDinh}
                canhGioi={tienTrinh.canhGioiHienTai}
              />
            </div>
          </div>

          <div className="flex-1 w-full text-left space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-serif text-2xl font-bold text-[#2B2118]">
                {tienTrinh.ngoaiHinh.ten}
              </h2>
              {tienTrinh.danhHieuCuoi && (
                <span className="px-2.5 py-0.5 rounded bg-[#8F1F1A] text-[#F2D88B] text-xs font-bold">
                  {tienTrinh.danhHieuCuoi === 'chanTien'
                    ? 'Chân Tiên Chứng Đạo'
                    : 'Tán Tiên Tự Tại'}
                </span>
              )}
            </div>

            <div className="text-sm text-[#6B3B2A] font-medium">
              Cảnh giới: <strong>{canhGioi.ten}</strong> · Linh căn:{' '}
              <strong>{layTenLinhCanHienTai(tienTrinh)}</strong>
            </div>
            <div className="text-xs text-[#2B2118]/85">
              Hào quang Ngũ Hành: {THONG_TIN_NGU_HANH[tienTrinh.ngoaiHinh.haoQuang].ten} ·{' '}
              Nội tại <strong>{goc.noiTaiTen}</strong>: {goc.noiTaiMoTa}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="rounded-lg bg-[#0D1424] p-2.5 text-center">
                <div className="text-[11px] text-[#9BA8BE]">Linh lực tối đa</div>
                <div className="text-base font-bold text-[#62D1B5] chu-so-bang">
                  {chiSo.linhLucToiDa} ngọc
                </div>
              </div>
              <div className="rounded-lg bg-[#0D1424] p-2.5 text-center">
                <div className="text-[11px] text-[#9BA8BE]">Chính xác</div>
                <div className="text-base font-bold text-[#F2D88B] chu-so-bang">
                  {tiLeDung}% ({tienTrinh.tongCauDung}/{tienTrinh.tongCauDaLam})
                </div>
              </div>
              <div className="rounded-lg bg-[#0D1424] p-2.5 text-center">
                <div className="text-[11px] text-[#9BA8BE]">Ngộ Đạo cao nhất</div>
                <div className="text-base font-bold text-[#E4BC5A] chu-so-bang">
                  {tienTrinh.chuoiNgoDaoCaoNhat} câu
                </div>
              </div>
              <div className="rounded-lg bg-[#0D1424] p-2.5 text-center">
                <div className="text-[11px] text-[#9BA8BE]">Tổng Tinh Tú</div>
                <div className="text-base font-bold text-[#F2D88B] chu-so-bang inline-flex items-center justify-center gap-1">
                  <BieuTuongSao sang className="w-4 h-4" />
                  {tongSao}/72
                </div>
              </div>
            </div>
          </div>
        </div>
      </CuonThuGiayDo>

      {/* Bo suu tap Anh Canh Gioi 6 tang + Luu anh PNG */}
      <section className="khung-ngoc-gian rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="tieu-de-vang text-lg font-bold">
              Bộ Sưu Tập Cảnh Giới & Hào Quang
            </h3>
            <p className="text-xs text-[#9BA8BE]">
              Chọn cảnh giới đã mở khóa để chiêm ngưỡng hào quang riêng và lưu ảnh làm kỷ niệm.
            </p>
          </div>
          {thongBaoAnh && (
            <span className="text-xs text-[#62D1B5]">{thongBaoAnh}</span>
          )}
        </div>

        {/* Khung xem lon + nut Luu anh */}
        {(() => {
          const daDotPhaXem = tienTrinh.daDotPhaQua.includes(canhGioiXem);
          const dangTuXem = canhGioiXem === tienTrinh.canhGioiHienTai;
          const trangThaiXem: TrangThaiAnhCanhGioi = daDotPhaXem
            ? 'daDotPha'
            : dangTuXem
            ? 'dangTuLuyen'
            : 'chuaMo';
          const laTienQuang =
            canhGioiXem === 'doKiep' && tienTrinh.soLanDoKiepThanhCong > 0;
          const infoXem = layThongTinCanhGioi(canhGioiXem);
          const ttHq = layThongTinHaoQuang(
            canhGioiXem,
            laTienQuang ? 'tienQuang' : 'macDinh'
          );

          return (
            <div className="rounded-xl border border-[#E4BC5A]/35 bg-[#070B14]/80 p-4 flex flex-col sm:flex-row items-center gap-5">
              <div className="relative rounded-xl overflow-hidden border border-[#1F2A4D] bg-[#0B1426] p-2 shrink-0">
                <AnhCanhGioi
                  svgRef={svgXemRef}
                  ngoaiHinh={tienTrinh.ngoaiHinh}
                  canhGioi={canhGioiXem}
                  trangThai={trangThaiXem}
                  tienTrinh={tienTrinh}
                  bienThe={laTienQuang ? 'tienQuang' : 'macDinh'}
                  kichCo="lon"
                  giamHieuUng={tienTrinh.caiDat.giamHieuUng}
                />
              </div>
              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="text-xs uppercase tracking-wider text-[#62D1B5] font-semibold">
                  {infoXem.danhHieu} · {infoXem.ten}
                </div>
                <div className="text-lg font-bold text-[#F2D88B]">
                  {ttHq.tenHaoQuang}
                </div>
                <p className="text-xs sm:text-sm text-[#DCE6EA]/85">
                  {trangThaiXem === 'chuaMo'
                    ? `Chưa mở khóa: Hãy đột phá các cảnh giới trước và chạm tới ${infoXem.ten} để thắp sáng hào quang này.`
                    : ttHq.moTa}
                </p>
                <div className="pt-1 flex flex-wrap justify-center sm:justify-start gap-2">
                  <NutLenhBai
                    type="button"
                    kieu="vang"
                    disabled={trangThaiXem === 'chuaMo'}
                    onClick={async () => {
                      const ok = await xuatSvgThanhPng(
                        svgXemRef.current,
                        `tu-toan-chung-dao-${canhGioiXem}.png`
                      );
                      setThongBaoAnh(
                        ok
                          ? `Đã tải ảnh PNG cảnh giới ${infoXem.ten}.`
                          : 'Không thể xuất ảnh trên trình duyệt này.'
                      );
                    }}
                  >
                    Lưu ảnh
                  </NutLenhBai>
                </div>
              </div>
            </div>
          );
        })()}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {DANH_SACH_CANH_GIOI.map((cg) => {
            const daDotPha = tienTrinh.daDotPhaQua.includes(cg.id);
            const dangTu = cg.id === tienTrinh.canhGioiHienTai;
            const trangThai: TrangThaiAnhCanhGioi = daDotPha
              ? 'daDotPha'
              : dangTu
              ? 'dangTuLuyen'
              : 'chuaMo';
            const dangChon = canhGioiXem === cg.id;
            const laTienQuang =
              cg.id === 'doKiep' && tienTrinh.soLanDoKiepThanhCong > 0;
            const ttHq = layThongTinHaoQuang(
              cg.id,
              laTienQuang ? 'tienQuang' : 'macDinh'
            );

            return (
              <button
                key={cg.id}
                type="button"
                onClick={() => setCanhGioiXem(cg.id)}
                className={`rounded-xl border p-2 flex flex-col items-center text-center transition-colors cursor-pointer ${
                  dangChon
                    ? 'border-[#E4BC5A] bg-[#141D33]'
                    : trangThai === 'chuaMo'
                    ? 'border-[#1F2A4D] bg-[#070B14]/70 opacity-75 hover:opacity-100'
                    : 'border-[#3FB59A]/45 bg-[#0D1424] hover:border-[#E4BC5A]/70'
                }`}
              >
                <AnhCanhGioi
                  ngoaiHinh={tienTrinh.ngoaiHinh}
                  canhGioi={cg.id}
                  trangThai={trangThai}
                  tienTrinh={tienTrinh}
                  bienThe={laTienQuang ? 'tienQuang' : 'macDinh'}
                  kichCo="nho"
                  giamHieuUng
                />
                <div className="text-xs font-bold text-[#F2D88B] mt-1">
                  {cg.ten}
                </div>
                <div className="text-[10px] text-[#9BA8BE] line-clamp-1">
                  {trangThai === 'chuaMo' ? 'Chưa mở khóa' : ttHq.tenHaoQuang}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="khung-ngoc-gian rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#070B14] border border-[#1F2A4D]">
            <button
              type="button"
              onClick={() => setTheThienBang('thanhTuu')}
              className={`min-h-[36px] px-3 rounded-lg text-xs sm:text-sm font-bold cursor-pointer ${
                theThienBang === 'thanhTuu'
                  ? 'bg-[#141D33] text-[#F2D88B] border border-[#E4BC5A]/60'
                  : 'text-[#9BA8BE] hover:text-[#DCE6EA]'
              }`}
            >
              Thành tựu ({tienTrinh.thanhTichDaDat.length}/{DANH_SACH_THANH_TICH.length})
            </button>
            <button
              type="button"
              onClick={() => setTheThienBang('xepHang')}
              className={`min-h-[36px] px-3 rounded-lg text-xs sm:text-sm font-bold cursor-pointer ${
                theThienBang === 'xepHang'
                  ? 'bg-[#141D33] text-[#F2D88B] border border-[#E4BC5A]/60'
                  : 'text-[#9BA8BE] hover:text-[#DCE6EA]'
              }`}
            >
              Thiên Bảng (Xếp hạng)
            </button>
          </div>
          <span className="text-xs text-[#9BA8BE] inline-flex items-center gap-1">
            <BieuTuongLinhKhi className="w-4 h-4" /> {tienTrinh.linhKhi} Linh khí
          </span>
        </div>

        {theThienBang === 'thanhTuu' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DANH_SACH_THANH_TICH.map((tt) => {
              const daDat = tienTrinh.thanhTichDaDat.includes(tt.id);
              return (
                <div
                  key={tt.id}
                  className={`rounded-lg border p-3 flex items-start justify-between gap-3 ${
                    daDat
                      ? 'bg-[#1E7F6B]/18 border-[#62D1B5]/65'
                      : 'bg-[#070B14]/75 border-[#1F2A4D] opacity-70'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold text-[#F2D88B]">
                      {tt.ten}
                    </div>
                    <div className="text-xs text-[#DCE6EA]/80 mt-0.5">
                      {tt.moTa}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-semibold text-[#E4BC5A] inline-flex items-center gap-1 chu-so-bang">
                      <BieuTuongLinhThach className="w-3.5 h-3.5" />+
                      {tt.linhThachThuong}
                    </div>
                    <div className="text-[11px] mt-1 text-[#62D1B5]">
                      {daDat ? 'Đã ghi danh' : 'Chưa đạt'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : laKhach ? (
          <div className="rounded-xl border border-[#3FB59A]/45 bg-[#070B14]/85 p-5 text-center space-y-3">
            <div className="text-sm font-bold text-[#F2D88B]">
              Đăng nhập để xem Thiên Bảng & ghi danh thứ hạng
            </div>
            <p className="text-xs text-[#9BA8BE]">
              Thiên Bảng chỉ hiển thị Đạo hiệu, cảnh giới và tổng số sao (tối đa 72 sao) của 20 đạo hữu dẫn đầu.
            </p>
            {khiMoDangNhap && (
              <NutLenhBai type="button" kieu="vang" onClick={khiMoDangNhap}>
                Đăng nhập / Đăng ký ngay
              </NutLenhBai>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="rounded-xl border border-[#E4BC5A]/45 bg-[#141D33]/85 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
              <span className="text-[#DCE6EA]">
                Hạng của bạn:{' '}
                <strong className="text-[#F2D88B] chu-so-bang">
                  {hangCuaBan ? `#${hangCuaBan}` : mucCuaBan ? 'Ngoài 50 hạng đầu' : 'Đang ẩn khỏi bảng'}
                </strong>
              </span>
              <span className="text-[#62D1B5] chu-so-bang font-semibold">
                {canhGioi.ten} · {tongSao}/72 sao
              </span>
            </div>

            {dangTaiBxh ? (
              <p className="text-xs text-[#9BA8BE] text-center py-4">
                Đang tải Thiên Bảng...
              </p>
            ) : top20.length === 0 ? (
              <p className="text-xs text-[#9BA8BE] text-center py-4">
                Chưa có đạo hữu nào ghi danh trên Thiên Bảng.
              </p>
            ) : (
              <div className="space-y-1.5">
                {top20.map((m, idx) => {
                  const laBan = uidNguoiDung && m.uid === uidNguoiDung;
                  return (
                    <div
                      key={m.uid}
                      className={`rounded-lg border px-3.5 py-2 flex items-center justify-between gap-3 text-xs sm:text-sm ${
                        laBan
                          ? 'bg-[#1E7F6B]/22 border-[#62D1B5]'
                          : 'bg-[#070B14]/80 border-[#1F2A4D]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-7 h-7 rounded-lg inline-flex items-center justify-center font-bold chu-so-bang shrink-0 ${
                            idx === 0
                              ? 'bg-[#E4BC5A] text-[#1A1308]'
                              : idx === 1
                              ? 'bg-[#CBD5E1] text-[#0F172A]'
                              : idx === 2
                              ? 'bg-[#D97742] text-white'
                              : 'bg-[#141D33] text-[#9BA8BE]'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="font-bold text-[#F6EEDB] truncate">
                            {m.daoHieu}
                            {laBan && (
                              <span className="ml-1.5 text-[11px] text-[#62D1B5]">
                                (Bạn)
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#62D1B5]">
                            {layThongTinCanhGioi(m.canhGioi).ten}
                          </div>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-1 font-bold text-[#F2D88B] chu-so-bang shrink-0">
                        <BieuTuongSao sang className="w-4 h-4" />
                        {m.tongSao}/72
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {tienTrinh.lichSu.length > 0 && (
        <section className="khung-ngoc-gian rounded-xl p-5">
          <h3 className="tieu-de-vang text-lg font-bold mb-3">
            Nhật Ký Tu Luyện Gần Đây
          </h3>
          <div className="space-y-2">
            {tienTrinh.lichSu.slice(0, 8).map((ls, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs sm:text-sm py-2 border-b border-[#1F2A4D] last:border-0"
              >
                <div>
                  <span className="font-semibold text-[#F2D88B]">
                    {layThongTinCanhGioi(ls.canhGioi).ten}
                  </span>{' '}
                  ·{' '}
                  <span className="text-[#DCE6EA]">
                    {ls.loaiTran === 'yeuVuong'
                      ? 'Đại Chiến Yêu Vương'
                      : ls.loaiTran === 'vuotAi'
                      ? `Vượt Ải ${
                          {
                            soKy: 'Sơ kỳ',
                            trungKy: 'Trung kỳ',
                            hauKy: 'Hậu kỳ',
                            dinhPhong: 'Đỉnh phong',
                          }[ls.giaiDoan]
                        }`
                      : ls.loaiTran === 'doKiep'
                      ? 'Đài Độ Kiếp'
                      : ls.loaiTran === 'dauPhap'
                      ? 'Đấu Pháp Hậu kỳ'
                      : ({
                          soKy: 'Sơ kỳ',
                          trungKy: 'Trung kỳ',
                          hauKy: 'Hậu kỳ',
                          dinhPhong: 'Đỉnh phong',
                        }[ls.giaiDoan] || ls.giaiDoan)}
                  </span>
                </div>
                <div className="text-[#62D1B5] font-semibold chu-so-bang">
                  {ls.soCauDung}/{ls.tongCau} câu đúng
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
