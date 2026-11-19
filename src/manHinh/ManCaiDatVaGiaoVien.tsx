import React, { useMemo, useState } from 'react';
import { boPhatAmThanh } from '../amThanh/boPhatAmThanh';
import { DANH_SACH_CANH_GIOI } from '../duLieu/canhGioi';
import {
  CaiDatTroChoi,
  CauHoi,
  MaCanhGioi,
  MaGiaiDoan,
  TienTrinhNguoiChoi,
} from '../kieuDuLieu/troChoi';
import { BAO_CAO_NHAP_PDF } from '../duLieu/nganHang/baoCaoNhap';
import { kiemTraHopLeNganHangCauHoi } from '../logic/luuTru';
import {
  BaoCaoToanVenNganHang,
  kiemTraToanVenNganHang,
} from '../logic/mauCauHoi';
import { THU_TU_CANH_GIOI, THU_TU_GIAI_DOAN } from '../logic/tienTrinh';
import { CongThucToan } from '../thanhPhan/CongThucToan';
import { NutLenhBai } from '../thanhPhan/KhungGiaoDien';

export const ManCaiDatVaGiaoVien: React.FC<{
  tienTrinh: TienTrinhNguoiChoi;
  nganHangCauHoi: CauHoi[];
  khiDoiCaiDat: (moi: CaiDatTroChoi) => void;
  khiDatLaiTienTrinh: () => void;
  khiDatLaiLichSuCauHoi?: () => void;
  khiThemCauHoi: (ds: CauHoi[]) => void;
  khiSuaCauHoi: (cau: CauHoi) => void;
  khiXoaCauHoiCustom: (id: string) => void;
  laQuanTri?: boolean;
  laKhach?: boolean;
  khiMoBangQuanTri?: () => void;
}> = ({
  tienTrinh,
  nganHangCauHoi,
  khiDoiCaiDat,
  khiDatLaiTienTrinh,
  khiDatLaiLichSuCauHoi,
  khiThemCauHoi,
  khiSuaCauHoi,
  khiXoaCauHoiCustom,
  laQuanTri = false,
  laKhach = true,
  khiMoBangQuanTri,
}) => {
  const [xacNhanDatLai, setXacNhanDatLai] = useState(false);
  const [moGiaoVien, setMoGiaoVien] = useState(false);
  const [moBaoCaoPdf, setMoBaoCaoPdf] = useState(false);
  const [locCanhGioi, setLocCanhGioi] = useState<'tatCa' | MaCanhGioi>('tatCa');
  const [locNguonBienThe, setLocNguonBienThe] = useState<'tatCa' | 'goc' | 'bienThe'>('tatCa');
  const [chiCanDuyet, setChiCanDuyet] = useState(false);
  const [thongBaoGv, setThongBaoGv] = useState('');
  const [thongBaoLichSu, setThongBaoLichSu] = useState('');

  // Form tao / sua cau hoi
  const [dangSuaId, setDangSuaId] = useState<string | null>(null);
  const [formCanhGioi, setFormCanhGioi] = useState<MaCanhGioi>('luyenKhi');
  const [formGiaiDoan, setFormGiaiDoan] = useState<MaGiaiDoan>('soKy');
  const [formDeBai, setFormDeBai] = useState('');
  const [formLuaChon, setFormLuaChon] = useState(['', '', '', '']);
  const [formDapAn, setFormDapAn] = useState(0);
  const [formLoiGiai, setFormLoiGiai] = useState('');
  const [formGoiY, setFormGoiY] = useState('');

  // Gemini sinh cau hoi & Tu kiem tra ngan hang
  const [dangSinhGemini, setDangSinhGemini] = useState(false);
  const [ketQuaKiemTra, setKetQuaKiemTra] = useState<BaoCaoToanVenNganHang | null>(
    null
  );

  const danhSachLoc = useMemo(() => {
    return nganHangCauHoi.filter((c) => {
      if (locCanhGioi !== 'tatCa' && c.canhGioi !== locCanhGioi) return false;
      if (chiCanDuyet && !c.canDuyet) return false;
      if (locNguonBienThe === 'goc' && c.laBienThe) return false;
      if (locNguonBienThe === 'bienThe' && !c.laBienThe) return false;
      return true;
    });
  }, [nganHangCauHoi, locCanhGioi, chiCanDuyet, locNguonBienThe]);

  const thongKeNganHang = useMemo(() => {
    const tong = nganHangCauHoi.length;
    const bienThe = nganHangCauHoi.filter((c) => c.laBienThe).length;
    const gocPdf = tong - bienThe;
    const theoMucDo = {
      de: nganHangCauHoi.filter((c) => c.mucDo === 'de').length,
      trungBinh: nganHangCauHoi.filter((c) => c.mucDo === 'trungBinh').length,
      kho: nganHangCauHoi.filter((c) => c.mucDo === 'kho').length,
      vanDungCao: nganHangCauHoi.filter((c) => c.mucDo === 'vanDungCao').length,
    };
    return { tong, bienThe, gocPdf, theoMucDo };
  }, [nganHangCauHoi]);

  const xuatJson = () => {
    const blob = new Blob([JSON.stringify(nganHangCauHoi, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ngan-hang-cau-hoi-tu-toan-chung-dao.json';
    a.click();
    URL.revokeObjectURL(url);
    setThongBaoGv('Đã xuất tệp JSON toàn bộ ngân hàng câu hỏi.');
  };

  const nhapJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const kiemTra = kiemTraHopLeNganHangCauHoi(parsed);
      if (!kiemTra.hopLe) {
        setThongBaoGv(kiemTra.loi || 'Tệp JSON không đúng định dạng.');
        return;
      }
      khiThemCauHoi(kiemTra.danhSach);
      setThongBaoGv(
        `Đã nhập thành công ${kiemTra.danhSach.length} câu hỏi hợp lệ.`
      );
    } catch {
      setThongBaoGv('Không thể đọc tệp JSON. Vui lòng kiểm tra lại cú pháp.');
    } finally {
      e.target.value = '';
    }
  };

  const luuCauHoiThuCong = () => {
    if (!formDeBai.trim() || !formLoiGiai.trim()) {
      setThongBaoGv('Vui lòng nhập đầy đủ đề bài và lời giải.');
      return;
    }
    if (formLuaChon.some((l) => !l.trim())) {
      setThongBaoGv('Vui lòng nhập đủ 4 phương án trả lời.');
      return;
    }
    const cauMoi: CauHoi = {
      id: dangSuaId || `gv_${Date.now()}`,
      canhGioi: formCanhGioi,
      giaiDoan: formGiaiDoan,
      dang: 'tracNghiem',
      deBai: formDeBai.trim(),
      luaChon: formLuaChon.map((s) => s.trim()),
      dapAn: formDapAn,
      loiGiai: formLoiGiai.trim(),
      goiY: formGoiY.trim() || 'Áp dụng công thức lượng giác hoặc hệ thức lượng thích hợp.',
      nguon: 'Thầy/Cô biên soạn',
      canDuyet: false,
    };

    if (dangSuaId) {
      khiSuaCauHoi(cauMoi);
      setThongBaoGv(`Đã cập nhật câu hỏi ${cauMoi.id}.`);
      setDangSuaId(null);
    } else {
      khiThemCauHoi([cauMoi]);
      const tenCg =
        DANH_SACH_CANH_GIOI.find((c) => c.id === formCanhGioi)?.ten ||
        formCanhGioi;
      setThongBaoGv(`Đã thêm câu hỏi mới vào cảnh giới ${tenCg}.`);
    }

    setFormDeBai('');
    setFormLuaChon(['', '', '', '']);
    setFormLoiGiai('');
    setFormGoiY('');
  };

  const batDauSua = (c: CauHoi) => {
    setDangSuaId(c.id);
    setFormCanhGioi(c.canhGioi);
    setFormGiaiDoan(c.giaiDoan);
    setFormDeBai(c.deBai);
    setFormLuaChon(
      c.luaChon && c.luaChon.length === 4
        ? [...c.luaChon]
        : ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D']
    );
    setFormDapAn(Number(c.dapAn) || 0);
    setFormLoiGiai(c.loiGiai);
    setFormGoiY(c.goiY);
  };

  const sinhThemBangGemini = async () => {
    if (!tienTrinh.caiDat.sinhDeMoiAI) {
      setThongBaoGv(
        'Vui lòng bật tùy chọn "Sinh đề mới từ nguồn" trước khi gọi Gemini.'
      );
      return;
    }
    setDangSinhGemini(true);
    setThongBaoGv('');
    try {
      const infoCg = DANH_SACH_CANH_GIOI.find((c) => c.id === formCanhGioi);
      const infoGd = infoCg?.giaiDoan.find((g) => g.ma === formGiaiDoan);
      const res = await fetch('/api/sinh-cau-hoi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          canhGioi: infoCg?.ten,
          giaiDoan: infoGd?.ten,
          chuDe: infoGd?.chuDe,
          soLuong: 3,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setThongBaoGv(data.loi || 'Không thể sinh câu hỏi từ Gemini.');
        return;
      }
      const danhSachMoi: CauHoi[] = (data.danhSach || []).map(
        (item: Partial<CauHoi>, idx: number) => ({
          id: `ai_${Date.now()}_${idx}`,
          canhGioi: formCanhGioi,
          giaiDoan: formGiaiDoan,
          dang: 'tracNghiem',
          deBai: item.deBai || '',
          luaChon: item.luaChon || ['A', 'B', 'C', 'D'],
          dapAn: Number(item.dapAn) || 0,
          loiGiai: item.loiGiai || '',
          goiY: item.goiY || '',
          nguon: {
            tep: 'AI sinh từ nguồn Chương III',
            soBai: `${infoCg?.ten || formCanhGioi} · ${infoGd?.ten || formGiaiDoan}`,
          },
          laAISinh: true,
          canDuyet: true,
        })
      );
      if (danhSachMoi.length > 0) {
        khiThemCauHoi(danhSachMoi);
        setChiCanDuyet(true);
        setThongBaoGv(
          `Đã tạo ${danhSachMoi.length} câu hỏi mới (đã kiểm giải 2 lần trên máy chủ) gắn nhãn "AI sinh · Cần duyệt".`
        );
      } else {
        setThongBaoGv(
          'Không có câu hỏi nào vượt qua kiểm tra chéo đáp án. Vui lòng thử lại.'
        );
      }
    } catch {
      setThongBaoGv('Lỗi kết nối máy chủ khi tạo câu hỏi.');
    } finally {
      setDangSinhGemini(false);
    }
  };

  const nutCongTac = (
    tieuDe: string,
    moTa: string,
    giaTri: boolean,
    khiBam: () => void
  ) => (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-[#1F2A4D] last:border-0">
      <div>
        <div className="text-sm font-semibold text-[#F6EEDB]">{tieuDe}</div>
        <div className="text-xs text-[#9BA8BE]">{moTa}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={giaTri}
        aria-label={tieuDe}
        onClick={() => {
          boPhatAmThanh.phatAmNhanNut();
          khiBam();
        }}
        className={`min-w-[64px] min-h-[36px] px-3 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
          giaTri
            ? 'bg-[#1E7F6B] border-[#62D1B5] text-[#F8F6EE]'
            : 'bg-[#070B14] border-[#2C3B5E] text-[#9BA8BE]'
        }`}
      >
        {giaTri ? 'Bật' : 'Tắt'}
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 pb-28 md:pb-12 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="tieu-de-vang text-2xl sm:text-3xl font-bold">
            {laQuanTri ? 'Cài Đặt & Màn Thầy/Cô' : 'Cài Đặt'}
          </h1>
          <p className="text-sm text-[#9BA8BE]">
            {laQuanTri
              ? 'Tùy chỉnh trải nghiệm tu luyện và quản trị ngân hàng câu hỏi Chương III.'
              : 'Tùy chỉnh âm thanh và trải nghiệm tu luyện của bạn.'}
          </p>
        </div>
        {laQuanTri && khiMoBangQuanTri && (
          <NutLenhBai type="button" kieu="vang" onClick={khiMoBangQuanTri}>
            Mở Bảng Quản Trị (Thiên Cơ Các)
          </NutLenhBai>
        )}
      </div>

      {/* Cai dat nguoi choi */}
      <section className="khung-ngoc-gian rounded-xl p-5">
        <h2 className="text-base font-bold text-[#F2D88B] mb-2">
          Âm thanh & Trải nghiệm
        </h2>
        {nutCongTac(
          'Hiệu ứng âm thanh',
          'Âm thanh ngũ cung khi trả lời, tiếng chuông Ngộ Đạo và sấm sét Độ Kiếp.',
          tienTrinh.caiDat.batAmThanh,
          () =>
            khiDoiCaiDat({
              ...tienTrinh.caiDat,
              batAmThanh: !tienTrinh.caiDat.batAmThanh,
            })
        )}
        {nutCongTac(
          'Nhạc nền thiền định nhẹ',
          'Giai điệu ngũ cung êm dịu phát lặp nhẹ nhàng khi tu luyện.',
          tienTrinh.caiDat.batNhacNen,
          () =>
            khiDoiCaiDat({
              ...tienTrinh.caiDat,
              batNhacNen: !tienTrinh.caiDat.batNhacNen,
            })
        )}
        {nutCongTac(
          'Hiển thị Thiên Cơ Toán Bàn',
          'Cho phép mở máy tính khoa học chế độ Độ trong các màn thường (tự khóa khi Đấu Pháp).',
          tienTrinh.caiDat.batMayTinh,
          () =>
            khiDoiCaiDat({
              ...tienTrinh.caiDat,
              batMayTinh: !tienTrinh.caiDat.batMayTinh,
            })
        )}
        {nutCongTac(
          'Giảm hiệu ứng chuyển động',
          'Tắt các chuyển động mây trôi, hào quang để tiết kiệm pin hoặc dễ nhìn hơn.',
          tienTrinh.caiDat.giamHieuUng,
          () =>
            khiDoiCaiDat({
              ...tienTrinh.caiDat,
              giamHieuUng: !tienTrinh.caiDat.giamHieuUng,
            })
        )}
        {nutCongTac(
          'Chế độ trả lời nhanh (bỏ qua Vượt Ải)',
          'Khi bật, các giai đoạn Sơ kỳ – Trung kỳ – Hậu kỳ sẽ vào thẳng dạng trả lời nhanh không cần di chuyển bản đồ.',
          tienTrinh.caiDat.cheDoTraLoiNhanh,
          () =>
            khiDoiCaiDat({
              ...tienTrinh.caiDat,
              cheDoTraLoiNhanh: !tienTrinh.caiDat.cheDoTraLoiNhanh,
            })
        )}
        {nutCongTac(
          'Đồng hồ 45 giây khi đấu Yêu Vương',
          'Hiển thị bộ đếm 45 giây mỗi câu ở trận Đỉnh phong và kích hoạt chí mạng khi trả lời trong ≤10 giây.',
          tienTrinh.caiDat.batDongHoYeuVuong,
          () =>
            khiDoiCaiDat({
              ...tienTrinh.caiDat,
              batDongHoYeuVuong: !tienTrinh.caiDat.batDongHoYeuVuong,
            })
        )}
        {laQuanTri &&
          nutCongTac(
            'Sinh đề mới từ nguồn (tùy chọn)',
            'Mặc định tắt để chỉ dùng kho đề đã kiểm chứng. Khi bật, cho phép tạo biến thể bổ sung từ nguồn Chương III (gắn nhãn AI sinh & chờ duyệt).',
            Boolean(tienTrinh.caiDat.sinhDeMoiAI),
            () =>
              khiDoiCaiDat({
                ...tienTrinh.caiDat,
                sinhDeMoiAI: !tienTrinh.caiDat.sinhDeMoiAI,
              })
          )}

        <div className="pt-4 mt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#9BA8BE]">
            {laKhach
              ? 'Đang lưu cục bộ trên trình duyệt hiện tại (chế độ chơi thử)'
              : 'Đang đồng bộ tự động với cơ sở dữ liệu đám mây'}{' '}
            · Phiên bản {tienTrinh.phienBan} · Lịch sử gần đây:{' '}
            {(tienTrinh.lichSuGanDay || []).length} câu.
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {khiDatLaiLichSuCauHoi && (
              <NutLenhBai
                type="button"
                kieu="tram"
                className="text-xs"
                onClick={() => {
                  khiDatLaiLichSuCauHoi();
                  setThongBaoLichSu('Đã xóa lịch sử câu hỏi đã làm, hệ thống sẽ bốc lại toàn bộ kho đề.');
                }}
              >
                Đặt lại lịch sử câu hỏi đã làm
              </NutLenhBai>
            )}
            <NutLenhBai
              type="button"
              kieu="chuSa"
              className="text-xs"
              onClick={() => setXacNhanDatLai(true)}
            >
              Đặt lại toàn bộ tiến trình
            </NutLenhBai>
          </div>
        </div>
        {thongBaoLichSu && (
          <div className="mt-2 rounded-lg border border-[#62D1B5]/40 bg-[#1E7F6B]/15 px-3 py-2 text-xs text-[#62D1B5]">
            {thongBaoLichSu}
          </div>
        )}
      </section>

      {/* Man Thay/Co (chi danh cho Quan tri vien) */}
      {laQuanTri && (
      <section className="khung-ngoc-gian rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="tieu-de-vang text-lg font-bold">
              Màn Thầy/Cô · Quản Lý Ngân Hàng Câu Hỏi
            </h2>
            <p className="text-xs text-[#9BA8BE]">
              Tổng số hiện có: {nganHangCauHoi.length} câu · Đang chờ duyệt:{' '}
              {nganHangCauHoi.filter((c) => c.canDuyet).length} câu
            </p>
          </div>
          <NutLenhBai
            type="button"
            kieu={moGiaoVien ? 'tram' : 'ngoc'}
            onClick={() => setMoGiaoVien((m) => !m)}
          >
            {moGiaoVien ? 'Thu gọn bảng quản lý' : 'Mở bảng Thầy/Cô'}
          </NutLenhBai>
        </div>

        {moGiaoVien && (
          <div className="mt-5 pt-5 border-t border-[#1F2A4D] space-y-6">
            {thongBaoGv && (
              <div className="rounded-lg border border-[#E4BC5A]/60 bg-[#141D33] p-3 text-sm text-[#F2D88B]">
                {thongBaoGv}
              </div>
            )}

            {/* Ma tran thong ke so cau theo Canh gioi x Giai doan */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="text-sm font-semibold text-[#62D1B5]">
                  Phân bổ câu hỏi theo Cảnh giới × Giai đoạn ({thongKeNganHang.gocPdf} câu gốc PDF + {thongKeNganHang.bienThe} biến thể mẫu)
                </h3>
                <span className="text-[11px] text-[#9BA8BE] chu-so-bang">
                  Dễ: {thongKeNganHang.theoMucDo.de} · TB: {thongKeNganHang.theoMucDo.trungBinh} · Khó: {thongKeNganHang.theoMucDo.kho} · VDC: {thongKeNganHang.theoMucDo.vanDungCao}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1F2A4D] text-[#9BA8BE]">
                      <th className="py-1.5 pr-3">Cảnh giới</th>
                      {THU_TU_GIAI_DOAN.map((gd) => (
                        <th key={gd} className="py-1.5 px-2 text-center">
                          {{
                            soKy: 'Sơ kỳ',
                            trungKy: 'Trung kỳ',
                            hauKy: 'Hậu kỳ',
                            dinhPhong: 'Đỉnh phong',
                          }[gd]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {THU_TU_CANH_GIOI.map((cg) => {
                      const info = DANH_SACH_CANH_GIOI.find((c) => c.id === cg);
                      return (
                        <tr key={cg} className="border-b border-[#1F2A4D]/50">
                          <td className="py-1.5 pr-3 font-medium text-[#F6EEDB]">
                            {info?.ten}
                          </td>
                          {THU_TU_GIAI_DOAN.map((gd) => {
                            const o = nganHangCauHoi.filter(
                              (q) => q.canhGioi === cg && q.giaiDoan === gd
                            );
                            const bt = o.filter((q) => q.laBienThe).length;
                            return (
                              <td
                                key={gd}
                                className="py-1.5 px-2 text-center chu-so-bang text-[#62D1B5]"
                                title={`${o.length - bt} gốc PDF + ${bt} biến thể`}
                              >
                                {o.length}
                                {bt > 0 && (
                                  <span className="text-[10px] text-[#9BA8BE]">
                                    {' '}
                                    ({o.length - bt}+{bt})
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bao cao nhap de tu 20 tep PDF */}
            <div className="rounded-xl border border-[#1F2A4D] bg-[#070B14]/70 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-[#F2D88B]">
                    Báo cáo nhập đề từ {BAO_CAO_NHAP_PDF.tongSoTep} tệp PDF nguồn
                  </h3>
                  <p className="text-xs text-[#9BA8BE]">
                    Kiểm duyệt ngày {BAO_CAO_NHAP_PDF.ngayKiemDuyet} · Tổng số câu trích xuất chuẩn hóa:{' '}
                    {BAO_CAO_NHAP_PDF.tepNguon.reduce((s, t) => s + t.soCauTrichXuat, 0)} câu · Mục bỏ qua/ngoài chương: {BAO_CAO_NHAP_PDF.danhSachBoQua.length}
                  </p>
                </div>
                <NutLenhBai
                  type="button"
                  kieu="tram"
                  className="text-xs"
                  onClick={() => setMoBaoCaoPdf((v) => !v)}
                >
                  {moBaoCaoPdf ? 'Ẩn báo cáo PDF' : 'Xem báo cáo 20 tệp PDF'}
                </NutLenhBai>
              </div>

              {moBaoCaoPdf && (
                <div className="space-y-4 pt-2 border-t border-[#1F2A4D]">
                  <div className="overflow-x-auto max-h-72 overflow-y-auto">
                    <table className="w-full text-[11px] text-left border-collapse">
                      <thead className="sticky top-0 bg-[#0D1424] text-[#9BA8BE]">
                        <tr className="border-b border-[#1F2A4D]">
                          <th className="py-1.5 pr-2">Tệp nguồn</th>
                          <th className="py-1.5 px-2 text-center">Trang</th>
                          <th className="py-1.5 px-2 text-center">Số câu</th>
                          <th className="py-1.5 px-2">Bỏ qua / Ngoài chương</th>
                          <th className="py-1.5 pl-2">Ghi chú kiểm duyệt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {BAO_CAO_NHAP_PDF.tepNguon.map((t) => (
                          <tr key={t.tenTep} className="border-b border-[#1F2A4D]/50 text-[#DCE6EA]">
                            <td className="py-1.5 pr-2 font-medium text-[#F2D88B]">
                              {t.tenHienThi}
                            </td>
                            <td className="py-1.5 px-2 text-center chu-so-bang">
                              {t.trangDaDoc}/{t.tongTrang}
                            </td>
                            <td className="py-1.5 px-2 text-center chu-so-bang text-[#62D1B5]">
                              {t.soCauTrichXuat}
                            </td>
                            <td className="py-1.5 px-2 text-[#9BA8BE]">
                              {t.trangBoQuaHoacNgoaiChuong}
                              {t.trangLoiScan !== 'Không' ? ` · Lỗi đề gốc: ${t.trangLoiScan}` : ''}
                            </td>
                            <td className="py-1.5 pl-2 text-[#DCE6EA]/80">{t.ghiChu}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-[#F28A80] mb-1.5">
                      Chi tiết các mục bỏ qua / loại trừ ({BAO_CAO_NHAP_PDF.danhSachBoQua.length})
                    </div>
                    <div className="overflow-x-auto max-h-56 overflow-y-auto">
                      <table className="w-full text-[11px] text-left border-collapse">
                        <thead className="sticky top-0 bg-[#0D1424] text-[#9BA8BE]">
                          <tr className="border-b border-[#1F2A4D]">
                            <th className="py-1 pr-2">Tệp</th>
                            <th className="py-1 px-2 text-center">Trang</th>
                            <th className="py-1 px-2">Bài/Câu</th>
                            <th className="py-1 pl-2">Lý do loại trừ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {BAO_CAO_NHAP_PDF.danhSachBoQua.map((m, idx) => (
                            <tr key={idx} className="border-b border-[#1F2A4D]/40 text-[#DCE6EA]/85">
                              <td className="py-1 pr-2 text-[#F2D88B]">{m.tep}</td>
                              <td className="py-1 px-2 text-center chu-so-bang">{m.trang}</td>
                              <td className="py-1 px-2">{m.soBai}</td>
                              <td className="py-1 pl-2">{m.lyDo}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Nhap / Xuat JSON, Tu kiem tra & Gemini */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <NutLenhBai
                  type="button"
                  kieu="ngoc"
                  onClick={() =>
                    setKetQuaKiemTra(kiemTraToanVenNganHang(nganHangCauHoi))
                  }
                >
                  Kiểm tra ngân hàng
                </NutLenhBai>

                <NutLenhBai type="button" kieu="tram" onClick={xuatJson}>
                  Xuất JSON ngân hàng
                </NutLenhBai>

                <label className="lenh-bai-vat min-h-[44px] px-4 py-2 bg-[#141D33] border border-[#E4BC5A]/40 text-sm font-semibold text-[#F2D88B] hover:bg-[#1F2A4D] cursor-pointer inline-flex items-center">
                  Nhập JSON câu hỏi
                  <input
                    type="file"
                    accept="application/json,.json"
                    onChange={nhapJson}
                    className="hidden"
                  />
                </label>

                <NutLenhBai
                  type="button"
                  kieu="vang"
                  disabled={dangSinhGemini || !tienTrinh.caiDat.sinhDeMoiAI}
                  onClick={sinhThemBangGemini}
                >
                  {dangSinhGemini
                    ? 'Đang sinh & giải kiểm...'
                    : 'Sinh thêm câu hỏi bằng Gemini'}
                </NutLenhBai>
              </div>

              {!tienTrinh.caiDat.sinhDeMoiAI && (
                <div className="text-[11px] text-[#9BA8BE]">
                  Tùy chọn &quot;Sinh đề mới từ nguồn&quot; đang tắt mặc định — trò chơi ưu tiên 100% kho đề gốc PDF & biến thể đã kiểm chứng. Bật công tắc phía trên nếu Thầy/Cô muốn sinh thêm đề mới chờ duyệt.
                </div>
              )}

              {ketQuaKiemTra && (
                <div
                  className={`rounded-lg border p-3 text-xs space-y-1 ${
                    ketQuaKiemTra.hopLe
                      ? 'border-[#62D1B5]/60 bg-[#1E7F6B]/15 text-[#DCE6EA]'
                      : 'border-[#C8372D] bg-[#C8372D]/15 text-[#F28A80]'
                  }`}
                >
                  <div className="font-bold text-sm text-[#F2D88B]">
                    {ketQuaKiemTra.hopLe
                      ? 'Kiểm tra toàn vẹn ngân hàng: ĐẠT CHUẨN ✓'
                      : 'Phát hiện lỗi toàn vẹn ngân hàng'}
                  </div>
                  <div className="chu-so-bang">
                    Tổng số: {ketQuaKiemTra.tongCau} câu ({ketQuaKiemTra.soCauGoc} gốc PDF +{' '}
                    {ketQuaKiemTra.soBienThe} biến thể ={' '}
                    {Math.round(ketQuaKiemTra.tyLeBienThe * 100)}% tham số hóa) · Ít nhất mỗi ô 6×4:{' '}
                    {ketQuaKiemTra.minMoiO} câu.
                  </div>
                  {ketQuaKiemTra.loiChiTiet.length > 0 && (
                    <ul className="list-disc pl-5 text-[#F28A80]">
                      {ketQuaKiemTra.loiChiTiet.slice(0, 8).map((loi, idx) => (
                        <li key={idx}>{loi}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Form them / sua cau hoi */}
            <div className="rounded-xl border border-[#E4BC5A]/30 bg-[#070B14]/75 p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#F2D88B]">
                {dangSuaId ? `Đang sửa câu: ${dangSuaId}` : 'Thêm câu hỏi trắc nghiệm mới'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={formCanhGioi}
                  onChange={(e) => setFormCanhGioi(e.target.value as MaCanhGioi)}
                  aria-label="Chọn cảnh giới"
                  className="min-h-[40px] px-3 rounded bg-[#0D1424] border border-[#1F2A4D] text-sm text-[#DCE6EA]"
                >
                  {DANH_SACH_CANH_GIOI.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.ten} ({c.baiHoc})
                    </option>
                  ))}
                </select>
                <select
                  value={formGiaiDoan}
                  onChange={(e) => setFormGiaiDoan(e.target.value as MaGiaiDoan)}
                  aria-label="Chọn giai đoạn"
                  className="min-h-[40px] px-3 rounded bg-[#0D1424] border border-[#1F2A4D] text-sm text-[#DCE6EA]"
                >
                  <option value="soKy">Sơ kỳ (Nhận biết)</option>
                  <option value="trungKy">Trung kỳ (Thông hiểu)</option>
                  <option value="hauKy">Hậu kỳ (Vận dụng / Đấu Pháp)</option>
                  <option value="dinhPhong">Đỉnh phong (Vận dụng cao)</option>
                </select>
              </div>

              <textarea
                rows={2}
                value={formDeBai}
                onChange={(e) => setFormDeBai(e.target.value)}
                placeholder="Nhập đề bài (hỗ trợ KaTeX trong dấu $...$)"
                className="w-full p-2.5 rounded bg-[#0D1424] border border-[#1F2A4D] text-sm text-[#DCE6EA]"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {formLuaChon.map((lc, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="dapAnDungGv"
                      checked={formDapAn === idx}
                      onChange={() => setFormDapAn(idx)}
                      aria-label={`Chọn phương án ${idx + 1} là đáp án đúng`}
                    />
                    <input
                      type="text"
                      value={lc}
                      onChange={(e) => {
                        const moi = [...formLuaChon];
                        moi[idx] = e.target.value;
                        setFormLuaChon(moi);
                      }}
                      placeholder={`Phương án ${['A', 'B', 'C', 'D'][idx]}`}
                      className="flex-1 min-h-[38px] px-2.5 rounded bg-[#0D1424] border border-[#1F2A4D] text-xs sm:text-sm text-[#DCE6EA]"
                    />
                  </div>
                ))}
              </div>

              <textarea
                rows={2}
                value={formLoiGiai}
                onChange={(e) => setFormLoiGiai(e.target.value)}
                placeholder="Lời giải chi tiết..."
                className="w-full p-2.5 rounded bg-[#0D1424] border border-[#1F2A4D] text-sm text-[#DCE6EA]"
              />

              <input
                type="text"
                value={formGoiY}
                onChange={(e) => setFormGoiY(e.target.value)}
                placeholder="Gợi ý ngắn (dùng khi mở Phù Thôi Diễn)..."
                className="w-full min-h-[38px] px-2.5 rounded bg-[#0D1424] border border-[#1F2A4D] text-sm text-[#DCE6EA]"
              />

              <div className="flex gap-2">
                <NutLenhBai type="button" kieu="ngoc" onClick={luuCauHoiThuCong}>
                  {dangSuaId ? 'Lưu chỉnh sửa' : 'Thêm câu hỏi'}
                </NutLenhBai>
                {dangSuaId && (
                  <NutLenhBai
                    type="button"
                    kieu="tram"
                    onClick={() => setDangSuaId(null)}
                  >
                    Hủy sửa
                  </NutLenhBai>
                )}
              </div>
            </div>

            {/* Bo loc & danh sach cau hoi */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={locCanhGioi}
                    onChange={(e) =>
                      setLocCanhGioi(e.target.value as 'tatCa' | MaCanhGioi)
                    }
                    aria-label="Lọc câu hỏi theo cảnh giới"
                    className="min-h-[38px] px-3 rounded bg-[#0D1424] border border-[#1F2A4D] text-xs sm:text-sm text-[#DCE6EA]"
                  >
                    <option value="tatCa">Tất cả cảnh giới</option>
                    {DANH_SACH_CANH_GIOI.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.ten}
                      </option>
                    ))}
                  </select>

                  <select
                    value={locNguonBienThe}
                    onChange={(e) =>
                      setLocNguonBienThe(e.target.value as 'tatCa' | 'goc' | 'bienThe')
                    }
                    aria-label="Lọc nguồn câu hỏi"
                    className="min-h-[38px] px-3 rounded bg-[#0D1424] border border-[#1F2A4D] text-xs sm:text-sm text-[#DCE6EA]"
                  >
                    <option value="tatCa">Tất cả dạng đề ({nganHangCauHoi.length})</option>
                    <option value="goc">Câu gốc PDF ({thongKeNganHang.gocPdf})</option>
                    <option value="bienThe">Biến thể từ mẫu ({thongKeNganHang.bienThe})</option>
                  </select>
                </div>

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
                {danhSachLoc.slice(0, 40).map((c) => {
                  const infoCg = DANH_SACH_CANH_GIOI.find(
                    (cg) => cg.id === c.canhGioi
                  );
                  const infoGd = infoCg?.giaiDoan.find(
                    (gd) => gd.ma === c.giaiDoan
                  );
                  return (
                  <div
                    key={c.id}
                    className="rounded-lg border border-[#1F2A4D] bg-[#070B14]/80 p-3 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-[#62D1B5]">
                        [{c.id}] · {infoCg?.ten || c.canhGioi} ·{' '}
                        {infoGd?.ten || c.giaiDoan}
                        {c.canDuyet ? ' · Cần duyệt' : ''}
                      </span>
                      <div className="flex gap-2">
                        {c.canDuyet && (
                          <button
                            type="button"
                            onClick={() =>
                              khiSuaCauHoi({ ...c, canDuyet: false })
                            }
                            className="text-[#62D1B5] hover:underline cursor-pointer"
                          >
                            Duyệt ngay
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => batDauSua(c)}
                          className="text-[#F2D88B] hover:underline cursor-pointer"
                        >
                          Sửa
                        </button>
                        {c.id.startsWith('gv_') || c.id.startsWith('ai_') ? (
                          <button
                            type="button"
                            onClick={() => khiXoaCauHoiCustom(c.id)}
                            className="text-[#F28A80] hover:underline cursor-pointer"
                          >
                            Xóa
                          </button>
                        ) : null}
                      </div>
                    </div>
                    <div className="text-[#DCE6EA]">
                      <CongThucToan noiDung={c.deBai} />
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
      )}

      {/* Hop thoai xac nhan dat lai */}
      {xacNhanDatLai && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="khung-ngoc-gian rounded-xl p-6 max-w-sm w-full text-center border-[#C8372D]">
            <h3 className="font-serif text-xl font-bold text-[#F2D88B]">
              Xác nhận đặt lại tu vi?
            </h3>
            <p className="text-sm text-[#DCE6EA]/85 mt-2">
              Toàn bộ tiến độ cảnh giới, linh khí, linh thạch và vật phẩm hiện tại sẽ trở về ban đầu.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <NutLenhBai
                type="button"
                kieu="tram"
                onClick={() => setXacNhanDatLai(false)}
              >
                Hủy
              </NutLenhBai>
              <NutLenhBai
                type="button"
                kieu="chuSa"
                onClick={() => {
                  setXacNhanDatLai(false);
                  khiDatLaiTienTrinh();
                }}
              >
                Xác nhận đặt lại
              </NutLenhBai>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
