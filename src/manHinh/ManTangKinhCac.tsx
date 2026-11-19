import React, { useMemo, useState } from 'react';
import { boPhatAmThanh } from '../amThanh/boPhatAmThanh';
import { layThongTinCanhGioi } from '../duLieu/canhGioi';
import {
  DANH_SACH_KINH,
  TEN_MUC_KINH,
  TEN_TANG_KINH,
} from '../duLieu/tangKinhCac';
import { Kinh, MucKinh, TienTrinhNguoiChoi } from '../kieuDuLieu/troChoi';
import {
  laKinhDaMo,
  laTangDaMo,
  locVaTimKiemKinh,
  tinhTienDoTangKinhCac,
} from '../logic/tangKinhCac';
import { BieuTuongKhoa, BieuTuongLinhKhi } from '../thanhPhan/BieuTuong';
import { CongThucToan } from '../thanhPhan/CongThucToan';
import { HinhVe } from '../thanhPhan/HinhVe';
import { CuonThuGiayDo, NutLenhBai } from '../thanhPhan/KhungGiaoDien';

function moTaDieuKienMo(k: Kinh): string {
  const tenCg = layThongTinCanhGioi(k.canhGioiMo).ten;
  switch (k.dieuKienMo) {
    case 'vaoCanhGioi':
      return `Mở khi đặt chân tới đảo ${tenCg}.`;
    case 'quaTrungKy':
      return `Mở khi hoàn thành Sơ kỳ đảo ${tenCg}.`;
    case 'quaHauKy':
      return `Mở khi hoàn thành Trung kỳ đảo ${tenCg}.`;
    case 'haYeuVuong':
      return `Mở khi đánh bại Yêu Vương đảo ${tenCg}.`;
    case 'hoanThanhChuong':
      return 'Mở khi đánh bại Thiên Lôi Chân Long và hoàn thành Chương III.';
  }
}

