import React, { useEffect, useMemo, useRef, useState } from 'react';
import { boPhatAmThanh } from '../amThanh/boPhatAmThanh';
import { layThongTinCanhGioi } from '../duLieu/canhGioi';
import { timVatPham } from '../duLieu/vatPham';
import { layThongTinYeuVuong } from '../duLieu/yeuVuong';
import {
  CauHoi,
  Kinh,
  MaCanhGioi,
  TienTrinhNguoiChoi,
  TuThe,
} from '../kieuDuLieu/troChoi';
import { bocCauHoi } from '../logic/bocCauHoi';
import { layKinhLienQuanChoCauHoi } from '../logic/tangKinhCac';
import {
  dinhDangNguonCau,
  layThongTinHaoQuang,
  THU_TU_CANH_GIOI,
  tinhChiSoNhanVat,
  tinhKetQuaPhiThang,
} from '../logic/tienTrinh';
import { chamDapAn } from '../logic/toanHoc';
import { xuatSvgThanhPng } from '../logic/xuatAnhPng';
import {
  dinhDangPhanTramYeuLuc,
  layMocPhaYeuVuong,
  layPhaYeuVuongHienTai,
  tinhSatThuongLenYeuVuong,
} from '../logic/yeuVuong';
import { AnhCanhGioi } from '../thanhPhan/AnhCanhGioi';
import {
  BieuTuongGoiY,
  BieuTuongLinhLuc,
  BieuTuongSamSet,
  BieuTuongTangKinhCac,
} from '../thanhPhan/BieuTuong';
import { CanhNenChibi } from '../thanhPhan/CanhNenChibi';
import { CongThucToan } from '../thanhPhan/CongThucToan';
import { HinhVe } from '../thanhPhan/HinhVe';
import { HopThoaiKinh } from '../thanhPhan/HopThoaiKinh';
import {
  AnTrienChuSa,
  CuonThuGiayDo,
  NutLenhBai,
} from '../thanhPhan/KhungGiaoDien';
import { NhanVat } from '../thanhPhan/NhanVat';
import { YeuVuongSvg } from '../thanhPhan/YeuVuongSvg';

export interface KetQuaYeuVuong {
  thanhCong: boolean;
  canhGioiVuot: MaCanhGioi;
  canhGioiMoi: MaCanhGioi;
  soCauDung: number;
  tongCau: number;
  linhLucConLai: number;
  danhHieuCuoi?: 'chanTien' | 'tanTien' | null;
}

