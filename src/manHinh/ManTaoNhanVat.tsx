import React, { useState } from 'react';
import { boPhatAmThanh } from '../amThanh/boPhatAmThanh';
import {
  BANG_MAU_DA,
  BANG_MAU_MAT,
  BANG_MAU_TOC,
  BANG_MAU_TRANG_PHUC,
  BANG_MAU_VIEN_AO,
  DANH_SACH_LINH_THU,
  KIEU_AO_NGOAI,
  KIEU_KHUON_MAT,
  KIEU_LONG_MAY,
  KIEU_MAT,
  KIEU_MIENG,
  KIEU_TOC,
  MU_PHU_KIEN_DAU,
  NHAN_VAT_GOC,
  PHAP_KHI_TAY,
  PHU_KIEN_THEM,
  THONG_TIN_NGU_HANH,
  taoNgoaiHinhNgauNhien,
  taoTenTuSiNgauNhien,
} from '../duLieu/ngoaiHinh';
import {
  DangNguoi,
  NgoaiHinh,
  NguHanh,
  TienTrinhNguoiChoi,
} from '../kieuDuLieu/troChoi';
import { laDoMoKhoa } from '../logic/tienTrinh';
import { BieuTuongKhoa, BieuTuongPhongThayDo } from '../thanhPhan/BieuTuong';
import { CanhNenChibi } from '../thanhPhan/CanhNenChibi';
import { CuonThuGiayDo, NutLenhBai } from '../thanhPhan/KhungGiaoDien';
import { NhanVat } from '../thanhPhan/NhanVat';

type MucTuyChinh = 'coBan' | 'dungMao' | 'tocAo' | 'phapKhi';

