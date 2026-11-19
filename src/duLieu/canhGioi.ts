import { ThongTinCanhGioi } from '../kieuDuLieu/troChoi';

export interface KhungCotTruyen {
  tieuDe: string;
  danhHieu: string;
  noiDung: string;
  nhanVatNoi: string;
  nguoiDan?: 'tieuNon' | 'laoNgu';
}

export const COT_TRUYEN_MO_DAU: KhungCotTruyen[] = [
  {
    tieuDe: 'Phàm Nhân Dị Mộng',
    danhHieu: 'Khởi Nguyên',
    nguoiDan: 'laoNgu',
    noiDung:
      'Lão Ngư Tiên Sinh câu cá bên đầm sương kể rằng vạn vật trời đất đều vận hành theo những tỷ lệ hình học ẩn tàng. Kẻ phàm tục linh căn yếu ớt vẫn có thể chứng đạo nếu thấu hiểu Đạo của Hình và Số.',
    nhanVatNoi:
      'Linh căn của ta tuy mỏng, nhưng quyển cổ thư tam giác này hẳn là cơ duyên đổi mệnh!',
  },
  {
    tieuDe: 'Tiểu Nón Đồng Hành',
    danhHieu: 'Đồng Hành',
    nguoiDan: 'tieuNon',
    noiDung:
      'Từ trong sương mây bước ra một linh đồng đội nón lá tên là Tiểu Nón, vui vẻ vẫy tay dẫn lối vào nửa đường tròn đơn vị. Từng dòng linh khí từ sin, côsin bắt đầu quy tụ vào đan điền.',
    nhanVatNoi:
      'Có Tiểu Nón chỉ đường, từ nửa đường tròn đơn vị đến định lí côsin đều trở nên sáng tỏ!',
  },
  {
    tieuDe: 'Lục Đảo & Yêu Vương',
    danhHieu: 'Lục Đảo',
    nguoiDan: 'tieuNon',
    noiDung:
      'Con đường tu luyện đi qua sáu tầng tiên đảo: Luyện Khí, Trúc Cơ, Kim Đan, Nguyên Anh, Hóa Thần và Độ Kiếp. Mỗi đảo phải vượt 3 chặng Vượt Ải rồi đánh bại Yêu Vương trấn giữ Đỉnh phong!',
    nhanVatNoi:
      'Chặt cây, phá đá, xua sương độc và hạ Yêu Vương bằng chính tri thức Hệ thức lượng!',
  },
  {
    tieuDe: 'Khởi Hành Vân Hải',
    danhHieu: 'Chứng Đạo',
    nguoiDan: 'laoNgu',
    noiDung:
      'Tàng Kinh Các đã khai mở tầng đầu tiên, Động Phủ đã sẵn sàng tĩnh tọa. Hãy cầm la bàn hoặc bản đồ cuộn lên và bước vào Vân Hải ngay hôm nay!',
    nhanVatNoi:
      'Ta đã sẵn sàng! Xin mời Tiểu Nón và Lão Ngư cùng chứng kiến hành trình Tu Toán Chứng Đạo!',
  },
];

