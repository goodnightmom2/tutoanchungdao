import React from 'react';

export const YeuVuongSvg: React.FC<{
  maYeuVuong: string;
  trangThai: 'binhThuong' | 'trungDon' | 'noiGian';
  pha?: number;
  className?: string;
}> = ({ maYeuVuong, trangThai, pha = 1, className = 'w-40 h-40' }) => {
  const dangTrungDon = trangThai === 'trungDon';
  const dangNoiGian = trangThai === 'noiGian' || pha >= 2;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${
        dangTrungDon ? 'anim-rung-trung-don' : 'anim-tho-nhe'
      } ${className}`}
    >
      <svg viewBox="0 0 180 180" className="w-full h-full drop-shadow-[0_10px_18px_rgba(15,10,30,0.45)]" aria-hidden="true">
        {/* Hao quang sau lung */}
        <circle
          cx="90"
          cy="94"
          r={dangNoiGian ? 66 : 56}
          fill={
            maYeuVuong === 'tamMaHo'
              ? 'rgba(155,107,255,0.22)'
              : maYeuVuong === 'danKiepLoiDieu'
              ? 'rgba(74,155,224,0.22)'
              : maYeuVuong === 'anhKiepHacGiao'
              ? 'rgba(122,77,255,0.25)'
              : maYeuVuong === 'nguHanhKyLan'
              ? 'rgba(63,181,154,0.24)'
              : maYeuVuong === 'tamTaiYeuVuong'
              ? 'rgba(228,98,58,0.24)'
              : 'rgba(228,188,90,0.26)'
          }
          stroke={dangNoiGian ? '#F2D88B' : 'none'}
          strokeWidth="2"
          strokeDasharray="6 5"
        />

        {maYeuVuong === 'tamMaHo' && (
          <g>
            {/* 3 duoi cao tim */}
            <path d="M52 135 Q18 115 24 72 Q42 90 58 116 Z" fill="#8B5CF6" stroke="#4A2E20" strokeWidth="2.8" />
            <path d="M128 135 Q162 115 156 72 Q138 90 122 116 Z" fill="#8B5CF6" stroke="#4A2E20" strokeWidth="2.8" />
            <path d="M44 140 Q18 138 20 108 Q42 116 55 128 Z" fill="#B79CFF" stroke="#4A2E20" strokeWidth="2.4" />
            <path d="M24 72 L33 88 L22 92 Z" fill="#F8E9FF" />
            <path d="M156 72 L147 88 L158 92 Z" fill="#F8E9FF" />
            {/* Than chibi */}
            <ellipse cx="90" cy="126" rx="32" ry="26" fill="#A779FF" stroke="#4A2E20" strokeWidth="3" />
            <ellipse cx="90" cy="130" rx="18" ry="18" fill="#F8E9FF" />
            {/* Tai cao */}
            <path d="M50 62 L38 24 L74 44 Z" fill="#9B6BFF" stroke="#4A2E20" strokeWidth="3" strokeLinejoin="round" />
            <path d="M51 55 L44 33 L67 45 Z" fill="#FFB8C9" />
            <path d="M130 62 L142 24 L106 44 Z" fill="#9B6BFF" stroke="#4A2E20" strokeWidth="3" strokeLinejoin="round" />
            <path d="M129 55 L136 33 L113 45 Z" fill="#FFB8C9" />
            {/* Dau */}
            <ellipse cx="90" cy="76" rx="44" ry="38" fill="#B79CFF" stroke="#4A2E20" strokeWidth="3" />
            <ellipse cx="90" cy="88" rx="34" ry="23" fill="#FFF7FF" />
            {/* An ky tran */}
            <path d="M90 47 L95 56 L90 64 L85 56 Z" fill="#E4BC5A" stroke="#4A2E20" strokeWidth="1.5" />
          </g>
        )}

        {maYeuVuong === 'danKiepLoiDieu' && (
          <g>
            {/* Canh chim set */}
            <path d="M54 115 Q12 88 18 52 Q46 72 62 96 Z" fill="#4A9BE0" stroke="#4A2E20" strokeWidth="2.8" />
            <path d="M126 115 Q168 88 162 52 Q134 72 118 96 Z" fill="#4A9BE0" stroke="#4A2E20" strokeWidth="2.8" />
            <path d="M22 60 L45 78 L34 86 Z" fill="#FCE588" />
            <path d="M158 60 L135 78 L146 86 Z" fill="#FCE588" />
            {/* Than */}
            <ellipse cx="90" cy="122" rx="30" ry="28" fill="#5CB0F5" stroke="#4A2E20" strokeWidth="3" />
            <ellipse cx="90" cy="126" rx="18" ry="19" fill="#FFF4CC" />
            {/* Mao long vu */}
            <path d="M78 44 L90 18 L102 44 Z" fill="#E4BC5A" stroke="#4A2E20" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M62 50 L64 26 L80 46 Z" fill="#62D1B5" stroke="#4A2E20" strokeWidth="2.2" />
            <path d="M118 50 L116 26 L100 46 Z" fill="#62D1B5" stroke="#4A2E20" strokeWidth="2.2" />
            {/* Dau */}
            <ellipse cx="90" cy="78" rx="40" ry="36" fill="#62B7F8" stroke="#4A2E20" strokeWidth="3" />
            {/* Mo vang */}
            <polygon points="84,82 96,82 90,94" fill="#F2AA2E" stroke="#4A2E20" strokeWidth="2.2" strokeLinejoin="round" />
          </g>
        )}

        {maYeuVuong === 'anhKiepHacGiao' && (
          <g>
            {/* Duoi rong uon luon */}
            <path d="M48 136 Q18 145 22 108 Q38 118 56 122" fill="none" stroke={pha >= 2 ? '#7A4DFF' : '#2E3B59'} strokeWidth="14" strokeLinecap="round" />
            {/* Than giap vay */}
            <ellipse cx="90" cy="124" rx="34" ry="27" fill={pha >= 2 ? '#4D327A' : '#35486E'} stroke="#4A2E20" strokeWidth="3" />
            <ellipse cx="90" cy="128" rx="18" ry="20" fill="#E4BC5A" opacity="0.85" />
            {/* Sung rong vang */}
            <path d="M62 48 Q44 22 52 14 Q64 28 74 44 Z" fill="#E4BC5A" stroke="#4A2E20" strokeWidth="2.6" />
            <path d="M118 48 Q136 22 128 14 Q116 28 106 44 Z" fill="#E4BC5A" stroke="#4A2E20" strokeWidth="2.6" />
            {/* Dau rong chibi */}
            <ellipse cx="90" cy="76" rx="44" ry="37" fill={pha >= 2 ? '#614199' : '#405882'} stroke="#4A2E20" strokeWidth="3" />
            {/* Rau rong vang */}
            <path d="M52 88 Q30 96 24 84" fill="none" stroke="#E4BC5A" strokeWidth="3" strokeLinecap="round" />
            <path d="M128 88 Q150 96 156 84" fill="none" stroke="#E4BC5A" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {maYeuVuong === 'nguHanhKyLan' && (
          <g>
            {/* Vong ngu hanh sau lung */}
            <circle cx="90" cy="76" r="50" fill="none" stroke="#3FB59A" strokeWidth="3" strokeDasharray="10 6" />
            <circle cx="90" cy="24" r="5" fill="#E4BC5A" stroke="#4A2E20" strokeWidth="1.5" />
            <circle cx="44" cy="56" r="5" fill="#4E9B63" stroke="#4A2E20" strokeWidth="1.5" />
            <circle cx="136" cy="56" r="5" fill="#4A9BE0" stroke="#4A2E20" strokeWidth="1.5" />
            <circle cx="52" cy="112" r="5" fill="#E4623A" stroke="#4A2E20" strokeWidth="1.5" />
            <circle cx="128" cy="112" r="5" fill="#B88E4A" stroke="#4A2E20" strokeWidth="1.5" />
            {/* Than Ky Lan */}
            <ellipse cx="90" cy="126" rx="34" ry="26" fill="#4EC9AE" stroke="#4A2E20" strokeWidth="3" />
            <path d="M68 112 Q90 130 112 112" fill="none" stroke="#E4BC5A" strokeWidth="4" />
            {/* Sung ky lan */}
            <path d="M84 44 L90 16 L96 44 Z" fill="#F2D88B" stroke="#4A2E20" strokeWidth="2.5" />
            {/* Boi toc bom */}
            <ellipse cx="90" cy="78" rx="42" ry="36" fill="#62D1B5" stroke="#4A2E20" strokeWidth="3" />
            <path d="M54 54 Q90 36 126 54" fill="#E4BC5A" stroke="#4A2E20" strokeWidth="2.2" />
          </g>
        )}

        {maYeuVuong === 'tamTaiYeuVuong' && (
          <g>
            {/* Ngon lua Tam Tai sau vai */}
            <path d="M40 120 Q20 80 42 50 Q55 78 62 102 Z" fill="#62D1B5" stroke="#4A2E20" strokeWidth="2.5" />
            <path d="M140 120 Q160 80 138 50 Q125 78 118 102 Z" fill="#F07D42" stroke="#4A2E20" strokeWidth="2.5" />
            {/* Than giap ma quan */}
            <path d="M54 106 L126 106 L132 152 L48 152 Z" fill="#C8372D" stroke="#4A2E20" strokeWidth="3" strokeLinejoin="round" />
            <path d="M74 108 L90 148 L106 108" fill="#E4BC5A" stroke="#4A2E20" strokeWidth="2" />
            {/* Sung quy chibi */}
            <path d="M56 56 Q44 30 62 24 Q64 42 74 50 Z" fill="#4A2E20" stroke="#E4BC5A" strokeWidth="2" />
            <path d="M124 56 Q136 30 118 24 Q116 42 106 50 Z" fill="#4A2E20" stroke="#E4BC5A" strokeWidth="2" />
            {/* Dau */}
            <ellipse cx="90" cy="78" rx="42" ry="36" fill="#E8724B" stroke="#4A2E20" strokeWidth="3" />
            <path d="M76 52 L90 62 L104 52" fill="none" stroke="#FCE588" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {maYeuVuong === 'thienLoiChanLong' && (
          <g>
            {/* Tia set bao quanh */}
            <polyline points="26,42 46,66 36,74 56,98" fill="none" stroke="#B79CFF" strokeWidth="3.5" strokeLinecap="round" />
            <polyline points="154,42 134,66 144,74 124,98" fill="none" stroke="#E4BC5A" strokeWidth="3.5" strokeLinecap="round" />
            {/* Than Chan Long vang - tim */}
            <path d="M36 144 Q18 115 44 98" fill="none" stroke="#E4BC5A" strokeWidth="14" strokeLinecap="round" />
            <ellipse cx="90" cy="126" rx="35" ry="26" fill="#7A4DFF" stroke="#4A2E20" strokeWidth="3" />
            <ellipse cx="90" cy="130" rx="20" ry="18" fill="#FCE588" />
            {/* Vuong mien & sung rong */}
            <path d="M58 50 L44 16 L68 32 L76 44 Z" fill="#E4BC5A" stroke="#4A2E20" strokeWidth="2.6" strokeLinejoin="round" />
            <path d="M122 50 L136 16 L112 32 L104 44 Z" fill="#E4BC5A" stroke="#4A2E20" strokeWidth="2.6" strokeLinejoin="round" />
            <circle cx="90" cy="40" r="7" fill="#62D1B5" stroke="#4A2E20" strokeWidth="2" />
            {/* Dau Chan Long */}
            <ellipse cx="90" cy="78" rx="45" ry="37" fill="#916BFF" stroke="#4A2E20" strokeWidth="3" />
            <ellipse cx="90" cy="90" rx="32" ry="18" fill="#FFF3D6" />
          </g>
        )}

        {/* Ngu quan chung phong cach chibi (Bieu cam thay doi theo trangThai) */}
        <g>
          {/* Ma hong */}
          <ellipse cx="64" cy="84" rx="7" ry="4" fill="#FF8DA1" opacity="0.55" />
          <ellipse cx="116" cy="84" rx="7" ry="4" fill="#FF8DA1" opacity="0.55" />

          {dangTrungDon ? (
            <>
              {/* Mat nham X hoac > < khi trung don */}
              <path d="M64 70 L76 76 L64 82" fill="none" stroke="#4A2E20" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M116 70 L104 76 L116 82" fill="none" stroke="#4A2E20" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
              <ellipse cx="90" cy="96" rx="7" ry="5" fill="#8A302C" stroke="#4A2E20" strokeWidth="2" />
            </>
          ) : (
            <>
              {/* Mat to long lanh */}
              <ellipse cx="70" cy="75" rx="8.5" ry="9.5" fill="#2B1A12" />
              <ellipse cx="110" cy="75" rx="8.5" ry="9.5" fill="#2B1A12" />
              <circle cx="67.5" cy="71.5" r="3" fill="#FFFFFF" />
              <circle cx="107.5" cy="71.5" r="3" fill="#FFFFFF" />
              <circle cx="72" cy="78" r="1.4" fill="#FFFFFF" />
              <circle cx="112" cy="78" r="1.4" fill="#FFFFFF" />
              {/* Long may nghiem nghi */}
              <path
                d={dangNoiGian ? 'M60 61 L80 67' : 'M61 64 Q70 60 79 64'}
                fill="none"
                stroke="#4A2E20"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d={dangNoiGian ? 'M120 61 L100 67' : 'M101 64 Q110 60 119 64'}
                fill="none"
                stroke="#4A2E20"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Mieng + rang nanh nho de thuong */}
              <path
                d="M80 94 Q90 103 100 94"
                fill={dangNoiGian ? '#8F2929' : 'none'}
                stroke="#4A2E20"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <polygon points="82,95 85,95 83.5,99" fill="#FFFFFF" />
              <polygon points="95,95 98,95 96.5,99" fill="#FFFFFF" />
            </>
          )}
        </g>

        {/* Chan chibi */}
        <ellipse cx="72" cy="154" rx="11" ry="6.5" fill="#4A2E20" />
        <ellipse cx="108" cy="154" rx="11" ry="6.5" fill="#4A2E20" />
      </svg>
    </div>
  );
};
