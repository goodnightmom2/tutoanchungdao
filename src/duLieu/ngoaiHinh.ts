import {
  NgoaiHinh,
  NguHanh,
  NhanVatGoc,
  TrangPhuc,
} from '../kieuDuLieu/troChoi';

export interface TuyChonTrangPhuc {
  ma: string;
  ten: string;
  moKhoaCanhGioi?: string;
}

export interface BoTrangPhucSan {
  ma: string;
  ten: string;
  moTa: string;
  moKhoaCanhGioi?: string;
  trangPhuc: TrangPhuc;
  muPhuKienDau?: string;
  phapKhi?: string;
}

export const BANG_MAU_DA: { ten: string; ma: string }[] = [
  { ten: 'Trắng sứ', ma: '#FCE7D6' },
  { ten: 'Ngà ngọc', ma: '#FAD9BE' },
  { ten: 'Tự nhiên', ma: '#F6CCA7' },
  { ten: 'Hồng hào', ma: '#EEB992' },
  { ten: 'Mật ong', ma: '#DDA378' },
  { ten: 'Nắng râm', ma: '#CA8D64' },
  { ten: 'Đồng nhạt', ma: '#B4764D' },
  { ten: 'Nâu trầm', ma: '#925B3A' },
];

export const KIEU_KHUON_MAT: { ma: string; ten: string }[] = [
  { ma: 'bauBinh', ten: 'Tròn bầu bĩnh dễ thương' },
  { ma: 'traiXoan', ten: 'Trái xoan thanh tú' },
  { ma: 'vuongMem', ten: 'Vuông mềm điềm đạm' },
  { ma: 'thanhManh', ten: 'Thanh mảnh anh tuấn' },
];

export const KIEU_MAT: { ma: string; ten: string }[] = [
  { ma: 'toSang', ten: 'Mắt to tròn sáng lấp lánh' },
  { ma: 'nhamCuoi', ten: 'Mắt nhắm cười cong dịu dàng' },
  { ma: 'phuongMi', ten: 'Phượng mi cổ phong' },
  { ma: 'kiemMuc', ten: 'Kiếm mục sắc sảo' },
  { ma: 'daoHoa', ten: 'Đào hoa ôn nhu' },
  { ma: 'tinhToa', ten: 'Nhắm tĩnh tọa an nhiên' },
];

export const BANG_MAU_MAT: { ten: string; ma: string }[] = [
  { ten: 'Nâu sẫm ấm', ma: '#4B2816' },
  { ten: 'Mực đen', ma: '#1B1E2B' },
  { ten: 'Hổ phách', ma: '#B57424' },
  { ten: 'Ngọc lục bảo', ma: '#279B7E' },
  { ten: 'Lam hải', ma: '#2F6FB3' },
  { ten: 'Tử tinh', ma: '#7A54C7' },
  { ten: 'Chu sa', ma: '#B3352D' },
  { ten: 'Kim đồng', ma: '#D9A73E' },
];

export const KIEU_LONG_MAY: { ma: string; ten: string }[] = [
  { ma: 'congTuNhien', ten: 'Cong tự nhiên tươi tắn' },
  { ma: 'kiemMy', ten: 'Kiếm mi anh khí' },
  { ma: 'lieuMy', ten: 'Liễu mi thanh nhã' },
  { ma: 'ramCuongNghi', ten: 'Mày rậm cương nghị' },
];

export const KIEU_MIENG: { ma: string; ten: string }[] = [
  { ma: 'cuoiHa', ten: 'Cười há rạng rỡ' },
  { ma: 'mimCuoi', ten: 'Mỉm cười nhẹ nhàng' },
  { ma: 'diemDam', ten: 'Điềm đạm khép' },
  { ma: 'kienDinh', ten: 'Kiên định nghiêm trang' },
];

export const KIEU_TOC: TuyChonTrangPhuc[] = [
  { ma: 'haiMinhRoi', ten: 'Tóc ngắn rối búi ngọc quan' },
  { ma: 'mocLanDuoiNgua', ten: 'Đuôi ngựa cao kèm búi nhỏ' },
  { ma: 'buiCaoDaiLua', ten: 'Búi cao buộc dải lụa' },
  { ma: 'daiBuongXoa', ten: 'Tóc dài buông xõa' },
  { ma: 'nuaBuiCoPhong', ten: 'Nửa búi nửa xõa cổ phong' },
  { ma: 'songHoan', ten: 'Song hoàn thanh thoát' },
  { ma: 'nganLangTu', ten: 'Tóc ngắn gọn gàng lãng tử' },
  { ma: 'tetSamHaiBen', ten: 'Tết sam rủ hai bên', moKhoaCanhGioi: 'trucCo' },
  { ma: 'bongTienTu', ten: 'Tóc bồng tiên tử', moKhoaCanhGioi: 'kimDan' },
  { ma: 'bayLinhKhi', ten: 'Tóc bay tung linh khí', moKhoaCanhGioi: 'nguyenAnh' },
];

