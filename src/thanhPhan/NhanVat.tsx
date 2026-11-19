import React from 'react';
import { CanhGioi, NgoaiHinh, TuThe } from '../kieuDuLieu/troChoi';
import {
  HaoQuangDefs,
  HaoQuangLopSau,
  HaoQuangLopTruoc,
  layMaHaoQuangDuyNhat,
} from './HaoQuang';
import { TieuNon } from './TieuNon';
import {
  DauVaNguQuanLop,
  MuPhuKienDauLop,
  PhapKhiTayLop,
  TocSauLop,
  TocTruocLop,
} from './nhanVatLop/LopDauVaPhapKhi';
import {
  AoNgoaiLop,
  BaLoLop,
  ChanVaGiayLop,
  GiapVaiLop,
  TayVaHoUyenLop,
  ThatLungLop,
  VayQuanLop,
} from './nhanVatLop/LopTrangPhuc';

interface ThuocTinhNhanVat {
  ngoaiHinh: NgoaiHinh;
  tuThe?: TuThe;
  cheDo?: 'dungYen' | 'chao' | 'vanCong' | 'biThuong';
  huong?: 'trai' | 'phai';
  kichCo?: 'nho' | 'vua' | 'lon';
  canhGioi?: CanhGioi;
  cuongDoHaoQuang?: number;
  anHaoQuang?: boolean;
  className?: string;
}

const KICH_THUOC_LOP: Record<'nho' | 'vua' | 'lon', string> = {
  nho: 'w-14 h-16',
  vua: 'w-28 h-32',
  lon: 'w-48 h-56 sm:w-56 sm:h-64',
};

export const NhanVatLopTongHop: React.FC<{
  ngoaiHinh: NgoaiHinh;
  tuThe: TuThe;
  hienLinhThuKhac?: boolean;
  filterId?: string;
  laBongMo?: boolean;
}> = ({
  ngoaiHinh,
  tuThe,
  hienLinhThuKhac = true,
  filterId,
  laBongMo = false,
}) => (
  <g
    filter={filterId ? `url(#${filterId})` : undefined}
    style={laBongMo ? { filter: 'brightness(0.14) saturate(0.25)' } : undefined}
    opacity={laBongMo ? 0.9 : 1}
  >
    {/* Bong mat dat */}
    <ellipse cx="110" cy="230" rx="44" ry="8" fill="rgba(74,46,32,0.22)" />

    {/* Linh thu khac (neu khong phai Tieu Non) */}
    {hienLinhThuKhac && ngoaiHinh.linhThu === 'hoLyTrang' && (
      <g transform="translate(158, 178)">
        <ellipse cx="14" cy="18" rx="11" ry="9" fill="#FFFDF8" stroke="#4A2E20" strokeWidth="1.8" />
        <circle cx="14" cy="9" r="7.5" fill="#FFFDF8" stroke="#4A2E20" strokeWidth="1.8" />
        <polygon points="8,4 10,-3 13,3" fill="#FFFDF8" stroke="#4A2E20" strokeWidth="1.4" />
        <polygon points="20,4 18,-3 15,3" fill="#FFFDF8" stroke="#4A2E20" strokeWidth="1.4" />
        <circle cx="11.5" cy="8.5" r="1.3" fill="#C8372D" />
        <circle cx="16.5" cy="8.5" r="1.3" fill="#C8372D" />
      </g>
    )}
    {hienLinhThuKhac && ngoaiHinh.linhThu === 'hacGiay' && (
      <g transform="translate(162, 74)">
        <polygon points="12,12 2,6 10,16" fill="#F6EEDB" stroke="#4A2E20" strokeWidth="1.4" />
        <polygon points="12,12 24,5 15,17" fill="#EADDBE" stroke="#4A2E20" strokeWidth="1.4" />
        <polygon points="10,16 15,17 20,23" fill="#F6EEDB" stroke="#4A2E20" strokeWidth="1.4" />
      </g>
    )}
    {hienLinhThuKhac && ngoaiHinh.linhThu === 'ruaHuyenVu' && (
      <g transform="translate(158, 192)">
        <ellipse cx="14" cy="14" rx="12" ry="8" fill="#4E6B5E" stroke="#4A2E20" strokeWidth="1.8" />
        <circle cx="3" cy="14" r="3.5" fill="#6D8F7F" stroke="#4A2E20" strokeWidth="1.5" />
      </g>
    )}
    {hienLinhThuKhac && ngoaiHinh.linhThu === 'domDom' && (
      <g>
        <circle cx="42" cy="92" r="3.5" fill="#62D1B5" opacity="0.9" />
        <circle cx="176" cy="108" r="3" fill="#F2D88B" opacity="0.95" />
      </g>
    )}
    {hienLinhThuKhac && ngoaiHinh.linhThu === 'tieuThanhLong' && (
      <g transform="translate(154, 78)">
        <path
          d="M8 32 Q20 18 14 8 Q26 12 28 24 Q20 34 12 42"
          fill="none"
          stroke="#4FB477"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="14" cy="8" r="4.5" fill="#62D1B5" stroke="#4A2E20" strokeWidth="1.5" />
      </g>
    )}
    {hienLinhThuKhac && ngoaiHinh.linhThu === 'tieuPhuongHoang' && (
      <g transform="translate(154, 74)">
        <path
          d="M16 18 Q28 4 32 14 Q24 24 16 24"
          fill="#E4623A"
          stroke="#4A2E20"
          strokeWidth="1.4"
        />
        <circle cx="14" cy="16" r="4.8" fill="#F2C14E" stroke="#4A2E20" strokeWidth="1.5" />
      </g>
    )}

    {/* Ba lo & kiem sau lung */}
    <BaLoLop ngoaiHinh={ngoaiHinh} tuThe={tuThe} />

    {/* Toc sau */}
    <TocSauLop ngoaiHinh={ngoaiHinh} />

    {/* Chan & giay */}
    <ChanVaGiayLop ngoaiHinh={ngoaiHinh} tuThe={tuThe} />

    {/* Than (vay/quan, ao ngoai, that lung, giap vai) */}
    <VayQuanLop ngoaiHinh={ngoaiHinh} />
    <AoNgoaiLop ngoaiHinh={ngoaiHinh} />
    <ThatLungLop ngoaiHinh={ngoaiHinh} />
    <GiapVaiLop ngoaiHinh={ngoaiHinh} />

    {/* Tay trai (phia sau/huong ra) */}
    <TayVaHoUyenLop ngoaiHinh={ngoaiHinh} tuThe={tuThe} ben="trai" />

    {/* Dau, ngu quan, toc truoc, mu/tram */}
    <DauVaNguQuanLop ngoaiHinh={ngoaiHinh} tuThe={tuThe} />
    <TocTruocLop ngoaiHinh={ngoaiHinh} />
    <MuPhuKienDauLop ngoaiHinh={ngoaiHinh} />

    {/* Tay phai & phap khi cam tay */}
    <TayVaHoUyenLop ngoaiHinh={ngoaiHinh} tuThe={tuThe} ben="phai" />
    <PhapKhiTayLop ngoaiHinh={ngoaiHinh} tuThe={tuThe} />

    {/* Hieu ung tan cong / niem chu */}
    {(tuThe === 'tanCong' || tuThe === 'niemChu') && (
      <g opacity="0.85">
        <path
          d="M28 110 L32 117 L39 120 L32 123 L28 130 L24 123 L17 120 L24 117 Z"
          fill="#F2D88B"
        />
        <path
          d="M188 136 L191 142 L197 145 L191 148 L188 154 L185 148 L179 145 L185 142 Z"
          fill="#62D1B5"
        />
      </g>
    )}
  </g>
);

