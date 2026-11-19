import React from 'react';
import type {
  HinhVe as HinhVeData,
  HinhVeCanhThucTe,
  HinhVeNuaDuongTron,
  HinhVeTamGiac,
} from '../kieuDuLieu/troChoi';
import { Diem2D, tinhToaDoTamGiac } from '../logic/toanHoc';

function trungDiem(p1: Diem2D, p2: Diem2D): Diem2D {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

function taoCungGoc(
  dinh: Diem2D,
  p1: Diem2D,
  p2: Diem2D,
  banKinh = 22
): string {
  const a1 = Math.atan2(p1.y - dinh.y, p1.x - dinh.x);
  const a2 = Math.atan2(p2.y - dinh.y, p2.x - dinh.x);
  let delta = a2 - a1;
  while (delta > Math.PI) delta -= 2 * Math.PI;
  while (delta < -Math.PI) delta += 2 * Math.PI;
  const x1 = dinh.x + banKinh * Math.cos(a1);
  const y1 = dinh.y + banKinh * Math.sin(a1);
  const x2 = dinh.x + banKinh * Math.cos(a1 + delta);
  const y2 = dinh.y + banKinh * Math.sin(a1 + delta);
  const sweep = delta >= 0 ? 1 : 0;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${banKinh} ${banKinh} 0 0 ${sweep} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

function viTriNhanGoc(dinh: Diem2D, p1: Diem2D, p2: Diem2D, khoang = 33): Diem2D {
  const u1x = p1.x - dinh.x;
  const u1y = p1.y - dinh.y;
  const d1 = Math.hypot(u1x, u1y) || 1;
  const u2x = p2.x - dinh.x;
  const u2y = p2.y - dinh.y;
  const d2 = Math.hypot(u2x, u2y) || 1;
  const px = u1x / d1 + u2x / d2;
  const py = u1y / d1 + u2y / d2;
  const dp = Math.hypot(px, py) || 1;
  return {
    x: dinh.x + (px / dp) * khoang,
    y: dinh.y + (py / dp) * khoang,
  };
}

const VeTamGiac: React.FC<{ hinh: HinhVeTamGiac }> = ({ hinh }) => {
  const W = 320;
  const H = 220;
  const td = tinhToaDoTamGiac(hinh, W, H, 38);
  const { A, B, C } = td;
  const tam = {
    x: (A.x + B.x + C.x) / 3,
    y: (A.y + B.y + C.y) / 3,
  };

  const dayDinh = (pt: Diem2D, khoang = 16): Diem2D => {
    const dx = pt.x - tam.x;
    const dy = pt.y - tam.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: pt.x + (dx / len) * khoang, y: pt.y + (dy / len) * khoang };
  };

  const dayCanh = (p1: Diem2D, p2: Diem2D, khoang = 15): Diem2D => {
    const m = trungDiem(p1, p2);
    const dx = m.x - tam.x;
    const dy = m.y - tam.y;
    const len = Math.hypot(dx, dy) || 1;
    return { x: m.x + (dx / len) * khoang, y: m.y + (dy / len) * khoang };
  };

  const posA = dayDinh(A);
  const posB = dayDinh(B);
  const posC = dayDinh(C);

  const posCanhBC = dayCanh(B, C);
  const posCanhAC = dayCanh(A, C);
  const posCanhAB = dayCanh(A, B);

  const posGocA = viTriNhanGoc(A, B, C, 32);
  const posGocB = viTriNhanGoc(B, A, C, 34);
  const posGocC = viTriNhanGoc(C, A, B, 34);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full max-w-[340px] mx-auto h-auto select-none"
      role="img"
      aria-label={`Hình tam giác ${hinh.dinh.join('')}`}
    >
      {/* Duong tron ngoai tiep */}
      {hinh.veThem?.includes('ngoaiTiep') && (
        <g>
          <circle
            cx={td.tamNgoaiTiep.x}
            cy={td.tamNgoaiTiep.y}
            r={td.banKinhNgoaiTiep}
            fill="none"
            stroke="#62D1B5"
            strokeWidth="1.4"
            strokeDasharray="5 4"
            opacity="0.85"
          />
          <line
            x1={td.tamNgoaiTiep.x}
            y1={td.tamNgoaiTiep.y}
            x2={B.x}
            y2={B.y}
            stroke="#62D1B5"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <circle cx={td.tamNgoaiTiep.x} cy={td.tamNgoaiTiep.y} r="3" fill="#62D1B5" />
          <text
            x={td.tamNgoaiTiep.x + 8}
            y={td.tamNgoaiTiep.y - 4}
            fill="#62D1B5"
            fontSize="11"
            fontWeight="600"
          >
            O
          </text>
        </g>
      )}

      {/* Duong tron noi tiep */}
      {hinh.veThem?.includes('noiTiep') && (
        <g>
          <circle
            cx={td.tamNoiTiep.x}
            cy={td.tamNoiTiep.y}
            r={td.banKinhNoiTiep}
            fill="rgba(63,181,154,0.12)"
            stroke="#62D1B5"
            strokeWidth="1.5"
          />
          <line
            x1={td.tamNoiTiep.x}
            y1={td.tamNoiTiep.y}
            x2={td.tamNoiTiep.x}
            y2={B.y}
            stroke="#F2D88B"
            strokeWidth="1.2"
            strokeDasharray="3 3"
          />
          <circle cx={td.tamNoiTiep.x} cy={td.tamNoiTiep.y} r="2.8" fill="#E4BC5A" />
          <text
            x={td.tamNoiTiep.x + 6}
            y={td.tamNoiTiep.y - 5}
            fill="#F2D88B"
            fontSize="11"
            fontWeight="600"
          >
            r
          </text>
        </g>
      )}

      {/* To mau tam giac */}
      <polygon
        points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
        fill="rgba(63, 181, 154, 0.14)"
        stroke="#E4BC5A"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Canh can tinh noi bat */}
      {hinh.canhCanTinh === 0 && (
        <line x1={B.x} y1={B.y} x2={C.x} y2={C.y} stroke="#C8372D" strokeWidth="2.8" strokeDasharray="6 3" />
      )}
      {hinh.canhCanTinh === 1 && (
        <line x1={A.x} y1={A.y} x2={C.x} y2={C.y} stroke="#C8372D" strokeWidth="2.8" strokeDasharray="6 3" />
      )}
      {hinh.canhCanTinh === 2 && (
        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#C8372D" strokeWidth="2.8" strokeDasharray="6 3" />
      )}

      {/* Trung tuyen tu A */}
      {hinh.veThem?.includes('trungTuyenA') && (
        <g>
          <line
            x1={A.x}
            y1={A.y}
            x2={td.trungDiemBC.x}
            y2={td.trungDiemBC.y}
            stroke="#62D1B5"
            strokeWidth="1.8"
            strokeDasharray="5 3"
          />
          <circle cx={td.trungDiemBC.x} cy={td.trungDiemBC.y} r="3" fill="#62D1B5" />
          <text
            x={td.trungDiemBC.x}
            y={td.trungDiemBC.y + 15}
            fill="#62D1B5"
            fontSize="11"
            textAnchor="middle"
            fontWeight="600"
          >
            M
          </text>
        </g>
      )}

      {/* Duong cao tu A */}
      {hinh.veThem?.includes('duongCaoA') && (
        <g>
          <line
            x1={A.x}
            y1={A.y}
            x2={td.chanDuongCaoA.x}
            y2={td.chanDuongCaoA.y}
            stroke="#B79CFF"
            strokeWidth="1.6"
            strokeDasharray="4 3"
          />
          <rect
            x={td.chanDuongCaoA.x}
            y={td.chanDuongCaoA.y - 8}
            width="8"
            height="8"
            fill="none"
            stroke="#B79CFF"
            strokeWidth="1.2"
          />
        </g>
      )}

      {/* Cung goc */}
      {hinh.hienGoc?.[0] && (
        <path
          d={taoCungGoc(A, B, C, 20)}
          fill="none"
          stroke={hinh.gocCanTinh === 0 ? '#C8372D' : '#62D1B5'}
          strokeWidth="1.6"
        />
      )}
      {hinh.hienGoc?.[1] && (
        <path
          d={taoCungGoc(B, A, C, 20)}
          fill="none"
          stroke={hinh.gocCanTinh === 1 ? '#C8372D' : '#62D1B5'}
          strokeWidth="1.6"
        />
      )}
      {hinh.hienGoc?.[2] && (
        <path
          d={taoCungGoc(C, A, B, 20)}
          fill="none"
          stroke={hinh.gocCanTinh === 2 ? '#C8372D' : '#62D1B5'}
          strokeWidth="1.6"
        />
      )}

      {/* Dinh tam giac */}
      {[A, B, C].map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r="3.2" fill="#F2D88B" />
      ))}
      <text x={posA.x} y={posA.y + 4} fill="#F2D88B" fontSize="13" fontWeight="700" textAnchor="middle">
        {hinh.dinh[0]}
      </text>
      <text x={posB.x} y={posB.y + 4} fill="#F2D88B" fontSize="13" fontWeight="700" textAnchor="middle">
        {hinh.dinh[1]}
      </text>
      <text x={posC.x} y={posC.y + 4} fill="#F2D88B" fontSize="13" fontWeight="700" textAnchor="middle">
        {hinh.dinh[2]}
      </text>

      {/* Nhan canh */}
      {hinh.hienCanh?.[0] && (
        <text
          x={posCanhBC.x}
          y={posCanhBC.y + 4}
          fill={hinh.canhCanTinh === 0 ? '#F28A80' : '#DCE6EA'}
          fontSize="12"
          fontWeight="600"
          textAnchor="middle"
        >
          {hinh.hienCanh[0]}
        </text>
      )}
      {hinh.hienCanh?.[1] && (
        <text
          x={posCanhAC.x}
          y={posCanhAC.y + 4}
          fill={hinh.canhCanTinh === 1 ? '#F28A80' : '#DCE6EA'}
          fontSize="12"
          fontWeight="600"
          textAnchor="middle"
        >
          {hinh.hienCanh[1]}
        </text>
      )}
      {hinh.hienCanh?.[2] && (
        <text
          x={posCanhAB.x}
          y={posCanhAB.y + 4}
          fill={hinh.canhCanTinh === 2 ? '#F28A80' : '#DCE6EA'}
          fontSize="12"
          fontWeight="600"
          textAnchor="middle"
        >
          {hinh.hienCanh[2]}
        </text>
      )}

      {/* Nhan goc */}
      {hinh.hienGoc?.[0] && (
        <text
          x={posGocA.x}
          y={posGocA.y + 4}
          fill={hinh.gocCanTinh === 0 ? '#F28A80' : '#62D1B5'}
          fontSize="11.5"
          fontWeight="700"
          textAnchor="middle"
        >
          {hinh.hienGoc[0]}
        </text>
      )}
      {hinh.hienGoc?.[1] && (
        <text
          x={posGocB.x}
          y={posGocB.y + 4}
          fill={hinh.gocCanTinh === 1 ? '#F28A80' : '#62D1B5'}
          fontSize="11.5"
          fontWeight="700"
          textAnchor="middle"
        >
          {hinh.hienGoc[1]}
        </text>
      )}
      {hinh.hienGoc?.[2] && (
        <text
          x={posGocC.x}
          y={posGocC.y + 4}
          fill={hinh.gocCanTinh === 2 ? '#F28A80' : '#62D1B5'}
          fontSize="11.5"
          fontWeight="700"
          textAnchor="middle"
        >
          {hinh.hienGoc[2]}
        </text>
      )}
    </svg>
  );
};

