import { Kinh, MucKinh } from '../kieuDuLieu/troChoi';

export const TEN_TANG_KINH: Record<number, { ten: string; moTa: string }> = {
  1: { ten: 'Tầng 1 · Luyện Khí', moTa: 'Giá trị lượng giác của góc từ 0° đến 180°' },
  2: { ten: 'Tầng 2 · Trúc Cơ', moTa: 'Quan hệ bù – phụ & hằng đẳng thức lượng giác' },
  3: { ten: 'Tầng 3 · Kim Đan', moTa: 'Định lí côsin & hệ quả tính góc' },
  4: { ten: 'Tầng 4 · Nguyên Anh', moTa: 'Định lí sin & bán kính ngoại tiếp R' },
  5: { ten: 'Tầng 5 · Hóa Thần', moTa: 'Năm công thức tính diện tích tam giác' },
  6: { ten: 'Tầng 6 · Độ Kiếp', moTa: 'Giải tam giác tổng hợp & bài toán thực tế' },
  7: { ten: 'Tầng 7 · Đỉnh Tàng', moTa: 'Tổng kết đại thành Chương III Hệ thức lượng' },
};

export const TEN_MUC_KINH: Record<MucKinh, string> = {
  dinhNghia: 'Định nghĩa',
  congThuc: 'Công thức',
  bangGiaTri: 'Bảng giá trị',
  meoNho: 'Mẹo nhớ',
  viDuMau: 'Ví dụ mẫu',
  loiThuongGap: 'Lỗi thường gặp',
  tongHop: 'Tổng hợp',
};

