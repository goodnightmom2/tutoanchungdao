import React from 'react';
import { NgoaiHinh, TuThe } from '../../kieuDuLieu/troChoi';

const NET_VIEN = '#4A2E20';

export const TocSauLop: React.FC<{ ngoaiHinh: NgoaiHinh }> = ({
  ngoaiHinh,
}) => {
  const { toc, mauToc } = ngoaiHinh;
  if (toc === 'nganLangTu') return null;

  return (
    <g fill={mauToc} stroke={NET_VIEN} strokeWidth="2.5" strokeLinejoin="round">
      {toc === 'mocLanDuoiNgua' && (
        <>
          {/* Duoi ngua cao & xoan phong */}
          <path d="M132 46 Q172 44 176 86 Q174 114 148 118 Q138 102 144 82 Q132 72 132 46 Z" />
          {/* Toc ngang vai mem */}
          <path d="M68 78 Q62 114 78 122 L142 122 Q158 114 152 78 Z" />
        </>
      )}
      {toc === 'daiBuongXoa' || toc === 'bongTienTu' ? (
        <path d="M66 64 Q54 128 66 176 L154 176 Q166 128 154 64 Z" />
      ) : toc === 'nuaBuiCoPhong' ? (
        <path d="M69 70 Q62 122 74 154 L146 154 Q158 122 151 70 Z" />
      ) : toc === 'bayLinhKhi' ? (
        <path d="M66 66 Q42 110 56 168 L164 168 Q178 110 154 66 Z" />
      ) : toc === 'tetSamHaiBen' ? (
        <>
          <path d="M72 86 Q64 118 70 144 Q77 148 81 138 Q81 114 82 86 Z" />
          <path d="M148 86 Q156 118 150 144 Q143 148 139 138 Q139 114 138 86 Z" />
        </>
      ) : toc === 'haiMinhRoi' ? (
        <path d="M72 78 Q68 108 78 114 L142 114 Q152 108 148 78 Z" />
      ) : (
        <path d="M72 72 Q68 116 80 124 L140 124 Q152 116 148 72 Z" />
      )}
    </g>
  );
};

