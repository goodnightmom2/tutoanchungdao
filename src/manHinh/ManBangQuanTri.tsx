import React, { useEffect, useMemo, useState } from 'react';
import { boPhatAmThanh } from '../amThanh/boPhatAmThanh';
import { DANH_SACH_CANH_GIOI, layThongTinCanhGioi } from '../duLieu/canhGioi';
import { BAO_CAO_NHAP_PDF } from '../duLieu/nganHang/baoCaoNhap';
import {
  CauHinhCongKhai,
  CauHoiTuyChinhDamMay,
  HoSoNguoiDung,
  KetQuaLuotDamMay,
  KetQuaTaoHangLoatMuc,
  NhatKyQuanTri,
} from '../kieuDuLieu/taiKhoan';
import {
  CauHoi,
  MaCanhGioi,
  MaGiaiDoan,
  TienTrinhNguoiChoi,
} from '../kieuDuLieu/troChoi';
import { laEmailQuanTriGoc } from '../lib/supabase';
import { khoLuuTru } from '../logic/khoLuuTru';
import { kiemTraHopLeNganHangCauHoi } from '../logic/luuTru';
import {
  BaoCaoToanVenNganHang,
  kiemTraToanVenNganHang,
} from '../logic/mauCauHoi';
import {
  doiMaLoiFirebase,
  kiemTraDaoHieu,
  kiemTraTenDangNhap,
  phanTichDanhSachHangLoat,
  SO_TAI_KHOAN_HANG_LOAT_TOI_DA,
  taoChuoiCsvUtf8Bom,
  tinhThongKeQuanTri,
} from '../logic/taiKhoanLogic';
import {
  khoaGiaiDoan,
  THU_TU_CANH_GIOI,
  THU_TU_GIAI_DOAN,
} from '../logic/tienTrinh';
import { CongThucToan } from '../thanhPhan/CongThucToan';
import { NutLenhBai } from '../thanhPhan/KhungGiaoDien';

type MucQuanTri =
  | 'tongQuan'
  | 'nguoiDung'
  | 'taoHangLoat'
  | 'thongBao'
  | 'nganHang'
  | 'baoCao'
  | 'nhatKy';

