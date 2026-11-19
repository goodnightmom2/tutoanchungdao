import { MaCanhGioi } from '../kieuDuLieu/troChoi';

export interface ThongTinYeuVuong {
  ma: string;
  canhGioi: MaCanhGioi;
  ten: string;
  danhXung: string;
  soDonCanN: number;
  soPha: 1 | 2 | 3;
  tenPha: string[];
  mauChuDao: string;
  mauPhu: string;
  moTa: string;
  cauKhieuKhich: string;
  tamMaKiepPha2?: boolean;
}

export const DANH_SACH_YEU_VUONG: Record<MaCanhGioi, ThongTinYeuVuong> = {
  luyenKhi: {
    ma: 'tamMaHo',
    canhGioi: 'luyenKhi',
    ten: 'Tâm Ma Hồ',
    danhXung: 'Yêu Vương Trấn Đảo Luyện Khí',
    soDonCanN: 6,
    soPha: 1,
    tenPha: ['Khói Tím Huyễn Ảnh'],
    mauChuDao: '#9B6BFF',
    mauPhu: '#4B287B',
    moTa: 'Cửu vĩ linh hồ sinh ra từ chấp niệm dấu góc tù, bao phủ sương tím mê hoặc người mới nhập đạo.',
    cauKhieuKhich: 'Ngươi có phân biệt nổi dấu sin và côsin khi góc vượt quá 90° không?',
  },
  trucCo: {
    ma: 'danKiepLoiDieu',
    canhGioi: 'trucCo',
    ten: 'Đan Kiếp Lôi Điểu',
    danhXung: 'Yêu Vương Lôi Vân Trúc Cơ',
    soDonCanN: 7,
    soPha: 2,
    tenPha: ['Thanh Lôi Tụ Vũ', 'Thiên Lôi Cuồng Dực'],
    mauChuDao: '#4A9BE0',
    mauPhu: '#1D4F8A',
    moTa: 'Thần điểu ngưng tụ sấm xanh trên đỉnh Trúc Cơ, chỉ kẻ thông suốt các hệ thức bù – phụ mới khuất phục nổi.',
    cauKhieuKhich: 'Đừng tưởng nhớ một công thức là đủ, sấm xanh sẽ thử thách toàn bộ hệ thức lượng giác!',
  },
  kimDan: {
    ma: 'anhKiepHacGiao',
    canhGioi: 'kimDan',
    ten: 'Anh Kiếp Hắc Giao',
    danhXung: 'Yêu Vương Hắc Thủy Kim Đan',
    soDonCanN: 8,
    soPha: 2,
    tenPha: ['Hắc Thủy Cuồng Lan', 'Tâm Ma Kiếp · Sấm Đen'],
    mauChuDao: '#E4BC5A',
    mauPhu: '#2F254E',
    moTa: 'Hắc giao long bảo vệ đỉnh Kim Đan. Khi Yêu Lực tụt xuống nửa cây, Hắc Giao hóa Tâm Ma Kiếp nhuộm tím bầu trời!',
    cauKhieuKhich: 'Vượt qua Định lí côsin rồi hãy nói chuyện kết thành Nguyên Anh!',
    tamMaKiepPha2: true,
  },
  nguyenAnh: {
    ma: 'nguHanhKyLan',
    canhGioi: 'nguyenAnh',
    ten: 'Ngũ Hành Kỳ Lân',
    danhXung: 'Thánh Thú Trấn Điện Nguyên Anh',
    soDonCanN: 9,
    soPha: 3,
    tenPha: ['Ngũ Hành Hộ Thể', 'Huyền Quang Ngoại Tiếp', 'Hắc Lôi Thánh Thú'],
    mauChuDao: '#3FB59A',
    mauPhu: '#B79CFF',
    moTa: 'Linh thú mang vòng tròn ngũ hành trên sừng, biến hóa qua ba pha thử thách Định lí sin và bán kính R.',
    cauKhieuKhich: 'Ba cạnh và vòng tròn ngoại tiếp đều nằm trong thế trận của ta!',
  },
  hoaThan: {
    ma: 'tamTaiYeuVuong',
    canhGioi: 'hoaThan',
    ten: 'Tam Tai Yêu Vương',
    danhXung: 'Ma Quân Phong – Hỏa – Lôi',
    soDonCanN: 10,
    soPha: 3,
    tenPha: ['Phong Tai Cuồng Bạo', 'Hỏa Tai Thiêu Đốt', 'Lôi Tai Áp Đỉnh'],
    mauChuDao: '#E4623A',
    mauPhu: '#8F1F1A',
    moTa: 'Yêu Vương khống chế ba kiếp nạn Phong – Hỏa – Lôi, chỉ bậc đại thành công thức diện tích mới có thể hàng phục.',
    cauKhieuKhich: 'Hãy dùng chính diện tích Hê-rông và bán kính nội tiếp để phá Tam Tai trận!',
  },
  doKiep: {
    ma: 'thienLoiChanLong',
    canhGioi: 'doKiep',
    ten: 'Thiên Lôi Chân Long',
    danhXung: 'Thủ Hộ Cuối · Phi Thăng Kiếp',
    soDonCanN: 12,
    soPha: 3,
    tenPha: ['Tử Lôi Thử Đạo', 'Hắc Lôi Trấn Thiên', 'Hỗn Độn Lôi Kiếp'],
    mauChuDao: '#7A4DFF',
    mauPhu: '#E4BC5A',
    moTa: 'Chân Long vắt ngang tầng mây Độ Kiếp, nắm giữ tinh túy giải tam giác toàn Chương III. Hạ gục để chứng đắc Chân Tiên!',
    cauKhieuKhich: 'Muốn phi thăng Chứng Đạo, hãy chứng minh đạo tâm trước 12 đòn Thiên Lôi!',
    tamMaKiepPha2: true,
  },
};

export function layThongTinYeuVuong(canhGioi: MaCanhGioi): ThongTinYeuVuong {
  return DANH_SACH_YEU_VUONG[canhGioi] || DANH_SACH_YEU_VUONG.luyenKhi;
}
