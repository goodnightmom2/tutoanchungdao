import React, { useEffect, useMemo, useRef, useState } from 'react';
import { boPhatAmThanh } from '../amThanh/boPhatAmThanh';
import { DANH_SACH_CANH_GIOI, layThongTinCanhGioi } from '../duLieu/canhGioi';
import { MOC_SAO_RUONG } from '../duLieu/vatPham';
import {
  CanhGioi,
  MaCanhGioi,
  TienTrinhNguoiChoi,
  TrangThaiAnhCanhGioi,
} from '../kieuDuLieu/troChoi';
import {
  demSoGiaiDoanHoanThanh,
  duDieuKienDotPha,
  khoaGiaiDoan,
  laCanhGioiDaMo,
  laGiaiDoanDaMo,
  layThongTinHaoQuang,
  THU_TU_CANH_GIOI,
  tinhCuongDoHaoQuang,
  tinhTongSao,
} from '../logic/tienTrinh';
import { AnhCanhGioi } from '../thanhPhan/AnhCanhGioi';
import {
  BieuTuongKhoa,
  BieuTuongRuong,
  BieuTuongSao,
} from '../thanhPhan/BieuTuong';
import { NutLenhBai } from '../thanhPhan/KhungGiaoDien';
import { NhanVat } from '../thanhPhan/NhanVat';

interface DiemLoTrinh {
  id: CanhGioi;
  xPct: number;
  yPx: number;
  tenNgan: string;
}

const CHIEU_CAO_BAN_DO = 3860;

const DIEM_LO_TRINH: DiemLoTrinh[] = [
  { id: 'phamNhan', xPct: 50, yPx: 3610, tenNgan: 'Phàm Nhân' },
  { id: 'luyenKhi', xPct: 31, yPx: 3140, tenNgan: 'Luyện Khí' },
  { id: 'trucCo', xPct: 69, yPx: 2650, tenNgan: 'Trúc Cơ' },
  { id: 'kimDan', xPct: 31, yPx: 2150, tenNgan: 'Kim Đan' },
  { id: 'nguyenAnh', xPct: 69, yPx: 1650, tenNgan: 'Nguyên Anh' },
  { id: 'hoaThan', xPct: 31, yPx: 1150, tenNgan: 'Hóa Thần' },
  { id: 'doKiep', xPct: 68, yPx: 670, tenNgan: 'Độ Kiếp' },
];

const DIEM_THIEN_MON = { xPct: 50, yPx: 245 };

function taoDuongCongNoi(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  const dy = (y2 - y1) * 0.45;
  return `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`;
}