export const NhanVat: React.FC<ThuocTinhNhanVat> = ({
  ngoaiHinh,
  tuThe,
  cheDo,
  huong = 'phai',
  kichCo = 'vua',
  canhGioi = 'luyenKhi',
  cuongDoHaoQuang = 0.65,
  anHaoQuang = false,
  className = '',
}) => {
  const tuTheHienTai: TuThe =
    tuThe ||
    (cheDo === 'vanCong'
      ? 'niemChu'
      : cheDo === 'chao'
      ? 'chao'
      : cheDo === 'biThuong'
      ? 'biThuong'
      : 'dungYen');

  const lopChuyenDong =
    tuTheHienTai === 'nhay'
      ? 'anim-nhay-chibi'
      : tuTheHienTai === 'biThuong'
      ? 'anim-trung-don'
      : tuTheHienTai === 'niemChu'
      ? 'anim-lo-lung'
      : tuTheHienTai === 'dungYen'
      ? 'anim-tho-nhe'
      : '';

  const hienTieuNon = ngoaiHinh.linhThu === 'tieuNon' && kichCo !== 'nho';
  const maHq = layMaHaoQuangDuyNhat(
    `nv_${kichCo}`,
    canhGioi,
    'macDinh',
    cuongDoHaoQuang
  );

  return (
    <div
      className={`relative inline-flex items-end justify-center select-none shrink-0 ${KICH_THUOC_LOP[kichCo]} ${className}`}
    >
      <svg
        viewBox="0 0 220 250"
        className={`w-full h-full ${lopChuyenDong}`}
        style={{
          transform: huong === 'trai' ? 'scaleX(-1)' : undefined,
        }}
        role="img"
        aria-label={`Nhân vật ${ngoaiHinh.ten}`}
      >
        {!anHaoQuang && (
          <HaoQuangDefs
            maId={maHq}
            canhGioi={canhGioi}
            cuongDo={cuongDoHaoQuang}
            bienThe="macDinh"
          />
        )}

        {!anHaoQuang && kichCo !== 'nho' && (
          <HaoQuangLopSau
            maId={maHq}
            canhGioi={canhGioi}
            cuongDo={cuongDoHaoQuang}
            bienThe="macDinh"
            cx={110}
            cy={126}
          />
        )}

        <NhanVatLopTongHop
          ngoaiHinh={ngoaiHinh}
          tuThe={tuTheHienTai}
        />

        {!anHaoQuang && kichCo !== 'nho' && (
          <HaoQuangLopTruoc
            canhGioi={canhGioi}
            cuongDo={cuongDoHaoQuang}
            bienThe="macDinh"
          />
        )}
      </svg>

      {hienTieuNon && (
        <div
          className={`pointer-events-none absolute -bottom-1 ${
            huong === 'trai' ? '-left-4' : '-right-4'
          }`}
        >
          <TieuNon
            bieuCam={
              tuTheHienTai === 'biThuong'
                ? 'loLang'
                : tuTheHienTai === 'vuiMung' || tuTheHienTai === 'tanCong'
                ? 'coVu'
                : 'vui'
            }
            className={kichCo === 'lon' ? 'w-16 h-18' : 'w-11 h-12'}
          />
        </div>
      )}
    </div>
  );
};

