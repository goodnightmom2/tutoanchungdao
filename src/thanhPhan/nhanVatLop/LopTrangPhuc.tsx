import React from 'react';
import { NgoaiHinh, TuThe } from '../../kieuDuLieu/troChoi';

const NET_VIEN = '#4A2E20';

export const BaLoLop: React.FC<{
  ngoaiHinh: NgoaiHinh;
  tuThe: TuThe;
}> = ({ ngoaiHinh, tuThe }) => {
  const { baLo, mauBaLo } = ngoaiHinh.trangPhuc;
  if (baLo === 'khong' || tuThe === 'ngoiThien') return null;

  if (baLo === 'baLoDaNau') {
    return (
      <g>
        {/* Kiem go cam cheo sau lung */}
        <g transform="translate(132, 100) rotate(32)">
          <rect x="0" y="-12" width="10" height="78" rx="3" fill="#B57B48" stroke={NET_VIEN} strokeWidth="2.4" />
          <rect x="-5" y="16" width="20" height="6" rx="2" fill="#E4BC5A" stroke={NET_VIEN} strokeWidth="2" />
          <rect x="2" y="-22" width="6" height="12" rx="2" fill="#7A472A" stroke={NET_VIEN} strokeWidth="2" />
        </g>
        {/* Ba lo da nau */}
        <path
          d="M126 122 Q158 118 162 146 Q162 174 134 176 L122 172 Z"
          fill={mauBaLo || '#7A543E'}
          stroke={NET_VIEN}
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path
          d="M128 124 Q156 122 158 138 L128 140 Z"
          fill="#996B4F"
          stroke={NET_VIEN}
          strokeWidth="2"
        />
        <rect x="142" y="137" width="6" height="8" rx="1.5" fill="#F2C14E" stroke={NET_VIEN} strokeWidth="1.5" />
      </g>
    );
  }

  if (baLo === 'baLoVanXoayAmDuong') {
    return (
      <g>
        {/* Cuon tranh van xoan tren dinh ba lo */}
        <rect
          x="126"
          y="112"
          width="34"
          height="16"
          rx="8"
          fill="#4AA9B8"
          stroke={NET_VIEN}
          strokeWidth="2.4"
        />
        <circle cx="155" cy="120" r="6" fill="#2A7483" stroke={NET_VIEN} strokeWidth="1.6" />
        <path d="M153 120 A2.5 2.5 0 1 1 157 120" fill="none" stroke="#F6EEDB" strokeWidth="1.3" />
        {/* Than ba lo */}
        <rect
          x="126"
          y="124"
          width="34"
          height="50"
          rx="12"
          fill={mauBaLo || '#876045'}
          stroke={NET_VIEN}
          strokeWidth="2.5"
        />
        {/* An Am Duong tron ben hong */}
        <circle cx="147" cy="154" r="10.5" fill="#F6EEDB" stroke={NET_VIEN} strokeWidth="2" />
        <path d="M147 143.5 A10.5 10.5 0 0 1 147 164.5 A5.25 5.25 0 0 1 147 154 A5.25 5.25 0 0 0 147 143.5 Z" fill="#272936" />
        <circle cx="147" cy="148.8" r="1.8" fill="#F6EEDB" />
        <circle cx="147" cy="159.2" r="1.8" fill="#272936" />
      </g>
    );
  }

  if (baLo === 'hoLoLon') {
    return (
      <g transform="translate(138, 128)">
        <circle cx="12" cy="12" r="11" fill={mauBaLo || '#A97C50'} stroke={NET_VIEN} strokeWidth="2.4" />
        <circle cx="12" cy="34" r="15" fill={mauBaLo || '#A97C50'} stroke={NET_VIEN} strokeWidth="2.4" />
        <path d="M0 24 Q12 20 24 24" stroke="#C8372D" strokeWidth="3.5" fill="none" />
      </g>
    );
  }

  // tuiCanKhon
  return (
    <g>
      <path
        d="M126 128 Q154 134 152 168 Q138 176 124 166 Z"
        fill={mauBaLo || '#2D6B8E'}
        stroke={NET_VIEN}
        strokeWidth="2.4"
      />
      <circle cx="140" cy="149" r="4" fill="#F2C14E" stroke={NET_VIEN} strokeWidth="1.5" />
    </g>
  );
};

