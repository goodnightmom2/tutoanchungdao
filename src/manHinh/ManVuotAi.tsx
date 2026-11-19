import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { boPhatAmThanh } from '../amThanh/boPhatAmThanh';
import { layThongTinCanhGioi } from '../duLieu/canhGioi';
import { timVatPham } from '../duLieu/vatPham';
import {
  CauHoi,
  Kinh,
  MaCanhGioi,
  MaGiaiDoan,
  TienTrinhNguoiChoi,
  TuThe,
} from '../kieuDuLieu/troChoi';
import { bocCauHoi } from '../logic/bocCauHoi';
import { layKinhLienQuanChoCauHoi } from '../logic/tangKinhCac';
import { dinhDangNguonCau, tinhChiSoNhanVat } from '../logic/tienTrinh';
import { chamDapAn } from '../logic/toanHoc';
import {
  ChuongNgaiInfo,
  HuongDi,
  khoaToaDo,
  taoBanDoVuotAi,
  timDuongNganNhat,
  tinhBuocDiChuyen,
  tinhNhayQuaHo,
  tinhSaoVuotAi,
  ToaDo,
} from '../logic/vuotAi';
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
import { ThienCoToanBan } from '../thanhPhan/ThienCoToanBan';
import { TieuNon } from '../thanhPhan/TieuNon';
import { KetQuaManChoi } from './ManChoi';

const TEN_DOI_THU_DAU_PHAP = [
  'Đệ tử Thiên Cơ Tông · Lục Tử',
  'Đệ tử Hắc Toán Môn · Mạc Vô',
  'Trưởng lão Ngoại Môn · Bạch Vân',
];

