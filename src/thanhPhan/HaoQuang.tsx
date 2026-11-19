import React from 'react';
import { BienTheHaoQuang, CanhGioi } from '../kieuDuLieu/troChoi';
import { layThongTinHaoQuang } from '../logic/tienTrinh';

export interface ThuocTinhHaoQuang {
  canhGioi: CanhGioi;
  cuongDo?: number;
  bienThe?: BienTheHaoQuang;
  kichCo?: 'nho' | 'vua' | 'lon';
  giamHieuUng?: boolean;
  className?: string;
}

export function layMaHaoQuangDuyNhat(
  prefix: string,
  canhGioi: CanhGioi,
  bienThe: BienTheHaoQuang,
  cuongDo: number
): string {
  const c = Math.round(Math.max(0, Math.min(1, cuongDo)) * 100);
  return `${prefix}_${canhGioi}_${bienThe}_${c}`;
}

export const HaoQuangDefs: React.FC<{
  maId: string;
  canhGioi: CanhGioi;
  cuongDo: number;
  bienThe?: BienTheHaoQuang;
}> = ({ maId, canhGioi, cuongDo, bienThe = 'macDinh' }) => {
  const tt = layThongTinHaoQuang(canhGioi, bienThe);
  const c = Math.max(0.15, Math.min(1, cuongDo));

  return (
    <defs>
      <radialGradient id={`${maId}_grad`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={tt.mauPhu} stopOpacity={0.55 * c} />
        <stop offset="48%" stopColor={tt.mauChinh} stopOpacity={0.3 * c} />
        <stop offset="100%" stopColor={tt.mauChinh} stopOpacity="0" />
      </radialGradient>
    </defs>
  );
};

export const HaoQuangLopSau: React.FC<{
  maId: string;
  canhGioi: CanhGioi;
  cuongDo: number;
  bienThe?: BienTheHaoQuang;
  giamHieuUng?: boolean;
  cx?: number;
  cy?: number;
}> = ({
  maId,
  canhGioi,
  cuongDo,
  bienThe = 'macDinh',
  giamHieuUng = false,
  cx = 110,
  cy = 128,
}) => {
  const tt = layThongTinHaoQuang(canhGioi, bienThe);
  const c = Math.max(0.15, Math.min(1, cuongDo));
  const dungTinh = giamHieuUng;
  const loai = bienThe === 'tienQuang' ? 'tienQuang' : canhGioi;

  return (
    <g
      className={dungTinh ? '' : 'anim-nhip-hao-quang'}
      opacity={0.35 + c * 0.65}
    >
      {/* Quang toan than */}
      <circle cx={cx} cy={cy} r={68 + c * 26} fill={`url(#${maId}_grad)`} />

      {loai === 'phamNhan' && (
        <g opacity={0.55 * c}>
          <path
            d={`M${cx - 58} ${cy + 14} Q${cx - 24} ${cy - 44} ${cx} ${cy - 48} Q${cx + 28} ${cy - 44} ${cx + 58} ${cy + 12}`}
            fill="none"
            stroke={tt.mauChinh}
            strokeWidth="1.6"
            strokeDasharray="6 8"
          />
        </g>
      )}

      {loai === 'luyenKhi' && (
        <g className={dungTinh ? '' : 'anim-xoay-tran'}>
          <path
            d={`M${cx - 66} ${cy + 18} C${cx - 72} ${cy - 44} ${cx + 12} ${cy - 78} ${cx + 54} ${cy - 40}`}
            fill="none"
            stroke={tt.mauPhu}
            strokeWidth="2.6"
            strokeLinecap="round"
            opacity="0.72"
          />
          <path
            d={`M${cx + 66} ${cy - 12} C${cx + 72} ${cy + 46} ${cx - 10} ${cy + 76} ${cx - 52} ${cy + 42}`}
            fill="none"
            stroke={tt.mauChinh}
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.65"
          />
          <circle
            cx={cx}
            cy={cy}
            r="68"
            fill="none"
            stroke={tt.mauPhu}
            strokeWidth="1.2"
            strokeDasharray="10 8"
            opacity="0.45"
          />
        </g>
      )}

      {loai === 'trucCo' && (
        <g>
          <g className={dungTinh ? '' : 'anim-xoay-tran'}>
            <polygon
              points={Array.from({ length: 8 }, (_, idx) => {
                const goc = (idx * Math.PI) / 4;
                return `${(cx + Math.cos(goc) * 74).toFixed(1)},${(cy + Math.sin(goc) * 74).toFixed(1)}`;
              }).join(' ')}
              fill="none"
              stroke={tt.mauChinh}
              strokeWidth="2"
              opacity="0.68"
            />
            <circle
              cx={cx}
              cy={cy}
              r="62"
              fill="none"
              stroke={tt.mauPhu}
              strokeWidth="1.5"
              strokeDasharray="4 6"
              opacity="0.6"
            />
          </g>
        </g>
      )}

      {loai === 'kimDan' && (
        <g>
          {/* Vong nhat luan Kim Dan sau lung */}
          <g className={dungTinh ? '' : 'anim-xoay-tran'}>
            <circle
              cx={cx}
              cy={cy - 18}
              r="68"
              fill="none"
              stroke={tt.mauChinh}
              strokeWidth="2.4"
              opacity="0.78"
            />
            <circle
              cx={cx}
              cy={cy - 18}
              r="56"
              fill="none"
              stroke={tt.mauPhu}
              strokeWidth="1.4"
              strokeDasharray="8 5"
              opacity="0.68"
            />
            {Array.from({ length: 8 }, (_, idx) => {
              const goc = (idx * Math.PI) / 4;
              const x1 = cx + Math.cos(goc) * 60;
              const y1 = cy - 18 + Math.sin(goc) * 60;
              const x2 = cx + Math.cos(goc) * 76;
              const y2 = cy - 18 + Math.sin(goc) * 76;
              return (
                <line
                  key={idx}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={tt.mauPhu}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  opacity="0.78"
                />
              );
            })}
          </g>
        </g>
      )}

      {loai === 'nguyenAnh' && (
        <g>
          <ellipse
            cx={cx}
            cy={cy - 78}
            rx="42"
            ry="10"
            fill="none"
            stroke={tt.mauPhu}
            strokeWidth="2.4"
            opacity="0.82"
          />
          <g className={dungTinh ? '' : 'anim-xoay-nguoc'}>
            <circle
              cx={cx}
              cy={cy - 8}
              r="76"
              fill="none"
              stroke={tt.mauChinh}
              strokeWidth="1.8"
              strokeDasharray="12 6 3 6"
              opacity="0.72"
            />
            {[0, 120, 240].map((deg) => {
              const r = (deg * Math.PI) / 180;
              const px = cx + Math.cos(r) * 76;
              const py = cy - 8 + Math.sin(r) * 76;
              return (
                <circle
                  key={deg}
                  cx={px}
                  cy={py}
                  r="4.5"
                  fill={tt.mauPhu}
                  opacity="0.85"
                />
              );
            })}
          </g>
        </g>
      )}

      {loai === 'hoaThan' && (
        <g>
          <g className={dungTinh ? '' : 'anim-xoay-tran'}>
            <circle
              cx={cx}
              cy={cy - 10}
              r="74"
              fill="none"
              stroke={tt.mauChinh}
              strokeWidth="2.5"
              opacity="0.75"
            />
            {Array.from({ length: 6 }, (_, idx) => {
              const goc = (idx * 60 * Math.PI) / 180;
              const px = cx + Math.cos(goc) * 74;
              const py = cy - 10 + Math.sin(goc) * 74;
              return (
                <path
                  key={idx}
                  d={`M${px} ${py} q6 -12 0 -20 q-6 8 0 20`}
                  fill={tt.mauPhu}
                  opacity="0.82"
                />
              );
            })}
          </g>
          <path
            d={`M${cx - 66} ${cy + 24} Q${cx - 82} ${cy - 28} ${cx - 46} ${cy - 70}`}
            fill="none"
            stroke={tt.mauChinh}
            strokeWidth="3.2"
            strokeLinecap="round"
            opacity="0.65"
          />
          <path
            d={`M${cx + 66} ${cy + 24} Q${cx + 82} ${cy - 28} ${cx + 46} ${cy - 70}`}
            fill="none"
            stroke={tt.mauPhu}
            strokeWidth="3.2"
            strokeLinecap="round"
            opacity="0.65"
          />
        </g>
      )}

      {loai === 'doKiep' && (
        <g>
          <g className={dungTinh ? '' : 'anim-xoay-nguoc'}>
            <circle
              cx={cx}
              cy={cy - 12}
              r="78"
              fill="none"
              stroke={tt.mauChinh}
              strokeWidth="2.4"
              strokeDasharray="10 4 2 4"
              opacity="0.82"
            />
          </g>
          <polyline
            points={`${cx - 82},${cy - 54} ${cx - 64},${cy - 26} ${cx - 76},${cy - 18} ${cx - 56},${cy + 14}`}
            fill="none"
            stroke={tt.mauPhu}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.88"
          />
          <polyline
            points={`${cx + 82},${cy - 54} ${cx + 64},${cy - 26} ${cx + 76},${cy - 18} ${cx + 56},${cy + 14}`}
            fill="none"
            stroke={tt.mauPhu}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.88"
          />
        </g>
      )}

      {loai === 'tienQuang' && (
        <g>
          <g className={dungTinh ? '' : 'anim-xoay-tran'}>
            <circle
              cx={cx}
              cy={cy - 14}
              r="80"
              fill="none"
              stroke="#F2D88B"
              strokeWidth="2.6"
              opacity="0.86"
            />
            <circle
              cx={cx}
              cy={cy - 14}
              r="68"
              fill="none"
              stroke="#62D1B5"
              strokeWidth="2"
              strokeDasharray="6 6"
              opacity="0.78"
            />
            {Array.from({ length: 12 }, (_, idx) => {
              const goc = (idx * Math.PI) / 6;
              const px = cx + Math.cos(goc) * 80;
              const py = cy - 14 + Math.sin(goc) * 80;
              return (
                <circle
                  key={idx}
                  cx={px}
                  cy={py}
                  r={idx % 2 === 0 ? 3.5 : 2.2}
                  fill={idx % 2 === 0 ? '#FFF1A8' : '#62D1B5'}
                />
              );
            })}
          </g>
        </g>
      )}
    </g>
  );
};

interface ToaDoHat {
  x: number;
  y: number;
  r: number;
  delay: string;
}

const HAT_LINH_KHI: ToaDoHat[] = [
  { x: 34, y: 84, r: 2.6, delay: '0s' },
  { x: 186, y: 78, r: 2.8, delay: '0.4s' },
  { x: 28, y: 152, r: 2.3, delay: '0.9s' },
  { x: 192, y: 148, r: 2.4, delay: '1.3s' },
  { x: 54, y: 42, r: 2.1, delay: '0.7s' },
  { x: 168, y: 38, r: 2.2, delay: '1.6s' },
  { x: 44, y: 192, r: 2.5, delay: '0.2s' },
  { x: 178, y: 194, r: 2.2, delay: '1.1s' },
  { x: 84, y: 28, r: 1.9, delay: '1.8s' },
  { x: 138, y: 26, r: 2.0, delay: '0.5s' },
  { x: 20, y: 118, r: 2.1, delay: '1.4s' },
  { x: 200, y: 112, r: 2.3, delay: '0.8s' },
  { x: 66, y: 214, r: 1.8, delay: '1.9s' },
  { x: 156, y: 212, r: 2.0, delay: '0.3s' },
];

export const HaoQuangLopTruoc: React.FC<{
  canhGioi: CanhGioi;
  cuongDo: number;
  bienThe?: BienTheHaoQuang;
  giamHieuUng?: boolean;
  dx?: number;
  dy?: number;
}> = ({
  canhGioi,
  cuongDo,
  bienThe = 'macDinh',
  giamHieuUng = false,
  dx = 0,
  dy = 0,
}) => {
  const tt = layThongTinHaoQuang(canhGioi, bienThe);
  const c = Math.max(0.15, Math.min(1, cuongDo));
  // Gioi han <= 14 hat nhe
  const soHat =
    canhGioi === 'phamNhan'
      ? 4
      : Math.min(14, Math.max(4, Math.round(4 + c * 10)));

  return (
    <g transform={`translate(${dx}, ${dy})`} opacity={0.35 + c * 0.65}>
      {HAT_LINH_KHI.slice(0, soHat).map((hat, idx) => (
        <circle
          key={idx}
          cx={hat.x}
          cy={hat.y}
          r={hat.r}
          fill={idx % 2 === 0 ? tt.mauPhu : tt.mauChinh}
          className={giamHieuUng ? '' : 'anim-hat-linh-khi'}
          style={giamHieuUng ? undefined : { animationDelay: hat.delay }}
        />
      ))}
    </g>
  );
};

export const HaoQuang: React.FC<ThuocTinhHaoQuang> = ({
  canhGioi,
  cuongDo = 0.8,
  bienThe = 'macDinh',
  kichCo = 'vua',
  giamHieuUng = false,
  className = '',
}) => {
  const maId = layMaHaoQuangDuyNhat('hq_doc_lap', canhGioi, bienThe, cuongDo);
  const lopKt =
    kichCo === 'nho'
      ? 'w-14 h-14'
      : kichCo === 'lon'
      ? 'w-52 h-52'
      : 'w-32 h-32';

  return (
    <svg
      viewBox="0 0 220 220"
      className={`pointer-events-none select-none ${lopKt} ${className}`}
      aria-hidden="true"
    >
      <HaoQuangDefs
        maId={maId}
        canhGioi={canhGioi}
        cuongDo={cuongDo}
        bienThe={bienThe}
      />
      <HaoQuangLopSau
        maId={maId}
        canhGioi={canhGioi}
        cuongDo={cuongDo}
        bienThe={bienThe}
        giamHieuUng={giamHieuUng}
        cx={110}
        cy={110}
      />
      <HaoQuangLopTruoc
        canhGioi={canhGioi}
        cuongDo={cuongDo}
        bienThe={bienThe}
        giamHieuUng={giamHieuUng}
      />
    </svg>
  );
};