export const DANH_SACH_KINH: Kinh[] = [
  // TANG 1: LUYEN KHI
  {
    ma: 'lk_dinh_nghia',
    tang: 1,
    muc: 'dinhNghia',
    tieuDe: 'Nửa đường tròn đơn vị & tọa độ điểm M',
    noiDung:
      'Với mỗi góc $\\alpha$ ($0^\\circ \\le \\alpha \\le 180^\\circ$), xác định duy nhất điểm $M(x_0; y_0)$ trên nửa đường tròn đơn vị sao cho $\\widehat{xOM} = \\alpha$. Khi đó: $\\sin\\alpha = y_0$, $\\cos\\alpha = x_0$, $\\tan\\alpha = \\dfrac{y_0}{x_0}$ ($x_0 \\ne 0$), $\\cot\\alpha = \\dfrac{x_0}{y_0}$ ($y_0 \\ne 0$).',
    hinhVe: {
      loai: 'nuaDuongTronDonVi',
      gocAlpha: 120,
      hienToaDo: true,
      nhanDiem: 'M',
    },
    canhGioiMo: 'luyenKhi',
    dieuKienMo: 'vaoCanhGioi',
  },
  {
    ma: 'lk_dau_goc',
    tang: 1,
    muc: 'congThuc',
    tieuDe: 'Dấu của giá trị lượng giác từ 0° đến 180°',
    noiDung:
      'Trong nửa đường tròn đơn vị ($y_0 \\ge 0$), $\\sin\\alpha \\ge 0$ với mọi $\\alpha \\in [0^\\circ; 180^\\circ]$. Khi $\\alpha$ là góc nhọn ($0^\\circ < \\alpha < 90^\\circ$): $\\cos\\alpha > 0, \\tan\\alpha > 0, \\cot\\alpha > 0$. Khi $\\alpha$ là góc tù ($90^\\circ < \\alpha < 180^\\circ$): $\\cos\\alpha < 0, \\tan\\alpha < 0, \\cot\\alpha < 0$.',
    canhGioiMo: 'luyenKhi',
    dieuKienMo: 'vaoCanhGioi',
  },
  {
    ma: 'lk_bang_gia_tri',
    tang: 1,
    muc: 'bangGiaTri',
    tieuDe: 'Bảng giá trị lượng giác góc đặc biệt (0° → 180°)',
    noiDung:
      'Ghi nhớ chuẩn xác:\n• $0^\\circ$: $\\sin = 0,\\; \\cos = 1,\\; \\tan = 0,\\; \\cot = \\text{KXD}$\n• $30^\\circ$: $\\sin = \\dfrac{1}{2},\\; \\cos = \\dfrac{\\sqrt{3}}{2},\\; \\tan = \\dfrac{\\sqrt{3}}{3},\\; \\cot = \\sqrt{3}$\n• $45^\\circ$: $\\sin = \\dfrac{\\sqrt{2}}{2},\\; \\cos = \\dfrac{\\sqrt{2}}{2},\\; \\tan = 1,\\; \\cot = 1$\n• $60^\\circ$: $\\sin = \\dfrac{\\sqrt{3}}{2},\\; \\cos = \\dfrac{1}{2},\\; \\tan = \\sqrt{3},\\; \\cot = \\dfrac{\\sqrt{3}}{3}$\n• $90^\\circ$: $\\sin = 1,\\; \\cos = 0,\\; \\tan = \\text{KXD},\\; \\cot = 0$\n• $120^\\circ$: $\\sin = \\dfrac{\\sqrt{3}}{2},\\; \\cos = -\\dfrac{1}{2},\\; \\tan = -\\sqrt{3},\\; \\cot = -\\dfrac{\\sqrt{3}}{3}$\n• $135^\\circ$: $\\sin = \\dfrac{\\sqrt{2}}{2},\\; \\cos = -\\dfrac{\\sqrt{2}}{2},\\; \\tan = -1,\\; \\cot = -1$\n• $150^\\circ$: $\\sin = \\dfrac{1}{2},\\; \\cos = -\\dfrac{\\sqrt{3}}{2},\\; \\tan = -\\dfrac{\\sqrt{3}}{3},\\; \\cot = -\\sqrt{3}$\n• $180^\\circ$: $\\sin = 0,\\; \\cos = -1,\\; \\tan = 0,\\; \\cot = \\text{KXD}$',
    canhGioiMo: 'luyenKhi',
    dieuKienMo: 'vaoCanhGioi',
  },
  {
    ma: 'lk_meo_nho',
    tang: 1,
    muc: 'meoNho',
    tieuDe: 'Mẹo nhớ trục Tung – Hoành & góc 30°–45°–60°',
    noiDung:
      'Mẹo "Sin đứng, Cos nằm": trục tung $Oy$ ứng với $\\sin$, trục hoành $Ox$ ứng với $\\cos$. Với $30^\\circ, 45^\\circ, 60^\\circ$, tử số của $\\sin$ tăng dần theo $\\dfrac{\\sqrt{1}}{2}, \\dfrac{\\sqrt{2}}{2}, \\dfrac{\\sqrt{3}}{2}$; còn $\\cos$ giảm ngược lại!',
    canhGioiMo: 'luyenKhi',
    dieuKienMo: 'quaTrungKy',
  },
  {
    ma: 'lk_loi_thuong_gap',
    tang: 1,
    muc: 'loiThuongGap',
    tieuDe: 'Lỗi thường gặp: Dấu âm góc tù & chế độ Radian',
    noiDung:
      'Nhiều đạo hữu nhầm $\\cos 120^\\circ = \\dfrac{1}{2}$, thực chất $120^\\circ$ là góc tù nên $\\cos 120^\\circ = -\\dfrac{1}{2}$. Ngoài ra, khi bấm máy tính cần đặt chế độ Độ (Deg), tránh để Radian.',
    canhGioiMo: 'luyenKhi',
    dieuKienMo: 'quaHauKy',
  },

  // TANG 2: TRUC CO
  {
    ma: 'tc_bu_phu',
    tang: 2,
    muc: 'congThuc',
    tieuDe: 'Quan hệ hai góc bù nhau & hai góc phụ nhau',
    noiDung:
      '• Hai góc bù nhau ($\\alpha$ và $180^\\circ - \\alpha$): $\\sin(180^\\circ - \\alpha) = \\sin\\alpha$, còn lại đổi dấu: $\\cos(180^\\circ - \\alpha) = -\\cos\\alpha$, $\\tan(180^\\circ - \\alpha) = -\\tan\\alpha$, $\\cot(180^\\circ - \\alpha) = -\\cot\\alpha$.\n• Hai góc phụ nhau ($\\alpha$ và $90^\\circ - \\alpha$): chéo nhau! $\\sin(90^\\circ - \\alpha) = \\cos\\alpha$, $\\cos(90^\\circ - \\alpha) = \\sin\\alpha$, $\\tan(90^\\circ - \\alpha) = \\cot\\alpha$, $\\cot(90^\\circ - \\alpha) = \\tan\\alpha$.',
    canhGioiMo: 'trucCo',
    dieuKienMo: 'vaoCanhGioi',
  },
  {
    ma: 'tc_hang_dang_thuc',
    tang: 2,
    muc: 'congThuc',
    tieuDe: 'Các hằng đẳng thức lượng giác cơ bản',
    noiDung:
      '• $\\sin^2\\alpha + \\cos^2\\alpha = 1$\n• $\\tan\\alpha \\cdot \\cot\\alpha = 1$ (với $\\alpha \\ne 0^\\circ, 90^\\circ, 180^\\circ$)\n• $1 + \\tan^2\\alpha = \\dfrac{1}{\\cos^2\\alpha}$ ($\\alpha \\ne 90^\\circ$)\n• $1 + \\cot^2\\alpha = \\dfrac{1}{\\sin^2\\alpha}$ ($\\alpha \\ne 0^\\circ, 180^\\circ$)',
    canhGioiMo: 'trucCo',
    dieuKienMo: 'vaoCanhGioi',
  },
  {
    ma: 'tc_vi_du_mau',
    tang: 2,
    muc: 'viDuMau',
    tieuDe: 'Ví dụ mẫu: Tính bộ giá trị khi biết một giá trị',
    noiDung:
      'Cho $\\sin\\alpha = \\dfrac{3}{5}$ và $90^\\circ < \\alpha < 180^\\circ$. Tính $\\cos\\alpha, \\tan\\alpha$.\nGiải: Ta có $\\cos^2\\alpha = 1 - \\sin^2\\alpha = 1 - \\dfrac{9}{25} = \\dfrac{16}{25}$. Vì $\\alpha$ tù nên $\\cos\\alpha < 0 \\Rightarrow \\cos\\alpha = -\\dfrac{4}{5}$. Suy ra $\\tan\\alpha = \\dfrac{\\sin\\alpha}{\\cos\\alpha} = -\\dfrac{3}{4}$.',
    canhGioiMo: 'trucCo',
    dieuKienMo: 'quaTrungKy',
  },
  {
    ma: 'tc_loi_thuong_gap',
    tang: 2,
    muc: 'loiThuongGap',
    tieuDe: 'Lỗi thường gặp: Quên xét điều kiện góc tù khi khai căn',
    noiDung:
      'Từ $\\cos^2\\alpha = \\dfrac{16}{25}$ luôn có hai khả năng $\\pm\\dfrac{4}{5}$. Phải kiểm tra đề cho $0^\\circ < \\alpha < 90^\\circ$ (chọn dấu $+$) hay $90^\\circ < \\alpha < 180^\\circ$ (chọn dấu $-$).',
    canhGioiMo: 'trucCo',
    dieuKienMo: 'quaHauKy',
  },

  // TANG 3: KIM DAN
  {
    ma: 'kd_dinh_li_cosin',
    tang: 3,
    muc: 'congThuc',
    tieuDe: 'Định lí côsin trong tam giác ABC',
    noiDung:
      'Trong tam giác $ABC$ có độ dài các cạnh $BC = a, AC = b, AB = c$:\n$$a^2 = b^2 + c^2 - 2bc\\cos A$$\n$$b^2 = a^2 + c^2 - 2ac\\cos B$$\n$$c^2 = a^2 + b^2 - 2ab\\cos C$$',
    hinhVe: {
      loai: 'tamGiac',
      dinh: ['A', 'B', 'C'],
      doDaiCanh: [7, 5, 6],
      hienCanh: ['a', 'b', 'c'],
      hienGoc: ['A', '', ''],
    },
    canhGioiMo: 'kimDan',
    dieuKienMo: 'vaoCanhGioi',
  },
  {
    ma: 'kd_he_qua_goc',
    tang: 3,
    muc: 'congThuc',
    tieuDe: 'Hệ quả Định lí côsin & nhận diện tam giác',
    noiDung:
      'Từ định lí côsin suy ra công thức tính góc khi biết 3 cạnh:\n$$\\cos A = \\frac{b^2 + c^2 - a^2}{2bc}$$\nNếu $b^2 + c^2 > a^2 \\Rightarrow A$ nhọn; nếu $b^2 + c^2 = a^2 \\Rightarrow A = 90^\\circ$; nếu $b^2 + c^2 < a^2 \\Rightarrow A$ tù.',
    canhGioiMo: 'kimDan',
    dieuKienMo: 'quaTrungKy',
  },
  {
    ma: 'kd_vi_du_do_dac',
    tang: 3,
    muc: 'viDuMau',
    tieuDe: 'Ví dụ thực tế: Đo khoảng cách qua hồ sương',
    noiDung:
      'Để đo khoảng cách $AB$ qua hồ nước, đặt điểm $C$ đo được $AC = 50\\text{ m}$, $BC = 80\\text{ m}$ và $\\widehat{ACB} = 60^\\circ$.\nÁp dụng định lí côsin: $AB^2 = 50^2 + 80^2 - 2\\cdot 50\\cdot 80\\cdot\\cos 60^\\circ = 2500 + 6400 - 4000 = 4900 \\Rightarrow AB = 70\\text{ m}$.',
    hinhVe: {
      loai: 'canhThucTe',
      mauCanh: 'khoangCachSong',
      nhanA: 'A',
      nhanB: 'B',
      nhanC: 'C',
      nhanCanh1: '50 m',
      nhanCanh2: '80 m',
      nhanGoc1: '60°',
    },
    canhGioiMo: 'kimDan',
    dieuKienMo: 'quaHauKy',
  },
  {
    ma: 'kd_loi_thuong_gap',
    tang: 3,
    muc: 'loiThuongGap',
    tieuDe: 'Lỗi thường gặp: Quên dấu trừ nhân cos góc tù',
    noiDung:
      'Khi $\\widehat{A} = 120^\\circ$, $\\cos 120^\\circ = -\\dfrac{1}{2}$ nên $-2bc\\cos 120^\\circ = +bc$ (dấu trừ gặp dấu âm thành cộng!). Không được viết nhầm thành $-bc$.',
    canhGioiMo: 'kimDan',
    dieuKienMo: 'haYeuVuong',
  },

  // TANG 4: NGUYEN ANH
  {
    ma: 'na_dinh_li_sin',
    tang: 4,
    muc: 'congThuc',
    tieuDe: 'Định lí sin & đường tròn ngoại tiếp tam giác',
    noiDung:
      'Trong tam giác $ABC$ bất kỳ với $R$ là bán kính đường tròn ngoại tiếp:\n$$\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R$$\nHệ quả: $a = 2R\\sin A$, $\\sin A = \\dfrac{a}{2R}$.',
    hinhVe: {
      loai: 'tamGiac',
      dinh: ['A', 'B', 'C'],
      doDaiCanh: [7, 5.5, 6],
      veThem: ['ngoaiTiep'],
      hienCanh: ['a', 'b', 'c'],
    },
    canhGioiMo: 'nguyenAnh',
    dieuKienMo: 'vaoCanhGioi',
  },
  {
    ma: 'na_meo_giai_goc',
    tang: 4,
    muc: 'meoNho',
    tieuDe: 'Mẹo phối hợp tổng 3 góc 180° với Định lí sin',
    noiDung:
      'Khi đề cho biết hai góc $B, C$ và một cạnh $a$, bước 1 luôn tính góc còn lại $A = 180^\\circ - (B + C)$, rồi bước 2 dùng $\\dfrac{b}{\\sin B} = \\dfrac{a}{\\sin A}$ để ra cạnh $b$ ngay!',
    canhGioiMo: 'nguyenAnh',
    dieuKienMo: 'quaTrungKy',
  },
  {
    ma: 'na_vi_du_chieu_cao',
    tang: 4,
    muc: 'viDuMau',
    tieuDe: 'Ví dụ thực tế: Đo chiều cao tiên tháp không tới chân',
    noiDung:
      'Từ hai điểm $A, B$ cách nhau $40\\text{ m}$ thẳng hàng với chân tháp $H$, đo được góc nâng đỉnh tháp $C$ là $\\widehat{CAH} = 30^\\circ$ và $\\widehat{CBH} = 45^\\circ$.\nTrong $\\triangle ABC$: $\\widehat{ACB} = 45^\\circ - 30^\\circ = 15^\\circ$. Theo định lí sin: $BC = \\dfrac{40\\sin 30^\\circ}{\\sin 15^\\circ}$, suy ra $CH = BC\\sin 45^\\circ \\approx 54{,}6\\text{ m}$.',
    hinhVe: {
      loai: 'canhThucTe',
      mauCanh: 'chieuCaoNui',
      nhanA: 'A',
      nhanB: 'B',
      nhanC: 'C',
      nhanCanh1: '40 m',
      nhanGoc1: '30°',
      nhanGoc2: '45°',
    },
    canhGioiMo: 'nguyenAnh',
    dieuKienMo: 'quaHauKy',
  },
  {
    ma: 'na_loi_thuong_gap',
    tang: 4,
    muc: 'loiThuongGap',
    tieuDe: 'Lỗi thường gặp: Nhầm 2R với R',
    noiDung:
      'Tỉ số $\\dfrac{a}{\\sin A}$ bằng đường kính $2R$, không phải bán kính $R$! Khi tính bán kính ngoại tiếp phải nhớ chia đôi: $R = \\dfrac{a}{2\\sin A}$.',
    canhGioiMo: 'nguyenAnh',
    dieuKienMo: 'haYeuVuong',
  },

  // TANG 5: HOA THAN
  {
    ma: 'ht_nam_cong_thuc',
    tang: 5,
    muc: 'congThuc',
    tieuDe: 'Năm công thức tính diện tích tam giác',
    noiDung:
      '1) $S = \\dfrac{1}{2} a h_a = \\dfrac{1}{2} b h_b = \\dfrac{1}{2} c h_c$\n2) $S = \\dfrac{1}{2} bc\\sin A = \\dfrac{1}{2} ac\\sin B = \\dfrac{1}{2} ab\\sin C$\n3) $S = \\dfrac{abc}{4R}$\n4) $S = p \\cdot r$ với $p = \\dfrac{a + b + c}{2}$ là nửa chu vi, $r$ là bán kính đường tròn nội tiếp\n5) Công thức Hê-rông: $S = \\sqrt{p(p-a)(p-b)(p-c)}$',
    hinhVe: {
      loai: 'tamGiac',
      dinh: ['A', 'B', 'C'],
      doDaiCanh: [7, 6, 5],
      veThem: ['duongCaoA', 'noiTiep'],
      hienCanh: ['a', 'b', 'c'],
    },
    canhGioiMo: 'hoaThan',
    dieuKienMo: 'vaoCanhGioi',
  },
  {
    ma: 'ht_vi_du_heron',
    tang: 5,
    muc: 'viDuMau',
    tieuDe: 'Ví dụ mẫu Hê-rông kinh điển: Tam giác 13 – 14 – 15',
    noiDung:
      'Cho tam giác có ba cạnh $a = 13, b = 14, c = 15$. Tính diện tích $S$, bán kính nội tiếp $r$ và đường cao $h_b$.\n• Nửa chu vi: $p = \\dfrac{13 + 14 + 15}{2} = 21$.\n• Hê-rông: $S = \\sqrt{21(21-13)(21-14)(21-15)} = \\sqrt{21 \\cdot 8 \\cdot 7 \\cdot 6} = \\sqrt{7056} = 84$.\n• Bán kính nội tiếp: $r = \\dfrac{S}{p} = \\dfrac{84}{21} = 4$. Đường cao: $h_b = \\dfrac{2S}{b} = \\dfrac{168}{14} = 12$.',
    canhGioiMo: 'hoaThan',
    dieuKienMo: 'quaTrungKy',
  },
  {
    ma: 'ht_meo_chon_cong_thuc',
    tang: 5,
    muc: 'meoNho',
    tieuDe: 'Mẹo chọn nhanh công thức diện tích phù hợp',
    noiDung:
      '• Biết 2 cạnh & góc xen giữa $\\rightarrow$ dùng $\\dfrac{1}{2}bc\\sin A$.\n• Biết 3 cạnh $\\rightarrow$ dùng Hê-rông.\n• Muốn tìm đường cao $h_a$ hay bán kính $r, R$ $\\rightarrow$ tính $S$ trước rồi rút $h_a = \\dfrac{2S}{a}$, $r = \\dfrac{S}{p}$, $R = \\dfrac{abc}{4S}$.',
    canhGioiMo: 'hoaThan',
    dieuKienMo: 'quaHauKy',
  },
  {
    ma: 'ht_loi_thuong_gap',
    tang: 5,
    muc: 'loiThuongGap',
    tieuDe: 'Lỗi thường gặp: Dùng chu vi thay cho nửa chu vi p',
    noiDung:
      'Trong $S = p\\cdot r$ và công thức Hê-rông, $p = \\dfrac{a+b+c}{2}$ là NỬA chu vi, không phải $a+b+c$! Và nhớ đường cao $h_a = \\dfrac{2S}{a}$ có hệ số $2$.',
    canhGioiMo: 'hoaThan',
    dieuKienMo: 'haYeuVuong',
  },

  // TANG 6: DO KIEP
  {
    ma: 'dk_giai_tam_giac',
    tang: 6,
    muc: 'congThuc',
    tieuDe: 'Ba trường hợp giải tam giác chuẩn',
    noiDung:
      '• Dạng 1 (c.g.c – biết 2 cạnh & góc xen giữa): dùng Định lí côsin tìm cạnh thứ 3 $\\rightarrow$ hệ quả côsin tìm góc thứ 2 $\\rightarrow$ góc thứ 3 $= 180^\\circ - (A+B)$.\n• Dạng 2 (g.c.g – biết 1 cạnh & 2 góc): tìm góc thứ 3 $= 180^\\circ - (B+C)$ $\\rightarrow$ Định lí sin tìm 2 cạnh còn lại.\n• Dạng 3 (c.c.c – biết 3 cạnh): hệ quả Định lí côsin tìm 2 góc $\\rightarrow$ góc thứ 3.',
    canhGioiMo: 'doKiep',
    dieuKienMo: 'vaoCanhGioi',
  },
  {
    ma: 'dk_meo_chuyen_do_dac',
    tang: 6,
    muc: 'meoNho',
    tieuDe: 'Chiến thuật giải bài toán tàu biển & định hướng',
    noiDung:
      'Bước 1: Vẽ phác tam giác với vị trí xuất phát $O$, hai vị trí sau $A, B$. Tính quãng đường $OA = v_1 \\cdot t$, $OB = v_2 \\cdot t$.\nBước 2: Xác định góc kẹp $\\widehat{AOB}$ giữa hai hướng đi (theo la bàn Bắc – Đông – Nam – Tây).\nBước 3: Áp dụng Định lí côsin tính khoảng cách $AB$.',
    hinhVe: {
      loai: 'canhThucTe',
      mauCanh: 'thuyenBien',
      nhanA: 'A',
      nhanB: 'B',
      nhanC: 'O',
      nhanCanh1: 'v₁t',
      nhanCanh2: 'v₂t',
      nhanGoc1: 'α',
    },
    canhGioiMo: 'doKiep',
    dieuKienMo: 'quaTrungKy',
  },
  {
    ma: 'dk_loi_thuong_gap',
    tang: 6,
    muc: 'loiThuongGap',
    tieuDe: 'Lỗi thường gặp: Làm tròn số quá sớm ở bước trung gian',
    noiDung:
      'Khi bài toán yêu cầu độ dài/góc cuối cùng chính xác đến $0{,}1$, hãy giữ ít nhất $3–4$ chữ số thập phân (hoặc giữ dạng căn thức) ở các bước tính trung gian.',
    canhGioiMo: 'doKiep',
    dieuKienMo: 'quaHauKy',
  },

  // TANG 7: DINH TANG
  {
    ma: 'dt_tong_hop_chuong_3',
    tang: 7,
    muc: 'tongHop',
    tieuDe: 'Sơ đồ đại thành Chương III · Hệ thức lượng trong tam giác',
    noiDung:
      '1. Giá trị lượng giác $[0^\\circ; 180^\\circ]$: $\\sin\\alpha = y_0 \\ge 0,\\; \\cos\\alpha = x_0$. Bù nhau giữ $\\sin$, phụ nhau chéo $\\sin\\leftrightarrow\\cos$.\n2. Định lí côsin: $a^2 = b^2 + c^2 - 2bc\\cos A \\Leftrightarrow \\cos A = \\dfrac{b^2+c^2-a^2}{2bc}$.\n3. Định lí sin: $\\dfrac{a}{\\sin A} = \\dfrac{b}{\\sin B} = \\dfrac{c}{\\sin C} = 2R$.\n4. Diện tích: $S = \\dfrac{1}{2}bc\\sin A = \\dfrac{abc}{4R} = p\\cdot r = \\sqrt{p(p-a)(p-b)(p-c)}$.',
    canhGioiMo: 'doKiep',
    dieuKienMo: 'hoanThanhChuong',
  },
];
