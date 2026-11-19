import React from 'react';
import { MaCanhGioi } from '../kieuDuLieu/troChoi';

const SAC_TROI: Record<
  MaCanhGioi,
  { tren: string; giua: string; duoi: string; suong: string }
> = {
  luyenKhi: {
    tren: '#53B4F5',
    giua: '#94D7FA',
    duoi: '#DAF2FF',
    suong: '#FFFFFF',
  },
  trucCo: {
    tren: '#48A4EC',
    giua: '#8FD1F6',
    duoi: '#D9F4FA',
    suong: '#F4FDFF',
  },
  kimDan: {
    tren: '#5CAEEB',
    giua: '#B7DCF7',
    duoi: '#FBF1D6',
    suong: '#FFF9EC',
  },
  nguyenAnh: {
    tren: '#689FE8',
    giua: '#A8BFEF',
    duoi: '#E8E3FF',
    suong: '#F6F2FF',
  },
  hoaThan: {
    tren: '#579BE2',
    giua: '#A9C8EB',
    duoi: '#FCE2D0',
    suong: '#FFF6EE',
  },
  doKiep: {
    tren: '#3F65A6',
    giua: '#6F88BD',
    duoi: '#CBD2EC',
    suong: '#ECE9FF',
  },
};

export const CanhNenChibi: React.FC<{
  canhGioi?: MaCanhGioi;
  className?: string;
  hienHoaDaoRoi?: boolean;
}> = ({ canhGioi = 'luyenKhi', className = '', hienHoaDaoRoi = true }) => {
  const sac = SAC_TROI[canhGioi] || SAC_TROI.luyenKhi;

  return (
    <div
      className={`relative overflow-hidden select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 960 540"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full block"
      >
        <defs>
          <linearGradient id={`troi_${canhGioi}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={sac.tren} />
            <stop offset="56%" stopColor={sac.giua} />
            <stop offset="100%" stopColor={sac.duoi} />
          </linearGradient>
          <linearGradient id="mayCauVong" x1="0" y1="0" x2="1" y2="0.4">
            <stop offset="0%" stopColor="#FFE0EC" stopOpacity="0.88" />
            <stop offset="35%" stopColor="#FFF7D6" stopOpacity="0.92" />
            <stop offset="70%" stopColor="#DDF6FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="nuiChibi" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C987F" />
            <stop offset="45%" stopColor="#5C7977" />
            <stop offset="100%" stopColor="#465D67" />
          </linearGradient>
        </defs>

        {/* Bau troi xanh trong */}
        <rect x="0" y="0" width="960" height="540" fill={`url(#troi_${canhGioi})`} />

        {/* May trang anh cau vong nhat */}
        <g className="anim-troi-may">
          <path
            d="M-20 75 Q75 18 165 55 Q235 28 310 68 Q265 110 140 105 Q45 118 -20 75 Z"
            fill="url(#mayCauVong)"
          />
          <path
            d="M410 42 Q490 12 565 44 Q625 26 680 58 Q610 85 480 82 Z"
            fill="url(#mayCauVong)"
            opacity="0.86"
          />
          <path
            d="M715 72 Q795 34 885 60 Q940 38 980 78 L980 128 Q845 125 715 108 Z"
            fill="url(#mayCauVong)"
          />
        </g>

        {/* Nui da cao nho khoi bien may ben trai */}
        <g>
          <path
            d="M40 430 L105 115 Q122 86 142 115 L182 260 L205 225 L252 430 Z"
            fill="url(#nuiChibi)"
            stroke="#3B4C52"
            strokeWidth="2.2"
          />
          <path d="M122 100 L142 230 L102 275 Z" fill="#9BB597" opacity="0.45" />
          {/* Cay thong co thu tren nui */}
          <path d="M68 245 Q55 215 80 205 Q102 212 96 245 Z" fill="#46834D" stroke="#2F4A33" strokeWidth="1.5" />
          <path d="M180 280 Q168 256 196 250 Q218 258 206 284 Z" fill="#4E9454" stroke="#2F4A33" strokeWidth="1.5" />
        </g>

        {/* Dinh chua mai cong tren vach nui xa giua */}
        <g transform="translate(230, 295)">
          <path d="M5 105 L28 36 L66 38 L86 105 Z" fill="#6F868C" opacity="0.82" />
          <path d="M18 38 L46 38 L46 20 L18 20 Z" fill="#EAE0CA" stroke="#4A3429" strokeWidth="1.4" />
          <path d="M10 21 Q32 8 54 21 Z" fill="#5A7385" stroke="#4A3429" strokeWidth="1.4" />
          <path d="M14 14 Q32 4 50 14 Z" fill="#4B6375" stroke="#4A3429" strokeWidth="1.4" />
        </g>

        {/* Vach nui ben phai & dinh chua mai cong */}
        <g>
          <path
            d="M720 430 L768 220 Q825 185 895 210 L965 250 L965 440 Z"
            fill="#6C857A"
            stroke="#3B4C52"
            strokeWidth="2.2"
          />
          {/* Dinh chua ben phai */}
          <g transform="translate(762, 168)">
            <rect x="18" y="34" width="54" height="28" fill="#EFE4CC" stroke="#4A2E20" strokeWidth="1.8" />
            <rect x="34" y="42" width="18" height="20" fill="#7C5338" />
            <path d="M6 34 Q45 14 84 34 L74 37 L16 37 Z" fill="#526C80" stroke="#4A2E20" strokeWidth="1.8" />
            <path d="M14 23 Q45 6 76 23 L68 26 L22 26 Z" fill="#465E70" stroke="#4A2E20" strokeWidth="1.8" />
          </g>
          {/* Thong co thu ben phai */}
          <path d="M950 15 Q895 55 835 125" stroke="#6B442A" strokeWidth="10" fill="none" strokeLinecap="round" />
          <ellipse cx="835" cy="110" rx="44" ry="22" fill="#4C8C4E" stroke="#2F4A33" strokeWidth="1.8" />
          <ellipse cx="905" cy="70" rx="55" ry="28" fill="#5CA358" stroke="#2F4A33" strokeWidth="1.8" />
        </g>

        {/* 3 chu hac trang bay tren bau troi */}
        {[
          { x: 255, y: 118, s: 1 },
          { x: 302, y: 145, s: 0.85 },
          { x: 228, y: 175, s: 0.78 },
        ].map((h, i) => (
          <g key={i} transform={`translate(${h.x}, ${h.y}) scale(${h.s})`}>
            <path
              d="M-20 -4 Q-6 -14 4 -2 Q14 -12 24 -3"
              fill="none"
              stroke="#4A2E20"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M-18 -4 Q-4 -10 5 -2 Q14 -9 22 -3"
              fill="#FFFFFF"
              stroke="#4A2E20"
              strokeWidth="1.2"
            />
            <line x1="6" y1="-2" x2="18" y2="-1" stroke="#D85B48" strokeWidth="1.6" />
          </g>
        ))}

        {/* Bien may trang xop cuon quanh chan nui */}
        <g fill={sac.suong} opacity="0.92">
          <path d="M-20 390 Q45 340 120 375 Q185 335 265 385 Q340 350 420 395 Q510 350 610 392 Q705 348 795 390 Q885 352 980 385 L980 490 L-20 490 Z" />
          <ellipse cx="140" cy="405" rx="115" ry="38" opacity="0.85" />
          <ellipse cx="520" cy="410" rx="145" ry="36" opacity="0.8" />
          <ellipse cx="830" cy="405" rx="125" ry="42" opacity="0.85" />
        </g>

        {/* Mo da xam & bai co xanh phia truoc */}
        <path
          d="M-10 475 Q180 415 390 428 Q620 410 790 432 Q900 442 970 468 L970 545 L-10 545 Z"
          fill="#8A9298"
          stroke="#4A2E20"
          strokeWidth="2.4"
        />
        <path
          d="M80 480 Q210 442 380 452 Q530 460 660 448 L630 545 L70 545 Z"
          fill="#A1A9AE"
        />
        {/* Bai co xanh */}
        <path
          d="M-10 470 Q135 455 280 492 Q190 545 -10 545 Z"
          fill="#76BF56"
          stroke="#3E6E33"
          strokeWidth="2"
        />
        <path
          d="M685 510 Q825 462 970 482 L970 545 L660 545 Z"
          fill="#76BF56"
          stroke="#3E6E33"
          strokeWidth="2"
        />

        {/* Hoa dai: cuc trang, hoa cam, hoa hong */}
        {[
          { cx: 65, cy: 505, mau: '#FFFFFF' },
          { cx: 112, cy: 492, mau: '#FF9B42' },
          { cx: 158, cy: 515, mau: '#F68CA0' },
          { cx: 205, cy: 500, mau: '#FFFFFF' },
          { cx: 760, cy: 508, mau: '#FF9B42' },
          { cx: 815, cy: 495, mau: '#F68CA0' },
          { cx: 875, cy: 514, mau: '#FFFFFF' },
          { cx: 922, cy: 498, mau: '#F5C922' },
        ].map((f, i) => (
          <g key={i} transform={`translate(${f.cx}, ${f.cy})`}>
            <circle cx="-4.5" cy="0" r="3.5" fill={f.mau} stroke="#4A2E20" strokeWidth="0.9" />
            <circle cx="4.5" cy="0" r="3.5" fill={f.mau} stroke="#4A2E20" strokeWidth="0.9" />
            <circle cx="0" cy="-4.5" r="3.5" fill={f.mau} stroke="#4A2E20" strokeWidth="0.9" />
            <circle cx="0" cy="4.5" r="3.5" fill={f.mau} stroke="#4A2E20" strokeWidth="0.9" />
            <circle cx="0" cy="0" r="2.6" fill="#FFD43B" stroke="#4A2E20" strokeWidth="0.8" />
          </g>
        ))}

        {/* Canh hoa dao roi */}
        {hienHoaDaoRoi &&
          [
            { x: 180, y: 165, r: 22 },
            { x: 350, y: 120, r: -18 },
            { x: 520, y: 145, r: 35 },
            { x: 690, y: 205, r: -28 },
            { x: 280, y: 310, r: 15 },
            { x: 640, y: 335, r: -12 },
          ].map((p, i) => (
            <ellipse
              key={i}
              cx={p.x}
              cy={p.y}
              rx="6"
              ry="3.2"
              fill="#F7A7BA"
              stroke="#CE6C84"
              strokeWidth="0.8"
              transform={`rotate(${p.r} ${p.x} ${p.y})`}
              style={{
                animation: `hoa-dao-roi ${6 + (i % 3) * 1.5}s ease-in-out ${i * 0.7}s infinite`,
              }}
            />
          ))}
      </svg>
    </div>
  );
};