function taiXuongTep(tenTep: string, noiDung: string, loaiMime: string): void {
  const blob = new Blob([noiDung], { type: loaiMime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = tenTep;
  a.click();
  URL.revokeObjectURL(url);
}

function dinhDangThoiGian(ms: number): string {
  if (!ms) return '—';
  const d = new Date(ms);
  return `${String(d.getHours()).padStart(2, '0')}:${String(
    d.getMinutes()
  ).padStart(2, '0')} · ${String(d.getDate()).padStart(2, '0')}/${String(
    d.getMonth() + 1
  ).padStart(2, '0')}/${d.getFullYear()}`;
}

export const ManBangQuanTri: React.FC<{
  nganHangCauHoi: CauHoi[];
  cauHinhCongKhai: CauHinhCongKhai;
  khiCapNhatCauHinh: (moi: CauHinhCongKhai) => void;
  khiCapNhatNganHangDamMay: () => Promise<void>;
  khiQuayLai: () => void;
}> = ({
  nganHangCauHoi,
  cauHinhCongKhai,
  khiCapNhatCauHinh,
  khiCapNhatNganHangDamMay,
  khiQuayLai,
}) => {
  const [muc, setMuc] = useState<MucQuanTri>('tongQuan');
  const [thongBao, setThongBao] = useState<string | null>(null);
  const [loi, setLoi] = useState<string | null>(null);

  // Du lieu nguoi dung & luot choi
  const [dsNguoiDung, setDsNguoiDung] = useState<HoSoNguoiDung[]>([]);
  const [conTroTrang, setConTroTrang] = useState<string | null>(null);
  const [conTrangTiep, setConTrangTiep] = useState(false);
  const [dsKetQuaLuot, setDsKetQuaLuot] = useState<KetQuaLuotDamMay[]>([]);
  const [dsNhatKy, setDsNhatKy] = useState<NhatKyQuanTri[]>([]);
  const [dangTaiDuLieu, setDangTaiDuLieu] = useState(false);

  // Loc nguoi dung
  const [tuKhoa, setTuKhoa] = useState('');
  const [locLop, setLocLop] = useState('tatCa');

  // Chi tiet nguoi dung
  const [ndDangXem, setNdDangXem] = useState<HoSoNguoiDung | null>(null);
  const [chiTietNd, setChiTietNd] = useState<{
    tienTrinh: TienTrinhNguoiChoi;
    luotGanDay: KetQuaLuotDamMay[];
  } | null>(null);
  const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);

  // Hop thoai thao tac tren nguoi dung
  const [ndKhoa, setNdKhoa] = useState<HoSoNguoiDung | null>(null);
  const [lyDoKhoa, setLyDoKhoa] = useState('');

  const [ndDatLai, setNdDatLai] = useState<HoSoNguoiDung | null>(null);
  const [oXacNhanDatLai, setOXacNhanDatLai] = useState('');

  const [ndSua, setNdSua] = useState<HoSoNguoiDung | null>(null);
  const [suaDaoHieu, setSuaDaoHieu] = useState('');
  const [suaLop, setSuaLop] = useState('');

  const [ndThayThe, setNdThayThe] = useState<HoSoNguoiDung | null>(null);
  const [tenDnThayThe, setTenDnThayThe] = useState('');
  const [ketQuaThayThe, setKetQuaThayThe] = useState<{
    daoHieu: string;
    tenDangNhap: string;
    matKhauTam: string;
  } | null>(null);

  // 6.3 Tao tai khoan hang loat
  const [vanBanHangLoat, setVanBanHangLoat] = useState('');
  const [dangTaoHangLoat, setDangTaoHangLoat] = useState(false);
  const [tienDoHangLoat, setTienDoHangLoat] = useState({ xong: 0, tong: 0 });
  const [ketQuaHangLoat, setKetQuaHangLoat] = useState<KetQuaTaoHangLoatMuc[]>([]);
  const [hienKhungInThe, setHienKhungInThe] = useState(false);

  // 6.5 Thong bao & cau hinh
  const [formChoPhepDk, setFormChoPhepDk] = useState(cauHinhCongKhai.choPhepDangKy);
  const [formThongBao, setFormThongBao] = useState(cauHinhCongKhai.thongBao);
  const [dangLuuCauHinh, setDangLuuCauHinh] = useState(false);

  // 6.6 Ngan hang cau hoi dam may
  const [locCanhGioi, setLocCanhGioi] = useState<'tatCa' | MaCanhGioi>('tatCa');
  const [chiCanDuyet, setChiCanDuyet] = useState(false);
  const [moBaoCaoPdf, setMoBaoCaoPdf] = useState(false);
  const [ketQuaKiemTra, setKetQuaKiemTra] = useState<BaoCaoToanVenNganHang | null>(null);
  const [dangSuaCauId, setDangSuaCauId] = useState<string | null>(null);
  const [fCanhGioi, setFCanhGioi] = useState<MaCanhGioi>('luyenKhi');
  const [fGiaiDoan, setFGiaiDoan] = useState<MaGiaiDoan>('soKy');
  const [fDeBai, setFDeBai] = useState('');
  const [fLuaChon, setFLuaChon] = useState(['', '', '', '']);
  const [fDapAn, setFDapAn] = useState(0);
  const [fLoiGiai, setFLoiGiai] = useState('');
  const [fGoiY, setFGoiY] = useState('');

  const taiDuLieuChinh = async () => {
    setDangTaiDuLieu(true);
    setLoi(null);
    try {
      const [kqNd, kqLuot] = await Promise.all([
        khoLuuTru.qtDocDanhSachNguoiDung(50, null),
        khoLuuTru.qtDocKetQuaLuotGanDay(500),
      ]);
      setDsNguoiDung(kqNd.danhSach);
      setConTroTrang(kqNd.conTroCuoi);
      setConTrangTiep(kqNd.conNua);
      setDsKetQuaLuot(kqLuot);
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    } finally {
      setDangTaiDuLieu(false);
    }
  };

  useEffect(() => {
    void taiDuLieuChinh();
  }, []);

  useEffect(() => {
    setFormChoPhepDk(cauHinhCongKhai.choPhepDangKy);
    setFormThongBao(cauHinhCongKhai.thongBao);
  }, [cauHinhCongKhai]);

  useEffect(() => {
    if (muc === 'nhatKy') {
      void khoLuuTru.qtDocNhatKy(100).then(setDsNhatKy);
    }
  }, [muc]);

  const taiThemNguoiDung = async () => {
    if (!conTroTrang || !conTrangTiep) return;
    setDangTaiDuLieu(true);
    try {
      const kq = await khoLuuTru.qtDocDanhSachNguoiDung(50, conTroTrang);
      setDsNguoiDung((cu) => [...cu, ...kq.danhSach]);
      setConTroTrang(kq.conTroCuoi);
      setConTrangTiep(kq.conNua);
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    } finally {
      setDangTaiDuLieu(false);
    }
  };

  const thongKe = useMemo(
    () => tinhThongKeQuanTri(dsNguoiDung, dsKetQuaLuot),
    [dsNguoiDung, dsKetQuaLuot]
  );

  const danhSachLop = useMemo(() => {
    const setLop = new Set<string>();
    for (const nd of dsNguoiDung) {
      if (nd.lop) setLop.add(nd.lop);
    }
    return Array.from(setLop).sort();
  }, [dsNguoiDung]);

  const dsNguoiDungLoc = useMemo(() => {
    const kw = tuKhoa.trim().toLowerCase();
    return dsNguoiDung.filter((nd) => {
      if (locLop !== 'tatCa' && (nd.lop || '') !== locLop) return false;
      if (!kw) return true;
      return (
        nd.daoHieu.toLowerCase().includes(kw) ||
        (nd.tenDangNhap || '').toLowerCase().includes(kw) ||
        (nd.email || '').toLowerCase().includes(kw) ||
        (nd.lop || '').toLowerCase().includes(kw)
      );
    });
  }, [dsNguoiDung, tuKhoa, locLop]);

  const moChiTietNguoiDung = async (nd: HoSoNguoiDung) => {
    setNdDangXem(nd);
    setChiTietNd(null);
    setDangTaiChiTiet(true);
    try {
      const ct = await khoLuuTru.qtDocChiTietNguoiDung(nd.uid);
      setChiTietNd(ct);
    } finally {
      setDangTaiChiTiet(false);
    }
  };

  const xuLyKhoaTaiKhoan = async () => {
    if (!ndKhoa) return;
    try {
      await khoLuuTru.qtKhoaTaiKhoan(
        ndKhoa.uid,
        lyDoKhoa.trim() || 'Tạm khóa bởi Quản trị viên'
      );
      setDsNguoiDung((cu) =>
        cu.map((n) =>
          n.uid === ndKhoa.uid
            ? { ...n, biKhoa: true, lyDoKhoa: lyDoKhoa.trim() || 'Tạm khóa' }
            : n
        )
      );
      setThongBao(`Đã tạm khóa tài khoản của ${ndKhoa.daoHieu}.`);
      setNdKhoa(null);
      setLyDoKhoa('');
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    }
  };

  const xuLyMoKhoa = async (nd: HoSoNguoiDung) => {
    try {
      await khoLuuTru.qtMoKhoaTaiKhoan(nd.uid);
      setDsNguoiDung((cu) =>
        cu.map((n) => (n.uid === nd.uid ? { ...n, biKhoa: false, lyDoKhoa: undefined } : n))
      );
      setThongBao(`Đã mở khóa tài khoản của ${nd.daoHieu}.`);
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    }
  };

  const xuLyDatLaiTienTrinh = async () => {
    if (!ndDatLai) return;
    const tuCanGoi = ndDatLai.tenDangNhap || ndDatLai.daoHieu;
    if (oXacNhanDatLai.trim() !== tuCanGoi) {
      setLoi(`Vui lòng gõ chính xác "${tuCanGoi}" để xác nhận đặt lại tiến trình.`);
      return;
    }
    try {
      const banSaoLuuCu = await khoLuuTru.qtDatLaiTienTrinhNguoiDung(ndDatLai);
      // Tu dong tai ban sao luu JSON truoc khi xoa
      taiXuongTep(
        `sao-luu-${ndDatLai.tenDangNhap || ndDatLai.uid.slice(0, 8)}.json`,
        JSON.stringify({ hoSo: ndDatLai, tienTrinhCu: banSaoLuuCu }, null, 2),
        'application/json;charset=utf-8'
      );
      setDsNguoiDung((cu) =>
        cu.map((n) =>
          n.uid === ndDatLai.uid
            ? {
                ...n,
                tomTat: {
                  canhGioiHienTai: 'luyenKhi',
                  tongSao: 0,
                  tongCauLam: 0,
                  tongCauDung: 0,
                  soLuotChoi: 0,
                  hoatDongCuoi: Date.now(),
                },
              }
            : n
        )
      );
      setThongBao(
        `Đã đặt lại tiến trình của ${ndDatLai.daoHieu} và tải xuống tệp sao lưu JSON.`
      );
      setNdDatLai(null);
      setOXacNhanDatLai('');
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    }
  };

  const xuLySuaNguoiDung = async () => {
    if (!ndSua) return;
    const kt = kiemTraDaoHieu(suaDaoHieu);
    if (!kt.hopLe) {
      setLoi(kt.loi || 'Đạo hiệu không hợp lệ.');
      return;
    }
    try {
      await khoLuuTru.qtSuaThongTinNguoiDung(
        ndSua.uid,
        kt.chuanHoa,
        suaLop.trim().slice(0, 20) || null,
        ndSua.hienTrenXepHang,
        ndSua.tomTat
      );
      setDsNguoiDung((cu) =>
        cu.map((n) =>
          n.uid === ndSua.uid
            ? { ...n, daoHieu: kt.chuanHoa, lop: suaLop.trim().slice(0, 20) || null }
            : n
        )
      );
      setThongBao(`Đã cập nhật thông tin cho ${kt.chuanHoa}.`);
      setNdSua(null);
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    }
  };

  const xuLyQuyenQuanTri = async (nd: HoSoNguoiDung) => {
    if (laEmailQuanTriGoc(nd.email)) {
      setLoi('Không thể gỡ quyền của Quản trị viên gốc.');
      return;
    }
    try {
      if (nd.laQuanTri) {
        await khoLuuTru.qtThuHoiQuyenQuanTri(nd);
        setDsNguoiDung((cu) =>
          cu.map((n) => (n.uid === nd.uid ? { ...n, laQuanTri: false } : n))
        );
        setThongBao(`Đã thu hồi quyền Quản trị viên của ${nd.daoHieu}.`);
      } else {
        await khoLuuTru.qtCapQuyenQuanTri(nd.uid, nd.daoHieu);
        setDsNguoiDung((cu) =>
          cu.map((n) => (n.uid === nd.uid ? { ...n, laQuanTri: true } : n))
        );
        setThongBao(`Đã cấp quyền Quản trị viên cho ${nd.daoHieu}.`);
      }
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    }
  };

  const xuLyCapThayThe = async () => {
    if (!ndThayThe) return;
    const kt = kiemTraTenDangNhap(tenDnThayThe);
    if (!kt.hopLe) {
      setLoi(kt.loi || 'Tên đăng nhập mới không hợp lệ.');
      return;
    }
    setLoi(null);
    try {
      const kq = await khoLuuTru.qtCapTaiKhoanThayThe(ndThayThe, kt.chuanHoa);
      setKetQuaThayThe({
        daoHieu: ndThayThe.daoHieu,
        tenDangNhap: kq.tenDangNhap,
        matKhauTam: kq.matKhauTam,
      });
      setNdThayThe(null);
      setTenDnThayThe('');
      void taiDuLieuChinh();
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    }
  };

  const xuLyTaoHangLoat = async () => {
    const pt = phanTichDanhSachHangLoat(vanBanHangLoat);
    if (pt.danhSach.length === 0) {
      setLoi('Danh sách trống hoặc sai định dạng (mỗi dòng: Đạo hiệu, Lớp).');
      return;
    }
    setLoi(
      pt.vuotGioiHan
        ? `Danh sách vượt quá ${SO_TAI_KHOAN_HANG_LOAT_TOI_DA} học sinh nên chỉ xử lý ${SO_TAI_KHOAN_HANG_LOAT_TOI_DA} dòng đầu tiên.`
        : null
    );
    setDangTaoHangLoat(true);
    setKetQuaHangLoat([]);
    setTienDoHangLoat({ xong: 0, tong: pt.danhSach.length });
    try {
      const kq = await khoLuuTru.qtTaoTaiKhoanHangLoat(
        pt.danhSach,
        (xong, tong, mucMoi) => {
          setTienDoHangLoat({ xong, tong });
          setKetQuaHangLoat((cu) => [...cu, mucMoi]);
        }
      );
      setKetQuaHangLoat(kq);
      const soOk = kq.filter((k) => k.thanhCong).length;
      setThongBao(
        `Hoàn tất tạo hàng loạt: ${soOk}/${kq.length} tài khoản thành công. Hãy tải tệp CSV hoặc in thẻ ngay vì mật khẩu tạm chỉ hiện 1 lần.`
      );
      void taiDuLieuChinh();
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    } finally {
      setDangTaoHangLoat(false);
    }
  };

  const taiCsvHangLoat = () => {
    const csv = taoChuoiCsvUtf8Bom(
      ['STT', 'Đạo hiệu', 'Lớp', 'Tên đăng nhập', 'Mật khẩu tạm (đổi khi đăng nhập)', 'Trạng thái'],
      ketQuaHangLoat.map((k) => [
        k.stt,
        k.daoHieu,
        k.lop,
        k.tenDangNhap,
        k.thanhCong ? k.matKhauTam : '',
        k.thanhCong ? 'Thành công' : k.loi || 'Thất bại',
      ])
    );
    taiXuongTep(
      `tai-khoan-hoc-sinh-${new Date().toISOString().slice(0, 10)}.csv`,
      csv,
      'text/csv;charset=utf-8'
    );
  };

  const xuatBaoCaoLopCsv = () => {
    const csv = taoChuoiCsvUtf8Bom(
      [
        'Đạo hiệu',
        'Tên đăng nhập',
        'Lớp',
        'Cảnh giới hiện tại',
        'Tổng sao (/72)',
        'Số câu đúng',
        'Tổng câu làm',
        'Tỷ lệ đúng (%)',
        'Số lượt chơi',
        'Hoạt động gần nhất',
        'Trạng thái',
      ],
      dsNguoiDungLoc.map((nd) => {
        const tong = nd.tomTat?.tongCauLam || 0;
        const dung = nd.tomTat?.tongCauDung || 0;
        const tiLe = tong > 0 ? Math.round((dung / tong) * 100) : 0;
        return [
          nd.daoHieu,
          nd.tenDangNhap || nd.email || '',
          nd.lop || '',
          layThongTinCanhGioi(nd.tomTat?.canhGioiHienTai || 'luyenKhi').ten,
          nd.tomTat?.tongSao || 0,
          dung,
          tong,
          tiLe,
          nd.tomTat?.soLuotChoi || 0,
          dinhDangThoiGian(nd.tomTat?.hoatDongCuoi || nd.dangNhapCuoi),
          nd.biKhoa ? 'Đang tạm khóa' : 'Hoạt động',
        ];
      })
    );
    taiXuongTep(
      `bao-cao-tien-do-lop-${new Date().toISOString().slice(0, 10)}.csv`,
      csv,
      'text/csv;charset=utf-8'
    );
    setThongBao('Đã tải báo cáo tiến độ lớp dạng tệp CSV (mở trực tiếp bằng Excel có đủ dấu tiếng Việt).');
  };

  const xuatBaoCaoCauHoiCsv = () => {
    const demCau = new Map<string, { lam: number; dung: number; tongGiay: number }>();
    for (const luot of dsKetQuaLuot) {
      for (const ct of luot.chiTiet || []) {
        const cu = demCau.get(ct.ma) || { lam: 0, dung: 0, tongGiay: 0 };
        cu.lam += 1;
        if (ct.dung) cu.dung += 1;
        cu.tongGiay += ct.giay || 0;
        demCau.set(ct.ma, cu);
      }
    }
    const dong = Array.from(demCau.entries())
      .sort((a, b) => b[1].lam - a[1].lam)
      .map(([ma, tk]) => {
        const cau = nganHangCauHoi.find((c) => c.id === ma);
        const tiLeDung = tk.lam > 0 ? Math.round((tk.dung / tk.lam) * 100) : 0;
        const giayTb = tk.lam > 0 ? Math.round(tk.tongGiay / tk.lam) : 0;
        return [
          ma,
          cau ? layThongTinCanhGioi(cau.canhGioi).ten : '—',
          cau?.giaiDoan || '—',
          tk.lam,
          tk.dung,
          tk.lam - tk.dung,
          tiLeDung,
          giayTb,
        ];
      });

    const csv = taoChuoiCsvUtf8Bom(
      [
        'Mã câu hỏi',
        'Cảnh giới',
        'Giai đoạn',
        'Số lượt làm',
        'Số lượt đúng',
        'Số lượt sai',
        'Tỷ lệ đúng (%)',
        'Thời gian trung bình (giây)',
      ],
      dong
    );
    taiXuongTep(
      `thong-ke-cau-hoi-${new Date().toISOString().slice(0, 10)}.csv`,
      csv,
      'text/csv;charset=utf-8'
    );
    setThongBao('Đã tải báo cáo thống kê theo từng câu hỏi (CSV UTF-8).');
  };

  const luuCauHinh = async () => {
    setDangLuuCauHinh(true);
    setLoi(null);
    try {
      await khoLuuTru.qtCapNhatCauHinhCongKhai({
        choPhepDangKy: formChoPhepDk,
        thongBao: formThongBao,
      });
      khiCapNhatCauHinh({
        choPhepDangKy: formChoPhepDk,
        thongBao: formThongBao.trim(),
        thongBaoLuc: Date.now(),
      });
      setThongBao('Đã lưu cấu hình và phát Thiên Cơ Truyền Âm tới toàn môn phái.');
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    } finally {
      setDangLuuCauHinh(false);
    }
  };

  const danhSachCauLoc = useMemo(() => {
    return nganHangCauHoi.filter((c) => {
      if (locCanhGioi !== 'tatCa' && c.canhGioi !== locCanhGioi) return false;
      if (chiCanDuyet && !c.canDuyet) return false;
      return true;
    });
  }, [nganHangCauHoi, locCanhGioi, chiCanDuyet]);

  const luuCauHoiDamMay = async () => {
    if (!fDeBai.trim() || !fLoiGiai.trim() || fLuaChon.some((l) => !l.trim())) {
      setLoi('Vui lòng nhập đầy đủ đề bài, 4 phương án và lời giải.');
      return;
    }
    const cauMoi: CauHoiTuyChinhDamMay = {
      id: dangSuaCauId || `qt_${Date.now()}`,
      canhGioi: fCanhGioi,
      giaiDoan: fGiaiDoan,
      dang: 'tracNghiem',
      deBai: fDeBai.trim(),
      luaChon: fLuaChon.map((s) => s.trim()),
      dapAn: fDapAn,
      loiGiai: fLoiGiai.trim(),
      goiY: fGoiY.trim() || 'Áp dụng công thức lượng giác hoặc hệ thức lượng thích hợp.',
      nguon: 'Quản trị viên biên soạn',
      canDuyet: false,
      daAn: false,
    };
    try {
      await khoLuuTru.qtLuuCauHoiTuyChinh(cauMoi);
      await khiCapNhatNganHangDamMay();
      setThongBao(`Đã lưu câu hỏi ${cauMoi.id} lên đám mây (áp dụng cho mọi học sinh).`);
      setDangSuaCauId(null);
      setFDeBai('');
      setFLuaChon(['', '', '', '']);
      setFLoiGiai('');
      setFGoiY('');
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    }
  };

  const duyetHoacAnCauHoi = async (cau: CauHoi, capNhat: Partial<CauHoiTuyChinhDamMay>) => {
    try {
      await khoLuuTru.qtLuuCauHoiTuyChinh({ ...cau, ...capNhat });
      await khiCapNhatNganHangDamMay();
      setThongBao(`Đã cập nhật câu hỏi ${cau.id} trên đám mây.`);
    } catch (err) {
      setLoi(doiMaLoiFirebase(err));
    }
  };

  const nhapJsonDamMay = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const kt = kiemTraHopLeNganHangCauHoi(parsed);
      if (!kt.hopLe) {
        setLoi(kt.loi || 'Tệp JSON không đúng định dạng.');
        return;
      }
      for (const c of kt.danhSach) {
        await khoLuuTru.qtLuuCauHoiTuyChinh(c);
      }
      await khiCapNhatNganHangDamMay();
      setThongBao(`Đã đồng bộ ${kt.danhSach.length} câu hỏi từ tệp JSON lên đám mây.`);
    } catch {
      setLoi('Không thể đọc tệp JSON.');
    } finally {
      e.target.value = '';
    }
  };

  const danhMucTab: { id: MucQuanTri; nhan: string }[] = [
    { id: 'tongQuan', nhan: 'Tổng quan' },
    { id: 'nguoiDung', nhan: `Người dùng (${dsNguoiDung.length})` },
    { id: 'taoHangLoat', nhan: 'Tạo hàng loạt' },
    { id: 'thongBao', nhan: 'Thông báo & cấu hình' },
    { id: 'nganHang', nhan: 'Ngân hàng câu hỏi' },
    { id: 'baoCao', nhan: 'Xuất báo cáo' },
    { id: 'nhatKy', nhan: 'Nhật ký quản trị' },
  ];

  const maxLuot14Ngay = Math.max(1, ...thongKe.luot14Ngay.map((d) => d.soLuot));

  return (
    <div className="max-w-6xl mx-auto px-4 py-5 pb-28 md:pb-12 space-y-5">
      {/* Tieu de & Nut quay lai */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <div>
          <div className="dau-an-trang-tri text-xs font-bold uppercase text-[#E4BC5A]">
            Thiên Cơ Các · Khu Vực Quản Trị Viên
          </div>
          <h1 className="tieu-de-vang text-2xl sm:text-3xl font-bold mt-0.5">
            Bảng Quản Trị Tu Toán Chứng Đạo
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <NutLenhBai
            type="button"
            kieu="tram"
            onClick={() => void taiDuLieuChinh()}
            disabled={dangTaiDuLieu}
          >
            {dangTaiDuLieu ? 'Đang làm mới...' : 'Làm mới dữ liệu'}
          </NutLenhBai>
          <NutLenhBai type="button" kieu="ngoc" onClick={khiQuayLai}>
            Quay lại trò chơi
          </NutLenhBai>
        </div>
      </div>

      {/* Ghi chu tham khao bat buoc */}
      <div className="rounded-xl border border-[#E4BC5A]/45 bg-[#141D33]/90 px-4 py-2.5 text-xs sm:text-sm text-[#F2D88B] no-print">
        Lưu ý sư phạm: <strong>Điểm trong game chỉ để tham khảo, không dùng làm điểm kiểm tra chính thức.</strong>
      </div>

      {thongBao && (
        <div className="rounded-xl border border-[#3FB59A]/60 bg-[#1E7F6B]/20 px-4 py-2.5 text-xs sm:text-sm text-[#62D1B5] flex items-center justify-between gap-2 no-print">
          <span>{thongBao}</span>
          <button
            type="button"
            onClick={() => setThongBao(null)}
            className="text-xs underline cursor-pointer"
          >
            Ẩn
          </button>
        </div>
      )}

      {loi && (
        <div className="rounded-xl border border-[#C8372D]/70 bg-[#C8372D]/18 px-4 py-2.5 text-xs sm:text-sm text-[#FFB4AD] flex items-center justify-between gap-2 no-print">
          <span>{loi}</span>
          <button
            type="button"
            onClick={() => setLoi(null)}
            className="text-xs underline cursor-pointer"
          >
            Ẩn
          </button>
        </div>
      )}

      {/* Thanh chuyen muc */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-[#070B14] border border-[#1F2A4D] no-print">
        {danhMucTab.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              boPhatAmThanh.phatAmNhanNut();
              setMuc(t.id);
              setLoi(null);
            }}
            className={`min-h-[38px] px-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              muc === t.id
                ? 'bg-[#141D33] text-[#F2D88B] border border-[#E4BC5A]/60'
                : 'text-[#9BA8BE] hover:text-[#DCE6EA]'
            }`}
          >
            {t.nhan}
          </button>
        ))}
      </div>

      {/* === 6.1 TONG QUAN === */}
      {muc === 'tongQuan' && (
        <div className="space-y-5 no-print">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="khung-ngoc-gian rounded-xl p-4">
              <div className="text-xs text-[#9BA8BE]">Tổng số tài khoản</div>
              <div className="text-2xl font-bold text-[#F2D88B] chu-so-bang mt-1">
                {thongKe.tongTaiKhoan}
              </div>
            </div>
            <div className="khung-ngoc-gian rounded-xl p-4">
              <div className="text-xs text-[#9BA8BE]">Hoạt động 7 ngày qua</div>
              <div className="text-2xl font-bold text-[#62D1B5] chu-so-bang mt-1">
                {thongKe.hoatDong7Ngay}
              </div>
            </div>
            <div className="khung-ngoc-gian rounded-xl p-4">
              <div className="text-xs text-[#9BA8BE]">Lượt chơi ghi nhận</div>
              <div className="text-2xl font-bold text-[#F6EEDB] chu-so-bang mt-1">
                {dsKetQuaLuot.length}
              </div>
            </div>
            <div className="khung-ngoc-gian rounded-xl p-4">
              <div className="text-xs text-[#9BA8BE]">Câu hỏi chờ duyệt</div>
              <div className="text-2xl font-bold text-[#F28A80] chu-so-bang mt-1">
                {nganHangCauHoi.filter((c) => c.canDuyet).length}
              </div>
            </div>
          </div>

          {/* Bieu do luot choi 14 ngay (SVG thuan) */}
          <section className="khung-ngoc-gian rounded-xl p-5 space-y-3">
            <h2 className="tieu-de-vang text-lg font-bold">
              Biểu Đồ Lượt Chơi 14 Ngày Gần Nhất
            </h2>
            <div className="overflow-x-auto">
              <svg
                viewBox="0 0 700 190"
                className="w-full min-w-[520px] h-48"
                role="img"
                aria-label="Biểu đồ số lượt chơi 14 ngày gần nhất"
              >
                <line x1="20" y1="150" x2="680" y2="150" stroke="#1F2A4D" strokeWidth="1.5" />
                {thongKe.luot14Ngay.map((ng, idx) => {
                  const x = 32 + idx * 46;
                  const chieuCao = Math.round((ng.soLuot / maxLuot14Ngay) * 115);
                  const y = 150 - chieuCao;
                  return (
                    <g key={ng.khoaNgay}>
                      <rect
                        x={x}
                        y={y}
                        width="28"
                        height={Math.max(3, chieuCao)}
                        rx="4"
                        fill={ng.soLuot > 0 ? '#3FB59A' : '#1F2A4D'}
                      />
                      <text
                        x={x + 14}
                        y={Math.max(16, y - 6)}
                        textAnchor="middle"
                        fill="#F2D88B"
                        fontSize="11"
                        fontWeight="700"
                      >
                        {ng.soLuot}
                      </text>
                      <text
                        x={x + 14}
                        y="170"
                        textAnchor="middle"
                        fill="#9BA8BE"
                        fontSize="10"
                      >
                        {ng.ngay}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </section>

          {/* Phan bo canh gioi + Ty le dung trung binh */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <section className="khung-ngoc-gian rounded-xl p-5 space-y-3">
              <h2 className="tieu-de-vang text-lg font-bold">
                Phân Bố Cảnh Giới & Tỷ Lệ Đúng Trung Bình
              </h2>
              <div className="space-y-2.5">
                {THU_TU_CANH_GIOI.map((cg) => {
                  const info = layThongTinCanhGioi(cg);
                  const soNguoi = thongKe.phanBoCanhGioi[cg] || 0;
                  const tiLeNguoi =
                    thongKe.tongTaiKhoan > 0
                      ? Math.round((soNguoi / thongKe.tongTaiKhoan) * 100)
                      : 0;
                  const tkDung = thongKe.tyLeDungTheoCanhGioi[cg];
                  return (
                    <div key={cg} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#F6EEDB]">
                          {info.thuTu}. {info.ten}
                        </span>
                        <span className="text-[#9BA8BE] chu-so-bang">
                          {soNguoi} học sinh ({tiLeNguoi}%) · Đúng TB:{' '}
                          <strong className="text-[#62D1B5]">
                            {tkDung.tong > 0 ? `${tkDung.phanTram}%` : '—'}
                          </strong>
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-[#070B14] border border-[#1F2A4D] overflow-hidden">
                        <div
                          className="h-full bg-[#E4BC5A]"
                          style={{ width: `${tiLeNguoi}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Top 10 cau sai nhieu nhat */}
            <section className="khung-ngoc-gian rounded-xl p-5 space-y-3">
              <h2 className="tieu-de-vang text-lg font-bold">
                Top 10 Câu Học Sinh Sai Nhiều Nhất (500 lượt gần nhất)
              </h2>
              {thongKe.top10CauSaiNhieu.length === 0 ? (
                <p className="text-xs text-[#9BA8BE]">
                  Chưa có dữ liệu câu sai nào trong 500 lượt chơi gần nhất.
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {thongKe.top10CauSaiNhieu.map((c, idx) => {
                    const cau = nganHangCauHoi.find((q) => q.id === c.ma);
                    return (
                      <div
                        key={c.ma}
                        className="rounded-lg border border-[#1F2A4D] bg-[#070B14]/80 p-2.5 text-xs flex items-start justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-[#F2D88B]">
                            #{idx + 1} · [{c.ma}]
                            {cau ? ` (${layThongTinCanhGioi(cau.canhGioi).ten})` : ''}
                          </div>
                          {cau && (
                            <div className="text-[#DCE6EA]/85 line-clamp-2 mt-0.5">
                              <CongThucToan noiDung={cau.deBai} />
                            </div>
                          )}
                        </div>
                        <div className="shrink-0 text-right chu-so-bang">
                          <div className="font-bold text-[#F28A80]">
                            Sai {c.tyLeSai}%
                          </div>
                          <div className="text-[11px] text-[#9BA8BE]">
                            {c.soLanSai}/{c.soLanLam} lượt
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      )}

      {/* === 6.2 QUAN LY NGUOI DUNG === */}
      {muc === 'nguoiDung' && (
        <div className="space-y-4 no-print">
          <div className="khung-ngoc-gian rounded-xl p-4 flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={tuKhoa}
              onChange={(e) => setTuKhoa(e.target.value)}
              placeholder="Tìm theo Đạo hiệu, tên đăng nhập, thư điện tử..."
              className="flex-1 min-w-[220px] min-h-[40px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] text-sm text-[#F6EEDB]"
            />
            <select
              value={locLop}
              onChange={(e) => setLocLop(e.target.value)}
              aria-label="Lọc theo lớp"
              className="min-h-[40px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] text-sm text-[#F6EEDB]"
            >
              <option value="tatCa">Tất cả lớp</option>
              {danhSachLop.map((l) => (
                <option key={l} value={l}>
                  Lớp {l}
                </option>
              ))}
            </select>
          </div>

          <div className="khung-ngoc-gian rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left border-collapse">
                <thead className="bg-[#070B14] text-[#9BA8BE] border-b border-[#1F2A4D]">
                  <tr>
                    <th className="py-2.5 px-3">Đạo hiệu / Tài khoản</th>
                    <th className="py-2.5 px-2">Lớp</th>
                    <th className="py-2.5 px-2">Cảnh giới</th>
                    <th className="py-2.5 px-2 text-center">Sao</th>
                    <th className="py-2.5 px-2 text-center">Đúng</th>
                    <th className="py-2.5 px-2">Trạng thái</th>
                    <th className="py-2.5 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {dsNguoiDungLoc.map((nd) => {
                    const tong = nd.tomTat?.tongCauLam || 0;
                    const dung = nd.tomTat?.tongCauDung || 0;
                    const tiLe = tong > 0 ? Math.round((dung / tong) * 100) : 0;
                    const laGoc = laEmailQuanTriGoc(nd.email);
                    return (
                      <tr
                        key={nd.uid}
                        className="border-b border-[#1F2A4D]/60 hover:bg-[#141D33]/40"
                      >
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-[#F2D88B] flex items-center gap-1.5">
                            <span>{nd.daoHieu}</span>
                            {nd.laQuanTri && (
                              <span className="px-1.5 py-0.5 rounded bg-[#8F1F1A] text-[10px] text-[#F2D88B]">
                                Quản trị viên
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#9BA8BE]">
                            {nd.tenDangNhap || nd.email || nd.uid.slice(0, 10)}
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-[#DCE6EA]">
                          {nd.lop || '—'}
                        </td>
                        <td className="py-2.5 px-2 text-[#62D1B5]">
                          {layThongTinCanhGioi(nd.tomTat?.canhGioiHienTai || 'luyenKhi').ten}
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-[#F2D88B] chu-so-bang">
                          {nd.tomTat?.tongSao || 0}/72
                        </td>
                        <td className="py-2.5 px-2 text-center chu-so-bang text-[#DCE6EA]">
                          {tiLe}%
                        </td>
                        <td className="py-2.5 px-2">
                          {nd.biKhoa ? (
                            <span className="text-[#F28A80] font-semibold">Đang khóa</span>
                          ) : (
                            <span className="text-[#62D1B5]">Hoạt động</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex flex-wrap justify-end gap-1.5 text-[11px]">
                            <button
                              type="button"
                              onClick={() => void moChiTietNguoiDung(nd)}
                              className="px-2 py-1 rounded bg-[#141D33] border border-[#2C3B5E] text-[#62D1B5] hover:border-[#62D1B5] cursor-pointer"
                            >
                              Chi tiết
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setNdSua(nd);
                                setSuaDaoHieu(nd.daoHieu);
                                setSuaLop(nd.lop || '');
                              }}
                              className="px-2 py-1 rounded bg-[#141D33] border border-[#2C3B5E] text-[#F2D88B] hover:border-[#E4BC5A] cursor-pointer"
                            >
                              Sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setNdThayThe(nd);
                                setTenDnThayThe(
                                  `${(nd.tenDangNhap || 'hs').slice(0, 14)}_moi`
                                );
                              }}
                              className="px-2 py-1 rounded bg-[#141D33] border border-[#2C3B5E] text-[#DCE6EA] hover:border-[#E4BC5A] cursor-pointer"
                            >
                              Cấp thay thế
                            </button>
                            {nd.biKhoa ? (
                              <button
                                type="button"
                                onClick={() => void xuLyMoKhoa(nd)}
                                className="px-2 py-1 rounded bg-[#1E7F6B]/30 border border-[#3FB59A] text-[#62D1B5] cursor-pointer"
                              >
                                Mở khóa
                              </button>
                            ) : (
                              !laGoc && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNdKhoa(nd);
                                    setLyDoKhoa('');
                                  }}
                                  className="px-2 py-1 rounded bg-[#8F1F1A]/30 border border-[#C8372D] text-[#FFB4AD] cursor-pointer"
                                >
                                  Khóa
                                </button>
                              )
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                setNdDatLai(nd);
                                setOXacNhanDatLai('');
                              }}
                              className="px-2 py-1 rounded bg-[#070B14] border border-[#C8372D]/60 text-[#F28A80] cursor-pointer"
                            >
                              Đặt lại
                            </button>
                            {!laGoc && (
                              <button
                                type="button"
                                onClick={() => void xuLyQuyenQuanTri(nd)}
                                className="px-2 py-1 rounded bg-[#070B14] border border-[#E4BC5A]/50 text-[#F2D88B] cursor-pointer"
                              >
                                {nd.laQuanTri ? 'Gỡ quản trị' : 'Cấp quản trị'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {dsNguoiDungLoc.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-6 text-center text-[#9BA8BE]">
                        Không tìm thấy tài khoản nào phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {conTrangTiep && (
              <div className="p-3 text-center border-t border-[#1F2A4D]">
                <NutLenhBai
                  type="button"
                  kieu="tram"
                  onClick={() => void taiThemNguoiDung()}
                  disabled={dangTaiDuLieu}
                >
                  Tải thêm 50 tài khoản
                </NutLenhBai>
              </div>
            )}
          </div>
        </div>
      )}

      {/* === 6.3 TAO TAI KHOAN HANG LOAT === */}
      {muc === 'taoHangLoat' && (
        <div className="space-y-4 no-print">
          <section className="khung-ngoc-gian rounded-xl p-5 space-y-4">
            <div>
              <h2 className="tieu-de-vang text-lg font-bold">
                Tạo Tài Khoản Hàng Loạt Cho Cả Lớp (tối đa {SO_TAI_KHOAN_HANG_LOAT_TOI_DA} học sinh/lần)
              </h2>
              <p className="text-xs text-[#9BA8BE] mt-1">
                Dán danh sách mỗi dòng theo dạng <strong>Đạo hiệu, Lớp</strong> (ví dụ: <em>Nguyễn Minh Anh, 10A1</em>) hoặc tải tệp CSV. Hệ thống tự tạo tên đăng nhập và mật khẩu tạm 8 ký tự dễ đọc (bắt buộc đổi khi đăng nhập lần đầu), đồng thời giữ nguyên phiên Quản trị viên của bạn.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="lenh-bai-vat min-h-[40px] px-4 py-2 bg-[#141D33] border border-[#E4BC5A]/45 text-xs sm:text-sm font-semibold text-[#F2D88B] cursor-pointer inline-flex items-center">
                Nạp tệp danh sách CSV
                <input
                  type="file"
                  accept=".csv,.txt,text/csv,text/plain"
                  className="hidden"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) setVanBanHangLoat(await f.text());
                    e.target.value = '';
                  }}
                />
              </label>
              <span className="text-xs text-[#9BA8BE]">
                Số dòng hợp lệ nhận diện:{' '}
                <strong className="text-[#62D1B5]">
                  {phanTichDanhSachHangLoat(vanBanHangLoat).danhSach.length}
                </strong>
                /{SO_TAI_KHOAN_HANG_LOAT_TOI_DA}
              </span>
            </div>

            <textarea
              rows={6}
              value={vanBanHangLoat}
              onChange={(e) => setVanBanHangLoat(e.target.value)}
              placeholder={'Nguyễn Minh Anh, 10A1\nTrần Gia Huy, 10A1\nLê Bảo Ngọc, 10A2'}
              className="w-full p-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] text-sm text-[#F6EEDB] font-mono"
            />

            <div className="flex flex-wrap items-center gap-3">
              <NutLenhBai
                type="button"
                kieu="vang"
                disabled={dangTaoHangLoat}
                onClick={() => void xuLyTaoHangLoat()}
              >
                {dangTaoHangLoat
                  ? `Đang tạo ${tienDoHangLoat.xong}/${tienDoHangLoat.tong} tài khoản...`
                  : 'Bắt đầu tạo tài khoản'}
              </NutLenhBai>

              {ketQuaHangLoat.length > 0 && (
                <>
                  <NutLenhBai type="button" kieu="ngoc" onClick={taiCsvHangLoat}>
                    Tải bảng tài khoản (CSV)
                  </NutLenhBai>
                  <NutLenhBai
                    type="button"
                    kieu="tram"
                    onClick={() => setHienKhungInThe(true)}
                  >
                    In thẻ cắt phát cho học sinh
                  </NutLenhBai>
                </>
              )}
            </div>

            {ketQuaHangLoat.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="rounded-lg border border-[#E4BC5A]/50 bg-[#E4BC5A]/12 p-2.5 text-xs text-[#F2D88B]">
                  Lưu ý bảo mật: Mật khẩu tạm không được lưu trong cơ sở dữ liệu và chỉ hiển thị duy nhất lúc này. Hãy tải tệp CSV hoặc in thẻ phát cho học sinh trước khi rời trang.
                </div>
                <div className="overflow-x-auto max-h-72 overflow-y-auto border border-[#1F2A4D] rounded-xl">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="sticky top-0 bg-[#0D1424] text-[#9BA8BE]">
                      <tr className="border-b border-[#1F2A4D]">
                        <th className="py-2 px-2">STT</th>
                        <th className="py-2 px-2">Đạo hiệu</th>
                        <th className="py-2 px-2">Lớp</th>
                        <th className="py-2 px-2">Tên đăng nhập</th>
                        <th className="py-2 px-2">Mật khẩu tạm</th>
                        <th className="py-2 px-2">Kết quả</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ketQuaHangLoat.map((k) => (
                        <tr key={k.stt} className="border-b border-[#1F2A4D]/50">
                          <td className="py-1.5 px-2 chu-so-bang">{k.stt}</td>
                          <td className="py-1.5 px-2 font-semibold text-[#F6EEDB]">
                            {k.daoHieu}
                          </td>
                          <td className="py-1.5 px-2">{k.lop || '—'}</td>
                          <td className="py-1.5 px-2 font-mono text-[#62D1B5]">
                            {k.tenDangNhap}
                          </td>
                          <td className="py-1.5 px-2 font-mono font-bold text-[#F2D88B]">
                            {k.thanhCong ? k.matKhauTam : '—'}
                          </td>
                          <td className="py-1.5 px-2">
                            {k.thanhCong ? (
                              <span className="text-[#62D1B5]">Thành công</span>
                            ) : (
                              <span className="text-[#F28A80]">{k.loi}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* === 6.5 THONG BAO & CAU HINH === */}
      {muc === 'thongBao' && (
        <section className="khung-ngoc-gian rounded-xl p-5 space-y-5 no-print">
          <h2 className="tieu-de-vang text-lg font-bold">
            Thiên Cơ Truyền Âm & Cấu Hình Môn Phái
          </h2>

          <div className="flex items-center justify-between gap-4 py-3 border-b border-[#1F2A4D]">
            <div>
              <div className="text-sm font-bold text-[#F6EEDB]">
                Cho phép học sinh tự đăng ký mới
              </div>
              <div className="text-xs text-[#9BA8BE]">
                Khi tắt, chỉ Quản trị viên mới có thể tạo tài khoản mới qua mục “Tạo hàng loạt”.
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={formChoPhepDk}
              onClick={() => setFormChoPhepDk((v) => !v)}
              className={`min-w-[68px] min-h-[38px] px-3 rounded-lg border text-xs font-bold cursor-pointer ${
                formChoPhepDk
                  ? 'bg-[#1E7F6B] border-[#62D1B5] text-white'
                  : 'bg-[#070B14] border-[#2C3B5E] text-[#9BA8BE]'
              }`}
            >
              {formChoPhepDk ? 'Đang mở' : 'Đang đóng'}
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-[#F2D88B]">
              Nội dung Thiên Cơ Truyền Âm (hiện dải thông báo trên bản đồ Thiên Lộ Tu Vi)
            </label>
            <textarea
              rows={3}
              maxLength={500}
              value={formThongBao}
              onChange={(e) => setFormThongBao(e.target.value)}
              placeholder="Ví dụ: Tuần này lớp 10A1 hoàn thành cảnh giới Kim Đan trước thứ Sáu nhé! (Để trống để tắt thông báo)"
              className="w-full p-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] text-sm text-[#F6EEDB]"
            />
            <div className="text-xs text-[#9BA8BE] text-right chu-so-bang">
              {formThongBao.length}/500 ký tự
            </div>
          </div>

          <div className="flex justify-end">
            <NutLenhBai
              type="button"
              kieu="vang"
              disabled={dangLuuCauHinh}
              onClick={() => void luuCauHinh()}
            >
              {dangLuuCauHinh ? 'Đang lưu...' : 'Lưu cấu hình & phát thông báo'}
            </NutLenhBai>
          </div>
        </section>
      )}

      {/* === 6.6 NGAN HANG CAU HOI (DONG BO DAM MAY) === */}
      {muc === 'nganHang' && (
        <div className="space-y-5 no-print">
          <section className="khung-ngoc-gian rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="tieu-de-vang text-lg font-bold">
                  Ngân Hàng Câu Hỏi Đám Mây ({nganHangCauHoi.length} câu)
                </h2>
                <p className="text-xs text-[#9BA8BE]">
                  Mọi chỉnh sửa, duyệt hoặc ẩn câu hỏi ở đây sẽ lưu lên đám mây và áp dụng cho toàn bộ học sinh.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <NutLenhBai
                  type="button"
                  kieu="ngoc"
                  className="text-xs"
                  onClick={() =>
                    setKetQuaKiemTra(kiemTraToanVenNganHang(nganHangCauHoi))
                  }
                >
                  Kiểm tra ngân hàng
                </NutLenhBai>
                <NutLenhBai
                  type="button"
                  kieu="tram"
                  className="text-xs"
                  onClick={() => setMoBaoCaoPdf((v) => !v)}
                >
                  {moBaoCaoPdf ? 'Ẩn báo cáo 20 PDF' : 'Báo cáo 20 tệp PDF'}
                </NutLenhBai>
                <NutLenhBai
                  type="button"
                  kieu="tram"
                  className="text-xs"
                  onClick={() =>
                    taiXuongTep(
                      'ngan-hang-cau-hoi-tu-toan-chung-dao.json',
                      JSON.stringify(nganHangCauHoi, null, 2),
                      'application/json;charset=utf-8'
                    )
                  }
                >
                  Xuất JSON
                </NutLenhBai>
                <label className="lenh-bai-vat min-h-[40px] px-3 py-1.5 bg-[#141D33] border border-[#E4BC5A]/45 text-xs font-semibold text-[#F2D88B] cursor-pointer inline-flex items-center">
                  Nhập JSON
                  <input
                    type="file"
                    accept="application/json,.json"
                    onChange={nhapJsonDamMay}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {ketQuaKiemTra && (
              <div
                className={`rounded-xl border p-3 text-xs space-y-1 ${
                  ketQuaKiemTra.hopLe
                    ? 'border-[#62D1B5]/60 bg-[#1E7F6B]/15 text-[#DCE6EA]'
                    : 'border-[#C8372D] bg-[#C8372D]/15 text-[#FFB4AD]'
                }`}
              >
                <div className="font-bold text-sm text-[#F2D88B]">
                  {ketQuaKiemTra.hopLe
                    ? 'Kiểm tra toàn vẹn ngân hàng: ĐẠT CHUẨN ✓'
                    : 'Phát hiện lỗi toàn vẹn ngân hàng'}
                </div>
                <div>
                  Tổng số: {ketQuaKiemTra.tongCau} câu ({ketQuaKiemTra.soCauGoc} gốc +{' '}
                  {ketQuaKiemTra.soBienThe} biến thể) · Ít nhất mỗi ô 6×4:{' '}
                  {ketQuaKiemTra.minMoiO} câu.
                </div>
              </div>
            )}

            {moBaoCaoPdf && (
              <div className="overflow-x-auto max-h-60 overflow-y-auto border border-[#1F2A4D] rounded-xl">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead className="sticky top-0 bg-[#0D1424] text-[#9BA8BE]">
                    <tr className="border-b border-[#1F2A4D]">
                      <th className="py-1.5 px-2">Tệp nguồn</th>
                      <th className="py-1.5 px-2 text-center">Trang</th>
                      <th className="py-1.5 px-2 text-center">Số câu</th>
                      <th className="py-1.5 px-2">Ghi chú kiểm duyệt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BAO_CAO_NHAP_PDF.tepNguon.map((t) => (
                      <tr key={t.tenTep} className="border-b border-[#1F2A4D]/50">
                        <td className="py-1.5 px-2 font-medium text-[#F2D88B]">
                          {t.tenHienThi}
                        </td>
                        <td className="py-1.5 px-2 text-center chu-so-bang">
                          {t.trangDaDoc}/{t.tongTrang}
                        </td>
                        <td className="py-1.5 px-2 text-center chu-so-bang text-[#62D1B5]">
                          {t.soCauTrichXuat}
                        </td>
                        <td className="py-1.5 px-2 text-[#DCE6EA]/80">{t.ghiChu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Form them / sua cau hoi */}
            <div className="rounded-xl border border-[#E4BC5A]/30 bg-[#070B14]/80 p-4 space-y-3">
              <div className="text-sm font-bold text-[#F2D88B]">
                {dangSuaCauId ? `Đang sửa câu: ${dangSuaCauId}` : 'Thêm câu hỏi mới lên đám mây'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <select
                  value={fCanhGioi}
                  onChange={(e) => setFCanhGioi(e.target.value as MaCanhGioi)}
                  className="min-h-[38px] px-3 rounded-lg bg-[#0D1424] border border-[#1F2A4D] text-xs sm:text-sm text-[#DCE6EA]"
                >
                  {DANH_SACH_CANH_GIOI.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.ten} ({c.baiHoc})
                    </option>
                  ))}
                </select>
                <select
                  value={fGiaiDoan}
                  onChange={(e) => setFGiaiDoan(e.target.value as MaGiaiDoan)}
                  className="min-h-[38px] px-3 rounded-lg bg-[#0D1424] border border-[#1F2A4D] text-xs sm:text-sm text-[#DCE6EA]"
                >
                  {THU_TU_GIAI_DOAN.map((gd) => (
                    <option key={gd} value={gd}>
                      {{
                        soKy: 'Sơ kỳ',
                        trungKy: 'Trung kỳ',
                        hauKy: 'Hậu kỳ',
                        dinhPhong: 'Đỉnh phong',
                      }[gd]}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                rows={2}
                value={fDeBai}
                onChange={(e) => setFDeBai(e.target.value)}
                placeholder="Nhập đề bài (hỗ trợ công thức $...$)"
                className="w-full p-2.5 rounded-lg bg-[#0D1424] border border-[#1F2A4D] text-sm text-[#DCE6EA]"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {fLuaChon.map((lc, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="dapAnQt"
                      checked={fDapAn === idx}
                      onChange={() => setFDapAn(idx)}
                    />
                    <input
                      type="text"
                      value={lc}
                      onChange={(e) => {
                        const moi = [...fLuaChon];
                        moi[idx] = e.target.value;
                        setFLuaChon(moi);
                      }}
                      placeholder={`Phương án ${['A', 'B', 'C', 'D'][idx]}`}
                      className="flex-1 min-h-[36px] px-2.5 rounded-lg bg-[#0D1424] border border-[#1F2A4D] text-xs text-[#DCE6EA]"
                    />
                  </div>
                ))}
              </div>
              <textarea
                rows={2}
                value={fLoiGiai}
                onChange={(e) => setFLoiGiai(e.target.value)}
                placeholder="Lời giải chi tiết..."
                className="w-full p-2.5 rounded-lg bg-[#0D1424] border border-[#1F2A4D] text-sm text-[#DCE6EA]"
              />
              <input
                type="text"
                value={fGoiY}
                onChange={(e) => setFGoiY(e.target.value)}
                placeholder="Gợi ý ngắn..."
                className="w-full min-h-[36px] px-2.5 rounded-lg bg-[#0D1424] border border-[#1F2A4D] text-sm text-[#DCE6EA]"
              />
              <div className="flex gap-2">
                <NutLenhBai type="button" kieu="ngoc" onClick={() => void luuCauHoiDamMay()}>
                  {dangSuaCauId ? 'Lưu chỉnh sửa lên đám mây' : 'Thêm câu hỏi lên đám mây'}
                </NutLenhBai>
                {dangSuaCauId && (
                  <NutLenhBai
                    type="button"
                    kieu="tram"
                    onClick={() => setDangSuaCauId(null)}
                  >
                    Hủy sửa
                  </NutLenhBai>
                )}
              </div>
            </div>

            {/* Loc & danh sach cau hoi */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <select
                value={locCanhGioi}
                onChange={(e) => setLocCanhGioi(e.target.value as 'tatCa' | MaCanhGioi)}
                className="min-h-[38px] px-3 rounded-lg bg-[#070B14] border border-[#1F2A4D] text-xs sm:text-sm text-[#DCE6EA]"
              >
                <option value="tatCa">Tất cả cảnh giới</option>
                {DANH_SACH_CANH_GIOI.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.ten}
                  </option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-xs text-[#F2D88B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={chiCanDuyet}
                  onChange={(e) => setChiCanDuyet(e.target.checked)}
                />
                <span>Chỉ hiện câu cần duyệt</span>
              </label>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
              {danhSachCauLoc.slice(0, 50).map((c) => (
                <div
                  key={c.id}
                  className={`rounded-lg border p-3 text-xs space-y-1.5 ${
                    c.daAn
                      ? 'border-[#C8372D]/50 bg-[#070B14]/45 opacity-60'
                      : 'border-[#1F2A4D] bg-[#070B14]/85'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-[#62D1B5]">
                      [{c.id}] · {layThongTinCanhGioi(c.canhGioi).ten} · {c.giaiDoan}
                      {c.canDuyet ? ' · Cần duyệt' : ''}
                      {c.daAn ? ' · Đã ẩn' : ''}
                    </span>
                    <div className="flex gap-2">
                      {c.canDuyet && (
                        <button
                          type="button"
                          onClick={() => void duyetHoacAnCauHoi(c, { canDuyet: false })}
                          className="text-[#62D1B5] hover:underline cursor-pointer"
                        >
                          Duyệt
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setDangSuaCauId(c.id);
                          setFCanhGioi(c.canhGioi);
                          setFGiaiDoan(c.giaiDoan);
                          setFDeBai(c.deBai);
                          setFLuaChon(
                            c.luaChon && c.luaChon.length === 4
                              ? [...c.luaChon]
                              : ['A', 'B', 'C', 'D']
                          );
                          setFDapAn(Number(c.dapAn) || 0);
                          setFLoiGiai(c.loiGiai);
                          setFGoiY(c.goiY);
                        }}
                        className="text-[#F2D88B] hover:underline cursor-pointer"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => void duyetHoacAnCauHoi(c, { daAn: !c.daAn })}
                        className="text-[#F28A80] hover:underline cursor-pointer"
                      >
                        {c.daAn ? 'Hiện lại' : 'Ẩn câu'}
                      </button>
                    </div>
                  </div>
                  <div className="text-[#DCE6EA]">
                    <CongThucToan noiDung={c.deBai} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* === 6.7 XUAT BAO CAO === */}
      {muc === 'baoCao' && (
        <section className="khung-ngoc-gian rounded-xl p-5 space-y-4 no-print">
          <h2 className="tieu-de-vang text-lg font-bold">
            Xuất Báo Cáo Học Tập (Tệp CSV UTF-8 BOM cho Excel)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#1F2A4D] bg-[#070B14]/85 p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#F2D88B]">
                1. Báo cáo tiến độ theo lớp
              </h3>
              <p className="text-xs text-[#9BA8BE]">
                Gồm Đạo hiệu, tên đăng nhập, lớp, cảnh giới hiện tại, tổng sao, số câu đúng/tổng làm, tỷ lệ đúng và hoạt động gần nhất. Đang lọc: {locLop === 'tatCa' ? 'Tất cả lớp' : `Lớp ${locLop}`} ({dsNguoiDungLoc.length} học sinh).
              </p>
              <NutLenhBai type="button" kieu="vang" onClick={xuatBaoCaoLopCsv}>
                Tải báo cáo tiến độ lớp (CSV)
              </NutLenhBai>
            </div>

            <div className="rounded-xl border border-[#1F2A4D] bg-[#070B14]/85 p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#F2D88B]">
                2. Báo cáo thống kê theo từng câu hỏi
              </h3>
              <p className="text-xs text-[#9BA8BE]">
                Tổng hợp từ {dsKetQuaLuot.length} lượt chơi gần nhất: số lượt làm, số lượt đúng/sai, tỷ lệ đúng và thời gian làm trung bình của từng câu hỏi.
              </p>
              <NutLenhBai type="button" kieu="ngoc" onClick={xuatBaoCaoCauHoiCsv}>
                Tải thống kê câu hỏi (CSV)
              </NutLenhBai>
            </div>
          </div>
        </section>
      )}

      {/* === 6.8 NHAT KY QUAN TRI === */}
      {muc === 'nhatKy' && (
        <section className="khung-ngoc-gian rounded-xl p-5 space-y-3 no-print">
          <h2 className="tieu-de-vang text-lg font-bold">
            Nhật Ký Quản Trị (Chỉ đọc · Không thể sửa hoặc xóa)
          </h2>
          <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="sticky top-0 bg-[#0D1424] text-[#9BA8BE]">
                <tr className="border-b border-[#1F2A4D]">
                  <th className="py-2 px-2">Thời gian</th>
                  <th className="py-2 px-2">Hành động</th>
                  <th className="py-2 px-2">Đối tượng</th>
                  <th className="py-2 px-2">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {dsNhatKy.map((nk) => (
                  <tr key={nk.id} className="border-b border-[#1F2A4D]/50">
                    <td className="py-2 px-2 whitespace-nowrap chu-so-bang text-[#9BA8BE]">
                      {dinhDangThoiGian(nk.luc)}
                    </td>
                    <td className="py-2 px-2 font-semibold text-[#F2D88B]">
                      {nk.hanhDong}
                    </td>
                    <td className="py-2 px-2 font-mono text-[#62D1B5]">
                      {nk.doiTuong}
                    </td>
                    <td className="py-2 px-2 text-[#DCE6EA]">{nk.chiTiet}</td>
                  </tr>
                ))}
                {dsNhatKy.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-[#9BA8BE]">
                      Chưa có nhật ký quản trị nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* === HOP THOAI CHI TIET NGUOI DUNG === */}
      {ndDangXem && (
        <div
          className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 no-print"
          onClick={() => setNdDangXem(null)}
        >
          <div
            className="w-full max-w-2xl khung-ngoc-gian rounded-2xl p-5 space-y-4 max-h-[88dvh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="tieu-de-vang text-xl font-bold">
                  Hồ Sơ: {ndDangXem.daoHieu}
                </h3>
                <p className="text-xs text-[#9BA8BE]">
                  {ndDangXem.tenDangNhap || ndDangXem.email} · Lớp: {ndDangXem.lop || 'Chưa có'} · Tổng sao: {ndDangXem.tomTat?.tongSao || 0}/72
                </p>
              </div>
              <div className="flex gap-2">
                {chiTietNd && (
                  <button
                    type="button"
                    onClick={() =>
                      taiXuongTep(
                        `ho-so-${ndDangXem.tenDangNhap || ndDangXem.uid.slice(0, 8)}.json`,
                        JSON.stringify({ hoSo: ndDangXem, ...chiTietNd }, null, 2),
                        'application/json;charset=utf-8'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg border border-[#E4BC5A]/50 text-xs text-[#F2D88B] cursor-pointer"
                  >
                    Xuất JSON
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setNdDangXem(null)}
                  className="px-2.5 py-1 rounded-lg border border-[#1F2A4D] text-xs text-[#9BA8BE] cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>

            {dangTaiChiTiet ? (
              <p className="text-xs text-[#62D1B5]">Đang tải tiến trình và lịch sử lượt chơi...</p>
            ) : chiTietNd ? (
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-[#F2D88B] mb-2">
                    Tiến độ 6 cảnh giới × 4 giai đoạn
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {THU_TU_CANH_GIOI.map((cg) => {
                      const info = layThongTinCanhGioi(cg);
                      const tongSaoCg = THU_TU_GIAI_DOAN.reduce(
                        (s, gd) =>
                          s +
                          (chiTietNd.tienTrinh.tienDoGiaiDoan[khoaGiaiDoan(cg, gd)]?.soSao ||
                            0),
                        0
                      );
                      return (
                        <div
                          key={cg}
                          className="rounded-lg border border-[#1F2A4D] bg-[#070B14]/80 p-2.5 text-xs"
                        >
                          <div className="font-bold text-[#F6EEDB]">{info.ten}</div>
                          <div className="text-[#F2D88B] chu-so-bang">{tongSaoCg}/12 sao</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-[#F2D88B] mb-2">
                    20 lượt chơi gần nhất ({chiTietNd.luotGanDay.length})
                  </div>
                  {chiTietNd.luotGanDay.length === 0 ? (
                    <p className="text-xs text-[#9BA8BE]">Chưa có lượt chơi nào.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-56 overflow-y-auto">
                      {chiTietNd.luotGanDay.map((l) => (
                        <div
                          key={l.maLuot}
                          className="rounded-lg border border-[#1F2A4D] bg-[#070B14]/75 px-3 py-2 text-xs flex items-center justify-between gap-2"
                        >
                          <div>
                            <strong className="text-[#F2D88B]">
                              {layThongTinCanhGioi(l.canhGioi).ten}
                            </strong>{' '}
                            · {l.giaiDoan} ({l.cheDo})
                            <span className="text-[#9BA8BE] ml-2">
                              {dinhDangThoiGian(l.taoLuc)}
                            </span>
                          </div>
                          <div className="chu-so-bang text-[#62D1B5] font-semibold">
                            {l.soCauDung}/{l.soCau} đúng · {l.sao} sao
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* === HOP THOAI KHOA TAI KHOAN === */}
      {ndKhoa && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 no-print">
          <div className="w-full max-w-md khung-ngoc-gian rounded-2xl p-5 space-y-3 border-[#C8372D]">
            <h3 className="tieu-de-vang text-lg font-bold">
              Tạm khóa tài khoản: {ndKhoa.daoHieu}
            </h3>
            <input
              type="text"
              value={lyDoKhoa}
              onChange={(e) => setLyDoKhoa(e.target.value)}
              placeholder="Nhập lý do tạm khóa..."
              className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] text-sm text-[#F6EEDB]"
            />
            <div className="flex justify-end gap-2">
              <NutLenhBai type="button" kieu="tram" onClick={() => setNdKhoa(null)}>
                Hủy
              </NutLenhBai>
              <NutLenhBai type="button" kieu="chuSa" onClick={() => void xuLyKhoaTaiKhoan()}>
                Xác nhận khóa
              </NutLenhBai>
            </div>
          </div>
        </div>
      )}

      {/* === HOP THOAI DAT LAI TIEN TRINH === */}
      {ndDatLai && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 no-print">
          <div className="w-full max-w-md khung-ngoc-gian rounded-2xl p-5 space-y-3 border-[#C8372D]">
            <h3 className="tieu-de-vang text-lg font-bold">
              Đặt lại tiến trình của {ndDatLai.daoHieu}
            </h3>
            <p className="text-xs text-[#DCE6EA]/85">
              Hệ thống sẽ tự tải tệp sao lưu JSON trước khi đưa toàn bộ cảnh giới, sao và túi đồ về ban đầu. Gõ lại{' '}
              <strong className="text-[#F2D88B]">
                {ndDatLai.tenDangNhap || ndDatLai.daoHieu}
              </strong>{' '}
              để xác nhận:
            </p>
            <input
              type="text"
              value={oXacNhanDatLai}
              onChange={(e) => setOXacNhanDatLai(e.target.value)}
              className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#C8372D]/60 text-sm text-[#F6EEDB]"
            />
            <div className="flex justify-end gap-2">
              <NutLenhBai type="button" kieu="tram" onClick={() => setNdDatLai(null)}>
                Hủy
              </NutLenhBai>
              <NutLenhBai
                type="button"
                kieu="chuSa"
                onClick={() => void xuLyDatLaiTienTrinh()}
              >
                Sao lưu & Đặt lại
              </NutLenhBai>
            </div>
          </div>
        </div>
      )}

      {/* === HOP THOAI SUA DAO HIEU / LOP === */}
      {ndSua && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 no-print">
          <div className="w-full max-w-md khung-ngoc-gian rounded-2xl p-5 space-y-3">
            <h3 className="tieu-de-vang text-lg font-bold">
              Chỉnh sửa thông tin học sinh
            </h3>
            <input
              type="text"
              value={suaDaoHieu}
              onChange={(e) => setSuaDaoHieu(e.target.value)}
              placeholder="Đạo hiệu"
              className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] text-sm text-[#F6EEDB]"
            />
            <input
              type="text"
              value={suaLop}
              onChange={(e) => setSuaLop(e.target.value)}
              placeholder="Lớp (ví dụ: 10A1)"
              className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] text-sm text-[#F6EEDB]"
            />
            <div className="flex justify-end gap-2">
              <NutLenhBai type="button" kieu="tram" onClick={() => setNdSua(null)}>
                Hủy
              </NutLenhBai>
              <NutLenhBai type="button" kieu="ngoc" onClick={() => void xuLySuaNguoiDung()}>
                Lưu thay đổi
              </NutLenhBai>
            </div>
          </div>
        </div>
      )}

      {/* === HOP THOAI CAP TAI KHOAN THAY THE (6.4) === */}
      {ndThayThe && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 no-print">
          <div className="w-full max-w-md khung-ngoc-gian rounded-2xl p-5 space-y-3">
            <h3 className="tieu-de-vang text-lg font-bold">
              Cấp tài khoản thay thế cho {ndThayThe.daoHieu}
            </h3>
            <p className="text-xs text-[#DCE6EA]/85 leading-relaxed">
              Dành cho học sinh quên mật khẩu và không có thư điện tử thật. Hệ thống sẽ tạo tài khoản mới, chép toàn bộ tiến trình từ tài khoản cũ sang và tự động khóa tài khoản cũ.
            </p>
            <input
              type="text"
              value={tenDnThayThe}
              onChange={(e) => setTenDnThayThe(e.target.value)}
              placeholder="Tên đăng nhập mới (4–20 ký tự)"
              className="w-full min-h-[42px] px-3 rounded-xl bg-[#070B14] border border-[#2C3B5E] text-sm text-[#F6EEDB]"
            />
            <div className="flex justify-end gap-2">
              <NutLenhBai type="button" kieu="tram" onClick={() => setNdThayThe(null)}>
                Hủy
              </NutLenhBai>
              <NutLenhBai type="button" kieu="vang" onClick={() => void xuLyCapThayThe()}>
                Tạo & chuyển tiến trình
              </NutLenhBai>
            </div>
          </div>
        </div>
      )}

      {/* Ket qua cap tai khoan thay the (hien 1 lan) */}
      {ketQuaThayThe && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 no-print">
          <div className="w-full max-w-md khung-ngoc-gian rounded-2xl p-5 space-y-3 border-[#E4BC5A]">
            <h3 className="tieu-de-vang text-xl font-bold">
              Đã cấp tài khoản thay thế!
            </h3>
            <p className="text-xs text-[#9BA8BE]">
              Gửi thông tin sau cho học sinh <strong>{ketQuaThayThe.daoHieu}</strong> (mật khẩu tạm chỉ hiển thị một lần duy nhất và học sinh sẽ phải đổi ngay khi đăng nhập):
            </p>
            <div className="rounded-xl border border-[#3FB59A]/50 bg-[#070B14] p-3.5 space-y-1.5 text-sm font-mono">
              <div>
                Tên đăng nhập:{' '}
                <strong className="text-[#62D1B5]">{ketQuaThayThe.tenDangNhap}</strong>
              </div>
              <div>
                Mật khẩu tạm:{' '}
                <strong className="text-[#F2D88B]">{ketQuaThayThe.matKhauTam}</strong>
              </div>
            </div>
            <div className="flex justify-end">
              <NutLenhBai
                type="button"
                kieu="ngoc"
                onClick={() => setKetQuaThayThe(null)}
              >
                Đã ghi nhận
              </NutLenhBai>
            </div>
          </div>
        </div>
      )}

      {/* === KHUNG IN THE CAT PHAT CHO HOC SINH (KHONG DUNG window.open) === */}
      {hienKhungInThe && (
        <div className="fixed inset-0 z-50 bg-[#070B14]/95 overflow-y-auto p-4 print-only-container">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between gap-3 no-print">
              <div>
                <h3 className="tieu-de-vang text-xl font-bold">
                  Xem trước thẻ tài khoản học sinh (cắt phát từng em)
                </h3>
                <p className="text-xs text-[#9BA8BE]">
                  Bấm “In trang thẻ” để in trực tiếp ra giấy A4 hoặc lưu tệp PDF.
                </p>
              </div>
              <div className="flex gap-2">
                <NutLenhBai
                  type="button"
                  kieu="tram"
                  onClick={() => setHienKhungInThe(false)}
                >
                  Đóng
                </NutLenhBai>
                <NutLenhBai
                  type="button"
                  kieu="vang"
                  onClick={() => window.print()}
                >
                  In trang thẻ
                </NutLenhBai>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white text-[#1a1a1a] p-4 rounded-xl">
              {ketQuaHangLoat
                .filter((k) => k.thanhCong)
                .map((k) => (
                  <div
                    key={k.stt}
                    className="border-2 border-dashed border-[#666] rounded-lg p-3.5 space-y-1 break-inside-avoid"
                  >
                    <div className="text-xs font-bold uppercase tracking-wide text-[#8F1F1A]">
                      Tu Toán Chứng Đạo · Thẻ Nhập Môn
                    </div>
                    <div className="text-sm font-bold">
                      Học sinh: {k.daoHieu} {k.lop ? `(${k.lop})` : ''}
                    </div>
                    <div className="text-xs font-mono">
                      Tên đăng nhập: <strong>{k.tenDangNhap}</strong>
                    </div>
                    <div className="text-xs font-mono">
                      Mật khẩu tạm: <strong>{k.matKhauTam}</strong>
                    </div>
                    <div className="text-[11px] text-[#444] pt-1">
                      Hãy đổi mật khẩu ngay trong lần đăng nhập đầu tiên.
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