export const ManYeuVuong: React.FC<{
  canhGioi: MaCanhGioi;
  nganHangCauHoi: CauHoi[];
  tienTrinh: TienTrinhNguoiChoi;
  khiHoanThanh: (kq: KetQuaYeuVuong) => void;
  khiThoat: () => void;
  khiTieuHaoVatPham: (id: string) => void;
  khiTraLoiSai?: (cauId: string, canhGioi: MaCanhGioi) => void;
  khiTraLoiDung?: (cauId: string, canhGioi: MaCanhGioi) => void;
  khiBaoCauSai?: (cau: CauHoi) => void;
  khiDocKinhLanDau?: (maKinh: string) => void;
  khiChuyenDaThuocKinh?: (maKinh: string) => void;
  khiChuyenSoTayKinh?: (maKinh: string) => void;
}> = ({
  canhGioi,
  nganHangCauHoi,
  tienTrinh,
  khiHoanThanh,
  khiThoat,
  khiTieuHaoVatPham,
  khiTraLoiSai,
  khiTraLoiDung,
  khiBaoCauSai,
  khiDocKinhLanDau,
  khiChuyenDaThuocKinh,
  khiChuyenSoTayKinh,
}) => {
  const boss = layThongTinYeuVuong(canhGioi);
  const chiSo = useMemo(() => tinhChiSoNhanVat(tienTrinh), [tienTrinh]);
  const batDongHo = tienTrinh.caiDat.batDongHoYeuVuong;

  // Bo cau hoi dinh phong + hau ky tu bocCauHoi (Do Kiep tron toan chuong)
  const [boCauHoi] = useState<CauHoi[]>(() =>
    bocCauHoi({
      nganHang: nganHangCauHoi,
      tienTrinh,
      canhGioi,
      giaiDoan: 'yeuVuong',
      soLuong: canhGioi === 'doKiep' ? 20 : Math.max(16, boss.soDonCanN + 6),
      luotMo: tienTrinh.lichSu.length + 1,
    })
  );

  const [chiSoCau, setChiSoCau] = useState(0);
  const [yeuLuc, setYeuLuc] = useState(100);
  const [linhLuc, setLinhLuc] = useState(chiSo.linhLucToiDa);
  const [chuoiNgoDao, setChuoiNgoDao] = useState(0);
  const [soCauDung, setSoCauDung] = useState(0);
  const [tongCauDaLam, setTongCauDaLam] = useState(0);

  const [phuongAnChon, setPhuongAnChon] = useState<number | null>(null);
  const [soNhap, setSoNhap] = useState('');
  const [daCham, setDaCham] = useState(false);
  const [vuaDung, setVuaDung] = useState(false);
  const [hienGoiY, setHienGoiY] = useState(false);
  const [phuongAnBiAn, setPhuongAnBiAn] = useState<number[]>([]);
  const [giayConLai, setGiayConLai] = useState(45);

  const [tuTheNv, setTuTheNv] = useState<TuThe>('tanCong');
  const [trangThaiBoss, setTrangThaiBoss] = useState<'binhThuong' | 'trungDon' | 'noiGian'>('binhThuong');
  const [satThuongBay, setSatThuongBay] = useState<{
    id: number;
    chu: string;
    chiMang: boolean;
  } | null>(null);

  const [tonKhoPhu, setTonKhoPhu] = useState<Record<string, number>>({
    phuThoiDien: tienTrinh.tuiDo.phuThoiDien || 0,
    phuKhamPha: tienTrinh.tuiDo.phuKhamPha || 0,
    phuHoiLinh: tienTrinh.tuiDo.phuHoiLinh || 0,
    loiPhu: tienTrinh.tuiDo.loiPhu || 0,
    thanhTamDan: tienTrinh.tuiDo.thanhTamDan || 0,
    hoMachDan: tienTrinh.tuiDo.hoMachDan || 0,
  });

  const [kinhDangXem, setKinhDangXem] = useState<Kinh[]>([]);
  const [tauHoa, setTauHoa] = useState(false);
  const [buocHoatAnh, setBuocHoatAnh] = useState(0);
  const [ketQuaCuoi, setKetQuaCuoi] = useState<KetQuaYeuVuong | null>(null);
  const [daLuuAnh, setDaLuuAnh] = useState(false);
  const svgDotPhaRef = useRef<SVGSVGElement | null>(null);

  const phaHienTai = layPhaYeuVuongHienTai(yeuLuc, boss.soPha);
  const tamMaKiepManTim =
    canhGioi === 'doKiep' || (Boolean(boss.tamMaKiepPha2) && phaHienTai >= 2);
  const cauHienTai = boCauHoi[chiSoCau % Math.max(1, boCauHoi.length)];
  const idxCanhTiep = Math.min(
    THU_TU_CANH_GIOI.indexOf(canhGioi) + 1,
    THU_TU_CANH_GIOI.length - 1
  );
  const canhGioiTiep = THU_TU_CANH_GIOI[idxCanhTiep];

  useEffect(() => {
    boPhatAmThanh.phatAmGamYeuVuong();
  }, []);

  // Dem nguoc 45s neu batDongHoYeuVuong = true
  useEffect(() => {
    if (!batDongHo || daCham || tauHoa || ketQuaCuoi) return;
    const t = window.setInterval(() => {
      setGiayConLai((g) => {
        if (g <= 1) {
          window.clearInterval(t);
          return 0;
        }
        return g - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [batDongHo, daCham, tauHoa, ketQuaCuoi, chiSoCau]);

  useEffect(() => {
    if (batDongHo && giayConLai === 0 && !daCham && !tauHoa && !ketQuaCuoi) {
      xuLyNop(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [giayConLai]);

  const dungVatPham = (id: string) => {
    setTonKhoPhu((cu) => ({ ...cu, [id]: Math.max(0, (cu[id] || 0) - 1) }));
    khiTieuHaoVatPham(id);
  };

  const moKetThucThang = (tongDung: number, tongLam: number, llCon: number) => {
    const danhHieuCuoi =
      canhGioi === 'doKiep'
        ? tinhKetQuaPhiThang(tongDung, tongLam, llCon > 0, llCon)
        : null;
    boPhatAmThanh.phatAmNgoDao();
    setKetQuaCuoi({
      thanhCong: true,
      canhGioiVuot: canhGioi,
      canhGioiMoi: canhGioiTiep,
      soCauDung: tongDung,
      tongCau: tongLam,
      linhLucConLai: llCon,
      danhHieuCuoi,
    });
    setBuocHoatAnh(1);
  };

  const xuLyNop = (hetGio = false) => {
    if (!cauHienTai || daCham) return;
    const dung =
      !hetGio &&
      chamDapAn(
        cauHienTai,
        cauHienTai.dang === 'dienSo' ? soNhap : (phuongAnChon ?? -1)
      );

    setDaCham(true);
    setVuaDung(dung);
    setTongCauDaLam((t) => t + 1);

    if (dung) {
      khiTraLoiDung?.(cauHienTai.id, canhGioi);
      const chuoiMoi = chuoiNgoDao + 1;
      setChuoiNgoDao(chuoiMoi);
      const giayDaTraLoi = 45 - giayConLai;
      const kqDmg = tinhSatThuongLenYeuVuong({
        tongDonN: boss.soDonCanN,
        giayTraLoi: batDongHo ? giayDaTraLoi : 12,
        chuoiNgoDao: chuoiMoi,
        heSoPhiKiem: chiSo.tangSatThuongYeuVuong,
      });

      const yeuLucMoi = Math.max(0, Number((yeuLuc - kqDmg.satThuong).toFixed(1)));
      setYeuLuc(yeuLucMoi);
      setSoCauDung((s) => s + 1);
      setTuTheNv('tanCong');
      setTrangThaiBoss('trungDon');
      setSatThuongBay({
        id: Date.now(),
        chu: `-${kqDmg.satThuong.toFixed(1).replace('.', ',')}%${kqDmg.chiMang ? ' Chí mạng!' : ''}`,
        chiMang: kqDmg.chiMang,
      });
      boPhatAmThanh.phatAmKiemKhi();
      window.setTimeout(() => {
        setTrangThaiBoss(phaHienTai >= 2 ? 'noiGian' : 'binhThuong');
      }, 650);

      if (yeuLucMoi <= 0) {
        window.setTimeout(() => {
          moKetThucThang(soCauDung + 1, tongCauDaLam + 1, linhLuc);
        }, 700);
      }
    } else {
      khiTraLoiSai?.(cauHienTai.id, canhGioi);
      setChuoiNgoDao(0);
      setTuTheNv('biThuong');
      setTrangThaiBoss('noiGian');
      boPhatAmThanh.phatAmSamSet();
      const llMoi = Math.max(0, linhLuc - 1);
      setLinhLuc(llMoi);
      if (llMoi <= 0) {
        setTauHoa(true);
      }
    }
  };

  const dungLoiPhu = () => {
    if ((tonKhoPhu.loiPhu || 0) <= 0 || ketQuaCuoi) return;
    boPhatAmThanh.phatAmSamSet();
    dungVatPham('loiPhu');
    const yeuLucMoi = Math.max(0, Number((yeuLuc - 10).toFixed(1)));
    setYeuLuc(yeuLucMoi);
    setTrangThaiBoss('trungDon');
    setSatThuongBay({
      id: Date.now(),
      chu: '-10,0% Lôi Phù!',
      chiMang: true,
    });
    window.setTimeout(() => {
      setTrangThaiBoss(phaHienTai >= 2 ? 'noiGian' : 'binhThuong');
    }, 600);
    if (yeuLucMoi <= 0) {
      moKetThucThang(soCauDung, Math.max(1, tongCauDaLam), linhLuc);
    }
  };

  const chuyenCauTiep = () => {
    if (yeuLuc <= 0) {
      moKetThucThang(soCauDung, tongCauDaLam, linhLuc);
      return;
    }
    boPhatAmThanh.phatAmNhanNut();
    setChiSoCau((i) => i + 1);
    setPhuongAnChon(null);
    setSoNhap('');
    setDaCham(false);
    setVuaDung(false);
    setHienGoiY(false);
    setPhuongAnBiAn([]);
    setGiayConLai(45);
    setTuTheNv('dungYen');
  };

  // Nghi thuc Dot Pha 4 pha sau khi ha guc Yeu Vuong
  if (ketQuaCuoi) {
    const buocMoTa = [
      'Tụ Linh: Thu liễm yêu khí tan biến hóa thành linh khí thuần khiết...',
      'Lôi Kích: Đón nhận đòn lôi kiếp rèn giũa đạo thể...',
      'Phá Cảnh: Xé tan xiềng xích cảnh giới cũ...',
      ketQuaCuoi.canhGioiVuot === 'doKiep'
        ? ketQuaCuoi.danhHieuCuoi === 'chanTien'
          ? 'Phi Thăng Chứng Đạo: Chân Long Phượng Hoàng giáng lâm!'
          : 'Ngộ Đạo Phi Thăng: Thành tựu Tán Tiên tự tại!'
        : `Ngộ Đạo Thành Công: Bước vào cảnh giới ${layThongTinCanhGioi(ketQuaCuoi.canhGioiMoi).ten}!`,
    ];

    if (ketQuaCuoi.thanhCong && buocHoatAnh > 0 && buocHoatAnh < 4) {
      return (
        <div className="min-h-[82vh] max-w-xl mx-auto px-4 py-8 flex flex-col items-center justify-center text-center">
          <div className="khung-ngoc-gian rounded-2xl p-6 w-full border-[#E4BC5A]">
            <div className="dau-an-trang-tri text-sm font-bold uppercase text-[#E4BC5A] mb-2">
              Phá Cảnh Phi Thăng
            </div>
            <h2 className="tieu-de-vang text-2xl font-bold">
              Nghi Thức Đột Phá · Pha {buocHoatAnh}/4
            </h2>
            <div className="my-6 flex justify-center relative">
              <svg viewBox="0 0 220 140" className="w-56 h-36" aria-hidden="true">
                <circle
                  cx="110"
                  cy="70"
                  r={30 + buocHoatAnh * 14}
                  fill="none"
                  stroke="#E4BC5A"
                  strokeWidth="1.6"
                  strokeDasharray="6 4"
                  opacity="0.7"
                />
                {buocHoatAnh >= 2 && (
                  <polyline
                    points="40,10 85,52 72,62 110,108"
                    fill="none"
                    stroke="#B79CFF"
                    strokeWidth="2.5"
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <NhanVat
                  ngoaiHinh={tienTrinh.ngoaiHinh}
                  kichCo="vua"
                  tuThe="vuiMung"
                  canhGioi={ketQuaCuoi.canhGioiMoi}
                />
              </div>
            </div>
            <p className="text-sm text-[#DCE6EA] mb-5">{buocMoTa[buocHoatAnh - 1]}</p>
            <div className="flex justify-center gap-3">
              <NutLenhBai type="button" kieu="tram" onClick={() => setBuocHoatAnh(4)}>
                Bỏ qua hoạt ảnh
              </NutLenhBai>
              <NutLenhBai
                type="button"
                kieu="vang"
                onClick={() => {
                  boPhatAmThanh.phatAmNgoDao();
                  setBuocHoatAnh((b) => b + 1);
                }}
              >
                Tiếp tục pha kế
              </NutLenhBai>
            </div>
          </div>
        </div>
      );
    }

    const laDoKiep = ketQuaCuoi.canhGioiVuot === 'doKiep';
    const ttHaoQuangMoi = layThongTinHaoQuang(
      ketQuaCuoi.canhGioiMoi,
      laDoKiep ? 'tienQuang' : 'macDinh'
    );

    return (
      <div className="max-w-xl mx-auto px-4 py-8 pb-24">
        <CuonThuGiayDo className="text-center">
          {ketQuaCuoi.thanhCong && laDoKiep && (
            <svg viewBox="0 0 280 95" className="w-64 h-24 mx-auto mb-2" aria-hidden="true">
              <path d="M25 65 Q65 20 115 48 T205 32 Q235 20 255 40" fill="none" stroke="#1E7F6B" strokeWidth="5" strokeLinecap="round" />
              <circle cx="255" cy="39" r="7" fill="#E4BC5A" />
              <path d="M90 78 Q145 55 210 72 Q238 78 260 62" fill="none" stroke="#C8372D" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          )}
          <div className="dau-an-trang-tri text-xs font-bold uppercase text-[#8F1F1A]">
            {ketQuaCuoi.thanhCong ? 'Yêu Vương Quy Hàng' : 'Đạo Tâm Chưa Vững'}
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2118] mt-1">
            {laDoKiep
              ? ketQuaCuoi.danhHieuCuoi === 'chanTien'
                ? 'Chứng Đạo Chân Tiên!'
                : 'Thành Tựu Tán Tiên!'
              : `Hàng Phục ${boss.ten} · Đột Phá ${layThongTinCanhGioi(ketQuaCuoi.canhGioiMoi).ten}!`}
          </h2>
          <p className="text-sm text-[#2B2118]/85 mt-2">
            Đạo hữu đã tung {ketQuaCuoi.soCauDung} đòn chuẩn xác (còn {ketQuaCuoi.linhLucConLai} Linh lực) để hạ gục {boss.ten}!
          </p>
          {laDoKiep && ketQuaCuoi.danhHieuCuoi === 'tanTien' && (
            <p className="text-xs text-[#6B3B2A] mt-1">
              Giữ còn ≥3 Linh lực ở trận Thiên Lôi Chân Long để đạt danh hiệu Chân Tiên!
            </p>
          )}

          {/* The phan thuong hao quang canh gioi moi mo */}
          <div className="mt-4 rounded-xl border border-[#B98B2E]/55 bg-[#0D1424] p-4 flex flex-col items-center text-center">
            <div className="text-xs font-bold text-[#62D1B5] uppercase tracking-wide mb-1">
              Mở khóa Hào Quang Cảnh Giới Mới
            </div>
            <AnhCanhGioi
              svgRef={svgDotPhaRef}
              ngoaiHinh={tienTrinh.ngoaiHinh}
              canhGioi={ketQuaCuoi.canhGioiMoi}
              trangThai="daDotPha"
              bienThe={laDoKiep ? 'tienQuang' : 'macDinh'}
              kichCo="lon"
              giamHieuUng={tienTrinh.caiDat.giamHieuUng}
              tienTrinh={tienTrinh}
            />
            <div className="text-base font-bold text-[#F2D88B] mt-2">
              {ttHaoQuangMoi.tenHaoQuang}
            </div>
            <p className="text-xs text-[#DCE6EA]/80 mt-0.5 max-w-sm">
              {ttHaoQuangMoi.moTa}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <NutLenhBai
                type="button"
                kieu="tram"
                onClick={async () => {
                  const ok = await xuatSvgThanhPng(
                    svgDotPhaRef.current,
                    `dot-pha-${ketQuaCuoi.canhGioiMoi}.png`
                  );
                  if (ok) setDaLuuAnh(true);
                }}
              >
                {daLuuAnh ? 'Đã lưu ảnh PNG ✓' : 'Lưu ảnh cảnh giới'}
              </NutLenhBai>
              <NutLenhBai type="button" kieu="vang" onClick={() => khiHoanThanh(ketQuaCuoi)}>
                Khải hoàn về Vân Hải
              </NutLenhBai>
            </div>
          </div>
        </CuonThuGiayDo>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-3 pb-24 md:pb-10 space-y-3.5">
      {/* San dau chibi hai ben */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-[#B79CFF]/55 shadow-[0_14px_34px_rgba(7,11,20,0.5)]">
        <div className="absolute inset-0">
          <CanhNenChibi canhGioi={canhGioi} className="w-full h-full" />
          {tamMaKiepManTim && (
            <div className="absolute inset-0 bg-[#3B176E]/48 pointer-events-none" />
          )}
        </div>

        <div className="relative z-10 p-3.5 sm:p-4 space-y-3">
          {/* Thanh dau tren cung */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#070B14]/75 backdrop-blur-sm rounded-xl px-3 py-2 border border-[#E4BC5A]/30">
            <div className="flex items-center gap-2">
              <BieuTuongSamSet className="w-5 h-5" />
              <div>
                <div className="text-xs font-bold text-[#F2D88B]">
                  {boss.ten} · Pha {phaHienTai}/{boss.soPha}: {boss.tenPha[phaHienTai - 1]}
                </div>
                <div className="text-[11px] text-[#DCE6EA]/85">{boss.danhXung}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {batDongHo && (
                <span className="px-2.5 py-1 rounded bg-[#141D33] border border-[#C8372D]/60 text-xs font-bold text-[#F2D88B] chu-so-bang">
                  {giayConLai}s
                </span>
              )}
              <button
                type="button"
                onClick={khiThoat}
                className="min-h-[34px] px-2.5 rounded bg-[#0D1424] border border-[#B79CFF]/45 text-xs text-[#DCE6EA] cursor-pointer"
              >
                Rút lui
              </button>
            </div>
          </div>

          {/* Thanh Mau Yeu Luc theo % + vach pha 66% / 33% */}
          <div className="bg-[#070B14]/78 backdrop-blur-sm rounded-xl p-2.5 border border-[#B79CFF]/35">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-[#E5DAFF] dau-an-trang-tri">
                {boss.ten} · Yêu Lực
              </span>
              <span className="font-bold text-[#F2D88B] chu-so-bang">
                {dinhDangPhanTramYeuLuc(yeuLuc)}
              </span>
            </div>
            <div className="relative h-4 rounded-full bg-[#12162A] border border-[#4C5978] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#C8372D] via-[#E4623A] to-[#B79CFF] transition-all duration-500"
                style={{ width: `${Math.max(0, Math.min(100, yeuLuc))}%` }}
              />
              {layMocPhaYeuVuong(boss.soPha).map((moc) => (
                <div
                  key={moc}
                  className="absolute top-0 bottom-0 w-0.5 bg-[#FFF7DF]"
                  style={{ left: `${moc}%` }}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>

          {/* Hai phe doi dau */}
          <div className="grid grid-cols-2 items-end pt-2 pb-1">
            {/* Nhan vat nguoi choi ben trai */}
            <div className="flex flex-col items-center">
              <NhanVat
                ngoaiHinh={tienTrinh.ngoaiHinh}
                kichCo="vua"
                tuThe={tuTheNv}
                huong="phai"
                canhGioi={canhGioi}
              />
              <div className="mt-1 bg-[#070B14]/80 rounded-lg px-2.5 py-1 border border-[#3FB59A]/45 flex items-center gap-1">
                {Array.from({ length: chiSo.linhLucToiDa }).map((_, i) => (
                  <BieuTuongLinhLuc
                    key={i}
                    trangThai={i < linhLuc ? 'day' : 'trong'}
                    className="w-4 h-4"
                  />
                ))}
              </div>
            </div>

            {/* Yeu Vuong ben phai */}
            <div className="relative flex flex-col items-center">
              {satThuongBay && (
                <div
                  key={satThuongBay.id}
                  className={`anim-bay-sat-thuong absolute -top-2 z-20 px-2.5 py-0.5 rounded-full text-xs font-extrabold shadow-md chu-so-bang ${
                    satThuongBay.chiMang
                      ? 'bg-[#E4BC5A] text-[#2B1A12]'
                      : 'bg-[#C8372D] text-[#FAF4E8]'
                  }`}
                >
                  {satThuongBay.chu}
                </div>
              )}
              <YeuVuongSvg
                maYeuVuong={boss.ma}
                trangThai={trangThaiBoss}
                pha={phaHienTai}
                className="w-32 h-32 sm:w-40 sm:h-40"
              />
              {chiSo.tangSatThuongYeuVuong > 0 && (
                <span className="mt-1 px-2 py-0.5 rounded bg-[#070B14]/80 text-[11px] font-semibold text-[#62D1B5]">
                  Phi Kiếm +{Math.round(chiSo.tangSatThuongYeuVuong * 100)}% ST
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cuon thu cau hoi chien dau */}
      {cauHienTai && (
        <CuonThuGiayDo>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6B3B2A] mb-2">
            <span className="font-bold">
              Trận Đấu Yêu Vương · Trả lời ≤10s hoặc Ngộ Đạo ≥3 kích hoạt Chí Mạng (+50% ST)
            </span>
            {chuoiNgoDao >= 2 && (
              <span className="font-bold text-[#1E7F6B] chu-so-bang">
                Ngộ Đạo chuỗi {chuoiNgoDao}
              </span>
            )}
          </div>

          <div className="text-base sm:text-lg font-medium text-[#2B2118] leading-relaxed">
            <CongThucToan noiDung={cauHienTai.deBai} />
          </div>

          {cauHienTai.hinhVe && <HinhVe hinh={cauHienTai.hinhVe} />}

          {hienGoiY && (
            <div className="mt-3 rounded-lg border border-[#1E7F6B]/45 bg-[#1E7F6B]/10 p-3 text-sm text-[#174C41]">
              <strong>Thôi diễn gợi ý: </strong>
              <CongThucToan noiDung={cauHienTai.goiY} />
            </div>
          )}

          <div className="mt-4">
            {cauHienTai.dang === 'dienSo' ? (
              <input
                type="text"
                inputMode="decimal"
                disabled={daCham}
                value={soNhap}
                onChange={(e) => setSoNhap(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !daCham && soNhap.trim()) xuLyNop(false);
                }}
                placeholder="Nhập đáp án số..."
                aria-label="Nhập đáp án số"
                className="w-full min-h-[48px] px-4 rounded-lg bg-white/85 border-2 border-[#7A4DFF]/55 text-[#2B2118] text-lg font-semibold chu-so-bang"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(cauHienTai.luaChon || []).map((lc, idx) => {
                  const biAn = phuongAnBiAn.includes(idx);
                  const dangChon = phuongAnChon === idx;
                  const laDung = idx === Number(cauHienTai.dapAn);
                  let lop = 'bg-[#FFFDF8] border-[#B98B2E]/45 text-[#2B2118]';
                  if (daCham) {
                    if (laDung) lop = 'bg-[#1E7F6B] border-[#0E4A3E] text-[#F8F6EE]';
                    else if (dangChon) lop = 'bg-[#C8372D] border-[#8F1F1A] text-[#FAF4E8]';
                  } else if (dangChon) {
                    lop = 'bg-[#141D33] border-[#B79CFF] text-[#E5DAFF]';
                  }
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={daCham || biAn}
                      onClick={() => {
                        boPhatAmThanh.phatAmNhanNut();
                        setPhuongAnChon(idx);
                      }}
                      className={`min-h-[50px] px-3 py-2 rounded-lg border-2 text-left flex items-center gap-2.5 cursor-pointer ${
                        biAn ? 'opacity-20 line-through' : ''
                      } ${lop}`}
                    >
                      <AnTrienChuSa
                        chu={['A', 'B', 'C', 'D'][idx] || String(idx + 1)}
                        kichThuoc="nho"
                      />
                      <span className="text-sm font-medium">
                        <CongThucToan noiDung={lc} />
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {daCham && (
            <div
              className={`mt-4 rounded-lg border p-3 text-sm ${
                vuaDung
                  ? 'bg-[#1E7F6B]/14 border-[#1E7F6B] text-[#124238]'
                  : 'bg-[#C8372D]/12 border-[#C8372D] text-[#6E1A15]'
              }`}
            >
              <div className="font-bold mb-1">
                {vuaDung
                  ? 'Tung kiếm khí chuẩn xác! Yêu Vương trúng đòn!'
                  : 'Yêu Vương phản kích (-1 Linh lực)!'}
              </div>
              <div className="text-[#2B2118]">
                <CongThucToan noiDung={cauHienTai.loiGiai} />
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-[#6B3B2A]">
                  Nguồn: {dinhDangNguonCau(cauHienTai.nguon)}
                  {cauHienTai.laAISinh ? ' · AI sinh' : ''}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {khiBaoCauSai && (
                    <button
                      type="button"
                      onClick={() => khiBaoCauSai(cauHienTai)}
                      className="px-2.5 py-1 rounded border border-[#8F1F1A]/40 text-[#8F1F1A] hover:bg-[#C8372D]/10 text-xs font-semibold cursor-pointer"
                    >
                      Báo câu sai
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setKinhDangXem(layKinhLienQuanChoCauHoi(cauHienTai))}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141D33] text-[#F2D88B] text-xs font-semibold cursor-pointer"
                  >
                    <BieuTuongTangKinhCac className="w-3.5 h-3.5" />
                    Xem kinh liên quan
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                disabled={(tonKhoPhu.loiPhu || 0) <= 0 || yeuLuc <= 0}
                onClick={dungLoiPhu}
                className="min-h-[38px] px-3 rounded bg-[#7A4DFF] text-white text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                Lôi Phù -10% ({tonKhoPhu.loiPhu || 0})
              </button>

              <button
                type="button"
                disabled={daCham || hienGoiY || (tonKhoPhu.phuThoiDien || 0) <= 0}
                onClick={() => {
                  dungVatPham('phuThoiDien');
                  setHienGoiY(true);
                }}
                className="min-h-[38px] px-2.5 rounded bg-[#141D33] text-[#F2D88B] text-xs font-semibold flex items-center gap-1 disabled:opacity-40 cursor-pointer"
              >
                <BieuTuongGoiY className="w-3.5 h-3.5" />
                Thôi Diễn ({tonKhoPhu.phuThoiDien || 0})
              </button>

              {cauHienTai.dang === 'tracNghiem' && (
                <button
                  type="button"
                  disabled={
                    daCham ||
                    phuongAnBiAn.length > 0 ||
                    (tonKhoPhu.phuKhamPha || 0) <= 0
                  }
                  onClick={() => {
                    const sai = (cauHienTai.luaChon || [])
                      .map((_, i) => i)
                      .filter((i) => i !== Number(cauHienTai.dapAn))
                      .slice(0, 2);
                    dungVatPham('phuKhamPha');
                    setPhuongAnBiAn(sai);
                  }}
                  className="min-h-[38px] px-2.5 rounded bg-[#141D33] text-[#62D1B5] text-xs font-semibold disabled:opacity-40 cursor-pointer"
                >
                  50:50 ({tonKhoPhu.phuKhamPha || 0})
                </button>
              )}

              <button
                type="button"
                disabled={linhLuc >= chiSo.linhLucToiDa || (tonKhoPhu.phuHoiLinh || 0) <= 0}
                onClick={() => {
                  dungVatPham('phuHoiLinh');
                  setLinhLuc((l) => Math.min(chiSo.linhLucToiDa, l + 1));
                }}
                className="min-h-[38px] px-2.5 rounded bg-[#141D33] text-[#62D1B5] text-xs font-semibold disabled:opacity-40 cursor-pointer"
              >
                Hồi Linh ({tonKhoPhu.phuHoiLinh || 0})
              </button>
            </div>

            {!daCham ? (
              <NutLenhBai
                type="button"
                kieu="ngoc"
                disabled={
                  cauHienTai.dang === 'dienSo' ? !soNhap.trim() : phuongAnChon === null
                }
                onClick={() => xuLyNop(false)}
              >
                Xuất chiêu công kích
              </NutLenhBai>
            ) : (
              <NutLenhBai type="button" kieu="vang" onClick={chuyenCauTiep}>
                {yeuLuc <= 0 ? 'Xem kết quả Đột Phá' : 'Đòn tiếp theo'}
              </NutLenhBai>
            )}
          </div>
        </CuonThuGiayDo>
      )}

      <HopThoaiKinh
        mo={kinhDangXem.length > 0}
        dong={() => setKinhDangXem([])}
        danhSachKinh={kinhDangXem}
        tienTrinh={tienTrinh}
        khiDocLanDau={khiDocKinhLanDau}
        khiChuyenDaThuoc={khiChuyenDaThuocKinh}
        khiChuyenSoTay={khiChuyenSoTayKinh}
      />

      {tauHoa && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="khung-ngoc-gian rounded-xl p-6 max-w-md w-full text-center border-[#C8372D]">
            <div className="dau-an-trang-tri text-xs font-bold uppercase text-[#F28A80]">
              Tẩu Hỏa Nhập Ma
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#F6EEDB] mt-1">
              Linh Lực Cạn Kiệt Trước Yêu Vương
            </h3>
            <p className="text-sm text-[#DCE6EA]/85 mt-2">
              {boss.ten} quá hung mãnh! Hãy dùng đan dược để tiếp tục hoặc rút lui ôn luyện thêm.
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              {(tonKhoPhu.thanhTamDan || 0) > 0 && (
                <NutLenhBai
                  type="button"
                  kieu="vang"
                  onClick={() => {
                    dungVatPham('thanhTamDan');
                    setLinhLuc(chiSo.linhLucToiDa);
                    setTauHoa(false);
                    if (daCham) chuyenCauTiep();
                  }}
                >
                  Dùng {timVatPham('thanhTamDan')?.ten} hồi đầy (Còn {tonKhoPhu.thanhTamDan})
                </NutLenhBai>
              )}
              {(tonKhoPhu.hoMachDan || 0) > 0 && (
                <NutLenhBai
                  type="button"
                  kieu="ngoc"
                  onClick={() => {
                    dungVatPham('hoMachDan');
                    setLinhLuc(chiSo.linhLucToiDa);
                    setTauHoa(false);
                    if (daCham) chuyenCauTiep();
                  }}
                >
                  Dùng {timVatPham('hoMachDan')?.ten} hồi sinh (Còn {tonKhoPhu.hoMachDan})
                </NutLenhBai>
              )}
              <NutLenhBai type="button" kieu="tram" onClick={khiThoat}>
                Rút lui dưỡng thương
              </NutLenhBai>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