export const ManTaoNhanVat: React.FC<{
  ngoaiHinhBanDau: NgoaiHinh;
  tienTrinh: TienTrinhNguoiChoi;
  cheDoChinhSua?: boolean;
  khiMoPhongThayDo?: (nhHienTai: NgoaiHinh) => void;
  khiXacNhan: (ngoaiHinhMoi: NgoaiHinh) => void;
  khiHuy?: () => void;
}> = ({
  ngoaiHinhBanDau,
  tienTrinh,
  cheDoChinhSua = false,
  khiMoPhongThayDo,
  khiXacNhan,
  khiHuy,
}) => {
  const [ngoaiHinh, setNgoaiHinh] = useState<NgoaiHinh>({
    ...ngoaiHinhBanDau,
    trangPhuc: { ...ngoaiHinhBanDau.trangPhuc },
  });
  const [muc, setMuc] = useState<MucTuyChinh>('coBan');
  const [loiTen, setLoiTen] = useState('');

  const gocDangChon =
    NHAN_VAT_GOC.find((n) => n.id === ngoaiHinh.maMau) || NHAN_VAT_GOC[0];

  const capNhat = <K extends keyof NgoaiHinh>(truong: K, giaTri: NgoaiHinh[K]) => {
    boPhatAmThanh.phatAmNhanNut();
    setNgoaiHinh((cu) => ({ ...cu, [truong]: giaTri }));
  };

  const chonNhanVatGoc = (gocId: string) => {
    boPhatAmThanh.phatAmNhanNut();
    const goc = NHAN_VAT_GOC.find((n) => n.id === gocId);
    if (!goc) return;
    setNgoaiHinh((cu) => ({
      ...goc.ngoaiHinhMacDinh,
      trangPhuc: { ...goc.ngoaiHinhMacDinh.trangPhuc },
      ten: cu.ten && cheDoChinhSua ? cu.ten : goc.ngoaiHinhMacDinh.ten,
    }));
  };

  const xuLyXacNhan = () => {
    const tenSach = ngoaiHinh.ten.trim();
    if (!tenSach) {
      setLoiTen('Đạo hữu hãy đặt một danh xưng cho nhân vật.');
      return;
    }
    boPhatAmThanh.phatAmNgoDao();
    khiXacNhan({ ...ngoaiHinh, ten: tenSach.slice(0, 16) });
  };

  return (
    <main className="min-h-[100dvh] max-w-6xl mx-auto px-4 py-5 pb-24 md:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="tieu-de-vang text-2xl sm:text-3xl font-bold">
            {cheDoChinhSua ? 'Cải Tạo Dung Mạo' : 'Khởi Tạo Tu Sĩ'}
          </h1>
          <p className="text-sm text-[#9BA8BE]">
            Chọn xuất thân linh căn yếu, tùy chỉnh gương mặt và trang phục chibi tiên hiệp của riêng mình.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {khiMoPhongThayDo && (
            <NutLenhBai
              type="button"
              kieu="ngoc"
              onClick={() => {
                boPhatAmThanh.phatAmNhanNut();
                khiMoPhongThayDo(ngoaiHinh);
              }}
            >
              <BieuTuongPhongThayDo className="w-4 h-4" />
              Phòng Thay Đồ
            </NutLenhBai>
          )}
          <NutLenhBai
            type="button"
            kieu="tram"
            onClick={() => {
              boPhatAmThanh.phatAmNhanNut();
              setNgoaiHinh(taoNgoaiHinhNgauNhien(ngoaiHinh.maMau));
            }}
          >
            Ngẫu nhiên
          </NutLenhBai>
          {khiHuy && (
            <NutLenhBai type="button" kieu="tram" onClick={khiHuy}>
              Quay lại
            </NutLenhBai>
          )}
        </div>
      </div>

      {/* Chon 6 nhan vat khoi dau */}
      <section aria-label="Chọn xuất thân nhân vật" className="mb-6">
        <h2 className="text-sm font-semibold text-[#E4BC5A] mb-2.5">
          1. Chọn xuất thân & nội tại (6 nhân vật chibi)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {NHAN_VAT_GOC.map((nv) => {
            const dangChon = nv.id === ngoaiHinh.maMau;
            const mauHanh = THONG_TIN_NGU_HANH[nv.nguHanh].mau;
            return (
              <button
                key={nv.id}
                type="button"
                onClick={() => chonNhanVatGoc(nv.id)}
                className={`text-left rounded-lg p-2.5 border transition-all cursor-pointer flex flex-col items-center text-center ${
                  dangChon
                    ? 'bg-[#141D33] border-[#E4BC5A] shadow-[0_0_16px_rgba(228,188,90,0.22)]'
                    : 'bg-[#0D1424]/80 border-[#1F2A4D] hover:border-[#E4BC5A]/45'
                }`}
              >
                <NhanVat
                  ngoaiHinh={nv.ngoaiHinhMacDinh}
                  tuThe={nv.tuTheMacDinh}
                  kichCo="nho"
                />
                <div className="mt-1.5 text-sm font-bold text-[#F2D88B]">
                  {nv.ten}
                </div>
                <div className="text-[11px]" style={{ color: mauHanh }}>
                  Hệ {THONG_TIN_NGU_HANH[nv.nguHanh].ten}
                </div>
                <div className="mt-1 text-[11px] text-[#9BA8BE] line-clamp-2">
                  {nv.noiTaiTen}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Xem truoc tren nen chibi */}
        <div className="lg:col-span-5 lg:sticky lg:top-6">
          <CuonThuGiayDo className="text-center">
            <div className="relative rounded-xl overflow-hidden border border-[#B98B2E]/60">
              <CanhNenChibi
                canhGioi={tienTrinh.canhGioiHienTai}
                className="w-full h-64 sm:h-72"
              />
              <div className="absolute inset-x-0 bottom-2 flex flex-col items-center pointer-events-none">
                <NhanVat
                  ngoaiHinh={ngoaiHinh}
                  tuThe={gocDangChon.tuTheMacDinh}
                  kichCo="lon"
                  canhGioi={tienTrinh.canhGioiHienTai}
                />
              </div>
            </div>

            <div className="mt-2 font-serif text-xl font-bold text-[#2B2118]">
              {ngoaiHinh.ten || 'Chưa đặt tên'}
            </div>
            <div className="text-xs text-[#1E7F6B] font-semibold">
              {gocDangChon.danhHieu} · Hào quang{' '}
              {THONG_TIN_NGU_HANH[ngoaiHinh.haoQuang].ten}
            </div>

            <div className="mt-3 w-full text-left text-xs text-[#2B2118]/90 space-y-1">
              <div>
                <strong className="text-[#8F1F1A]">Xuất thân:</strong>{' '}
                {gocDangChon.xuatThan}
              </div>
              <div>
                <strong className="text-[#1E7F6B]">
                  Nội tại ({gocDangChon.noiTaiTen}):
                </strong>{' '}
                {gocDangChon.noiTaiMoTa}
              </div>
            </div>

            <div className="mt-4 w-full">
              <NutLenhBai
                type="button"
                kieu="vang"
                className="w-full text-base"
                onClick={xuLyXacNhan}
              >
                {cheDoChinhSua ? 'Lưu dung mạo mới' : 'Xác nhận & Khởi hành'}
              </NutLenhBai>
            </div>
          </CuonThuGiayDo>
        </div>

        {/* Bang tuy chinh */}
        <div className="lg:col-span-7 khung-ngoc-gian rounded-xl p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {(
              [
                ['coBan', 'Danh xưng & Dáng'],
                ['dungMao', 'Ngũ quan'],
                ['tocAo', 'Tóc & Đạo bào'],
                ['phapKhi', 'Pháp khí & Linh thú'],
              ] as [MucTuyChinh, string][]
            ).map(([id, nhan]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  boPhatAmThanh.phatAmNhanNut();
                  setMuc(id);
                }}
                className={`min-h-[42px] px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border transition-colors cursor-pointer ${
                  muc === id
                    ? 'bg-[#1E7F6B] border-[#62D1B5] text-[#F8F6EE]'
                    : 'bg-[#0D1424] border-[#1F2A4D] text-[#DCE6EA] hover:border-[#E4BC5A]/45'
                }`}
              >
                {nhan}
              </button>
            ))}
          </div>

          {muc === 'coBan' && (
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="ten-nhan-vat"
                  className="block text-sm font-semibold text-[#F2D88B] mb-1.5"
                >
                  Tên đạo hữu (tối đa 16 ký tự)
                </label>
                <div className="flex gap-2">
                  <input
                    id="ten-nhan-vat"
                    type="text"
                    maxLength={16}
                    value={ngoaiHinh.ten}
                    onChange={(e) => {
                      setLoiTen('');
                      setNgoaiHinh((cu) => ({ ...cu, ten: e.target.value }));
                    }}
                    placeholder="Nhập tên nhân vật..."
                    className="flex-1 min-h-[44px] px-3.5 rounded-lg bg-[#070B14] border border-[#E4BC5A]/35 text-[#DCE6EA] focus:outline-none focus:border-[#62D1B5]"
                  />
                  <NutLenhBai
                    type="button"
                    kieu="tram"
                    onClick={() => capNhat('ten', taoTenTuSiNgauNhien())}
                  >
                    Đặt ngẫu nhiên
                  </NutLenhBai>
                </div>
                {loiTen && (
                  <p className="mt-1 text-xs text-[#F28A80]">{loiTen}</p>
                )}
              </div>

              <div>
                <div className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Dáng người
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      ['thieuNien', 'Thiếu niên'],
                      ['thieuNu', 'Thiếu nữ'],
                      ['tuDo', 'Tự do'],
                    ] as [DangNguoi, string][]
                  ).map(([ma, nhan]) => (
                    <button
                      key={ma}
                      type="button"
                      onClick={() => capNhat('dangNguoi', ma)}
                      className={`min-h-[42px] rounded-lg border text-sm font-medium cursor-pointer ${
                        ngoaiHinh.dangNguoi === ma
                          ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                          : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                      }`}
                    >
                      {nhan}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Màu da (
                  {BANG_MAU_DA.find((d) => d.ma === ngoaiHinh.mauDa)?.ten || 'Tự chọn'})
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {BANG_MAU_DA.map((mau) => (
                    <button
                      key={mau.ma}
                      type="button"
                      aria-label={`Chọn màu da ${mau.ten}`}
                      onClick={() => capNhat('mauDa', mau.ma)}
                      className={`w-9 h-9 rounded-full border-2 cursor-pointer transition-transform ${
                        ngoaiHinh.mauDa === mau.ma
                          ? 'border-[#E4BC5A] scale-110'
                          : 'border-[#1F2A4D]'
                      }`}
                      style={{ backgroundColor: mau.ma }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Dáng khuôn mặt
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {KIEU_KHUON_MAT.map((km) => (
                    <button
                      key={km.ma}
                      type="button"
                      onClick={() => capNhat('kieuMat', km.ma)}
                      className={`min-h-[42px] px-3 rounded-lg border text-sm text-left cursor-pointer ${
                        ngoaiHinh.kieuMat === km.ma
                          ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                          : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                      }`}
                    >
                      {km.ten}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {muc === 'dungMao' && (
            <div className="space-y-5">
              <div>
                <div className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Kiểu mắt
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {KIEU_MAT.map((m) => (
                    <button
                      key={m.ma}
                      type="button"
                      onClick={() => capNhat('mat', m.ma)}
                      className={`min-h-[42px] px-3 rounded-lg border text-xs sm:text-sm cursor-pointer ${
                        ngoaiHinh.mat === m.ma
                          ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                          : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                      }`}
                    >
                      {m.ten}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Màu mắt (
                  {BANG_MAU_MAT.find((m) => m.ma === ngoaiHinh.mauMat)?.ten || 'Tự chọn'})
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {BANG_MAU_MAT.map((m) => (
                    <button
                      key={m.ma}
                      type="button"
                      aria-label={`Chọn màu mắt ${m.ten}`}
                      onClick={() => capNhat('mauMat', m.ma)}
                      className={`w-9 h-9 rounded-full border-2 cursor-pointer ${
                        ngoaiHinh.mauMat === m.ma
                          ? 'border-[#E4BC5A] scale-110'
                          : 'border-[#1F2A4D]'
                      }`}
                      style={{ backgroundColor: m.ma }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Lông mày
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {KIEU_LONG_MAY.map((lm) => (
                    <button
                      key={lm.ma}
                      type="button"
                      onClick={() => capNhat('longMay', lm.ma)}
                      className={`min-h-[42px] px-3 rounded-lg border text-sm cursor-pointer ${
                        ngoaiHinh.longMay === lm.ma
                          ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                          : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                      }`}
                    >
                      {lm.ten}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Miệng & thần thái
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {KIEU_MIENG.map((mg) => (
                    <button
                      key={mg.ma}
                      type="button"
                      onClick={() => capNhat('mieng', mg.ma)}
                      className={`min-h-[42px] px-3 rounded-lg border text-sm cursor-pointer ${
                        ngoaiHinh.mieng === mg.ma
                          ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                          : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                      }`}
                    >
                      {mg.ten}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Điểm nhấn khuôn mặt
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PHU_KIEN_THEM.map((pk) => (
                    <button
                      key={pk.ma}
                      type="button"
                      onClick={() => capNhat('phuKienThem', pk.ma)}
                      className={`min-h-[42px] px-3 rounded-lg border text-sm cursor-pointer ${
                        ngoaiHinh.phuKienThem === pk.ma
                          ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                          : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                      }`}
                    >
                      {pk.ten}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {muc === 'tocAo' && (
            <div className="space-y-5">
              <div>
                <div className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Kiểu tóc cổ phong
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {KIEU_TOC.map((t) => {
                    const mo = laDoMoKhoa(tienTrinh, t.moKhoaCanhGioi);
                    return (
                      <button
                        key={t.ma}
                        type="button"
                        disabled={!mo}
                        onClick={() => capNhat('toc', t.ma)}
                        className={`min-h-[42px] px-3 rounded-lg border text-xs sm:text-sm flex items-center justify-between gap-2 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                          ngoaiHinh.toc === t.ma
                            ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                            : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                        }`}
                      >
                        <span className="truncate">{t.ten}</span>
                        {!mo && <BieuTuongKhoa className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#F2D88B]">
                    Màu tóc
                  </span>
                  <input
                    type="color"
                    aria-label="Tự pha màu tóc"
                    value={ngoaiHinh.mauToc}
                    onChange={(e) => capNhat('mauToc', e.target.value)}
                    className="w-8 h-7 rounded bg-transparent cursor-pointer"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {BANG_MAU_TOC.map((m) => (
                    <button
                      key={m.ma}
                      type="button"
                      aria-label={`Màu tóc ${m.ten}`}
                      onClick={() => capNhat('mauToc', m.ma)}
                      className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
                        ngoaiHinh.mauToc.toLowerCase() === m.ma.toLowerCase()
                          ? 'border-[#E4BC5A] scale-110'
                          : 'border-[#1F2A4D]'
                      }`}
                      style={{ backgroundColor: m.ma }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Áo ngoài
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {KIEU_AO_NGOAI.map((a) => {
                    const mo = laDoMoKhoa(tienTrinh, a.moKhoaCanhGioi);
                    return (
                      <button
                        key={a.ma}
                        type="button"
                        disabled={!mo}
                        onClick={() => {
                          boPhatAmThanh.phatAmNhanNut();
                          setNgoaiHinh((cu) => ({
                            ...cu,
                            trangPhuc: { ...cu.trangPhuc, aoNgoai: a.ma },
                          }));
                        }}
                        className={`min-h-[42px] px-3 rounded-lg border text-xs sm:text-sm flex items-center justify-between gap-2 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                          ngoaiHinh.trangPhuc.aoNgoai === a.ma
                            ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                            : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                        }`}
                      >
                        <span className="truncate">{a.ten}</span>
                        {!mo && <BieuTuongKhoa className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="block text-sm font-semibold text-[#F2D88B] mb-2">
                    Màu áo chính
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {BANG_MAU_TRANG_PHUC.map((m) => (
                      <button
                        key={m.ma}
                        type="button"
                        aria-label={`Màu áo ${m.ten}`}
                        onClick={() => {
                          boPhatAmThanh.phatAmNhanNut();
                          setNgoaiHinh((cu) => ({
                            ...cu,
                            trangPhuc: { ...cu.trangPhuc, mauAoNgoai: m.ma },
                          }));
                        }}
                        className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
                          ngoaiHinh.trangPhuc.mauAoNgoai.toLowerCase() === m.ma.toLowerCase()
                            ? 'border-[#E4BC5A] scale-110'
                            : 'border-[#1F2A4D]'
                        }`}
                        style={{ backgroundColor: m.ma }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <span className="block text-sm font-semibold text-[#F2D88B] mb-2">
                    Màu viền áo
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {BANG_MAU_VIEN_AO.map((m) => (
                      <button
                        key={m.ma}
                        type="button"
                        aria-label={`Màu viền ${m.ten}`}
                        onClick={() => {
                          boPhatAmThanh.phatAmNhanNut();
                          setNgoaiHinh((cu) => ({
                            ...cu,
                            trangPhuc: { ...cu.trangPhuc, mauVienAo: m.ma },
                          }));
                        }}
                        className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
                          ngoaiHinh.trangPhuc.mauVienAo.toLowerCase() === m.ma.toLowerCase()
                            ? 'border-[#E4BC5A] scale-110'
                            : 'border-[#1F2A4D]'
                        }`}
                        style={{ backgroundColor: m.ma }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {muc === 'phapKhi' && (
            <div className="space-y-5">
              <div>
                <div className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Mũ & Trâm cài đầu
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {MU_PHU_KIEN_DAU.map((ts) => {
                    const mo = laDoMoKhoa(tienTrinh, ts.moKhoaCanhGioi);
                    return (
                      <button
                        key={ts.ma}
                        type="button"
                        disabled={!mo}
                        onClick={() => capNhat('muPhuKienDau', ts.ma)}
                        className={`min-h-[42px] px-3 rounded-lg border text-xs sm:text-sm flex items-center justify-between gap-2 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                          ngoaiHinh.muPhuKienDau === ts.ma
                            ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                            : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                        }`}
                      >
                        <span className="truncate">{ts.ten}</span>
                        {!mo && <BieuTuongKhoa className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Pháp khí cầm tay
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {PHAP_KHI_TAY.map((pk) => {
                    const mo = laDoMoKhoa(tienTrinh, pk.moKhoaCanhGioi);
                    return (
                      <button
                        key={pk.ma}
                        type="button"
                        disabled={!mo}
                        onClick={() => capNhat('phapKhi', pk.ma)}
                        className={`min-h-[42px] px-3 rounded-lg border text-xs sm:text-sm flex items-center justify-between gap-2 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                          ngoaiHinh.phapKhi === pk.ma
                            ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                            : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                        }`}
                      >
                        <span className="truncate">{pk.ten}</span>
                        {!mo && <BieuTuongKhoa className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Linh thú đồng hành
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {DANH_SACH_LINH_THU.map((lt) => {
                    const mo = laDoMoKhoa(tienTrinh, lt.moKhoaCanhGioi);
                    return (
                      <button
                        key={lt.ma}
                        type="button"
                        disabled={!mo}
                        onClick={() => capNhat('linhThu', lt.ma)}
                        className={`min-h-[42px] px-3 rounded-lg border text-xs sm:text-sm flex items-center justify-between gap-2 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                          ngoaiHinh.linhThu === lt.ma
                            ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                            : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                        }`}
                      >
                        <span className="truncate">{lt.ten}</span>
                        {!mo && <BieuTuongKhoa className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Hào quang Ngũ Hành
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {(Object.keys(THONG_TIN_NGU_HANH) as NguHanh[]).map((nh) => {
                    const tt = THONG_TIN_NGU_HANH[nh];
                    return (
                      <button
                        key={nh}
                        type="button"
                        onClick={() => capNhat('haoQuang', nh)}
                        className={`min-h-[42px] rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          ngoaiHinh.haoQuang === nh
                            ? 'bg-[#141D33] border-[#E4BC5A]'
                            : 'bg-[#070B14] border-[#1F2A4D]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: tt.mau }}
                        />
                        <span>{tt.ten}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