const VeNuaDuongTron: React.FC<{ hinh: HinhVeNuaDuongTron }> = ({ hinh }) => {
  const cx = 160;
  const cy = 165;
  const R = 105;
  const rad = (hinh.gocAlpha * Math.PI) / 180;
  const mx = cx + R * Math.cos(rad);
  const my = cy - R * Math.sin(rad);
  const arcR = 28;
  const ax = cx + arcR * Math.cos(rad);
  const ay = cy - arcR * Math.sin(rad);
  const xVal = Math.cos(rad).toFixed(2).replace('.', ',');
  const yVal = Math.sin(rad).toFixed(2).replace('.', ',');

  return (
    <svg
      viewBox="0 0 320 205"
      className="w-full max-w-[340px] mx-auto h-auto select-none"
      role="img"
      aria-label={`Nửa đường tròn đơn vị góc ${hinh.gocAlpha} độ`}
    >
      {/* Truc toa do */}
      <line x1="25" y1={cy} x2="298" y2={cy} stroke="#63738E" strokeWidth="1.3" />
      <polygon points={`298,${cy} 290,${cy - 3.5} 290,${cy + 3.5}`} fill="#63738E" />
      <line x1={cx} y1="185" x2={cx} y2="22" stroke="#63738E" strokeWidth="1.3" />
      <polygon points={`${cx},22 ${cx - 3.5},30 ${cx + 3.5},30`} fill="#63738E" />

      {/* Nua duong tron don vi */}
      <path
        d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
        fill="rgba(63,181,154,0.1)"
        stroke="#3FB59A"
        strokeWidth="2"
      />

      {/* Goc va ban kinh OM */}
      <line x1={cx} y1={cy} x2={mx} y2={my} stroke="#E4BC5A" strokeWidth="2.2" />
      <path
        d={`M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 0 0 ${ax.toFixed(1)} ${ay.toFixed(1)}`}
        fill="rgba(228,188,90,0.22)"
        stroke="#E4BC5A"
        strokeWidth="1.5"
      />
      <text
        x={cx + 36 * Math.cos(rad / 2)}
        y={cy - 36 * Math.sin(rad / 2)}
        fill="#F2D88B"
        fontSize="11.5"
        fontWeight="700"
        textAnchor="middle"
      >
        {hinh.anSoDoGoc ? 'α' : `${hinh.gocAlpha}°`}
      </text>

      {/* Duong giong x0, y0 */}
      <line x1={mx} y1={my} x2={mx} y2={cy} stroke="#B79CFF" strokeWidth="1.2" strokeDasharray="4 3" />
      <line x1={mx} y1={my} x2={cx} y2={my} stroke="#B79CFF" strokeWidth="1.2" strokeDasharray="4 3" />

      {/* Diem M */}
      <circle cx={mx} cy={my} r="5" fill="#E4BC5A" stroke="#070B14" strokeWidth="1.4" />
      <text
        x={mx + (mx >= cx ? 12 : -14)}
        y={my - 8}
        fill="#F2D88B"
        fontSize="12.5"
        fontWeight="700"
      >
        {hinh.nhanDiem || 'M'}
        {hinh.hienToaDo ? `(${xVal}; ${yVal})` : ''}
      </text>

      {/* Nhan truc */}
      <text x="292" y={cy + 15} fill="#9BA8BE" fontSize="11">x</text>
      <text x={cx + 10} y="28" fill="#9BA8BE" fontSize="11">y</text>
      <text x={cx - 10} y={cy + 15} fill="#9BA8BE" fontSize="11">O</text>
      <text x={cx + R + 4} y={cy + 15} fill="#9BA8BE" fontSize="10.5">1</text>
      <text x={cx - R - 14} y={cy + 15} fill="#9BA8BE" fontSize="10.5">-1</text>
      <text x={cx + 8} y={cy - R - 4} fill="#9BA8BE" fontSize="10.5">1</text>
    </svg>
  );
};

