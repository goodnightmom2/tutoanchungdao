import React from 'react';

interface ThuocTinhBieuTuong {
  className?: string;
}

export const BieuTuongLinhLuc: React.FC<{
  trangThai: 'day' | 'nut' | 'trong';
  className?: string;
}> = ({ trangThai, className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <circle
      cx="12"
      cy="12"
      r="9.5"
      fill={
        trangThai === 'day'
          ? 'url(#ngocLinhLuc)'
          : trangThai === 'nut'
          ? 'rgba(200,55,45,0.22)'
          : 'rgba(13,20,36,0.75)'
      }
      stroke={
        trangThai === 'day'
          ? '#62D1B5'
          : trangThai === 'nut'
          ? '#C8372D'
          : '#33415C'
      }
      strokeWidth="1.5"
    />
    {trangThai === 'day' && (
      <path
        d="M8.5 8.5C9.5 7 11.5 6.5 13.5 7"
        stroke="#E6FFF8"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    )}
    {trangThai === 'nut' && (
      <path
        d="M12 4.5L10.2 10.5L13.5 13L11.2 19"
        stroke="#F28A80"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    )}
    <defs>
      <radialGradient id="ngocLinhLuc" cx="38%" cy="32%" r="65%">
        <stop offset="0%" stopColor="#9AF2DB" />
        <stop offset="55%" stopColor="#3FB59A" />
        <stop offset="100%" stopColor="#134C40" />
      </radialGradient>
    </defs>
  </svg>
);

export const BieuTuongLinhKhi: React.FC<ThuocTinhBieuTuong> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M12 2.5C12 2.5 17 7.6 17 12.6C17 16.2 14.8 19.5 12 21.2C9.2 19.5 7 16.2 7 12.6C7 7.6 12 2.5 12 2.5Z"
      fill="rgba(63,181,154,0.25)"
      stroke="#62D1B5"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M12 7.5C12 7.5 14.5 10.5 14.5 13.2C14.5 15.2 13.4 16.9 12 17.8C10.6 16.9 9.5 15.2 9.5 13.2C9.5 10.5 12 7.5 12 7.5Z"
      fill="#62D1B5"
    />
  </svg>
);

export const BieuTuongLinhThach: React.FC<ThuocTinhBieuTuong> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <polygon
      points="12,2.5 19.5,8.5 16.5,20.5 7.5,20.5 4.5,8.5"
      fill="rgba(228,188,90,0.2)"
      stroke="#E4BC5A"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <polyline
      points="4.5,8.5 12,11.5 19.5,8.5"
      stroke="#F2D88B"
      strokeWidth="1.2"
    />
    <line x1="12" y1="2.5" x2="12" y2="20.5" stroke="#F2D88B" strokeWidth="1.2" />
  </svg>
);

export const BieuTuongSao: React.FC<{
  sang?: boolean;
  className?: string;
}> = ({ sang = true, className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <polygon
      points="12,2.4 14.9,8.4 21.5,9.3 16.7,13.9 17.9,20.5 12,17.3 6.1,20.5 7.3,13.9 2.5,9.3 9.1,8.4"
      fill={sang ? '#E4BC5A' : 'rgba(20,29,51,0.7)'}
      stroke={sang ? '#F2D88B' : '#4C5978'}
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

export const BieuTuongBanDo: React.FC<ThuocTinhBieuTuong> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M4 6.5L9.5 4L14.5 6.5L20 4V17.5L14.5 20L9.5 17.5L4 20V6.5Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <line x1="9.5" y1="4" x2="9.5" y2="17.5" stroke="currentColor" strokeWidth="1.3" />
    <line x1="14.5" y1="6.5" x2="14.5" y2="20" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export const BieuTuongDongPhu: React.FC<ThuocTinhBieuTuong> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M3 19.5L8.5 7.5L12.5 13L16 6L21 19.5H3Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 19.5C9.5 16.8 10.6 15.2 12 15.2C13.4 15.2 14.5 16.8 14.5 19.5"
      fill="rgba(228,188,90,0.28)"
      stroke="#E4BC5A"
      strokeWidth="1.4"
    />
  </svg>
);

export const BieuTuongTangKinhCac: React.FC<ThuocTinhBieuTuong> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path d="M12 2.5L12 4.5" stroke="#E4BC5A" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M6.5 8L12 4.5L17.5 8H6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M5 13L12 9.5L19 13H5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M3.5 18L12 14.5L20.5 18H3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M6.5 18V21H17.5V18" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const BieuTuongPhongThayDo: React.FC<ThuocTinhBieuTuong> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M7.5 4.5L12 7L16.5 4.5L20.5 8.5L18 11.5L16.5 10V19.5H7.5V10L6 11.5L3.5 8.5L7.5 4.5Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M10 5.5L12 9L14 5.5" stroke="#E4BC5A" strokeWidth="1.3" />
  </svg>
);

