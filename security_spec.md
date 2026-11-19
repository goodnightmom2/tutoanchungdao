# Đặc Tả Bảo Mật Firestore · Tu Toán Chứng Đạo

## 1. Bất biến dữ liệu (Data Invariants)
1. **Cách ly danh tính (PII Isolation)**: `nguoiDung/{uid}`, `tienTrinh/{uid}`, `lichSu/{uid}` chỉ có chủ tài khoản (`request.auth.uid == uid`) hoặc quản trị viên đã xác thực mới được đọc.
2. **Phân quyền không tin vào trình duyệt**: Vai trò quản trị không lưu trong tài liệu người dùng tự sửa được; chỉ xác định qua email Google đã xác minh trùng `nhannghia171004@gmail.com` hoặc sự tồn tại của `quanTriVien/{uid}`.
3. **Chặn tài khoản bị khóa**: Mọi thao tác ghi vào `nguoiDung`, `tienTrinh`, `lichSu`, `ketQuaLuot`, `bangXepHang` đều bị từ chối khi tồn tại `khoaTaiKhoan/{request.auth.uid}`.
4. **Ràng buộc biên số & chống trường ma (`hasOnly`)**:
   - `tongSao`: `0 <= tongSao <= 72`
   - `sao` mỗi lượt/giai đoạn: `0 <= sao <= 3`
   - `linhThach` và `linhKhi`: `0 <= giaTri <= 1000000`
   - `daoHieu`: chuỗi 2–20 ký tự; `tenDangNhap`: 4–20 ký tự khớp `^[a-z0-9_]+$`
   - `ketQuaLuot.chiTiet`: mảng tối đa 25 mục; chỉ cho phép tạo mới (không sửa/xóa bởi học sinh).
5. **Bất biến nhật ký quản trị**: `nhatKyQuanTri` chỉ cho quản trị viên đọc và tạo mới; nghiêm cấm `update` và `delete` với mọi tài khoản.
6. **Toàn vẹn thời gian**: Các trường `taoLuc`, `capNhatLuc`, `luc` yêu cầu `== request.time` khi tạo/cập nhật.

## 2. Mười hai gói dữ liệu tấn công ("Dirty Dozen") phải bị từ chối (`PERMISSION_DENIED`)
1. **Đọc trộm hồ sơ người khác**: Học sinh `uidA` gọi `get(/nguoiDung/uidB)` → TỪ CHỐI.
2. **Liệt kê danh sách người dùng**: Học sinh `uidA` gọi `list(/nguoiDung)` → TỪ CHỐI.
3. **Tự phong Quản trị viên**: Học sinh `uidA` ghi `/quanTriVien/uidA` → TỪ CHỐI.
4. **Giả mạo email quản trị chưa xác minh**: Token có `email: 'nhannghia171004@gmail.com'` nhưng `email_verified: false` đọc `/nhatKyQuanTri` → TỪ CHỐI.
5. **Chèn trường ma (Shadow Field)**: Học sinh `uidA` gửi thêm `laQuanTri: true` vào `/nguoiDung/uidA` → TỪ CHỐI (`hasOnly`).
6. **Tự sửa sao vượt biên**: Học sinh `uidA` gửi `tomTat.tongSao: 999` hoặc `bangXepHang.tongSao: 73` → TỪ CHỐI.
7. **Tự chỉnh linh thạch âm / quá ngưỡng**: Học sinh `uidA` gửi `duLieu.linhThach: -50` hoặc `99999999` vào `/tienTrinh/uidA` → TỪ CHỐI.
8. **Ghi sau khi bị khóa tài khoản**: Tài khoản có `/khoaTaiKhoan/uidA` cố cập nhật `/tienTrinh/uidA` hoặc tạo `/ketQuaLuot` → TỪ CHỐI.
9. **Giả mạo lượt chơi của người khác**: Học sinh `uidA` tạo `/ketQuaLuot/luot1` với `uid: 'uidB'` → TỪ CHỐI.
10. **Sửa hoặc xóa nhật ký lượt chơi**: Học sinh `uidA` gọi `update`/`delete` lên `/ketQuaLuot/luot1` của chính mình → TỪ CHỐI.
11. **Phình mảng chi tiết vượt giới hạn**: Học sinh `uidA` tạo `/ketQuaLuot` với `chiTiet` gồm 30 phần tử (> 25) → TỪ CHỐI.
12. **Sửa/xóa nhật ký quản trị**: Ngay cả Quản trị viên cố gọi `update` hoặc `delete` trên `/nhatKyQuanTri/nk1` → TỪ CHỐI.
