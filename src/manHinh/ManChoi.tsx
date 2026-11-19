import React, { useEffect, useMemo, useRef, useState } from 'react';
import { boPhatAmThanh } from '../amThanh/boPhatAmThanh';
import { layThongTinCanhGioi } from '../duLieu/canhGioi';
import { timVatPham } from '../duLieu/vatPham';
import {
  CauHoi,
  Kinh,
  MaCanhGioi,
  MaGiaiDoan,
  TienTrinhNguoiChoi,
} from '../kieuDuLieu/troChoi';
import { bocCauHoi } from '../logic/bocCauHoi';
import { layKinhLienQuanChoCauHoi } from '../logic/tangKinhCac';
import {
  dinhDangNguonCau,
  tinhChiSoNhanVat,
  tinhSoSaoMan,
} from '../logic/tienTrinh';
import { chamDapAn } from '../logic/toanHoc';
import {
  BieuTuongGoiY,
  BieuTuongKiem,
  BieuTuongLinhKhi,
  BieuTuongLinhLuc,
  BieuTuongLinhThach,
  BieuTuongMayTinh,
  BieuTuongSao,
  BieuTuongTamMa,
  BieuTuongTangKinhCac,
} from '../thanhPhan/BieuTuong';
import { CongThucToan } from '../thanhPhan/CongThucToan';
import { HinhVe } from '../thanhPhan/HinhVe';
import { HopThoaiKinh } from '../thanhPhan/HopThoaiKinh';
import {
  AnTrienChuSa,
  CuonThuGiayDo,
  NutLenhBai,
} from '../thanhPhan/KhungGiaoDien';
import { NhanVat } from '../thanhPhan/NhanVat';
import { ThienCoToanBan } from '../thanhPhan/ThienCoToanBan';

export interface KetQuaManChoi {
  thang: boolean;
  canhGioi: MaCanhGioi;
  giaiDoan: MaGiaiDoan;
  soCauDung: number;
  tongCau: number;
  soSao: number;
  linhKhiNhan: number;
  linhThachNhan: number;
  chuoiNgoDaoMax: number;
  daDietTamMa: boolean;
  laDauPhap: boolean;
  thangDauPhap?: boolean;
  cauDaLamIds: string[];
  phuDaDung: Record<string, number>;
}

const TEN_DOI_THU = [
  'Đệ tử Thiên Cơ Tông · Lục Tử',
  'Đệ tử Hắc Toán Môn · Mạc Vô',
  'Trưởng lão Ngoại Môn · Bạch Vân',
];