export const BieuTuongTuiDo: React.FC<ThuocTinhBieuTuong> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M8.5 7.5C7 5.5 7.5 3.5 9.5 3.5H14.5C16.5 3.5 17 5.5 15.5 7.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M8 7.5H16C18.8 10 20 13.5 19 17.5C18.3 19.6 15.8 21 12 21C8.2 21 5.7 19.6 5 17.5C4 13.5 5.2 10 8 7.5Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M8.5 9.5H15.5" stroke="#E4BC5A" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const BieuTuongHoSo: React.FC<ThuocTinhBieuTuong> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <circle cx="12" cy="8.5" r="3.5" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M5.5 19.5C6.4 15.8 8.9 14 12 14C15.1 14 17.6 15.8 18.5 19.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <rect
      x="3"
      y="2.5"
      width="18"
      height="19"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.2"
      opacity="0.45"
    />
  </svg>
);

export const BieuTuongCuaHang: React.FC<ThuocTinhBieuTuong> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M3 9.5C6.5 8 9 6 12 3.5C15 6 17.5 8 21 9.5H3Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path d="M5.5 9.5V19.5M18.5 9.5V19.5M9.5 13V19.5H14.5V13H9.5Z" stroke="currentColor" strokeWidth="1.5" />
    <line x1="3.5" y1="19.5" x2="20.5" y2="19.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const BieuTuongCaiDat: React.FC<ThuocTinhBieuTuong> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M12 3V5.5M12 18.5V21M3 12H5.5M18.5 12H21M5.6 5.6L7.4 7.4M16.6 16.6L18.4 18.4M18.4 5.6L16.6 7.4M7.4 16.6L5.6 18.4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export const BieuTuongRuong: React.FC<ThuocTinhBieuTuong> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M4 9.5C4 7 6 5.5 12 5.5C18 5.5 20 7 20 9.5V18.5C20 19.3 19.3 20 18.5 20H5.5C4.7 20 4 19.3 4 18.5V9.5Z"
      fill="rgba(228,188,90,0.16)"
      stroke="#E4BC5A"
      strokeWidth="1.6"
    />
    <line x1="4" y1="11.5" x2="20" y2="11.5" stroke="#E4BC5A" strokeWidth="1.5" />
    <rect x="10.2" y="10" width="3.6" height="4" rx="0.8" fill="#E4BC5A" />
  </svg>
);

export const BieuTuongSamSet: React.FC<ThuocTinhBieuTuong> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <polygon
      points="13.5,2.5 5.5,13 11.5,13 10.5,21.5 18.5,11 12.5,11"
      fill="rgba(183,156,255,0.28)"
      stroke="#B79CFF"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </svg>
);

export const BieuTuongKiem: React.FC<ThuocTinhBieuTuong> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M5 19L15.5 8.5L19 4L14.5 7.5L4 18M19 19L8.5 8.5L5 4L9.5 7.5L20 18"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line x1="5" y1="15.5" x2="8.5" y2="19" stroke="#E4BC5A" strokeWidth="1.6" strokeLinecap="round" />
    <line x1="19" y1="15.5" x2="15.5" y2="19" stroke="#E4BC5A" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const BieuTuongTamMa: React.FC<ThuocTinhBieuTuong> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M12 3C7.5 3 5 6.8 5 11.5C5 16.5 8.5 20.5 12 21C15.5 20.5 19 16.5 19 11.5C19 6.8 16.5 3 12 3Z"
      fill="rgba(122,77,255,0.22)"
      stroke="#B79CFF"
      strokeWidth="1.6"
    />
    <path d="M8.5 10.5L10.5 11.5M15.5 10.5L13.5 11.5" stroke="#F2D88B" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M9.5 15.5C10.8 14.5 13.2 14.5 14.5 15.5" stroke="#B79CFF" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const BieuTuongMayTinh: React.FC<ThuocTinhBieuTuong> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <rect x="4.5" y="2.5" width="15" height="19" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <rect x="7.5" y="5.5" width="9" height="3.5" stroke="#E4BC5A" strokeWidth="1.3" />
    <circle cx="8.5" cy="12.5" r="0.9" fill="currentColor" />
    <circle cx="12" cy="12.5" r="0.9" fill="currentColor" />
    <circle cx="15.5" cy="12.5" r="0.9" fill="currentColor" />
    <circle cx="8.5" cy="16.5" r="0.9" fill="currentColor" />
    <circle cx="12" cy="16.5" r="0.9" fill="currentColor" />
    <circle cx="15.5" cy="16.5" r="0.9" fill="#E4BC5A" />
  </svg>
);