export const DANH_SACH_CANH_GIOI: ThongTinCanhGioi[] = [
  {
    id: 'luyenKhi',
    thuTu: 1,
    ten: 'Luyện Khí',
    danhHieu: 'Khai Mạch',
    baiHoc: 'Bài 5 · Giá trị lượng giác của góc 0° đến 180°',
    moTa: 'Dẫn linh khí từ nửa đường tròn đơn vị vào đan điền, nắm vững tọa độ, dấu và giá trị góc đặc biệt.',
    mauChuDao: '#3FB59A',
    linhKhiCan: 120,
    nguongLinhCan: 'Ngũ Hành Tạp Linh Căn → Khai Mạch Linh Căn',
    giaiDoan: [
      {
        ma: 'soKy',
        ten: 'Sơ kỳ',
        chuDe: 'Định nghĩa nửa đường tròn đơn vị & dấu',
        moTa: 'Vượt ải 5 chướng ngại: xác định tọa độ M(x₀; y₀) ứng với góc α từ 0° đến 180° và dấu sin, cos, tan, cot.',
      },
      {
        ma: 'trungKy',
        ten: 'Trung kỳ',
        chuDe: 'Bảng giá trị lượng giác góc đặc biệt',
        moTa: 'Vượt ải 5 chướng ngại: tính nhanh giá trị lượng giác tại 0°, 30°, 45°, 60°, 90°, 120°, 135°, 150°, 180°.',
      },
      {
        ma: 'hauKy',
        ten: 'Hậu kỳ',
        chuDe: 'Đổi góc & tính biểu thức lượng giác thực tế',
        moTa: 'Vượt ải 5 chướng ngại và giao đấu Đấu Pháp định thời trước cổng Thiên Môn.',
        laDauPhap: true,
      },
      {
        ma: 'dinhPhong',
        ten: 'Đỉnh phong',
        chuDe: 'Yêu Vương Tâm Ma Hồ · Bình cảnh Trúc Cơ',
        moTa: 'Chiến đấu với Tâm Ma Hồ (6 đòn chuẩn xác) bằng tổng hợp và bẫy dấu góc tù để đột phá Trúc Cơ.',
        laYeuVuong: true,
      },
    ],
    cauHoiTruyenMo: [
      'Đứng trên đỉnh Vân Khởi sơ khai, sương mai đọng thành hình nửa vầng trăng tròn.',
      'Tiểu Nón nhắc: tung độ y₀ chính là sin α, còn hoành độ x₀ chính là cos α.',
    ],
    cauHoiTruyenKet: [
      'Tâm Ma Hồ tan biến thành sương tím! Linh mạch đầu tiên đã thông suốt.',
    ],
  },
  {
    id: 'trucCo',
    thuTu: 2,
    ten: 'Trúc Cơ',
    danhHieu: 'Đạo Đài',
    baiHoc: 'Bài 5 · Quan hệ giữa các giá trị lượng giác',
    moTa: 'Xây nền đạo đài vững chắc bằng hệ thức bù nhau, phụ nhau và các hằng đẳng thức lượng giác.',
    mauChuDao: '#4A9BE0',
    linhKhiCan: 280,
    nguongLinhCan: 'Khai Mạch Linh Căn → Thanh Tinh Linh Căn',
    giaiDoan: [
      {
        ma: 'soKy',
        ten: 'Sơ kỳ',
        chuDe: 'Hai góc bù nhau & hai góc phụ nhau',
        moTa: 'Vượt ải nhận biết quan hệ giữa α với 180° - α và với 90° - α.',
      },
      {
        ma: 'trungKy',
        ten: 'Trung kỳ',
        chuDe: 'Các hằng đẳng thức lượng giác cơ bản',
        moTa: 'Vượt ải áp dụng sin²α + cos²α = 1, tan α · cot α = 1 và 1 + tan²α = 1/cos²α.',
      },
      {
        ma: 'hauKy',
        ten: 'Hậu kỳ',
        chuDe: 'Tính các giá trị còn lại khi biết một giá trị',
        moTa: 'Vượt ải tìm đủ bộ sin, cos, tan, cot và thắng Đấu Pháp cuối ải.',
        laDauPhap: true,
      },
      {
        ma: 'dinhPhong',
        ten: 'Đỉnh phong',
        chuDe: 'Yêu Vương Đan Kiếp Lôi Điểu · Đan Kiếp',
        moTa: 'Đánh bại Đan Kiếp Lôi Điểu qua 2 pha lôi điện để tiến lên cảnh giới Kim Đan.',
        laYeuVuong: true,
      },
    ],
    cauHoiTruyenMo: [
      'Bước vào Trúc Cơ Hải, từng cột đá ngọc lam nối liền nhau tạo thành trận đồ bù - phụ.',
    ],
    cauHoiTruyenKet: [
      'Đan Kiếp Lôi Điểu thu cánh hóa kim quang! Đạo đài Trúc Cơ vững như bàn thạch.',
    ],
  },
  {
    id: 'kimDan',
    thuTu: 3,
    ten: 'Kim Đan',
    danhHieu: 'Ngưng Đan',
    baiHoc: 'Bài 6 · Định lí côsin & hệ quả',
    moTa: 'Ngưng tụ Kim Đan rực sáng khi thấu hiểu mối liên hệ giữa ba cạnh và góc xen giữa trong tam giác.',
    mauChuDao: '#E4BC5A',
    linhKhiCan: 480,
    nguongLinhCan: 'Thanh Tinh Linh Căn → Địa Phẩm Linh Căn',
    giaiDoan: [
      {
        ma: 'soKy',
        ten: 'Sơ kỳ',
        chuDe: 'Phát biểu & nhận diện Định lí côsin',
        moTa: 'Vượt ải tính cạnh thứ ba khi biết hai cạnh và góc xen giữa bằng a² = b² + c² - 2bc cos A.',
      },
      {
        ma: 'trungKy',
        ten: 'Trung kỳ',
        chuDe: 'Hệ quả Định lí côsin tìm góc & xét loại tam giác',
        moTa: 'Vượt ải dùng cos A = (b² + c² - a²)/(2bc) để tính góc và nhận biết góc nhọn, vuông hay tù.',
      },
      {
        ma: 'hauKy',
        ten: 'Hậu kỳ',
        chuDe: 'Bài toán đo đạc khoảng cách thực tế',
        moTa: 'Vượt ải đo khoảng cách ngăn cách bởi núi, hồ và đấu Đấu Pháp cuối đường.',
        laDauPhap: true,
      },
      {
        ma: 'dinhPhong',
        ten: 'Đỉnh phong',
        chuDe: 'Yêu Vương Anh Kiếp Hắc Giao · Anh Kiếp & Tâm Ma Kiếp',
        moTa: 'Chiến đấu với Anh Kiếp Hắc Giao 2 pha (pha 2 màn tím Tâm Ma Kiếp) để ngưng tụ Nguyên Anh.',
        laYeuVuong: true,
      },
    ],
    cauHoiTruyenMo: [
      'Trên Đỉnh Kim Đan, ánh vàng kim xoay chuyển quanh ba cạnh bất biến của tam giác cổ.',
    ],
    cauHoiTruyenKet: [
      'Anh Kiếp Hắc Giao quy hàng! Ba cạnh và một góc trong thiên hạ đều nằm trong tầm mắt.',
    ],
  },
  {
    id: 'nguyenAnh',
    thuTu: 4,
    ten: 'Nguyên Anh',
    danhHieu: 'Thông Linh',
    baiHoc: 'Bài 6 · Định lí sin & bán kính ngoại tiếp',
    moTa: 'Luyện thành Nguyên Anh thông linh, kết nối ba cạnh tam giác qua vòng tròn ngoại tiếp R.',
    mauChuDao: '#B79CFF',
    linhKhiCan: 720,
    nguongLinhCan: 'Địa Phẩm Linh Căn → Thiên Phẩm Linh Căn',
    giaiDoan: [
      {
        ma: 'soKy',
        ten: 'Sơ kỳ',
        chuDe: 'Công thức Định lí sin & tỉ số 2R',
        moTa: 'Vượt ải vận dụng a/sin A = b/sin B = c/sin C = 2R trong các tình huống cơ bản.',
      },
      {
        ma: 'trungKy',
        ten: 'Trung kỳ',
        chuDe: 'Tính cạnh, tính góc & bán kính ngoại tiếp R',
        moTa: 'Vượt ải phối hợp tổng ba góc 180° với định lí sin để tìm các yếu tố còn lại.',
      },
      {
        ma: 'hauKy',
        ten: 'Hậu kỳ',
        chuDe: 'Ứng dụng đo chiều cao tháp, đỉnh núi không thể tới chân',
        moTa: 'Vượt ải giải bài toán hai góc nâng tại hai vị trí quan sát và Đấu Pháp.',
        laDauPhap: true,
      },
      {
        ma: 'dinhPhong',
        ten: 'Đỉnh phong',
        chuDe: 'Yêu Vương Ngũ Hành Kỳ Lân · Hóa Thần Kiếp',
        moTa: 'Vượt 3 pha Ngũ Hành và Hắc Lôi của Ngũ Hành Kỳ Lân để bước vào Hóa Thần.',
        laYeuVuong: true,
      },
    ],
    cauHoiTruyenMo: [
      'Vòng tròn ngoại tiếp tỏa tử quang trên Điện Nguyên Anh, nối liền mọi cung bậc của góc và cạnh.',
    ],
    cauHoiTruyenKet: [
      'Ngũ Hành Kỳ Lân gật đầu lui bước! Nguyên Anh xuất khiếu thông linh.',
    ],
  },
  {
    id: 'hoaThan',
    thuTu: 5,
    ten: 'Hóa Thần',
    danhHieu: 'Hợp Đạo',
    baiHoc: 'Bài 6 · Các công thức tính diện tích tam giác',
    moTa: 'Hóa thần quy nhất, vận dụng linh hoạt năm công thức diện tích cùng bán kính r, R và công thức Hê-rông.',
    mauChuDao: '#E4623A',
    linhKhiCan: 1000,
    nguongLinhCan: 'Thiên Phẩm Linh Căn → Hỗn Độn Linh Căn',
    giaiDoan: [
      {
        ma: 'soKy',
        ten: 'Sơ kỳ',
        chuDe: 'Diện tích qua hai cạnh góc xen giữa & qua Hê-rông',
        moTa: 'Vượt ải sử dụng S = ½bc sin A và công thức Hê-rông S = √(p(p-a)(p-b)(p-c)).',
      },
      {
        ma: 'trungKy',
        ten: 'Trung kỳ',
        chuDe: 'Diện tích gắn với bán kính ngoại tiếp R và nội tiếp r',
        moTa: 'Vượt ải tính r = S/p, R = abc/(4S) và tìm đường cao ha = 2S/a.',
      },
      {
        ma: 'hauKy',
        ten: 'Hậu kỳ',
        chuDe: 'Bài toán diện tích đất đai & trận pháp thực tiễn',
        moTa: 'Vượt ải tính diện tích linh điền, tứ giác ghép đôi và trận Đấu Pháp.',
        laDauPhap: true,
      },
      {
        ma: 'dinhPhong',
        ten: 'Đỉnh phong',
        chuDe: 'Yêu Vương Tam Tai · Phong – Hỏa – Lôi',
        moTa: 'Đối đầu Tam Tai Yêu Vương qua 3 pha Phong, Hỏa, Lôi để đứng trước Đài Độ Kiếp.',
        laYeuVuong: true,
      },
    ],
    cauHoiTruyenMo: [
      'Xích hỏa Hóa Thần bừng sáng, biến mọi đa giác phức tạp thành diện tích chuẩn xác.',
    ],
    cauHoiTruyenKet: [
      'Tam Tai Yêu Vương tiêu tán! Nay chỉ còn một bước cuối cùng đối mặt Thiên Lôi Chân Long!',
    ],
  },
  {
    id: 'doKiep',
    thuTu: 6,
    ten: 'Độ Kiếp',
    danhHieu: 'Phi Thăng',
    baiHoc: 'Bài tập cuối chương III · Giải tam giác & tổng ôn',
    moTa: 'Vượt qua mây đen sấm tím, tổng hợp toàn bộ hệ thức lượng để giải tam giác và đo đạc thực địa.',
    mauChuDao: '#7A4DFF',
    linhKhiCan: 1350,
    nguongLinhCan: 'Hỗn Độn Linh Căn → Tiên Thiên Đạo Thể',
    giaiDoan: [
      {
        ma: 'soKy',
        ten: 'Sơ kỳ',
        chuDe: 'Giải tam giác dạng cơ bản (c.g.c & g.c.g)',
        moTa: 'Vượt ải xác định đầy đủ cạnh và góc chưa biết của một tam giác chuẩn.',
      },
      {
        ma: 'trungKy',
        ten: 'Trung kỳ',
        chuDe: 'Giải tam giác dạng ba cạnh (c.c.c) & nhận dạng tam giác',
        moTa: 'Vượt ải tìm cả góc, đường cao, R và r từ độ dài ba cạnh.',
      },
      {
        ma: 'hauKy',
        ten: 'Hậu kỳ',
        chuDe: 'Đấu Pháp tổng hợp: hải trình tàu thuyền & định vị',
        moTa: 'Vượt ải giải bài toán vận tốc, hướng đi tàu biển và Đấu Pháp.',
        laDauPhap: true,
      },
      {
        ma: 'dinhPhong',
        ten: 'Đỉnh phong',
        chuDe: 'Thiên Lôi Chân Long · Phi Thăng Kiếp',
        moTa: 'Trận quyết chiến cuối cùng qua 3 pha Tử Lôi, Hắc Lôi, Hỗn Độn Lôi để chứng đắc Chân Tiên!',
        laYeuVuong: true,
      },
    ],
    cauHoiTruyenMo: [
      'Tử lôi cuộn trào trên Đài Độ Kiếp. Toàn bộ tinh túy Chương III hội tụ tại đây!',
    ],
    cauHoiTruyenKet: [
      'Chúc mừng đạo hữu đã hàng phục Thiên Lôi Chân Long, chính thức phi thăng Chứng Đạo!',
    ],
  },
];

export function layThongTinCanhGioi(id: string): ThongTinCanhGioi {
  return (
    DANH_SACH_CANH_GIOI.find((c) => c.id === id) || DANH_SACH_CANH_GIOI[0]
  );
}
