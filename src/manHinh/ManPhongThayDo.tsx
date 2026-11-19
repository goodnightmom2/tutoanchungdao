import React, { useState } from 'react';
import { boPhatAmThanh } from '../amThanh/boPhatAmThanh';
import { DANH_SACH_CANH_GIOI } from '../duLieu/canhGioi';
import {
  BANG_MAU_TOC,
  BANG_MAU_TRANG_PHUC,
  BANG_MAU_VIEN_AO,
  BO_TRANG_PHUC_SAN,
  DANH_SACH_LINH_THU,
  KIEU_AO_NGOAI,
  KIEU_BA_LO,
  KIEU_GIAP_VAI,
  KIEU_GIAY,
  KIEU_HO_UYEN,
  KIEU_THAT_LUNG,
  KIEU_TOC,
  KIEU_VAY_QUAN,
  MU_PHU_KIEN_DAU,
  NHAN_VAT_GOC,
  PHAP_KHI_TAY,
  THONG_TIN_NGU_HANH,
  taoNgoaiHinhNgauNhien,
} from '../duLieu/ngoaiHinh';
import {
  NgoaiHinh,
  NguHanh,
  TienTrinhNguoiChoi,
  TrangPhuc,
  TuThe,
} from '../kieuDuLieu/troChoi';
import { laDoMoKhoa } from '../logic/tienTrinh';
import { BieuTuongKhoa } from '../thanhPhan/BieuTuong';
import { CanhNenChibi } from '../thanhPhan/CanhNenChibi';
import { CuonThuGiayDo, NutLenhBai } from '../thanhPhan/KhungGiaoDien';
import { NhanVat, XemTruocMonDo } from '../thanhPhan/NhanVat';

type NhomTuDo = 'boSan' | 'aoQuan' | 'phuKienAo' | 'tocMu' | 'phapKhi';

const TU_THE_XEM_TRUOC: { ma: TuThe; nhan: string }[] = [
  { ma: 'dungYen', nhan: 'Đứng' },
  { ma: 'chiDuong', nhan: 'Chỉ đường' },
  { ma: 'di', nhan: 'Bước đi' },
  { ma: 'nhay', nhan: 'Nhảy' },
  { ma: 'tanCong', nhan: 'Xuất chiêu' },
  { ma: 'niemChu', nhan: 'Niệm chú' },
  { ma: 'ngoiThien', nhan: 'Ngồi thiền' },
];