export const BieuTuongAmThanh: React.FC<{
  bat: boolean;
  className?: string;
}> = ({ bat, className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M5 10V14H8.5L13.5 18V6L8.5 10H5Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    {bat ? (
      <>
        <path d="M16.5 9C17.5 10.2 17.5 13.8 16.5 15" stroke="#62D1B5" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M19 6.8C20.8 9.2 20.8 14.8 19 17.2" stroke="#62D1B5" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ) : (
      <line x1="16" y1="9" x2="20.5" y2="15" stroke="#C8372D" strokeWidth="1.8" strokeLinecap="round" />
    )}
  </svg>
);

export const BieuTuongKhoa: React.FC<ThuocTinhBieuTuong> = ({
  className = 'w-4 h-4',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <rect x="5" y="10.5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8.5 10.5V7.5C8.5 5.4 10 4 12 4C14 4 15.5 5.4 15.5 7.5V10.5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="15.5" r="1.2" fill="currentColor" />
  </svg>
);

export const BieuTuongGoiY: React.FC<ThuocTinhBieuTuong> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
    <path
      d="M7 5H17C18.1 5 19 5.9 19 7V17C19 18.1 18.1 19 17 19H7C5.9 19 5 18.1 5 17V7C5 5.9 5.9 5 7 5Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path d="M8.5 9.5H15.5M8.5 13H13.5" stroke="#E4BC5A" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const BieuTuongVatPham: React.FC<{
  vatPhamId: string;
  className?: string;
}> = ({ vatPhamId, className = 'w-8 h-8' }) => {
  switch (vatPhamId) {
    case 'laBanBatQuai':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
          <polygon points="16,3 25,7 29,16 25,25 16,29 7,25 3,16 7,7" stroke="#E4BC5A" strokeWidth="1.6" fill="rgba(228,188,90,0.12)" />
          <circle cx="16" cy="16" r="7" stroke="#62D1B5" strokeWidth="1.4" />
          <polygon points="16,9 18,16 16,23 14,16" fill="#C8372D" />
          <circle cx="16" cy="16" r="1.5" fill="#F2D88B" />
        </svg>
      );
    case 'hoLoHapLinh':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
          <path d="M14 5H18L17.2 8.5C19.5 9.5 20.5 12 19 14.5C22.5 16.5 23 22 20.5 25.5C18.5 27.5 13.5 27.5 11.5 25.5C9 22 9.5 16.5 13 14.5C11.5 12 12.5 9.5 14.8 8.5L14 5Z" fill="rgba(74,155,224,0.22)" stroke="#62D1B5" strokeWidth="1.6" />
          <path d="M12 19C14 18 18 18 20 19" stroke="#E4BC5A" strokeWidth="1.4" />
        </svg>
      );
    case 'ngocBoiThanhTam':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
          <circle cx="16" cy="17" r="9.5" fill="rgba(63,181,154,0.22)" stroke="#62D1B5" strokeWidth="1.8" />
          <circle cx="16" cy="17" r="3.5" fill="#0D1424" stroke="#E4BC5A" strokeWidth="1.4" />
          <path d="M16 3V7.5" stroke="#C8372D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'tienDinhLuyenKhi':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
          <path d="M8 12H24L22 23H10L8 12Z" fill="rgba(228,188,90,0.18)" stroke="#E4BC5A" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M10 12C10 8.5 22 8.5 22 12" stroke="#E4BC5A" strokeWidth="1.5" />
          <line x1="11" y1="23" x2="9" y2="28" stroke="#E4BC5A" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="21" y1="23" x2="23" y2="28" stroke="#E4BC5A" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="16" y1="23" x2="16" y2="27.5" stroke="#E4BC5A" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'butLongChuSa':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
          <path d="M23 5L27 9L13 23L8 24L9 19L23 5Z" fill="rgba(200,55,45,0.2)" stroke="#E4BC5A" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M8 24L5 27" stroke="#C8372D" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'phiKiem':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
          <path d="M25 5L27 7L14 21L10 22L11 18L25 5Z" fill="rgba(98,209,181,0.28)" stroke="#62D1B5" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9 17L15 23" stroke="#E4BC5A" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 26L11 21" stroke="#A97C50" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    case 'chuongLoiCong':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
          <path d="M10 11C10 7.5 22 7.5 22 11L24.5 24H7.5L10 11Z" fill="rgba(183,156,255,0.22)" stroke="#E4BC5A" strokeWidth="1.7" strokeLinejoin="round" />
          <circle cx="16" cy="25.5" r="2" fill="#B79CFF" />
          <path d="M16 4V7" stroke="#E4BC5A" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'loiPhu':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
          <rect x="9" y="4" width="14" height="24" rx="1.8" fill="#F2D88B" stroke="#7A4DFF" strokeWidth="1.6" />
          <polygon points="17,8 12,16.5 16,16.5 15,24 20,15 16,15" fill="#7A4DFF" />
        </svg>
      );
    case 'buaChiDuong':
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
          <rect x="8" y="4" width="16" height="24" rx="1.8" fill="#F6EEDB" stroke="#1E7F6B" strokeWidth="1.6" />
          <path d="M16 8V22M11.5 12.5L16 8L20.5 12.5" stroke="#E4BC5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      if (vatPhamId.startsWith('phu')) {
        return (
          <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
            <rect x="9" y="4" width="14" height="24" rx="1.5" fill="#EADDBE" stroke="#C8372D" strokeWidth="1.6" />
            <path d="M16 9V23M12 13H20M13 18L19 15" stroke="#C8372D" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
          <circle cx="16" cy="16" r="8.5" fill="rgba(63,181,154,0.25)" stroke="#F2D88B" strokeWidth="1.6" />
          <path d="M12.5 13C13.5 11.5 15.5 11 17.5 11.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
          <circle cx="16" cy="16" r="3" fill="#E4BC5A" opacity="0.65" />
        </svg>
      );
  }
};
