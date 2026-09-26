# Bản đồ Code (Codebase Map) - PrepareForTraining Frontend

Chào bạn, đây là tài liệu hướng dẫn nhanh để giúp bạn hiểu cấu trúc thư mục của **Frontend React / Vite**. 

Trong React (đặc biệt là theo chuẩn của dự án KBase), mọi thứ được chia nhỏ thành các Component độc lập và kết nối với Backend thông qua các Service. Bạn chỉ cần nắm được công dụng của từng thư mục dưới đây:

---

## 1. Các thư mục cốt lõi chứa Thuật toán & Gọi API (Đã có comment)
Nơi xử lý luồng chạy chính, nơi mà Frontend "nói chuyện" với Backend.

- 📂 **`src/services`** (Tầng kết nối Backend - *Đã comment tiếng Việt*)
  - Nơi chứa toàn bộ lệnh gọi API (Fetch) lên máy chủ Spring Boot. 
  - **`apiClient.ts`**: Cốt lõi của mọi request. Đây là hàm tự động thêm `Bearer Token` vào Header để xác thực người dùng.
  - **`authService.ts`**: Chứa các hàm liên quan đến Tài khoản (Login, Register, Quên MK, Đổi tên).
  - **`projectService.ts`**: Chứa các hàm Quản lý dự án, File tài liệu và cả tích hợp AI Chatbot.

---

## 2. Các thư mục chứa Giao diện (Màn hình hiển thị)
Nơi vẽ ra giao diện web bằng HTML (JSX) và TailwindCSS.

- 📂 **`src/pages`** (Các trang chính)
  - Ví dụ: `DashboardPage.tsx` (Trang chủ sau khi đăng nhập), `LoginPage.tsx` (Trang đăng nhập), `ProjectPage.tsx` (Trang chi tiết của 1 dự án).
  - Nơi đây sẽ gọi các hàm từ thư mục `services` để lấy dữ liệu, sau đó truyền xuống cho các Component nhỏ hơn vẽ ra màn hình.
  - *Lưu ý: Bạn có thể đọc comment trong **`admin/AdminDashboardPage.tsx`** để hiểu cách 1 Page xử lý dữ liệu ra sao.*

- 📂 **`src/components`** (Các mảnh ghép giao diện)
  - Đây là các thành phần giao diện nhỏ, được tách ra để dùng lại nhiều lần. (Ví dụ: Nút bấm `Button`, Cửa sổ bật lên `Modal`, Khung kéo thả file `Dropzone`).
  - *Lưu ý: Bạn có thể xem **`common/AppShell.tsx`** (Đã có comment tiếng Việt) để hiểu cách tạo Modal đổi mật khẩu.*

---

## 3. Các thư mục chuẩn mẫu định nghĩa (Boilerplate)
Nơi định nghĩa cấu trúc dữ liệu để TypeScript kiểm tra lỗi.

- 📂 **`src/types`**
  - Giống như thư mục `dto` bên Backend. Nơi đây định nghĩa "hình thù" của các cục dữ liệu. (Ví dụ: `User` thì phải có `id`, `email`, `role`). 
  - File này chỉ chứa cấu trúc (interface), không chứa code chạy.

- 📂 **`src/store`** (Tùy chọn)
  - Nếu có sử dụng thư viện như Zustand/Redux để quản lý State toàn cục (Lưu dữ liệu dùng chung cho nhiều trang).

---
**💡 Mẹo học nhanh:** Khi bạn tò mò một nút bấm trên màn hình hoạt động ra sao (Ví dụ: Nút "Tạo dự án"), hãy mở **`pages`** tìm cái nút đó -> Xem nó gọi hàm gì bên **`services`** -> Và sang Backend xem **`ProjectService.java`** xử lý hàm đó như thế nào. Đó là cách các Fullstack Developer kiểm soát hệ thống!
