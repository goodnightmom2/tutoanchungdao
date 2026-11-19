import {
  CauHinhCongKhai,
  CauHoiTuyChinhDamMay,
  CheDoLuuTru,
  ChiTietCauLuot,
  HoSoNguoiDung,
  KetQuaLuotDamMay,
  KetQuaTaoHangLoatMuc,
  MucXepHang,
  NhatKyQuanTri,
  ThongTinKhoaTaiKhoan,
  TrangThaiDongBo,
  XungDotTienTrinh,
} from '../kieuDuLieu/taiKhoan';
import {
  MaCanhGioi,
  MaGiaiDoan,
  TienTrinhNguoiChoi,
} from '../kieuDuLieu/troChoi';
import {
  laEmailQuanTriGoc,
  laySupabasePhu,
  supabase,
  supabaseDaCauHinh,
} from '../lib/supabase';
import {
  chuyenDoiTienTrinhCu,
  KHOA_LUU_TRU_CU,
} from './luuTru';
import {
  doiMaLoiFirebase,
  taoMatKhauTam,
  taoTenDangNhapTuHoTen,
  taoTomTatTuTienTrinh,
  tenDangNhapSangEmail,
} from './taiKhoanLogic';
import { PHIEN_BAN_LUU_TRU, taoTienTrinhMacDinh } from './tienTrinh';

export const KHOA_LUU_TRU_KHACH = 'tu_toan_chung_dao_khach_v4';
const KHOA_DEM_DAM_MAY_TIEN_TO = 'tu_toan_chung_dao_dam_may_';
const KHOA_MA_THIET_BI = 'tu_toan_chung_dao_ma_thiet_bi';
const KHOA_MAY_DUNG_CHUNG = 'tu_toan_chung_dao_may_dung_chung';
const KHOA_AN_THONG_BAO = 'tu_toan_chung_dao_da_an_thong_bao';

const DEBOUNCE_MS = 5000;
const FLUSH_BAN_MS = 60000;
const COOLDOWN_LUOT_MS = 3000;

function layEpochTuField(val: unknown): number {
  if (!val) return 0;
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const t = Date.parse(val);
    return Number.isNaN(t) ? 0 : t;
  }
  return 0;
}

