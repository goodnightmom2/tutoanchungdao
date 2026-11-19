import React from 'react';
import { CuonThuGiayDo, NutLenhBai } from './KhungGiaoDien';

export type LoaiQuyDinh = 'quyDinh' | 'quyenRiengTu';

export const CuonThuQuyDinh: React.FC<{
  loai: LoaiQuyDinh | null;
  khiDong: () => void;
}> = ({ loai, khiDong }) => {
  if (!loai) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4"
      onClick={khiDong}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tieu-de-quy-dinh"
        className="w-full max-w-xl max-h-[85dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CuonThuGiayDo>
          <div className="space-y-4 text-left">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="dau-an-trang-tri text-xs font-bold uppercase text-[#8F1F1A]">
                  Môn Quy · Tu Toán Chứng Đạo
                </div>
                <h2
                  id="tieu-de-quy-dinh"
                  className="font-serif text-2xl font-bold text-[#2B2118] mt-0.5"
                >
                  {loai === 'quyDinh'
                    ? 'Quy Định Sử Dụng'
                    : 'Chính Sách Quyền Riêng Tư'}
                </h2>
              </div>
              <button
                type="button"
                onClick={khiDong}
                className="min-h-[36px] px-3 rounded-lg border border-[#B98B2E]/50 bg-[#FFF8E8] text-xs font-semibold text-[#6B3B2A] hover:bg-[#F2E2BA] cursor-pointer"
              >
                Đóng
              </button>
            </div>

            {loai === 'quyDinh' ? (
              <div className="space-y-2.5 text-sm text-[#2B2118]/90 leading-relaxed">
                <p>
                  1. <strong>Mục đích học tập:</strong> “Tu Toán Chứng Đạo” là trò chơi hỗ trợ học sinh lớp 10 ôn luyện Chương III – Hệ thức lượng trong tam giác. Điểm số, số sao và thứ hạng chỉ mang tính khích lệ học tập, không thay thế điểm kiểm tra chính thức.
                </p>
                <p>
                  2. <strong>Đạo hiệu văn minh:</strong> Không đặt Đạo hiệu chứa từ ngữ thô tục, phản cảm, mạo danh thầy/cô hoặc Quản trị viên.
                </p>
                <p>
                  3. <strong>Bảo mật tài khoản:</strong> Mỗi học sinh tự bảo quản mật khẩu của mình. Nếu dùng máy tính phòng tin học hoặc máy mượn, hãy bật mục “Đây là máy dùng chung” và đăng xuất sau khi học xong.
                </p>
                <p>
                  4. <strong>Công bằng khi tu luyện:</strong> Không can thiệp kỹ thuật để gian lận số sao hay kết quả. Quản trị viên có quyền tạm khóa tài khoản vi phạm môn quy.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 text-sm text-[#2B2118]/90 leading-relaxed">
                <p>
                  1. <strong>Dữ liệu được lưu:</strong> Ứng dụng chỉ lưu Đạo hiệu, tên đăng nhập (hoặc thư điện tử nếu bạn cung cấp), lớp (tùy chọn), tiến trình tu luyện (cảnh giới, sao, túi đồ, ngoại hình) và lịch sử lượt làm bài để đồng bộ giữa các thiết bị.
                </p>
                <p>
                  2. <strong>Ai được xem dữ liệu của bạn:</strong> Tiến trình cá nhân chỉ hiển thị với chính bạn và Thầy/Cô có quyền Quản trị viên nhằm hỗ trợ việc học.
                </p>
                <p>
                  3. <strong>Thiên Bảng (Bảng xếp hạng):</strong> Chỉ hiển thị công khai Đạo hiệu, cảnh giới và tổng số sao — tuyệt đối không lộ tên đăng nhập, thư điện tử hay lớp. Bạn có thể tắt hiển thị tên mình bất cứ lúc nào trong mục Tài khoản.
                </p>
                <p>
                  4. <strong>Quyền xóa tài khoản:</strong> Bạn có thể tự xóa tài khoản cùng toàn bộ dữ liệu học tập của mình bất cứ lúc nào trong bảng Tài khoản.
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <NutLenhBai type="button" kieu="ngoc" onClick={khiDong}>
                Đã rõ
              </NutLenhBai>
            </div>
          </div>
        </CuonThuGiayDo>
      </div>
    </div>
  );
};