export const ManVuotAi: React.FC<{
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
  const laHauKy = giaiDoan === 'hauKy';

  const chiSo = useMemo(() => tinhChiSoNhanVat(tienTrinh), [tienTrinh]);
  const linhTuyenCong = Math.floor(Math.max(0, (tienTrinh.dongPhu?.capLinhTuyen || 1) - 1) / 2);
  const linhLucToiDa = chiSo.linhLucToiDa + linhTuyenCong;

  const banDo = useMemo(() => taoBanDoVuotAi(canhGioi, giaiDoan), [canhGioi, giaiDoan]);

  const danhSachNguon = useMemo(() => {
    const loc = nganHangCauHoi.filter(
      (c) => c.canhGioi === canhGioi && c.giaiDoan === giaiDoan
    );
    return loc.length >= 6
      ? loc
      : nganHangCauHoi.filter((c) => c.canhGioi === canhGioi);
  }, [nganHangCauHoi, canhGioi, giaiDoan]);

  // Trang thai di chuyen & ban do
  const [viTri, setViTri] = useState<ToaDo>(banDo.batDau);
  const [huong, setHuong] = useState<HuongDi>('len');
  const [tuThe, setTuThe] = useState<TuThe>('dungYen');
  const [daPhaCn, setDaPhaCn] = useState<string[]>([]);
  const [cnBiSaiTruocDo, setCnBiSaiTruocDo] = useState<string[]>([]);
  const [soPhaLanDauDung, setSoPhaLanDauDung] = useState(0);
  const [daNhatO, setDaNhatO] = useState<string[]>([]);
  const [hienLoiTieuNon, setHienLoiTieuNon] = useState(false);
  const [thongBaoAi, setThongBaoAi] = useState<string>(
    'Dùng phím mũi tên / WASD hoặc nút điều hướng để tiến tới Cổng Thiên Môn!'
  );
  const [duongChiDan, setDuongChiDan] = useState<ToaDo[]>([]);
  const [daDungBuaChiDuong, setDaDungBuaChiDuong] = useState(false);

  // Chi so tran dau
  const [linhLuc, setLinhLuc] = useState(linhLucToiDa);
  const [daMienSai, setDaMienSai] = useState(false);
  const [chuoiDung, setChuoiDung] = useState(0);
  const [chuoiSai, setChuoiSai] = useState(0);
  const [chuoiNgoDaoMax, setChuoiNgoDaoMax] = useState(0);
  const [soCauDung, setSoCauDung] = useState(0);
  const [tongCauDaLam, setTongCauDaLam] = useState(0);
  const [linhKhiTichLuy, setLinhKhiTichLuy] = useState(0);
  const [linhThachTichLuy, setLinhThachTichLuy] = useState(0);
  const [daDietTamMa, setDaDietTamMa] = useState(false);
  const [cauDaDungIds, setCauDaDungIds] = useState<string[]>([]);

  // Ton kho phu cuc bo
  const [tonKhoPhu, setTonKhoPhu] = useState<Record<string, number>>({
    phuThoiDien: tienTrinh.tuiDo.phuThoiDien || 0,
    phuKhamPha: tienTrinh.tuiDo.phuKhamPha || 0,
    phuHoiLinh: tienTrinh.tuiDo.phuHoiLinh || 0,
    buaChiDuong: tienTrinh.tuiDo.buaChiDuong || 0,
    thanhTamDan: tienTrinh.tuiDo.thanhTamDan || 0,
    hoMachDan: tienTrinh.tuiDo.hoMachDan || 0,
  });

  // Modal chuong ngai / Tam Ma / Dau Phap
  const [chuongNgaiDangMo, setChuongNgaiDangMo] = useState<{
    info: ChuongNgaiInfo;
    toaDo: ToaDo;
  } | null>(null);
  const [laTamMa, setLaTamMa] = useState(false);
  const [cauHienTai, setCauHienTai] = useState<CauHoi | null>(null);
  const [phuongAnChon, setPhuongAnChon] = useState<number | null>(null);
  const [soNhap, setSoNhap] = useState('');
  const [daCham, setDaCham] = useState(false);
  const [vuaDung, setVuaDung] = useState(false);
  const [hienGoiY, setHienGoiY] = useState(false);
  const [mienPhiGoiY, setMienPhiGoiY] = useState(chiSo.tangPhuThoiDienDauTran);
  const [phuongAnBiAn, setPhuongAnBiAn] = useState<number[]>([]);

  // Dau Phap cuoi ai Hau ky
  const [dangDauPhap, setDangDauPhap] = useState(false);
  const [boCauDauPhap, setBoCauDauPhap] = useState<CauHoi[]>([]);
  const [chiSoDauPhap, setChiSoDauPhap] = useState(0);
  const [diemTaDauPhap, setDiemTaDauPhap] = useState(0);
  const [diemDoiThu, setDiemDoiThu] = useState(0);
  const [tenDoiThu] = useState(
    () => TEN_DOI_THU_DAU_PHAP[Math.floor(Math.random() * TEN_DOI_THU_DAU_PHAP.length)]
  );
  const thoiGianDauPhap = 30 + chiSo.congThoiGianDauPhap;
  const [giayDauPhap, setGiayDauPhap] = useState(thoiGianDauPhap);

  // Hop thoai phu
  const [moMayTinh, setMoMayTinh] = useState(false);
  const [kinhDangXem, setKinhDangXem] = useState<Kinh[]>([]);
  const [tamDung, setTamDung] = useState(false);
  const [tauHoa, setTauHoa] = useState(false);
  const [ketThuc, setKetThuc] = useState<KetQuaManChoi | null>(null);

  const giuPhimTimer = useRef<number | null>(null);
  const buocCuoiRef = useRef<number>(0);

  const daPhaSet = useMemo(() => new Set(daPhaCn), [daPhaCn]);

  const dungVatPhamTieuHao = useCallback(
    (id: string) => {
      setTonKhoPhu((cu) => ({ ...cu, [id]: Math.max(0, (cu[id] || 0) - 1) }));
      khiTieuHaoVatPham(id);
    },
    [khiTieuHaoVatPham]
  );

  const layCauMoi = useCallback(
    (loaiTruThem: string[] = []): CauHoi | null => {
      const chon = bocCauHoi({
        nganHang: nganHangCauHoi,
        tienTrinh,
        canhGioi,
        giaiDoan,
        soLuong: 1,
        loaiTruIds: [
          ...tienTrinh.cauHoiDaAn,
          ...cauDaDungIds,
          ...loaiTruThem,
        ],
        luotMo: cauDaDungIds.length + tienTrinh.lichSu.length,
      })[0];
      return chon || null;
    },
    [nganHangCauHoi, tienTrinh, canhGioi, giaiDoan, cauDaDungIds]
  );

  const moThuThachChuongNgai = useCallback(
    (info: ChuongNgaiInfo, toaDo: ToaDo) => {
      const cau = layCauMoi();
      if (!cau) return;
      boPhatAmThanh.phatAmNhanNut();
      setTuThe('niemChu');
      setChuongNgaiDangMo({ info, toaDo });
      setLaTamMa(false);
      setCauHienTai(cau);
      setPhuongAnChon(null);
      setSoNhap('');
      setDaCham(false);
      setVuaDung(false);
      setHienGoiY(false);
      setPhuongAnBiAn([]);
    },
    [layCauMoi]
  );

  const ketThucAi = useCallback(
    (coThangDauPhap?: boolean, soCauDauPhapDung = 0) => {
      const tongCau = 5 + (laHauKy ? 3 : 0);
      const tongDung = soCauDung + soCauDauPhapDung;
      const sao = tinhSaoVuotAi(soPhaLanDauDung, 5);
      const tongThach = Math.round(
        (linhThachTichLuy + 25 + (coThangDauPhap ? 35 : 0)) * chiSo.heSoLinhThach
      );
      const tongKhi = linhKhiTichLuy + 25;
      boPhatAmThanh.phatAmNgoDao();
      setKetThuc({
        thang: true,
        canhGioi,
        giaiDoan,
        soCauDung: tongDung,
        tongCau,
        soSao: sao,
        linhKhiNhan: tongKhi,
        linhThachNhan: tongThach,
        chuoiNgoDaoMax,
        daDietTamMa,
        laDauPhap: laHauKy,
        thangDauPhap: coThangDauPhap,
        cauDaLamIds: cauDaDungIds,
        phuDaDung: {},
      });
    },
    [
      laHauKy,
      soCauDung,
      soPhaLanDauDung,
      linhThachTichLuy,
      linhKhiTichLuy,
      chiSo.heSoLinhThach,
      canhGioi,
      giaiDoan,
      chuoiNgoDaoMax,
      daDietTamMa,
      cauDaDungIds,
    ]
  );

  const xuLyNhatO = useCallback(
    (toaDoMoi: ToaDo) => {
      const key = khoaToaDo(toaDoMoi.x, toaDoMoi.y);
      const loaiO = banDo.luoi[toaDoMoi.y]?.[toaDoMoi.x];

      if (loaiO === 'linhThach' && !daNhatO.includes(key)) {
        boPhatAmThanh.phatAmDung();
        setDaNhatO((cu) => [...cu, key]);
        setLinhThachTichLuy((lt) => lt + 12);
        setThongBaoAi('Nhặt được 12 Linh thạch tinh khiết trên đường!');
      } else if (loaiO === 'ruongBau' && !daNhatO.includes(key)) {
        boPhatAmThanh.phatAmNgoDao();
        setDaNhatO((cu) => [...cu, key]);
        setLinhThachTichLuy((lt) => lt + 30);
        setLinhKhiTichLuy((lk) => lk + 15);
        setThongBaoAi('Mở Rương Bí Cảnh: +30 Linh thạch và +15 Linh khí!');
      } else if (loaiO === 'congThienMon') {
        if (daPhaCn.length < 5) {
          setThongBaoAi(`Cần phá đủ 5 chướng ngại mới mở được Cổng Thiên Môn (${daPhaCn.length}/5).`);
          return;
        }
        if (laHauKy) {
          boPhatAmThanh.phatAmChuongTranDau();
          const boDauPhap = bocCauHoi({
            nganHang: nganHangCauHoi,
            tienTrinh,
            canhGioi,
            giaiDoan,
            soLuong: 3,
            loaiTruIds: cauDaDungIds,
            luotMo: cauDaDungIds.length + 7,
          });
          setBoCauDauPhap(boDauPhap);
          setChiSoDauPhap(0);
          setDangDauPhap(true);
          setCauHienTai(boDauPhap[0] || null);
          setPhuongAnChon(null);
          setSoNhap('');
          setDaCham(false);
          setVuaDung(false);
          setHienGoiY(false);
          setPhuongAnBiAn([]);
          setGiayDauPhap(thoiGianDauPhap);
        } else {
          ketThucAi(undefined, 0);
        }
      }
    },
    [banDo, daNhatO, daPhaCn.length, laHauKy, nganHangCauHoi, tienTrinh, canhGioi, giaiDoan, cauDaDungIds, thoiGianDauPhap, ketThucAi]
  );

  const thucHienDiChuyen = useCallback(
    (huongMoi: HuongDi) => {
      if (chuongNgaiDangMo || dangDauPhap || tauHoa || ketThuc || tamDung || moMayTinh || kinhDangXem.length > 0) {
        return;
      }
      const now = Date.now();
      if (now - buocCuoiRef.current < 150) return;
      buocCuoiRef.current = now;

      setHuong(huongMoi);
      const kq = tinhBuocDiChuyen(banDo, viTri, huongMoi, daPhaSet);

      if (kq.gapChuongNgai && kq.viTriChuongNgai) {
        moThuThachChuongNgai(kq.gapChuongNgai, kq.viTriChuongNgai);
        return;
      }

      if (kq.gapHoNho) {
        setThongBaoAi('Phía trước có hố sâu! Hãy bấm "Nhảy" (Space) để vượt qua.');
        return;
      }

      if (kq.gapTieuNon) {
        boPhatAmThanh.phatAmNgoDao();
        setHienLoiTieuNon(true);
        setThongBaoAi(banDo.loiNhacTieuNon);
        return;
      }

      if (kq.daChuyen) {
        boPhatAmThanh.phatAmBuocChan();
        setTuThe('di');
        setViTri(kq.viTriMoi);
        if (duongChiDan.length > 0) {
          const con = duongChiDan.filter(
            (p) => !(p.x === kq.viTriMoi.x && p.y === kq.viTriMoi.y)
          );
          setDuongChiDan(con);
        }
        xuLyNhatO(kq.viTriMoi);
        window.setTimeout(() => setTuThe('dungYen'), 190);
      } else {
        setThongBaoAi('Vách núi chắn lối, hãy đổi hướng khác!');
      }
    },
    [
      chuongNgaiDangMo,
      dangDauPhap,
      tauHoa,
      ketThuc,
      tamDung,
      moMayTinh,
      kinhDangXem.length,
      banDo,
      viTri,
      daPhaSet,
      moThuThachChuongNgai,
      duongChiDan,
      xuLyNhatO,
    ]
  );

  const thucHienNhay = useCallback(() => {
    if (chuongNgaiDangMo || dangDauPhap || tauHoa || ketThuc || tamDung) return;
    const kq = tinhNhayQuaHo(banDo, viTri, huong, daPhaSet);
    if (kq.thanhCong) {
      boPhatAmThanh.phatAmBuocChan();
      setTuThe('nhay');
      setViTri(kq.viTriMoi);
      if (kq.quaHoNho) {
        setThongBaoAi('Nhảy vọt qua hố sâu thành công!');
      }
      xuLyNhatO(kq.viTriMoi);
      window.setTimeout(() => setTuThe('dungYen'), 320);
    } else {
      setThongBaoAi('Không thể nhảy theo hướng này!');
    }
  }, [chuongNgaiDangMo, dangDauPhap, tauHoa, ketThuc, tamDung, banDo, viTri, huong, daPhaSet, xuLyNhatO]);

  const thucHienTuongTac = useCallback(() => {
    if (chuongNgaiDangMo || dangDauPhap || tauHoa || ketThuc || tamDung) return;
    // Kiem tra huong dang nhin, hoac 4 o xung quanh co chuong ngai / Tieu Non
    const kqTruoc = tinhBuocDiChuyen(banDo, viTri, huong, daPhaSet);
    if (kqTruoc.gapChuongNgai && kqTruoc.viTriChuongNgai) {
      moThuThachChuongNgai(kqTruoc.gapChuongNgai, kqTruoc.viTriChuongNgai);
      return;
    }
    if (kqTruoc.gapTieuNon) {
      boPhatAmThanh.phatAmNgoDao();
      setHienLoiTieuNon(true);
      setThongBaoAi(banDo.loiNhacTieuNon);
      return;
    }
    for (const h of ['len', 'phai', 'trai', 'xuong'] as HuongDi[]) {
      const kq = tinhBuocDiChuyen(banDo, viTri, h, daPhaSet);
      if (kq.gapChuongNgai && kq.viTriChuongNgai) {
        setHuong(h);
        moThuThachChuongNgai(kq.gapChuongNgai, kq.viTriChuongNgai);
        return;
      }
      if (kq.gapTieuNon) {
        boPhatAmThanh.phatAmNgoDao();
        setHienLoiTieuNon(true);
        setThongBaoAi(banDo.loiNhacTieuNon);
        return;
      }
    }
    setThongBaoAi('Chưa có chướng ngại hay nhân vật nào ở ô kế bên để tương tác.');
  }, [chuongNgaiDangMo, dangDauPhap, tauHoa, ketThuc, tamDung, banDo, viTri, huong, daPhaSet, moThuThachChuongNgai]);

  // Dem nguoc Dau Phap
  useEffect(() => {
    if (!dangDauPhap || daCham || tauHoa || ketThuc || tamDung) return;
    const timer = window.setInterval(() => {
      setGiayDauPhap((g) => {
        if (g <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return g - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [dangDauPhap, daCham, tauHoa, ketThuc, tamDung, chiSoDauPhap]);

  useEffect(() => {
    if (dangDauPhap && giayDauPhap === 0 && !daCham && !tauHoa && !ketThuc) {
      xuLyNopBai(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [giayDauPhap]);

  // Phim tat WASD / Mui ten / Space / E / 1-4
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (moMayTinh || tauHoa || ketThuc || tamDung || kinhDangXem.length > 0) return;
      const dangGo =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA';
      if (dangGo) return;

      if (e.key === 'Escape') {
        setTamDung(true);
        return;
      }

      if (chuongNgaiDangMo || dangDauPhap) {
        if (!daCham && cauHienTai && cauHienTai.dang !== 'dienSo') {
          const mapPhim: Record<string, number> = {
            '1': 0, '2': 1, '3': 2, '4': 3,
            a: 0, b: 1, c: 2, d: 3,
            A: 0, B: 1, C: 2, D: 3,
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
        if (e.key === 'Enter') {
          e.preventDefault();
          if (!daCham) {
            if (cauHienTai?.dang === 'dienSo' ? soNhap.trim() : phuongAnChon !== null) {
              xuLyNopBai(false);
            }
          } else {
            tiepTucSauKhiCham();
          }
        }
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        thucHienDiChuyen('len');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        thucHienDiChuyen('xuong');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        thucHienDiChuyen('trai');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        thucHienDiChuyen('phai');
      } else if (e.key === ' ') {
        e.preventDefault();
        thucHienNhay();
      } else if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
        e.preventDefault();
        thucHienTuongTac();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    moMayTinh,
    tauHoa,
    ketThuc,
    tamDung,
    kinhDangXem.length,
    chuongNgaiDangMo,
    dangDauPhap,
    daCham,
    cauHienTai,
    phuongAnBiAn,
    soNhap,
    phuongAnChon,
    thucHienDiChuyen,
    thucHienNhay,
    thucHienTuongTac,
  ]);

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
    setTongCauDaLam((t) => t + 1);
    setCauDaDungIds((ds) => Array.from(new Set([...ds, cauHienTai.id])));

    if (dangDauPhap) {
      if (Math.random() < 0.62) setDiemDoiThu((d) => d + 1);
    }

    if (dung) {
      khiTraLoiDung?.(cauHienTai.id, canhGioi);
      if (laTamMa) {
        boPhatAmThanh.phatAmNgoDao();
        setLinhLuc((l) => Math.min(linhLucToiDa, l + 1));
        setLinhThachTichLuy((lt) => lt + 25);
        setDaDietTamMa(true);
        setChuoiSai(0);
        return;
      }

      const chuoiMoi = chuoiDung + 1;
      setChuoiDung(chuoiMoi);
      setChuoiSai(0);
      setChuoiNgoDaoMax((m) => Math.max(m, chuoiMoi));

      if (dangDauPhap) {
        setDiemTaDauPhap((d) => d + 1);
      } else {
        setSoCauDung((s) => s + 1);
      }

      let linhKhiCau = 16;
      if (chuoiMoi >= 3) {
        boPhatAmThanh.phatAmNgoDao();
        linhKhiCau = Math.round(linhKhiCau * 1.35 * chiSo.heSoNgoDao);
      } else {
        boPhatAmThanh.phatAmDaVo();
      }
      setLinhKhiTichLuy((lk) => lk + Math.round(linhKhiCau * chiSo.heSoLinhKhi));
      setLinhThachTichLuy((lt) => lt + 10);

      if (chuongNgaiDangMo) {
        const key = khoaToaDo(chuongNgaiDangMo.toaDo.x, chuongNgaiDangMo.toaDo.y);
        if (!daPhaCn.includes(key)) {
          setDaPhaCn((cu) => [...cu, key]);
          if (!cnBiSaiTruocDo.includes(key)) {
            setSoPhaLanDauDung((s) => s + 1);
          }
        }
      }
    } else {
      boPhatAmThanh.phatAmSai();
      khiTraLoiSai?.(cauHienTai.id, canhGioi);
      setChuoiDung(0);
      const saiMoi = chuoiSai + 1;
      setChuoiSai(saiMoi);

      if (chuongNgaiDangMo) {
        const key = khoaToaDo(chuongNgaiDangMo.toaDo.x, chuongNgaiDangMo.toaDo.y);
        if (!cnBiSaiTruocDo.includes(key)) {
          setCnBiSaiTruocDo((cu) => [...cu, key]);
        }
      }

      if (chiSo.mienSaiLanDau && !daMienSai && !laTamMa) {
        setDaMienSai(true);
      } else {
        const llMoi = Math.max(0, linhLuc - 1);
        setLinhLuc(llMoi);
        if (llMoi <= 0) setTauHoa(true);
      }
    }
  };

  const tiepTucSauKhiCham = () => {
    boPhatAmThanh.phatAmNhanNut();

    if (dangDauPhap) {
      if (chiSoDauPhap + 1 < boCauDauPhap.length) {
        const idxMoi = chiSoDauPhap + 1;
        setChiSoDauPhap(idxMoi);
        setCauHienTai(boCauDauPhap[idxMoi]);
        setPhuongAnChon(null);
        setSoNhap('');
        setDaCham(false);
        setVuaDung(false);
        setHienGoiY(false);
        setPhuongAnBiAn([]);
        setGiayDauPhap(thoiGianDauPhap);
      } else {
        setDangDauPhap(false);
        const thangDp = diemTaDauPhap >= diemDoiThu && diemTaDauPhap >= 2;
        ketThucAi(thangDp, diemTaDauPhap);
      }
      return;
    }

    if (vuaDung) {
      if (laTamMa) {
        setLaTamMa(false);
        setChuongNgaiDangMo(null);
        setCauHienTai(null);
        setTuThe('dungYen');
        setThongBaoAi('Đã trảm diệt Tâm Ma, hồi +1 Linh lực!');
        return;
      }
      if (chuongNgaiDangMo) {
        const td = chuongNgaiDangMo.toaDo;
        setChuongNgaiDangMo(null);
        setCauHienTai(null);
        setTuThe('dungYen');
        setViTri(td);
        xuLyNhatO(td);
        setThongBaoAi(`Đã phá ${chuongNgaiDangMo.info.ten}! Tiến tiếp về Cổng Thiên Môn.`);
      }
      return;
    }

    // Neu sai khi dang pha chuong ngai -> 2 lan sai lien tiep kich hoat Tam Ma hoac doi cau moi cho chuong ngai
    if (!laTamMa && chuoiSai >= 2 && linhLuc > 0) {
      const cauTm = layCauMoi([cauHienTai?.id || '']);
      if (cauTm) {
        boPhatAmThanh.phatAmSamSet();
        setLaTamMa(true);
        setCauHienTai(cauTm);
        setPhuongAnChon(null);
        setSoNhap('');
        setDaCham(false);
        setVuaDung(false);
        setHienGoiY(false);
        setPhuongAnBiAn([]);
        return;
      }
    }

    // Doi cau khac cho chinh chuong ngai nay
    const cauKhac = layCauMoi([cauHienTai?.id || '']);
    if (cauKhac) {
      setCauHienTai(cauKhac);
    }
    setPhuongAnChon(null);
    setSoNhap('');
    setDaCham(false);
    setVuaDung(false);
    setHienGoiY(false);
    setPhuongAnBiAn([]);
  };

  const dungBuaChiDuong = () => {
    if (daDungBuaChiDuong || (tonKhoPhu.buaChiDuong || 0) <= 0) return;
    const duong = timDuongNganNhat(banDo, viTri, banDo.dich, daPhaSet);
    if (duong.length === 0) return;
    boPhatAmThanh.phatAmNgoDao();
    dungVatPhamTieuHao('buaChiDuong');
    setDaDungBuaChiDuong(true);
    setDuongChiDan(duong);
    setThongBaoAi('Bùa Chỉ Đường đã soi sáng lộ trình ngắn nhất tới Cổng Thiên Môn!');
  };

  const batDauGiuHuong = (h: HuongDi) => {
    thucHienDiChuyen(h);
    if (giuPhimTimer.current) window.clearInterval(giuPhimTimer.current);
    giuPhimTimer.current = window.setInterval(() => {
      thucHienDiChuyen(h);
    }, 200);
  };

  const dungGiuHuong = () => {
    if (giuPhimTimer.current) {
      window.clearInterval(giuPhimTimer.current);
      giuPhimTimer.current = null;
    }
  };

  useEffect(() => () => dungGiuHuong(), []);

  // Man ket thuc
  if (ketThuc) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8 pb-24">
        <CuonThuGiayDo className="text-center">
          <div className="dau-an-trang-tri text-xs font-bold uppercase text-[#8F1F1A]">
            Vượt Ải Viên Mãn
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2118] mt-1">
            {laHauKy
              ? 'Vượt Ải & Thắng Cổng Thiên Môn!'
              : 'Vượt Ải Thành Công!'}
          </h2>
          <p className="text-sm text-[#2B2118]/80 mt-1">
            {thongTinCg.ten} · {thongTinGd.ten}
          </p>

          <div className="flex justify-center gap-2 my-4">
            {[1, 2, 3].map((s) => (
              <BieuTuongSao key={s} sang={s <= ketThuc.soSao} className="w-8 h-8" />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2.5 my-4 text-center">
            <div className="rounded-lg bg-[#0D1424] p-3 text-[#F6EEDB]">
              <div className="text-xs text-[#9BA8BE]">Phá lần đầu</div>
              <div className="text-xl font-bold text-[#62D1B5] chu-so-bang">
                {soPhaLanDauDung}/5
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

          {laHauKy && (
            <p className="text-xs text-[#6B3B2A] mb-3">
              Đấu Pháp trước Cổng Thiên Môn với {tenDoiThu}: {diemTaDauPhap} – {diemDoiThu}
            </p>
          )}

          <div className="mt-5 flex justify-center">
            <NutLenhBai type="button" kieu="vang" onClick={() => khiHoanThanh(ketThuc)}>
              Nhận thưởng & Tiếp tục
            </NutLenhBai>
          </div>
        </CuonThuGiayDo>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 pb-24 md:pb-10">
      {/* Thanh trang thai tren cung */}
      <div className="khung-ngoc-gian rounded-xl p-3 mb-3 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <NhanVat
            ngoaiHinh={tienTrinh.ngoaiHinh}
            kichCo="nho"
            canhGioi={canhGioi}
            tuThe={tuThe}
            className="w-11 h-11"
          />
          <div>
            <div className="text-xs text-[#62D1B5] font-semibold">
              {thongTinCg.ten} · {thongTinGd.ten} · Vượt Ải ({daPhaCn.length}/5)
            </div>
            <div className="flex items-center gap-1 mt-1" aria-label={`Còn ${linhLuc} Linh lực`}>
              {Array.from({ length: linhLucToiDa }).map((_, idx) => (
                <BieuTuongLinhLuc
                  key={idx}
                  trangThai={idx < linhLuc ? 'day' : 'trong'}
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-xs chu-so-bang mr-1">
            <span className="inline-flex items-center gap-1 text-[#62D1B5]">
              <BieuTuongLinhKhi className="w-3.5 h-3.5" />+{linhKhiTichLuy}
            </span>
            <span className="inline-flex items-center gap-1 text-[#E4BC5A]">
              <BieuTuongLinhThach className="w-3.5 h-3.5" />+{linhThachTichLuy}
            </span>
          </div>

          <button
            type="button"
            disabled={daDungBuaChiDuong || (tonKhoPhu.buaChiDuong || 0) <= 0}
            onClick={dungBuaChiDuong}
            className="min-h-[38px] px-2.5 rounded-lg bg-[#141D33] border border-[#E4BC5A]/45 text-[#F2D88B] text-xs font-semibold disabled:opacity-45 cursor-pointer"
          >
            Bùa Chỉ Đường ({tonKhoPhu.buaChiDuong || 0})
          </button>

          <button
            type="button"
            onClick={() => setTamDung(true)}
            className="min-h-[38px] px-2.5 rounded-lg bg-[#0D1424] border border-[#1F2A4D] text-xs text-[#DCE6EA] cursor-pointer"
          >
            Tạm dừng
          </button>
        </div>
      </div>

      {/* Thong bao huong dan / Tieu Non */}
      <div className="mb-3 rounded-xl border border-[#3FB59A]/40 bg-[#0D1424]/90 px-3.5 py-2 flex items-center gap-2.5 text-xs text-[#DCE6EA]">
        <TieuNon
          bieuCam={hienLoiTieuNon ? 'coVu' : 'vui'}
          className="w-9 h-9 shrink-0"
        />
        <span className="leading-snug">{thongBaoAi}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-3 items-start">
        {/* Ban do luoi 9x14 tren canh nen chibi */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-[#E4BC5A]/45 shadow-[0_14px_34px_rgba(7,11,20,0.45)]">
          <div className="absolute inset-0">
            <CanhNenChibi canhGioi={canhGioi} className="w-full h-full opacity-95" hienHoaDaoRoi={false} />
          </div>

          {/* Khung luoi SVG + Sprite */}
          <div className="relative mx-auto w-full max-w-[295px] sm:max-w-[390px] aspect-[9/14] my-1.5 px-1">
            <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-[#4A2E20]/70 bg-[#5EA852]/35 backdrop-blur-[1px]">
              <svg viewBox="0 0 90 140" className="w-full h-full block" aria-label="Bản đồ Vượt Ải 9x14">
                {banDo.luoi.map((hang, y) =>
                  hang.map((loai, x) => {
                    const px = x * 10;
                    const py = y * 10;
                    const k = khoaToaDo(x, y);
                    const daPha = daPhaSet.has(k);
                    const daNhat = daNhatO.includes(k);

                    if (loai === 'tuongNui') {
                      return (
                        <g key={k} transform={`translate(${px}, ${py})`}>
                          <rect width="10" height="10" fill="#5D8F49" opacity="0.88" />
                          <circle cx="5" cy="5.2" r="3.6" fill="#467A39" stroke="#36572C" strokeWidth="0.45" />
                          <circle cx="3.8" cy="4" r="1.4" fill="#6BB152" opacity="0.7" />
                        </g>
                      );
                    }
                    if (loai === 'hoNuoc') {
                      return (
                        <g key={k} transform={`translate(${px}, ${py})`}>
                          <rect width="10" height="10" fill="#68BCEE" />
                          <path d="M1.5 4 Q5 3 8.5 4" stroke="#E0F6FF" strokeWidth="0.45" fill="none" />
                          <circle cx="6.5" cy="6.5" r="1.4" fill="#70C25B" />
                        </g>
                      );
                    }
                    if (loai === 'hoNho') {
                      return (
                        <g key={k} transform={`translate(${px}, ${py})`}>
                          <rect width="10" height="10" fill="#3B2B23" />
                          <rect x="0.8" y="0.8" width="8.4" height="8.4" rx="1" fill="#1F1815" stroke="#E4BC5A" strokeWidth="0.4" strokeDasharray="1.5 1" />
                          <path d="M3 5 L5 3 L7 5" stroke="#F2D88B" strokeWidth="0.7" fill="none" />
                        </g>
                      );
                    }
                    return (
                      <g key={k} transform={`translate(${px}, ${py})`}>
                        {/* O duong di da lat */}
                        <rect
                          x="0.3"
                          y="0.3"
                          width="9.4"
                          height="9.4"
                          rx="1.2"
                          fill="#EDE1C4"
                          stroke="#B99C6B"
                          strokeWidth="0.45"
                        />
                        {loai === 'congThienMon' && (
                          <g>
                            <rect x="1.5" y="1" width="7" height="8" rx="1" fill={daPhaCn.length >= 5 ? '#3FB59A' : '#7C6C5D'} stroke="#4A2E20" strokeWidth="0.6" />
                            <path d="M1 2.2 Q5 0 9 2.2" fill="#E4BC5A" stroke="#4A2E20" strokeWidth="0.5" />
                            <circle cx="5" cy="5.5" r="1.4" fill="#FFF3C4" />
                          </g>
                        )}
                        {loai === 'chuongNgai' && !daPha && (
                          <g>
                            {banDo.chuongNgai[k]?.loai === 'daTang' && (
                              <path d="M1.5 8 L2.5 2.5 L6 1.8 L8.5 4 L8 8 Z" fill="#8B9198" stroke="#4A2E20" strokeWidth="0.6" />
                            )}
                            {banDo.chuongNgai[k]?.loai === 'congPhongAn' && (
                              <g>
                                <rect x="1.5" y="2" width="7" height="6.5" rx="1" fill="#6E44B8" stroke="#E4BC5A" strokeWidth="0.6" />
                                <circle cx="5" cy="5.2" r="1.5" fill="#F2D88B" />
                              </g>
                            )}
                            {banDo.chuongNgai[k]?.loai === 'cayCoThu' && (
                              <g>
                                <rect x="4" y="5.5" width="2" height="3" fill="#6E4427" />
                                <circle cx="5" cy="4.2" r="3" fill="#3B7A43" stroke="#254A2A" strokeWidth="0.5" />
                              </g>
                            )}
                            {banDo.chuongNgai[k]?.loai === 'suongDoc' && (
                              <g>
                                <circle cx="4" cy="5" r="2.6" fill="#A779FF" opacity="0.88" />
                                <circle cx="6.4" cy="4.6" r="2.2" fill="#7A4DFF" opacity="0.82" />
                              </g>
                            )}
                          </g>
                        )}
                        {loai === 'linhThach' && !daNhat && (
                          <polygon points="5,2 7.5,4.5 6.5,8 3.5,8 2.5,4.5" fill="#F2D88B" stroke="#4A2E20" strokeWidth="0.5" />
                        )}
                        {loai === 'ruongBau' && !daNhat && (
                          <g>
                            <rect x="2" y="3" width="6" height="5" rx="0.8" fill="#B57435" stroke="#4A2E20" strokeWidth="0.5" />
                            <line x1="2" y1="5.2" x2="8" y2="5.2" stroke="#F2D88B" strokeWidth="0.7" />
                          </g>
                        )}
                      </g>
                    );
                  })
                )}

                {/* Ve duong chi dan cua Bua Chi Duong */}
                {duongChiDan.length > 1 && (
                  <polyline
                    points={duongChiDan.map((p) => `${p.x * 10 + 5},${p.y * 10 + 5}`).join(' ')}
                    fill="none"
                    stroke="#E4BC5A"
                    strokeWidth="1.2"
                    strokeDasharray="2 1.5"
                    strokeLinecap="round"
                  />
                )}
              </svg>

              {/* Tieu Non dung ben canh duong */}
              <div
                className="absolute pointer-events-none"
                style={{
                  left: `${((banDo.toaDoTieuNon.x + 0.5) / 9) * 100}%`,
                  top: `${((banDo.toaDoTieuNon.y + 0.5) / 14) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <TieuNon className="w-8 h-8" bieuCam={hienLoiTieuNon ? 'coVu' : 'vui'} />
              </div>

              {/* Nhan vat nguoi choi di chuyen muot 180ms */}
              <div
                className="absolute pointer-events-none transition-all duration-150 ease-linear"
                style={{
                  left: `${((viTri.x + 0.5) / 9) * 100}%`,
                  top: `${((viTri.y + 0.5) / 14) * 100}%`,
                  transform: 'translate(-50%, -58%)',
                }}
              >
                <NhanVat
                  ngoaiHinh={tienTrinh.ngoaiHinh}
                  kichCo="nho"
                  tuThe={tuThe}
                  huong={huong === 'trai' ? 'trai' : 'phai'}
                  canhGioi={canhGioi}
                  className="w-9 h-9"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bang dieu khien D-Pad & hanh dong */}
        <div className="khung-ngoc-gian rounded-2xl p-3 sm:p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between lg:flex-col lg:text-center gap-2">
            <div className="text-xs font-bold text-[#F2D88B]">
              Bàn Điều Khiển Vượt Ải
            </div>
            <div className="text-[11px] text-[#9BA8BE] hidden sm:block">
              Mũi tên / WASD · Space nhảy · E tương tác
            </div>
            <div className="text-[11px] text-[#62D1B5] lg:hidden chu-so-bang">
              Ải: {daPhaCn.length}/5 · +{linhThachTichLuy} đá
            </div>
          </div>

          <div className="grid grid-cols-[auto_1fr] lg:grid-cols-1 gap-3 items-center">
            {/* D-pad >= 56px touch-action none */}
            <div className="grid grid-cols-3 gap-1.5 select-none mx-auto">
              <div />
              <button
                type="button"
                aria-label="Đi lên"
                onPointerDown={() => batDauGiuHuong('len')}
                onPointerUp={dungGiuHuong}
                onPointerLeave={dungGiuHuong}
                onPointerCancel={dungGiuHuong}
                className="nut-dpad min-w-[56px] min-h-[56px] rounded-xl bg-[#141D33] border-2 border-[#E4BC5A]/45 text-[#F2D88B] font-bold text-lg flex items-center justify-center active:bg-[#1E7F6B] cursor-pointer"
              >
                ↑
              </button>
              <div />

              <button
                type="button"
                aria-label="Đi trái"
                onPointerDown={() => batDauGiuHuong('trai')}
                onPointerUp={dungGiuHuong}
                onPointerLeave={dungGiuHuong}
                onPointerCancel={dungGiuHuong}
                className="nut-dpad min-w-[56px] min-h-[56px] rounded-xl bg-[#141D33] border-2 border-[#E4BC5A]/45 text-[#F2D88B] font-bold text-lg flex items-center justify-center active:bg-[#1E7F6B] cursor-pointer"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Đi xuống"
                onPointerDown={() => batDauGiuHuong('xuong')}
                onPointerUp={dungGiuHuong}
                onPointerLeave={dungGiuHuong}
                onPointerCancel={dungGiuHuong}
                className="nut-dpad min-w-[56px] min-h-[56px] rounded-xl bg-[#141D33] border-2 border-[#E4BC5A]/45 text-[#F2D88B] font-bold text-lg flex items-center justify-center active:bg-[#1E7F6B] cursor-pointer"
              >
                ↓
              </button>
              <button
                type="button"
                aria-label="Đi phải"
                onPointerDown={() => batDauGiuHuong('phai')}
                onPointerUp={dungGiuHuong}
                onPointerLeave={dungGiuHuong}
                onPointerCancel={dungGiuHuong}
                className="nut-dpad min-w-[56px] min-h-[56px] rounded-xl bg-[#141D33] border-2 border-[#E4BC5A]/45 text-[#F2D88B] font-bold text-lg flex items-center justify-center active:bg-[#1E7F6B] cursor-pointer"
              >
                →
              </button>
            </div>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={thucHienTuongTac}
                className="nut-dpad min-h-[56px] rounded-xl bg-[#1E7F6B] border border-[#62D1B5] text-[#F8F6EE] text-xs font-bold cursor-pointer px-2"
              >
                Tương tác (E)
              </button>
              <button
                type="button"
                onClick={thucHienNhay}
                className="nut-dpad min-h-[56px] rounded-xl bg-[#B98B2E] border border-[#F2D88B] text-[#070B14] text-xs font-bold cursor-pointer px-2"
              >
                Nhảy (Space)
              </button>
            </div>
          </div>

          <div className="hidden lg:block w-full rounded-lg bg-[#070B14]/75 border border-[#1F2A4D] p-2.5 text-[11px] text-[#9BA8BE] space-y-1">
            <div>Chướng ngại đã phá: <strong className="text-[#62D1B5] chu-so-bang">{daPhaCn.length}/5</strong></div>
            <div>Linh thạch đã nhặt: <strong className="text-[#E4BC5A] chu-so-bang">+{linhThachTichLuy}</strong></div>
            <div>Phá đúng lần đầu: <strong className="text-[#F6EEDB] chu-so-bang">{soPhaLanDauDung}</strong></div>
          </div>
        </div>
      </div>

      {/* Modal giai cau hoi cho Chuong Ngai / Tam Ma / Dau Phap */}
      {(chuongNgaiDangMo || dangDauPhap) && cauHienTai && (
        <div
          className="fixed inset-0 z-40 bg-black/78 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-xl w-full my-auto space-y-3">
            {/* Banner Tam Ma hoac Dau Phap */}
            {laTamMa && (
              <div className="rounded-xl border border-[#B79CFF] bg-[#1F1338] p-3 flex items-center gap-3">
                <BieuTuongTamMa className="w-7 h-7 shrink-0" />
                <div className="text-xs text-[#E5DAFF]">
                  <strong>Tâm Ma Xuất Hiện!</strong> Trả lời đúng để trảm diệt Tâm Ma, hồi +1 Linh lực và nhận +25 Linh thạch.
                </div>
              </div>
            )}

            {dangDauPhap && (
              <div className="khung-ngoc-gian rounded-xl p-3 flex items-center justify-between gap-2 border-[#C8372D]/60">
                <div className="flex items-center gap-2 text-xs text-[#F28A80] font-semibold">
                  <BieuTuongKiem className="w-4 h-4" />
                  <span>
                    Đấu Pháp Cổng Thiên Môn ({chiSoDauPhap + 1}/{boCauDauPhap.length}) · Ta {diemTaDauPhap} – {diemDoiThu} {tenDoiThu}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#070B14] text-sm font-bold text-[#F2D88B] chu-so-bang">
                  {giayDauPhap}s
                </span>
              </div>
            )}

            <CuonThuGiayDo>
              <div className="flex items-center justify-between text-xs text-[#6B3B2A] mb-2">
                <span className="font-bold">
                  {laTamMa
                    ? 'Thử Thách Tâm Ma'
                    : dangDauPhap
                    ? 'Đấu Pháp Hậu Kỳ'
                    : `${chuongNgaiDangMo?.info.ten} (${chuongNgaiDangMo?.info.thuTu}/5)`}
                </span>
                {tienTrinh.caiDat.batMayTinh && !dangDauPhap && (
                  <button
                    type="button"
                    onClick={() => setMoMayTinh(true)}
                    className="px-2.5 py-1 rounded bg-[#141D33] text-[#F2D88B] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <BieuTuongMayTinh className="w-3.5 h-3.5" />
                    Toán bàn
                  </button>
                )}
              </div>

              <div className="text-base font-medium text-[#2B2118] leading-relaxed">
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
                    placeholder={`Nhập số${cauHienTai.donVi ? ` (${cauHienTai.donVi})` : ''}...`}
                    aria-label="Nhập đáp án số"
                    className="w-full min-h-[46px] px-3.5 rounded-lg bg-white/85 border-2 border-[#B98B2E]/60 text-[#2B2118] text-base font-semibold chu-so-bang"
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(cauHienTai.luaChon || []).map((lc, idx) => {
                      const biAn = phuongAnBiAn.includes(idx);
                      const dangChon = phuongAnChon === idx;
                      const laDung = idx === Number(cauHienTai.dapAn);
                      let lop = 'bg-[#FFFDF8] border-[#B98B2E]/45 text-[#2B2118]';
                      if (daCham) {
                        if (laDung) lop = 'bg-[#1E7F6B] border-[#0E4A3E] text-[#F8F6EE]';
                        else if (dangChon) lop = 'bg-[#C8372D] border-[#8F1F1A] text-[#FAF4E8]';
                      } else if (dangChon) {
                        lop = 'bg-[#141D33] border-[#E4BC5A] text-[#F2D88B]';
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
                          className={`min-h-[48px] px-3 py-2 rounded-lg border-2 text-left flex items-center gap-2.5 cursor-pointer ${
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
                  className={`mt-3 rounded-lg border p-3 text-sm ${
                    vuaDung
                      ? 'bg-[#1E7F6B]/14 border-[#1E7F6B] text-[#124238]'
                      : 'bg-[#C8372D]/12 border-[#C8372D] text-[#6E1A15]'
                  }`}
                >
                  <div className="font-bold mb-1">
                    {vuaDung
                      ? 'Chính xác! Chướng ngại đã bị phá tan.'
                      : 'Chưa chuẩn xác (-1 Linh lực)! Đề mới sẽ thay thế cho chướng ngại này.'}
                  </div>
                  <div className="text-[#2B2118] text-xs sm:text-sm">
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
                    disabled={
                      daCham ||
                      hienGoiY ||
                      (!mienPhiGoiY && (tonKhoPhu.phuThoiDien || 0) <= 0)
                    }
                    onClick={() => {
                      if (mienPhiGoiY) setMienPhiGoiY(false);
                      else dungVatPhamTieuHao('phuThoiDien');
                      setHienGoiY(true);
                    }}
                    className="min-h-[36px] px-2.5 rounded bg-[#141D33] text-[#F2D88B] text-xs font-semibold flex items-center gap-1 disabled:opacity-40 cursor-pointer"
                  >
                    <BieuTuongGoiY className="w-3.5 h-3.5" />
                    {mienPhiGoiY ? 'Gợi ý' : `Thôi Diễn (${tonKhoPhu.phuThoiDien || 0})`}
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
                        dungVatPhamTieuHao('phuKhamPha');
                        setPhuongAnBiAn(sai);
                      }}
                      className="min-h-[36px] px-2.5 rounded bg-[#141D33] text-[#62D1B5] text-xs font-semibold disabled:opacity-40 cursor-pointer"
                    >
                      50:50 ({tonKhoPhu.phuKhamPha || 0})
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={linhLuc >= linhLucToiDa || (tonKhoPhu.phuHoiLinh || 0) <= 0}
                    onClick={() => {
                      dungVatPhamTieuHao('phuHoiLinh');
                      setLinhLuc((l) => Math.min(linhLucToiDa, l + 1));
                    }}
                    className="min-h-[36px] px-2.5 rounded bg-[#141D33] text-[#62D1B5] text-xs font-semibold disabled:opacity-40 cursor-pointer"
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
                    onClick={() => xuLyNopBai(false)}
                  >
                    Phá chướng ngại
                  </NutLenhBai>
                ) : (
                  <NutLenhBai type="button" kieu="vang" onClick={tiepTucSauKhiCham}>
                    {vuaDung ? 'Tiến bước tiếp theo' : 'Thử lại chướng ngại'}
                  </NutLenhBai>
                )}
              </div>
            </CuonThuGiayDo>
          </div>
        </div>
      )}

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

      {tamDung && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="khung-ngoc-gian rounded-xl p-6 max-w-sm w-full text-center">
            <h3 className="tieu-de-vang text-xl font-bold">Tạm Ngưng Vượt Ải</h3>
            <p className="text-sm text-[#9BA8BE] mt-2">
              Nếu thoát lúc này, tiến độ vượt ải hiện tại sẽ chưa được lưu.
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <NutLenhBai type="button" kieu="ngoc" onClick={() => setTamDung(false)}>
                Tiếp tục vượt ải
              </NutLenhBai>
              <NutLenhBai type="button" kieu="chuSa" onClick={khiThoat}>
                Quay lại bản đồ giai đoạn
              </NutLenhBai>
            </div>
          </div>
        </div>
      )}

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
              Đạo hữu tạm kiệt sức trước chướng ngại ({tongCauDaLam} lượt giải), túi đồ và linh thạch vẫn nguyên vẹn!
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              {(tonKhoPhu.thanhTamDan || 0) > 0 && (
                <NutLenhBai
                  type="button"
                  kieu="vang"
                  onClick={() => {
                    dungVatPhamTieuHao('thanhTamDan');
                    setLinhLuc(linhLucToiDa);
                    setTauHoa(false);
                    setChuoiSai(0);
                    if (daCham) tiepTucSauKhiCham();
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
                    dungVatPhamTieuHao('hoMachDan');
                    setLinhLuc(linhLucToiDa);
                    setLinhKhiTichLuy((k) => k + 40);
                    setTauHoa(false);
                    setChuoiSai(0);
                    if (daCham) tiepTucSauKhiCham();
                  }}
                >
                  Dùng {timVatPham('hoMachDan')?.ten} hồi sinh +40 Linh khí (Còn {tonKhoPhu.hoMachDan})
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