export const ManChoi: React.FC<{
  canhGioi: MaCanhGioi;
  giaiDoan: MaGiaiDoan;
  nganHangCauHoi: CauHoi[];
  tienTrinh: TienTrinhNguoiChoi;
  khiHoanThanh: (ketQua: KetQuaManChoi) => void;
  khiThoat: () => void;
  khiTieuHaoVatPham: (vatPhamId: string) => void;
  khiTraLoiSai?: (cauId: string, canhGioi: MaCanhGioi) => void;
  khiTraLoiDung?: (cauId: string, canhGioi: MaCanhGioi) => void;
  khiBaoCauSai?: (cau: CauHoi) => void;
  khiDocKinhLanDau?: (maKinh: string) => void;
  khiChuyenDaThuocKinh?: (maKinh: string) => void;
  khiChuyenSoTayKinh?: (maKinh: string) => void;
}> = ({
  canhGioi,
  giaiDoan,
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
  const thongTinCg = layThongTinCanhGioi(canhGioi);
  const thongTinGd =
    thongTinCg.giaiDoan.find((g) => g.ma === giaiDoan) || thongTinCg.giaiDoan[0];
  const laDauPhap = Boolean(thongTinGd.laDauPhap);
  const tongCau = laDauPhap ? 3 : 5;

  const chiSo = useMemo(() => tinhChiSoNhanVat(tienTrinh), [tienTrinh]);

  const danhSachNguon = useMemo(() => {
    const locChuan = nganHangCauHoi.filter(
      (c) => c.canhGioi === canhGioi && c.giaiDoan === giaiDoan
    );
    return locChuan.length >= tongCau
      ? locChuan
      : nganHangCauHoi.filter((c) => c.canhGioi === canhGioi);
  }, [nganHangCauHoi, canhGioi, giaiDoan, tongCau]);

  const [boCauHoi, setBoCauHoi] = useState<CauHoi[]>(() =>
    bocCauHoi({
      nganHang: nganHangCauHoi,
      tienTrinh,
      canhGioi,
      giaiDoan,
      soLuong: tongCau,
      loaiTruIds: tienTrinh.cauHoiDaAn,
      luotMo: tienTrinh.lichSu.length,
    })
  );
  const [chiSoCau, setChiSoCau] = useState(0);
  const [linhLuc, setLinhLuc] = useState(chiSo.linhLucToiDa);
  const [linhLucCu, setLinhLucCu] = useState(chiSo.linhLucToiDa);
  const [daMienSai, setDaMienSai] = useState(false);

  const [chuoiDung, setChuoiDung] = useState(0);
  const [chuoiSai, setChuoiSai] = useState(0);
  const [chuoiNgoDaoMax, setChuoiNgoDaoMax] = useState(0);
  const [soCauDung, setSoCauDung] = useState(0);
  const [linhKhiTichLuy, setLinhKhiTichLuy] = useState(0);
  const [linhThachTichLuy, setLinhThachTichLuy] = useState(0);

  // Trang thai tra loi tung cau
  const [phuongAnChon, setPhuongAnChon] = useState<number | null>(null);
  const [soNhap, setSoNhap] = useState('');
  const [daCham, setDaCham] = useState(false);
  const [vuaDung, setVuaDung] = useState(false);
  const [hienGoiY, setHienGoiY] = useState(false);
  const [mienPhiGoiY, setMienPhiGoiY] = useState(chiSo.tangPhuThoiDienDauTran);
  const [phuongAnBiAn, setPhuongAnBiAn] = useState<number[]>([]);

  // May tinh Thien Co Toan Ban & Kinh lien quan
  const [moMayTinh, setMoMayTinh] = useState(false);
  const [kinhDangXem, setKinhDangXem] = useState<Kinh[]>([]);

  // Tam Ma
  const [cauTamMa, setCauTamMa] = useState<CauHoi | null>(null);
  const [daDietTamMa, setDaDietTamMa] = useState(false);

  // Dau Phap dem nguoc + diem doi thu
  const thoiGianMoiCau = 30 + chiSo.congThoiGianDauPhap;
  const [giayConLai, setGiayConLai] = useState(thoiGianMoiCau);
  const [diemDoiThu, setDiemDoiThu] = useState(0);
  const [tenDoiThu] = useState(
    () => TEN_DOI_THU[Math.floor(Math.random() * TEN_DOI_THU.length)]
  );

  // Tau hoa nhap ma / Ket thuc man
  const [tauHoa, setTauHoa] = useState(false);
  const [ketThuc, setKetThuc] = useState<KetQuaManChoi | null>(null);
  const [tamDung, setTamDung] = useState(false);
  const [phuDaDung] = useState<Record<string, number>>({});

  // So luong phu hien co (dong bo cuc bo de giam ngay khi bam)
  const [tonKhoPhu, setTonKhoPhu] = useState<Record<string, number>>({
    phuThoiDien: tienTrinh.tuiDo.phuThoiDien || 0,
    phuKhamPha: tienTrinh.tuiDo.phuKhamPha || 0,
    phuHoiLinh: tienTrinh.tuiDo.phuHoiLinh || 0,
    phuHoanDe: tienTrinh.tuiDo.phuHoanDe || 0,
    thanhTamDan: tienTrinh.tuiDo.thanhTamDan || 0,
    hoMachDan: tienTrinh.tuiDo.hoMachDan || 0,
  });

  const oNhapRef = useRef<HTMLInputElement | null>(null);
  const cauHienTai = cauTamMa || boCauHoi[chiSoCau];

  // Dem nguoc trong Dau Phap
  useEffect(() => {
    if (!laDauPhap || daCham || tauHoa || ketThuc || tamDung || cauTamMa) return;
    const timer = window.setInterval(() => {
      setGiayConLai((g) => {
        if (g <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return g - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [laDauPhap, daCham, tauHoa, ketThuc, tamDung, cauTamMa, chiSoCau]);

  // Het gio trong Dau Phap -> tinh sai
  useEffect(() => {
    if (laDauPhap && giayConLai === 0 && !daCham && !tauHoa && !ketThuc) {
      xuLyNopBai(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [giayConLai]);

  // Phim tat 1-4 / A-D va Enter
  useEffect(() => {
    const xuLyPhim = (e: KeyboardEvent) => {
      if (moMayTinh || tauHoa || ketThuc || tamDung) return;
      const dangGo =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA';

      if (e.key === 'Escape') {
        setTamDung(true);
        return;
      }

      if (!daCham && cauHienTai && cauHienTai.dang !== 'dienSo' && !dangGo) {
        const mapPhim: Record<string, number> = {
          '1': 0,
          '2': 1,
          '3': 2,
          '4': 3,
          a: 0,
          b: 1,
          c: 2,
          d: 3,
          A: 0,
          B: 1,
          C: 2,
          D: 3,
        };
        const idx = mapPhim[e.key];
        if (
          idx !== undefined &&
          cauHienTai.luaChon &&
          idx < cauHienTai.luaChon.length &&
          !phuongAnBiAn.includes(idx)
        ) {
          e.preventDefault();
          boPhatAmThanh.phatAmNhanNut();
          setPhuongAnChon(idx);
        }
      }

      if (e.key === 'Enter' && !dangGo) {
        e.preventDefault();
        if (!daCham) {
          if (cauHienTai?.dang === 'dienSo' ? soNhap.trim() : phuongAnChon !== null) {
            xuLyNopBai(false);
          }
        } else {
          chuyenCauTiep();
        }
      }
    };
    window.addEventListener('keydown', xuLyPhim);
    return () => window.removeEventListener('keydown', xuLyPhim);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moMayTinh, tauHoa, ketThuc, tamDung, daCham, phuongAnChon, soNhap, cauHienTai, phuongAnBiAn]);

  const dungVatPhamTieuHao = (id: string) => {
    setTonKhoPhu((cu) => ({ ...cu, [id]: Math.max(0, (cu[id] || 0) - 1) }));
    phuDaDung[id] = (phuDaDung[id] || 0) + 1;
    khiTieuHaoVatPham(id);
  };

  const xuLyNopBai = (hetGio = false) => {
    if (!cauHienTai || daCham) return;
    const dung =
      !hetGio &&
      chamDapAn(
        cauHienTai,
        cauHienTai.dang === 'dienSo' ? soNhap : (phuongAnChon ?? -1)
      );

    setDaCham(true);
    setVuaDung(dung);
    setLinhLucCu(linhLuc);

    // Doi thu AI trong Dau Phap
    if (laDauPhap && !cauTamMa) {
      const doiThuDung = Math.random() < 0.62;
      if (doiThuDung) setDiemDoiThu((d) => d + 1);
    }

    if (dung) {
      khiTraLoiDung?.(cauHienTai.id, canhGioi);
      if (cauTamMa) {
        boPhatAmThanh.phatAmNgoDao();
        setLinhLuc((l) => Math.min(chiSo.linhLucToiDa, l + 1));
        setLinhThachTichLuy((t) => t + 25);
        setDaDietTamMa(true);
        setChuoiSai(0);
        return;
      }

      const chuoiMoi = chuoiDung + 1;
      setChuoiDung(chuoiMoi);
      setChuoiSai(0);
      setChuoiNgoDaoMax((m) => Math.max(m, chuoiMoi));
      setSoCauDung((s) => s + 1);

      let linhKhiCau = 16;
      if (chuoiMoi >= 3) {
        boPhatAmThanh.phatAmNgoDao();
        linhKhiCau = Math.round(linhKhiCau * 1.35 * chiSo.heSoNgoDao);
      } else {
        boPhatAmThanh.phatAmDung();
      }
      linhKhiCau = Math.round(linhKhiCau * chiSo.heSoLinhKhi);
      setLinhKhiTichLuy((k) => k + linhKhiCau);
      setLinhThachTichLuy((lt) => lt + 10);
    } else {
      khiTraLoiSai?.(cauHienTai.id, canhGioi);
      boPhatAmThanh.phatAmSai();
      if (cauTamMa) {
        const llMoi = Math.max(0, linhLuc - 1);
        setLinhLuc(llMoi);
        setChuoiSai(0);
        if (llMoi <= 0) setTauHoa(true);
        return;
      }

      setChuoiDung(0);
      const saiMoi = chuoiSai + 1;
      setChuoiSai(saiMoi);

      if (chiSo.mienSaiLanDau && !daMienSai) {
        setDaMienSai(true);
      } else {
        const llMoi = Math.max(0, linhLuc - 1);
        setLinhLuc(llMoi);
        if (llMoi <= 0) {
          setTauHoa(true);
        }
      }
    }
  };

  const chuyenCauTiep = () => {
    boPhatAmThanh.phatAmNhanNut();
    setPhuongAnChon(null);
    setSoNhap('');
    setDaCham(false);
    setVuaDung(false);
    setHienGoiY(false);
    setPhuongAnBiAn([]);

    if (cauTamMa) {
      setCauTamMa(null);
      setGiayConLai(thoiGianMoiCau);
      return;
    }

    // Kiem tra kich hoat Tam Ma sau 2 cau sai lien tiep
    if (chuoiSai >= 2 && linhLuc > 0) {
      const ungVienTamMa = nganHangCauHoi.filter(
        (c) =>
          c.canhGioi === canhGioi &&
          !boCauHoi.some((b) => b.id === c.id)
      );
      const chonTm = bocCauHoi({
        nganHang: ungVienTamMa.length > 0 ? ungVienTamMa : danhSachNguon,
        tienTrinh,
        canhGioi,
        giaiDoan: 'tatCa',
        soLuong: 1,
        loaiTruIds: boCauHoi.map((b) => b.id),
        luotMo: chiSoCau + 1,
      })[0];
      if (chonTm) {
        boPhatAmThanh.phatAmSamSet();
        setCauTamMa(chonTm);
        return;
      }
    }

    if (chiSoCau + 1 < boCauHoi.length) {
      setChiSoCau((i) => i + 1);
      setGiayConLai(thoiGianMoiCau);
    } else {
      // Hoan thanh man
      const thangDauPhap = laDauPhap ? soCauDung >= diemDoiThu && soCauDung >= 2 : undefined;
      const sao = tinhSoSaoMan(soCauDung, boCauHoi.length);
      const thang = sao >= 1 && (!laDauPhap || soCauDung >= 2);
      const tongThach = Math.round(
        (linhThachTichLuy + (thang ? 25 : 5) + (thangDauPhap ? 35 : 0)) *
          chiSo.heSoLinhThach
      );
      const tongKhi = linhKhiTichLuy + (thang ? 20 : 5);

      const kq: KetQuaManChoi = {
        thang,
        canhGioi,
        giaiDoan,
        soCauDung,
        tongCau: boCauHoi.length,
        soSao: sao,
        linhKhiNhan: tongKhi,
        linhThachNhan: tongThach,
        chuoiNgoDaoMax,
        daDietTamMa,
        laDauPhap,
        thangDauPhap,
        cauDaLamIds: boCauHoi.map((c) => c.id),
        phuDaDung,
      };
      if (thang) boPhatAmThanh.phatAmNgoDao();
      setKetThuc(kq);
    }
  };

  const dungPhuGoiY = () => {
    if (hienGoiY) return;
    boPhatAmThanh.phatAmNhanNut();
    if (mienPhiGoiY) {
      setMienPhiGoiY(false);
      setHienGoiY(true);
      return;
    }
    if ((tonKhoPhu.phuThoiDien || 0) <= 0) return;
    dungVatPhamTieuHao('phuThoiDien');
    setHienGoiY(true);
  };

  const dungPhuKhamPha = () => {
    if (
      !cauHienTai ||
      cauHienTai.dang !== 'tracNghiem' ||
      !cauHienTai.luaChon ||
      phuongAnBiAn.length > 0 ||
      (tonKhoPhu.phuKhamPha || 0) <= 0
    ) {
      return;
    }
    boPhatAmThanh.phatAmNhanNut();
    const saiIndices = cauHienTai.luaChon
      .map((_, i) => i)
      .filter((i) => i !== Number(cauHienTai.dapAn));
    const an = saiIndices.sort(() => Math.random() - 0.5).slice(0, 2);
    dungVatPhamTieuHao('phuKhamPha');
    setPhuongAnBiAn(an);
  };

  const dungPhuHoiLinh = () => {
    if (linhLuc >= chiSo.linhLucToiDa || (tonKhoPhu.phuHoiLinh || 0) <= 0) return;
    boPhatAmThanh.phatAmDung();
    dungVatPhamTieuHao('phuHoiLinh');
    setLinhLuc((l) => Math.min(chiSo.linhLucToiDa, l + 1));
  };

  const dungPhuHoanDe = () => {
    if (daCham || cauTamMa || (tonKhoPhu.phuHoanDe || 0) <= 0) return;
    const daCo = new Set(boCauHoi.map((b) => b.id));
    const nguon = nganHangCauHoi.filter(
      (c) => c.canhGioi === canhGioi && !daCo.has(c.id)
    );
    const thayThe = bocCauHoi({
      nganHang: nguon.length ? nguon : danhSachNguon,
      tienTrinh,
      canhGioi,
      giaiDoan: 'tatCa',
      soLuong: 1,
      loaiTruIds: [...daCo],
      luotMo: chiSoCau + 10,
    })[0];
    if (!thayThe) return;
    boPhatAmThanh.phatAmNhanNut();
    dungVatPhamTieuHao('phuHoanDe');
    setBoCauHoi((cu) => cu.map((item, idx) => (idx === chiSoCau ? thayThe : item)));
    setPhuongAnChon(null);
    setSoNhap('');
    setHienGoiY(false);
    setPhuongAnBiAn([]);
    setGiayConLai(thoiGianMoiCau);
  };

  const hoiSinhBangDan = (danId: 'thanhTamDan' | 'hoMachDan') => {
    if ((tonKhoPhu[danId] || 0) <= 0) return;
    boPhatAmThanh.phatAmNgoDao();
    dungVatPhamTieuHao(danId);
    setLinhLuc(chiSo.linhLucToiDa);
    if (danId === 'hoMachDan') {
      setLinhKhiTichLuy((k) => k + 40);
    }
    setTauHoa(false);
    setChuoiSai(0);
    if (daCham) chuyenCauTiep();
  };

  // Man ket thuc
  if (ketThuc) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 pb-24">
        <CuonThuGiayDo className="text-center">
          <div className="dau-an-trang-tri text-xs font-bold uppercase text-[#8F1F1A]">
            {ketThuc.thang ? 'Tu Luyện Viên Mãn' : 'Đạo Tâm Chưa Vững'}
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2118] mt-1">
            {ketThuc.thang
              ? laDauPhap
                ? 'Thắng Trận Đấu Pháp!'
                : 'Hoàn Thành Giai Đoạn!'
              : 'Chưa Đạt Ngưỡng Qua Ải'}
          </h2>
          <p className="text-sm text-[#2B2118]/80 mt-1">
            {thongTinCg.ten} · {thongTinGd.ten}
          </p>

          <div className="flex justify-center gap-2 my-4">
            {[1, 2, 3].map((s) => (
              <BieuTuongSao
                key={s}
                sang={s <= ketThuc.soSao}
                className="w-8 h-8"
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2.5 my-4 text-center">
            <div className="rounded-lg bg-[#0D1424] p-3 text-[#F6EEDB]">
              <div className="text-xs text-[#9BA8BE]">Số câu đúng</div>
              <div className="text-xl font-bold text-[#62D1B5] chu-so-bang">
                {ketThuc.soCauDung}/{ketThuc.tongCau}
              </div>
            </div>
            <div className="rounded-lg bg-[#0D1424] p-3 text-[#F6EEDB]">
              <div className="text-xs text-[#9BA8BE]">Linh khí</div>
              <div className="text-xl font-bold text-[#62D1B5] chu-so-bang">
                +{ketThuc.linhKhiNhan}
              </div>
            </div>
            <div className="rounded-lg bg-[#0D1424] p-3 text-[#F6EEDB]">
              <div className="text-xs text-[#9BA8BE]">Linh thạch</div>
              <div className="text-xl font-bold text-[#E4BC5A] chu-so-bang">
                +{ketThuc.linhThachNhan}
              </div>
            </div>
          </div>

          {laDauPhap && (
            <p className="text-xs text-[#6B3B2A] mb-3">
              Tỉ số Đấu Pháp với {tenDoiThu}: {ketThuc.soCauDung} – {diemDoiThu}
            </p>
          )}

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <NutLenhBai
              type="button"
              kieu="vang"
              onClick={() => khiHoanThanh(ketThuc)}
            >
              Nhận thưởng & Tiếp tục
            </NutLenhBai>
          </div>
        </CuonThuGiayDo>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-28 md:pb-12">
      {/* Thanh trang thai tren cung man choi */}
      <div className="khung-ngoc-gian rounded-xl p-3.5 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <NhanVat
            ngoaiHinh={tienTrinh.ngoaiHinh}
            kichCo="nho"
            canhGioi={canhGioi}
            cheDo={daCham && !vuaDung ? 'biThuong' : 'vanCong'}
            className="w-11 h-11"
          />
          <div>
            <div className="text-xs text-[#62D1B5] font-semibold">
              {thongTinCg.ten} · {thongTinGd.ten}
              {laDauPhap ? ' · Đấu Pháp' : ''}
            </div>
            <div className="flex items-center gap-1 mt-1" aria-label={`Còn ${linhLuc} trên ${chiSo.linhLucToiDa} Linh lực`}>
              {Array.from({ length: chiSo.linhLucToiDa }).map((_, idx) => {
                const trangThai =
                  idx < linhLuc
                    ? 'day'
                    : idx < linhLucCu && daCham && !vuaDung
                    ? 'nut'
                    : 'trong';
                return (
                  <BieuTuongLinhLuc
                    key={idx}
                    trangThai={trangThai}
                    className="w-5 h-5"
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {chuoiDung >= 2 && (
            <div className="text-right">
              <div className="text-[11px] text-[#9BA8BE]">Ngộ Đạo</div>
              <div className="text-sm font-bold text-[#E4BC5A] chu-so-bang">
                Chuỗi {chuoiDung}
              </div>
            </div>
          )}

          {laDauPhap && !cauTamMa && (
            <div className="px-3 py-1.5 rounded-lg bg-[#070B14] border border-[#C8372D]/60 text-center">
              <div className="text-[10px] text-[#F28A80]">Thời gian</div>
              <div className="text-base font-bold text-[#F2D88B] chu-so-bang">
                {giayConLai}s
              </div>
            </div>
          )}

          {tienTrinh.caiDat.batMayTinh && !laDauPhap && (
            <button
              type="button"
              onClick={() => {
                boPhatAmThanh.phatAmNhanNut();
                setMoMayTinh(true);
              }}
              title="Mở Thiên Cơ Toán Bàn"
              aria-label="Mở Thiên Cơ Toán Bàn"
              className="min-h-[42px] px-3 rounded-lg bg-[#141D33] border border-[#E4BC5A]/35 text-[#F2D88B] hover:bg-[#1F2A4D] flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <BieuTuongMayTinh className="w-4 h-4" />
              <span className="hidden sm:inline">Toán bàn</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              boPhatAmThanh.phatAmNhanNut();
              setTamDung(true);
            }}
            className="min-h-[42px] px-3 rounded-lg bg-[#0D1424] border border-[#1F2A4D] text-xs text-[#DCE6EA] hover:border-[#E4BC5A]/45 cursor-pointer"
          >
            Tạm dừng
          </button>
        </div>
      </div>

      {/* Thanh tien trinh cau hoi / dau phap */}
      <div className="flex items-center justify-between text-xs text-[#9BA8BE] mb-2">
        <span className="chu-so-bang">
          {cauTamMa
            ? 'Tâm Ma Thử Thách!'
            : `Thử thách ${chiSoCau + 1} / ${boCauHoi.length}`}
        </span>
        {laDauPhap ? (
          <span className="inline-flex items-center gap-1 text-[#F28A80]">
            <BieuTuongKiem className="w-3.5 h-3.5" />
            {tenDoiThu}: {diemDoiThu} điểm · Toán bàn tạm khóa
          </span>
        ) : (
          <span className="inline-flex items-center gap-3 chu-so-bang">
            <span className="inline-flex items-center gap-1 text-[#62D1B5]">
              <BieuTuongLinhKhi className="w-3.5 h-3.5" />+{linhKhiTichLuy}
            </span>
            <span className="inline-flex items-center gap-1 text-[#E4BC5A]">
              <BieuTuongLinhThach className="w-3.5 h-3.5" />+{linhThachTichLuy}
            </span>
          </span>
        )}
      </div>
      <div className="h-2 rounded-full bg-[#0D1424] border border-[#1F2A4D] overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-[#1E7F6B] to-[#E4BC5A] transition-all duration-300"
          style={{
            width: `${((chiSoCau + (daCham ? 1 : 0)) / boCauHoi.length) * 100}%`,
          }}
        />
      </div>

      {/* Canh bao Tam Ma */}
      {cauTamMa && (
        <div className="mb-4 rounded-xl border border-[#B79CFF] bg-[#1F1338]/90 p-3.5 flex items-center gap-3">
          <BieuTuongTamMa className="w-8 h-8 shrink-0" />
          <div>
            <div className="text-sm font-bold text-[#E5DAFF]">
              Tâm Ma Xuất Hiện!
            </div>
            <p className="text-xs text-[#D2C2FF]">
              Sau 2 lần sơ suất, chấp niệm trỗi dậy. Trả lời đúng câu này để trảm diệt Tâm Ma, hồi phục +1 Linh lực và nhận +25 Linh thạch!
            </p>
          </div>
        </div>
      )}

      {/* Cuon thu de bai */}
      {cauHienTai && (
        <CuonThuGiayDo>
          <div className="flex items-center justify-between text-xs text-[#6B3B2A] mb-2">
            <span>{dinhDangNguonCau(cauHienTai.nguon)}</span>
            <span>
              {cauHienTai.dang === 'dienSo'
                ? 'Điền số'
                : cauHienTai.dang === 'dungSai'
                ? 'Đúng / Sai'
                : 'Trắc nghiệm'}
            </span>
          </div>

          <div className="text-base sm:text-lg font-medium text-[#2B2118] leading-relaxed">
            <CongThucToan noiDung={cauHienTai.deBai} />
          </div>

          {cauHienTai.hinhVe && <HinhVe hinh={cauHienTai.hinhVe} />}

          {/* Goi y neu da mo */}
          {hienGoiY && (
            <div className="mt-3 rounded-lg border border-[#1E7F6B]/45 bg-[#1E7F6B]/10 p-3 text-sm text-[#174C41]">
              <strong>Thôi diễn gợi ý: </strong>
              <CongThucToan noiDung={cauHienTai.goiY} />
            </div>
          )}

          {/* Khu vuc chon / nhap dap an */}
          <div className="mt-5">
            {cauHienTai.dang === 'dienSo' ? (
              <div className="space-y-2">
                <label
                  htmlFor="o-nhap-dap-an"
                  className="block text-sm font-semibold text-[#2B2118]"
                >
                  Nhập đáp án số {cauHienTai.donVi ? `(đơn vị: ${cauHienTai.donVi})` : ''}:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    ref={oNhapRef}
                    id="o-nhap-dap-an"
                    type="text"
                    inputMode="decimal"
                    disabled={daCham}
                    value={soNhap}
                    onChange={(e) => setSoNhap(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !daCham && soNhap.trim()) {
                        xuLyNopBai(false);
                      }
                    }}
                    placeholder="Ví dụ: 12 hoặc 34,6"
                    className="flex-1 min-h-[48px] px-4 rounded-lg bg-white/85 border-2 border-[#B98B2E]/60 text-[#2B2118] text-lg font-semibold chu-so-bang focus:outline-none focus:border-[#1E7F6B]"
                  />
                  {cauHienTai.donVi && (
                    <span className="text-base font-bold text-[#2B2118]">
                      {cauHienTai.donVi}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={`grid gap-2.5 ${
                  cauHienTai.dang === 'dungSai'
                    ? 'grid-cols-2'
                    : 'grid-cols-1 sm:grid-cols-2'
                }`}
              >
                {(cauHienTai.luaChon || []).map((luaChon, idx) => {
                  const biAn = phuongAnBiAn.includes(idx);
                  const dangChon = phuongAnChon === idx;
                  const laDapAnDung = idx === Number(cauHienTai.dapAn);

                  let lopTrangThai =
                    'bg-[#FFFDF8]/85 border-[#B98B2E]/45 text-[#2B2118] hover:border-[#1E7F6B]';
                  if (daCham) {
                    if (laDapAnDung) {
                      lopTrangThai =
                        'bg-[#1E7F6B] border-[#0E4A3E] text-[#F8F6EE]';
                    } else if (dangChon && !laDapAnDung) {
                      lopTrangThai =
                        'bg-[#C8372D] border-[#8F1F1A] text-[#FAF4E8]';
                    } else {
                      lopTrangThai =
                        'bg-[#EADDBE]/50 border-[#B98B2E]/25 text-[#2B2118]/55';
                    }
                  } else if (dangChon) {
                    lopTrangThai =
                      'bg-[#141D33] border-[#E4BC5A] text-[#F2D88B] shadow-md';
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
                      className={`min-h-[52px] px-3.5 py-2.5 rounded-lg border-2 text-left flex items-center gap-3 transition-all cursor-pointer disabled:cursor-default ${
                        biAn ? 'opacity-20 line-through' : ''
                      } ${lopTrangThai}`}
                    >
                      <AnTrienChuSa
                        chu={['A', 'B', 'C', 'D'][idx] || String(idx + 1)}
                        kichThuoc="nho"
                      />
                      <span className="text-sm sm:text-base font-medium">
                        <CongThucToan noiDung={luaChon} />
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Phan hoi va loi giai sau khi nop */}
          {daCham && (
            <div
              className={`mt-4 rounded-lg border p-3.5 ${
                vuaDung
                  ? 'bg-[#1E7F6B]/14 border-[#1E7F6B] text-[#124238]'
                  : 'bg-[#C8372D]/12 border-[#C8372D] text-[#6E1A15]'
              }`}
            >
              <div className="font-bold text-sm sm:text-base mb-1">
                {vuaDung
                  ? chuoiDung >= 3
                    ? 'Ngộ Đạo! Đáp án hoàn toàn chính xác!'
                    : 'Chính xác! Linh khí đang hội tụ.'
                  : 'Chưa chuẩn xác — hãy xem lời giải chi tiết:'}
              </div>
              {cauHienTai.dang === 'dienSo' && !vuaDung && (
                <div className="text-sm font-semibold mb-1">
                  Đáp án đúng: {String(cauHienTai.dapAn).replace('.', ',')}{' '}
                  {cauHienTai.donVi || ''}
                </div>
              )}
              <div className="text-sm leading-relaxed text-[#2B2118]">
                <CongThucToan noiDung={cauHienTai.loiGiai} />
              </div>
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
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

          {/* Thanh hanh dong cua cau */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            {/* Thanh dung Phu ho tro */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={
                  daCham ||
                  hienGoiY ||
                  (!mienPhiGoiY && (tonKhoPhu.phuThoiDien || 0) <= 0)
                }
                onClick={dungPhuGoiY}
                className="min-h-[40px] px-3 rounded-lg border border-[#B98B2E]/50 bg-[#141D33] text-[#F2D88B] text-xs font-semibold flex items-center gap-1.5 disabled:bg-[#2B2118]/12 disabled:text-[#2B2118]/55 disabled:border-[#2B2118]/25 disabled:cursor-not-allowed cursor-pointer"
              >
                <BieuTuongGoiY className="w-4 h-4" />
                <span>
                  {mienPhiGoiY
                    ? 'Gợi ý (Miễn phí)'
                    : `Phù Thôi Diễn (${tonKhoPhu.phuThoiDien || 0})`}
                </span>
              </button>

              {cauHienTai.dang === 'tracNghiem' && (
                <button
                  type="button"
                  disabled={
                    daCham ||
                    phuongAnBiAn.length > 0 ||
                    (tonKhoPhu.phuKhamPha || 0) <= 0
                  }
                  onClick={dungPhuKhamPha}
                  className="min-h-[40px] px-3 rounded-lg border border-[#B98B2E]/50 bg-[#141D33] text-[#62D1B5] text-xs font-semibold disabled:bg-[#2B2118]/12 disabled:text-[#2B2118]/55 disabled:border-[#2B2118]/25 disabled:cursor-not-allowed cursor-pointer"
                >
                  Phù 50:50 ({tonKhoPhu.phuKhamPha || 0})
                </button>
              )}

              <button
                type="button"
                disabled={
                  linhLuc >= chiSo.linhLucToiDa ||
                  (tonKhoPhu.phuHoiLinh || 0) <= 0
                }
                onClick={dungPhuHoiLinh}
                className="min-h-[40px] px-3 rounded-lg border border-[#B98B2E]/50 bg-[#141D33] text-[#62D1B5] text-xs font-semibold disabled:bg-[#2B2118]/12 disabled:text-[#2B2118]/55 disabled:border-[#2B2118]/25 disabled:cursor-not-allowed cursor-pointer"
              >
                Hồi Linh ({tonKhoPhu.phuHoiLinh || 0})
              </button>

              {!cauTamMa && (
                <button
                  type="button"
                  disabled={daCham || (tonKhoPhu.phuHoanDe || 0) <= 0}
                  onClick={dungPhuHoanDe}
                  className="min-h-[40px] px-3 rounded-lg border border-[#B98B2E]/50 bg-[#141D33] text-[#DCE6EA] text-xs font-semibold disabled:bg-[#2B2118]/12 disabled:text-[#2B2118]/55 disabled:border-[#2B2118]/25 disabled:cursor-not-allowed cursor-pointer"
                >
                  Hoán Đề ({tonKhoPhu.phuHoanDe || 0})
                </button>
              )}
            </div>

            <div>
              {!daCham ? (
                <NutLenhBai
                  type="button"
                  kieu="ngoc"
                  disabled={
                    cauHienTai.dang === 'dienSo'
                      ? !soNhap.trim()
                      : phuongAnChon === null
                  }
                  onClick={() => xuLyNopBai(false)}
                >
                  Xác nhận đáp án
                </NutLenhBai>
              ) : (
                <NutLenhBai type="button" kieu="vang" onClick={chuyenCauTiep}>
                  {chiSoCau + 1 >= boCauHoi.length && !cauTamMa
                    ? 'Xem kết quả'
                    : 'Câu tiếp theo'}
                </NutLenhBai>
              )}
            </div>
          </div>
        </CuonThuGiayDo>
      )}

      {/* May tinh Thien Co Toan Ban */}
      <ThienCoToanBan
        mo={moMayTinh}
        dong={() => setMoMayTinh(false)}
        coTheChenKetQua={cauHienTai?.dang === 'dienSo' && !daCham}
        khiChenKetQua={(gt) => setSoNhap(gt)}
      />

      <HopThoaiKinh
        mo={kinhDangXem.length > 0}
        dong={() => setKinhDangXem([])}
        danhSachKinh={kinhDangXem}
        tienTrinh={tienTrinh}
        khiDocLanDau={khiDocKinhLanDau}
        khiChuyenDaThuoc={khiChuyenDaThuocKinh}
        khiChuyenSoTay={khiChuyenSoTayKinh}
      />

      {/* Hop thoai Tam Dung */}
      {tamDung && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="khung-ngoc-gian rounded-xl p-6 max-w-sm w-full text-center">
            <h3 className="tieu-de-vang text-xl font-bold">Tạm Ngưng Tu Luyện</h3>
            <p className="text-sm text-[#9BA8BE] mt-2">
              Nếu rời khỏi giai đoạn lúc này, tiến độ của lượt thi hiện tại sẽ chưa được tính.
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <NutLenhBai type="button" kieu="ngoc" onClick={() => setTamDung(false)}>
                Tiếp tục làm bài
              </NutLenhBai>
              <NutLenhBai type="button" kieu="chuSa" onClick={khiThoat}>
                Quay lại bản đồ giai đoạn
              </NutLenhBai>
            </div>
          </div>
        </div>
      )}

      {/* Hop thoai Tau hoa nhap ma (0 Linh luc) */}
      {tauHoa && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="khung-ngoc-gian rounded-xl p-6 max-w-md w-full text-center border-[#C8372D]">
            <div className="dau-an-trang-tri text-xs font-bold uppercase text-[#F28A80]">
              Tẩu Hỏa Nhập Ma
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#F6EEDB] mt-1">
              Linh Lực Cạn Kiệt
            </h3>
            <p className="text-sm text-[#DCE6EA]/85 mt-2">
              Đạo hữu tạm thời tẩu hỏa nhập ma nhẹ, toàn bộ vật phẩm và linh thạch trong túi đồ vẫn còn nguyên vẹn!
            </p>

            <div className="mt-5 flex flex-col gap-2.5">
              {(tonKhoPhu.thanhTamDan || 0) > 0 && (
                <NutLenhBai
                  type="button"
                  kieu="vang"
                  onClick={() => hoiSinhBangDan('thanhTamDan')}
                >
                  Dùng {timVatPham('thanhTamDan')?.ten} hồi đầy Linh lực (Còn{' '}
                  {tonKhoPhu.thanhTamDan})
                </NutLenhBai>
              )}
              {(tonKhoPhu.hoMachDan || 0) > 0 && (
                <NutLenhBai
                  type="button"
                  kieu="ngoc"
                  onClick={() => hoiSinhBangDan('hoMachDan')}
                >
                  Dùng {timVatPham('hoMachDan')?.ten} hồi sinh +40 Linh khí (Còn{' '}
                  {tonKhoPhu.hoMachDan})
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