export const ManPhongThayDo: React.FC<{
  ngoaiHinhBanDau: NgoaiHinh;
  tienTrinh: TienTrinhNguoiChoi;
  khiMacTrangPhuc: (ngoaiHinhMoi: NgoaiHinh) => void;
  khiQuayLai: () => void;
}> = ({ ngoaiHinhBanDau, tienTrinh, khiMacTrangPhuc, khiQuayLai }) => {
  const [nhBanNhap, setNhBanNhap] = useState<NgoaiHinh>(() => ({
    ...ngoaiHinhBanDau,
    trangPhuc: { ...ngoaiHinhBanDau.trangPhuc },
  }));
  const [nhom, setNhom] = useState<NhomTuDo>('boSan');
  const [tuTheXem, setTuTheXem] = useState<TuThe>('dungYen');
  const [huongXem, setHuongXem] = useState<'trai' | 'phai'>('phai');
  const [monKhoaDangThu, setMonKhoaDangThu] = useState<string | null>(null);

  const tenCanhGioi = (ma?: string) =>
    DANH_SACH_CANH_GIOI.find((c) => c.id === ma)?.ten || ma || '';

  const kiemTraKhoaHienTai = (nh: NgoaiHinh): string | null => {
    const danhSachCanCheck: { ma: string; mo?: string }[] = [
      {
        ma: nh.trangPhuc.aoNgoai,
        mo: KIEU_AO_NGOAI.find((x) => x.ma === nh.trangPhuc.aoNgoai)?.moKhoaCanhGioi,
      },
      {
        ma: nh.trangPhuc.vayQuan,
        mo: KIEU_VAY_QUAN.find((x) => x.ma === nh.trangPhuc.vayQuan)?.moKhoaCanhGioi,
      },
      {
        ma: nh.trangPhuc.giapVai,
        mo: KIEU_GIAP_VAI.find((x) => x.ma === nh.trangPhuc.giapVai)?.moKhoaCanhGioi,
      },
      {
        ma: nh.trangPhuc.hoUyen,
        mo: KIEU_HO_UYEN.find((x) => x.ma === nh.trangPhuc.hoUyen)?.moKhoaCanhGioi,
      },
      {
        ma: nh.trangPhuc.thatLung,
        mo: KIEU_THAT_LUNG.find((x) => x.ma === nh.trangPhuc.thatLung)?.moKhoaCanhGioi,
      },
      {
        ma: nh.trangPhuc.giay,
        mo: KIEU_GIAY.find((x) => x.ma === nh.trangPhuc.giay)?.moKhoaCanhGioi,
      },
      {
        ma: nh.trangPhuc.baLo,
        mo: KIEU_BA_LO.find((x) => x.ma === nh.trangPhuc.baLo)?.moKhoaCanhGioi,
      },
      {
        ma: nh.toc,
        mo: KIEU_TOC.find((x) => x.ma === nh.toc)?.moKhoaCanhGioi,
      },
      {
        ma: nh.muPhuKienDau,
        mo: MU_PHU_KIEN_DAU.find((x) => x.ma === nh.muPhuKienDau)?.moKhoaCanhGioi,
      },
      {
        ma: nh.phapKhi,
        mo: PHAP_KHI_TAY.find((x) => x.ma === nh.phapKhi)?.moKhoaCanhGioi,
      },
      {
        ma: nh.linhThu,
        mo: DANH_SACH_LINH_THU.find((x) => x.ma === nh.linhThu)?.moKhoaCanhGioi,
      },
    ];
    for (const item of danhSachCanCheck) {
      if (item.mo && !laDoMoKhoa(tienTrinh, item.mo)) {
        return `Đang mặc thử món chưa mở khóa (mở tại cảnh giới ${tenCanhGioi(item.mo)}).`;
      }
    }
    return null;
  };

  const capNhatNh = (fn: (cu: NgoaiHinh) => NgoaiHinh) => {
    boPhatAmThanh.phatAmNhanNut();
    setNhBanNhap((cu) => {
      const moi = fn(cu);
      setMonKhoaDangThu(kiemTraKhoaHienTai(moi));
      return moi;
    });
  };

  const capNhatTp = <K extends keyof TrangPhuc>(truong: K, gt: TrangPhuc[K]) => {
    capNhatNh((cu) => ({
      ...cu,
      trangPhuc: { ...cu.trangPhuc, [truong]: gt },
    }));
  };

  const datLaiMacDinh = () => {
    boPhatAmThanh.phatAmNhanNut();
    const goc =
      NHAN_VAT_GOC.find((n) => n.id === nhBanNhap.maMau) || NHAN_VAT_GOC[0];
    setNhBanNhap({
      ...goc.ngoaiHinhMacDinh,
      ten: nhBanNhap.ten,
      trangPhuc: { ...goc.ngoaiHinhMacDinh.trangPhuc },
    });
    setMonKhoaDangThu(null);
  };

  const hoanTac = () => {
    boPhatAmThanh.phatAmNhanNut();
    setNhBanNhap({
      ...ngoaiHinhBanDau,
      trangPhuc: { ...ngoaiHinhBanDau.trangPhuc },
    });
    setMonKhoaDangThu(null);
  };

  return (
    <main className="min-h-[100dvh] max-w-6xl mx-auto px-4 py-5 pb-28 md:pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="tieu-de-vang text-2xl sm:text-3xl font-bold">
            Phòng Thay Đồ Tiên Gia
          </h1>
          <p className="text-sm text-[#9BA8BE]">
            Thay áo ngoài, váy quần, giáp vai, hộ uyển, thắt lưng, giày, ba lô, tóc và pháp khí theo thời gian thực.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <NutLenhBai
            type="button"
            kieu="tram"
            onClick={() => {
              boPhatAmThanh.phatAmNhanNut();
              setNhBanNhap(taoNgoaiHinhNgauNhien(nhBanNhap.maMau));
              setMonKhoaDangThu(null);
            }}
          >
            Ngẫu nhiên
          </NutLenhBai>
          <NutLenhBai type="button" kieu="tram" onClick={datLaiMacDinh}>
            Đặt lại
          </NutLenhBai>
          <NutLenhBai type="button" kieu="tram" onClick={hoanTac}>
            Hoàn tác
          </NutLenhBai>
          <NutLenhBai type="button" kieu="tram" onClick={khiQuayLai}>
            Quay lại
          </NutLenhBai>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Ben trai: Canh chibi & Nhan vat xoay/doi tu the */}
        <div className="lg:col-span-5 lg:sticky lg:top-6">
          <CuonThuGiayDo className="text-center">
            <div className="relative rounded-xl overflow-hidden border-2 border-[#B98B2E]/60">
              <CanhNenChibi
                canhGioi={tienTrinh.canhGioiHienTai}
                className="w-full h-72 sm:h-80"
              />
              <div className="absolute inset-x-0 bottom-3 flex flex-col items-center justify-end pointer-events-none">
                <NhanVat
                  ngoaiHinh={nhBanNhap}
                  tuThe={tuTheXem}
                  huong={huongXem}
                  kichCo="lon"
                  canhGioi={tienTrinh.canhGioiHienTai}
                />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              {TU_THE_XEM_TRUOC.map((t) => (
                <button
                  key={t.ma}
                  type="button"
                  onClick={() => {
                    boPhatAmThanh.phatAmNhanNut();
                    setTuTheXem(t.ma);
                  }}
                  className={`min-h-[34px] px-2.5 rounded-md border text-xs font-semibold cursor-pointer ${
                    tuTheXem === t.ma
                      ? 'bg-[#1E7F6B] border-[#0E4A3E] text-[#F8F6EE]'
                      : 'bg-[#FFFDF8]/80 border-[#B98B2E]/40 text-[#2B2118]'
                  }`}
                >
                  {t.nhan}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  boPhatAmThanh.phatAmNhanNut();
                  setHuongXem((h) => (h === 'phai' ? 'trai' : 'phai'));
                }}
                className="min-h-[34px] px-2.5 rounded-md border border-[#B98B2E]/50 bg-[#141D33] text-[#F2D88B] text-xs font-semibold cursor-pointer"
              >
                {huongXem === 'phai' ? 'Hướng phải' : 'Hướng trái'}
              </button>
            </div>

            {monKhoaDangThu && (
              <div className="mt-3 rounded-lg bg-[#C8372D]/15 border border-[#C8372D]/50 px-3 py-2 text-xs text-[#6E1A15] font-medium">
                {monKhoaDangThu}
              </div>
            )}

            <div className="mt-4">
              <NutLenhBai
                type="button"
                kieu="vang"
                disabled={Boolean(monKhoaDangThu)}
                className="w-full text-base"
                onClick={() => {
                  boPhatAmThanh.phatAmNgoDao();
                  khiMacTrangPhuc(nhBanNhap);
                }}
              >
                Mặc bộ này & Lưu thay đổi
              </NutLenhBai>
            </div>
          </CuonThuGiayDo>
        </div>

        {/* Ben phai: Cac nhom mon do SVG */}
        <div className="lg:col-span-7 khung-ngoc-gian rounded-xl p-4 sm:p-5 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {(
              [
                ['boSan', 'Bộ sẵn'],
                ['aoQuan', 'Áo & Váy quần'],
                ['phuKienAo', 'Giáp, Giày, Ba lô'],
                ['tocMu', 'Tóc & Mũ trâm'],
                ['phapKhiMau', 'Pháp khí & Linh thú'],
              ] as [NhomTuDo, string][]
            ).map(([id, nhan]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  boPhatAmThanh.phatAmNhanNut();
                  setNhom(id);
                }}
                className={`min-h-[42px] px-2.5 py-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                  nhom === id
                    ? 'bg-[#1E7F6B] border-[#62D1B5] text-[#F8F6EE]'
                    : 'bg-[#0D1424] border-[#1F2A4D] text-[#DCE6EA] hover:border-[#E4BC5A]/45'
                }`}
              >
                {nhan}
              </button>
            ))}
          </div>

          {nhom === 'boSan' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BO_TRANG_PHUC_SAN.map((bo) => {
                const mo = laDoMoKhoa(tienTrinh, bo.moKhoaCanhGioi);
                const dangMac =
                  nhBanNhap.trangPhuc.aoNgoai === bo.trangPhuc.aoNgoai &&
                  nhBanNhap.trangPhuc.vayQuan === bo.trangPhuc.vayQuan &&
                  nhBanNhap.trangPhuc.mauAoNgoai === bo.trangPhuc.mauAoNgoai;
                return (
                  <button
                    key={bo.ma}
                    type="button"
                    onClick={() =>
                      capNhatNh((cu) => ({
                        ...cu,
                        trangPhuc: { ...bo.trangPhuc },
                        muPhuKienDau: bo.muPhuKienDau || cu.muPhuKienDau,
                        phapKhi: bo.phapKhi || cu.phapKhi,
                      }))
                    }
                    className={`rounded-xl border p-3 text-left flex items-center gap-3 cursor-pointer transition-all ${
                      dangMac
                        ? 'bg-[#1E7F6B]/25 border-[#E4BC5A]'
                        : 'bg-[#070B14]/85 border-[#1F2A4D] hover:border-[#E4BC5A]/45'
                    }`}
                  >
                    <div className="shrink-0 bg-[#141D33] rounded-lg p-1.5 border border-[#1F2A4D]">
                      <XemTruocMonDo
                        ngoaiHinh={{
                          ...nhBanNhap,
                          trangPhuc: bo.trangPhuc,
                        }}
                        loai="aoNgoai"
                        ma={bo.trangPhuc.aoNgoai}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <div className="text-sm font-bold text-[#F2D88B] truncate">
                          {bo.ten}
                        </div>
                        {!mo && <BieuTuongKhoa className="w-3.5 h-3.5 text-[#F28A80] shrink-0" />}
                      </div>
                      <p className="text-xs text-[#9BA8BE] line-clamp-2 mt-0.5">
                        {bo.moTa}
                      </p>
                      {!mo && (
                        <div className="text-[11px] text-[#F28A80] mt-1">
                          Mở tại cảnh giới {tenCanhGioi(bo.moKhoaCanhGioi)} (có thể mặc thử)
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {nhom === 'aoQuan' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Áo ngoài ({KIEU_AO_NGOAI.length} kiểu)
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {KIEU_AO_NGOAI.map((a) => {
                    const mo = laDoMoKhoa(tienTrinh, a.moKhoaCanhGioi);
                    const chon = nhBanNhap.trangPhuc.aoNgoai === a.ma;
                    return (
                      <button
                        key={a.ma}
                        type="button"
                        onClick={() => capNhatTp('aoNgoai', a.ma)}
                        className={`rounded-lg border p-2 text-center flex flex-col items-center gap-1 cursor-pointer ${
                          chon
                            ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                            : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                        }`}
                      >
                        <XemTruocMonDo ngoaiHinh={nhBanNhap} loai="aoNgoai" ma={a.ma} />
                        <span className="text-[11px] leading-tight line-clamp-2">
                          {a.ten}
                        </span>
                        {!mo && <BieuTuongKhoa className="w-3 h-3 text-[#F28A80]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#F2D88B]">
                      Màu áo ngoài
                    </span>
                    <input
                      type="color"
                      aria-label="Chọn màu áo ngoài"
                      value={nhBanNhap.trangPhuc.mauAoNgoai}
                      onChange={(e) => capNhatTp('mauAoNgoai', e.target.value)}
                      className="w-7 h-6 bg-transparent cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {BANG_MAU_TRANG_PHUC.map((m) => (
                      <button
                        key={m.ma}
                        type="button"
                        aria-label={`Màu áo ${m.ten}`}
                        onClick={() => capNhatTp('mauAoNgoai', m.ma)}
                        className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
                          nhBanNhap.trangPhuc.mauAoNgoai.toLowerCase() === m.ma.toLowerCase()
                            ? 'border-[#E4BC5A] scale-110'
                            : 'border-[#1F2A4D]'
                        }`}
                        style={{ backgroundColor: m.ma }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#F2D88B]">
                      Màu viền áo
                    </span>
                    <input
                      type="color"
                      aria-label="Chọn màu viền áo"
                      value={nhBanNhap.trangPhuc.mauVienAo}
                      onChange={(e) => capNhatTp('mauVienAo', e.target.value)}
                      className="w-7 h-6 bg-transparent cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {BANG_MAU_VIEN_AO.map((m) => (
                      <button
                        key={m.ma}
                        type="button"
                        aria-label={`Màu viền ${m.ten}`}
                        onClick={() => capNhatTp('mauVienAo', m.ma)}
                        className={`w-7 h-7 rounded-full border-2 cursor-pointer ${
                          nhBanNhap.trangPhuc.mauVienAo.toLowerCase() === m.ma.toLowerCase()
                            ? 'border-[#E4BC5A] scale-110'
                            : 'border-[#1F2A4D]'
                        }`}
                        style={{ backgroundColor: m.ma }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Quần & Váy ({KIEU_VAY_QUAN.length} kiểu)
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {KIEU_VAY_QUAN.map((q) => {
                    const mo = laDoMoKhoa(tienTrinh, q.moKhoaCanhGioi);
                    const chon = nhBanNhap.trangPhuc.vayQuan === q.ma;
                    return (
                      <button
                        key={q.ma}
                        type="button"
                        onClick={() => capNhatTp('vayQuan', q.ma)}
                        className={`rounded-lg border p-2 text-center flex flex-col items-center gap-1 cursor-pointer ${
                          chon
                            ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                            : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                        }`}
                      >
                        <XemTruocMonDo ngoaiHinh={nhBanNhap} loai="vayQuan" ma={q.ma} />
                        <span className="text-[11px] leading-tight line-clamp-2">
                          {q.ten}
                        </span>
                        {!mo && <BieuTuongKhoa className="w-3 h-3 text-[#F28A80]" />}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-[#9BA8BE]">Màu váy/quần:</span>
                  {BANG_MAU_TRANG_PHUC.map((m) => (
                    <button
                      key={m.ma}
                      type="button"
                      aria-label={`Màu váy quần ${m.ten}`}
                      onClick={() => capNhatTp('mauVayQuan', m.ma)}
                      className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                        nhBanNhap.trangPhuc.mauVayQuan.toLowerCase() === m.ma.toLowerCase()
                          ? 'border-[#E4BC5A] scale-110'
                          : 'border-[#1F2A4D]'
                      }`}
                      style={{ backgroundColor: m.ma }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {nhom === 'phuKienAo' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Giáp vai & Hộ uyển
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {KIEU_GIAP_VAI.map((g) => (
                    <button
                      key={g.ma}
                      type="button"
                      onClick={() => capNhatTp('giapVai', g.ma)}
                      className={`rounded-lg border p-2 text-center flex flex-col items-center gap-1 cursor-pointer ${
                        nhBanNhap.trangPhuc.giapVai === g.ma
                          ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                          : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                      }`}
                    >
                      <XemTruocMonDo ngoaiHinh={nhBanNhap} loai="giapVai" ma={g.ma} />
                      <span className="text-[11px]">{g.ten}</span>
                    </button>
                  ))}
                  {KIEU_HO_UYEN.map((h) => (
                    <button
                      key={h.ma}
                      type="button"
                      onClick={() => capNhatTp('hoUyen', h.ma)}
                      className={`rounded-lg border p-2 text-center flex flex-col items-center gap-1 cursor-pointer ${
                        nhBanNhap.trangPhuc.hoUyen === h.ma
                          ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                          : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                      }`}
                    >
                      <XemTruocMonDo ngoaiHinh={nhBanNhap} loai="hoUyen" ma={h.ma} />
                      <span className="text-[11px]">{h.ten}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Thắt lưng & Ủng / Giày
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {KIEU_THAT_LUNG.map((tl) => (
                    <button
                      key={tl.ma}
                      type="button"
                      onClick={() => capNhatTp('thatLung', tl.ma)}
                      className={`rounded-lg border p-2 text-center flex flex-col items-center gap-1 cursor-pointer ${
                        nhBanNhap.trangPhuc.thatLung === tl.ma
                          ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                          : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                      }`}
                    >
                      <XemTruocMonDo ngoaiHinh={nhBanNhap} loai="thatLung" ma={tl.ma} />
                      <span className="text-[11px]">{tl.ten}</span>
                    </button>
                  ))}
                  {KIEU_GIAY.map((gi) => (
                    <button
                      key={gi.ma}
                      type="button"
                      onClick={() => capNhatTp('giay', gi.ma)}
                      className={`rounded-lg border p-2 text-center flex flex-col items-center gap-1 cursor-pointer ${
                        nhBanNhap.trangPhuc.giay === gi.ma
                          ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                          : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                      }`}
                    >
                      <XemTruocMonDo ngoaiHinh={nhBanNhap} loai="giay" ma={gi.ma} />
                      <span className="text-[11px]">{gi.ten}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Ba lô & Túi sau lưng
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {KIEU_BA_LO.map((bl) => (
                    <button
                      key={bl.ma}
                      type="button"
                      onClick={() => capNhatTp('baLo', bl.ma)}
                      className={`rounded-lg border p-2 text-center flex flex-col items-center gap-1 cursor-pointer ${
                        nhBanNhap.trangPhuc.baLo === bl.ma
                          ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                          : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                      }`}
                    >
                      <XemTruocMonDo ngoaiHinh={nhBanNhap} loai="baLo" ma={bl.ma} />
                      <span className="text-[11px]">{bl.ten}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {nhom === 'tocMu' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Kiểu tóc
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {KIEU_TOC.map((t) => {
                    const mo = laDoMoKhoa(tienTrinh, t.moKhoaCanhGioi);
                    return (
                      <button
                        key={t.ma}
                        type="button"
                        onClick={() => capNhatNh((cu) => ({ ...cu, toc: t.ma }))}
                        className={`rounded-lg border p-2 text-center flex flex-col items-center gap-1 cursor-pointer ${
                          nhBanNhap.toc === t.ma
                            ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                            : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                        }`}
                      >
                        <XemTruocMonDo ngoaiHinh={nhBanNhap} loai="toc" ma={t.ma} />
                        <span className="text-[11px]">{t.ten}</span>
                        {!mo && <BieuTuongKhoa className="w-3 h-3 text-[#F28A80]" />}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-[#9BA8BE]">Màu tóc:</span>
                  {BANG_MAU_TOC.map((m) => (
                    <button
                      key={m.ma}
                      type="button"
                      aria-label={`Màu tóc ${m.ten}`}
                      onClick={() => capNhatNh((cu) => ({ ...cu, mauToc: m.ma }))}
                      className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                        nhBanNhap.mauToc.toLowerCase() === m.ma.toLowerCase()
                          ? 'border-[#E4BC5A] scale-110'
                          : 'border-[#1F2A4D]'
                      }`}
                      style={{ backgroundColor: m.ma }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Mũ ngọc quan, trâm cài & hoa cài tóc
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MU_PHU_KIEN_DAU.map((mu) => {
                    const mo = laDoMoKhoa(tienTrinh, mu.moKhoaCanhGioi);
                    return (
                      <button
                        key={mu.ma}
                        type="button"
                        onClick={() =>
                          capNhatNh((cu) => ({ ...cu, muPhuKienDau: mu.ma }))
                        }
                        className={`rounded-lg border p-2 text-center flex flex-col items-center gap-1 cursor-pointer ${
                          nhBanNhap.muPhuKienDau === mu.ma
                            ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                            : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                        }`}
                      >
                        <XemTruocMonDo
                          ngoaiHinh={nhBanNhap}
                          loai="muPhuKienDau"
                          ma={mu.ma}
                        />
                        <span className="text-[11px]">{mu.ten}</span>
                        {!mo && <BieuTuongKhoa className="w-3 h-3 text-[#F28A80]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {nhom === 'phapKhi' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Pháp khí cầm tay
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PHAP_KHI_TAY.map((pk) => {
                    const mo = laDoMoKhoa(tienTrinh, pk.moKhoaCanhGioi);
                    return (
                      <button
                        key={pk.ma}
                        type="button"
                        onClick={() => capNhatNh((cu) => ({ ...cu, phapKhi: pk.ma }))}
                        className={`rounded-lg border p-2 text-center flex flex-col items-center gap-1 cursor-pointer ${
                          nhBanNhap.phapKhi === pk.ma
                            ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                            : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                        }`}
                      >
                        <XemTruocMonDo ngoaiHinh={nhBanNhap} loai="phapKhi" ma={pk.ma} />
                        <span className="text-[11px]">{pk.ten}</span>
                        {!mo && <BieuTuongKhoa className="w-3 h-3 text-[#F28A80]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Linh thú đồng hành
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DANH_SACH_LINH_THU.map((lt) => {
                    const mo = laDoMoKhoa(tienTrinh, lt.moKhoaCanhGioi);
                    return (
                      <button
                        key={lt.ma}
                        type="button"
                        onClick={() => capNhatNh((cu) => ({ ...cu, linhThu: lt.ma }))}
                        className={`min-h-[44px] px-3 rounded-lg border text-xs flex items-center justify-between gap-1 cursor-pointer ${
                          nhBanNhap.linhThu === lt.ma
                            ? 'bg-[#1E7F6B]/30 border-[#62D1B5] text-[#F2D88B]'
                            : 'bg-[#070B14] border-[#1F2A4D] text-[#DCE6EA]'
                        }`}
                      >
                        <span>{lt.ten}</span>
                        {!mo && <BieuTuongKhoa className="w-3 h-3 text-[#F28A80]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-[#F2D88B] mb-2">
                  Hào quang Ngũ Hành
                </h2>
                <div className="grid grid-cols-5 gap-2">
                  {(Object.keys(THONG_TIN_NGU_HANH) as NguHanh[]).map((nh) => {
                    const tt = THONG_TIN_NGU_HANH[nh];
                    return (
                      <button
                        key={nh}
                        type="button"
                        onClick={() => capNhatNh((cu) => ({ ...cu, haoQuang: nh }))}
                        className={`min-h-[44px] rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          nhBanNhap.haoQuang === nh
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