export const ManTangKinhCac: React.FC<{
  tienTrinh: TienTrinhNguoiChoi;
  khiDocLanDau: (maKinh: string) => void;
  khiChuyenDaThuoc: (maKinh: string) => void;
  khiChuyenSoTay: (maKinh: string) => void;
}> = ({ tienTrinh, khiDocLanDau, khiChuyenDaThuoc, khiChuyenSoTay }) => {
  const [tangChon, setTangChon] = useState<number | null>(null);
  const [mucChon, setMucChon] = useState<MucKinh | 'tatCa'>('tatCa');
  const [tuKhoa, setTuKhoa] = useState('');
  const [chiSoTay, setChiSoTay] = useState(false);
  const [chiChuaThuoc, setChiChuaThuoc] = useState(false);

  // Che do On nhanh (The lat)
  const [cheDoOnNhanh, setCheDoOnNhanh] = useState(false);
  const [chiSoThe, setChiSoThe] = useState(0);
  const [daLatThe, setDaLatThe] = useState(false);

  const tienDo = useMemo(() => tinhTienDoTangKinhCac(tienTrinh), [tienTrinh]);

  const danhSachLoc = useMemo(
    () =>
      locVaTimKiemKinh(DANH_SACH_KINH, {
        tang: tangChon,
        muc: mucChon,
        tuKhoa,
        chiSoTay,
        chiChuaThuoc,
        tienTrinh,
      }),
    [tangChon, mucChon, tuKhoa, chiSoTay, chiChuaThuoc, tienTrinh]
  );

  const kinhDaMoDeOn = useMemo(
    () => danhSachLoc.filter((k) => laKinhDaMo(tienTrinh, k)),
    [danhSachLoc, tienTrinh]
  );

  const theHienTai = kinhDaMoDeOn[chiSoThe % Math.max(1, kinhDaMoDeOn.length)];

  return (
    <div className="max-w-5xl mx-auto px-4 py-5 pb-28 md:pb-12 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs text-[#62D1B5] font-semibold">
            Tàng Kinh Các · Thư viện Hệ thức lượng trong tam giác
          </div>
          <h1 className="tieu-de-vang text-2xl sm:text-3xl font-bold mt-0.5">
            Tàng Kinh Các · Thất Tầng Bảo Tháp
          </h1>
        </div>

        <NutLenhBai
          type="button"
          kieu={cheDoOnNhanh ? 'tram' : 'vang'}
          disabled={!cheDoOnNhanh && kinhDaMoDeOn.length === 0}
          onClick={() => {
            boPhatAmThanh.phatAmNhanNut();
            setCheDoOnNhanh((v) => !v);
            setChiSoThe(0);
            setDaLatThe(false);
          }}
        >
          {cheDoOnNhanh ? 'Thoát Ôn Nhanh' : `Ôn Nhanh (${kinhDaMoDeOn.length} thẻ)`}
        </NutLenhBai>
      </div>

      {/* Thanh thong ke nhanh */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="khung-ngoc-gian rounded-xl p-3 text-center">
          <div className="text-[11px] text-[#9BA8BE]">Đã mở khóa</div>
          <div className="text-lg font-bold text-[#F2D88B] chu-so-bang">
            {tienDo.daMo}/{tienDo.tongKinh}
          </div>
        </div>
        <div className="khung-ngoc-gian rounded-xl p-3 text-center">
          <div className="text-[11px] text-[#9BA8BE]">Đã lĩnh hội</div>
          <div className="text-lg font-bold text-[#62D1B5] chu-so-bang">
            {tienDo.daDoc}/{tienDo.tongKinh}
          </div>
        </div>
        <div className="khung-ngoc-gian rounded-xl p-3 text-center">
          <div className="text-[11px] text-[#9BA8BE]">Đã thuộc lòng</div>
          <div className="text-lg font-bold text-[#62D1B5] chu-so-bang">
            {tienDo.daThuoc}/{tienDo.tongKinh}
          </div>
        </div>
        <div className="khung-ngoc-gian rounded-xl p-3 text-center">
          <div className="text-[11px] text-[#9BA8BE]">Sổ Tay ghi nhớ</div>
          <div className="text-lg font-bold text-[#E4BC5A] chu-so-bang">
            {tienDo.soTay}
          </div>
        </div>
      </div>

      {/* Che do On nhanh bang the lat */}
      {cheDoOnNhanh && theHienTai ? (
        <div className="max-w-xl mx-auto space-y-4">
          <CuonThuGiayDo className="min-h-[260px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#6B3B2A]">
              <span className="font-bold">
                Thẻ {(chiSoThe % kinhDaMoDeOn.length) + 1}/{kinhDaMoDeOn.length} · Tầng {theHienTai.tang} · {TEN_MUC_KINH[theHienTai.muc]}
              </span>
              <span className="text-[#1E7F6B] font-semibold">
                {tienTrinh.tangKinhCac.daThuoc.includes(theHienTai.ma) ? 'Đã thuộc' : 'Đang ôn'}
              </span>
            </div>

            {!daLatThe ? (
              <div className="my-8 text-center space-y-3">
                <div className="dau-an-trang-tri text-xs font-bold uppercase text-[#8F1F1A]">
                  Vấn Đạo · Ôn Tập
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#2B2118]">
                  {theHienTai.tieuDe}
                </h2>
                <p className="text-xs text-[#6B3B2A]">
                  Hãy tự nhẩm lại công thức / quy tắc trong đầu trước khi lật mặt sau!
                </p>
              </div>
            ) : (
              <div className="my-4 space-y-3">
                <h3 className="font-serif text-lg font-bold text-[#2B2118]">
                  {theHienTai.tieuDe}
                </h3>
                <div className="text-sm text-[#2B2118] leading-relaxed whitespace-pre-line">
                  <CongThucToan noiDung={theHienTai.noiDung} />
                </div>
                {theHienTai.hinhVe && <HinhVe hinh={theHienTai.hinhVe} />}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#B98B2E]/35">
              <NutLenhBai
                type="button"
                kieu="ngoc"
                onClick={() => {
                  boPhatAmThanh.phatAmNhanNut();
                  setDaLatThe((v) => !v);
                }}
              >
                {daLatThe ? 'Úp lại mặt trước' : 'Lật xem nội dung'}
              </NutLenhBai>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    boPhatAmThanh.phatAmDung();
                    khiChuyenDaThuoc(theHienTai.ma);
                  }}
                  className="min-h-[40px] px-3 rounded-lg bg-[#141D33] text-[#62D1B5] text-xs font-semibold cursor-pointer"
                >
                  {tienTrinh.tangKinhCac.daThuoc.includes(theHienTai.ma)
                    ? 'Bỏ thuộc'
                    : 'Đánh dấu thuộc'}
                </button>
                <NutLenhBai
                  type="button"
                  kieu="vang"
                  onClick={() => {
                    boPhatAmThanh.phatAmNhanNut();
                    setChiSoThe((i) => (i + 1) % kinhDaMoDeOn.length);
                    setDaLatThe(false);
                  }}
                >
                  Thẻ tiếp theo
                </NutLenhBai>
              </div>
            </div>
          </CuonThuGiayDo>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-5 items-start">
          {/* Cot trai: Bao thap 7 tang SVG tuong tac */}
          <div className="khung-ngoc-gian rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#F2D88B]">Bảo Tháp 7 Tầng</h2>
              {tangChon !== null && (
                <button
                  type="button"
                  onClick={() => setTangChon(null)}
                  className="text-xs text-[#62D1B5] hover:underline cursor-pointer"
                >
                  Xem tất cả
                </button>
              )}
            </div>

            {/* Hinh ve SVG Bao thap mai cong */}
            <svg viewBox="0 0 220 90" className="w-full h-24 mx-auto" aria-hidden="true">
              <line x1="110" y1="6" x2="110" y2="20" stroke="#E4BC5A" strokeWidth="3" strokeLinecap="round" />
              <circle cx="110" cy="6" r="3.5" fill="#F2D88B" />
              <path d="M84 26 Q110 12 136 26 L130 34 H90 Z" fill="#E4BC5A" stroke="#4A2E20" strokeWidth="1.5" />
              <path d="M70 46 Q110 30 150 46 L144 54 H76 Z" fill="#3FB59A" stroke="#4A2E20" strokeWidth="1.5" />
              <path d="M56 66 Q110 48 164 66 L156 75 H64 Z" fill="#4A9BE0" stroke="#4A2E20" strokeWidth="1.5" />
              <rect x="44" y="75" width="132" height="10" rx="2" fill="#2A3759" stroke="#E4BC5A" strokeWidth="1.2" />
            </svg>

            <div className="space-y-1.5">
              {[7, 6, 5, 4, 3, 2, 1].map((tang) => {
                const daMo = laTangDaMo(tienTrinh, tang);
                const dangChon = tangChon === tang;
                const thongTin = TEN_TANG_KINH[tang];
                return (
                  <button
                    key={tang}
                    type="button"
                    onClick={() => {
                      boPhatAmThanh.phatAmNhanNut();
                      setTangChon((t) => (t === tang ? null : tang));
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                      dangChon
                        ? 'bg-[#1E7F6B]/30 border-[#E4BC5A] text-[#F2D88B]'
                        : daMo
                        ? 'bg-[#0D1424]/85 border-[#3FB59A]/40 text-[#DCE6EA] hover:border-[#E4BC5A]/60'
                        : 'bg-[#070B14]/70 border-[#1F2A4D] text-[#6E7C94]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{thongTin.ten}</div>
                      <div className="text-[10px] opacity-80 truncate">{thongTin.moTa}</div>
                    </div>
                    {!daMo && <BieuTuongKhoa className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cot phai: Bo loc & Cuon thu kinh van */}
          <div className="space-y-4">
            {/* Tim kiem & 7 muc */}
            <div className="khung-ngoc-gian rounded-xl p-3.5 space-y-3">
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  value={tuKhoa}
                  onChange={(e) => setTuKhoa(e.target.value)}
                  placeholder="Tìm kiếm công thức, định lí, ví dụ (ví dụ: côsin, Hê-rông, 120°)..."
                  aria-label="Tìm kiếm kinh văn"
                  className="flex-1 min-w-[200px] min-h-[40px] px-3 rounded-lg bg-[#070B14] border border-[#1F2A4D] text-sm text-[#DCE6EA] focus:outline-none focus:border-[#E4BC5A]"
                />
                <button
                  type="button"
                  onClick={() => setChiSoTay((v) => !v)}
                  className={`min-h-[40px] px-3 rounded-lg border text-xs font-semibold cursor-pointer ${
                    chiSoTay
                      ? 'bg-[#E4BC5A] border-[#F2D88B] text-[#070B14]'
                      : 'bg-[#0D1424] border-[#1F2A4D] text-[#DCE6EA]'
                  }`}
                >
                  Sổ Tay ({tienDo.soTay})
                </button>
                <button
                  type="button"
                  onClick={() => setChiChuaThuoc((v) => !v)}
                  className={`min-h-[40px] px-3 rounded-lg border text-xs font-semibold cursor-pointer ${
                    chiChuaThuoc
                      ? 'bg-[#1E7F6B] border-[#62D1B5] text-[#F8F6EE]'
                      : 'bg-[#0D1424] border-[#1F2A4D] text-[#DCE6EA]'
                  }`}
                >
                  Chưa thuộc
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setMucChon('tatCa')}
                  className={`min-h-[34px] px-2.5 rounded-lg border text-xs font-medium cursor-pointer ${
                    mucChon === 'tatCa'
                      ? 'bg-[#141D33] border-[#E4BC5A] text-[#F2D88B]'
                      : 'bg-[#070B14] border-[#1F2A4D] text-[#9BA8BE]'
                  }`}
                >
                  Tất cả
                </button>
                {(Object.keys(TEN_MUC_KINH) as MucKinh[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMucChon(m)}
                    className={`min-h-[34px] px-2.5 rounded-lg border text-xs font-medium cursor-pointer ${
                      mucChon === m
                        ? 'bg-[#141D33] border-[#E4BC5A] text-[#F2D88B]'
                        : 'bg-[#070B14] border-[#1F2A4D] text-[#9BA8BE]'
                    }`}
                  >
                    {TEN_MUC_KINH[m]}
                  </button>
                ))}
              </div>
            </div>

            {/* Danh sach kinh */}
            {danhSachLoc.length === 0 ? (
              <div className="khung-ngoc-gian rounded-xl p-8 text-center text-sm text-[#9BA8BE]">
                Không tìm thấy cuốn kinh nào khớp bộ lọc hiện tại.
              </div>
            ) : (
              <div className="space-y-4">
                {danhSachLoc.map((kinh) => {
                  const daMo = laKinhDaMo(tienTrinh, kinh);
                  const daDoc = tienTrinh.tangKinhCac.daDoc.includes(kinh.ma);
                  const daThuoc = tienTrinh.tangKinhCac.daThuoc.includes(kinh.ma);
                  const trongSoTay = tienTrinh.tangKinhCac.soTay.includes(kinh.ma);

                  if (!daMo) {
                    return (
                      <div
                        key={kinh.ma}
                        className="rounded-xl border border-[#1F2A4D] bg-[#0B101D]/80 p-4 flex items-center justify-between gap-3 opacity-75"
                      >
                        <div>
                          <div className="text-xs text-[#9BA8BE]">
                            Tầng {kinh.tang} · {TEN_MUC_KINH[kinh.muc]}
                          </div>
                          <div className="font-serif text-base font-bold text-[#DCE6EA] mt-0.5">
                            {kinh.tieuDe}
                          </div>
                          <div className="text-xs text-[#E4BC5A] mt-1">
                            {moTaDieuKienMo(kinh)}
                          </div>
                        </div>
                        <BieuTuongKhoa className="w-5 h-5 text-[#6E7C94] shrink-0" />
                      </div>
                    );
                  }

                  return (
                    <CuonThuGiayDo key={kinh.ma}>
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B3B2A] mb-1">
                        <span className="font-bold">
                          Tầng {kinh.tang} · {TEN_MUC_KINH[kinh.muc]}
                        </span>
                        <span className={daDoc ? 'text-[#1E7F6B] font-semibold' : 'text-[#8F1F1A] font-semibold'}>
                          {daDoc ? 'Đã lĩnh hội' : 'Mới mở (+5 Linh khí)'}
                        </span>
                      </div>

                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2B2118] mb-2">
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
                        {!daDoc && (
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
                      </div>
                    </CuonThuGiayDo>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