export const BANG_MAU_TOC: { ten: string; ma: string }[] = [
  { ten: 'Đen khói ấm', ma: '#272936' },
  { ten: 'Nâu hạt dẻ', ma: '#7A472A' },
  { ten: 'Nâu trầm', ma: '#4A3429' },
  { ten: 'Bạch ngân', ma: '#DCE4EE' },
  { ten: 'Xanh thẫm', ma: '#1E314E' },
  { ten: 'Tím than', ma: '#3B2854' },
  { ten: 'Hồng đào nhạt', ma: '#C98591' },
  { ten: 'Vàng rơm cổ', ma: '#C8A464' },
  { ten: 'Lục rêu', ma: '#2E5C4E' },
  { ten: 'Đỏ rượu', ma: '#6B242B' },
  { ten: 'Lam băng', ma: '#6AA7CE' },
  { ten: 'Bạch kim', ma: '#F0E6CE' },
];

// 10 kieu ao ngoai
export const KIEU_AO_NGOAI: TuyChonTrangPhuc[] = [
  { ma: 'xanhNgocCoCheo', ten: 'Hán phục cổ chéo viền vàng' },
  { ma: 'vangKemTayRong', ten: 'Áo choàng tay rộng thanh nhã' },
  { ma: 'thanhY', ten: 'Thanh y đạo quán' },
  { ma: 'bachY', ten: 'Bạch y vân hạc' },
  { ma: 'hacY', ten: 'Hắc y ẩn sĩ', moKhoaCanhGioi: 'trucCo' },
  { ma: 'hongY', ten: 'Hồng y hoa đào' },
  { ma: 'hoangY', ten: 'Hoàng y vương giả', moKhoaCanhGioi: 'kimDan' },
  { ma: 'tongMon', ten: 'Áo choàng tông môn' },
  { ma: 'giapNhe', ten: 'Áo giáp nhẹ du hiệp', moKhoaCanhGioi: 'nguyenAnh' },
  { ma: 'vaiPhamNhan', ten: 'Áo vải phàm nhân mộc mạc' },
];

// 8 kieu quan / vay
export const KIEU_VAY_QUAN: TuyChonTrangPhuc[] = [
  { ma: 'quanBoOng', ten: 'Quần lữ hành bó ống' },
  { ma: 'vayVanMay', ten: 'Váy họa tiết vân mây vàng' },
  { ma: 'quanXanh', ten: 'Quần rộng cổ phong' },
  { ma: 'vayDaiTrang', ten: 'Váy dài xếp ly thướt tha' },
  { ma: 'quanVoPhuc', ten: 'Quần võ phục gọn gàng' },
  { ma: 'vayHoaDao', ten: 'Váy ngắn viền cánh hoa', moKhoaCanhGioi: 'trucCo' },
  { ma: 'quanHacY', ten: 'Quần chiến bào hộ tất', moKhoaCanhGioi: 'kimDan' },
  { ma: 'vayTienTu', ten: 'Váy tiên tử dải lụa', moKhoaCanhGioi: 'nguyenAnh' },
];

// 4 kieu giap vai
export const KIEU_GIAP_VAI: TuyChonTrangPhuc[] = [
  { ma: 'khong', ten: 'Không mang giáp vai' },
  { ma: 'daRongVang', ten: 'Giáp vai da nâu rồng vàng' },
  { ma: 'kimLoai', ten: 'Giáp vai kim loại bạc', moKhoaCanhGioi: 'trucCo' },
  { ma: 'aoLong', ten: 'Vai áo lông tuyết', moKhoaCanhGioi: 'kimDan' },
];

// 4 kieu ho uyen
export const KIEU_HO_UYEN: TuyChonTrangPhuc[] = [
  { ma: 'khong', ten: 'Không mang hộ uyển' },
  { ma: 'daVienVang', ten: 'Hộ uyển da nâu viền vàng' },
  { ma: 'ngocBich', ten: 'Hộ uyển ngọc bích' },
  { ma: 'thietGiap', ten: 'Hộ uyển thiết giáp', moKhoaCanhGioi: 'trucCo' },
];

