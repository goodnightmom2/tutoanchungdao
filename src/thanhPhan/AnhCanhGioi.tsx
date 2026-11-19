import React from 'react';
import {
  BienTheHaoQuang,
  CanhGioi,
  NgoaiHinh,
  TienTrinhNguoiChoi,
  TrangThaiAnhCanhGioi,
  TuThe,
} from '../kieuDuLieu/troChoi';
import { layThongTinHaoQuang, tinhCuongDoHaoQuang } from '../logic/tienTrinh';
import {
  HaoQuangDefs,
  HaoQuangLopSau,
  HaoQuangLopTruoc,
  layMaHaoQuangDuyNhat,
} from './HaoQuang';
import { NhanVatLopTongHop } from './NhanVat';

export interface ThuocTinhAnhCanhGioi {
  ngoaiHinh: NgoaiHinh;
  canhGioi: CanhGioi;
  trangThai?: TrangThaiAnhCanhGioi;
  cuongDo?: number;
  tienTrinh?: TienTrinhNguoiChoi;
  bienThe?: BienTheHaoQuang;
  kichCo?: 'nho' | 'vua' | 'lon' | 'cucLon';
  tuThe?: TuThe;
  giamHieuUng?: boolean;
  svgRef?: React.RefObject<SVGSVGElement | null>;
  className?: string;
}

const KICH_THUOC_ANH: Record<'nho' | 'vua' | 'lon' | 'cucLon', string> = {
  nho: 'w-24 h-28',
  vua: 'w-36 h-40',
  lon: 'w-48 h-52 sm:w-56 sm:h-60',
  cucLon: 'w-60 h-68 sm:w-68 sm:h-76',
};

const TU_THE_CANH_GIOI: Record<CanhGioi | 'tienQuang', TuThe> = {
  phamNhan: 'chao',
  luyenKhi: 'niemChu',
  trucCo: 'tanCong',
  kimDan: 'chao',
  nguyenAnh: 'niemChu',
  hoaThan: 'tanCong',
  doKiep: 'tanCong',
  tienQuang: 'vuiMung',
};

const BeDaiCanhGioi: React.FC<{
  canhGioi: CanhGioi;
  bienThe: BienTheHaoQuang;
  laBongMo: boolean;
}> = ({ canhGioi, bienThe, laBongMo }) => {
  const loai = bienThe === 'tienQuang' ? 'tienQuang' : canhGioi;
  const doMo = laBongMo ? 0.45 : 1;

  return (
    <g transform="translate(0, 224)" opacity={doMo}>
      {loai === 'phamNhan' && (
        <g>
          <ellipse cx="140" cy="40" rx="88" ry="20" fill="#3D5A3E" stroke="#243825" strokeWidth="2" />
          <ellipse cx="140" cy="36" rx="76" ry="15" fill="#5A8752" />
          <path d="M98 38 Q140 28 182 38" fill="none" stroke="#B7A37F" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
          <circle cx="78" cy="38" r="3" fill="#FFFDF8" />
          <circle cx="200" cy="35" r="3.2" fill="#F2C14E" />
        </g>
      )}

      {loai === 'luyenKhi' && (
        <g>
          <path d="M52 44 Q82 22 140 24 Q198 22 228 44 Q188 60 140 60 Q92 60 52 44 Z" fill="#184740" stroke="#3FB59A" strokeWidth="2" />
          <ellipse cx="140" cy="36" rx="72" ry="14" fill="#2A7567" />
          <path d="M74 36 Q140 44 206 36" fill="none" stroke="#62D1B5" strokeWidth="1.6" opacity="0.8" />
        </g>
      )}

      {loai === 'trucCo' && (
        <g>
          <polygon points="56,42 92,26 188,26 224,42 192,58 88,58" fill="#133355" stroke="#4A9BE0" strokeWidth="2.2" />
          <polygon points="68,37 98,25 182,25 212,37 182,49 98,49" fill="#1E5588" stroke="#7DD3FC" strokeWidth="1.4" />
          <line x1="108" y1="31" x2="172" y2="31" stroke="#62D1B5" strokeWidth="1.5" strokeDasharray="4 4" />
        </g>
      )}

      {loai === 'kimDan' && (
        <g>
          <ellipse cx="140" cy="46" rx="86" ry="18" fill="#5A3F13" stroke="#E4BC5A" strokeWidth="2.2" />
          <ellipse cx="140" cy="38" rx="74" ry="14" fill="#8D641C" stroke="#FFF1A8" strokeWidth="1.6" />
          {/* Canh sen dong vang */}
          {[-48, -24, 0, 24, 48].map((dx, i) => (
            <path
              key={i}
              d={`M${140 + dx - 14} 42 Q${140 + dx} 24 ${140 + dx + 14} 42 Z`}
              fill="#E4BC5A"
              stroke="#4A2E20"
              strokeWidth="1.2"
              opacity="0.9"
            />
          ))}
        </g>
      )}

      {loai === 'nguyenAnh' && (
        <g>
          <ellipse cx="140" cy="46" rx="88" ry="16" fill="#231647" stroke="#B79CFF" strokeWidth="2" />
          <ellipse cx="140" cy="37" rx="72" ry="12" fill="#3B2475" stroke="#E9D8FF" strokeWidth="1.5" />
          <polygon points="72,38 80,18 88,38" fill="#B79CFF" stroke="#231647" strokeWidth="1.2" />
          <polygon points="192,38 200,18 208,38" fill="#E9D8FF" stroke="#231647" strokeWidth="1.2" />
        </g>
      )}

      {loai === 'hoaThan' && (
        <g>
          <path d="M48 44 Q90 22 140 24 Q190 22 232 44 Q195 62 140 62 Q85 62 48 44 Z" fill="#381414" stroke="#E4623A" strokeWidth="2.2" />
          <ellipse cx="140" cy="36" rx="74" ry="13" fill="#63221D" stroke="#F2C14E" strokeWidth="1.5" />
          <path d="M84 42 Q110 34 134 42 T192 40" fill="none" stroke="#F2C14E" strokeWidth="1.8" opacity="0.85" />
        </g>
      )}

      {loai === 'doKiep' && (
        <g>
          <polygon points="48,46 86,24 194,24 232,46 198,62 82,62" fill="#160F2E" stroke="#7A4DFF" strokeWidth="2.2" />
          <polygon points="64,39 94,25 186,25 216,39 186,51 94,51" fill="#2A1D54" stroke="#D6C2FF" strokeWidth="1.4" />
          <rect x="66" y="14" width="10" height="24" rx="2" fill="#231747" stroke="#B79CFF" strokeWidth="1.4" />
          <rect x="204" y="14" width="10" height="24" rx="2" fill="#231747" stroke="#B79CFF" strokeWidth="1.4" />
        </g>
      )}

      {loai === 'tienQuang' && (
        <g>
          <path
            d="M44 42 Q76 18 112 30 Q140 16 168 30 Q204 18 236 42 Q204 60 140 60 Q76 60 44 42 Z"
            fill="#F6EEDB"
            stroke="#E4BC5A"
            strokeWidth="2.2"
          />
          <ellipse cx="140" cy="36" rx="74" ry="12" fill="#FFFDF8" stroke="#62D1B5" strokeWidth="1.4" />
        </g>
      )}
    </g>
  );
};