// Hinh thu nho tung mon do trong Phong Thay Do (khong dung chu thay hinh)
export const XemTruocMonDo: React.FC<{
  ngoaiHinh: NgoaiHinh;
  loai:
    | 'aoNgoai'
    | 'vayQuan'
    | 'giapVai'
    | 'hoUyen'
    | 'thatLung'
    | 'giay'
    | 'baLo'
    | 'toc'
    | 'muPhuKienDau'
    | 'phapKhi';
  ma: string;
}> = ({ ngoaiHinh, loai, ma }) => {
  const mauThu: NgoaiHinh = {
    ...ngoaiHinh,
    trangPhuc: {
      ...ngoaiHinh.trangPhuc,
      ...(loai === 'aoNgoai' ? { aoNgoai: ma } : {}),
      ...(loai === 'vayQuan' ? { vayQuan: ma } : {}),
      ...(loai === 'giapVai' ? { giapVai: ma } : {}),
      ...(loai === 'hoUyen' ? { hoUyen: ma } : {}),
      ...(loai === 'thatLung' ? { thatLung: ma } : {}),
      ...(loai === 'giay' ? { giay: ma } : {}),
      ...(loai === 'baLo' ? { baLo: ma } : {}),
    },
    ...(loai === 'toc' ? { toc: ma } : {}),
    ...(loai === 'muPhuKienDau' ? { muPhuKienDau: ma } : {}),
    ...(loai === 'phapKhi' ? { phapKhi: ma } : {}),
  };

  const viewBox =
    loai === 'toc' || loai === 'muPhuKienDau'
      ? '52 10 116 115'
      : loai === 'giay'
      ? '55 170 110 72'
      : loai === 'vayQuan' || loai === 'thatLung'
      ? '52 145 116 70'
      : loai === 'baLo'
      ? '110 95 75 95'
      : loai === 'phapKhi'
      ? '125 90 85 100'
      : '45 110 130 90';

  return (
    <svg viewBox={viewBox} className="w-12 h-12 mx-auto" aria-hidden="true">
      {loai === 'toc' && (
        <>
          <TocSauLop ngoaiHinh={mauThu} />
          <circle cx="110" cy="82" r="34" fill={mauThu.mauDa} stroke="#4A2E20" strokeWidth="2" />
          <TocTruocLop ngoaiHinh={mauThu} />
        </>
      )}
      {loai === 'muPhuKienDau' && (
        <>
          <circle cx="110" cy="76" r="32" fill={mauThu.mauDa} stroke="#4A2E20" strokeWidth="2" opacity="0.45" />
          <TocTruocLop ngoaiHinh={mauThu} />
          <MuPhuKienDauLop ngoaiHinh={mauThu} />
        </>
      )}
      {loai === 'aoNgoai' && <AoNgoaiLop ngoaiHinh={mauThu} />}
      {loai === 'vayQuan' && <VayQuanLop ngoaiHinh={mauThu} />}
      {loai === 'giapVai' && (
        <>
          <AoNgoaiLop ngoaiHinh={mauThu} />
          <GiapVaiLop ngoaiHinh={mauThu} />
        </>
      )}
      {loai === 'hoUyen' && <TayVaHoUyenLop ngoaiHinh={mauThu} tuThe="dungYen" ben="trai" />}
      {loai === 'thatLung' && <ThatLungLop ngoaiHinh={mauThu} />}
      {loai === 'giay' && <ChanVaGiayLop ngoaiHinh={mauThu} tuThe="dungYen" />}
      {loai === 'baLo' && <BaLoLop ngoaiHinh={mauThu} tuThe="dungYen" />}
      {loai === 'phapKhi' && (
        <g transform={ma === 'banDoCuon' ? 'translate(92, -32)' : ''}>
          <PhapKhiTayLop ngoaiHinh={mauThu} tuThe="dungYen" />
        </g>
      )}
    </svg>
  );
};
