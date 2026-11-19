import React from 'react';
import { MaCanhGioi } from '../kieuDuLieu/troChoi';

const MAU_TROI_CANH_GIOI: Record<MaCanhGioi, { tren: string; giua: string; trang: string }> = {
  luyenKhi: { tren: '#070B14', giua: '#101D33', trang: '#F2D88B' },
  trucCo: { tren: '#060D19', giua: '#112942', trang: '#A9DFEF' },
  kimDan: { tren: '#090D16', giua: '#1F1B2C', trang: '#F2D88B' },
  nguyenAnh: { tren: '#0A0918', giua: '#20183A', trang: '#D9C8FF' },
  hoaThan: { tren: '#0F080D', giua: '#2B161C', trang: '#FFAE82' },
  doKiep: { tren: '#070512', giua: '#1C1136', trang: '#C8B5FF' },
};

const DOM_DOM = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  cx: ((i * 117 + 90) % 1080) + 60,
  cy: ((i * 83 + 75) % 520) + 60,
  r: 2.2 + (i % 3) * 0.9,
}));

export const NenThuyMac: React.FC<{
  canhGioi?: MaCanhGioi;
  baoSam?: boolean;
}> = ({ canhGioi = 'luyenKhi', baoSam = false }) => {
  const bangMau = MAU_TROI_CANH_GIOI[canhGioi];

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 74% 16%, rgba(228,188,90,0.12) 0%, transparent 36%), linear-gradient(180deg, ${bangMau.tren} 0%, ${bangMau.giua} 55%, #070B14 100%)`,
        }}
      />

      {/* Anh trang mo, nui thuy mac & dom dom linh khi trong 1 lop SVG nhe */}
      <svg
        viewBox="0 0 1200 720"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full opacity-90"
      >
        <defs>
          <radialGradient id="anhTrang" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={bangMau.trang} stopOpacity="0.95" />
            <stop offset="55%" stopColor={bangMau.trang} stopOpacity="0.35" />
            <stop offset="100%" stopColor={bangMau.trang} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="nuiXa" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1A2642" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#070B14" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="nuiGan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#101829" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#050810" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Trang thuy mac */}
        <circle cx="940" cy="135" r="135" fill="url(#anhTrang)" />
        <circle cx="940" cy="135" r="52" fill={bangMau.trang} opacity="0.34" />

        {/* Day nui thuy mac lop xa */}
        <path
          d="M0 490 Q140 365 280 440 T560 390 T880 430 T1200 370 L1200 720 L0 720 Z"
          fill="url(#nuiXa)"
          stroke="rgba(98, 209, 181, 0.16)"
          strokeWidth="1.5"
        />
        {/* Day nui thuy mac lop gan */}
        <path
          d="M0 560 Q180 450 360 535 T740 480 T1060 540 L1200 505 L1200 720 L0 720 Z"
          fill="url(#nuiGan)"
          stroke="rgba(228, 188, 90, 0.14)"
          strokeWidth="1.2"
        />

        {/* May thuy mac */}
        <g opacity="0.32">
          <path
            d="M80 280 Q155 250 230 278 T390 272 Q435 288 370 302 L120 304 Q60 296 80 280 Z"
            fill="#DCE6EA"
          />
          <path
            d="M720 220 Q800 190 890 218 T1040 215 Q1080 232 1010 246 L760 246 Q690 236 720 220 Z"
            fill="#DCE6EA"
          />
        </g>

        {/* Dom dom linh khi */}
        {DOM_DOM.map((d) => (
          <g key={d.id}>
            <circle cx={d.cx} cy={d.cy} r={d.r * 2.8} fill="#F2D88B" opacity="0.18" />
            <circle cx={d.cx} cy={d.cy} r={d.r} fill="#F2D88B" opacity="0.72" />
          </g>
        ))}

        {/* Tia sam khi Do Kiep */}
        {(canhGioi === 'doKiep' || baoSam) && (
          <g opacity="0.32">
            <polyline
              points="210,15 182,115 218,125 170,255"
              fill="none"
              stroke="#B79CFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="980,10 1015,95 975,112 1030,220"
              fill="none"
              stroke="#B79CFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export const CuonThuGiayDo: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`relative khung-giay-do rounded-xl p-5 sm:p-6 ${className}`}>
    {/* Hoa tiet may goc bang SVG */}
    <svg
      viewBox="0 0 32 32"
      className="absolute top-1.5 left-1.5 w-5 h-5 text-[#B98B2E] opacity-75 pointer-events-none"
      aria-hidden="true"
    >
      <path d="M2 14V2H14M2 8H8V2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
    <svg
      viewBox="0 0 32 32"
      className="absolute top-1.5 right-1.5 w-5 h-5 text-[#B98B2E] opacity-75 pointer-events-none scale-x-[-1]"
      aria-hidden="true"
    >
      <path d="M2 14V2H14M2 8H8V2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
    <svg
      viewBox="0 0 32 32"
      className="absolute bottom-1.5 left-1.5 w-5 h-5 text-[#B98B2E] opacity-75 pointer-events-none scale-y-[-1]"
      aria-hidden="true"
    >
      <path d="M2 14V2H14M2 8H8V2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
    <svg
      viewBox="0 0 32 32"
      className="absolute bottom-1.5 right-1.5 w-5 h-5 text-[#B98B2E] opacity-75 pointer-events-none scale-[-1]"
      aria-hidden="true"
    >
      <path d="M2 14V2H14M2 8H8V2" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
    {children}
  </div>
);

interface ThuocTinhNutLenhBai
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  kieu?: 'ngoc' | 'vang' | 'chuSa' | 'tram';
}