export const ChanVaGiayLop: React.FC<{
  ngoaiHinh: NgoaiHinh;
  tuThe: TuThe;
}> = ({ ngoaiHinh, tuThe }) => {
  const { giay, mauGiay, vayQuan, mauVayQuan } = ngoaiHinh.trangPhuc;
  const dangDi = tuThe === 'di' || tuThe === 'chay';
  const ngonChan = ngoaiHinh.mauDa;

  if (tuThe === 'ngoiThien') {
    return (
      <g>
        <path
          d="M66 196 Q110 184 154 196 Q160 214 132 216 L88 216 Q60 214 66 196 Z"
          fill={mauVayQuan}
          stroke={NET_VIEN}
          strokeWidth="2.5"
        />
        <ellipse cx="78" cy="211" rx="13" ry="7" fill={mauGiay} stroke={NET_VIEN} strokeWidth="2.2" />
        <ellipse cx="142" cy="211" rx="13" ry="7" fill={mauGiay} stroke={NET_VIEN} strokeWidth="2.2" />
      </g>
    );
  }

  const veMotChan = (x: number, laTrai: boolean) => {
    const laTatTrang = giay === 'giayQuaiTatTrang';
    const laGiayVai = giay === 'giayVai' || giay === 'giayTienVan';
    return (
      <g className={dangDi ? (laTrai ? 'anim-di-chan-trai' : 'anim-di-chan-phai') : ''}>
        {/* Ong chan / quan */}
        <rect
          x={x - 10}
          y="180"
          width="20"
          height="26"
          rx="7"
          fill={laTatTrang ? '#FFFDF8' : vayQuan === 'vayVanMay' || vayQuan === 'vayDaiTrang' || vayQuan === 'vayHoaDao' || vayQuan === 'vayTienTu' ? ngonChan : mauVayQuan}
          stroke={NET_VIEN}
          strokeWidth="2.4"
        />
        {/* Giay / ung */}
        <path
          d={
            laTatTrang || laGiayVai
              ? `M${x - 11} 204 L${x + 11} 204 Q${x + 14} 224 ${x + 6} 227 L${x - 11} 227 Q${x - 15} 221 ${x - 11} 204 Z`
              : `M${x - 12} 194 L${x + 12} 194 L${x + 13} 224 Q${x + 5} 228 ${x - 12} 227 Q${x - 16} 218 ${x - 12} 194 Z`
          }
          fill={mauGiay}
          stroke={NET_VIEN}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Vien vang ung */}
        {!laTatTrang && !laGiayVai && (
          <path
            d={`M${x - 12} 195 Q${x} 200 ${x + 12} 195`}
            fill="none"
            stroke={ngoaiHinh.trangPhuc.mauVienAo || '#F2C14E'}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        )}
        {/* Quai giay Moc Lan */}
        {laTatTrang && (
          <>
            <path d={`M${x - 10} 204 Q${x} 209 ${x + 10} 204`} fill="none" stroke="#F2C14E" strokeWidth="2.2" />
            <ellipse cx={x} cy="212" rx="6" ry="2.6" fill="#FFFDF8" opacity="0.65" />
          </>
        )}
        {/* De giay */}
        <path
          d={`M${x - 13} 224 L${x + 12} 224`}
          stroke="#F6EEDB"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>
    );
  };

  return (
    <g>
      {veMotChan(92, true)}
      {veMotChan(128, false)}
    </g>
  );
};

export const VayQuanLop: React.FC<{ ngoaiHinh: NgoaiHinh }> = ({
  ngoaiHinh,
}) => {
  const { vayQuan, mauVayQuan, mauVienAo } = ngoaiHinh.trangPhuc;
  const laVay =
    vayQuan === 'vayVanMay' ||
    vayQuan === 'vayDaiTrang' ||
    vayQuan === 'vayHoaDao' ||
    vayQuan === 'vayTienTu';

  if (laVay) {
    return (
      <g>
        <path
          d="M78 158 L142 158 L156 202 Q110 212 64 202 Z"
          fill={mauVayQuan}
          stroke={NET_VIEN}
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        {/* Hoa tiet van may vang theo Moc Lan */}
        {vayQuan === 'vayVanMay' && (
          <g fill="none" stroke={mauVienAo || '#F2C14E'} strokeWidth="2" strokeLinecap="round">
            <path d="M74 192 Q86 184 95 191 Q104 196 100 187" />
            <path d="M118 190 Q129 183 138 191 Q147 195 144 186" />
            <path d="M68 199 Q110 208 152 199" strokeWidth="2.6" />
          </g>
        )}
        {vayQuan === 'vayHoaDao' && (
          <g fill="#F7A7BA">
            <circle cx="84" cy="193" r="3.5" />
            <circle cx="110" cy="197" r="3.5" />
            <circle cx="136" cy="193" r="3.5" />
          </g>
        )}
        {vayQuan === 'vayTienTu' && (
          <path d="M68 199 Q110 208 152 199" fill="none" stroke="#F2C14E" strokeWidth="3" />
        )}
      </g>
    );
  }

  // Quan bo ong / quan vo phuc / quan rong
  return (
    <g>
      <path
        d="M80 158 L140 158 L144 192 L114 192 L110 178 L106 192 L76 192 Z"
        fill={mauVayQuan}
        stroke={NET_VIEN}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
    </g>
  );
};