const VeCanhThucTe: React.FC<{ hinh: HinhVeCanhThucTe }> = ({ hinh }) => {
  if (hinh.mauCanh === 'chieuCaoNui') {
    return (
      <svg
        viewBox="0 0 320 185"
        className="w-full max-w-[340px] mx-auto h-auto select-none"
        role="img"
        aria-label="Sơ đồ đo chiều cao tháp núi"
      >
        {/* Nui / thap */}
        <path
          d="M210 150 L250 38 L295 150 Z"
          fill="rgba(63,181,154,0.16)"
          stroke="#3FB59A"
          strokeWidth="1.6"
        />
        {/* Mat dat */}
        <line x1="22" y1="150" x2="300" y2="150" stroke="#7A89A3" strokeWidth="1.6" />
        {/* Tia nhin tu A va B */}
        <line x1="42" y1="150" x2="250" y2="38" stroke="#E4BC5A" strokeWidth="1.8" strokeDasharray="5 3" />
        <line x1="138" y1="150" x2="250" y2="38" stroke="#E4BC5A" strokeWidth="1.8" strokeDasharray="5 3" />
        {/* Chieu cao CD */}
        <line x1="250" y1="38" x2="250" y2="150" stroke="#B79CFF" strokeWidth="1.8" />
        <rect x="242" y="142" width="8" height="8" fill="none" stroke="#B79CFF" strokeWidth="1.2" />

        <circle cx="42" cy="150" r="3" fill="#F2D88B" />
        <circle cx="138" cy="150" r="3" fill="#F2D88B" />
        <circle cx="250" cy="38" r="3.5" fill="#F2D88B" />
        <circle cx="250" cy="150" r="3" fill="#B79CFF" />

        <text x="42" y="167" fill="#F2D88B" fontSize="12" fontWeight="700" textAnchor="middle">{hinh.nhanA}</text>
        <text x="138" y="167" fill="#F2D88B" fontSize="12" fontWeight="700" textAnchor="middle">{hinh.nhanB}</text>
        <text x="250" y="29" fill="#F2D88B" fontSize="12" fontWeight="700" textAnchor="middle">{hinh.nhanC}</text>
        <text x="258" y="167" fill="#B79CFF" fontSize="11.5" fontWeight="600">H/D</text>

        {hinh.nhanCanh1 && (
          <text x="90" y="167" fill="#DCE6EA" fontSize="11" textAnchor="middle">{hinh.nhanCanh1}</text>
        )}
        {hinh.nhanGoc1 && (
          <text x="72" y="143" fill="#62D1B5" fontSize="11" fontWeight="600">{hinh.nhanGoc1}</text>
        )}
        {hinh.nhanGoc2 && (
          <text x="163" y="143" fill="#62D1B5" fontSize="11" fontWeight="600">{hinh.nhanGoc2}</text>
        )}
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 320 185"
      className="w-full max-w-[340px] mx-auto h-auto select-none"
      role="img"
      aria-label="Sơ đồ định vị thực tế trên sông biển"
    >
      {/* Song / mat bien luon nhe */}
      <path
        d="M15 98 Q80 86 155 98 T305 98 L305 128 Q230 138 155 126 T15 128 Z"
        fill="rgba(74,155,224,0.16)"
      />
      {/* Tam giac giua 3 diem */}
      <polygon
        points="65,152 125,44 255,58"
        fill="rgba(228,188,90,0.08)"
        stroke="#E4BC5A"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <line x1="125" y1="44" x2="255" y2="58" stroke="#C8372D" strokeWidth="2.3" strokeDasharray="5 3" />

      <circle cx="65" cy="152" r="3.5" fill="#F2D88B" />
      <circle cx="125" cy="44" r="3.5" fill="#62D1B5" />
      <circle cx="255" cy="58" r="3.5" fill="#62D1B5" />

      <text x="53" y="168" fill="#F2D88B" fontSize="12" fontWeight="700">{hinh.nhanA}</text>
      <text x="122" y="33" fill="#62D1B5" fontSize="12" fontWeight="700">{hinh.nhanB}</text>
      <text x="263" y="54" fill="#62D1B5" fontSize="12" fontWeight="700">{hinh.nhanC}</text>

      {hinh.nhanCanh1 && (
        <text x="80" y="96" fill="#DCE6EA" fontSize="11" fontWeight="600">{hinh.nhanCanh1}</text>
      )}
      {hinh.nhanCanh2 && (
        <text x="172" y="124" fill="#DCE6EA" fontSize="11" fontWeight="600">{hinh.nhanCanh2}</text>
      )}
      {hinh.nhanGoc1 && (
        <text x="90" y="138" fill="#E4BC5A" fontSize="11.5" fontWeight="700">{hinh.nhanGoc1}</text>
      )}
    </svg>
  );
};

export const HinhVe: React.FC<{ hinh: HinhVeData }> = ({ hinh }) => {
  return (
    <div className="rounded-lg border border-[#E4BC5A]/25 bg-[#0A101E]/85 p-3 my-2">
      {hinh.loai === 'tamGiac' && <VeTamGiac hinh={hinh} />}
      {hinh.loai === 'nuaDuongTronDonVi' && <VeNuaDuongTron hinh={hinh} />}
      {hinh.loai === 'canhThucTe' && <VeCanhThucTe hinh={hinh} />}
    </div>
  );
};
