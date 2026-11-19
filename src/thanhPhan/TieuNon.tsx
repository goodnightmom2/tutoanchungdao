import React from 'react';

export type BieuCamTieuNon = 'vui' | 'loLang' | 'coVu' | 'nguGat';

export const TieuNon: React.FC<{
  bieuCam?: BieuCamTieuNon;
  className?: string;
}> = ({ bieuCam = 'vui', className = 'w-16 h-16' }) => {
  return (
    <svg
      viewBox="0 0 90 100"
      className={`${className} select-none`}
      role="img"
      aria-label="Linh đồng Tiểu Nón"
    >
      <defs>
        <radialGradient id="thanTieuNon" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#FFF066" />
          <stop offset="65%" stopColor="#F5C922" />
          <stop offset="100%" stopColor="#D69512" />
        </radialGradient>
        <linearGradient id="nonLaTieuNon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E9C786" />
          <stop offset="55%" stopColor="#CFA15C" />
          <stop offset="100%" stopColor="#A97438" />
        </linearGradient>
      </defs>

      {/* Bong duoi chan */}
      <ellipse cx="45" cy="91" rx="21" ry="4.5" fill="rgba(74,46,32,0.22)" />

      {/* Hai chan ngan */}
      <path
        d="M36 74 Q34 86 38 89 Q42 90 42 86 L42 74 Z"
        fill="#EAB818"
        stroke="#4A2E20"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M48 74 L48 86 Q48 90 52 89 Q56 86 54 74 Z"
        fill="#EAB818"
        stroke="#4A2E20"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Tay phai tha long hoac co vu */}
      <path
        d={
          bieuCam === 'coVu'
            ? 'M63 58 Q77 45 79 38 Q81 34 75 35 Q68 41 61 52 Z'
            : 'M63 59 Q73 66 72 72 Q69 75 65 71 L59 64 Z'
        }
        fill="#F5C922"
        stroke="#4A2E20"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Tay trai vay chao */}
      <path
        d={
          bieuCam === 'loLang'
            ? 'M27 60 Q18 65 20 71 Q23 74 27 69 L30 64 Z'
            : 'M27 57 Q11 45 10 38 Q12 34 17 37 Q22 44 29 52 Z'
        }
        fill="#F5C922"
        stroke="#4A2E20"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Than tron vang chanh */}
      <ellipse
        cx="45"
        cy="54"
        rx="23"
        ry="24"
        fill="url(#thanTieuNon)"
        stroke="#4A2E20"
        strokeWidth="2.5"
      />
      {/* Diem sang mem */}
      <ellipse cx="36" cy="41" rx="7" ry="4" fill="#FFF9B8" opacity="0.6" />

      {/* Ma hong */}
      <ellipse cx="31" cy="56" rx="4.5" ry="2.6" fill="#F27970" opacity="0.65" />
      <ellipse cx="59" cy="56" rx="4.5" ry="2.6" fill="#F27970" opacity="0.65" />

      {/* Mat & bieu cam */}
      {bieuCam === 'nguGat' ? (
        <g stroke="#4A2E20" strokeWidth="2.2" strokeLinecap="round" fill="none">
          <path d="M33 50 Q37 53 41 50" />
          <path d="M49 50 Q53 53 57 50" />
          <circle cx="45" cy="60" r="2.2" fill="#E86D61" stroke="#4A2E20" strokeWidth="1.5" />
        </g>
      ) : (
        <g>
          <ellipse cx="37" cy="49" rx="2.7" ry={bieuCam === 'loLang' ? 3.2 : 3.5} fill="#2A1910" />
          <ellipse cx="53" cy="49" rx="2.7" ry={bieuCam === 'loLang' ? 3.2 : 3.5} fill="#2A1910" />
          <circle cx="38" cy="47.7" r="1" fill="#FFFFFF" />
          <circle cx="54" cy="47.7" r="1" fill="#FFFFFF" />
          {bieuCam === 'loLang' ? (
            <>
              <path d="M33 43 L40 45" stroke="#4A2E20" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M57 43 L50 45" stroke="#4A2E20" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M41 60 Q45 57 49 60" stroke="#4A2E20" strokeWidth="2" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <path
              d="M39 56 Q45 66 51 56 Z"
              fill="#D94B43"
              stroke="#4A2E20"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          )}
        </g>
      )}

      {/* Non la nan tre dan cheo */}
      <g>
        <path
          d="M12 37 Q45 12 78 37 Q45 43 12 37 Z"
          fill="url(#nonLaTieuNon)"
          stroke="#4A2E20"
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path
          d="M14 36 Q45 13 76 36"
          fill="none"
          stroke="#4A2E20"
          strokeWidth="2.2"
        />
        {/* Nan non */}
        <path d="M45 16 L32 38" stroke="#9C6B32" strokeWidth="1" opacity="0.65" />
        <path d="M45 16 L45 39" stroke="#9C6B32" strokeWidth="1" opacity="0.65" />
        <path d="M45 16 L58 38" stroke="#9C6B32" strokeWidth="1" opacity="0.65" />
        <path d="M23 32 Q45 26 67 32" fill="none" stroke="#9C6B32" strokeWidth="1" opacity="0.65" />
      </g>

      {/* Tia sang nho vui nhon */}
      {bieuCam === 'coVu' && (
        <path
          d="M78 24 L80 28 L84 30 L80 32 L78 36 L76 32 L72 30 L76 28 Z"
          fill="#FFF275"
          stroke="#D69512"
          strokeWidth="0.9"
        />
      )}
    </svg>
  );
};
