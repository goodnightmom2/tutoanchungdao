import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { boPhatAmThanh } from './amThanh/boPhatAmThanh';
import { layThongTinCanhGioi } from './duLieu/canhGioi';
import { CAU_HOI_MAC_DINH } from './duLieu/cauHoi';
import {
  DANH_SACH_THANH_TICH,
  moRuongCoDuyenNgauNhien,
  timVatPham,
} from './duLieu/vatPham';
import {
  CauHinhCongKhai,
  CauHoiTuyChinhDamMay,
  ChiTietCauLuot,
  HoSoNguoiDung,
  ThongTinKhoaTaiKhoan,
  TrangThaiDongBo,
  XungDotTienTrinh,
} from './kieuDuLieu/taiKhoan';
import {
  CaiDatTroChoi,
  CauHoi,
  MaCanhGioi,
  MaGiaiDoan,
  ManHinh,
  NgoaiHinh,
  TienTrinhNguoiChoi,
} from './kieuDuLieu/troChoi';
import {
  datCheDoLuuPhien,
  kiemTraKetNoiSupabase,
  supabase,
  supabaseDaCauHinh,
} from './lib/supabase';
import { ghiNhanLichSuCauHoi } from './logic/bocCauHoi';
import {
  CAP_NANG_CAP_TOI_DA,
  capNhatSoTamMa,
  chiPhiNangCapLinhMach,
  chiPhiNangCapLinhTuyen,
  layNgayHomNay,
  soLuotBeQuanConLaiHomNay,
} from './logic/dongPhu';
import { khoLuuTru } from './logic/khoLuuTru';
import {
  chuanHoaDaoHieuTuGoogle,
  coTienTrinhKhachDangKe,
  doiMaLoiFirebase,
  tenDangNhapSangEmail,
} from './logic/taiKhoanLogic';
import {
  CHU_KY_RUONG_CO_DUYEN_MS,
  khoaGiaiDoan,
  kiemTraThanhTichMoi,
  layThongTinHaoQuang,
  moRuongCoDuyenSanSang,
  taoTienTrinhMacDinh,
  tinhTongSao,
} from './logic/tienTrinh';
import { BanDoGiaiDoan, VanHaiDo } from './manHinh/BanDoVanHaiVaGiaiDoan';
import type { KetQuaManChoi } from './manHinh/ManChoi';
import {
  DuLieuDangKy,
  DuLieuDangNhap,
  ManSonMon,
} from './manHinh/ManSonMon';
import type { KetQuaYeuVuong } from './manHinh/ManYeuVuong';

const ManBangQuanTri = lazy(() =>
  import('./manHinh/ManBangQuanTri').then((m) => ({ default: m.ManBangQuanTri }))
);
const ManCaiDatVaGiaoVien = lazy(() =>
  import('./manHinh/ManCaiDatVaGiaoVien').then((m) => ({
    default: m.ManCaiDatVaGiaoVien,
  }))
);
const ManChoi = lazy(() =>
  import('./manHinh/ManChoi').then((m) => ({ default: m.ManChoi }))
);
const ManDongPhu = lazy(() =>
  import('./manHinh/ManDongPhu').then((m) => ({ default: m.ManDongPhu }))
);
const ManHoSo = lazy(() =>
  import('./manHinh/ManHoSo').then((m) => ({ default: m.ManHoSo }))
);
const ManCotTruyen = lazy(() =>
  import('./manHinh/ManMoDauVaCotTruyen').then((m) => ({
    default: m.ManCotTruyen,
  }))
);
const ManPhongThayDo = lazy(() =>
  import('./manHinh/ManPhongThayDo').then((m) => ({ default: m.ManPhongThayDo }))
);
const ManTangKinhCac = lazy(() =>
  import('./manHinh/ManTangKinhCac').then((m) => ({ default: m.ManTangKinhCac }))
);
const ManTaoNhanVat = lazy(() =>
  import('./manHinh/ManTaoNhanVat').then((m) => ({ default: m.ManTaoNhanVat }))
);
const ManCuaHang = lazy(() =>
  import('./manHinh/ManTuiDoVaCuaHang').then((m) => ({ default: m.ManCuaHang }))
);
const ManTuiDo = lazy(() =>
  import('./manHinh/ManTuiDoVaCuaHang').then((m) => ({ default: m.ManTuiDo }))
);
const ManVuotAi = lazy(() =>
  import('./manHinh/ManVuotAi').then((m) => ({ default: m.ManVuotAi }))
);
const ManYeuVuong = lazy(() =>
  import('./manHinh/ManYeuVuong').then((m) => ({ default: m.ManYeuVuong }))
);
import {
  BieuTuongAmThanh,
  BieuTuongBanDo,
  BieuTuongCaiDat,
  BieuTuongDongPhu,
  BieuTuongHoSo,
  BieuTuongLinhKhi,
  BieuTuongLinhThach,
  BieuTuongRuong,
  BieuTuongTangKinhCac,
  BieuTuongTuiDo,
} from './thanhPhan/BieuTuong';
import {
  HopThoaiChonDaoHieuLanDau,
  HopThoaiChuyenTienTrinhKhach,
  HopThoaiDoiMatKhauBatBuoc,
  HopThoaiXungDotTienTrinh,
  ManTaiKhoanBiKhoa,
} from './thanhPhan/HopThoaiTaiKhoan';
import { NenThuyMac, ThanhTruyenAm } from './thanhPhan/KhungGiaoDien';
import { MenuTaiKhoan } from './thanhPhan/MenuTaiKhoan';
import { NhanVat } from './thanhPhan/NhanVat';

function dinhDangDemNguoc(ms: number): string {
  const giay = Math.max(0, Math.floor(ms / 1000));
  const gio = Math.floor(giay / 3600);
  const phut = Math.floor((giay % 3600) / 60);
  return `${gio}g${String(phut).padStart(2, '0')}p`;
}