function taoMaThietBi(): string {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const cu = window.localStorage.getItem(KHOA_MA_THIET_BI);
      if (cu) return cu;
      const moi = `tb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      window.localStorage.setItem(KHOA_MA_THIET_BI, moi);
      return moi;
    }
  } catch {
    // Bo qua
  }
  return `tb_${Date.now().toString(36)}`;
}

function lamSachJson<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

interface DongNguoiDung {
  uid: string;
  dao_hieu: string;
  ten_dang_nhap: string | null;
  email: string | null;
  lop: string | null;
  phuong_thuc: string;
  tao_luc: string;
  dang_nhap_cuoi: string;
  can_doi_mat_khau: boolean;
  hien_tren_xep_hang: boolean;
  tom_tat: Record<string, unknown> | null;
}

class KhoLuuTru {
  private cheDo: CheDoLuuTru = 'cucBo';
  private uidHienTai: string | null = null;
  private mayDungChung = false;
  private maThietBi = taoMaThietBi();
  private boNhoTamKhach: string | null = null;

  private tienTrinhChoLuu: TienTrinhNguoiChoi | null = null;
  private hoSoHienTai: HoSoNguoiDung | null = null;
  private capNhatDamMayCuoiMs = 0;
  private daSuaChuaLuu = false;
  private henGioDebounce: number | null = null;
  private henGioFlushBan: number | null = null;
  private dangLuuDamMay = false;
  private lanGuiKetQuaLuotCuoi = 0;

  private cauHoiDamMayCache: CauHoiTuyChinhDamMay[] | null = null;

  private trangThaiDongBo: TrangThaiDongBo = { loai: 'khach', lucCuoi: null };
  private langNgheDongBo = new Set<(tt: TrangThaiDongBo) => void>();
  private langNgheXungDot: ((xd: XungDotTienTrinh) => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.mayDungChung = window.sessionStorage?.getItem(KHOA_MAY_DUNG_CHUNG) === '1';

      window.addEventListener('online', () => {
        if (this.cheDo === 'damMay') {
          this.datTrangThaiDongBo({ loai: 'sanSang', lucCuoi: this.trangThaiDongBo.lucCuoi });
          if (this.daSuaChuaLuu) {
            void this.luuDamMayNgay();
          }
        }
      });

      window.addEventListener('offline', () => {
        if (this.cheDo === 'damMay') {
          this.datTrangThaiDongBo({
            loai: 'ngoaiTuyen',
            lucCuoi: this.trangThaiDongBo.lucCuoi,
          });
        }
      });

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && this.cheDo === 'damMay' && this.daSuaChuaLuu) {
          void this.luuDamMayNgay();
        }
      });

      window.addEventListener('pagehide', () => {
        if (this.cheDo === 'damMay' && this.daSuaChuaLuu) {
          void this.luuDamMayNgay();
        }
      });
    }
  }

  public layCheDo(): CheDoLuuTru {
    return this.cheDo;
  }

  public layUid(): string | null {
    return this.uidHienTai;
  }

  public laMayDungChung(): boolean {
    return this.mayDungChung;
  }

  public datMayDungChung(giaTri: boolean): void {
    this.mayDungChung = giaTri;
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        if (giaTri) {
          window.sessionStorage.setItem(KHOA_MAY_DUNG_CHUNG, '1');
        } else {
          window.sessionStorage.removeItem(KHOA_MAY_DUNG_CHUNG);
        }
      }
    } catch {
      // Bo qua
    }
  }

  public dangKyLangNgheDongBo(fn: (tt: TrangThaiDongBo) => void): () => void {
    this.langNgheDongBo.add(fn);
    fn(this.trangThaiDongBo);
    return () => {
      this.langNgheDongBo.delete(fn);
    };
  }

  public datLangNgheXungDot(fn: ((xd: XungDotTienTrinh) => void) | null): void {
    this.langNgheXungDot = fn;
  }

  private datTrangThaiDongBo(tt: TrangThaiDongBo): void {
    this.trangThaiDongBo = tt;
    for (const fn of this.langNgheDongBo) {
      fn(tt);
    }
  }

  // === CHUYEN CHE DO ===
  public chuyenCheDoKhach(): void {
    this.huyCacHenGio();
    this.cheDo = 'cucBo';
    this.uidHienTai = null;
    this.hoSoHienTai = null;
    this.tienTrinhChoLuu = null;
    this.daSuaChuaLuu = false;
    this.capNhatDamMayCuoiMs = 0;
    this.datTrangThaiDongBo({ loai: 'khach', lucCuoi: null });
  }

  public chuyenCheDoDamMay(uid: string, hoSo: HoSoNguoiDung): void {
    this.huyCacHenGio();
    this.cheDo = 'damMay';
    this.uidHienTai = uid;
    this.hoSoHienTai = hoSo;
    this.daSuaChuaLuu = false;
    const online = typeof navigator === 'undefined' ? true : navigator.onLine;
    this.datTrangThaiDongBo({
      loai: online ? 'sanSang' : 'ngoaiTuyen',
      lucCuoi: Date.now(),
    });
    if (typeof window !== 'undefined') {
      this.henGioFlushBan = window.setInterval(() => {
        if (this.daSuaChuaLuu && this.cheDo === 'damMay') {
          void this.luuDamMayNgay();
        }
      }, FLUSH_BAN_MS);
    }
  }

  public capNhatHoSoNoiBo(hoSo: HoSoNguoiDung): void {
    this.hoSoHienTai = hoSo;
  }

  private huyCacHenGio(): void {
    if (typeof window === 'undefined') return;
    if (this.henGioDebounce !== null) {
      window.clearTimeout(this.henGioDebounce);
      this.henGioDebounce = null;
    }
    if (this.henGioFlushBan !== null) {
      window.clearInterval(this.henGioFlushBan);
      this.henGioFlushBan = null;
    }
  }

  // === DOC / GHI CUC BO (KHACH + MIGRATION v1-v3 -> v4) ===
  public docTienTrinhKhach(): TienTrinhNguoiChoi {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        let raw = window.localStorage.getItem(KHOA_LUU_TRU_KHACH);
        if (!raw) {
          const cu = window.localStorage.getItem(KHOA_LUU_TRU_CU);
          if (cu) {
            raw = cu;
            const daChuyen = chuyenDoiTienTrinhCu(JSON.parse(cu));
            window.localStorage.setItem(KHOA_LUU_TRU_KHACH, JSON.stringify(daChuyen));
            return daChuyen;
          }
        }
        if (raw) {
          return chuyenDoiTienTrinhCu(JSON.parse(raw));
        }
      } else if (this.boNhoTamKhach) {
        return chuyenDoiTienTrinhCu(JSON.parse(this.boNhoTamKhach));
      }
    } catch {
      // Tra ve mac dinh neu JSON hong
    }
    return taoTienTrinhMacDinh();
  }

  public luuTienTrinhKhach(tienTrinh: TienTrinhNguoiChoi): boolean {
    try {
      const chuoi = JSON.stringify({
        ...tienTrinh,
        phienBan: PHIEN_BAN_LUU_TRU,
      });
      this.boNhoTamKhach = chuoi;
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(KHOA_LUU_TRU_KHACH, chuoi);
      }
      return true;
    } catch {
      return false;
    }
  }

  public xoaTienTrinhKhach(): TienTrinhNguoiChoi {
    this.boNhoTamKhach = null;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(KHOA_LUU_TRU_KHACH);
        window.localStorage.removeItem(KHOA_LUU_TRU_CU);
      }
    } catch {
      // Bo qua
    }
    return taoTienTrinhMacDinh();
  }

  public xoaBoDemTaiKhoanCucBo(uid?: string | null): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        if (uid) {
          window.localStorage.removeItem(`${KHOA_DEM_DAM_MAY_TIEN_TO}${uid}`);
        } else {
          const canXoa: string[] = [];
          for (let i = 0; i < window.localStorage.length; i++) {
            const k = window.localStorage.key(i);
            if (k && k.startsWith(KHOA_DEM_DAM_MAY_TIEN_TO)) {
              canXoa.push(k);
            }
          }
          for (const k of canXoa) {
            window.localStorage.removeItem(k);
          }
        }
      }
    } catch {
      // Bo qua
    }
  }

  private luuBoDemDamMay(uid: string, tt: TienTrinhNguoiChoi): void {
    if (this.mayDungChung) return;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(
          `${KHOA_DEM_DAM_MAY_TIEN_TO}${uid}`,
          JSON.stringify({ capNhatLuc: Date.now(), duLieu: tt })
        );
      }
    } catch {
      // Bo qua
    }
  }

  // === API THONG NHAT CHO PHAN CON LAI CUA GAME ===
  public doc(): TienTrinhNguoiChoi {
    return this.docTienTrinhKhach();
  }

  public luu(tienTrinh: TienTrinhNguoiChoi, ngayLapTuc = false): void {
    if (this.cheDo === 'cucBo' || !this.uidHienTai) {
      this.luuTienTrinhKhach(tienTrinh);
      return;
    }

    const banChuan: TienTrinhNguoiChoi = {
      ...tienTrinh,
      phienBan: PHIEN_BAN_LUU_TRU,
      maNguoiChoi: this.uidHienTai,
    };
    this.tienTrinhChoLuu = banChuan;
    this.daSuaChuaLuu = true;
    this.luuBoDemDamMay(this.uidHienTai, banChuan);

    if (ngayLapTuc) {
      if (this.henGioDebounce !== null && typeof window !== 'undefined') {
        window.clearTimeout(this.henGioDebounce);
        this.henGioDebounce = null;
      }
      void this.luuDamMayNgay();
      return;
    }

    if (typeof window !== 'undefined') {
      if (this.henGioDebounce !== null) {
        window.clearTimeout(this.henGioDebounce);
      }
      this.henGioDebounce = window.setTimeout(() => {
        this.henGioDebounce = null;
        void this.luuDamMayNgay();
      }, DEBOUNCE_MS);
    }
  }

  public async luuDamMayNgay(boQuaKiemTraXungDot = false): Promise<boolean> {
    if (!supabaseDaCauHinh || this.cheDo !== 'damMay' || !this.uidHienTai || !this.tienTrinhChoLuu) {
      return false;
    }
    if (this.dangLuuDamMay) return false;
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.datTrangThaiDongBo({
        loai: 'ngoaiTuyen',
        lucCuoi: this.trangThaiDongBo.lucCuoi,
      });
      return false;
    }

    const uid = this.uidHienTai;
    const banCanLuu = this.tienTrinhChoLuu;
    this.dangLuuDamMay = true;
    this.datTrangThaiDongBo({
      loai: 'dangLuu',
      lucCuoi: this.trangThaiDongBo.lucCuoi,
    });

    try {
      const {
        lichSuCauHoi,
        lichSuGanDay,
        cauHoiDaAn,
        ...phanTienTrinhChinh
      } = banCanLuu;

      const duLieuTienTrinhSach = lamSachJson({
        ...phanTienTrinhChinh,
        lichSu: (phanTienTrinhChinh.lichSu || []).slice(0, 30),
        phapBaoDangTrangBi: (phanTienTrinhChinh.phapBaoDangTrangBi || []).slice(0, 3),
        daDotPhaQua: (phanTienTrinhChinh.daDotPhaQua || []).slice(0, 6),
        ruongMocDaMo: (phanTienTrinhChinh.ruongMocDaMo || []).slice(0, 6),
      });

      if (!boQuaKiemTraXungDot && this.capNhatDamMayCuoiMs > 0) {
        const { data: dongCu } = await supabase
          .from('tien_trinh')
          .select('cap_nhat_luc, ma_thiet_bi, du_lieu')
          .eq('uid', uid)
          .maybeSingle();

        if (dongCu) {
          const mocCu = layEpochTuField(dongCu.cap_nhat_luc);
          const maThietBiCu = String(dongCu.ma_thiet_bi || '');
          if (
            mocCu > this.capNhatDamMayCuoiMs + 2000 &&
            maThietBiCu &&
            maThietBiCu !== this.maThietBi &&
            dongCu.du_lieu
          ) {
            this.dangLuuDamMay = false;
            this.langNgheXungDot?.({
              banDamMay: chuyenDoiTienTrinhCu({
                ...(dongCu.du_lieu as Record<string, unknown>),
                maNguoiChoi: uid,
              }),
              capNhatDamMayLuc: mocCu,
              banCucBo: banCanLuu,
              capNhatCucBoLuc: Date.now(),
            });
            return false;
          }
        }
      }

      const nowIso = new Date().toISOString();

      const { error: errTt } = await supabase.from('tien_trinh').upsert({
        uid,
        phien_ban: PHIEN_BAN_LUU_TRU,
        cap_nhat_luc: nowIso,
        ma_thiet_bi: this.maThietBi,
        du_lieu: duLieuTienTrinhSach,
      });
      if (errTt) throw errTt;

      const { error: errLs } = await supabase.from('lich_su').upsert({
        uid,
        lich_su_cau_hoi: lamSachJson(lichSuCauHoi || {}),
        lich_su_gan_day: (lichSuGanDay || []).slice(-40),
        cau_hoi_da_an: (cauHoiDaAn || []).slice(-40),
        cap_nhat_luc: nowIso,
      });
      if (errLs) throw errLs;

      const tomTat = taoTomTatTuTienTrinh(banCanLuu);
      const { error: errNd } = await supabase
        .from('nguoi_dung')
        .update({
          dang_nhap_cuoi: nowIso,
          tom_tat: {
            canhGioiHienTai: tomTat.canhGioiHienTai,
            tongSao: tomTat.tongSao,
            tongCauLam: tomTat.tongCauLam,
            tongCauDung: tomTat.tongCauDung,
            soLuotChoi: tomTat.soLuotChoi,
            hoatDongCuoi: Date.now(),
          },
        })
        .eq('uid', uid);
      if (errNd) throw errNd;

      if (this.hoSoHienTai?.hienTrenXepHang) {
        const { error: errBxh } = await supabase.from('bang_xep_hang').upsert({
          uid,
          dao_hieu: this.hoSoHienTai.daoHieu,
          tong_sao: tomTat.tongSao,
          canh_gioi: tomTat.canhGioiHienTai,
          cap_nhat_luc: nowIso,
        });
        if (errBxh) throw errBxh;
      }

      const lucLuu = Date.now();
      this.capNhatDamMayCuoiMs = lucLuu;
      this.daSuaChuaLuu = false;
      this.datTrangThaiDongBo({ loai: 'daLuu', lucCuoi: lucLuu });
      return true;
    } catch (err) {
      console.error('Lỗi đồng bộ Supabase:', err);
      const offline = typeof navigator !== 'undefined' && !navigator.onLine;
      this.datTrangThaiDongBo({
        loai: offline ? 'ngoaiTuyen' : 'loi',
        lucCuoi: this.trangThaiDongBo.lucCuoi,
        thongDiep: doiMaLoiFirebase(err),
      });
      return false;
    } finally {
      this.dangLuuDamMay = false;
    }
  }

  // === TAI DU LIEU NGUOI DUNG TU DAM MAY ===
  public async kiemTraQuyenQuanTri(
    uid: string,
    email?: string | null,
    emailVerified?: boolean
  ): Promise<boolean> {
    if (laEmailQuanTriGoc(email) && emailVerified) {
      return true;
    }
    try {
      const { data } = await supabase
        .from('quan_tri_vien')
        .select('uid')
        .eq('uid', uid)
        .maybeSingle();
      return Boolean(data);
    } catch {
      return false;
    }
  }

  public async kiemTraKhoaTaiKhoan(uid: string): Promise<ThongTinKhoaTaiKhoan | null> {
    try {
      const { data } = await supabase
        .from('khoa_tai_khoan')
        .select('ly_do, luc, khoa_boi')
        .eq('uid', uid)
        .maybeSingle();
      if (!data) return null;
      return {
        biKhoa: true,
        lyDo: String(data.ly_do || 'Tài khoản đang tạm khóa.'),
        luc: layEpochTuField(data.luc),
        khoaBoi: data.khoa_boi ? String(data.khoa_boi) : undefined,
      };
    } catch {
      return null;
    }
  }

  public async docHoSoNguoiDung(uid: string): Promise<HoSoNguoiDung | null> {
    try {
      const { data, error } = await supabase
        .from('nguoi_dung')
        .select('*')
        .eq('uid', uid)
        .maybeSingle();
      if (error) throw error;
      if (!data) return null;
      return this.chuyenDongSangHoSo(data as DongNguoiDung);
    } catch (err) {
      console.error('Lỗi đọc hồ sơ:', err);
      return null;
    }
  }

  private chuyenDongSangHoSo(d: DongNguoiDung): HoSoNguoiDung {
    const tt = (d.tom_tat || {}) as Record<string, unknown>;
    return {
      uid: d.uid,
      daoHieu: String(d.dao_hieu || 'Đạo Hữu'),
      tenDangNhap: d.ten_dang_nhap ? String(d.ten_dang_nhap) : null,
      email: d.email ? String(d.email) : null,
      lop: d.lop ? String(d.lop) : null,
      phuongThuc: d.phuong_thuc === 'google' ? 'google' : 'tenDangNhap',
      taoLuc: layEpochTuField(d.tao_luc),
      dangNhapCuoi: layEpochTuField(d.dang_nhap_cuoi),
      canDoiMatKhau: Boolean(d.can_doi_mat_khau),
      hienTrenXepHang: d.hien_tren_xep_hang !== false,
      tomTat: {
        canhGioiHienTai: (tt.canhGioiHienTai as MaCanhGioi) || 'luyenKhi',
        tongSao: Number(tt.tongSao || 0),
        tongCauLam: Number(tt.tongCauLam || 0),
        tongCauDung: Number(tt.tongCauDung || 0),
        soLuotChoi: Number(tt.soLuotChoi || 0),
        hoatDongCuoi: layEpochTuField(tt.hoatDongCuoi),
      },
    };
  }

  public async taoHoSoVaTienTrinhMoi(params: {
    uid: string;
    daoHieu: string;
    tenDangNhap: string | null;
    email: string | null;
    lop: string | null;
    phuongThuc: 'tenDangNhap' | 'google';
    tienTrinhBanDau?: TienTrinhNguoiChoi;
    canDoiMatKhau?: boolean;
  }): Promise<{ hoSo: HoSoNguoiDung; tienTrinh: TienTrinhNguoiChoi }> {
    const ttGoc = params.tienTrinhBanDau
      ? chuyenDoiTienTrinhCu(params.tienTrinhBanDau)
      : taoTienTrinhMacDinh();
    const tienTrinh: TienTrinhNguoiChoi = {
      ...ttGoc,
      phienBan: PHIEN_BAN_LUU_TRU,
      maNguoiChoi: params.uid,
      ngoaiHinh: {
        ...ttGoc.ngoaiHinh,
        ten: params.daoHieu,
      },
    };
    const tomTat = taoTomTatTuTienTrinh(tienTrinh);
    const nowIso = new Date().toISOString();
    const now = Date.now();

    const { lichSuCauHoi, lichSuGanDay, cauHoiDaAn, ...phanChinh } = tienTrinh;

    const { error: errNd } = await supabase.from('nguoi_dung').upsert({
      uid: params.uid,
      dao_hieu: params.daoHieu,
      ten_dang_nhap: params.tenDangNhap,
      email: params.email,
      lop: params.lop,
      phuong_thuc: params.phuongThuc,
      tao_luc: nowIso,
      dang_nhap_cuoi: nowIso,
      can_doi_mat_khau: Boolean(params.canDoiMatKhau),
      hien_tren_xep_hang: true,
      tom_tat: {
        canhGioiHienTai: tomTat.canhGioiHienTai,
        tongSao: tomTat.tongSao,
        tongCauLam: tomTat.tongCauLam,
        tongCauDung: tomTat.tongCauDung,
        soLuotChoi: tomTat.soLuotChoi,
        hoatDongCuoi: now,
      },
    });
    if (errNd) throw errNd;

    const [resTt, resLs, resBxh] = await Promise.all([
      supabase.from('tien_trinh').upsert({
        uid: params.uid,
        phien_ban: PHIEN_BAN_LUU_TRU,
        cap_nhat_luc: nowIso,
        ma_thiet_bi: this.maThietBi,
        du_lieu: lamSachJson(phanChinh),
      }),
      supabase.from('lich_su').upsert({
        uid: params.uid,
        lich_su_cau_hoi: lamSachJson(lichSuCauHoi || {}),
        lich_su_gan_day: (lichSuGanDay || []).slice(-40),
        cau_hoi_da_an: (cauHoiDaAn || []).slice(-40),
        cap_nhat_luc: nowIso,
      }),
      supabase.from('bang_xep_hang').upsert({
        uid: params.uid,
        dao_hieu: params.daoHieu,
        tong_sao: tomTat.tongSao,
        canh_gioi: tomTat.canhGioiHienTai,
        cap_nhat_luc: nowIso,
      }),
    ]);

    if (resTt.error) throw resTt.error;
    if (resLs.error) throw resLs.error;
    if (resBxh.error) throw resBxh.error;

    this.capNhatDamMayCuoiMs = now;
    const hoSo: HoSoNguoiDung = {
      uid: params.uid,
      daoHieu: params.daoHieu,
      tenDangNhap: params.tenDangNhap,
      email: params.email,
      lop: params.lop,
      phuongThuc: params.phuongThuc,
      taoLuc: now,
      dangNhapCuoi: now,
      canDoiMatKhau: Boolean(params.canDoiMatKhau),
      hienTrenXepHang: true,
      tomTat,
    };
    return { hoSo, tienTrinh };
  }

  public async taiTienTrinhTuDamMay(uid: string): Promise<TienTrinhNguoiChoi> {
    try {
      const [resTt, resLs] = await Promise.all([
        supabase.from('tien_trinh').select('*').eq('uid', uid).maybeSingle(),
        supabase.from('lich_su').select('*').eq('uid', uid).maybeSingle(),
      ]);
      if (resTt.error) throw resTt.error;

      const goc =
        resTt.data && resTt.data.du_lieu
          ? (resTt.data.du_lieu as Record<string, unknown>)
          : taoTienTrinhMacDinh();
      if (resTt.data) {
        this.capNhatDamMayCuoiMs = layEpochTuField(resTt.data.cap_nhat_luc) || Date.now();
      }
      const ls = resLs.data || {};
      const gop = chuyenDoiTienTrinhCu({
        ...goc,
        maNguoiChoi: uid,
        lichSuCauHoi: ls.lich_su_cau_hoi || (goc as Record<string, unknown>).lichSuCauHoi || {},
        lichSuGanDay: ls.lich_su_gan_day || (goc as Record<string, unknown>).lichSuGanDay || [],
        cauHoiDaAn: ls.cau_hoi_da_an || (goc as Record<string, unknown>).cauHoiDaAn || [],
      });
      this.luuBoDemDamMay(uid, gop);
      return gop;
    } catch (err) {
      console.error('Lỗi tải tiến trình:', err);
      if (!this.mayDungChung && typeof window !== 'undefined' && window.localStorage) {
        const dem = window.localStorage.getItem(`${KHOA_DEM_DAM_MAY_TIEN_TO}${uid}`);
        if (dem) {
          try {
            const parsed = JSON.parse(dem);
            return chuyenDoiTienTrinhCu({ ...parsed.duLieu, maNguoiChoi: uid });
          } catch {
            // Bo qua
          }
        }
      }
      const md = taoTienTrinhMacDinh();
      md.maNguoiChoi = uid;
      return md;
    }
  }

  public async capNhatHoSoCaNhan(
    uid: string,
    thayDoi: {
      daoHieu?: string;
      lop?: string | null;
      email?: string | null;
      hienTrenXepHang?: boolean;
      canDoiMatKhau?: boolean;
    },
    tienTrinhHienTai?: TienTrinhNguoiChoi
  ): Promise<void> {
    const nowIso = new Date().toISOString();
    const payload: Record<string, unknown> = {
      dang_nhap_cuoi: nowIso,
    };
    if (thayDoi.daoHieu !== undefined) payload.dao_hieu = thayDoi.daoHieu;
    if (thayDoi.lop !== undefined) payload.lop = thayDoi.lop;
    if (thayDoi.email !== undefined) payload.email = thayDoi.email;
    if (thayDoi.hienTrenXepHang !== undefined) {
      payload.hien_tren_xep_hang = thayDoi.hienTrenXepHang;
    }
    if (thayDoi.canDoiMatKhau !== undefined) {
      payload.can_doi_mat_khau = thayDoi.canDoiMatKhau;
    }
    const { error } = await supabase.from('nguoi_dung').update(payload).eq('uid', uid);
    if (error) throw error;

    const hienMoi =
      thayDoi.hienTrenXepHang !== undefined
        ? thayDoi.hienTrenXepHang
        : this.hoSoHienTai?.hienTrenXepHang ?? true;
    const daoHieuMoi = thayDoi.daoHieu ?? this.hoSoHienTai?.daoHieu ?? 'Đạo Hữu';

    if (!hienMoi) {
      await supabase.from('bang_xep_hang').delete().eq('uid', uid);
    } else if (tienTrinhHienTai) {
      const tomTat = taoTomTatTuTienTrinh(tienTrinhHienTai);
      await supabase.from('bang_xep_hang').upsert({
        uid,
        dao_hieu: daoHieuMoi,
        tong_sao: tomTat.tongSao,
        canh_gioi: tomTat.canhGioiHienTai,
        cap_nhat_luc: nowIso,
      });
    }
  }

  public async xoaDuLieuTaiKhoanCuaMinh(uid: string): Promise<void> {
    await Promise.all([
      supabase.from('bang_xep_hang').delete().eq('uid', uid),
      supabase.from('lich_su').delete().eq('uid', uid),
      supabase.from('tien_trinh').delete().eq('uid', uid),
      supabase.from('nguoi_dung').delete().eq('uid', uid),
    ]);
    this.xoaBoDemTaiKhoanCucBo(uid);
  }

  // === GHI KET QUA LUOT CHOI (GIOI HAN 1 LUOT / 3 GIAY) ===
  public async ghiKetQuaLuot(params: {
    canhGioi: MaCanhGioi;
    giaiDoan: MaGiaiDoan | 'tuDo';
    cheDo: 'vuotAi' | 'yeuVuong' | 'dauPhap' | 'luyenCong' | 'beQuan';
    soCau: number;
    soCauDung: number;
    sao: number;
    thoiLuongGiay: number;
    chiTiet: ChiTietCauLuot[];
  }): Promise<void> {
    if (!supabaseDaCauHinh || this.cheDo !== 'damMay' || !this.uidHienTai) return;
    const now = Date.now();
    if (now - this.lanGuiKetQuaLuotCuoi < COOLDOWN_LUOT_MS) return;
    this.lanGuiKetQuaLuotCuoi = now;

    const maLuot = `${this.uidHienTai.slice(0, 12)}_${now.toString(36)}_${Math.random()
      .toString(36)
      .slice(2, 6)}`;
    const soCau = Math.min(50, Math.max(0, Math.floor(params.soCau)));
    const soCauDung = Math.min(soCau, Math.max(0, Math.floor(params.soCauDung)));
    const sao = Math.min(3, Math.max(0, Math.floor(params.sao)));

    try {
      const { error } = await supabase.from('ket_qua_luot').insert({
        ma_luot: maLuot,
        uid: this.uidHienTai,
        canh_gioi: params.canhGioi,
        giai_doan: params.giaiDoan,
        che_do: params.cheDo,
        so_cau: soCau,
        so_cau_dung: soCauDung,
        sao,
        thoi_luong_giay: Math.min(86400, Math.max(0, Math.floor(params.thoiLuongGiay))),
        chi_tiet: params.chiTiet.slice(0, 25).map((ct) => ({
          ma: String(ct.ma).slice(0, 80),
          dung: Boolean(ct.dung),
          giay: Math.min(3600, Math.max(0, Math.floor(ct.giay || 0))),
        })),
        tao_luc: new Date().toISOString(),
      });
      if (error) throw error;
    } catch (err) {
      console.error('Lỗi ghi kết quả lượt:', err);
    }
  }

  // === THIEN BANG (TOP 20 + HANG CUA BAN) ===
  public async docBangXepHang(uidCuaBan?: string | null): Promise<{
    top20: MucXepHang[];
    hangCuaBan: number | null;
    mucCuaBan: MucXepHang | null;
  }> {
    if (!supabaseDaCauHinh) {
      return { top20: [], hangCuaBan: null, mucCuaBan: null };
    }
    try {
      const { data, error } = await supabase
        .from('bang_xep_hang')
        .select('uid, dao_hieu, tong_sao, canh_gioi, cap_nhat_luc')
        .order('tong_sao', { ascending: false })
        .order('cap_nhat_luc', { ascending: true })
        .limit(50);
      if (error) throw error;

      const tatCa: MucXepHang[] = (data || []).map((d) => ({
        uid: String(d.uid),
        daoHieu: String(d.dao_hieu || 'Đạo Hữu'),
        tongSao: Number(d.tong_sao || 0),
        canhGioi: (d.canh_gioi as MaCanhGioi) || 'luyenKhi',
        capNhatLuc: layEpochTuField(d.cap_nhat_luc),
      }));

      const top20 = tatCa.slice(0, 20);
      let hangCuaBan: number | null = null;
      let mucCuaBan: MucXepHang | null = null;

      if (uidCuaBan) {
        const idx = tatCa.findIndex((m) => m.uid === uidCuaBan);
        if (idx >= 0) {
          hangCuaBan = idx + 1;
          mucCuaBan = tatCa[idx];
        } else {
          const { data: ban } = await supabase
            .from('bang_xep_hang')
            .select('uid, dao_hieu, tong_sao, canh_gioi, cap_nhat_luc')
            .eq('uid', uidCuaBan)
            .maybeSingle();
          if (ban) {
            mucCuaBan = {
              uid: String(ban.uid),
              daoHieu: String(ban.dao_hieu || 'Đạo Hữu'),
              tongSao: Number(ban.tong_sao || 0),
              canhGioi: (ban.canh_gioi as MaCanhGioi) || 'luyenKhi',
              capNhatLuc: layEpochTuField(ban.cap_nhat_luc),
            };
          }
        }
      }
      return { top20, hangCuaBan, mucCuaBan };
    } catch (err) {
      console.error('Lỗi đọc Thiên Bảng:', err);
      return { top20: [], hangCuaBan: null, mucCuaBan: null };
    }
  }

  // === CAU HINH CONG KHAI & THONG BAO ===
  public async docCauHinhCongKhai(): Promise<CauHinhCongKhai> {
    if (!supabaseDaCauHinh) {
      return { choPhepDangKy: true, thongBao: '', thongBaoLuc: null };
    }
    try {
      const { data } = await supabase
        .from('cau_hinh')
        .select('cho_phep_dang_ky, thong_bao, thong_bao_luc')
        .eq('tep', 'congKhai')
        .maybeSingle();
      if (!data) {
        return { choPhepDangKy: true, thongBao: '', thongBaoLuc: null };
      }
      return {
        choPhepDangKy: data.cho_phep_dang_ky !== false,
        thongBao: String(data.thong_bao || ''),
        thongBaoLuc: layEpochTuField(data.thong_bao_luc) || null,
      };
    } catch {
      return { choPhepDangKy: true, thongBao: '', thongBaoLuc: null };
    }
  }

  public layMocDaAnThongBao(): number {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return Number(window.localStorage.getItem(KHOA_AN_THONG_BAO) || 0);
      }
    } catch {
      // Bo qua
    }
    return 0;
  }

  public datMocDaAnThongBao(moc: number): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(KHOA_AN_THONG_BAO, String(moc));
      }
    } catch {
      // Bo qua
    }
  }

  // === CAU HOI TUY CHINH TREN DAM MAY ===
  public async taiCauHoiTuyChinhDamMay(batBuocTaiLai = false): Promise<CauHoiTuyChinhDamMay[]> {
    if (!batBuocTaiLai && this.cauHoiDamMayCache !== null) {
      return this.cauHoiDamMayCache;
    }
    if (!supabaseDaCauHinh || !this.uidHienTai) return [];
    try {
      const { data, error } = await supabase.from('cau_hoi_tuy_chinh').select('*');
      if (error) throw error;
      const ds: CauHoiTuyChinhDamMay[] = (data || []).map((row) => {
        const extra = (row.du_lieu || {}) as Record<string, unknown>;
        return {
          ...(extra as unknown as CauHoiTuyChinhDamMay),
          id: String(row.id),
          canhGioi: row.canh_gioi as MaCanhGioi,
          giaiDoan: row.giai_doan as MaGiaiDoan,
          dang: row.dang,
          deBai: String(row.de_bai),
          loiGiai: String(row.loi_giai),
          goiY: String(row.goi_y),
          canDuyet: Boolean(row.can_duyet),
          daAn: Boolean(row.da_an),
          suaBoi: row.sua_boi ? String(row.sua_boi) : undefined,
          capNhatLuc: layEpochTuField(row.cap_nhat_luc),
        };
      });
      this.cauHoiDamMayCache = ds;
      return ds;
    } catch (err) {
      console.error('Lỗi tải câu hỏi tùy chỉnh:', err);
      return this.cauHoiDamMayCache || [];
    }
  }

  // =========================================================================
  // CAC THAO TAC DANH RIENG CHO QUAN TRI VIEN (DUOC BAO VE BOI SUPABASE RLS)
  // =========================================================================

  private async layUidHienTaiTuAuth(): Promise<string | null> {
    if (this.uidHienTai) return this.uidHienTai;
    const { data } = await supabase.auth.getUser();
    return data.user?.id || null;
  }

  public async ghiNhatKyQuanTri(
    hanhDong: string,
    doiTuong: string,
    chiTiet: string
  ): Promise<void> {
    const uidQt = await this.layUidHienTaiTuAuth();
    if (!uidQt) return;
    const ma = `nk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    try {
      const { error } = await supabase.from('nhat_ky_quan_tri').insert({
        id: ma,
        uid_quan_tri: uidQt,
        hanh_dong: hanhDong.slice(0, 80),
        doi_tuong: doiTuong.slice(0, 128),
        chi_tiet: chiTiet.slice(0, 500),
        luc: new Date().toISOString(),
      });
      if (error) throw error;
    } catch (err) {
      console.error('Lỗi ghi nhật ký quản trị:', err);
    }
  }

  public async qtDocDanhSachNguoiDung(
    soLuong = 50,
    conTro?: string | null
  ): Promise<{
    danhSach: HoSoNguoiDung[];
    conTroCuoi: string | null;
    conNua: boolean;
  }> {
    let qNd = supabase
      .from('nguoi_dung')
      .select('*')
      .order('tao_luc', { ascending: false })
      .limit(soLuong);

    if (conTro) {
      qNd = qNd.lt('tao_luc', conTro);
    }

    const [resNd, resQt, resKhoa] = await Promise.all([
      qNd,
      supabase.from('quan_tri_vien').select('uid'),
      supabase.from('khoa_tai_khoan').select('uid, ly_do'),
    ]);

    if (resNd.error) throw resNd.error;

    const tapQt = new Set((resQt.data || []).map((r) => String(r.uid)));
    const mapKhoa = new Map<string, string>();
    for (const r of resKhoa.data || []) {
      mapKhoa.set(String(r.uid), String(r.ly_do || 'Đang tạm khóa'));
    }

    const rows = (resNd.data || []) as DongNguoiDung[];
    const danhSach = rows.map((d) => {
      const hs = this.chuyenDongSangHoSo(d);
      hs.laQuanTri = tapQt.has(d.uid) || laEmailQuanTriGoc(hs.email);
      hs.biKhoa = mapKhoa.has(d.uid);
      hs.lyDoKhoa = mapKhoa.get(d.uid);
      return hs;
    });

    const conTroCuoi = rows.length > 0 ? rows[rows.length - 1].tao_luc : null;
    return {
      danhSach,
      conTroCuoi,
      conNua: rows.length === soLuong,
    };
  }

  public async qtDocKetQuaLuotGanDay(soLuong = 500): Promise<KetQuaLuotDamMay[]> {
    try {
      const { data, error } = await supabase
        .from('ket_qua_luot')
        .select('*')
        .order('tao_luc', { ascending: false })
        .limit(soLuong);
      if (error) throw error;

      return (data || []).map((d) => ({
        maLuot: String(d.ma_luot),
        uid: String(d.uid || ''),
        canhGioi: (d.canh_gioi as MaCanhGioi) || 'luyenKhi',
        giaiDoan: (d.giai_doan as MaGiaiDoan | 'tuDo') || 'soKy',
        cheDo: (d.che_do as KetQuaLuotDamMay['cheDo']) || 'vuotAi',
        soCau: Number(d.so_cau || 0),
        soCauDung: Number(d.so_cau_dung || 0),
        sao: Number(d.sao || 0),
        thoiLuongGiay: Number(d.thoi_luong_giay || 0),
        chiTiet: Array.isArray(d.chi_tiet) ? d.chi_tiet : [],
        taoLuc: layEpochTuField(d.tao_luc),
      }));
    } catch (err) {
      console.error('Lỗi đọc kết quả lượt:', err);
      return [];
    }
  }

  public async qtDocChiTietNguoiDung(uid: string): Promise<{
    tienTrinh: TienTrinhNguoiChoi;
    luotGanDay: KetQuaLuotDamMay[];
  }> {
    const tienTrinh = await this.taiTienTrinhTuDamMay(uid);
    let luotGanDay: KetQuaLuotDamMay[] = [];
    try {
      const { data, error } = await supabase
        .from('ket_qua_luot')
        .select('*')
        .eq('uid', uid)
        .order('tao_luc', { ascending: false })
        .limit(20);
      if (error) throw error;

      luotGanDay = (data || []).map((d) => ({
        maLuot: String(d.ma_luot),
        uid: String(d.uid || uid),
        canhGioi: (d.canh_gioi as MaCanhGioi) || 'luyenKhi',
        giaiDoan: (d.giai_doan as MaGiaiDoan | 'tuDo') || 'soKy',
        cheDo: (d.che_do as KetQuaLuotDamMay['cheDo']) || 'vuotAi',
        soCau: Number(d.so_cau || 0),
        soCauDung: Number(d.so_cau_dung || 0),
        sao: Number(d.sao || 0),
        thoiLuongGiay: Number(d.thoi_luong_giay || 0),
        chiTiet: Array.isArray(d.chi_tiet) ? d.chi_tiet : [],
        taoLuc: layEpochTuField(d.tao_luc),
      }));
    } catch {
      luotGanDay = [];
    }
    return { tienTrinh, luotGanDay };
  }

  public async qtKhoaTaiKhoan(uid: string, lyDo: string): Promise<void> {
    const uidQt = (await this.layUidHienTaiTuAuth()) || '';
    const { error } = await supabase.from('khoa_tai_khoan').upsert({
      uid,
      ly_do: lyDo.trim().slice(0, 200) || 'Tạm khóa bởi Quản trị viên',
      luc: new Date().toISOString(),
      khoa_boi: uidQt,
    });
    if (error) throw error;
    await this.ghiNhatKyQuanTri('khoaTaiKhoan', uid, `Lý do: ${lyDo}`);
  }

  public async qtMoKhoaTaiKhoan(uid: string): Promise<void> {
    const { error } = await supabase.from('khoa_tai_khoan').delete().eq('uid', uid);
    if (error) throw error;
    await this.ghiNhatKyQuanTri('moKhoaTaiKhoan', uid, 'Mở khóa tài khoản');
  }

  public async qtDatLaiTienTrinhNguoiDung(
    hoSo: HoSoNguoiDung
  ): Promise<TienTrinhNguoiChoi> {
    const ttCu = await this.taiTienTrinhTuDamMay(hoSo.uid);
    const ttMoi = taoTienTrinhMacDinh();
    ttMoi.maNguoiChoi = hoSo.uid;
    ttMoi.ngoaiHinh.ten = hoSo.daoHieu;

    const { lichSuCauHoi, lichSuGanDay, cauHoiDaAn, ...phanChinh } = ttMoi;
    const tomTat = taoTomTatTuTienTrinh(ttMoi, 0);
    const nowIso = new Date().toISOString();

    const ops = [
      supabase.from('tien_trinh').upsert({
        uid: hoSo.uid,
        phien_ban: PHIEN_BAN_LUU_TRU,
        cap_nhat_luc: nowIso,
        ma_thiet_bi: 'quanTriDatLai',
        du_lieu: lamSachJson(phanChinh),
      }),
      supabase.from('lich_su').upsert({
        uid: hoSo.uid,
        lich_su_cau_hoi: lichSuCauHoi,
        lich_su_gan_day: lichSuGanDay,
        cau_hoi_da_an: cauHoiDaAn,
        cap_nhat_luc: nowIso,
      }),
      supabase
        .from('nguoi_dung')
        .update({
          tom_tat: {
            ...tomTat,
            hoatDongCuoi: Date.now(),
          },
        })
        .eq('uid', hoSo.uid),
    ];

    if (hoSo.hienTrenXepHang) {
      ops.push(
        supabase.from('bang_xep_hang').upsert({
          uid: hoSo.uid,
          dao_hieu: hoSo.daoHieu,
          tong_sao: 0,
          canh_gioi: 'luyenKhi',
          cap_nhat_luc: nowIso,
        })
      );
    }

    const results = await Promise.all(ops);
    for (const r of results) {
      if (r.error) throw r.error;
    }

    await this.ghiNhatKyQuanTri(
      'datLaiTienTrinh',
      hoSo.uid,
      `Đặt lại tiến trình của ${hoSo.daoHieu} (${hoSo.tenDangNhap || hoSo.email || hoSo.uid})`
    );
    return ttCu;
  }

  public async qtSuaThongTinNguoiDung(
    uid: string,
    daoHieu: string,
    lop: string | null,
    hienTrenXepHang: boolean,
    tomTat: HoSoNguoiDung['tomTat']
  ): Promise<void> {
    const { error } = await supabase
      .from('nguoi_dung')
      .update({ dao_hieu: daoHieu, lop })
      .eq('uid', uid);
    if (error) throw error;

    if (hienTrenXepHang) {
      await supabase.from('bang_xep_hang').upsert({
        uid,
        dao_hieu: daoHieu,
        tong_sao: Math.min(72, Math.max(0, tomTat.tongSao || 0)),
        canh_gioi: tomTat.canhGioiHienTai || 'luyenKhi',
        cap_nhat_luc: new Date().toISOString(),
      });
    }
    await this.ghiNhatKyQuanTri(
      'suaThongTinNguoiDung',
      uid,
      `Đạo hiệu: ${daoHieu}, Lớp: ${lop || '(trống)'}`
    );
  }

  public async qtCapQuyenQuanTri(uid: string, daoHieu: string): Promise<void> {
    const uidQt = (await this.layUidHienTaiTuAuth()) || '';
    const { error } = await supabase.from('quan_tri_vien').upsert({
      uid,
      cap_boi: uidQt,
      cap_luc: new Date().toISOString(),
      ghi_chu: `Cấp cho ${daoHieu}`,
    });
    if (error) throw error;
    await this.ghiNhatKyQuanTri('capQuyenQuanTri', uid, `Cấp quyền Quản trị viên cho ${daoHieu}`);
  }

  public async qtThuHoiQuyenQuanTri(hoSo: HoSoNguoiDung): Promise<void> {
    if (laEmailQuanTriGoc(hoSo.email)) {
      throw new Error('Không thể thu hồi quyền của Quản trị viên gốc.');
    }
    const { error } = await supabase.from('quan_tri_vien').delete().eq('uid', hoSo.uid);
    if (error) throw error;
    await this.ghiNhatKyQuanTri(
      'thuHoiQuyenQuanTri',
      hoSo.uid,
      `Thu hồi quyền Quản trị viên của ${hoSo.daoHieu}`
    );
  }

  public async qtCapNhatCauHinhCongKhai(cauHinh: {
    choPhepDangKy: boolean;
    thongBao: string;
  }): Promise<void> {
    const { error } = await supabase.from('cau_hinh').upsert({
      tep: 'congKhai',
      cho_phep_dang_ky: cauHinh.choPhepDangKy,
      thong_bao: cauHinh.thongBao.trim().slice(0, 500),
      thong_bao_luc: new Date().toISOString(),
    });
    if (error) throw error;
    await this.ghiNhatKyQuanTri(
      'capNhatCauHinh',
      'congKhai',
      `Đăng ký: ${cauHinh.choPhepDangKy ? 'Mở' : 'Đóng'} | Thông báo: ${cauHinh.thongBao.slice(0, 120)}`
    );
  }

  public async qtLuuCauHoiTuyChinh(cau: CauHoiTuyChinhDamMay): Promise<void> {
    const uidQt = (await this.layUidHienTaiTuAuth()) || '';
    const duLieuSach = lamSachJson({ ...cau });
    const { error } = await supabase.from('cau_hoi_tuy_chinh').upsert({
      id: cau.id,
      canh_gioi: cau.canhGioi,
      giai_doan: cau.giaiDoan,
      dang: cau.dang,
      de_bai: cau.deBai,
      loi_giai: cau.loiGiai,
      goi_y: cau.goiY,
      can_duyet: Boolean(cau.canDuyet),
      da_an: Boolean(cau.daAn),
      du_lieu: duLieuSach,
      sua_boi: uidQt,
      cap_nhat_luc: new Date().toISOString(),
    });
    if (error) throw error;
    this.cauHoiDamMayCache = null;
    await this.ghiNhatKyQuanTri(
      cau.daAn ? 'anCauHoi' : 'luuCauHoi',
      cau.id,
      `${cau.canhGioi}/${cau.giaiDoan} · Cần duyệt: ${cau.canDuyet ? 'Có' : 'Không'}`
    );
  }

  public async qtXoaCauHoiTuyChinh(maCau: string): Promise<void> {
    const { error } = await supabase.from('cau_hoi_tuy_chinh').delete().eq('id', maCau);
    if (error) throw error;
    this.cauHoiDamMayCache = null;
    await this.ghiNhatKyQuanTri('xoaCauHoi', maCau, 'Xóa câu hỏi tùy chỉnh');
  }

  public async qtDocNhatKy(soLuong = 100): Promise<NhatKyQuanTri[]> {
    try {
      const { data, error } = await supabase
        .from('nhat_ky_quan_tri')
        .select('*')
        .order('luc', { ascending: false })
        .limit(soLuong);
      if (error) throw error;

      return (data || []).map((d) => ({
        id: String(d.id),
        uidQuanTri: String(d.uid_quan_tri || ''),
        hanhDong: String(d.hanh_dong || ''),
        doiTuong: String(d.doi_tuong || ''),
        chiTiet: String(d.chi_tiet || ''),
        luc: layEpochTuField(d.luc),
      }));
    } catch (err) {
      console.error('Lỗi đọc nhật ký quản trị:', err);
      return [];
    }
  }

  // === 6.3 TAO TAI KHOAN HANG LOAT (TOI DA 60, DUNG SUPABASE CLIENT PHU) ===
  public async qtTaoTaiKhoanHangLoat(
    danhSach: { daoHieu: string; lop: string }[],
    khiTienDo?: (daXong: number, tong: number, mucMoi: KetQuaTaoHangLoatMuc) => void
  ): Promise<KetQuaTaoHangLoatMuc[]> {
    const supabasePhu = laySupabasePhu();
    const tapDaDung = new Set<string>();
    const ketQua: KetQuaTaoHangLoatMuc[] = [];

    for (let i = 0; i < danhSach.length; i++) {
      const dong = danhSach[i];
      const tenDangNhap = taoTenDangNhapTuHoTen(dong.daoHieu, dong.lop, i + 1, tapDaDung);
      const matKhauTam = taoMatKhauTam(8);
      const emailAo = tenDangNhapSangEmail(tenDangNhap);

      let muc: KetQuaTaoHangLoatMuc = {
        stt: i + 1,
        daoHieu: dong.daoHieu,
        lop: dong.lop,
        tenDangNhap,
        matKhauTam,
        thanhCong: false,
      };

      let soLanThu = 0;
      while (soLanThu < 2) {
        soLanThu += 1;
        try {
          const { data, error } = await supabasePhu.auth.signUp({
            email: emailAo,
            password: matKhauTam,
            options: { data: { dao_hieu: dong.daoHieu } },
          });
          if (error) throw error;
          const uidMoi = data.user?.id;
          if (!uidMoi) {
            throw new Error('Không nhận được mã người dùng từ Supabase Auth.');
          }
          await supabasePhu.auth.signOut();

          await this.taoHoSoVaTienTrinhMoi({
            uid: uidMoi,
            daoHieu: dong.daoHieu,
            tenDangNhap,
            email: null,
            lop: dong.lop || null,
            phuongThuc: 'tenDangNhap',
            canDoiMatKhau: true,
          });

          muc = { ...muc, thanhCong: true, uid: uidMoi };
          break;
        } catch (err) {
          const msg = err instanceof Error ? err.message.toLowerCase() : '';
          if (msg.includes('rate limit') && soLanThu < 2) {
            await new Promise((r) => setTimeout(r, 2000));
            continue;
          }
          muc = { ...muc, thanhCong: false, loi: doiMaLoiFirebase(err) };
          break;
        }
      }

      ketQua.push(muc);
      khiTienDo?.(i + 1, danhSach.length, muc);

      if (i < danhSach.length - 1) {
        await new Promise((r) => setTimeout(r, 400));
      }
    }

    const thanhCongCount = ketQua.filter((k) => k.thanhCong).length;
    await this.ghiNhatKyQuanTri(
      'taoTaiKhoanHangLoat',
      `tong_${danhSach.length}`,
      `Thành công ${thanhCongCount}/${danhSach.length} tài khoản`
    );

    return ketQua;
  }

  // === 6.4 CAP TAI KHOAN THAY THE (CHUYEN TIEN TRINH + KHOA TAI KHOAN CU) ===
  public async qtCapTaiKhoanThayThe(
    hoSoCu: HoSoNguoiDung,
    tenDangNhapMoi: string
  ): Promise<{ tenDangNhap: string; matKhauTam: string; uidMoi: string }> {
    const supabasePhu = laySupabasePhu();
    const matKhauTam = taoMatKhauTam(8);
    const emailAo = tenDangNhapSangEmail(tenDangNhapMoi);

    const ttCu = await this.taiTienTrinhTuDamMay(hoSoCu.uid);

    const { data, error } = await supabasePhu.auth.signUp({
      email: emailAo,
      password: matKhauTam,
      options: { data: { dao_hieu: hoSoCu.daoHieu } },
    });
    if (error) throw error;
    const uidMoi = data.user?.id;
    if (!uidMoi) {
      throw new Error('Không tạo được tài khoản thay thế.');
    }
    await supabasePhu.auth.signOut();

    await this.taoHoSoVaTienTrinhMoi({
      uid: uidMoi,
      daoHieu: hoSoCu.daoHieu,
      tenDangNhap: tenDangNhapMoi,
      email: hoSoCu.email,
      lop: hoSoCu.lop,
      phuongThuc: 'tenDangNhap',
      tienTrinhBanDau: ttCu,
      canDoiMatKhau: true,
    });

    await this.qtKhoaTaiKhoan(
      hoSoCu.uid,
      `Đã cấp tài khoản thay thế (${tenDangNhapMoi}) do quên mật khẩu.`
    );

    await this.ghiNhatKyQuanTri(
      'capTaiKhoanThayThe',
      hoSoCu.uid,
      `Tài khoản cũ ${hoSoCu.tenDangNhap || hoSoCu.uid} -> tài khoản mới ${tenDangNhapMoi} (${uidMoi})`
    );

    return { tenDangNhap: tenDangNhapMoi, matKhauTam, uidMoi };
  }
}

export const khoLuuTru = new KhoLuuTru();