// 6 kieu that lung
export const KIEU_THAT_LUNG: TuyChonTrangPhuc[] = [
  { ma: 'daKhoaVang', ten: 'Thắt lưng da khóa vàng' },
  { ma: 'daiLuaVanMay', ten: 'Dải thắt lưng vân mây' },
  { ma: 'daiNgoc', ten: 'Dải lưng ngọc bội' },
  { ma: 'thungVoPhuc', ten: 'Dây thừng võ phục' },
  { ma: 'daiChuSa', ten: 'Dải lụa chu sa tung bay' },
  { ma: 'daiKimTuyen', ten: 'Đai lưng kim tuyến', moKhoaCanhGioi: 'kimDan' },
];

// 6 kieu giay / ung
export const KIEU_GIAY: TuyChonTrangPhuc[] = [
  { ma: 'ungXanhVienVang', ten: 'Ủng xanh ngọc viền vàng' },
  { ma: 'giayQuaiTatTrang', ten: 'Giày quai ngọc kèm tất trắng' },
  { ma: 'ungDaNau', ten: 'Ủng da nâu cổ cao' },
  { ma: 'giayVai', ten: 'Giày vải thư sinh' },
  { ma: 'ungHuyenThiet', ten: 'Ủng huyền thiết', moKhoaCanhGioi: 'trucCo' },
  { ma: 'giayTienVan', ten: 'Hài tiên vân mây', moKhoaCanhGioi: 'nguyenAnh' },
];

// 5 kieu ba lo
export const KIEU_BA_LO: TuyChonTrangPhuc[] = [
  { ma: 'khong', ten: 'Không mang ba lô' },
  { ma: 'baLoDaNau', ten: 'Ba lô da nâu lữ hành' },
  { ma: 'baLoVanXoayAmDuong', ten: 'Ba lô vân xoáy ấn âm dương' },
  { ma: 'tuiCanKhon', ten: 'Túi càn khôn đeo vai' },
  { ma: 'hoLoLon', ten: 'Hồ lô lớn sau lưng', moKhoaCanhGioi: 'trucCo' },
];

export const BANG_MAU_TRANG_PHUC: { ten: string; ma: string }[] = [
  { ten: 'Xanh ngọc', ma: '#3FA484' },
  { ten: 'Vàng kem', ma: '#FBF1BA' },
  { ten: 'Nâu da', ma: '#7A543E' },
  { ten: 'Thanh lam', ma: '#2D6B8E' },
  { ten: 'Bạch vân', ma: '#F1EDE1' },
  { ten: 'Mực thẫm', ma: '#1B253B' },
  { ten: 'Chu sa', ma: '#A83B32' },
  { ten: 'Hồng phấn', ma: '#E59AA8' },
  { ten: 'Tử vân', ma: '#5F4388' },
  { ten: 'Hoàng kim', ma: '#D9A73E' },
];

export const BANG_MAU_VIEN_AO: { ten: string; ma: string }[] = [
  { ten: 'Vàng kim', ma: '#F2C14E' },
  { ten: 'Ngọc bích', ma: '#53C4A4' },
  { ten: 'Bạch ngân', ma: '#E4EAEF' },
  { ten: 'Chu sa', ma: '#C8372D' },
  { ten: 'Huyền đồng', ma: '#A97C50' },
  { ten: 'Tử điện', ma: '#B79CFF' },
];

export const MU_PHU_KIEN_DAU: TuyChonTrangPhuc[] = [
  { ma: 'khong', ten: 'Không mang' },
  { ma: 'ngocQuanDaiLua', ten: 'Ngọc quan xanh ngọc dải lụa vàng' },
  { ma: 'tramVangNgoc', ten: 'Trâm cài vàng – xanh ngọc' },
  { ma: 'tramNgocBich', ten: 'Trâm ngọc bích thanh vân' },
  { ma: 'hoaSuTrang', ten: 'Hoa sứ trắng nhụy vàng cài tóc' },
  { ma: 'tramHoaSu', ten: 'Trâm vàng ngọc kèm hoa sứ trắng' },
  { ma: 'bangTranHoTam', ten: 'Dải băng trán hộ tâm' },
  { ma: 'maoBac', ten: 'Mão bạc thanh vân' },
  { ma: 'longVuBachHac', ten: 'Lông vũ bạch hạc', moKhoaCanhGioi: 'trucCo' },
  { ma: 'matNaHuyenBi', ten: 'Mặt nạ nửa mặt huyền bí', moKhoaCanhGioi: 'kimDan' },
  { ma: 'vongNhatNguyet', ten: 'Vòng nhật nguyệt', moKhoaCanhGioi: 'hoaThan' },
];