export default function App() {
  const [tienTrinh, setTienTrinh] = useState<TienTrinhNguoiChoi>(() =>
    khoLuuTru.docTienTrinhKhach()
  );
  const [manHinh, setManHinh] = useState<ManHinh>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        return 'banDoTheGioi';
      }
    }
    return 'moDau';
  });
  const [canhGioiDangXem, setCanhGioiDangXem] = useState<MaCanhGioi>(
    () => tienTrinh.canhGioiHienTai
  );
  const [giaiDoanDangChoi, setGiaiDoanDangChoi] =
    useState<MaGiaiDoan>('soKy');
  const [noiQuayLaiPhongThayDo, setNoiQuayLaiPhongThayDo] = useState<
    'hoSo' | 'taoNhanVat'
  >('hoSo');
  const [ngoaiHinhTamPhongThayDo, setNgoaiHinhTamPhongThayDo] =
    useState<NgoaiHinh | null>(null);
  const [thongBao, setThongBao] = useState<string | null>(null);
  const [bayGio, setBayGio] = useState(() => Date.now());

  // === TRANG THAI TAI KHOAN, DAM MAY & QUAN TRI ===
  const [nguoiDungAuth, setNguoiDungAuth] = useState<User | null>(null);
  const [hoSo, setHoSo] = useState<HoSoNguoiDung | null>(null);
  const [laQuanTri, setLaQuanTri] = useState(false);
  const [khoaTaiKhoan, setKhoaTaiKhoan] = useState<ThongTinKhoaTaiKhoan | null>(
    null
  );
  const [dangXuLyAuth, setDangXuLyAuth] = useState(false);
  const [loiAuth, setLoiAuth] = useState<string | null>(null);
  const [moMenuTaiKhoan, setMoMenuTaiKhoan] = useState(false);
  const [trangThaiDongBo, setTrangThaiDongBo] = useState<TrangThaiDongBo>({
    loai: 'khach',
    lucCuoi: null,
  });
  const [xungDotTienTrinh, setXungDotTienTrinh] =
    useState<XungDotTienTrinh | null>(null);
  const [hienChonDaoHieuGoogle, setHienChonDaoHieuGoogle] = useState(false);
  const [tienTrinhKhachChoChuyen, setTienTrinhKhachChoChuyen] =
    useState<TienTrinhNguoiChoi | null>(null);

  const [cauHinhCongKhai, setCauHinhCongKhai] = useState<CauHinhCongKhai>({
    choPhepDangKy: true,
    thongBao: '',
    thongBaoLuc: null,
  });
  const [daAnThongBaoLuc, setDaAnThongBaoLuc] = useState<number>(() =>
    khoLuuTru.layMocDaAnThongBao()
  );
  const [cauHoiDamMay, setCauHoiDamMay] = useState<CauHoiTuyChinhDamMay[]>([]);

  // Ref theo doi chi tiet tung cau trong luot choi hien tai de ghi ketQuaLuot
  const thoiDiemBatDauLuotRef = useRef<number>(Date.now());
  const thoiDiemCauTruocRef = useRef<number>(Date.now());
  const chiTietLuotRef = useRef<ChiTietCauLuot[]>([]);
  const luuNgayLanSauRef = useRef<boolean>(false);
  const dangTaoHoSoMoiRef = useRef<boolean>(false);

  const laKhach = !nguoiDungAuth;

  const hienThongBao = (noiDung: string) => {
    setThongBao(noiDung);
  };

  useEffect(() => {
    if (!thongBao) return;
    const t = window.setTimeout(() => setThongBao(null), 3500);
    return () => window.clearTimeout(t);
  }, [thongBao]);

  // Khoi tao kiem tra ket noi, cau hinh cong khai va lang nghe dong bo
  useEffect(() => {
    void kiemTraKetNoiSupabase();
    void khoLuuTru.docCauHinhCongKhai().then(setCauHinhCongKhai);
    const huyDongBo = khoLuuTru.dangKyLangNgheDongBo(setTrangThaiDongBo);
    khoLuuTru.datLangNgheXungDot((xd) => setXungDotTienTrinh(xd));
    return () => {
      huyDongBo();
      khoLuuTru.datLangNgheXungDot(null);
    };
  }, []);

  // Lang nghe phien dang nhap Supabase Auth
  useEffect(() => {
    if (!supabaseDaCauHinh) return;

    const xuLyThayDoiNguoiDung = async (user: User | null) => {
      setNguoiDungAuth(user);
      if (!user) {
        khoLuuTru.chuyenCheDoKhach();
        setHoSo(null);
        setLaQuanTri(false);
        setKhoaTaiKhoan(null);
        setHienChonDaoHieuGoogle(false);
        setTienTrinhKhachChoChuyen(null);
        setCauHoiDamMay([]);
        const ttKhach = khoLuuTru.docTienTrinhKhach();
        setTienTrinh(ttKhach);
        setManHinh((m) => (m === 'bangQuanTri' ? 'moDau' : m));
        return;
      }

      if (dangTaoHoSoMoiRef.current) {
        return;
      }

      try {
        const emailDaXacMinh = Boolean(user.email_confirmed_at);
        const [ttKhoa, quyenQt] = await Promise.all([
          khoLuuTru.kiemTraKhoaTaiKhoan(user.id),
          khoLuuTru.kiemTraQuyenQuanTri(user.id, user.email, emailDaXacMinh),
        ]);
        setLaQuanTri(quyenQt);

        if (ttKhoa && !quyenQt) {
          setKhoaTaiKhoan(ttKhoa);
          return;
        }
        setKhoaTaiKhoan(null);

        let hs = await khoLuuTru.docHoSoNguoiDung(user.id);
        let ttDamMay: TienTrinhNguoiChoi;
        let laLanDauGoogle = false;

        if (!hs) {
          const tenGoogle =
            (user.user_metadata?.full_name as string | undefined) ||
            (user.user_metadata?.name as string | undefined) ||
            (user.user_metadata?.dao_hieu as string | undefined);
          const daoHieuGoiY = chuanHoaDaoHieuTuGoogle(tenGoogle);
          const kqMoi = await khoLuuTru.taoHoSoVaTienTrinhMoi({
            uid: user.id,
            daoHieu: daoHieuGoiY,
            tenDangNhap: null,
            email: user.email || null,
            lop: null,
            phuongThuc: 'google',
          });
          hs = kqMoi.hoSo;
          ttDamMay = kqMoi.tienTrinh;
          laLanDauGoogle = true;
        } else {
          ttDamMay = await khoLuuTru.taiTienTrinhTuDamMay(user.id);
        }

        const ttKhachHienCo = khoLuuTru.docTienTrinhKhach();
        if (coTienTrinhKhachDangKe(ttKhachHienCo)) {
          setTienTrinhKhachChoChuyen(ttKhachHienCo);
        }

        khoLuuTru.chuyenCheDoDamMay(user.id, hs);
        setHoSo(hs);
        setTienTrinh(ttDamMay);
        setCanhGioiDangXem(ttDamMay.canhGioiHienTai);
        if (laLanDauGoogle) {
          setHienChonDaoHieuGoogle(true);
        }

        void khoLuuTru.taiCauHoiTuyChinhDamMay().then(setCauHoiDamMay);

        setManHinh((m) => {
          if (m !== 'moDau') return m;
          if (!ttDamMay.daTaoNhanVat) return 'taoNhanVat';
          if (!ttDamMay.daXemCotTruyen) return 'cotTruyen';
          return 'banDoTheGioi';
        });
      } catch (err) {
        setLoiAuth(doiMaLoiFirebase(err));
      }
    };

    void supabase.auth.getSession().then(({ data }) => {
      void xuLyThayDoiNguoiDung(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void xuLyThayDoiNguoiDung(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Bao ve tuyen duong Bang Quan Tri (chan nguoi khong co quyen du doi URL/hash)
  useEffect(() => {
    if (manHinh === 'bangQuanTri' && !laQuanTri) {
      setManHinh(laKhach ? 'moDau' : 'banDoTheGioi');
    }
  }, [manHinh, laQuanTri, laKhach]);

  // Dat lai bo dem chi tiet luot choi moi khi vao man choi / vuot ai / yeu vuong
  useEffect(() => {
    if (manHinh === 'manChoi' || manHinh === 'vuotAi' || manHinh === 'yeuVuong') {
      const now = Date.now();
      thoiDiemBatDauLuotRef.current = now;
      thoiDiemCauTruocRef.current = now;
      chiTietLuotRef.current = [];
    }
  }, [manHinh, canhGioiDangXem, giaiDoanDangChoi]);

  // Dong bo luu tru qua khoLuuTru, am thanh, giam hieu ung va nhac nen
  useEffect(() => {
    const luuNgay = luuNgayLanSauRef.current;
    luuNgayLanSauRef.current = false;
    khoLuuTru.luu(tienTrinh, luuNgay);

    boPhatAmThanh.caiDatAmThanh(tienTrinh.caiDat.batAmThanh);
    boPhatAmThanh.batDauNhacNen(
      tienTrinh.caiDat.batNhacNen,
      manHinh === 'yeuVuong'
    );
    document.documentElement.dataset.giamHieuUng = String(
      tienTrinh.caiDat.giamHieuUng
    );
  }, [tienTrinh, manHinh]);

  useEffect(() => {
    document.body.dataset.state = manHinh === 'moDau' ? 'title' : 'playing';
  }, [manHinh]);

  useEffect(() => {
    const t = window.setInterval(() => setBayGio(Date.now()), 30000);
    return () => window.clearInterval(t);
  }, []);

  // Hop nhat ngan hang cau hoi: goc + tuy chinh dam may + ghi de cuc bo
  const nganHangDayDuChoQuanTri = useMemo<CauHoi[]>(() => {
    const mapDamMay = new Map<string, CauHoiTuyChinhDamMay>();
    for (const c of cauHoiDamMay) {
      mapDamMay.set(c.id, c);
    }
    const coBan = CAU_HOI_MAC_DINH.map((c) => {
      const tuDamMay = mapDamMay.get(c.id);
      if (tuDamMay) {
        mapDamMay.delete(c.id);
        return { ...c, ...tuDamMay };
      }
      return tienTrinh.cauHoiGhiDe[c.id] || c;
    });
    const themTuDamMay = Array.from(mapDamMay.values());
    const tuyChinhCucBo = (tienTrinh.cauHoiTuyChinh || []).map(
      (c) => tienTrinh.cauHoiGhiDe[c.id] || c
    );
    return [...coBan, ...themTuDamMay, ...tuyChinhCucBo];
  }, [cauHoiDamMay, tienTrinh.cauHoiGhiDe, tienTrinh.cauHoiTuyChinh]);

  const nganHangCauHoi = useMemo<CauHoi[]>(
    () => nganHangDayDuChoQuanTri.filter((c) => !c.daAn),
    [nganHangDayDuChoQuanTri]
  );

  // === CAC HAM XAC THUC (SON MON) ===
  const xuLyDangNhap = async (duLieu: DuLieuDangNhap) => {
    setDangXuLyAuth(true);
    setLoiAuth(null);
    try {
      khoLuuTru.datMayDungChung(duLieu.mayDungChung);
      await datCheDoLuuPhien(duLieu.mayDungChung);
      const emailAo = tenDangNhapSangEmail(duLieu.tenDangNhap);
      const { error } = await supabase.auth.signInWithPassword({
        email: emailAo,
        password: duLieu.matKhau,
      });
      if (error) throw error;
    } catch (err) {
      setLoiAuth(doiMaLoiFirebase(err));
    } finally {
      setDangXuLyAuth(false);
    }
  };

  const xuLyDangKy = async (duLieu: DuLieuDangKy) => {
    setDangXuLyAuth(true);
    setLoiAuth(null);
    dangTaoHoSoMoiRef.current = true;
    try {
      khoLuuTru.datMayDungChung(duLieu.mayDungChung);
      await datCheDoLuuPhien(duLieu.mayDungChung);
      const emailAo = tenDangNhapSangEmail(duLieu.tenDangNhap);
      const { data, error } = await supabase.auth.signUp({
        email: emailAo,
        password: duLieu.matKhau,
        options: {
          data: { dao_hieu: duLieu.daoHieu },
        },
      });
      if (error) throw error;
      const uid = data.user?.id;
      if (!uid) {
        throw new Error('Không thể khởi tạo tài khoản. Vui lòng thử lại.');
      }
      if (!data.session) {
        throw new Error('email_not_confirmed');
      }
      const ttKhachCu = khoLuuTru.docTienTrinhKhach();
      const coKhach = coTienTrinhKhachDangKe(ttKhachCu);

      const { hoSo: hsMoi, tienTrinh: ttMoi } =
        await khoLuuTru.taoHoSoVaTienTrinhMoi({
          uid,
          daoHieu: duLieu.daoHieu,
          tenDangNhap: duLieu.tenDangNhap,
          email: duLieu.emailKhoiPhuc || null,
          lop: duLieu.lop || null,
          phuongThuc: 'tenDangNhap',
        });

      khoLuuTru.chuyenCheDoDamMay(uid, hsMoi);
      setHoSo(hsMoi);
      setTienTrinh(ttMoi);
      setCanhGioiDangXem(ttMoi.canhGioiHienTai);
      if (coKhach) {
        setTienTrinhKhachChoChuyen(ttKhachCu);
      }
      void khoLuuTru.taiCauHoiTuyChinhDamMay().then(setCauHoiDamMay);
      hienThongBao(`Chào mừng đạo hữu ${hsMoi.daoHieu} bước vào Sơn Môn!`);
      setManHinh('taoNhanVat');
    } catch (err) {
      setLoiAuth(doiMaLoiFirebase(err));
    } finally {
      dangTaoHoSoMoiRef.current = false;
      setDangXuLyAuth(false);
    }
  };

  const xuLyDangNhapGoogle = async (mayDungChung: boolean) => {
    setDangXuLyAuth(true);
    setLoiAuth(null);
    try {
      khoLuuTru.datMayDungChung(mayDungChung);
      await datCheDoLuuPhien(mayDungChung);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
          queryParams: { prompt: 'select_account' },
        },
      });
      if (error) throw error;
    } catch (err) {
      setLoiAuth(doiMaLoiFirebase(err));
    } finally {
      setDangXuLyAuth(false);
    }
  };

  const xuLyQuenMatKhau = async (
    email: string
  ): Promise<{ thanhCong: boolean; thongDiep: string }> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
      });
      if (error) throw error;
      return {
        thanhCong: true,
        thongDiep:
          'Nếu thư điện tử này đã liên kết với tài khoản, liên kết đặt lại mật khẩu đã được gửi vào hộp thư của bạn.',
      };
    } catch (err) {
      return { thanhCong: false, thongDiep: doiMaLoiFirebase(err) };
    }
  };

  const xuLyDangXuat = async () => {
    const uidCu = nguoiDungAuth?.id || null;
    try {
      await khoLuuTru.luuDamMayNgay(true);
    } catch {
      // Bo qua neu dang ngoai tuyen
    }
    khoLuuTru.xoaBoDemTaiKhoanCucBo(uidCu);
    khoLuuTru.datMayDungChung(false);
    await supabase.auth.signOut();
    setMoMenuTaiKhoan(false);
    setManHinh('moDau');
    hienThongBao('Đã đăng xuất an toàn và xóa bộ đệm tài khoản trên máy này.');
  };

  const xuLyCapNhatHoSo = async (
    daoHieuMoi: string,
    lopMoi: string
  ): Promise<{ ok: boolean; thongDiep: string }> => {
    if (!nguoiDungAuth || !hoSo) {
      return { ok: false, thongDiep: 'Bạn chưa đăng nhập.' };
    }
    try {
      const ttMoi: TienTrinhNguoiChoi = {
        ...tienTrinh,
        ngoaiHinh: { ...tienTrinh.ngoaiHinh, ten: daoHieuMoi },
      };
      await khoLuuTru.capNhatHoSoCaNhan(
        nguoiDungAuth.id,
        { daoHieu: daoHieuMoi, lop: lopMoi || null },
        ttMoi
      );
      const hsMoi = { ...hoSo, daoHieu: daoHieuMoi, lop: lopMoi || null };
      khoLuuTru.capNhatHoSoNoiBo(hsMoi);
      setHoSo(hsMoi);
      luuNgayLanSauRef.current = true;
      setTienTrinh(ttMoi);
      return { ok: true, thongDiep: 'Đã cập nhật Đạo hiệu và lớp thành công.' };
    } catch (err) {
      return { ok: false, thongDiep: doiMaLoiFirebase(err) };
    }
  };

  const xuLyDoiMatKhau = async (
    matKhauCu: string,
    matKhauMoi: string
  ): Promise<{ ok: boolean; thongDiep: string }> => {
    if (!nguoiDungAuth || !nguoiDungAuth.email) {
      return { ok: false, thongDiep: 'Tài khoản này đăng nhập bằng Google.' };
    }
    try {
      const { error: errXacThuc } = await supabase.auth.signInWithPassword({
        email: nguoiDungAuth.email,
        password: matKhauCu,
      });
      if (errXacThuc) throw errXacThuc;
      const { error: errDoi } = await supabase.auth.updateUser({
        password: matKhauMoi,
      });
      if (errDoi) throw errDoi;
      if (hoSo?.canDoiMatKhau) {
        await khoLuuTru.capNhatHoSoCaNhan(nguoiDungAuth.id, {
          canDoiMatKhau: false,
        });
        setHoSo((cu) => (cu ? { ...cu, canDoiMatKhau: false } : cu));
      }
      return { ok: true, thongDiep: 'Đã đổi mật khẩu thành công!' };
    } catch (err) {
      return { ok: false, thongDiep: doiMaLoiFirebase(err) };
    }
  };

  const xuLyDoiMatKhauBatBuoc = async (
    matKhauMoi: string
  ): Promise<{ ok: boolean; thongDiep: string }> => {
    if (!nguoiDungAuth) return { ok: false, thongDiep: 'Chưa đăng nhập.' };
    try {
      const { error } = await supabase.auth.updateUser({ password: matKhauMoi });
      if (error) throw error;
      await khoLuuTru.capNhatHoSoCaNhan(nguoiDungAuth.id, {
        canDoiMatKhau: false,
      });
      setHoSo((cu) => (cu ? { ...cu, canDoiMatKhau: false } : cu));
      hienThongBao('Đã đổi sang mật khẩu riêng an toàn!');
      return { ok: true, thongDiep: 'Thành công' };
    } catch (err) {
      return { ok: false, thongDiep: doiMaLoiFirebase(err) };
    }
  };

  const xuLyChuyenHienXepHang = async (hien: boolean) => {
    if (!nguoiDungAuth || !hoSo) return;
    try {
      await khoLuuTru.capNhatHoSoCaNhan(
        nguoiDungAuth.id,
        { hienTrenXepHang: hien },
        tienTrinh
      );
      const hsMoi = { ...hoSo, hienTrenXepHang: hien };
      khoLuuTru.capNhatHoSoNoiBo(hsMoi);
      setHoSo(hsMoi);
      hienThongBao(
        hien
          ? 'Đã bật hiển thị Đạo hiệu của bạn trên Thiên Bảng.'
          : 'Đã ẩn tên của bạn khỏi Thiên Bảng.'
      );
    } catch (err) {
      hienThongBao(doiMaLoiFirebase(err));
    }
  };

  const xuLyXoaTaiKhoan = async (
    _xacNhan: string,
    matKhau?: string
  ): Promise<{ ok: boolean; thongDiep: string }> => {
    if (!nguoiDungAuth || !hoSo) {
      return { ok: false, thongDiep: 'Chưa đăng nhập.' };
    }
    try {
      if (hoSo.phuongThuc === 'tenDangNhap' && nguoiDungAuth.email) {
        if (!matKhau) {
          return {
            ok: false,
            thongDiep: 'Vui lòng nhập mật khẩu hiện tại để xác thực trước khi xóa.',
          };
        }
        const { error: errXacThuc } = await supabase.auth.signInWithPassword({
          email: nguoiDungAuth.email,
          password: matKhau,
        });
        if (errXacThuc) throw errXacThuc;
      }
      await khoLuuTru.xoaDuLieuTaiKhoanCuaMinh(nguoiDungAuth.id);
      await supabase.auth.signOut();
      setMoMenuTaiKhoan(false);
      setManHinh('moDau');
      hienThongBao('Đã xóa toàn bộ dữ liệu học tập và đăng xuất tài khoản của bạn.');
      return { ok: true, thongDiep: 'Đã xóa dữ liệu tài khoản.' };
    } catch (err) {
      return { ok: false, thongDiep: doiMaLoiFirebase(err) };
    }
  };

  // === LOGIC GAME GOC (GIU NGUYEN + DONG BO DAM MAY) ===
  const thongTinCanhHienTai = layThongTinCanhGioi(tienTrinh.canhGioiHienTai);
  const ruongSanSang = moRuongCoDuyenSanSang(tienTrinh, bayGio);
  const msConLai = Math.max(
    0,
    CHU_KY_RUONG_CO_DUYEN_MS -
      (bayGio - (tienTrinh.thoiGianMoRuongCoDuyenCuoi || 0))
  );

  const thongBaoQuanTriHienThi =
    cauHinhCongKhai.thongBao &&
    (cauHinhCongKhai.thongBaoLuc || 1) > daAnThongBaoLuc
      ? cauHinhCongKhai.thongBao
      : null;

  const apDungThanhTich = (ttMoi: TienTrinhNguoiChoi): TienTrinhNguoiChoi => {
    const kq = kiemTraThanhTichMoi(ttMoi);
    if (kq.maMoi.length === 0) return ttMoi;
    const tuiMoi = { ...ttMoi.tuiDo };
    for (const vpId of kq.vatPhamMoi) {
      tuiMoi[vpId] = (tuiMoi[vpId] || 0) + 1;
    }
    const tenTt =
      DANH_SACH_THANH_TICH.find((t) => t.id === kq.maMoi[0])?.ten || '';
    hienThongBao(
      `Đạt thành tựu "${tenTt}" (+${kq.tongLinhThachThuong} Linh thạch)!`
    );
    return {
      ...ttMoi,
      linhThach: ttMoi.linhThach + kq.tongLinhThachThuong,
      tuiDo: tuiMoi,
      thanhTichDaDat: [...ttMoi.thanhTichDaDat, ...kq.maMoi],
    };
  };

  const ghiNhanKetQuaCau = (
    cauId: string,
    dung: boolean,
    canhGioi: MaCanhGioi
  ) => {
    const now = Date.now();
    const giay = Math.max(
      1,
      Math.round((now - thoiDiemCauTruocRef.current) / 1000)
    );
    thoiDiemCauTruocRef.current = now;
    if (chiTietLuotRef.current.length < 25) {
      chiTietLuotRef.current.push({ ma: cauId, dung, giay });
    }

    setTienTrinh((cu) => {
      const { dongPhuMoi, daXoaTamMa } = capNhatSoTamMa(
        cu.dongPhu,
        cauId,
        dung,
        canhGioi
      );
      if (daXoaTamMa) {
        hienThongBao('Hóa giải một chấp niệm trong Sổ Tâm Ma (+10 Linh thạch)!');
      }
      const sauLichSu = ghiNhanLichSuCauHoi(cu, cauId, dung);
      return {
        ...sauLichSu,
        linhThach: sauLichSu.linhThach + (daXoaTamMa ? 10 : 0),
        dongPhu: dongPhuMoi,
      };
    });
  };

  const baoCauSai = (cau: CauHoi) => {
    setTienTrinh((cu) => ({
      ...cu,
      cauHoiGhiDe: {
        ...cu.cauHoiGhiDe,
        [cau.id]: { ...cau, canDuyet: true },
      },
    }));
    hienThongBao('Đã đánh dấu câu hỏi này cần Thầy/Cô duyệt lại.');
  };

  const docKinhLanDau = (maKinh: string) => {
    setTienTrinh((cu) => {
      if (cu.tangKinhCac.daDoc.includes(maKinh)) return cu;
      hienThongBao('Lĩnh hội kinh văn lần đầu: +5 Linh khí!');
      return {
        ...cu,
        linhKhi: cu.linhKhi + 5,
        tangKinhCac: {
          ...cu.tangKinhCac,
          daDoc: [...cu.tangKinhCac.daDoc, maKinh],
        },
      };
    });
  };

  const chuyenDaThuocKinh = (maKinh: string) => {
    setTienTrinh((cu) => {
      const daCo = cu.tangKinhCac.daThuoc.includes(maKinh);
      return {
        ...cu,
        tangKinhCac: {
          ...cu.tangKinhCac,
          daThuoc: daCo
            ? cu.tangKinhCac.daThuoc.filter((id) => id !== maKinh)
            : [...cu.tangKinhCac.daThuoc, maKinh],
        },
      };
    });
  };

  const chuyenSoTayKinh = (maKinh: string) => {
    setTienTrinh((cu) => {
      const daCo = cu.tangKinhCac.soTay.includes(maKinh);
      return {
        ...cu,
        tangKinhCac: {
          ...cu.tangKinhCac,
          soTay: daCo
            ? cu.tangKinhCac.soTay.filter((id) => id !== maKinh)
            : [...cu.tangKinhCac.soTay, maKinh],
        },
      };
    });
  };

  const moRuongCoDuyen = () => {
    if (!moRuongCoDuyenSanSang(tienTrinh, Date.now())) {
      hienThongBao(
        `Rương Cơ Duyên đang tụ khí, còn ${dinhDangDemNguoc(msConLai)}.`
      );
      return;
    }
    boPhatAmThanh.phatAmNgoDao();
    const qua = moRuongCoDuyenNgauNhien();
    const vp = timVatPham(qua.vatPhamId);
    luuNgayLanSauRef.current = true;
    setTienTrinh((cu) => ({
      ...cu,
      linhThach: cu.linhThach + qua.linhThach,
      thoiGianMoRuongCoDuyenCuoi: Date.now(),
      tuiDo: {
        ...cu.tuiDo,
        [qua.vatPhamId]: (cu.tuiDo[qua.vatPhamId] || 0) + qua.soLuong,
      },
    }));
    setBayGio(Date.now());
    hienThongBao(
      `Mở Rương Cơ Duyên: +${qua.linhThach} Linh thạch và ${qua.soLuong} ${
        vp?.ten || 'bảo vật'
      }!`
    );
  };

  const moRuongMocSao = (moc: number) => {
    if (tienTrinh.ruongMocDaMo.includes(moc)) return;
    const qua = moRuongCoDuyenNgauNhien();
    const linhThachThem = qua.linhThach + moc * 2;
    const vp = timVatPham(qua.vatPhamId);
    luuNgayLanSauRef.current = true;
    setTienTrinh((cu) => ({
      ...cu,
      linhThach: cu.linhThach + linhThachThem,
      ruongMocDaMo: [...cu.ruongMocDaMo, moc],
      tuiDo: {
        ...cu.tuiDo,
        [qua.vatPhamId]: (cu.tuiDo[qua.vatPhamId] || 0) + 1,
      },
    }));
    hienThongBao(
      `Rương Tinh Tú (${moc} sao): +${linhThachThem} Linh thạch và 1 ${
        vp?.ten || 'bảo vật'
      }!`
    );
  };

  const xuLyHoanThanhMan = (
    kq: KetQuaManChoi,
    loaiTran: 'thuong' | 'dauPhap' | 'vuotAi'
  ) => {
    const thoiLuongGiay = Math.max(
      1,
      Math.round((Date.now() - thoiDiemBatDauLuotRef.current) / 1000)
    );
    void khoLuuTru.ghiKetQuaLuot({
      canhGioi: kq.canhGioi,
      giaiDoan: kq.giaiDoan,
      cheDo: loaiTran === 'dauPhap' ? 'dauPhap' : 'vuotAi',
      soCau: kq.tongCau,
      soCauDung: kq.soCauDung,
      sao: kq.soSao,
      thoiLuongGiay,
      chiTiet: [...chiTietLuotRef.current],
    });

    luuNgayLanSauRef.current = true;
    setTienTrinh((cu) => {
      const khoa = khoaGiaiDoan(kq.canhGioi, kq.giaiDoan);
      const tdCu = cu.tienDoGiaiDoan[khoa];
      const daHoanThanhMoi = Boolean(tdCu?.daHoanThanh) || kq.thang;
      const soSaoMoi = Math.max(tdCu?.soSao || 0, kq.soSao);
      const diemCaoNhat = Math.max(tdCu?.diemCaoNhat || 0, kq.soCauDung);

      const moKhoaMoi = [...cu.daMoKhoaNgoaiHinh];
      if (kq.daDietTamMa && !moKhoaMoi.includes('tramTamMa')) {
        moKhoaMoi.push('tramTamMa');
      }

      const lichSuMoi = [
        {
          thoiGian: Date.now(),
          canhGioi: kq.canhGioi,
          giaiDoan: kq.giaiDoan,
          soCauDung: kq.soCauDung,
          tongCau: kq.tongCau,
          loaiTran,
        },
        ...cu.lichSu,
      ].slice(0, 30);

      const tuiMoi = { ...cu.tuiDo };
      if (kq.thangDauPhap) {
        tuiMoi.phuThoiDien = (tuiMoi.phuThoiDien || 0) + 1;
      }

      const daAn = Array.from(
        new Set([...cu.cauHoiDaAn, ...kq.cauDaLamIds])
      ).slice(-40);

      const capNhat: TienTrinhNguoiChoi = {
        ...cu,
        linhKhi: cu.linhKhi + kq.linhKhiNhan,
        linhThach: cu.linhThach + kq.linhThachNhan,
        tongCauDung: cu.tongCauDung + kq.soCauDung,
        tongCauDaLam: cu.tongCauDaLam + kq.tongCau,
        chuoiNgoDaoCaoNhat: Math.max(
          cu.chuoiNgoDaoCaoNhat,
          kq.chuoiNgoDaoMax
        ),
        tienDoGiaiDoan: {
          ...cu.tienDoGiaiDoan,
          [khoa]: {
            daHoanThanh: daHoanThanhMoi,
            soSao: soSaoMoi,
            diemCaoNhat,
          },
        },
        daMoKhoaNgoaiHinh: moKhoaMoi,
        tuiDo: tuiMoi,
        cauHoiDaAn: daAn,
        lichSu: lichSuMoi,
      };
      return apDungThanhTich(capNhat);
    });
    setManHinh('banDoGiaiDoan');
  };

  const xuLyHoanThanhYeuVuong = (kq: KetQuaYeuVuong) => {
    const thoiLuongGiay = Math.max(
      1,
      Math.round((Date.now() - thoiDiemBatDauLuotRef.current) / 1000)
    );
    void khoLuuTru.ghiKetQuaLuot({
      canhGioi: kq.canhGioiVuot,
      giaiDoan: 'dinhPhong',
      cheDo: 'yeuVuong',
      soCau: kq.tongCau,
      soCauDung: kq.soCauDung,
      sao: kq.thanhCong ? 3 : 0,
      thoiLuongGiay,
      chiTiet: [...chiTietLuotRef.current],
    });

    luuNgayLanSauRef.current = true;
    setTienTrinh((cu) => {
      const daDotPha = kq.thanhCong
        ? Array.from(new Set([...cu.daDotPhaQua, kq.canhGioiVuot]))
        : cu.daDotPhaQua;
      const khoaDinhPhong = khoaGiaiDoan(kq.canhGioiVuot, 'dinhPhong');
      const tdCu = cu.tienDoGiaiDoan[khoaDinhPhong];

      const lichSuMoi = [
        {
          thoiGian: Date.now(),
          canhGioi: kq.canhGioiVuot,
          giaiDoan: 'dinhPhong' as const,
          soCauDung: kq.soCauDung,
          tongCau: kq.tongCau,
          loaiTran: 'yeuVuong' as const,
        },
        ...cu.lichSu,
      ].slice(0, 30);

      const tuiMoi = { ...cu.tuiDo };
      if (kq.thanhCong) {
        tuiMoi.tuLinhDan = (tuiMoi.tuLinhDan || 0) + 1;
      }

      const capNhat: TienTrinhNguoiChoi = {
        ...cu,
        canhGioiHienTai: kq.thanhCong ? kq.canhGioiMoi : cu.canhGioiHienTai,
        daoCuoiDaXem: kq.thanhCong ? kq.canhGioiMoi : cu.daoCuoiDaXem,
        daoVuaDotPha: kq.thanhCong ? kq.canhGioiVuot : cu.daoVuaDotPha,
        daDotPhaQua: daDotPha,
        tienDoGiaiDoan: kq.thanhCong
          ? {
              ...cu.tienDoGiaiDoan,
              [khoaDinhPhong]: {
                daHoanThanh: true,
                soSao: Math.max(tdCu?.soSao || 0, 3),
                diemCaoNhat: Math.max(tdCu?.diemCaoNhat || 0, kq.soCauDung),
              },
            }
          : cu.tienDoGiaiDoan,
        linhThach: cu.linhThach + (kq.thanhCong ? 80 : 15),
        tongCauDung: cu.tongCauDung + kq.soCauDung,
        tongCauDaLam: cu.tongCauDaLam + kq.tongCau,
        soLanDoKiepThanhCong:
          cu.soLanDoKiepThanhCong + (kq.thanhCong ? 1 : 0),
        danhHieuCuoi: kq.danhHieuCuoi ?? cu.danhHieuCuoi,
        tuiDo: tuiMoi,
        lichSu: lichSuMoi,
      };
      return apDungThanhTich(capNhat);
    });

    if (kq.thanhCong) {
      setCanhGioiDangXem(kq.canhGioiMoi);
      hienThongBao(
        kq.canhGioiVuot === 'doKiep'
          ? 'Chúc mừng đạo hữu đã hàng phục Thiên Lôi Chân Long!'
          : `Đột phá thành công lên cảnh giới ${
              layThongTinCanhGioi(kq.canhGioiMoi).ten
            }!`
      );
      setManHinh('banDoTheGioi');
    } else {
      setManHinh('banDoGiaiDoan');
    }
  };

  const tieuHaoVatPham = (id: string) => {
    setTienTrinh((cu) => ({
      ...cu,
      tuiDo: {
        ...cu.tuiDo,
        [id]: Math.max(0, (cu.tuiDo[id] || 0) - 1),
      },
    }));
  };

  const trangBiHoacGoPhapBao = (id: string) => {
    luuNgayLanSauRef.current = true;
    setTienTrinh((cu) => {
      const dangCo = cu.phapBaoDangTrangBi.includes(id);
      if (dangCo) {
        return {
          ...cu,
          phapBaoDangTrangBi: cu.phapBaoDangTrangBi.filter((p) => p !== id),
        };
      }
      if (cu.phapBaoDangTrangBi.length >= 3) {
        hienThongBao('Đã đủ 3 Pháp bảo trang bị. Hãy gỡ bớt 1 món trước.');
        return cu;
      }
      return {
        ...cu,
        phapBaoDangTrangBi: [...cu.phapBaoDangTrangBi, id],
      };
    });
  };

  const dungDanDuocTrongTui = (id: string) => {
    if ((tienTrinh.tuiDo[id] || 0) <= 0) return;
    const tangKhi = id === 'hoiKhiDan' ? 35 : id === 'tuLinhDan' ? 80 : 0;
    if (tangKhi <= 0) return;
    luuNgayLanSauRef.current = true;
    setTienTrinh((cu) => ({
      ...cu,
      linhKhi: cu.linhKhi + tangKhi,
      tuiDo: {
        ...cu.tuiDo,
        [id]: Math.max(0, (cu.tuiDo[id] || 0) - 1),
      },
    }));
    hienThongBao(`Luyện hóa đan dược thành công (+${tangKhi} Linh khí)!`);
  };

  const muaVatPham = (id: string) => {
    const vp = timVatPham(id);
    if (!vp) return;
    if (tienTrinh.linhThach < vp.giaLinhThach) {
      hienThongBao('Linh thạch chưa đủ để thỉnh bảo vật này.');
      return;
    }
    luuNgayLanSauRef.current = true;
    setTienTrinh((cu) => ({
      ...cu,
      linhThach: cu.linhThach - vp.giaLinhThach,
      tuiDo: {
        ...cu.tuiDo,
        [id]: (cu.tuiDo[id] || 0) + 1,
      },
    }));
    hienThongBao(`Đã thỉnh ${vp.ten} vào Túi đồ!`);
  };

  const batDauBeQuan = (thoiLuongPhut: 15 | 60 | 240) => {
    const now = Date.now();
    if (soLuotBeQuanConLaiHomNay(tienTrinh.dongPhu, now) <= 0) {
      hienThongBao('Đã dùng hết 3 lượt Bế Quan hôm nay.');
      return;
    }
    const homNay = layNgayHomNay(now);
    luuNgayLanSauRef.current = true;
    setTienTrinh((cu) => ({
      ...cu,
      dongPhu: {
        ...cu.dongPhu,
        ngayBeQuanCuoi: homNay,
        soLanBeQuanHomNay:
          cu.dongPhu.ngayBeQuanCuoi === homNay
            ? cu.dongPhu.soLanBeQuanHomNay + 1
            : 1,
        beQuan: {
          dangBeQuan: true,
          thoiDiemBatDau: now,
          thoiLuongPhut,
        },
      },
    }));
    hienThongBao(`Đã bắt đầu Bế Quan ${thoiLuongPhut} phút!`);
  };

  const hoanTatBeQuan = (linhKhiNhan: number) => {
    luuNgayLanSauRef.current = true;
    setTienTrinh((cu) => ({
      ...cu,
      linhKhi: cu.linhKhi + linhKhiNhan,
      dongPhu: {
        ...cu.dongPhu,
        beQuan: null,
      },
    }));
    hienThongBao(`Thức tỉnh Ngộ Đạo thành công (+${linhKhiNhan} Linh khí)!`);
  };

  const huyBeQuan = () => {
    setTienTrinh((cu) => ({
      ...cu,
      dongPhu: {
        ...cu.dongPhu,
        beQuan: null,
      },
    }));
    hienThongBao('Đã xuất quan sớm.');
  };

  const nangCapLinhMach = () => {
    luuNgayLanSauRef.current = true;
    setTienTrinh((cu) => {
      const cap = cu.dongPhu.capLinhMach;
      if (cap >= CAP_NANG_CAP_TOI_DA) return cu;
      const phi = chiPhiNangCapLinhMach(cap);
      if (cu.linhThach < phi) return cu;
      hienThongBao(`Nâng cấp Linh Mạch lên cấp ${cap + 1}!`);
      return {
        ...cu,
        linhThach: cu.linhThach - phi,
        dongPhu: {
          ...cu.dongPhu,
          capLinhMach: cap + 1,
        },
      };
    });
  };

  const nangCapLinhTuyen = () => {
    luuNgayLanSauRef.current = true;
    setTienTrinh((cu) => {
      const cap = cu.dongPhu.capLinhTuyen;
      if (cap >= CAP_NANG_CAP_TOI_DA) return cu;
      const phi = chiPhiNangCapLinhTuyen(cap);
      if (cu.linhThach < phi) return cu;
      hienThongBao(`Nâng cấp Linh Tuyền lên cấp ${cap + 1}!`);
      return {
        ...cu,
        linhThach: cu.linhThach - phi,
        dongPhu: {
          ...cu.dongPhu,
          capLinhTuyen: cap + 1,
        },
      };
    });
  };

  // Neu tai khoan bi khoa -> chan toan man hinh
  if (khoaTaiKhoan) {
    return (
      <div className="min-h-[100dvh] relative text-[#DCE6EA]">
        <NenThuyMac canhGioi="luyenKhi" />
        <ManTaiKhoanBiKhoa
          thongTin={khoaTaiKhoan}
          khiDangXuat={() => void xuLyDangXuat()}
        />
      </div>
    );
  }

  const hienKhungDieuHuong =
    manHinh === 'banDoTheGioi' ||
    manHinh === 'banDoGiaiDoan' ||
    manHinh === 'dongPhu' ||
    manHinh === 'tangKinhCac' ||
    manHinh === 'tuiDo' ||
    manHinh === 'cuaHang' ||
    manHinh === 'hoSo' ||
    manHinh === 'caiDat' ||
    manHinh === 'bangQuanTri';

  const mucDieuHuong: {
    id: ManHinh;
    nhan: string;
    bieuTuong: React.ReactNode;
  }[] = [
    {
      id: 'banDoTheGioi',
      nhan: 'Vân Hải',
      bieuTuong: <BieuTuongBanDo className="w-5 h-5" />,
    },
    {
      id: 'dongPhu',
      nhan: 'Động Phủ',
      bieuTuong: <BieuTuongDongPhu className="w-5 h-5" />,
    },
    {
      id: 'tangKinhCac',
      nhan: 'Tàng Kinh',
      bieuTuong: <BieuTuongTangKinhCac className="w-5 h-5" />,
    },
    {
      id: 'tuiDo',
      nhan: 'Túi đồ',
      bieuTuong: <BieuTuongTuiDo className="w-5 h-5" />,
    },
    {
      id: 'hoSo',
      nhan: 'Hồ sơ',
      bieuTuong: <BieuTuongHoSo className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-[100dvh] relative text-[#DCE6EA]">
      <NenThuyMac
        canhGioi={
          manHinh === 'banDoGiaiDoan' ||
          manHinh === 'manChoi' ||
          manHinh === 'vuotAi' ||
          manHinh === 'yeuVuong'
            ? canhGioiDangXem
            : tienTrinh.canhGioiHienTai
        }
        baoSam={manHinh === 'yeuVuong'}
      />

      <ThanhTruyenAm thongBao={thongBao} />

      {/* Thanh trang thai / tai nguyen tren cung */}
      {hienKhungDieuHuong && (
        <header className="sticky top-0 z-30 border-b border-[#E4BC5A]/20 bg-[#070B14]/96 no-print">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
            {/* Nut chan dung / Dao hieu -> mo Menu Tai Khoan */}
            <button
              type="button"
              onClick={() => {
                boPhatAmThanh.phatAmNhanNut();
                setMoMenuTaiKhoan(true);
              }}
              className="flex items-center gap-2 min-w-0 rounded-xl pr-2 py-1 hover:bg-[#141D33]/80 transition-colors cursor-pointer text-left"
              title="Mở hồ sơ tài khoản & đồng bộ"
            >
              {(() => {
                const hqHeader = layThongTinHaoQuang(
                  tienTrinh.canhGioiHienTai,
                  tienTrinh.danhHieuCuoi ? 'tienQuang' : 'macDinh'
                );
                return (
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-[#0D1424] border-2 shrink-0 overflow-hidden"
                    style={{
                      borderColor: hqHeader.mauChinh,
                      boxShadow: `0 0 12px ${hqHeader.mauChinh}88`,
                    }}
                  >
                    <NhanVat
                      ngoaiHinh={tienTrinh.ngoaiHinh}
                      kichCo="nho"
                      canhGioi={tienTrinh.canhGioiHienTai}
                      anHaoQuang
                      className="w-8 h-9"
                    />
                  </div>
                );
              })()}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-bold text-sm sm:text-base text-[#F6EEDB] truncate">
                    {hoSo?.daoHieu || tienTrinh.ngoaiHinh.ten}
                  </span>
                  {laQuanTri && (
                    <span className="hidden md:inline px-1.5 py-0.5 rounded bg-[#8F1F1A] border border-[#E4BC5A]/60 text-[10px] font-bold text-[#F2D88B] shrink-0">
                      Quản trị viên
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#62D1B5] hidden sm:flex items-center gap-1.5">
                  <span>{thongTinCanhHienTai.ten}</span>
                  <span className="text-[#9BA8BE]">
                    ·{' '}
                    {laKhach
                      ? 'Chơi thử'
                      : trangThaiDongBo.loai === 'dangLuu'
                      ? 'Đang lưu…'
                      : trangThaiDongBo.loai === 'ngoaiTuyen'
                      ? 'Ngoại tuyến'
                      : 'Đám mây'}
                  </span>
                </div>
              </div>
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2.5">
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0D1424] border border-[#3FB59A]/35"
                title={`Linh khí: ${tienTrinh.linhKhi}/${thongTinCanhHienTai.linhKhiCan}`}
              >
                <BieuTuongLinhKhi className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold text-[#62D1B5] chu-so-bang">
                  {tienTrinh.linhKhi}
                  <span className="hidden sm:inline text-[#9BA8BE] font-normal">
                    /{thongTinCanhHienTai.linhKhiCan}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0D1424] border border-[#E4BC5A]/35">
                <BieuTuongLinhThach className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold text-[#F2D88B] chu-so-bang">
                  {tienTrinh.linhThach}
                </span>
              </div>

              <button
                type="button"
                onClick={moRuongCoDuyen}
                className={`min-h-[36px] px-2 rounded-lg border flex items-center gap-1 text-xs font-semibold cursor-pointer ${
                  ruongSanSang
                    ? 'bg-[#1E7F6B]/30 border-[#E4BC5A] text-[#F2D88B]'
                    : 'bg-[#0D1424] border-[#1F2A4D] text-[#9BA8BE]'
                }`}
                title="Rương Cơ Duyên"
              >
                <BieuTuongRuong className="w-4 h-4" />
                <span className="hidden md:inline chu-so-bang">
                  {ruongSanSang ? 'Nhận rương' : dinhDangDemNguoc(msConLai)}
                </span>
              </button>

              <button
                type="button"
                aria-label={
                  tienTrinh.caiDat.batAmThanh ? 'Tắt âm thanh' : 'Bật âm thanh'
                }
                onClick={() =>
                  setTienTrinh((cu) => ({
                    ...cu,
                    caiDat: {
                      ...cu.caiDat,
                      batAmThanh: !cu.caiDat.batAmThanh,
                    },
                  }))
                }
                className="min-w-[36px] min-h-[36px] rounded-lg border border-[#1F2A4D] bg-[#0D1424] flex items-center justify-center text-[#DCE6EA] hover:border-[#E4BC5A]/45 cursor-pointer"
              >
                <BieuTuongAmThanh
                  bat={tienTrinh.caiDat.batAmThanh}
                  className="w-4 h-4"
                />
              </button>

              <button
                type="button"
                aria-label="Cài đặt và Màn Thầy Cô"
                title="Cài đặt & Màn Thầy/Cô"
                onClick={() => {
                  boPhatAmThanh.phatAmNhanNut();
                  setManHinh('caiDat');
                }}
                className={`min-w-[36px] min-h-[36px] rounded-lg border flex items-center justify-center cursor-pointer ${
                  manHinh === 'caiDat'
                    ? 'bg-[#141D33] border-[#E4BC5A] text-[#F2D88B]'
                    : 'border-[#1F2A4D] bg-[#0D1424] text-[#DCE6EA] hover:border-[#E4BC5A]/45'
                }`}
              >
                <BieuTuongCaiDat className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Bo cuc chinh */}
      <div
        className={`relative z-10 ${
          hienKhungDieuHuong ? 'md:flex max-w-6xl mx-auto' : ''
        }`}
      >
        {hienKhungDieuHuong && (
          <nav
            aria-label="Điều hướng chính"
            className="hidden md:flex md:flex-col md:w-52 md:shrink-0 md:sticky md:top-14 md:self-start md:py-6 md:px-3 md:gap-2 no-print"
          >
            {mucDieuHuong.map((m) => {
              const dangChon =
                manHinh === m.id ||
                (m.id === 'banDoTheGioi' && manHinh === 'banDoGiaiDoan') ||
                (m.id === 'tuiDo' && manHinh === 'cuaHang');
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    boPhatAmThanh.phatAmNhanNut();
                    setManHinh(m.id);
                  }}
                  className={`min-h-[46px] px-3.5 rounded-xl border text-sm font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                    dangChon
                      ? 'bg-[#141D33] border-[#E4BC5A] text-[#F2D88B] shadow-md'
                      : 'bg-[#0D1424]/70 border-[#1F2A4D] text-[#DCE6EA] hover:border-[#E4BC5A]/45'
                  }`}
                >
                  {m.bieuTuong}
                  <span>{m.nhan}</span>
                </button>
              );
            })}

            {laQuanTri && (
              <button
                type="button"
                onClick={() => {
                  boPhatAmThanh.phatAmNhanNut();
                  setManHinh('bangQuanTri');
                }}
                className={`min-h-[46px] px-3.5 rounded-xl border text-sm font-semibold flex items-center gap-3 transition-all cursor-pointer mt-2 ${
                  manHinh === 'bangQuanTri'
                    ? 'bg-[#8F1F1A]/85 border-[#F2D88B] text-[#F2D88B] shadow-md'
                    : 'bg-[#141D33]/85 border-[#E4BC5A]/45 text-[#F2D88B] hover:border-[#E4BC5A]'
                }`}
              >
                <BieuTuongCaiDat className="w-5 h-5" />
                <span>Bảng Quản Trị</span>
              </button>
            )}
          </nav>
        )}

        <div className="flex-1 min-w-0">
          <Suspense
            fallback={
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="px-5 py-3 rounded-xl border border-[#E4BC5A]/30 bg-[#0E1629]/85 text-sm text-[#F2D88B] animate-pulse">
                  Đang ngưng tụ linh khí...
                </div>
              </div>
            }
          >
          {manHinh === 'moDau' && (
            <ManSonMon
              choPhepDangKy={cauHinhCongKhai.choPhepDangKy}
              dangXuLy={dangXuLyAuth}
              loiHeThong={loiAuth}
              khiDangNhap={xuLyDangNhap}
              khiDangKy={xuLyDangKy}
              khiDangNhapGoogle={xuLyDangNhapGoogle}
              khiQuenMatKhau={xuLyQuenMatKhau}
              khiChoiThuKhach={() => {
                if (!tienTrinh.daTaoNhanVat) {
                  setManHinh('taoNhanVat');
                } else if (!tienTrinh.daXemCotTruyen) {
                  setManHinh('cotTruyen');
                } else {
                  setManHinh('banDoTheGioi');
                }
              }}
            />
          )}

          {manHinh === 'cotTruyen' && (
            <ManCotTruyen
              ngoaiHinh={tienTrinh.ngoaiHinh}
              khiHoanThanh={() => {
                luuNgayLanSauRef.current = true;
                setTienTrinh((cu) => ({ ...cu, daXemCotTruyen: true }));
                setManHinh('banDoTheGioi');
              }}
            />
          )}

          {manHinh === 'taoNhanVat' && (
            <ManTaoNhanVat
              ngoaiHinhBanDau={ngoaiHinhTamPhongThayDo || tienTrinh.ngoaiHinh}
              tienTrinh={tienTrinh}
              khiMoPhongThayDo={(nhHienTai) => {
                setNgoaiHinhTamPhongThayDo(nhHienTai);
                setNoiQuayLaiPhongThayDo('taoNhanVat');
                setManHinh('phongThayDo');
              }}
              khiXacNhan={(nhMoi: NgoaiHinh) => {
                setNgoaiHinhTamPhongThayDo(null);
                luuNgayLanSauRef.current = true;
                setTienTrinh((cu) => ({
                  ...cu,
                  daTaoNhanVat: true,
                  ngoaiHinh: nhMoi,
                }));
                setManHinh(
                  tienTrinh.daXemCotTruyen ? 'banDoTheGioi' : 'cotTruyen'
                );
              }}
              khiHuy={
                tienTrinh.daTaoNhanVat
                  ? () => setManHinh('banDoTheGioi')
                  : undefined
              }
            />
          )}

          {manHinh === 'phongThayDo' && (
            <ManPhongThayDo
              ngoaiHinhBanDau={ngoaiHinhTamPhongThayDo || tienTrinh.ngoaiHinh}
              tienTrinh={tienTrinh}
              khiMacTrangPhuc={(nhMoi) => {
                if (noiQuayLaiPhongThayDo === 'taoNhanVat') {
                  setNgoaiHinhTamPhongThayDo(nhMoi);
                  setManHinh('taoNhanVat');
                } else {
                  luuNgayLanSauRef.current = true;
                  setTienTrinh((cu) => ({ ...cu, ngoaiHinh: nhMoi }));
                  setNgoaiHinhTamPhongThayDo(null);
                  setManHinh('hoSo');
                }
                hienThongBao('Đã lưu trang phục mới!');
              }}
              khiQuayLai={() => {
                setManHinh(noiQuayLaiPhongThayDo);
              }}
            />
          )}

          {manHinh === 'banDoTheGioi' && (
            <VanHaiDo
              tienTrinh={tienTrinh}
              khiChonCanhGioi={(id) => {
                setTienTrinh((cu) => ({ ...cu, daoCuoiDaXem: id }));
                setCanhGioiDangXem(id);
                setManHinh('banDoGiaiDoan');
              }}
              khiMoRuongMoc={moRuongMocSao}
              khiCapNhatDaoCuoiDaXem={(dao) =>
                setTienTrinh((cu) =>
                  cu.daoCuoiDaXem === dao ? cu : { ...cu, daoCuoiDaXem: dao }
                )
              }
              khiHoanTatHieuUngDotPha={() =>
                setTienTrinh((cu) =>
                  cu.daoVuaDotPha ? { ...cu, daoVuaDotPha: null } : cu
                )
              }
              laKhach={laKhach}
              khiMoDangKy={() => setManHinh('moDau')}
              thongBaoQuanTri={thongBaoQuanTriHienThi}
              khiAnThongBaoQuanTri={() => {
                const moc = cauHinhCongKhai.thongBaoLuc || Date.now();
                khoLuuTru.datMocDaAnThongBao(moc);
                setDaAnThongBaoLuc(moc);
              }}
            />
          )}

          {manHinh === 'banDoGiaiDoan' && (
            <BanDoGiaiDoan
              canhGioiId={canhGioiDangXem}
              tienTrinh={tienTrinh}
              khiQuayLai={() => setManHinh('banDoTheGioi')}
              khiChonGiaiDoan={(gd) => {
                setGiaiDoanDangChoi(gd);
                setManHinh(
                  tienTrinh.caiDat.cheDoTraLoiNhanh ? 'manChoi' : 'vuotAi'
                );
              }}
              khiBatDauYeuVuong={() => setManHinh('yeuVuong')}
            />
          )}

          {manHinh === 'vuotAi' && (
            <ManVuotAi
              canhGioi={canhGioiDangXem}
              giaiDoan={giaiDoanDangChoi}
              nganHangCauHoi={nganHangCauHoi}
              tienTrinh={tienTrinh}
              khiHoanThanh={(kq) => xuLyHoanThanhMan(kq, 'vuotAi')}
              khiThoat={() => setManHinh('banDoGiaiDoan')}
              khiTieuHaoVatPham={tieuHaoVatPham}
              khiTraLoiSai={(id, cg) => ghiNhanKetQuaCau(id, false, cg)}
              khiTraLoiDung={(id, cg) => ghiNhanKetQuaCau(id, true, cg)}
              khiBaoCauSai={baoCauSai}
              khiDocKinhLanDau={docKinhLanDau}
              khiChuyenDaThuocKinh={chuyenDaThuocKinh}
              khiChuyenSoTayKinh={chuyenSoTayKinh}
            />
          )}

          {manHinh === 'manChoi' && (
            <ManChoi
              canhGioi={canhGioiDangXem}
              giaiDoan={giaiDoanDangChoi}
              nganHangCauHoi={nganHangCauHoi}
              tienTrinh={tienTrinh}
              khiHoanThanh={(kq) =>
                xuLyHoanThanhMan(kq, kq.laDauPhap ? 'dauPhap' : 'thuong')
              }
              khiThoat={() => setManHinh('banDoGiaiDoan')}
              khiTieuHaoVatPham={tieuHaoVatPham}
              khiTraLoiSai={(id, cg) => ghiNhanKetQuaCau(id, false, cg)}
              khiTraLoiDung={(id, cg) => ghiNhanKetQuaCau(id, true, cg)}
              khiBaoCauSai={baoCauSai}
              khiDocKinhLanDau={docKinhLanDau}
              khiChuyenDaThuocKinh={chuyenDaThuocKinh}
              khiChuyenSoTayKinh={chuyenSoTayKinh}
            />
          )}

          {manHinh === 'yeuVuong' && (
            <ManYeuVuong
              canhGioi={canhGioiDangXem}
              nganHangCauHoi={nganHangCauHoi}
              tienTrinh={tienTrinh}
              khiHoanThanh={xuLyHoanThanhYeuVuong}
              khiThoat={() => setManHinh('banDoGiaiDoan')}
              khiTieuHaoVatPham={tieuHaoVatPham}
              khiTraLoiSai={(id, cg) => ghiNhanKetQuaCau(id, false, cg)}
              khiTraLoiDung={(id, cg) => ghiNhanKetQuaCau(id, true, cg)}
              khiBaoCauSai={baoCauSai}
              khiDocKinhLanDau={docKinhLanDau}
              khiChuyenDaThuocKinh={chuyenDaThuocKinh}
              khiChuyenSoTayKinh={chuyenSoTayKinh}
            />
          )}

          {manHinh === 'dongPhu' && (
            <ManDongPhu
              tienTrinh={tienTrinh}
              nganHangCauHoi={nganHangCauHoi}
              khiBatDauBeQuan={batDauBeQuan}
              khiHoanTatBeQuan={hoanTatBeQuan}
              khiHuyBeQuan={huyBeQuan}
              khiNangCapLinhMach={nangCapLinhMach}
              khiNangCapLinhTuyen={nangCapLinhTuyen}
              khiGhiNhanKetQuaCau={ghiNhanKetQuaCau}
              khiBaoCauSai={baoCauSai}
            />
          )}

          {manHinh === 'tangKinhCac' && (
            <ManTangKinhCac
              tienTrinh={tienTrinh}
              khiDocLanDau={docKinhLanDau}
              khiChuyenDaThuoc={chuyenDaThuocKinh}
              khiChuyenSoTay={chuyenSoTayKinh}
            />
          )}

          {manHinh === 'tuiDo' && (
            <ManTuiDo
              tienTrinh={tienTrinh}
              khiTrangBiPhapBao={trangBiHoacGoPhapBao}
              khiDungDanDuoc={dungDanDuocTrongTui}
              khiMoCuaHang={() => setManHinh('cuaHang')}
            />
          )}

          {manHinh === 'cuaHang' && (
            <ManCuaHang
              tienTrinh={tienTrinh}
              khiMuaVatPham={muaVatPham}
              khiQuayLaiTuiDo={() => setManHinh('tuiDo')}
            />
          )}

          {manHinh === 'hoSo' && (
            <ManHoSo
              tienTrinh={tienTrinh}
              khiCapNhatNgoaiHinh={(nhMoi) => {
                luuNgayLanSauRef.current = true;
                setTienTrinh((cu) => ({ ...cu, ngoaiHinh: nhMoi }));
                hienThongBao('Đã cập nhật dung mạo tu sĩ!');
              }}
              khiMoPhongThayDo={() => {
                setNgoaiHinhTamPhongThayDo(null);
                setNoiQuayLaiPhongThayDo('hoSo');
                setManHinh('phongThayDo');
              }}
              khiMoCaiDat={() => setManHinh('caiDat')}
              laKhach={laKhach}
              uidNguoiDung={nguoiDungAuth?.id || null}
              khiMoDangNhap={() => setManHinh('moDau')}
            />
          )}

          {manHinh === 'caiDat' && (
            <ManCaiDatVaGiaoVien
              tienTrinh={tienTrinh}
              nganHangCauHoi={nganHangCauHoi}
              laQuanTri={laQuanTri}
              laKhach={laKhach}
              khiMoBangQuanTri={() => setManHinh('bangQuanTri')}
              khiDoiCaiDat={(caiDatMoi: CaiDatTroChoi) =>
                setTienTrinh((cu) => ({ ...cu, caiDat: caiDatMoi }))
              }
              khiDatLaiTienTrinh={() => {
                if (laKhach) {
                  const moi = khoLuuTru.xoaTienTrinhKhach();
                  setTienTrinh(moi);
                } else {
                  const moi = taoTienTrinhMacDinh();
                  moi.maNguoiChoi = nguoiDungAuth.id;
                  moi.ngoaiHinh.ten = hoSo?.daoHieu || moi.ngoaiHinh.ten;
                  luuNgayLanSauRef.current = true;
                  setTienTrinh(moi);
                }
                setCanhGioiDangXem('luyenKhi');
                setManHinh(laKhach ? 'moDau' : 'banDoTheGioi');
                hienThongBao('Đã đặt lại toàn bộ hành trình tu luyện.');
              }}
              khiThemCauHoi={(dsMoi) =>
                setTienTrinh((cu) => ({
                  ...cu,
                  cauHoiTuyChinh: [...cu.cauHoiTuyChinh, ...dsMoi],
                }))
              }
              khiSuaCauHoi={(cauSua) =>
                setTienTrinh((cu) => ({
                  ...cu,
                  cauHoiGhiDe: { ...cu.cauHoiGhiDe, [cauSua.id]: cauSua },
                }))
              }
              khiXoaCauHoiCustom={(id) =>
                setTienTrinh((cu) => ({
                  ...cu,
                  cauHoiTuyChinh: cu.cauHoiTuyChinh.filter((c) => c.id !== id),
                }))
              }
              khiDatLaiLichSuCauHoi={() => {
                luuNgayLanSauRef.current = true;
                setTienTrinh((cu) => ({
                  ...cu,
                  lichSuCauHoi: {},
                  lichSuGanDay: [],
                  cauHoiDaAn: [],
                }));
                hienThongBao('Đã đặt lại lịch sử câu hỏi đã làm.');
              }}
            />
          )}

          {manHinh === 'bangQuanTri' && laQuanTri && (
            <ManBangQuanTri
              nganHangCauHoi={nganHangDayDuChoQuanTri}
              cauHinhCongKhai={cauHinhCongKhai}
              khiCapNhatCauHinh={setCauHinhCongKhai}
              khiCapNhatNganHangDamMay={async () => {
                const ds = await khoLuuTru.taiCauHoiTuyChinhDamMay(true);
                setCauHoiDamMay(ds);
              }}
              khiQuayLai={() => setManHinh('banDoTheGioi')}
            />
          )}
          </Suspense>
        </div>
      </div>

      {/* Thanh dieu huong duoi man hinh tren dien thoai (toi da 5 muc) */}
      {hienKhungDieuHuong && (
        <nav
          aria-label="Điều hướng di động"
          className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-[#E4BC5A]/25 bg-[#070B14]/96 px-1 py-1.5 flex items-center justify-around no-print"
        >
          {mucDieuHuong.map((m) => {
            const dangChon =
              manHinh === m.id ||
              (m.id === 'banDoTheGioi' && manHinh === 'banDoGiaiDoan') ||
              (m.id === 'tuiDo' && manHinh === 'cuaHang');
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  boPhatAmThanh.phatAmNhanNut();
                  setManHinh(m.id);
                }}
                className={`min-h-[44px] px-2 py-1 rounded-lg flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium cursor-pointer ${
                  dangChon ? 'text-[#F2D88B]' : 'text-[#9BA8BE]'
                }`}
              >
                {m.bieuTuong}
                <span>{m.nhan}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Menu Tai khoan */}
      <MenuTaiKhoan
        dangMo={moMenuTaiKhoan}
        laKhach={laKhach}
        hoSo={hoSo}
        laQuanTri={laQuanTri}
        trangThaiDongBo={trangThaiDongBo}
        mayDungChung={khoLuuTru.laMayDungChung()}
        khiDong={() => setMoMenuTaiKhoan(false)}
        khiMoDangNhap={() => setManHinh('moDau')}
        khiMoBangQuanTri={() => setManHinh('bangQuanTri')}
        khiCapNhatHoSo={xuLyCapNhatHoSo}
        khiDoiMatKhau={xuLyDoiMatKhau}
        khiChuyenHienXepHang={xuLyChuyenHienXepHang}
        khiLuuNgay={async () => {
          const ok = await khoLuuTru.luuDamMayNgay();
          hienThongBao(
            ok
              ? 'Đã đồng bộ tiến trình lên đám mây!'
              : 'Chưa thể đồng bộ lúc này (hãy kiểm tra kết nối mạng).'
          );
        }}
        khiDangXuat={xuLyDangXuat}
        khiXoaTaiKhoan={xuLyXoaTaiKhoan}
      />

      {/* Bat buoc doi mat khau lan dau */}
      {hoSo?.canDoiMatKhau && (
        <HopThoaiDoiMatKhauBatBuoc
          khiXacNhan={xuLyDoiMatKhauBatBuoc}
          khiDangXuat={() => void xuLyDangXuat()}
        />
      )}

      {/* Xac nhan Dao hieu lan dau khi dang nhap Google */}
      {hienChonDaoHieuGoogle && hoSo && (
        <HopThoaiChonDaoHieuLanDau
          daoHieuGoiY={hoSo.daoHieu}
          khiXacNhan={async (daoHieuMoi, lopMoi) => {
            await xuLyCapNhatHoSo(daoHieuMoi, lopMoi);
            setHienChonDaoHieuGoogle(false);
          }}
        />
      )}

      {/* Hoi chuyen tien trinh choi thu vao tai khoan */}
      {tienTrinhKhachChoChuyen && nguoiDungAuth && hoSo && !hienChonDaoHieuGoogle && (
        <HopThoaiChuyenTienTrinhKhach
          soSaoKhach={tinhTongSao(tienTrinhKhachChoChuyen)}
          tenCanhGioiKhach={
            layThongTinCanhGioi(tienTrinhKhachChoChuyen.canhGioiHienTai).ten
          }
          khiChuyen={async () => {
            const gop: TienTrinhNguoiChoi = {
              ...tienTrinhKhachChoChuyen,
              maNguoiChoi: nguoiDungAuth.id,
              ngoaiHinh: {
                ...tienTrinhKhachChoChuyen.ngoaiHinh,
                ten: hoSo.daoHieu,
              },
            };
            luuNgayLanSauRef.current = true;
            setTienTrinh(gop);
            khoLuuTru.xoaTienTrinhKhach();
            setTienTrinhKhachChoChuyen(null);
            hienThongBao('Đã chuyển toàn bộ tiến trình chơi thử vào tài khoản!');
          }}
          khiBoQua={() => {
            khoLuuTru.xoaTienTrinhKhach();
            setTienTrinhKhachChoChuyen(null);
          }}
        />
      )}

      {/* Xung dot tien trinh hai thiet bi */}
      {xungDotTienTrinh && (
        <HopThoaiXungDotTienTrinh
          xungDot={xungDotTienTrinh}
          khiDungDamMay={() => {
            setTienTrinh(xungDotTienTrinh.banDamMay);
            setXungDotTienTrinh(null);
            hienThongBao('Đã nạp bản tiến trình trên đám mây.');
          }}
          khiGiuMayNay={() => {
            setXungDotTienTrinh(null);
            void khoLuuTru.luuDamMayNgay(true);
            hienThongBao('Đã giữ bản trên máy này và cập nhật lên đám mây.');
          }}
        />
      )}
    </div>
  );
}
