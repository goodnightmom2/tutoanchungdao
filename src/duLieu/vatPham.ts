import { ThanhTich, VatPham } from '../kieuDuLieu/troChoi';

export const DANH_SACH_VAT_PHAM: VatPham[] = [
  // PHAP BAO (trang bi toi da 3)
  {
    id: 'laBanBatQuai',
    ten: 'La Bàn Bát Quái',
    loai: 'phapBao',
    phamChat: 'linh',
    moTa: 'La bàn đồng khắc 8 phương vị, soi sáng tỷ số góc trong mê trận.',
    tacDung: 'Tăng +15% Linh khí nhận được sau mỗi câu trả lời đúng.',
    giaLinhThach: 120,
    hieuUng: { loai: 'tangLinhKhi', giaTri: 0.15 },
  },
  {
    id: 'hoLoHapLinh',
    ten: 'Hồ Lô Hấp Linh',
    loai: 'phapBao',
    phamChat: 'huyen',
    moTa: 'Bầu ngọc hút linh khí trời đất, tích tụ tinh hoa sau mỗi trận thử thách.',
    tacDung: 'Tăng +25% Linh thạch thu được khi hoàn thành giai đoạn.',
    giaLinhThach: 180,
    hieuUng: { loai: 'tangLinhThach', giaTri: 0.25 },
  },
  {
    id: 'ngocBoiThanhTam',
    ten: 'Ngọc Bội Thanh Tâm',
    loai: 'phapBao',
    phamChat: 'dia',
    moTa: 'Miếng ngọc cổ mát lạnh giữ thần thức thanh tỉnh trước tà niệm.',
    tacDung: 'Tăng +1 Linh lực tối đa trong mỗi lần khiêu chiến.',
    giaLinhThach: 260,
    hieuUng: { loai: 'themLinhLucToiDa', giaTri: 1 },
  },
  {
    id: 'tienDinhLuyenKhi',
    ten: 'Tiên Đỉnh Luyện Khí',
    loai: 'phapBao',
    phamChat: 'linh',
    moTa: 'Lò đồng nhỏ khắc văn tự lượng giác giúp luyện hóa kiến thức nhanh hơn.',
    tacDung: 'Tăng +25% Linh khí khi giữ chuỗi Ngộ Đạo.',
    giaLinhThach: 150,
    hieuUng: { loai: 'tangLinhKhi', giaTri: 0.25 },
  },
  {
    id: 'butLongChuSa',
    ten: 'Bút Lông Chu Sa',
    loai: 'phapBao',
    phamChat: 'huyen',
    moTa: 'Bút linh vẽ hình chuẩn xác trong khoảnh khắc giao đấu.',
    tacDung: 'Thêm +6 giây mỗi câu trong các trận Đấu Pháp.',
    giaLinhThach: 200,
    hieuUng: { loai: 'tangThoiGianDauPhap', giaTri: 6 },
  },
  {
    id: 'phiKiem',
    ten: 'Phi Kiếm Thanh Vân',
    loai: 'phapBao',
    phamChat: 'dia',
    moTa: 'Thanh phi kiếm ngọc bích vờn quanh hộ chủ, chém tan yêu khí.',
    tacDung: 'Tăng +20% sát thương mọi đòn đánh vào Yêu Vương.',
    giaLinhThach: 240,
    hieuUng: { loai: 'tangSatThuongYeuVuong', giaTri: 0.2 },
  },
  {
    id: 'chuongLoiCong',
    ten: 'Chuông Lôi Công',
    loai: 'phapBao',
    phamChat: 'thien',
    moTa: 'Chuông đồng cổ chấn áp lôi kiếp, giữ vững đạo tâm lúc nguy nan.',
    tacDung: 'Thêm +1 Linh lực tối đa và +10% Linh khí toàn trận.',
    giaLinhThach: 360,
    hieuUng: { loai: 'themLinhLucToiDa', giaTri: 1 },
  },

  // PHU CHUYEN DUNG (tieu hao trong tran)
  {
    id: 'phuThoiDien',
    ten: 'Phù Thôi Diễn',
    loai: 'phu',
    phamChat: 'pham',
    moTa: 'Bùa giấy dó vẽ trận đồ, khai mở hướng giải then chốt.',
    tacDung: 'Hiển thị Gợi ý chi tiết cho câu hỏi hiện tại.',
    giaLinhThach: 25,
  },
  {
    id: 'phuKhamPha',
    ten: 'Phù Khám Phá',
    loai: 'phu',
    phamChat: 'linh',
    moTa: 'Lá bùa phá ảo ảnh, quét sạch nhiễu loạn trong trắc nghiệm.',
    tacDung: 'Loại bỏ 2 phương án sai trong câu hỏi trắc nghiệm.',
    giaLinhThach: 45,
  },
  {
    id: 'phuHoiLinh',
    ten: 'Phù Hồi Linh',
    loai: 'phu',
    phamChat: 'linh',
    moTa: 'Bùa dẫn linh mạch trời đất, lập tức bù đắp chân khí hao tổn.',
    tacDung: 'Hồi ngay +1 Linh lực trong lúc đang làm bài.',
    giaLinhThach: 55,
  },
  {
    id: 'phuHoanDe',
    ten: 'Phù Hoán Đề',
    loai: 'phu',
    phamChat: 'huyen',
    moTa: 'Chuyển hóa cục diện, đổi sang một thử thách khác cùng giai đoạn.',
    tacDung: 'Đổi câu hỏi hiện tại sang câu khác mà không mất Linh lực.',
    giaLinhThach: 65,
  },
  {
    id: 'loiPhu',
    ten: 'Lôi Phù',
    loai: 'phu',
    phamChat: 'dia',
    moTa: 'Bùa dẫn thiên lôi giáng thẳng xuống Yêu Vương trong trận Đỉnh phong.',
    tacDung: 'Gây ngay 10% Yêu Lực sát thương lên Yêu Vương hiện tại.',
    giaLinhThach: 75,
  },
  {
    id: 'buaChiDuong',
    ten: 'Bùa Chỉ Đường',
    loai: 'phu',
    phamChat: 'linh',
    moTa: 'Lá bùa phát sáng kim quang vạch rõ lối đi ngắn nhất trong Vượt Ải.',
    tacDung: 'Hiện đường ngắn nhất tới cổng Thiên Môn (1 lần mỗi ải).',
    giaLinhThach: 35,
  },

  // DAN DUOC (dung trong tui do hoac khi tau hoa nhap ma)
  {
    id: 'hoiKhiDan',
    ten: 'Hồi Khí Đan',
    loai: 'danDuoc',
    phamChat: 'pham',
    moTa: 'Đan dược thanh mát giúp củng cố nền tảng tu luyện.',
    tacDung: 'Nhận ngay +35 Linh khí để tiến gần ngưỡng đột phá.',
    giaLinhThach: 40,
  },
  {
    id: 'tuLinhDan',
    ten: 'Tụ Linh Đan',
    loai: 'danDuoc',
    phamChat: 'linh',
    moTa: 'Viên đan ngưng tụ tinh hoa ngũ hành trong đan điền.',
    tacDung: 'Nhận ngay +80 Linh khí.',
    giaLinhThach: 85,
  },
  {
    id: 'thanhTamDan',
    ten: 'Thanh Tâm Đan',
    loai: 'danDuoc',
    phamChat: 'huyen',
    moTa: 'Linh đan xua tan chấp niệm, hồi sinh đạo tâm khi kiệt sức.',
    tacDung: 'Hồi đầy Linh lực khi tẩu hỏa nhập ma để tiếp tục trận đấu.',
    giaLinhThach: 90,
  },
  {
    id: 'hoMachDan',
    ten: 'Hộ Mạch Đan',
    loai: 'danDuoc',
    phamChat: 'dia',
    moTa: 'Thánh dược hộ kinh mạch, bảo toàn nguyên thần qua lôi kiếp.',
    tacDung: 'Hồi đầy Linh lực và tặng +40 Linh khí.',
    giaLinhThach: 130,
  },
];