export const AnhCanhGioi: React.FC<ThuocTinhAnhCanhGioi> = ({
  ngoaiHinh,
  canhGioi,
  trangThai = 'dangTuLuyen',
  cuongDo,
  tienTrinh,
  bienThe = 'macDinh',
  kichCo = 'vua',
  tuThe,
  giamHieuUng = false,
  svgRef,
  className = '',
}) => {
  const cuongDoThuc =
    typeof cuongDo === 'number'
      ? cuongDo
      : tienTrinh
      ? tinhCuongDoHaoQuang(tienTrinh, canhGioi, trangThai)
      : trangThai === 'daDotPha'
      ? 1.0
      : trangThai === 'chuaMo'
      ? 0.25
      : 0.65;

  const laBongMo = trangThai === 'chuaMo';
  const ttHq = layThongTinHaoQuang(canhGioi, bienThe);
  const tuTheDung: TuThe =
    tuThe || TU_THE_CANH_GIOI[bienThe === 'tienQuang' ? 'tienQuang' : canhGioi];
  const maHq = layMaHaoQuangDuyNhat(
    `acg_${kichCo}_${trangThai}`,
    canhGioi,
    bienThe,
    cuongDoThuc
  );

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${KICH_THUOC_ANH[kichCo]} ${className}`}
    >
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 280 296"
        className="w-full h-full overflow-visible"
        role="img"
        aria-label={`${ngoaiHinh.ten} · ${ttHq.tenHaoQuang}`}
      >
        <HaoQuangDefs
          maId={maHq}
          canhGioi={canhGioi}
          cuongDo={cuongDoThuc}
          bienThe={bienThe}
        />

        {/* Hao quang lopSau */}
        <HaoQuangLopSau
          maId={maHq}
          canhGioi={canhGioi}
          cuongDo={cuongDoThuc}
          bienThe={bienThe}
          giamHieuUng={giamHieuUng || laBongMo}
          cx={140}
          cy={142}
        />

        {/* Be dai rieng cua tung canh gioi */}
        <BeDaiCanhGioi
          canhGioi={canhGioi}
          bienThe={bienThe}
          laBongMo={laBongMo}
        />

        {/* Nhan vat trong khung Anh Canh Gioi */}
        <g transform="translate(30, 14)">
          <NhanVatLopTongHop
            ngoaiHinh={ngoaiHinh}
            tuThe={tuTheDung}
            hienLinhThuKhac={!laBongMo}
            laBongMo={laBongMo}
          />
        </g>

        {/* Suong mu nhe che bong mo neu chua mo */}
        {laBongMo && (
          <g opacity="0.58">
            <path
              d="M52 214 Q96 196 140 212 T228 208 Q242 224 214 236 L68 236 Q40 226 52 214 Z"
              fill="#CBD5E1"
            />
          </g>
        )}

        {/* Hao quang lopTruoc */}
        {!laBongMo && (
          <HaoQuangLopTruoc
            canhGioi={canhGioi}
            cuongDo={cuongDoThuc}
            bienThe={bienThe}
            giamHieuUng={giamHieuUng}
            dx={30}
            dy={14}
          />
        )}
      </svg>
    </div>
  );
};