export const PHAP_KHI_TAY: TuyChonTrangPhuc[] = [
  { ma: 'khong', ten: 'Tay không tu tâm' },
  { ma: 'laBanVang', ten: 'La bàn vàng định hướng' },
  { ma: 'banDoCuon', ten: 'Bản đồ cuộn phát sáng' },
  { ma: 'kiemGo', ten: 'Kiếm gỗ đào' },
  { ma: 'quatThuyMac', ten: 'Quạt xếp thủy mặc' },
  { ma: 'butChuSa', ten: 'Bút lông chu sa' },
  { ma: 'truongNgoc', ten: 'Trượng ngọc thạch', moKhoaCanhGioi: 'trucCo' },
  { ma: 'denLong', ten: 'Đèn lồng dẫn hồn', moKhoaCanhGioi: 'kimDan' },
];

export const PHU_KIEN_THEM: TuyChonTrangPhuc[] = [
  { ma: 'maHong', ten: 'Má hồng tự nhiên' },
  { ma: 'anChuSa', ten: 'Vết ấn chu sa giữa trán' },
  { ma: 'notRuoiLe', ten: 'Nốt ruồi lệ dưới mắt' },
  { ma: 'khuyenTaiNgoc', ten: 'Khuyên tai ngọc bích' },
  { ma: 'khong', ten: 'Không có thêm' },
];

export const DANH_SACH_LINH_THU: TuyChonTrangPhuc[] = [
  { ma: 'tieuNon', ten: 'Linh đồng Tiểu Nón (Mặc định)' },
  { ma: 'hoLyTrang', ten: 'Hồ ly trắng nhỏ' },
  { ma: 'hacGiay', ten: 'Hạc giấy xếp bay' },
  { ma: 'ruaHuyenVu', ten: 'Rùa đá huyền vũ' },
  { ma: 'domDom', ten: 'Đom đóm linh khí' },
  { ma: 'tieuThanhLong', ten: 'Tiểu Thanh Long', moKhoaCanhGioi: 'nguyenAnh' },
  { ma: 'tieuPhuongHoang', ten: 'Tiểu Phượng Hoàng', moKhoaCanhGioi: 'hoaThan' },
  { ma: 'khong', ten: 'Chưa mang linh thú' },
];

export const THONG_TIN_NGU_HANH: Record<
  NguHanh,
  { ten: string; mau: string; moTa: string }
> = {
  kim: { ten: 'Kim', mau: '#E4BC5A', moTa: 'Sắc bén, chính xác như kiếm khí' },
  moc: { ten: 'Mộc', mau: '#4FB477', moTa: 'Sinh sôi bền bỉ, hồi phục linh lực' },
  thuy: { ten: 'Thủy', mau: '#4A9BE0', moTa: 'Linh hoạt nhu hòa, thông suốt suy luận' },
  hoa: { ten: 'Hỏa', mau: '#E4623A', moTa: 'Mãnh liệt bứt phá, bội tăng linh khí' },
  tho: { ten: 'Thổ', mau: '#A97C50', moTa: 'Vững vàng bất động, chống đỡ tâm ma' },
};

