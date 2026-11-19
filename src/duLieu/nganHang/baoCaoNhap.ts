export interface BaoCaoTepPdf {
  tenTep: string;
  tenHienThi: string;
  tongTrang: number;
  trangDaDoc: number;
  trangBoQuaHoacNgoaiChuong: string;
  trangLoiScan: string;
  soCauTrichXuat: number;
  ghiChu: string;
}

export interface MucBoQuaPdf {
  tep: string;
  trang: number | string;
  soBai: string;
  lyDo: string;
}

export interface BaoCaoNhapPdf {
  tongSoTep: number;
  ngayKiemDuyet: string;
  tepNguon: BaoCaoTepPdf[];
  danhSachBoQua: MucBoQuaPdf[];
}

export const BAO_CAO_NHAP_PDF: BaoCaoNhapPdf = {
  tongSoTep: 20,
  ngayKiemDuyet: '18/11/2026',
  tepNguon: [
    {
      tenTep: '1_b221520d.pdf',
      tenHienThi: '1.pdf (Đề test số 01 · Bài 1)',
      tongTrang: 4,
      trangDaDoc: 4,
      trangBoQuaHoacNgoaiChuong: 'Không',
      trangLoiScan: 'Không',
      soCauTrichXuat: 8,
      ghiChu: 'Đủ 12 TN + 4 Đ/S + 6 TLN kèm lời giải; đã chọn lọc các câu đặc trưng về GTLG 0°–180°.',
    },
    {
      tenTep: '2_1e8a60ae.pdf',
      tenHienThi: '2.pdf (Đề ôn số 1, 2, 3 · Bài 1)',
      tongTrang: 9,
      trangDaDoc: 9,
      trangBoQuaHoacNgoaiChuong: 'Không',
      trangLoiScan: 'Không',
      soCauTrichXuat: 8,
      ghiChu: 'Đã đối chiếu lại lời giải Đề 2 Câu 1 & 14c tránh lỗi đánh máy chữ cái trong đáp án gốc.',
    },
    {
      tenTep: '3_bd501052.pdf',
      tenHienThi: '3.pdf (Định lí Côsin – Sin & Ứng dụng)',
      tongTrang: 4,
      trangDaDoc: 4,
      trangBoQuaHoacNgoaiChuong: 'Không',
      trangLoiScan: 'Không',
      soCauTrichXuat: 8,
      ghiChu: 'Bộ đề chuẩn về Côsin, Sin và công thức diện tích.',
    },
    {
      tenTep: '4_28ebdcf2.pdf',
      tenHienThi: '4.pdf (Giải tam giác & Thực tế)',
      tongTrang: 5,
      trangDaDoc: 5,
      trangBoQuaHoacNgoaiChuong: 'Không',
      trangLoiScan: 'Không',
      soCauTrichXuat: 7,
      ghiChu: 'Các bài toán thực tế đo chiều cao tháp, khinh khí cầu, dây neo sườn dốc, máy bay.',
    },
    {
      tenTep: '5_59b8d7d8.pdf',
      tenHienThi: '5.pdf (Đề tổng hợp Chương III)',
      tongTrang: 5,
      trangDaDoc: 5,
      trangBoQuaHoacNgoaiChuong: 'Không',
      trangLoiScan: 'Không',
      soCauTrichXuat: 9,
      ghiChu: 'Phong phú về Heron, trung tuyến và ứng dụng khoảng cách tàu biển.',
    },
    {
      tenTep: '6_583dbb58.pdf',
      tenHienThi: '6.pdf (Đề ôn số 03)',
      tongTrang: 13,
      trangDaDoc: 13,
      trangBoQuaHoacNgoaiChuong: 'Trang 4 (Câu 19 chứng minh)',
      trangLoiScan: 'Câu 16 (cos α = 4/3 > 1)',
      soCauTrichXuat: 9,
      ghiChu: 'Đã loại bỏ Câu 16 vô nghiệm do lỗi đề gốc cos α = 4/3 > 1 và bài chứng minh Câu 19.',
    },
    {
      tenTep: '7_1975a155.pdf',
      tenHienThi: '7.pdf (Đề ôn số 04)',
      tongTrang: 12,
      trangDaDoc: 12,
      trangBoQuaHoacNgoaiChuong: 'Không',
      trangLoiScan: 'Câu 11 (bảng đáp án ghi D, lời giải chuẩn 85/8)',
      soCauTrichXuat: 9,
      ghiChu: 'Đã hiệu chỉnh Câu 11 dùng đáp án kiểm chứng 85/8 khớp lời giải chi tiết.',
    },
    {
      tenTep: '8_fdb0e6cb.pdf',
      tenHienThi: '8.pdf (Đề ôn tập số 06)',
      tongTrang: 12,
      trangDaDoc: 12,
      trangBoQuaHoacNgoaiChuong: 'Không',
      trangLoiScan: 'Câu 9 (sin 80° = sin 120° sai), Câu 10 trùng phương án',
      soCauTrichXuat: 9,
      ghiChu: 'Đã loại Câu 9 lỗi kiến thức trong đề gốc và chuẩn hóa phương án Câu 10.',
    },
    {
      tenTep: '9_21cdce69.pdf',
      tenHienThi: '9.pdf (Đề tổng hợp nâng cao)',
      tongTrang: 15,
      trangDaDoc: 15,
      trangBoQuaHoacNgoaiChuong: 'Không',
      trangLoiScan: 'Câu 20 dư dòng chú thích AC=21m',
      soCauTrichXuat: 8,
      ghiChu: 'Khai thác tốt các bài đo chiều cao tháp, diện tích ngoại tiếp và góc bù.',
    },
    {
      tenTep: '10_12b1b342.pdf',
      tenHienThi: '10.pdf (Đề kiểm tra cuối chương)',
      tongTrang: 17,
      trangDaDoc: 17,
      trangBoQuaHoacNgoaiChuong: 'Không',
      trangLoiScan: 'Câu 21 lệch số căn giữa đề và lời giải',
      soCauTrichXuat: 7,
      ghiChu: 'Chỉ giữ các câu đã kiểm chứng khớp giữa giả thiết và đáp án.',
    },
    {
      tenTep: 'KNTT-SGK_1ee17597.pdf',
      tenHienThi: 'KNTT-SGK.pdf (Toán 10 KNTT · Chương III)',
      tongTrang: 13,
      trangDaDoc: 13,
      trangBoQuaHoacNgoaiChuong: 'Bài 3.5, 3.13, 3.14, 3.16 (chứng minh tự luận)',
      trangLoiScan: 'Không',
      soCauTrichXuat: 11,
      ghiChu: 'Sách giáo khoa chuẩn (trang 32–44): Bài 5, Bài 6 và Bài tập cuối chương III.',
    },
    {
      tenTep: 'KHTT-SBT_56221071.pdf',
      tenHienThi: 'KHTT-SBT.pdf (Sách bài tập KNTT · Chương III)',
      tongTrang: 16,
      trangDaDoc: 16,
      trangBoQuaHoacNgoaiChuong: 'Các bài chứng minh thuần túy',
      trangLoiScan: 'Không',
      soCauTrichXuat: 10,
      ghiChu: 'Các ví dụ và bài tập tính toán trọng tâm (trang 29–44).',
    },
    {
      tenTep: 'CD-SGK_c9eb611b.pdf',
      tenHienThi: 'CD-SGK.pdf (Toán 10 Cánh Diều · Chương IV)',
      tongTrang: 44,
      trangDaDoc: 17,
      trangBoQuaHoacNgoaiChuong: 'Trang 12–39 (§3–§6 Vectơ thuộc Chương IV)',
      trangLoiScan: 'Không',
      soCauTrichXuat: 9,
      ghiChu: 'Chỉ trích xuất §1–§2 Hệ thức lượng và phần đáp án cuối sách (trang 1–12, 39–44).',
    },
    {
      tenTep: 'CD-SBT_5168424c.pdf',
      tenHienThi: 'CD-SBT.pdf (Bản tải trùng CD-SGK)',
      tongTrang: 44,
      trangDaDoc: 44,
      trangBoQuaHoacNgoaiChuong: 'Toàn bộ tệp (nội dung trùng hoàn toàn CD-SGK)',
      trangLoiScan: 'Không',
      soCauTrichXuat: 0,
      ghiChu: 'Nhận diện trùng nội dung 100% với CD-SGK_c9eb611b.pdf nên không nhập lặp.',
    },
    {
      tenTep: 'CTST-SGK_4daa7058.pdf',
      tenHienThi: 'CTST-SGK.pdf (Chân Trời Sáng Tạo · Chương IV)',
      tongTrang: 20,
      trangDaDoc: 20,
      trangBoQuaHoacNgoaiChuong: 'Các bài chứng minh bất đẳng thức tam giác',
      trangLoiScan: 'Không',
      soCauTrichXuat: 10,
      ghiChu: 'Khai thác đầy đủ Bài 1–3 và bài tập cuối chương (trang 60–79 gốc).',
    },
    {
      tenTep: 'CTST-SBT_6e22d0c2.pdf',
      tenHienThi: 'CTST-SBT.pdf (Bản tải trùng CTST-SGK)',
      tongTrang: 20,
      trangDaDoc: 20,
      trangBoQuaHoacNgoaiChuong: 'Toàn bộ tệp (nội dung trùng hoàn toàn CTST-SGK)',
      trangLoiScan: 'Không',
      soCauTrichXuat: 0,
      ghiChu: 'Nhận diện trùng nội dung 100% với CTST-SGK_4daa7058.pdf nên không nhập lặp.',
    },
    {
      tenTep: '0C4B1.-Gi_-tr_-l__ng-gi_c-m_t-g_c-t_-0-180_fd168603.pdf',
      tenHienThi: '0C4B1 (Chuyên đề GTLG góc 0°–180°)',
      tongTrang: 25,
      trangDaDoc: 25,
      trangBoQuaHoacNgoaiChuong: 'Trang 25 (mục mẫu chưa điền "…") & bài chứng minh thuần',
      trangLoiScan: 'Không',
      soCauTrichXuat: 11,
      ghiChu: 'Tuyển chọn bài tập GTLG, rút gọn và tính giá trị theo tan/cot.',
    },
    {
      tenTep: '0C4B2.-__nh-l_-cosin-__nh-l_-sin_b3f97574.pdf',
      tenHienThi: '0C4B2 (Chuyên đề Định lí Côsin – Sin)',
      tongTrang: 30,
      trangDaDoc: 30,
      trangBoQuaHoacNgoaiChuong: 'Trang 30 (mục mẫu "…") & chứng minh đẳng thức dài',
      trangLoiScan: 'Không',
      soCauTrichXuat: 15,
      ghiChu: 'Nguồn phong phú nhất cho Côsin, Sin, trung tuyến, diện tích và công thức r, h_c.',
    },
    {
      tenTep: '0C4B3.-Gi_i-tam-gi_c-_ng-d_ng_829acff2.pdf',
      tenHienThi: '0C4B3 (Chuyên đề Giải tam giác & Ứng dụng)',
      tongTrang: 29,
      trangDaDoc: 29,
      trangBoQuaHoacNgoaiChuong: 'Các dòng trống khung bài tập',
      trangLoiScan: 'Không',
      soCauTrichXuat: 9,
      ghiChu: 'Đối chiếu đáp án với SGK để chọn các bài đo đạc thực tế chuẩn xác.',
    },
    {
      tenTep: '0C4B4.-_n-t_p-ch__ng-IV_712e7a9a.pdf',
      tenHienThi: '0C4B4 (Ôn tập Hệ thức lượng)',
      tongTrang: 22,
      trangDaDoc: 22,
      trangBoQuaHoacNgoaiChuong: 'Không',
      trangLoiScan: 'Câu 18 lặp nhãn phương án',
      soCauTrichXuat: 9,
      ghiChu: 'Các câu trắc nghiệm và bài tập tổng hợp nhiều bước.',
    },
  ],
  danhSachBoQua: [
    {
      tep: '6_583dbb58.pdf',
      trang: 3,
      soBai: 'Câu 16',
      lyDo: 'Đề gốc cho cos α = 4/3 > 1, vô nghiệm toán học.',
    },
    {
      tep: '6_583dbb58.pdf',
      trang: 4,
      soBai: 'Câu 19',
      lyDo: 'Bài tự luận chứng minh đẳng thức thuần túy, không phù hợp dạng chấm trắc nghiệm/điền số.',
    },
    {
      tep: '8_fdb0e6cb.pdf',
      trang: 2,
      soBai: 'Câu 9',
      lyDo: 'Đề gốc ghi đáp án sin 80° = sin 120° là sai (80° + 120° = 200° ≠ 180°).',
    },
    {
      tep: '10_12b1b342.pdf',
      trang: 4,
      soBai: 'Câu 21',
      lyDo: 'Số liệu trong đề (3√17) không khớp với lời giải bên dưới (3√37).',
    },
    {
      tep: 'CD-SGK_c9eb611b.pdf',
      trang: '12–39',
      soBai: '§3–§6 Vectơ',
      lyDo: 'Thuộc phạm vi Chương IV (Vectơ — sắp mở), nằm ngoài Chương III Hệ thức lượng.',
    },
    {
      tep: 'CD-SBT_5168424c.pdf',
      trang: '1–44',
      soBai: 'Toàn bộ tệp',
      lyDo: 'Tệp tải lên trùng hoàn toàn nội dung với CD-SGK_c9eb611b.pdf.',
    },
    {
      tep: 'CTST-SBT_6e22d0c2.pdf',
      trang: '1–20',
      soBai: 'Toàn bộ tệp',
      lyDo: 'Tệp tải lên trùng hoàn toàn nội dung với CTST-SGK_4daa7058.pdf.',
    },
    {
      tep: '0C4B1 & 0C4B2',
      trang: '25, 30',
      soBai: 'Các mục "…"',
      lyDo: 'Dòng bài tập mẫu chưa có số liệu cụ thể trong bản PDF.',
    },
    {
      tep: 'KNTT-SGK_1ee17597.pdf',
      trang: '36–44',
      soBai: 'Bài 3.5, 3.13, 3.14, 3.16',
      lyDo: 'Bài tập chứng minh hình học thuần túy, không quy về giá trị số hoặc trắc nghiệm khách quan.',
    },
    {
      tep: '0C4B4.-Ôn-tập-chương-IV.pdf',
      trang: 11,
      soBai: 'Câu 18',
      lyDo: 'Lỗi in ấn lặp nhãn phương án trong bản gốc.',
    },
  ],
};