export const DauVaNguQuanLop: React.FC<{
  ngoaiHinh: NgoaiHinh;
  tuThe: TuThe;
}> = ({ ngoaiHinh, tuThe }) => {
  const { mauDa, kieuMat, mat, mauMat, longMay, mieng, phuKienThem } =
    ngoaiHinh;

  const khuonMatPath = () => {
    switch (kieuMat) {
      case 'vuongMem':
        return 'M72 76 Q72 40 110 40 Q148 40 148 76 L144 102 Q140 122 110 124 Q80 122 76 102 Z';
      case 'thanhManh':
        return 'M73 76 Q73 40 110 40 Q147 40 147 76 Q142 114 110 125 Q78 114 73 76 Z';
      case 'traiXoan':
        return 'M72 78 Q72 40 110 40 Q148 40 148 78 Q144 118 110 124 Q76 118 72 78 Z';
      default: // bauBinh chibi
        return 'M68 82 Q68 40 110 40 Q152 40 152 82 Q150 120 110 123 Q70 120 68 82 Z';
    }
  };

  const dangBiThuong = tuThe === 'biThuong';
  const dangNgoiThien = tuThe === 'ngoiThien';

  return (
    <g>
      {/* Co */}
      <rect x="100" y="114" width="20" height="16" rx="6" fill={mauDa} stroke={NET_VIEN} strokeWidth="2.4" />
      {/* Tai */}
      <ellipse cx="69" cy="88" rx="6.5" ry="9" fill={mauDa} stroke={NET_VIEN} strokeWidth="2.4" />
      <ellipse cx="151" cy="88" rx="6.5" ry="9" fill={mauDa} stroke={NET_VIEN} strokeWidth="2.4" />
      {/* Khuon mat */}
      <path d={khuonMatPath()} fill={mauDa} stroke={NET_VIEN} strokeWidth="2.8" />

      {/* Ma hong chibi */}
      {(phuKienThem === 'maHong' || ngoaiHinh.maMau === 'haiMinh' || ngoaiHinh.maMau === 'mocLan') && (
        <g opacity="0.62">
          <ellipse cx="83" cy="96" rx="8" ry="4.5" fill="#F27A76" />
          <ellipse cx="137" cy="96" rx="8" ry="4.5" fill="#F27A76" />
        </g>
      )}

      {/* Long may */}
      <g stroke={NET_VIEN} strokeWidth="2.3" strokeLinecap="round" fill="none">
        {longMay === 'kiemMy' ? (
          <>
            <path d="M81 71 L98 75" />
            <path d="M139 71 L122 75" />
          </>
        ) : longMay === 'ramCuongNghi' ? (
          <>
            <path d="M81 72 L99 73" strokeWidth="3.2" />
            <path d="M139 72 L121 73" strokeWidth="3.2" />
          </>
        ) : longMay === 'lieuMy' ? (
          <>
            <path d="M81 73 Q90 68 98 73" strokeWidth="2" />
            <path d="M122 73 Q130 68 139 73" strokeWidth="2" />
          </>
        ) : (
          <>
            <path d="M82 72 Q90 67 98 71" />
            <path d="M122 71 Q130 67 138 72" />
          </>
        )}
      </g>

      {/* Mat */}
      {dangBiThuong ? (
        <g stroke={NET_VIEN} strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M83 83 L96 88 L83 93" />
          <path d="M137 83 L124 88 L137 93" />
        </g>
      ) : dangNgoiThien || mat === 'tinhToa' ? (
        <g stroke={NET_VIEN} strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M82 88 Q90 92 98 88" />
          <path d="M122 88 Q130 92 138 88" />
        </g>
      ) : mat === 'nhamCuoi' ? (
        <g stroke={NET_VIEN} strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M81 90 Q90 79 99 90" />
          <path d="M121 90 Q130 79 139 90" />
          <path d="M79 88 L76 85" strokeWidth="2" />
          <path d="M141 88 L144 85" strokeWidth="2" />
        </g>
      ) : (
        <g>
          {/* Mat to sang lap lanh */}
          {[89, 131].map((cx, i) => (
            <g key={i}>
              <ellipse
                cx={cx}
                cy="87"
                rx={mat === 'phuongMi' ? 8.5 : 8}
                ry={mat === 'kiemMuc' ? 7.5 : 9}
                fill="#FFFFFF"
                stroke={NET_VIEN}
                strokeWidth="2.2"
              />
              <circle cx={cx + (i === 0 ? 1 : -1)} cy="87.5" r="5.6" fill={mauMat} />
              <circle cx={cx + (i === 0 ? 1 : -1)} cy="88" r="2.8" fill="#1F120C" />
              <circle cx={cx - 1.5} cy="84.5" r="2.1" fill="#FFFFFF" />
              <circle cx={cx + 2.4} cy="90.5" r="1.1" fill="#FFFFFF" />
              {/* Mi mat tren */}
              <path
                d={`M${cx - 9} 82 Q${cx} 75 ${cx + 9} 82`}
                fill="none"
                stroke={NET_VIEN}
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            </g>
          ))}
        </g>
      )}

      {/* Phu kien khuon mat */}
      {phuKienThem === 'anChuSa' && (
        <path d="M110 64 L113.5 69.5 L110 75 L106.5 69.5 Z" fill="#C8372D" />
      )}
      {phuKienThem === 'notRuoiLe' && (
        <circle cx="137" cy="96" r="1.6" fill="#4A2E20" />
      )}
      {phuKienThem === 'khuyenTaiNgoc' && (
        <>
          <circle cx="67" cy="96" r="3.2" fill="#62D1B5" stroke={NET_VIEN} strokeWidth="1.2" />
          <circle cx="153" cy="96" r="3.2" fill="#62D1B5" stroke={NET_VIEN} strokeWidth="1.2" />
        </>
      )}

      {/* Mieng */}
      {dangBiThuong ? (
        <path d="M101 108 Q110 102 119 108" fill="none" stroke={NET_VIEN} strokeWidth="2.2" strokeLinecap="round" />
      ) : mieng === 'cuoiHa' || tuThe === 'vuiMung' ? (
        <g>
          <path
            d="M99 102 Q110 117 121 102 Z"
            fill="#D44D46"
            stroke={NET_VIEN}
            strokeWidth="2.2"
            strokeLinejoin="round"
          />
          <path d="M103 108 Q110 105 117 108" fill="#F68C91" />
        </g>
      ) : mieng === 'mimCuoi' ? (
        <path d="M102 104 Q110 110 118 104" fill="none" stroke={NET_VIEN} strokeWidth="2.3" strokeLinecap="round" />
      ) : mieng === 'kienDinh' ? (
        <path d="M102 106 Q110 103 118 106" fill="none" stroke={NET_VIEN} strokeWidth="2.3" strokeLinecap="round" />
      ) : (
        <line x1="104" y1="105" x2="116" y2="105" stroke={NET_VIEN} strokeWidth="2.2" strokeLinecap="round" />
      )}
    </g>
  );
};