export const BO_TRANG_PHUC_SAN: BoTrangPhucSan[] = [
  {
    ma: 'haiMinhThanhY',
    ten: 'Hải Minh – Thanh Y Lữ Hành',
    moTa: 'Hán phục xanh ngọc viền vàng, giáp vai rồng vàng, ba lô da & kiếm gỗ sau lưng.',
    muPhuKienDau: 'ngocQuanDaiLua',
    phapKhi: 'laBanVang',
    trangPhuc: {
      aoNgoai: 'xanhNgocCoCheo',
      mauAoNgoai: '#3FA484',
      mauVienAo: '#F2C14E',
      vayQuan: 'quanBoOng',
      mauVayQuan: '#7A543E',
      giapVai: 'daRongVang',
      hoUyen: 'daVienVang',
      thatLung: 'daKhoaVang',
      mauThatLung: '#6F4934',
      giay: 'ungXanhVienVang',
      mauGiay: '#2E8376',
      baLo: 'baLoDaNau',
      mauBaLo: '#7A543E',
    },
  },
  {
    ma: 'mocLanThienThanh',
    ten: 'Mộc Lan – Thiên Thanh Lữ Hành',
    moTa: 'Áo choàng vàng kem tay rộng, váy xanh ngọc vân mây vàng, ba lô âm dương & tất trắng.',
    muPhuKienDau: 'tramHoaSu',
    phapKhi: 'banDoCuon',
    trangPhuc: {
      aoNgoai: 'vangKemTayRong',
      mauAoNgoai: '#FBF1BA',
      mauVienAo: '#F2C14E',
      vayQuan: 'vayVanMay',
      mauVayQuan: '#42BFAC',
      giapVai: 'khong',
      hoUyen: 'khong',
      thatLung: 'daiLuaVanMay',
      mauThatLung: '#2CA594',
      giay: 'giayQuaiTatTrang',
      mauGiay: '#369A8D',
      baLo: 'baLoVanXoayAmDuong',
      mauBaLo: '#876045',
    },
  },
  {
    ma: 'kimPhongVoSi',
    ten: 'Kim Phong – Luyện Kiếm Võ Phục',
    moTa: 'Áo giáp nhẹ sắc kim, hộ uyển thiết giáp, quần võ phục gọn gàng.',
    muPhuKienDau: 'maoBac',
    phapKhi: 'kiemGo',
    trangPhuc: {
      aoNgoai: 'tongMon',
      mauAoNgoai: '#27344B',
      mauVienAo: '#F2C14E',
      vayQuan: 'quanVoPhuc',
      mauVayQuan: '#1D2538',
      giapVai: 'daRongVang',
      hoUyen: 'daVienVang',
      thatLung: 'thungVoPhuc',
      mauThatLung: '#F2C14E',
      giay: 'ungDaNau',
      mauGiay: '#5E3F2C',
      baLo: 'tuiCanKhon',
      mauBaLo: '#2D6B8E',
    },
  },
  {
    ma: 'hoaNhiXichDiem',
    ten: 'Hỏa Nhi – Xích Diễm Đan Đồ',
    moTa: 'Hồng y chu sa rực rỡ, đai lụa chu sa tung bay và hồ lô luyện đan.',
    muPhuKienDau: 'tramVangNgoc',
    phapKhi: 'quatThuyMac',
    trangPhuc: {
      aoNgoai: 'hongY',
      mauAoNgoai: '#C94E4A',
      mauVienAo: '#F2C14E',
      vayQuan: 'vayDaiTrang',
      mauVayQuan: '#F3E8D0',
      giapVai: 'khong',
      hoUyen: 'ngocBich',
      thatLung: 'daiChuSa',
      mauThatLung: '#C8372D',
      giay: 'giayQuaiTatTrang',
      mauGiay: '#A83B32',
      baLo: 'tuiCanKhon',
      mauBaLo: '#A83B32',
    },
  },
  {
    ma: 'thoBaoSonCoc',
    ten: 'Thổ Bảo – Sơn Cốc Lãng Du',
    moTa: 'Áo vải mộc mạc tông nâu trầm, ba lô da chắc chắn nơi vách núi.',
    muPhuKienDau: 'bangTranHoTam',
    phapKhi: 'laBanVang',
    trangPhuc: {
      aoNgoai: 'vaiPhamNhan',
      mauAoNgoai: '#8B6242',
      mauVienAo: '#E4BC5A',
      vayQuan: 'quanBoOng',
      mauVayQuan: '#4E3828',
      giapVai: 'daRongVang',
      hoUyen: 'daVienVang',
      thatLung: 'daKhoaVang',
      mauThatLung: '#5C3C28',
      giay: 'ungDaNau',
      mauGiay: '#6A4732',
      baLo: 'baLoDaNau',
      mauBaLo: '#7A543E',
    },
  },
  {
    ma: 'tieuVanBachHac',
    ten: 'Tiểu Vân – Thanh Vân Đạo Đồng',
    moTa: 'Bạch y thanh thoát viền ngọc bích, tay cầm bút chu sa ghi chép cổ bia.',
    muPhuKienDau: 'tramNgocBich',
    phapKhi: 'butChuSa',
    trangPhuc: {
      aoNgoai: 'bachY',
      mauAoNgoai: '#F1EDE1',
      mauVienAo: '#53C4A4',
      vayQuan: 'quanXanh',
      mauVayQuan: '#2D6B8E',
      giapVai: 'khong',
      hoUyen: 'ngocBich',
      thatLung: 'daiNgoc',
      mauThatLung: '#53C4A4',
      giay: 'giayVai',
      mauGiay: '#2D6B8E',
      baLo: 'khong',
      mauBaLo: '#2D6B8E',
    },
  },
  {
    ma: 'huyenYThuongSinh',
    ten: 'Huyền Y Tông Sư',
    moTa: 'Hắc y uy nghiêm viền vàng kim, phù hợp bậc Trúc Cơ trở lên.',
    moKhoaCanhGioi: 'trucCo',
    muPhuKienDau: 'longVuBachHac',
    phapKhi: 'truongNgoc',
    trangPhuc: {
      aoNgoai: 'hacY',
      mauAoNgoai: '#1B253B',
      mauVienAo: '#F2C14E',
      vayQuan: 'quanHacY',
      mauVayQuan: '#141A29',
      giapVai: 'kimLoai',
      hoUyen: 'thietGiap',
      thatLung: 'daiKimTuyen',
      mauThatLung: '#F2C14E',
      giay: 'ungHuyenThiet',
      mauGiay: '#1F2A4D',
      baLo: 'hoLoLon',
      mauBaLo: '#A97C50',
    },
  },
  {
    ma: 'hoangKimTienDao',
    ten: 'Hoàng Kim Tiên Đạo',
    moTa: 'Hoàng bào rực rỡ bậc Kim Đan, tôn lên khí chất chứng đạo.',
    moKhoaCanhGioi: 'kimDan',
    muPhuKienDau: 'vongNhatNguyet',
    phapKhi: 'banDoCuon',
    trangPhuc: {
      aoNgoai: 'hoangY',
      mauAoNgoai: '#D9A73E',
      mauVienAo: '#FFF5D6',
      vayQuan: 'vayTienTu',
      mauVayQuan: '#F1EDE1',
      giapVai: 'aoLong',
      hoUyen: 'ngocBich',
      thatLung: 'daiKimTuyen',
      mauThatLung: '#C8372D',
      giay: 'giayTienVan',
      mauGiay: '#D9A73E',
      baLo: 'baLoVanXoayAmDuong',
      mauBaLo: '#3FA484',
    },
  },
];