export const ThienLoTuVi: React.FC<{
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
}) => {
  const tongSao = tinhTongSao(tienTrinh);
  const giamHieuUng = tienTrinh.caiDat.giamHieuUng;

  const [daoDangMoThe, setDaoDangMoThe] = useState<MaCanhGioi | null>(null);
  const [daoBiKhoaXem, setDaoBiKhoaXem] = useState<MaCanhGioi | null>(null);
  const [daoDangZoom, setDaoDangZoom] = useState<MaCanhGioi | null>(null);
  const [hienLangVanHai, setHienLangVanHai] = useState(false);

  // Trang thai bay len dao moi sau khi dot pha
  const [tienDoBay, setTienDoBay] = useState<number | null>(null);
  const [capBay, setCapBay] = useState<{
    tu: MaCanhGioi;
    den: MaCanhGioi;
  } | null>(null);

  const refsDao = useRef<Record<string, HTMLButtonElement | null>>({});
  const zoomTimerRef = useRef<number | null>(null);

  const cuonDenDao = (id: CanhGioi, muot = true) => {
    const el = refsDao.current[id];
    if (!el) return;
    el.scrollIntoView({
      behavior: muot && !giamHieuUng ? 'smooth' : 'auto',
      block: 'center',
    });
  };

  // Tu cuon toi dao hien tai / daoCuoiDaXem khi mo man hinh
  useEffect(() => {
    const mucTieu: CanhGioi =
      tienTrinh.daoCuoiDaXem || tienTrinh.canhGioiHienTai || 'luyenKhi';
    const t = window.setTimeout(() => {
      cuonDenDao(mucTieu, false);
    }, 60);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hieu ung bay doc linh mach khi vua dot pha
  useEffect(() => {
    const vuaVuot = tienTrinh.daoVuaDotPha;
    if (!vuaVuot) return;
    const idxTu = THU_TU_CANH_GIOI.indexOf(vuaVuot);
    const idxDen = Math.min(idxTu + 1, THU_TU_CANH_GIOI.length - 1);
    const den = THU_TU_CANH_GIOI[idxDen];

    if (giamHieuUng || vuaVuot === 'doKiep') {
      cuonDenDao(den, false);
      khiHoanTatHieuUngDotPha?.();
      return;
    }

    setCapBay({ tu: vuaVuot, den });
    setTienDoBay(0);
    cuonDenDao(vuaVuot, false);

    const batDau = performance.now();
    const thoiLuong = 1450;
    let raf = 0;

    const buoc = (now: number) => {
      const p = Math.min(1, (now - batDau) / thoiLuong);
      setTienDoBay(p);
      if (p < 1) {
        raf = window.requestAnimationFrame(buoc);
      } else {
        cuonDenDao(den, true);
        window.setTimeout(() => {
          setTienDoBay(null);
          setCapBay(null);
          khiHoanTatHieuUngDotPha?.();
        }, 380);
      }
    };
    raf = window.requestAnimationFrame(buoc);

    return () => window.cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tienTrinh.daoVuaDotPha]);

  useEffect(() => {
    return () => {
      if (zoomTimerRef.current) window.clearTimeout(zoomTimerRef.current);
    };
  }, []);

  const xuLyBamDao = (id: MaCanhGioi, daMo: boolean) => {
    boPhatAmThanh.phatAmNhanNut();
    khiCapNhatDaoCuoiDaXem?.(id);
    if (!daMo) {
      setDaoBiKhoaXem(id);
      return;
    }
    setDaoDangZoom(id);
    if (zoomTimerRef.current) window.clearTimeout(zoomTimerRef.current);
    zoomTimerRef.current = window.setTimeout(() => {
      setDaoDangZoom(null);
      setDaoDangMoThe(id);
    }, giamHieuUng ? 20 : 380);
  };

  // Dieu huong ban phim ArrowUp / ArrowDown giua cac dao
  const xuLyPhimDao = (e: React.KeyboardEvent, idxTrongLoTrinh: number) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const ke = DIEM_LO_TRINH[Math.min(DIEM_LO_TRINH.length - 1, idxTrongLoTrinh + 1)];
      refsDao.current[ke.id]?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const truoc = DIEM_LO_TRINH[Math.max(0, idxTrongLoTrinh - 1)];
      refsDao.current[truoc.id]?.focus();
    }
  };

  // Toa do nhan vat dang bay neu co
  const toaDoBay = useMemo(() => {
    if (tienDoBay === null || !capBay) return null;
    const pTu = DIEM_LO_TRINH.find((d) => d.id === capBay.tu);
    const pDen = DIEM_LO_TRINH.find((d) => d.id === capBay.den);
    if (!pTu || !pDen) return null;
    const t = tienDoBay;
    // Bezier / S-curve noi suy muot
    const muot = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const xPct = pTu.xPct + (pDen.xPct - pTu.xPct) * muot;
    const yPx = pTu.yPx + (pDen.yPx - pTu.yPx) * muot;
    return { xPct, yPx };
  }, [tienDoBay, capBay]);

  const thuTuHienTai = THU_TU_CANH_GIOI.indexOf(tienTrinh.canhGioiHienTai);
  const daPhiThang = Boolean(tienTrinh.danhHieuCuoi);

  const thongTinTheMo = daoDangMoThe ? layThongTinCanhGioi(daoDangMoThe) : null;
  const thongTinTheKhoa = daoBiKhoaXem ? layThongTinCanhGioi(daoBiKhoaXem) : null;

  return (
    <div className="relative max-w-4xl mx-auto px-2 sm:px-4 pb-28 md:pb-14">
      {/* Bang tieu de mo noi nho gon o dau ban do + vien sao dinh */}
      <div className="sticky top-14 z-20 pt-2 pb-2 pointer-events-none">
        <div className="flex items-center justify-between gap-2 rounded-xl border border-[#E4BC5A]/30 bg-[#070B14]/95 px-3.5 py-2 shadow-lg pointer-events-auto">
          <div className="min-w-0">
            <div className="text-[11px] text-[#62D1B5] font-medium truncate">
              Toán 10 · Chương III · Hệ thức lượng trong tam giác
            </div>
            <h1 className="tieu-de-vang text-base sm:text-xl font-bold leading-tight truncate">
              Vân Hải Đồ · Lục Đại Tiên Đảo
            </h1>
          </div>

          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E4BC5A]/45 bg-[#0D1424]/95 shrink-0"
            title="Tổng Tinh Tú đã thu thập"
          >
            <BieuTuongSao sang className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-bold text-[#F2D88B] chu-so-bang">
              {tongSao}/72 sao
            </span>
          </div>
        </div>

        {/* Dai Thien Co Truyen Am tu Quan tri vien */}
        {thongBaoQuanTri && (
          <div className="mt-1.5 rounded-xl border border-[#E4BC5A]/55 bg-[#141D33]/96 px-3.5 py-2 flex items-center justify-between gap-2 text-xs text-[#F6EEDB] shadow-md pointer-events-auto">
            <div className="min-w-0">
              <span className="font-bold text-[#F2D88B] mr-1.5">
                Thiên Cơ Truyền Âm:
              </span>
              <span>{thongBaoQuanTri}</span>
            </div>
            {khiAnThongBaoQuanTri && (
              <button
                type="button"
                onClick={khiAnThongBaoQuanTri}
                className="shrink-0 px-2 py-0.5 rounded border border-[#2C3B5E] text-[11px] text-[#9BA8BE] hover:text-white cursor-pointer"
              >
                Ẩn
              </button>
            )}
          </div>
        )}

        {/* Dai nhac che do choi thu */}
        {laKhach && (
          <div className="mt-1.5 rounded-xl border border-[#3FB59A]/50 bg-[#0D1424]/96 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#DCE6EA] shadow-md pointer-events-auto">
            <span>
              Đang chơi thử – hãy đăng ký để lưu tiến trình trên mọi thiết bị.
            </span>
            {khiMoDangKy && (
              <button
                type="button"
                onClick={khiMoDangKy}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-[#1E7F6B] border border-[#62D1B5] text-[11px] font-bold text-white hover:bg-[#25967E] cursor-pointer"
              >
                Đăng nhập / Đăng ký
              </button>
            )}
          </div>
        )}

        {/* Thuoc Tu Vi dang thanh ngang tren man hinh nho */}
        <div
          aria-label="Thước Tu Vi nhanh"
          className="md:hidden mt-1.5 flex items-center justify-between gap-1 rounded-xl border border-[#1F2A4D] bg-[#070B14]/95 px-2 py-1.5 pointer-events-auto overflow-x-auto"
        >
          {DIEM_LO_TRINH.map((d) => {
            const laPham = d.id === 'phamNhan';
            const daMo = laPham || laCanhGioiDaMo(tienTrinh, d.id as MaCanhGioi);
            const hienTai = tienTrinh.canhGioiHienTai === d.id;
            const mau = layThongTinHaoQuang(d.id).mauChinh;
            return (
              <button
                key={d.id}
                type="button"
                disabled={!daMo}
                onClick={() => {
                  boPhatAmThanh.phatAmNhanNut();
                  cuonDenDao(d.id);
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  hienTai
                    ? 'bg-[#141D33] text-[#F2D88B] border border-[#E4BC5A]/70'
                    : 'text-[#DCE6EA]/85 hover:bg-[#141D33]/60'
                }`}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: daMo ? mau : '#475569' }}
                />
                {d.tenNgan}
              </button>
            );
          })}
        </div>
      </div>

      {/* Thuoc Tu Vi ben mep phai cho may tinh / tablet */}
      <aside
        aria-label="Thước Tu Vi"
        className="hidden md:flex fixed right-3 lg:right-6 top-1/2 -translate-y-1/2 z-20 flex-col items-end gap-2 rounded-2xl border border-[#E4BC5A]/30 bg-[#070B14]/95 p-2.5 shadow-xl"
      >
        <div className="text-[10px] font-bold text-[#E4BC5A] px-1">
          Thước Tu Vi
        </div>
        <button
          type="button"
          onClick={() => {
            boPhatAmThanh.phatAmNhanNut();
            window.scrollTo({
              top: 0,
              behavior: giamHieuUng ? 'auto' : 'smooth',
            });
          }}
          className="text-[11px] font-semibold text-[#F2D88B] hover:text-white px-2 py-1 rounded-lg hover:bg-[#141D33] cursor-pointer"
        >
          Thiên Môn
        </button>
        {[...DIEM_LO_TRINH].reverse().map((d) => {
          const laPham = d.id === 'phamNhan';
          const daMo = laPham || laCanhGioiDaMo(tienTrinh, d.id as MaCanhGioi);
          const hienTai = tienTrinh.canhGioiHienTai === d.id;
          const mau = layThongTinHaoQuang(d.id).mauChinh;
          return (
            <button
              key={d.id}
              type="button"
              disabled={!daMo}
              onClick={() => {
                boPhatAmThanh.phatAmNhanNut();
                khiCapNhatDaoCuoiDaXem?.(d.id);
                cuonDenDao(d.id);
              }}
              className={`flex items-center gap-2 px-2 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                hienTai
                  ? 'bg-[#141D33] text-[#F2D88B] border border-[#E4BC5A]/65'
                  : 'text-[#DCE6EA]/85 hover:bg-[#141D33]/70'
              }`}
            >
              <span>{d.tenNgan}</span>
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor: daMo ? mau : '#475569',
                  boxShadow: hienTai ? `0 0 8px ${mau}` : undefined,
                }}
              />
            </button>
          );
        })}
      </aside>

      {/* Danh sach an ho tro trinh doc man hinh & tiep can */}
      <ul className="sr-only">
        <li>Làng Vân Hải: Điểm khởi hành Phàm Nhân</li>
        {DANH_SACH_CANH_GIOI.map((cg) => {
          const daMo = laCanhGioiDaMo(tienTrinh, cg.id);
          const soGd = demSoGiaiDoanHoanThanh(tienTrinh, cg.id);
          return (
            <li key={cg.id}>
              {cg.thuTu}. {cg.ten} ({cg.baiHoc}) -{' '}
              {daMo ? `Đã mở, hoàn thành ${soGd}/4 giai đoạn` : 'Chưa mở'}
            </li>
          );
        })}
      </ul>

      {/* Khung canh doc Thien Lo Tu Vi (cao ~5-6 man hinh) */}
      <section
        aria-label="Bản đồ Thiên Lộ Tu Vi"
        className="relative w-full rounded-2xl border border-[#E4BC5A]/30 overflow-hidden mt-1"
        style={{
          height: `${CHIEU_CAO_BAN_DO}px`,
          background:
            'linear-gradient(180deg, #F5D687 0%, #D9925F 8%, #54306D 22%, #1C234B 44%, #102542 68%, #091326 86%, #060912 100%)',
        }}
      >
        {/* Nen bau troi: rang dong o dinh, trang va sao o day (chua giu mat trang ro net) */}
        <div
          className="absolute inset-0 pointer-events-none select-none"
          aria-hidden="true"
        >
          {/* Rang dong vang kim tren dinh Thien Mon */}
          <div
            className="absolute inset-x-0 top-0 h-[520px]"
            style={{
              background:
                'radial-gradient(circle at 50% 240px, rgba(255, 244, 200, 0.72) 0%, rgba(242, 216, 139, 0.25) 42%, transparent 72%)',
            }}
          />

          {/* Mat trang tron co dinh ty le (khong bi meo tren man hinh hep) */}
          <div
            className="absolute pointer-events-none"
            style={{
              right: '8%',
              top: '3200px',
              width: '220px',
              height: '220px',
            }}
          >
            <svg viewBox="0 0 220 220" className="w-full h-full">
              <defs>
                <radialGradient id="trangThienLo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFF7DB" stopOpacity="0.92" />
                  <stop offset="48%" stopColor="#F2D88B" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#F2D88B" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="110" cy="110" r="105" fill="url(#trangThienLo)" />
              <circle cx="110" cy="110" r="40" fill="#FFF4C9" opacity="0.82" />
            </svg>
          </div>

          {/* Cac ngoi sao nho co dinh ti le tron */}
          {Array.from({ length: 28 }, (_, idx) => {
            const leftPct = ((idx * 17 + 9) % 88) + 6;
            const topPx = 1320 + ((idx * 241 + 79) % 2420);
            const sizePx = 2 + (idx % 3);
            return (
              <span
                key={idx}
                className="absolute rounded-full bg-[#FFF7DC]"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPx}px`,
                  width: `${sizePx}px`,
                  height: `${sizePx}px`,
                  opacity: 0.35 + (idx % 4) * 0.16,
                }}
              />
            );
          })}

          {/* Nui non va may troi */}
          <svg
            viewBox="0 0 1000 3860"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
          >

            {/* Day nui thuy mac lop xa */}
            <g>
              <path
                d="M0 3740 Q150 3560 320 3660 T690 3590 T1000 3640 L1000 3860 L0 3860 Z"
                fill="#070C17"
                opacity="0.92"
              />
              <path
                d="M0 2950 Q210 2780 430 2890 T810 2820 L1000 2880 L1000 3080 L0 3080 Z"
                fill="#0C1B33"
                opacity="0.45"
              />
              <path
                d="M0 1980 Q190 1830 420 1920 T840 1840 L1000 1910 L1000 2120 L0 2120 Z"
                fill="#1E183D"
                opacity="0.42"
              />
              <path
                d="M0 940 Q220 790 480 880 T880 800 L1000 870 L1000 1090 L0 1090 Z"
                fill="#4D294D"
                opacity="0.34"
              />
            </g>

            {/* May troi nhieu tang */}
            <g opacity="0.48">
              {[520, 1020, 1540, 2060, 2560, 3040, 3480].map((y, idx) => {
                const cx = idx % 2 === 0 ? 220 : 770;
                return (
                  <path
                    key={y}
                    d={`M${cx - 120} ${y} Q${cx - 60} ${y - 26} ${cx} ${y - 12} Q${cx + 58} ${y - 32} ${cx + 125} ${y} Q${cx + 150} ${y + 18} ${cx + 92} ${y + 22} L${cx - 95} ${y + 22} Q${cx - 140} ${y + 16} ${cx - 120} ${y} Z`}
                    fill={y < 900 ? '#FFF6DD' : '#CBE1EE'}
                    opacity={y < 900 ? 0.55 : 0.28}
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {/* Duong Linh Mach hinh chu S noi tu Lang Van Hai len Thien Mon */}
        <svg
          viewBox={`0 0 1000 ${CHIEU_CAO_BAN_DO}`}
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          {DIEM_LO_TRINH.map((diem, idx) => {
            const ke =
              idx < DIEM_LO_TRINH.length - 1
                ? { xPct: DIEM_LO_TRINH[idx + 1].xPct, yPx: DIEM_LO_TRINH[idx + 1].yPx }
                : DIEM_THIEN_MON;

            const x1 = diem.xPct * 10;
            const y1 = diem.yPx;
            const x2 = ke.xPct * 10;
            const y2 = ke.yPx;
            const d = taoDuongCongNoi(x1, y1, x2, y2);

            // Doan da di qua: tu phamNhan -> luyenKhi luon mo; tu dao i -> i+1 mo neu i <= thuTuHienTai - 1 hoac da dot pha dao i
            const daDiQua =
              idx === 0
                ? true
                : idx < DIEM_LO_TRINH.length - 1
                ? idx - 1 < thuTuHienTai ||
                  tienTrinh.daDotPhaQua.includes(diem.id as MaCanhGioi)
                : daPhiThang;

            return (
              <g key={diem.id}>
                {daDiQua && (
                  <path
                    d={d}
                    fill="none"
                    stroke="#E4BC5A"
                    strokeWidth={14}
                    strokeLinecap="round"
                    opacity={0.22}
                  />
                )}
                <path
                  d={d}
                  fill="none"
                  stroke={daDiQua ? '#E4BC5A' : 'rgba(138, 173, 198, 0.32)'}
                  strokeWidth={daDiQua ? 6 : 4}
                  strokeDasharray={daDiQua ? undefined : '14 14'}
                  strokeLinecap="round"
                  opacity={daDiQua ? 0.92 : 0.72}
                />
                {daDiQua && (
                  <path
                    d={d}
                    fill="none"
                    stroke="#FFF7DB"
                    strokeWidth="2.5"
                    strokeDasharray="12 22"
                    strokeLinecap="round"
                    opacity="0.62"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* 6 Ruong Co Duyen dat truc tiep tren duong linh mach sau moi dao */}
        {MOC_SAO_RUONG.map((moc, idx) => {
          const diemTruoc = DIEM_LO_TRINH[idx + 1]; // idx 0 -> sau luyenKhi (12 sao)
          const diemSau =
            idx + 2 < DIEM_LO_TRINH.length ? DIEM_LO_TRINH[idx + 2] : DIEM_THIEN_MON;
          if (!diemTruoc) return null;

          const xPct = (diemTruoc.xPct + diemSau.xPct) / 2;
          const yPx = (diemTruoc.yPx + diemSau.yPx) / 2;
          const daMo = tienTrinh.ruongMocDaMo.includes(moc);
          const sanSang = !daMo && tongSao >= moc;

          return (
            <button
              key={moc}
              type="button"
              disabled={!sanSang}
              onClick={() => {
                boPhatAmThanh.phatAmNgoDao();
                khiMoRuongMoc(moc);
              }}
              style={{
                left: `${xPct}%`,
                top: `${yPx}px`,
                transform: 'translate(-50%, -50%)',
              }}
              aria-label={`Rương Cơ Duyên mốc ${moc} sao (${
                daMo ? 'Đã mở' : sanSang ? 'Sẵn sàng mở' : `Chưa đủ ${moc} sao`
              })`}
              className={`absolute z-10 min-w-[78px] min-h-[54px] px-2.5 py-1.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer disabled:cursor-default ${
                daMo
                  ? 'bg-[#070B14]/78 border-[#3FB59A]/45 text-[#9BA8BE]'
                  : sanSang
                  ? `bg-[#1E7F6B]/90 border-[#F2D88B] text-[#FFF7DC] shadow-[0_0_24px_rgba(242,216,139,0.7)] ${
                      giamHieuUng ? '' : 'anim-rung-ruong'
                    }`
                  : 'bg-[#0D1424]/88 border-[#2C3B5E] text-[#9BA8BE]'
              }`}
            >
              <BieuTuongRuong className="w-5 h-5" />
              <span className="text-[11px] font-bold chu-so-bang mt-0.5">
                {daMo ? 'Đã mở' : sanSang ? 'Mở rương!' : `${moc} sao`}
              </span>
            </button>
          );
        })}

        {/* Thien Mon – Tien Gioi o dinh cao nhat + Chuong IV khoa */}
        <div
          style={{
            left: `${DIEM_THIEN_MON.xPct}%`,
            top: `${DIEM_THIEN_MON.yPx}px`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute z-10 flex flex-col items-center text-center w-[280px] sm:w-[340px]"
        >
          <div className="relative rounded-2xl border-2 border-[#F2D88B]/80 bg-gradient-to-b from-[#FFF6D6]/95 to-[#EAD6A5]/92 px-5 py-3.5 text-[#2B2118] shadow-[0_14px_38px_rgba(242,216,139,0.45)]">
            <svg
              viewBox="0 0 220 74"
              className="w-44 h-14 mx-auto -mt-1"
              aria-hidden="true"
            >
              <path
                d="M14 66 L26 22 Q110 4 194 22 L206 66"
                fill="none"
                stroke="#B98B2E"
                strokeWidth="4"
              />
              <path
                d="M36 66 L44 30 Q110 14 176 30 L184 66"
                fill="#8F1F1A"
                opacity="0.16"
              />
              <rect x="34" y="24" width="12" height="42" rx="2" fill="#B98B2E" />
              <rect x="174" y="24" width="12" height="42" rx="2" fill="#B98B2E" />
              <path d="M8 24 Q110 -4 212 24 L198 32 Q110 8 22 32 Z" fill="#C8372D" stroke="#4A2E20" strokeWidth="1.5" />
            </svg>
            <div className="dau-an-trang-tri text-[11px] font-bold uppercase text-[#8F1F1A]">
              Cổng Trời · Tiên Giới
            </div>
            <h2 className="font-serif text-lg font-bold text-[#2B2118]">
              Thiên Môn – Tiên Giới
            </h2>
            <p className="text-xs text-[#6B3B2A] mt-0.5">
              {daPhiThang
                ? tienTrinh.danhHieuCuoi === 'chanTien'
                  ? 'Đạo hữu đã Chứng Đạo Chân Tiên!'
                  : 'Đạo hữu đã thành tựu Tán Tiên Tự Tại!'
                : 'Hàng phục Thiên Lôi Chân Long tại Độ Kiếp để bước qua Thiên Môn.'}
            </p>
            {daPhiThang && (
              <div className="mt-2 flex justify-center">
                <AnhCanhGioi
                  ngoaiHinh={tienTrinh.ngoaiHinh}
                  canhGioi="doKiep"
                  trangThai="daDotPha"
                  bienThe="tienQuang"
                  cuongDo={1}
                  kichCo="nho"
                  giamHieuUng={giamHieuUng}
                />
              </div>
            )}
          </div>

          {/* The Chuong IV khoa gon o ben tren/ben canh Thien Mon */}
          <div className="mt-3 rounded-xl border border-dashed border-[#4C5978] bg-[#0D1424]/95 px-3.5 py-2 flex items-center gap-2.5 text-left shadow-md">
            <BieuTuongKhoa className="w-4 h-4 text-[#9BA8BE] shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#F6EEDB]">
                Chương IV – Vectơ: sắp mở
              </div>
              <div className="text-[11px] text-[#9BA8BE]">
                Tiên giới kế tiếp đang kết ấn.
              </div>
            </div>
          </div>
        </div>

        {/* Lang Van Hai (diem khoi dau Pham Nhan o day ban do) */}
        <div
          style={{
            left: `${DIEM_LO_TRINH[0].xPct}%`,
            top: `${DIEM_LO_TRINH[0].yPx}px`,
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute z-10"
        >
          <button
            ref={(el) => {
              refsDao.current.phamNhan = el;
            }}
            type="button"
            onClick={() => {
              boPhatAmThanh.phatAmNhanNut();
              khiCapNhatDaoCuoiDaXem?.('phamNhan');
              setHienLangVanHai((h) => !h);
            }}
            onKeyDown={(e) => xuLyPhimDao(e, 0)}
            className="min-w-[200px] min-h-[164px] rounded-2xl border border-[#94A3B8]/55 bg-[#0D1424]/95 p-3 flex flex-col items-center text-center shadow-xl hover:border-[#F2D88B] transition-all cursor-pointer"
          >
            <div className="-mt-3 -mb-1">
              <AnhCanhGioi
                ngoaiHinh={tienTrinh.ngoaiHinh}
                canhGioi="phamNhan"
                trangThai="daDotPha"
                cuongDo={0.6}
                kichCo="nho"
                giamHieuUng
              />
            </div>
            <div className="text-[11px] font-semibold text-[#94A3B8]">
              Khởi Nguyên · Phàm Trần
            </div>
            <div className="font-serif text-base font-bold text-[#F6EEDB]">
              Làng Vân Hải
            </div>
            <div className="text-[11px] text-[#62D1B5]">
              Nơi nhận quyển cổ thư tam giác
            </div>
          </button>

          {hienLangVanHai && (
            <div className="mt-2 rounded-xl border border-[#E4BC5A]/45 bg-[#070B14]/95 px-3 py-2 text-xs text-[#DCE6EA] max-w-[240px] mx-auto text-center shadow-lg">
              Lão Ngư Tiên Sinh & Tiểu Nón tiễn đạo hữu từ làng Vân Hải bước lên con đường Thiên Lộ Tu Vi.
            </div>
          )}
        </div>

        {/* 6 Tien Dao Canh Gioi nam doc S-curve */}
        {DANH_SACH_CANH_GIOI.map((cg, idxCg) => {
          const diem = DIEM_LO_TRINH[idxCg + 1];
          const daMo = laCanhGioiDaMo(tienTrinh, cg.id);
          const daDotPha = tienTrinh.daDotPhaQua.includes(cg.id);
          const hienTai = tienTrinh.canhGioiHienTai === cg.id;
          const trangThaiAnh: TrangThaiAnhCanhGioi = daDotPha
            ? 'daDotPha'
            : daMo
            ? 'dangTuLuyen'
            : 'chuaMo';

          const soGdXong = demSoGiaiDoanHoanThanh(tienTrinh, cg.id);
          const phanTram = Math.round((soGdXong / 4) * 100);
          let saoCanh = 0;
          cg.giaiDoan.forEach((gd) => {
            saoCanh +=
              tienTrinh.tienDoGiaiDoan[khoaGiaiDoan(cg.id, gd.ma)]?.soSao || 0;
          });

          const cuongDo = tinhCuongDoHaoQuang(tienTrinh, cg.id, trangThaiAnh);
          const mauCanh = layThongTinHaoQuang(cg.id).mauChinh;
          const dangZoom = daoDangZoom === cg.id;
          const laBayDi = capBay && capBay.tu === cg.id && tienDoBay !== null;

          // Vong tron phan tram SVG
          const rVong = 13;
          const chuViVong = 2 * Math.PI * rVong;
          const buVong = chuViVong * (1 - phanTram / 100);

          const canhTruocTen =
            idxCg > 0 ? DANH_SACH_CANH_GIOI[idxCg - 1].ten : '';

          return (
            <div
              key={cg.id}
              style={{
                left: `${diem.xPct}%`,
                top: `${diem.yPx}px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-10"
            >
              <button
                ref={(el) => {
                  refsDao.current[cg.id] = el;
                }}
                type="button"
                onClick={() => xuLyBamDao(cg.id, daMo)}
                onKeyDown={(e) => xuLyPhimDao(e, idxCg + 1)}
                aria-label={`${cg.thuTu}. Đảo ${cg.ten} · ${
                  daDotPha
                    ? 'Đã đột phá'
                    : daMo
                    ? `Đang tu luyện ${phanTram}%`
                    : `Chưa mở, cần đột phá ${canhTruocTen}`
                }`}
                className={`group relative w-[184px] sm:w-[248px] min-h-[186px] rounded-2xl border p-2.5 sm:p-3 flex flex-col items-center text-center transition-transform duration-300 cursor-pointer ${
                  dangZoom ? 'scale-108 z-20' : 'hover:scale-[1.03]'
                } ${
                  !daMo
                    ? 'bg-[#090F1E]/88 border-[#2B3755]/85 opacity-90'
                    : hienTai
                    ? 'bg-[#111B33]/92 border-[#E4BC5A] shadow-[0_14px_34px_rgba(228,188,90,0.28)]'
                    : 'bg-[#0E172B]/92 border-[#3FB59A]/65 shadow-[0_10px_28px_rgba(63,181,154,0.16)]'
                }`}
              >
                {/* Bua phong an khi chua mo */}
                {!daMo && (
                  <div className="absolute top-2 right-2 z-20 px-1.5 py-0.5 rounded bg-[#8F1F1A]/90 border border-[#F28A80]/60 text-[10px] font-bold text-[#F6EEDB] inline-flex items-center gap-1">
                    <BieuTuongKhoa className="w-3 h-3" />
                    Phong ấn
                  </div>
                )}

                {/* 3 ngoi sao ngoc khi da dot pha */}
                {daDotPha && (
                  <div
                    className="absolute top-2 right-2 z-20 flex items-center gap-0.5"
                    title="Đã đột phá cảnh giới"
                  >
                    {[1, 2, 3].map((s) => (
                      <BieuTuongSao key={s} sang className="w-3.5 h-3.5" />
                    ))}
                  </div>
                )}

                {/* Hinh AnhCanhGioi tren dao (an nhan vat khi dang bay sang dao ke) */}
                <div className="-mt-4 -mb-2 relative">
                  {laBayDi ? (
                    <div className="w-24 h-28 flex items-center justify-center opacity-35">
                      <span className="text-xs text-[#E4BC5A]">Đang phi hành...</span>
                    </div>
                  ) : (
                    <AnhCanhGioi
                      ngoaiHinh={tienTrinh.ngoaiHinh}
                      canhGioi={cg.id}
                      trangThai={trangThaiAnh}
                      cuongDo={cuongDo}
                      bienThe={
                        cg.id === 'doKiep' && daPhiThang ? 'tienQuang' : 'macDinh'
                      }
                      kichCo="nho"
                      giamHieuUng={giamHieuUng || !hienTai}
                    />
                  )}
                </div>

                {/* Bien bang treo gon duoi dao */}
                <div className="w-full rounded-xl border border-[#E4BC5A]/30 bg-[#070B14]/88 px-2.5 py-2 text-left space-y-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-5 h-5 rounded border text-[11px] font-bold inline-flex items-center justify-center shrink-0 chu-so-bang"
                          style={{
                            borderColor: daMo ? mauCanh : '#475569',
                            color: daMo ? mauCanh : '#94A3B8',
                          }}
                        >
                          {cg.thuTu}
                        </span>
                        <span className="font-serif text-sm sm:text-base font-bold text-[#F2D88B] truncate">
                          {cg.ten}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#62D1B5] truncate mt-0.5">
                        {cg.baiHoc}
                      </div>
                    </div>

                    {/* Vong tron % tien do */}
                    <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
                      <svg viewBox="0 0 32 32" className="w-8 h-8 -rotate-90" aria-hidden="true">
                        <circle
                          cx="16"
                          cy="16"
                          r={rVong}
                          fill="none"
                          stroke="#1F2A4D"
                          strokeWidth="3"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r={rVong}
                          fill="none"
                          stroke={daMo ? mauCanh : '#475569'}
                          strokeWidth="3"
                          strokeDasharray={chuViVong}
                          strokeDashoffset={buVong}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-[9px] font-bold text-[#F6EEDB] chu-so-bang">
                        {phanTram}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-0.5 border-t border-[#1F2A4D]/80">
                    <span className="inline-flex items-center gap-1 text-[#F2D88B] chu-so-bang">
                      <BieuTuongSao sang={saoCanh > 0} className="w-3.5 h-3.5" />
                      {saoCanh}/12 sao
                    </span>
                    <span
                      className={`font-semibold ${
                        !daMo
                          ? 'text-[#9BA8BE]'
                          : hienTai
                          ? 'text-[#F2D88B]'
                          : 'text-[#62D1B5]'
                      }`}
                    >
                      {!daMo
                        ? `Cần đột phá ${canhTruocTen}`
                        : hienTai
                        ? 'Bước vào →'
                        : 'Đã đột phá'}
                    </span>
                  </div>
                </div>
              </button>
            </div>
          );
        })}

        {/* Nhan vat dang bay doc linh mach sau dot pha */}
        {toaDoBay && capBay && (
          <div
            style={{
              left: `${toaDoBay.xPct}%`,
              top: `${toaDoBay.yPx}px`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute z-30 pointer-events-none"
          >
            <NhanVat
              ngoaiHinh={tienTrinh.ngoaiHinh}
              tuThe="nhay"
              kichCo="vua"
              canhGioi={tienDoBay && tienDoBay > 0.55 ? capBay.den : capBay.tu}
              cuongDoHaoQuang={0.95}
            />
          </div>
        )}
      </section>

      {/* The Canh Gioi truot len khi chon dao da mo */}
      {thongTinTheMo && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs flex items-end md:items-center justify-center p-0 md:p-4"
          onClick={() => setDaoDangMoThe(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tieu-de-the-canh-gioi"
            className="anim-truot-len-the w-full md:max-w-xl rounded-t-2xl md:rounded-2xl border border-[#E4BC5A]/60 bg-[#0D1424] p-5 shadow-2xl max-h-[88dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const daDotPha = tienTrinh.daDotPhaQua.includes(thongTinTheMo.id);
              const ttAnh: TrangThaiAnhCanhGioi = daDotPha
                ? 'daDotPha'
                : 'dangTuLuyen';
              const cuongDo = tinhCuongDoHaoQuang(
                tienTrinh,
                thongTinTheMo.id,
                ttAnh
              );
              const ttHq = layThongTinHaoQuang(
                thongTinTheMo.id,
                thongTinTheMo.id === 'doKiep' && daPhiThang
                  ? 'tienQuang'
                  : 'macDinh'
              );
              const dkDotPha = duDieuKienDotPha(tienTrinh, thongTinTheMo.id);

              return (
                <>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="text-xs font-semibold text-[#62D1B5]">
                        Tầng {thongTinTheMo.thuTu} · {thongTinTheMo.baiHoc}
                      </div>
                      <h2
                        id="tieu-de-the-canh-gioi"
                        className="tieu-de-vang text-2xl font-bold mt-0.5"
                      >
                        Đảo {thongTinTheMo.ten}{' '}
                        <span className="dau-an-trang-tri text-sm text-[#E4BC5A]">
                          · {thongTinTheMo.danhHieu}
                        </span>
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDaoDangMoThe(null)}
                      className="min-h-[36px] px-3 rounded-lg border border-[#1F2A4D] bg-[#070B14] text-xs text-[#9BA8BE] hover:text-white cursor-pointer"
                    >
                      Đóng
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-[#1F2A4D] bg-[#070B14]/80 p-3.5 mb-4">
                    <AnhCanhGioi
                      ngoaiHinh={tienTrinh.ngoaiHinh}
                      canhGioi={thongTinTheMo.id}
                      trangThai={ttAnh}
                      cuongDo={cuongDo}
                      bienThe={
                        thongTinTheMo.id === 'doKiep' && daPhiThang
                          ? 'tienQuang'
                          : 'macDinh'
                      }
                      kichCo="vua"
                      giamHieuUng={giamHieuUng}
                    />
                    <div className="flex-1 text-left space-y-1.5">
                      <div className="text-xs font-bold text-[#F2D88B]">
                        Hào quang: {ttHq.tenHaoQuang} · {ttHq.tenTuThe}
                      </div>
                      <p className="text-xs sm:text-sm text-[#DCE6EA]/90 leading-relaxed">
                        {thongTinTheMo.moTa}
                      </p>
                      <div className="text-[11px] text-[#9BA8BE]">
                        Linh khí yêu cầu đột phá:{' '}
                        <span className="text-[#62D1B5] font-semibold chu-so-bang">
                          {tienTrinh.linhKhi}/{thongTinTheMo.linhKhiCan}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 4 giai doan tom tat */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                    {thongTinTheMo.giaiDoan.map((gd) => {
                      const laBoss = gd.ma === 'dinhPhong';
                      const moGd = laBoss
                        ? dkDotPha.duDieuKien || daDotPha
                        : laGiaiDoanDaMo(tienTrinh, thongTinTheMo.id, gd.ma);
                      const tt =
                        tienTrinh.tienDoGiaiDoan[
                          khoaGiaiDoan(thongTinTheMo.id, gd.ma)
                        ];
                      const sao = tt?.soSao || 0;
                      return (
                        <div
                          key={gd.ma}
                          className={`rounded-xl border p-2.5 text-center ${
                            moGd
                              ? 'bg-[#141D33] border-[#3FB59A]/50'
                              : 'bg-[#070B14]/70 border-[#1F2A4D] opacity-65'
                          }`}
                        >
                          <div className="text-xs font-bold text-[#F6EEDB]">
                            {gd.ten}
                          </div>
                          <div className="mt-1 flex items-center justify-center gap-0.5">
                            {moGd ? (
                              [1, 2, 3].map((s) => (
                                <BieuTuongSao
                                  key={s}
                                  sang={s <= sao}
                                  className="w-3.5 h-3.5"
                                />
                              ))
                            ) : (
                              <BieuTuongKhoa className="w-3.5 h-3.5 text-[#7A89A3]" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end gap-2.5">
                    <NutLenhBai
                      type="button"
                      kieu="tram"
                      onClick={() => setDaoDangMoThe(null)}
                    >
                      Để sau
                    </NutLenhBai>
                    <NutLenhBai
                      type="button"
                      kieu="vang"
                      onClick={() => {
                        boPhatAmThanh.phatAmNhanNut();
                        const chon = thongTinTheMo.id;
                        setDaoDangMoThe(null);
                        khiChonCanhGioi(chon);
                      }}
                    >
                      Bước vào cảnh giới {thongTinTheMo.ten}
                    </NutLenhBai>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Hop thoai xem truoc dao chua mo (chi bong mo + dieu kien mo) */}
      {thongTinTheKhoa && (
        <div
          className="fixed inset-0 z-40 bg-black/72 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setDaoBiKhoaXem(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tieu-de-dao-khoa"
            className="w-full max-w-md rounded-2xl border border-[#2C3B5E] bg-[#0D1424] p-5 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F28A80] mb-1">
              <BieuTuongKhoa className="w-4 h-4" />
              Cảnh giới chưa khai mở
            </div>
            <h2
              id="tieu-de-dao-khoa"
              className="tieu-de-vang text-xl font-bold"
            >
              {thongTinTheKhoa.thuTu}. Đảo {thongTinTheKhoa.ten}{' '}
              <span className="dau-an-trang-tri text-sm">
                · {thongTinTheKhoa.danhHieu}
              </span>
            </h2>
            <div className="text-xs text-[#62D1B5] mt-0.5">
              {thongTinTheKhoa.baiHoc}
            </div>

            <div className="my-3 flex justify-center">
              <AnhCanhGioi
                ngoaiHinh={tienTrinh.ngoaiHinh}
                canhGioi={thongTinTheKhoa.id}
                trangThai="chuaMo"
                cuongDo={0.25}
                kichCo="lon"
                giamHieuUng={giamHieuUng}
              />
            </div>

            <div className="rounded-xl border border-[#1F2A4D] bg-[#070B14]/80 p-3 text-xs text-[#DCE6EA]/90 space-y-1">
              <div className="font-semibold text-[#F2D88B]">
                Hào quang dự kiến:{' '}
                {layThongTinHaoQuang(thongTinTheKhoa.id).tenHaoQuang}
              </div>
              <div>
                Điều kiện mở: Hoàn thành 3 chặng và hàng phục Yêu Vương tại{' '}
                <strong className="text-[#62D1B5]">
                  {
                    DANH_SACH_CANH_GIOI[
                      Math.max(0, thongTinTheKhoa.thuTu - 2)
                    ].ten
                  }
                </strong>
                .
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <NutLenhBai
                type="button"
                kieu="tram"
                onClick={() => setDaoBiKhoaXem(null)}
              >
                Đóng xem trước
              </NutLenhBai>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