export const TocTruocLop: React.FC<{ ngoaiHinh: NgoaiHinh }> = ({
  ngoaiHinh,
}) => {
  const { toc, mauToc } = ngoaiHinh;
  return (
    <g fill={mauToc} stroke={NET_VIEN} strokeWidth="2.5" strokeLinejoin="round">
      {/* Bui toc tren dinh */}
      {(toc === 'haiMinhRoi' || toc === 'mocLanDuoiNgua' || toc === 'buiCaoDaiLua' || toc === 'nuaBuiCoPhong') && (
        <ellipse cx="110" cy="31" rx="14" ry="11" />
      )}
      {toc === 'songHoan' && (
        <>
          <circle cx="80" cy="39" r="11" />
          <circle cx="140" cy="39" r="11" />
        </>
      )}

      {/* Mai toc truoc & hai ben */}
      {toc === 'haiMinhRoi' ? (
        <>
          <path d="M66 78 Q66 36 110 34 Q154 36 154 78 Q144 58 134 64 Q122 50 110 66 Q98 52 86 68 Q75 56 66 78 Z" />
          <path d="M67 74 Q64 90 71 96 Q75 82 77 72 Z" />
          <path d="M153 74 Q156 90 149 96 Q145 82 143 72 Z" />
        </>
      ) : toc === 'mocLanDuoiNgua' ? (
        <>
          <path d="M66 78 Q68 35 110 35 Q152 35 154 78 Q142 54 128 63 Q115 48 102 64 Q85 52 66 78 Z" />
          <path d="M67 74 Q64 96 74 102 Q77 86 78 72 Z" />
          <path d="M153 74 Q156 96 146 102 Q143 86 142 72 Z" />
        </>
      ) : (
        <>
          <path d="M67 76 Q69 35 110 35 Q151 35 153 76 Q134 56 110 60 Q86 56 67 76 Z" />
          <path d="M68 72 Q66 94 74 100 Q76 84 78 72 Z" />
          <path d="M152 72 Q154 94 146 100 Q144 84 142 72 Z" />
        </>
      )}
    </g>
  );
};

export const MuPhuKienDauLop: React.FC<{ ngoaiHinh: NgoaiHinh }> = ({
  ngoaiHinh,
}) => {
  const { muPhuKienDau } = ngoaiHinh;
  if (muPhuKienDau === 'khong') return null;

  return (
    <g>
      {muPhuKienDau === 'ngocQuanDaiLua' && (
        <g>
          {/* Hai dai lua vang ru sau gay */}
          <path d="M122 28 Q148 34 156 58 L148 62 Q140 42 120 33 Z" fill="#F2C14E" stroke={NET_VIEN} strokeWidth="2" />
          <path d="M120 32 Q145 45 148 70 L140 72 Q137 51 118 37 Z" fill="#E4A933" stroke={NET_VIEN} strokeWidth="2" />
          {/* Mu ngoc quan xanh ngoc vien vang */}
          <path d="M96 35 L98 20 Q110 15 122 20 L124 35 Z" fill="#3FA484" stroke={NET_VIEN} strokeWidth="2.3" />
          <rect x="94" y="31" width="32" height="6" rx="2.5" fill="#F2C14E" stroke={NET_VIEN} strokeWidth="2" />
        </g>
      )}
      {(muPhuKienDau === 'tramVangNgoc' || muPhuKienDau === 'tramHoaSu' || muPhuKienDau === 'tramNgocBich') && (
        <g>
          <line x1="88" y1="29" x2="132" y2="25" stroke="#F2C14E" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M97 32 L110 18 L123 32 Z" fill="#F2C14E" stroke={NET_VIEN} strokeWidth="2" />
          <circle cx="110" cy="26" r="5" fill="#42BFAC" stroke={NET_VIEN} strokeWidth="1.8" />
        </g>
      )}
      {(muPhuKienDau === 'hoaSuTrang' || muPhuKienDau === 'tramHoaSu') && (
        <g transform="translate(139, 55)">
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy="-6"
              rx="4.2"
              ry="6"
              fill="#FFFDF8"
              stroke={NET_VIEN}
              strokeWidth="1.6"
              transform={`rotate(${deg})`}
            />
          ))}
          <circle cx="0" cy="0" r="3.6" fill="#F5C922" stroke={NET_VIEN} strokeWidth="1.4" />
        </g>
      )}
      {muPhuKienDau === 'bangTranHoTam' && (
        <rect x="70" y="54" width="80" height="8" rx="3" fill="#C8372D" stroke="#F2C14E" strokeWidth="1.8" />
      )}
      {muPhuKienDau === 'maoBac' && (
        <path d="M96 36 L101 19 L110 24 L119 19 L124 36 Z" fill="#DCE6EA" stroke={NET_VIEN} strokeWidth="2.2" />
      )}
      {muPhuKienDau === 'longVuBachHac' && (
        <path d="M122 33 Q144 10 160 8 Q148 24 128 36 Z" fill="#FFFDF8" stroke="#9BB5C4" strokeWidth="1.8" />
      )}
      {muPhuKienDau === 'matNaHuyenBi' && (
        <path d="M74 79 Q110 73 146 79 L142 93 Q110 96 78 93 Z" fill="rgba(20,29,51,0.88)" stroke="#F2C14E" strokeWidth="2" />
      )}
      {muPhuKienDau === 'vongNhatNguyet' && (
        <circle cx="110" cy="24" r="11" fill="none" stroke="#F2D88B" strokeWidth="2.6" />
      )}
    </g>
  );
};