export const NHAN_VAT_GOC: NhanVatGoc[] = [
  {
    id: 'haiMinh',
    ten: 'Hải Minh',
    danhHieu: 'Thủy Linh Căn Tạp Chất',
    nguHanh: 'thuy',
    xuatThan:
      'Thiếu niên làng chài bên biển mây, đội ngọc quan xanh ngọc, đeo kiếm gỗ sau lưng và cầm la bàn vàng tầm đạo.',
    noiTaiTen: 'Tĩnh Thủy Minh Tâm',
    noiTaiMoTa: 'Thêm +3 giây mỗi câu khi bước vào trận Đấu Pháp.',
    tuTheMacDinh: 'chiDuong',
    ngoaiHinhMacDinh: {
      maMau: 'haiMinh',
      ten: 'Hải Minh',
      dangNguoi: 'thieuNien',
      mauDa: '#F6CCA7',
      kieuMat: 'bauBinh',
      mat: 'toSang',
      mauMat: '#4B2816',
      longMay: 'congTuNhien',
      mieng: 'cuoiHa',
      toc: 'haiMinhRoi',
      mauToc: '#272936',
      muPhuKienDau: 'ngocQuanDaiLua',
      trangPhuc: { ...BO_TRANG_PHUC_SAN[0].trangPhuc },
      phapKhi: 'laBanVang',
      phuKienThem: 'maHong',
      haoQuang: 'thuy',
      linhThu: 'tieuNon',
    },
  },
  {
    id: 'mocLan',
    ten: 'Mộc Lan',
    danhHieu: 'Mộc Linh Căn Mỏng Manh',
    nguHanh: 'moc',
    xuatThan:
      'Thiếu nữ sơn cốc buộc tóc đuôi ngựa cài hoa sứ trắng, khoác áo vàng kem tay rộng và mang bản đồ cuộn phát sáng.',
    noiTaiTen: 'Xuân Phong Dưỡng Linh',
    noiTaiMoTa: 'Khởi đầu mỗi màn với +1 Linh lực tối đa (tổng 6 ngọc).',
    tuTheMacDinh: 'dungYen',
    ngoaiHinhMacDinh: {
      maMau: 'mocLan',
      ten: 'Mộc Lan',
      dangNguoi: 'thieuNu',
      mauDa: '#FAD9BE',
      kieuMat: 'bauBinh',
      mat: 'nhamCuoi',
      mauMat: '#4B2816',
      longMay: 'lieuMy',
      mieng: 'cuoiHa',
      toc: 'mocLanDuoiNgua',
      mauToc: '#7A472A',
      muPhuKienDau: 'tramHoaSu',
      trangPhuc: { ...BO_TRANG_PHUC_SAN[1].trangPhuc },
      phapKhi: 'banDoCuon',
      phuKienThem: 'maHong',
      haoQuang: 'moc',
      linhThu: 'tieuNon',
    },
  },
  {
    id: 'kimPhong',
    ten: 'Kim Phong',
    danhHieu: 'Kim Linh Căn Phàm Tục',
    nguHanh: 'kim',
    xuatThan:
      'Đồ đệ thợ rèn trấn Thanh Phong, tinh thông đo đạc góc cạnh kiếm phôi.',
    noiTaiTen: 'Kiếm Tâm Sắc Bén',
    noiTaiMoTa: 'Nhận thêm +15% Linh thạch sau mỗi lần hoàn thành giai đoạn.',
    tuTheMacDinh: 'tanCong',
    ngoaiHinhMacDinh: {
      maMau: 'kimPhong',
      ten: 'Kim Phong',
      dangNguoi: 'thieuNien',
      mauDa: '#EEB992',
      kieuMat: 'vuongMem',
      mat: 'kiemMuc',
      mauMat: '#D9A73E',
      longMay: 'kiemMy',
      mieng: 'kienDinh',
      toc: 'nganLangTu',
      mauToc: '#4A3429',
      muPhuKienDau: 'maoBac',
      trangPhuc: { ...BO_TRANG_PHUC_SAN[2].trangPhuc },
      phapKhi: 'kiemGo',
      phuKienThem: 'maHong',
      haoQuang: 'kim',
      linhThu: 'tieuNon',
    },
  },
  {
    id: 'hoaNhi',
    ten: 'Hỏa Nhi',
    danhHieu: 'Hỏa Linh Căn Rời Rạc',
    nguHanh: 'hoa',
    xuatThan:
      'Cô bé giữ lò luyện đan phụ việc tại đạo quán, quyết tâm dùng toán tính chuẩn hỏa hầu.',
    noiTaiTen: 'Xích Diễm Ngộ Đạo',
    noiTaiMoTa: 'Chuỗi Ngộ Đạo từ 3 câu trở lên nhận thêm +20% Linh khí.',
    tuTheMacDinh: 'chao',
    ngoaiHinhMacDinh: {
      maMau: 'hoaNhi',
      ten: 'Hỏa Nhi',
      dangNguoi: 'thieuNu',
      mauDa: '#FCE7D6',
      kieuMat: 'bauBinh',
      mat: 'toSang',
      mauMat: '#B3352D',
      longMay: 'congTuNhien',
      mieng: 'cuoiHa',
      toc: 'songHoan',
      mauToc: '#6B242B',
      muPhuKienDau: 'tramVangNgoc',
      trangPhuc: { ...BO_TRANG_PHUC_SAN[3].trangPhuc },
      phapKhi: 'quatThuyMac',
      phuKienThem: 'anChuSa',
      haoQuang: 'hoa',
      linhThu: 'tieuNon',
    },
  },
  {
    id: 'thoBao',
    ten: 'Thổ Bảo',
    danhHieu: 'Thổ Linh Căn Trì Trệ',
    nguHanh: 'tho',
    xuatThan:
      'Tiểu phu khuân đá xây tháp cổ, nhờ vẽ lại địa đồ tam giác mà mở khai linh trí.',
    noiTaiTen: 'Bàn Thạch Bất Động',
    noiTaiMoTa: 'Lần sai đầu tiên trong mỗi trận không bị mất Linh lực.',
    tuTheMacDinh: 'dungYen',
    ngoaiHinhMacDinh: {
      maMau: 'thoBao',
      ten: 'Thổ Bảo',
      dangNguoi: 'tuDo',
      mauDa: '#CA8D64',
      kieuMat: 'vuongMem',
      mat: 'toSang',
      mauMat: '#4B2816',
      longMay: 'ramCuongNghi',
      mieng: 'mimCuoi',
      toc: 'buiCaoDaiLua',
      mauToc: '#4A3429',
      muPhuKienDau: 'bangTranHoTam',
      trangPhuc: { ...BO_TRANG_PHUC_SAN[4].trangPhuc },
      phapKhi: 'laBanVang',
      phuKienThem: 'maHong',
      haoQuang: 'tho',
      linhThu: 'tieuNon',
    },
  },
  {
    id: 'tieuVan',
    ten: 'Tiểu Vân',
    danhHieu: 'Ngũ Hành Hỗn Tạp',
    nguHanh: 'kim',
    xuatThan:
      'Đạo đồng quét sân trên Vân Đỉnh, âm thầm học lỏm khẩu quyết lượng giác từ cổ bia.',
    noiTaiTen: 'Thanh Vân Biến Hóa',
    noiTaiMoTa:
      'Mở đầu trận được tặng miễn phí 1 lần dùng Phù Thôi Diễn gợi ý.',
    tuTheMacDinh: 'niemChu',
    ngoaiHinhMacDinh: {
      maMau: 'tieuVan',
      ten: 'Tiểu Vân',
      dangNguoi: 'tuDo',
      mauDa: '#FCE7D6',
      kieuMat: 'traiXoan',
      mat: 'daoHoa',
      mauMat: '#2F6FB3',
      longMay: 'lieuMy',
      mieng: 'mimCuoi',
      toc: 'nuaBuiCoPhong',
      mauToc: '#DCE4EE',
      muPhuKienDau: 'tramNgocBich',
      trangPhuc: { ...BO_TRANG_PHUC_SAN[5].trangPhuc },
      phapKhi: 'butChuSa',
      phuKienThem: 'khuyenTaiNgoc',
      haoQuang: 'thuy',
      linhThu: 'tieuNon',
    },
  },
];