export const MAU_PHAM_CHAT: Record<
  VatPham['phamChat'],
  { ten: string; vien: string; chu: string; nen: string }
> = {
  pham: { ten: 'Phàm phẩm', vien: '#8B95A5', chu: '#DCE6EA', nen: 'rgba(139,149,165,0.12)' },
  linh: { ten: 'Linh phẩm', vien: '#3FB59A', chu: '#62D1B5', nen: 'rgba(63,181,154,0.14)' },
  huyen: { ten: 'Huyền phẩm', vien: '#4A9BE0', chu: '#85C4F7', nen: 'rgba(74,155,224,0.16)' },
  dia: { ten: 'Địa phẩm', vien: '#B79CFF', chu: '#D2C2FF', nen: 'rgba(183,156,255,0.16)' },
  thien: { ten: 'Thiên phẩm', vien: '#E4BC5A', chu: '#F2D88B', nen: 'rgba(228,188,90,0.18)' },
};

export const DANH_SACH_THANH_TICH: ThanhTich[] = [
  {
    id: 'buocChanVaoDao',
    ten: 'Bước Chân Vào Đạo',
    moTa: 'Hoàn thành giai đoạn Sơ kỳ đầu tiên tại Luyện Khí.',
    linhThachThuong: 40,
    vatPhamThuong: 'phuThoiDien',
  },
  {
    id: 'ngoDaoLienHoan',
    ten: 'Ngộ Đạo Liên Hoàn',
    moTa: 'Đạt chuỗi 5 câu trả lời đúng liên tiếp.',
    linhThachThuong: 60,
    vatPhamThuong: 'phuKhamPha',
  },
  {
    id: 'tramTamMa',
    ten: 'Trảm Diệt Tâm Ma',
    moTa: 'Đánh bại Tâm Ma lần đầu tiên khi gặp trắc trở.',
    linhThachThuong: 55,
    vatPhamThuong: 'thanhTamDan',
  },
  {
    id: 'thangDauPhap',
    ten: 'Khí Thế Đấu Pháp',
    moTa: 'Giành chiến thắng trong một trận Đấu Pháp định thời gian.',
    linhThachThuong: 80,
    vatPhamThuong: 'tuLinhDan',
  },
  {
    id: 'trucCoThanhCong',
    ten: 'Trúc Cơ Thành Đạo',
    moTa: 'Đánh bại Tâm Ma Hồ và bước vào cảnh giới Trúc Cơ.',
    linhThachThuong: 90,
    vatPhamThuong: 'laBanBatQuai',
  },
  {
    id: 'kimDanKetTinh',
    ten: 'Kim Đan Kết Tinh',
    moTa: 'Đánh bại Đan Kiếp Lôi Điểu và bước vào cảnh giới Kim Đan.',
    linhThachThuong: 140,
  },
  {
    id: 'tamHoaTuDinh',
    ten: 'Nguyên Anh Sơ Thành',
    moTa: 'Đánh bại Anh Kiếp Hắc Giao và bước vào cảnh giới Nguyên Anh.',
    linhThachThuong: 180,
    vatPhamThuong: 'phiKiem',
  },
  {
    id: 'chungDaoPhiThang',
    ten: 'Tu Toán Chứng Đạo',
    moTa: 'Hạ gục Thiên Lôi Chân Long và đạt danh hiệu Chân Tiên.',
    linhThachThuong: 300,
    vatPhamThuong: 'chuongLoiCong',
  },
];

export const MOC_SAO_RUONG = [12, 24, 36, 48, 60, 72];

export function timVatPham(id: string): VatPham | undefined {
  return DANH_SACH_VAT_PHAM.find((v) => v.id === id);
}

export function moRuongCoDuyenNgauNhien(): {
  linhThach: number;
  vatPhamId: string;
  soLuong: number;
} {
  const linhThach = 35 + Math.floor(Math.random() * 45);
  const nhomTieuHao = DANH_SACH_VAT_PHAM.filter((v) => v.loai !== 'phapBao');
  const chon = nhomTieuHao[Math.floor(Math.random() * nhomTieuHao.length)];
  return {
    linhThach,
    vatPhamId: chon.id,
    soLuong: 1 + (Math.random() > 0.68 ? 1 : 0),
  };
}