export const PhapKhiTayLop: React.FC<{
  ngoaiHinh: NgoaiHinh;
  tuThe: TuThe;
}> = ({ ngoaiHinh, tuThe }) => {
  const { phapKhi } = ngoaiHinh;
  if (phapKhi === 'khong' || tuThe === 'ngoiThien') return null;

  if (phapKhi === 'laBanVang') {
    return (
      <g transform="translate(152, 152)">
        <circle cx="12" cy="12" r="11" fill="#F2C14E" stroke={NET_VIEN} strokeWidth="2.2" />
        <circle cx="12" cy="12" r="7.5" fill="#FFFDF2" stroke={NET_VIEN} strokeWidth="1.5" />
        <polygon points="12,5.5 14,12 12,18.5 10,12" fill="#C8372D" />
        <circle cx="12" cy="12" r="1.6" fill="#F2C14E" />
      </g>
    );
  }

  if (phapKhi === 'banDoCuon') {
    return (
      <g transform="translate(46, 146)">
        <path
          d="M2 8 L46 2 L50 32 L6 38 Z"
          fill="#F4D799"
          stroke={NET_VIEN}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <rect x="-2" y="4" width="7" height="36" rx="3" fill="#CFA15C" stroke={NET_VIEN} strokeWidth="2" />
        <rect x="44" y="-1" width="7" height="36" rx="3" fill="#CFA15C" stroke={NET_VIEN} strokeWidth="2" />
        <path d="M12 19 Q24 14 36 22" fill="none" stroke="#9C5A2C" strokeWidth="1.6" strokeDasharray="3 2" />
        <path d="M26 8 L28 12 L32 14 L28 16 L26 20 L24 16 L20 14 L24 12 Z" fill="#FFF380" />
      </g>
    );
  }

  if (phapKhi === 'kiemGo') {
    return (
      <g transform="translate(156, 118) rotate(22)">
        <rect x="4" y="0" width="7" height="52" rx="2.5" fill="#B57B48" stroke={NET_VIEN} strokeWidth="2" />
        <rect x="-1" y="40" width="17" height="5" rx="2" fill="#F2C14E" stroke={NET_VIEN} strokeWidth="1.6" />
      </g>
    );
  }

  if (phapKhi === 'quatThuyMac') {
    return (
      <g transform="translate(148, 146)">
        <path d="M16 20 L0 6 A20 20 0 0 1 28 4 Z" fill="#F6EEDB" stroke={NET_VIEN} strokeWidth="2" />
        <line x1="16" y1="20" x2="12" y2="5" stroke="#8F1F1A" strokeWidth="1.4" />
      </g>
    );
  }

  if (phapKhi === 'butChuSa') {
    return (
      <g transform="translate(158, 130) rotate(14)">
        <rect x="3" y="8" width="5" height="40" rx="2" fill="#8F1F1A" stroke={NET_VIEN} strokeWidth="1.8" />
        <polygon points="5.5,0 2,9 9,9" fill="#FFFDF8" stroke={NET_VIEN} strokeWidth="1.5" />
      </g>
    );
  }

  if (phapKhi === 'truongNgoc') {
    return (
      <g transform="translate(158, 92)">
        <line x1="8" y1="12" x2="8" y2="112" stroke="#42BFAC" strokeWidth="4.5" strokeLinecap="round" />
        <circle cx="8" cy="10" r="7.5" fill="#F2C14E" stroke={NET_VIEN} strokeWidth="2" />
      </g>
    );
  }

  // denLong
  return (
    <g transform="translate(152, 148)">
      <line x1="12" y1="0" x2="12" y2="12" stroke="#F2C14E" strokeWidth="2" />
      <rect x="4" y="12" width="16" height="20" rx="5" fill="#F2C14E" stroke={NET_VIEN} strokeWidth="2" />
    </g>
  );
};