const HO_CO_PHONG = [
  'Lâm',
  'Vân',
  'Diệp',
  'Mạc',
  'Trần',
  'Lục',
  'Thẩm',
  'Tô',
  'Hàn',
  'Bạch',
  'Cố',
  'Tiêu',
];

const TEN_TU_SI = [
  'Thanh Phong',
  'Minh Nguyệt',
  'Tử Huyên',
  'Huyền Vũ',
  'Ngọc Chân',
  'Thiên Cơ',
  'Vô Trần',
  'Tinh Hà',
  'Thanh Trúc',
  'Bạch Hạc',
  'Linh Nhi',
  'Mặc Uyên',
];

export function taoTenTuSiNgauNhien(): string {
  const ho = HO_CO_PHONG[Math.floor(Math.random() * HO_CO_PHONG.length)];
  const ten = TEN_TU_SI[Math.floor(Math.random() * TEN_TU_SI.length)];
  return `${ho} ${ten}`.slice(0, 16);
}

export function taoNgoaiHinhNgauNhien(maMau?: string): NgoaiHinh {
  const goc =
    NHAN_VAT_GOC.find((n) => n.id === maMau) ||
    NHAN_VAT_GOC[Math.floor(Math.random() * NHAN_VAT_GOC.length)];
  const boMo = BO_TRANG_PHUC_SAN.filter((b) => !b.moKhoaCanhGioi);
  const boChon = boMo[Math.floor(Math.random() * boMo.length)];
  const dsToc = KIEU_TOC.filter((t) => !t.moKhoaCanhGioi);
  const dsMu = MU_PHU_KIEN_DAU.filter((m) => !m.moKhoaCanhGioi);
  const dsPhapKhi = PHAP_KHI_TAY.filter((p) => !p.moKhoaCanhGioi);
  const dsLinhThu = DANH_SACH_LINH_THU.filter((l) => !l.moKhoaCanhGioi);
  const dsHaoQuang: NguHanh[] = ['kim', 'moc', 'thuy', 'hoa', 'tho'];

  return {
    maMau: goc.id,
    ten: taoTenTuSiNgauNhien(),
    dangNguoi: (['thieuNien', 'thieuNu', 'tuDo'] as const)[
      Math.floor(Math.random() * 3)
    ],
    mauDa: BANG_MAU_DA[Math.floor(Math.random() * BANG_MAU_DA.length)].ma,
    kieuMat:
      KIEU_KHUON_MAT[Math.floor(Math.random() * KIEU_KHUON_MAT.length)].ma,
    mat: KIEU_MAT[Math.floor(Math.random() * KIEU_MAT.length)].ma,
    mauMat: BANG_MAU_MAT[Math.floor(Math.random() * BANG_MAU_MAT.length)].ma,
    longMay:
      KIEU_LONG_MAY[Math.floor(Math.random() * KIEU_LONG_MAY.length)].ma,
    mieng: KIEU_MIENG[Math.floor(Math.random() * KIEU_MIENG.length)].ma,
    toc: dsToc[Math.floor(Math.random() * dsToc.length)].ma,
    mauToc: BANG_MAU_TOC[Math.floor(Math.random() * BANG_MAU_TOC.length)].ma,
    muPhuKienDau: dsMu[Math.floor(Math.random() * dsMu.length)].ma,
    trangPhuc: { ...boChon.trangPhuc },
    phapKhi: dsPhapKhi[Math.floor(Math.random() * dsPhapKhi.length)].ma,
    phuKienThem:
      PHU_KIEN_THEM[Math.floor(Math.random() * PHU_KIEN_THEM.length)].ma,
    haoQuang: dsHaoQuang[Math.floor(Math.random() * dsHaoQuang.length)],
    linhThu: dsLinhThu[Math.floor(Math.random() * dsLinhThu.length)].ma,
  };
}