export const NutLenhBai: React.FC<ThuocTinhNutLenhBai> = ({
  kieu = 'ngoc',
  className = '',
  children,
  ...props
}) => {
  const kieuLop: Record<string, string> = {
    ngoc: 'bg-gradient-to-b from-[#2A947D] to-[#176152] text-[#F8F6EE] border-[#62D1B5]/60 hover:from-[#34A88F] hover:to-[#1E7F6B]',
    vang: 'bg-gradient-to-b from-[#DFB654] to-[#A87D24] text-[#1A1308] border-[#F2D88B]/80 hover:from-[#EBC569] hover:to-[#BA8B2C]',
    chuSa: 'bg-gradient-to-b from-[#C8372D] to-[#8F1F1A] text-[#FAF4E8] border-[#F28A80]/50 hover:from-[#DA4238] hover:to-[#A42520]',
    tram: 'bg-[#141D33]/90 text-[#DCE6EA] border-[#E4BC5A]/30 hover:bg-[#1F2A4D] hover:border-[#E4BC5A]/65',
  };

  return (
    <button
      {...props}
      className={`lenh-bai-vat min-h-[44px] px-5 py-2.5 font-semibold tracking-wide border transition-all duration-150 active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer inline-flex items-center justify-center gap-2 ${kieuLop[kieu]} ${className}`}
    >
      {children}
    </button>
  );
};

export const AnTrienChuSa: React.FC<{
  chu: string;
  kichThuoc?: 'nho' | 'vua';
}> = ({ chu, kichThuoc = 'vua' }) => (
  <span
    className={`inline-flex items-center justify-center rounded-sm border-2 border-[#C8372D] bg-[#8F1F1A]/20 text-[#F4E6D4] font-bold select-none ${
      kichThuoc === 'nho' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'
    }`}
  >
    {chu}
  </span>
);

export const ThanhTruyenAm: React.FC<{ thongBao: string | null }> = ({
  thongBao,
}) => {
  if (!thongBao) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-lg border border-[#E4BC5A]/65 bg-[#0D1424]/95 text-[#F2D88B] text-sm font-medium shadow-2xl pointer-events-none"
    >
      {thongBao}
    </div>
  );
};