export const AoNgoaiLop: React.FC<{ ngoaiHinh: NgoaiHinh }> = ({
  ngoaiHinh,
}) => {
  const { aoNgoai, mauAoNgoai, mauVienAo, mauVayQuan } = ngoaiHinh.trangPhuc;
  const laAoChoangVang = aoNgoai === 'vangKemTayRong' || aoNgoai === 'hongY';

  return (
    <g>
      {/* Ao trong khi mac ao choang mo ta nhu Moc Lan */}
      {laAoChoangVang ? (
        <g>
          {/* Co chéo trong mau ngoc bích */}
          <path
            d="M83 122 L137 122 L139 162 L81 162 Z"
            fill={mauVayQuan || '#42BFAC'}
            stroke={NET_VIEN}
            strokeWidth="2.4"
          />
          <path d="M93 122 L110 144 L127 122" fill="#FFFDF8" stroke={NET_VIEN} strokeWidth="2" />
          {/* Ta ao choang vang kem 2 ben */}
          <path
            d="M80 123 L96 125 L94 176 Q81 178 73 170 Z"
            fill={mauAoNgoai}
            stroke={NET_VIEN}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M140 123 L124 125 L126 176 Q139 178 147 170 Z"
            fill={mauAoNgoai}
            stroke={NET_VIEN}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M96 125 L94 174" stroke={mauVienAo} strokeWidth="2.4" />
          <path d="M124 125 L126 174" stroke={mauVienAo} strokeWidth="2.4" />
        </g>
      ) : (
        <g>
          {/* Han phuc co cheo Hai Minh / ao dao quan */}
          <path
            d="M79 124 Q110 120 141 124 L147 178 Q110 184 73 178 Z"
            fill={mauAoNgoai}
            stroke={NET_VIEN}
            strokeWidth="2.6"
            strokeLinejoin="round"
          />
          {/* Co giao linh cheo vien vang */}
          <path
            d="M91 123 L112 149 L129 123"
            fill="#FFFDF8"
            stroke={NET_VIEN}
            strokeWidth="2.2"
          />
          <path
            d="M90 123 L112 150 L127 123"
            fill="none"
            stroke={mauVienAo}
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          <path
            d="M74 176 Q110 183 146 176"
            fill="none"
            stroke={mauVienAo}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {aoNgoai === 'giapNhe' && (
            <path
              d="M86 136 L134 136 L128 158 L92 158 Z"
              fill="rgba(228,188,90,0.3)"
              stroke={mauVienAo}
              strokeWidth="1.8"
            />
          )}
        </g>
      )}
    </g>
  );
};

export const ThatLungLop: React.FC<{ ngoaiHinh: NgoaiHinh }> = ({
  ngoaiHinh,
}) => {
  const { thatLung, mauThatLung } = ngoaiHinh.trangPhuc;

  if (thatLung === 'daiLuaVanMay' || thatLung === 'daiChuSa') {
    return (
      <g>
        <path
          d="M77 156 Q110 163 143 156 L144 166 Q110 173 76 166 Z"
          fill={mauThatLung}
          stroke={NET_VIEN}
          strokeWidth="2.2"
        />
        {/* No dai lua + dai ru */}
        <path
          d="M104 164 Q96 182 90 192 Q97 195 103 184"
          fill={mauThatLung}
          stroke={NET_VIEN}
          strokeWidth="2"
        />
        <path
          d="M116 164 Q124 182 130 192 Q123 195 117 184"
          fill={mauThatLung}
          stroke={NET_VIEN}
          strokeWidth="2"
        />
        <circle cx="110" cy="164" r="5.5" fill="#F2C14E" stroke={NET_VIEN} strokeWidth="2" />
      </g>
    );
  }

  return (
    <g>
      <rect
        x="76"
        y="156"
        width="68"
        height="11"
        rx="4"
        fill={mauThatLung}
        stroke={NET_VIEN}
        strokeWidth="2.3"
      />
      {/* Khoa vang / ngoc boi */}
      <rect
        x="103"
        y="154"
        width="14"
        height="15"
        rx="3"
        fill={thatLung === 'daiNgoc' ? '#62D1B5' : '#F2C14E'}
        stroke={NET_VIEN}
        strokeWidth="2"
      />
    </g>
  );
};

