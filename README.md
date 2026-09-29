<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<h1 align="center">PrepareForTraining - KBase (Frontend)</h1>

<p align="center">
  <strong>Giao diện người dùng cho Hệ thống Quản trị Tri thức KBase</strong><br>
  <i>Xây dựng bằng React & Vite với tốc độ siêu tốc, thiết kế hiện đại (Modern UI/UX) và bảo mật dữ liệu tuyệt đối.</i>
</p>

---

## 📖 Giới thiệu (Overview)

Đóng vai trò là cửa sổ tương tác chính của KBase, **Frontend** được tối ưu hóa để xử lý hàng ngàn tài liệu mượt mà, cung cấp trải nghiệm kéo-thả (Drag & Drop) thông minh và khả năng hiển thị thời gian thực. Toàn bộ mã nguồn được chuẩn hóa với **TypeScript**, đảm bảo an toàn kiểu dữ liệu (Type Safety) từ Frontend đến Backend.

## ✨ Tính năng nổi bật (Key Features)

- 🎨 **Giao diện hiện đại (Modern UI):** Thiết kế bóng bẩy, trực quan, hỗ trợ hiệu ứng mượt mà với TailwindCSS.
- ⚡ **Tốc độ cực nhanh:** Build và Hot-Reload siêu tốc nhờ sức mạnh của Vite.
- 🔐 **Bảo mật trạng thái (State Security):** Quản lý JWT Token an toàn, tích hợp cơ chế tự động làm mới hoặc đăng xuất khi phiên làm việc hết hạn.
- 🗂 **Quản lý dữ liệu thông minh:**
  - Tích hợp Modal và Popover linh hoạt.
  - Phân trang (Pagination) và Lọc (Filtering/Sorting) tức thì.
- 🤖 **Chatbot AI (Sắp ra mắt):** Nền tảng giao diện đã sẵn sàng tích hợp cửa sổ chat AI thông minh để truy vấn tài liệu.

## 🛠 Tech Stack (Công nghệ sử dụng)

- **Core:** React 18, TypeScript, Vite
- **Styling:** TailwindCSS, Lucide React (Icons)
- **Routing:** React Router v6
- **Forms & Validation:** React Hook Form
- **Code Quality:** ESLint, Prettier

## 🚀 Hướng dẫn Cài đặt (Getting Started)

### Yêu cầu hệ thống (Prerequisites)
- [Node.js](https://nodejs.org/en/) phiên bản 18+ trở lên.

### Các bước khởi chạy (Run Locally)

**1. Clone mã nguồn và cài đặt thư viện**
Mở Terminal tại thư mục gốc của frontend và chạy lệnh:
```bash
npm install
```

**2. Thiết lập Biến môi trường (Environment Variables)**
Copy file `.env.example` thành `.env`:
```bash
cp .env.example .env
```
Đảm bảo biến `VITE_API_BASE_URL` trỏ đúng vào Backend (mặc định: `http://localhost:8080/api/v1`).

**3. Khởi chạy ứng dụng**
Khởi động máy chủ phát triển (Development Server):
```bash
npm run dev
```

**4. Trải nghiệm ứng dụng**
Truy cập vào [http://localhost:5173](http://localhost:5173) trên trình duyệt của bạn.

## 📚 Tài liệu Hướng dẫn Code (Documentation)

Để giúp các lập trình viên mới dễ dàng tham gia dự án, chúng tôi đã chuẩn bị sẵn tài liệu điều hướng codebase:

- 🧭 **[Bản đồ Code Frontend (README_CODE_FE.md)](./README_CODE_FE.md):** Hướng dẫn cấu trúc thư mục, luồng hoạt động của React Router, Services, Components và cách kết nối với Backend.

> Lưu ý: Tài liệu thiết kế hệ thống chi tiết (PRD, SRS, SDD, Database, API Contract) được đặt tại thư mục `docs/`.

---
*Phát triển bởi đội ngũ KBase.*