export const GiapVaiLop: React.FC<{ ngoaiHinh: NgoaiHinh }> = ({
  ngoaiHinh,
}) => {
  const { giapVai } = ngoaiHinh.trangPhuc;
  if (giapVai === 'khong') return null;

  const veMotBen = (trai: boolean) => {
    const t = trai ? '' : 'translate(220, 0) scale(-1, 1)';
    if (giapVai === 'aoLong') {
      return (
        <g transform={t}>
          <path
            d="M66 130 Q74 114 91 122 Q88 136 72 138 Z"
            fill="#F6F2EA"
            stroke={NET_VIEN}
            strokeWidth="2.2"
          />
        </g>
      );
    }
    const mau = giapVai === 'kimLoai' ? '#AEB9C9' : '#8A5D41';
    const vien = giapVai === 'kimLoai' ? '#F6EEDB' : '#F2C14E';
    return (
      <g transform={t}>
        <path
          d="M62 135 Q68 115 92 121 L92 138 Q74 143 62 135 Z"
          fill={mau}
          stroke={NET_VIEN}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M66 131 Q78 122 90 126" fill="none" stroke={vien} strokeWidth="2.5" strokeLinecap="round" />
        {/* Hoa tiet rong cuon vang */}
        <circle cx="77" cy="131" r="3" fill={vien} />
      </g>
    );
  };

  return (
    <g>
      {veMotBen(true)}
      {veMotBen(false)}
    </g>
  );
};

export const TayVaHoUyenLop: React.FC<{
  ngoaiHinh: NgoaiHinh;
  tuThe: TuThe;
  ben: 'trai' | 'phai';
}> = ({ ngoaiHinh, tuThe, ben }) => {
  const { aoNgoai, mauAoNgoai, mauVienAo, hoUyen } = ngoaiHinh.trangPhuc;
  const laTayRong = aoNgoai === 'vangKemTayRong' || aoNgoai === 'bachY' || aoNgoai === 'hongY';
  const mauDa = ngoaiHinh.mauDa;

  let gocXoay = 0;
  let dichX = 0;
  let dichY = 0;

  if (ben === 'trai') {
    // Tay huong ve phia truoc (chi duong / cam ban do / chao)
    if (tuThe === 'chiDuong') {
      gocXoay = 64;
      dichX = -8;
      dichY = -4;
    } else if (tuThe === 'tanCong') {
      gocXoay = 48;
      dichY = -4;
    } else if (tuThe === 'chao' || tuThe === 'vuiMung') {
      gocXoay = 115;
      dichX = -6;
      dichY = -10;
    } else if (tuThe === 'niemChu') {
      gocXoay = -28;
      dichX = 12;
      dichY = -2;
    } else if (tuThe === 'ngoiThien') {
      gocXoay = -22;
      dichX = 14;
      dichY = 12;
    } else if (tuThe === 'di' || tuThe === 'chay') {
      gocXoay = 22;
    }
  } else {
    // Tay phai (cam la ban / ban do / kiem)
    if (tuThe === 'chiDuong' || tuThe === 'tanCong') {
      gocXoay = 35;
      dichX = -10;
      dichY = 2;
    } else if (tuThe === 'vuiMung') {
      gocXoay = -115;
      dichX = 6;
      dichY = -10;
    } else if (tuThe === 'niemChu') {
      gocXoay = 28;
      dichX = -12;
      dichY = -2;
    } else if (tuThe === 'ngoiThien') {
      gocXoay = 22;
      dichX = -14;
      dichY = 12;
    } else if (tuThe === 'di' || tuThe === 'chay') {
      gocXoay = -22;
    }
  }

  const gocGocX = ben === 'trai' ? 78 : 142;
  const gocGocY = 132;

  return (
    <g
      transform={`translate(${dichX}, ${dichY}) rotate(${gocXoay} ${gocGocX} ${gocGocY})`}
    >
      {/* Tay ao */}
      <path
        d={
          ben === 'trai'
            ? laTayRong
              ? 'M78 126 L53 156 L72 169 L87 139 Z'
              : 'M78 126 L56 158 L69 165 L86 138 Z'
            : laTayRong
            ? 'M142 126 L167 156 L148 169 L133 139 Z'
            : 'M142 126 L164 158 L151 165 L134 138 Z'
        }
        fill={mauAoNgoai}
        stroke={NET_VIEN}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Ho uyen */}
      {hoUyen !== 'khong' && (
        <rect
          x={ben === 'trai' ? 54 : 151}
          y="150"
          width="14"
          height="13"
          rx="3"
          fill={
            hoUyen === 'ngocBich'
              ? '#3FB59A'
              : hoUyen === 'thietGiap'
              ? '#8E99AD'
              : '#8A5D41'
          }
          stroke={mauVienAo || '#F2C14E'}
          strokeWidth="2"
        />
      )}
      {/* Ban tay tron mem */}
      <circle
        cx={ben === 'trai' ? 59 : 161}
        cy="165"
        r="7.5"
        fill={mauDa}
        stroke={NET_VIEN}
        strokeWidth="2.3"
      />
    </g>
  );
};
