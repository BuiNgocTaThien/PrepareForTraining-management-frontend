import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="scroll-smooth bg-background text-on-surface antialiased">
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]"><div className="h-20 max-w-7xl mx-auto px-margin flex items-center justify-between gap-space-lg"><div className="flex items-center gap-space-md shrink-0"><img src="/logo.svg" alt="PrepareForTraining Logo" className="h-8 w-auto" /><a className="font-headline-sm text-headline-sm text-text-heading tracking-tight" data-path="landing-page" href="#">PrepareForTraining</a></div><nav className="hidden lg:flex items-center gap-space-xs" data-active-classes="bg-primary-container text-on-primary-container font-headline-sm text-label-md rounded-lg"><a className="px-space-md py-space-sm font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors rounded-lg" data-path="tinh-nang" href="#tinh-nang">Tính năng</a><a className="px-space-md py-space-sm font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors rounded-lg" data-path="trien-khai" href="#trien-khai">Triển khai</a><a className="px-space-md py-space-sm font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors rounded-lg" data-path="chuyen-gia" href="#chuyen-gia">Chuyên gia</a></nav><div className="flex items-center gap-space-md shrink-0"><Link className="hidden sm:inline-flex items-center justify-center px-space-md py-space-sm font-label-md text-label-md text-text-heading hover:text-primary transition-colors" to="/login">Đăng nhập</Link><Link className="inline-flex items-center justify-center px-space-lg py-space-sm rounded-xl font-label-md text-label-md bg-inverse-surface text-inverse-on-surface hover:bg-secondary transition-all shadow-[0_2px_6px_0_rgba(0,0,0,0.02)]" to="/register">Bắt đầu dùng thử miễn phí</Link><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="w-full pt-20 bg-background"><div className="flex flex-col w-full">
        {/* AMBIENT LIVING BACKDROP GLOW */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[480px] bg-gradient-to-b from-primary-fixed/40 via-background-canvas-start to-transparent blur-3xl pointer-events-none -z-10 opacity-70"></div>
          {/* 1. HERO SECTION */}
          <section className="max-w-7xl mx-auto px-margin pt-space-xl pb-space-2xl">
            <div className="flex flex-col items-center text-center space-y-space-lg">
              {/* Badge */}
              <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-primary-fixed/60 text-on-primary-fixed font-label-sm text-label-sm shadow-sm backdrop-blur-md">
                <span className="material-symbols-outlined text-[16px] text-primary">auto_awesome</span>
                <span>Giải pháp Tri thức Dự án & Đào tạo Thế hệ mới</span>
              </div>
              {/* Main Headline */}
              <h1 className="max-w-4xl font-headline-xl text-headline-xl text-text-heading tracking-tight sm:text-[44px] sm:leading-[52px]">
                Nền Tảng Quản Lý Tri Thức Dự Án & Onboarding Chuyên Nghiệp
              </h1>
              {/* Subheading */}
              <p className="max-w-2xl font-body-lg text-body-lg text-text-body">
                Chuẩn hóa kho học liệu, phân quyền dự án linh hoạt và tối ưu lộ trình đào tạo nội bộ cho doanh nghiệp với kiến trúc lưu trữ bảo mật cao cấp.
              </p>
              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-space-md pt-space-xs">
                <Link className="inline-flex items-center gap-space-sm px-space-xl py-space-md rounded-xl font-label-md text-label-md bg-inverse-surface text-inverse-on-surface hover:bg-secondary transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 group" to="/register">
                  <span>Khám Phá Miễn Phí</span>
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </Link>
                <button className="inline-flex items-center gap-space-sm px-space-xl py-space-md rounded-xl font-label-md text-label-md bg-surface-card text-text-heading hover:bg-surface-container transition-all shadow-sm" id="btn-demo-trigger">
                  <span className="material-symbols-outlined text-[20px] text-primary">play_circle</span>
                  <span>Xem Bản Demo Trực Tiếp</span>
                </button>
              </div>
              {/* Trust proof indicators */}
              <div className="flex flex-wrap items-center justify-center gap-x-space-lg gap-y-space-xs pt-space-xs font-label-sm text-label-sm text-text-muted">
                <span className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-status-success text-[16px]">check_circle</span>
                  Hơn 500+ dự án đang vận hành
                </span>
                <span className="hidden sm:inline text-outline-variant">•</span>
                <span className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-status-success text-[16px]">verified_user</span>
                  Bảo mật SSL 256-bit
                </span>
                <span className="hidden sm:inline text-outline-variant">•</span>
                <span className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-status-success text-[16px]">storage</span>
                  Tích hợp MinIO & PostgreSQL
                </span>
              </div>
              {/* Interactive Hero Workspace Mockup (Editorial Bento Glass) */}
              <div className="w-full mt-space-xl max-w-5xl rounded-2xl bg-surface-card p-space-sm sm:p-space-md shadow-[0_24px_60px_-15px_rgba(160,95,105,0.22)]">
                <div className="rounded-xl bg-surface-subtle overflow-hidden">
                  {/* Window header */}
                  <div className="h-11 px-space-md bg-surface-container-high/60 flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <span className="w-3 h-3 rounded-full bg-status-danger/70 inline-block"></span>
                      <span className="w-3 h-3 rounded-full bg-status-warning/70 inline-block"></span>
                      <span className="w-3 h-3 rounded-full bg-status-success/70 inline-block"></span>
                      <span className="ml-space-sm font-label-xs text-label-xs text-text-muted uppercase tracking-wider">workspace.preparefortraining.internal</span>
                    </div>
                    <div className="flex items-center gap-space-xs text-text-muted">
                      <span className="px-space-sm py-0.5 rounded-full bg-surface-card font-label-xs text-label-xs text-status-success flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse"></span> Đồng bộ thời gian thực
                      </span>
                    </div>
                  </div>
                  {/* Workspace Body Mockup */}
                  <div className="p-space-lg grid grid-cols-1 lg:grid-cols-12 gap-space-lg text-left">
                    {/* Left Sidebar Column */}
                    <div className="lg:col-span-4 space-y-space-md">
                      {/* Project Tree Box */}
                      <div className="p-space-md rounded-xl bg-surface-card shadow-sm space-y-space-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-headline-sm text-headline-sm text-text-heading">Sổ Tri Thức 2025</span>
                          <span className="px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-xs text-label-xs">V3.4</span>
                        </div>
                        <div className="space-y-space-xs pt-space-xs font-body-md text-body-md text-text-body">
                          <div className="flex items-center justify-between p-space-xs rounded bg-surface-container text-on-surface">
                            <span className="flex items-center gap-space-xs"><span className="material-symbols-outlined text-[18px] text-primary">folder_open</span> Kiến trúc Core Engine</span>
                            <span className="font-label-xs text-label-xs text-text-muted">14 tệp</span>
                          </div>
                          <div className="flex items-center justify-between p-space-xs rounded hover:bg-surface-container-low transition-colors">
                            <span className="flex items-center gap-space-xs"><span className="material-symbols-outlined text-[18px] text-outline">folder</span> Quy chuẩn Onboarding Dev</span>
                            <span className="font-label-xs text-label-xs text-text-muted">8 tệp</span>
                          </div>
                          <div className="flex items-center justify-between p-space-xs rounded hover:bg-surface-container-low transition-colors">
                            <span className="flex items-center gap-space-xs"><span className="material-symbols-outlined text-[18px] text-outline">lock</span> SRS Tài chính & Bảo mật</span>
                            <span className="font-label-xs text-label-xs text-status-warning">RBAC</span>
                          </div>
                        </div>
                      </div>
                      {/* Storage Indicator */}
                      <div className="p-space-md rounded-xl bg-surface-card shadow-sm space-y-space-xs">
                        <div className="flex items-center justify-between font-label-sm text-label-sm">
                          <span className="text-text-muted">Dung lượng MinIO S3</span>
                          <span className="text-text-heading font-semibold">68.4 / 100 GB</span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                          <div className="bg-primary h-2 rounded-full" style={{ width: "68%" }}></div>
                        </div>
                        <div className="flex justify-between font-label-xs text-label-xs text-text-muted pt-1">
                          <span>PDF (34GB)</span>
                          <span>DOCX (12GB)</span>
                          <span>MP4 (22.4GB)</span>
                        </div>
                      </div>
                    </div>
                    {/* Center/Right Content Workspace */}
                    <div className="lg:col-span-8 space-y-space-md">
                      {/* Visual Inspiration Top Card */}
                      <div className="relative rounded-xl overflow-hidden h-44 shadow-sm flex items-end p-space-md">
                        <img className="absolute inset-0 w-full h-full object-cover" alt="Serene Japanese temple garden" src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/30 to-transparent"></div>
                        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-space-xs">
                          <div>
                            <span className="px-space-xs py-0.5 rounded-full bg-surface-card/25 backdrop-blur-md text-surface-bright font-label-xs text-label-xs uppercase tracking-wider">Không gian đào tạo trọng tâm</span>
                            <h3 className="font-headline-sm text-headline-sm text-surface-bright">Chương Trình Khởi Động Đội Ngũ Kỹ Thuật Q2</h3>
                          </div>
                          <div className="flex items-center -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-xs text-label-xs font-bold shadow-sm">LK</div>
                            <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-label-xs text-label-xs font-bold shadow-sm">TN</div>
                            <div className="w-8 h-8 rounded-full bg-inverse-surface text-inverse-on-surface flex items-center justify-center font-label-xs text-label-xs font-bold shadow-sm">+9</div>
                          </div>
                        </div>
                      </div>
                      {/* Recent Files Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                        {/* File 1 */}
                        <div className="p-space-sm rounded-xl bg-surface-card shadow-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors">
                          <div className="flex items-start justify-between">
                            <span className="px-space-xs py-0.5 rounded bg-error-container text-on-error-container font-label-xs text-label-xs font-bold">.PDF</span>
                            <span className="material-symbols-outlined text-[16px] text-text-muted">more_vert</span>
                          </div>
                          <div className="pt-space-md">
                            <p className="font-label-md text-label-md text-text-heading truncate">SRS_V2.1_Architecture.pdf</p>
                            <p className="font-body-sm text-body-sm text-text-muted">14.2 MB • Cập nhật 2 giờ trước</p>
                          </div>
                        </div>
                        {/* File 2 */}
                        <div className="p-space-sm rounded-xl bg-surface-card shadow-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors">
                          <div className="flex items-start justify-between">
                            <span className="px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-xs text-label-xs font-bold">.DOCX</span>
                            <span className="material-symbols-outlined text-[16px] text-text-muted">more_vert</span>
                          </div>
                          <div className="pt-space-md">
                            <p className="font-label-md text-label-md text-text-heading truncate">Huong_Dan_Onboarding.docx</p>
                            <p className="font-body-sm text-body-sm text-text-muted">3.8 MB • Hôm qua</p>
                          </div>
                        </div>
                        {/* File 3 */}
                        <div className="p-space-sm rounded-xl bg-surface-card shadow-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors">
                          <div className="flex items-start justify-between">
                            <span className="px-space-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-xs text-label-xs font-bold">.MP4</span>
                            <span className="material-symbols-outlined text-[16px] text-text-muted">more_vert</span>
                          </div>
                          <div className="pt-space-md">
                            <p className="font-label-md text-label-md text-text-heading truncate">Tech_Walkthrough_Lec1.mp4</p>
                            <p className="font-body-sm text-body-sm text-text-muted">148 MB • 3 ngày trước</p>
                          </div>
                        </div>
                      </div>
                      {/* Fast Action Bar */}
                      <div className="p-space-sm rounded-xl bg-surface-container flex items-center justify-between">
                        <div className="flex items-center gap-space-sm">
                          <span className="material-symbols-outlined text-primary text-[20px]">cloud_upload</span>
                          <span className="font-body-md text-body-md text-text-body">Kéo thả tệp tin bất kỳ để lưu trữ và lập chỉ mục ngay</span>
                        </div>
                        <span className="font-label-sm text-label-sm text-primary font-semibold hover:underline cursor-pointer">Chọn tệp</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* 2. SOCIAL PROOF & KEY METRICS BAR */}
          <section className="w-full bg-surface-container-low/80 py-space-xl">
            <div className="max-w-7xl mx-auto px-margin">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-space-lg text-center md:text-left">
                <div className="p-space-md rounded-xl bg-surface-card shadow-sm flex flex-col justify-center">
                  <span className="font-headline-xl text-headline-xl text-text-heading">99.9%</span>
                  <span className="font-label-md text-label-md text-text-muted mt-space-xs">Thời gian hoạt động (SLA Uptime)</span>
                  <span className="font-body-sm text-body-sm text-status-success mt-1">Cụm máy chủ HA phân tán</span>
                </div>
                <div className="p-space-md rounded-xl bg-surface-card shadow-sm flex flex-col justify-center">
                  <span className="font-headline-xl text-headline-xl text-text-heading">10,000+</span>
                  <span className="font-label-md text-label-md text-text-muted mt-space-xs">Tài liệu kỹ thuật & SRS</span>
                  <span className="font-body-sm text-body-sm text-primary mt-1">Tự động index siêu dữ liệu</span>
                </div>
                <div className="p-space-md rounded-xl bg-surface-card shadow-sm flex flex-col justify-center">
                  <span className="font-headline-xl text-headline-xl text-text-heading">3x</span>
                  <span className="font-label-md text-label-md text-text-muted mt-space-xs">Tăng tốc độ Onboarding</span>
                  <span className="font-body-sm text-body-sm text-status-success mt-1">Giảm thời gian kèm cặp thủ công</span>
                </div>
                <div className="p-space-md rounded-xl bg-surface-card shadow-sm flex flex-col justify-center">
                  <span className="font-headline-xl text-headline-xl text-text-heading">0</span>
                  <span className="font-label-md text-label-md text-text-muted mt-space-xs">Rủi ro rò rỉ dữ liệu</span>
                  <span className="font-body-sm text-body-sm text-status-success mt-1">BCrypt Hash & JWT Shield</span>
                </div>
              </div>
            </div>
          </section>
          {/* 3. CORE FEATURES (GIẢI PHÁP CỐT LÕI) */}
          <section id="tinh-nang" className="max-w-7xl mx-auto px-margin py-space-2xl">
            <div className="text-center max-w-3xl mx-auto mb-space-2xl space-y-space-xs">
              <span className="font-label-xs text-label-xs text-primary font-bold tracking-widest uppercase">Tính Năng Đột Phá</span>
              <h2 className="font-headline-lg text-headline-lg text-text-heading">
                Giải Pháp Toàn Diện Cho Tri Thức Kỹ Thuật & Nhân Sự
              </h2>
              <p className="font-body-md text-body-md text-text-muted">
                Được thiết kế tinh gọn theo triết lý Blush Editorial, hỗ trợ các đội ngũ kỹ thuật phức tạp lưu trữ, chia sẻ và tiếp thu kiến thức liền mạch.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xl">
              {/* Feature 1 */}
              <div className="p-space-xl rounded-2xl bg-surface-card shadow-[0_16px_40px_-12px_rgba(175,115,125,0.12)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
                <div className="space-y-space-md">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                    <span className="material-symbols-outlined text-[26px]">menu_book</span>
                  </div>
                  <div className="space-y-space-xs">
                    <h3 className="font-headline-md text-headline-md text-text-heading">Sổ Dự Án Trực Quan (Gemini Notebook Style)</h3>
                    <p className="font-body-md text-body-md text-text-body">
                      Giao diện thẻ trực quan phân loại dự án cốt lõi, tài liệu Onboarding và tiến độ đội ngũ. Tích hợp thanh tìm kiếm thông minh theo nhãn kỹ thuật và tác giả.
                    </p>
                  </div>
                </div>
                <div className="mt-space-lg p-space-md rounded-xl bg-surface-subtle space-y-space-xs font-body-sm text-body-sm">
                  <div className="flex items-center gap-space-xs text-status-success font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Phân vùng thư mục đa tầng & liên kết tài liệu chéo
                  </div>
                  <div className="flex items-center gap-space-xs text-status-success font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Ghi chú nhúng Markdown, sơ đồ Flowchart và tài liệu tham khảo
                  </div>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="p-space-xl rounded-2xl bg-surface-card shadow-[0_16px_40px_-12px_rgba(175,115,125,0.12)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
                <div className="space-y-space-md">
                  <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                    <span className="material-symbols-outlined text-[26px]">shield_person</span>
                  </div>
                  <div className="space-y-space-xs">
                    <h3 className="font-headline-md text-headline-md text-text-heading">Phân Quyền 3 Cấp Độ (RBAC Chuẩn SRS)</h3>
                    <p className="font-body-md text-body-md text-text-body">
                      Cơ chế phân quyền chặt chẽ: Quản trị viên (Admin), Chủ nhiệm dự án (Owner) và Thành viên (User/Member). Kiểm soát chính xác quyền xem, tải về hoặc chỉnh sửa từng tệp tin.
                    </p>
                  </div>
                </div>
                <div className="mt-space-lg p-space-md rounded-xl bg-surface-subtle space-y-space-xs font-body-sm text-body-sm">
                  <div className="flex items-center gap-space-xs text-status-success font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Huy hiệu vai trò OWNER / ADMIN / USER rõ ràng
                  </div>
                  <div className="flex items-center gap-space-xs text-status-success font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Nhật ký truy vết phiên xem & lịch sử tải xuống theo thời gian
                  </div>
                </div>
              </div>
              {/* Feature 3 */}
              <div className="p-space-xl rounded-2xl bg-surface-card shadow-[0_16px_40px_-12px_rgba(175,115,125,0.12)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
                <div className="space-y-space-md">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed-dim flex items-center justify-center text-on-primary-fixed">
                    <span className="material-symbols-outlined text-[26px]">cloud_sync</span>
                  </div>
                  <div className="space-y-space-xs">
                    <h3 className="font-headline-md text-headline-md text-text-heading">Lưu Trữ Đa Định Dạng & Bảo Mật MinIO</h3>
                    <p className="font-body-md text-body-md text-text-body">
                      Hỗ trợ kéo thả tải lên PDF, DOCX, XLSX, MP4, Markdown, SQL Script. Hạ tầng MinIO S3 tương thích đảm bảo tài liệu được mã hóa AES-256 từ đầu đến cuối.
                    </p>
                  </div>
                </div>
                <div className="mt-space-lg p-space-md rounded-xl bg-surface-subtle space-y-space-xs font-body-sm text-body-sm">
                  <div className="flex items-center gap-space-xs text-status-success font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Xem trước trực tuyến tài liệu PDF & video không cần tải về máy
                  </div>
                  <div className="flex items-center gap-space-xs text-status-success font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Đường dẫn tải có thời hạn (Presigned URL) chống chia sẻ trái phép
                  </div>
                </div>
              </div>
              {/* Feature 4 */}
              <div className="p-space-xl rounded-2xl bg-surface-card shadow-[0_16px_40px_-12px_rgba(175,115,125,0.12)] flex flex-col justify-between hover:-translate-y-1 transition-transform">
                <div className="space-y-space-md">
                  <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                    <span className="material-symbols-outlined text-[26px]">manage_accounts</span>
                  </div>
                  <div className="space-y-space-xs">
                    <h3 className="font-headline-md text-headline-md text-text-heading">Quản Trị Người Dùng & Cấp Phát Tức Thì</h3>
                    <p className="font-body-md text-body-md text-text-body">
                      Admin chủ động khởi tạo tài khoản nhân sự mới, kích hoạt quyền vào các sổ dự án chỉ định hoặc tạm khóa tài khoản nhanh chóng chỉ với 1 cú nhấp chuột.
                    </p>
                  </div>
                </div>
                <div className="mt-space-lg p-space-md rounded-xl bg-surface-subtle space-y-space-xs font-body-sm text-body-sm">
                  <div className="flex items-center gap-space-xs text-status-success font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Gửi email tự động kèm thông tin đăng nhập lần đầu
                  </div>
                  <div className="flex items-center gap-space-xs text-status-success font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    Kiểm soát trạng thái Hoạt động / Vô hiệu hóa trực quan
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* 4. INTERACTIVE WORKFLOW (QUY TRÌNH 3 BƯỚC TINH GỌN) */}
          <section id="trien-khai" className="w-full bg-surface-container-low py-space-2xl">
            <div className="max-w-7xl mx-auto px-margin">
              <div className="text-center max-w-3xl mx-auto mb-space-2xl space-y-space-xs">
                <span className="font-label-xs text-label-xs text-primary font-bold tracking-widest uppercase">Quy Trình Triển Khai</span>
                <h2 className="font-headline-lg text-headline-lg text-text-heading">
                  Tối Giản Quy Trình Chuẩn Bị & Đào Tạo Trong 3 Bước
                </h2>
                <p className="font-body-md text-body-md text-text-muted">
                  Không mất hàng tuần cấu hình phức tạp. Bắt đầu vận hành kho học liệu dự án chuyên sâu chỉ sau vài phút.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
                {/* Step 1 */}
                <div className="p-space-xl rounded-2xl bg-surface-card shadow-sm relative flex flex-col justify-between">
                  <div className="space-y-space-md">
                    <span className="font-headline-xl text-headline-xl text-primary/40 font-bold block">01</span>
                    <h3 className="font-headline-sm text-headline-sm text-text-heading">Khởi Tạo Sổ Dự Án & Cấu Trúc</h3>
                    <p className="font-body-md text-body-md text-text-body">
                      Tạo không gian làm việc theo từng dự án (Project Notebook), gắn nhãn công nghệ và thiết lập bộ khung tài liệu đào tạo từ mẫu có sẵn.
                    </p>
                  </div>
                  <div className="mt-space-lg pt-space-md">
                    <span className="px-space-sm py-1 rounded bg-surface-container font-label-xs text-label-xs text-text-muted font-mono">POST /api/v1/projects/create</span>
                  </div>
                </div>
                {/* Step 2 */}
                <div className="p-space-xl rounded-2xl bg-surface-card shadow-sm relative flex flex-col justify-between">
                  <div className="space-y-space-md">
                    <span className="font-headline-xl text-headline-xl text-primary/40 font-bold block">02</span>
                    <h3 className="font-headline-sm text-headline-sm text-text-heading">Phân Quyền & Mời Cộng Sự</h3>
                    <p className="font-body-md text-body-md text-text-body">
                      Gán vai trò Quản trị (Admin), Chủ nhiệm (Owner) hoặc Thành viên (Member). Thành viên nhận mã bảo mật và truy cập tài liệu đúng thẩm quyền.
                    </p>
                  </div>
                  <div className="mt-space-lg pt-space-md">
                    <span className="px-space-sm py-1 rounded bg-surface-container font-label-xs text-label-xs text-text-muted font-mono">RBAC Policy: MinIO Bucket Access</span>
                  </div>
                </div>
                {/* Step 3 */}
                <div className="p-space-xl rounded-2xl bg-surface-card shadow-sm relative flex flex-col justify-between">
                  <div className="space-y-space-md">
                    <span className="font-headline-xl text-headline-xl text-primary/40 font-bold block">03</span>
                    <h3 className="font-headline-sm text-headline-sm text-text-heading">Đồng Bộ & Theo Dõi Tiến Độ</h3>
                    <p className="font-body-md text-body-md text-text-body">
                      Kéo thả tài liệu, phân phối bài học kỹ thuật cho nhân sự mới và theo dõi tỷ lệ hoàn thành lộ trình đào tạo theo thời gian thực.
                    </p>
                  </div>
                  <div className="mt-space-lg pt-space-md">
                    <span className="px-space-sm py-1 rounded bg-surface-container font-label-xs text-label-xs text-text-muted font-mono">Real-time Dashboard & Analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* 5. TESTIMONIALS / FEEDBACK SECTION */}
          <section id="chuyen-gia" className="max-w-7xl mx-auto px-margin py-space-2xl">
            <div className="text-center max-w-2xl mx-auto mb-space-2xl space-y-space-xs">
              <span className="font-label-xs text-label-xs text-primary font-bold tracking-widest uppercase">Phản Hồi Từ Chuyên Gia</span>
              <h2 className="font-headline-lg text-headline-lg text-text-heading">
                Được Tin Tưởng Bởi Các Đội Ngũ Kỹ Thuật Hàng Đầu
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              {/* Review 1 */}
              <div className="p-space-xl rounded-2xl bg-surface-card shadow-sm flex flex-col justify-between">
                <div className="space-y-space-md">
                  <div className="flex text-status-warning">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <p className="font-body-md text-body-md text-text-body italic">
                    "Giao diện tông hồng pastel thanh lịch khiến đội ngũ của tôi không còn cảm giác khô khan khi phải đọc hàng trăm trang tài liệu SRS và sơ đồ kiến trúc phức tạp."
                  </p>
                </div>
                <div className="flex items-center gap-space-md pt-space-lg">
                  <div className="w-10 h-10 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold font-label-sm text-label-sm">
                    BT
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-text-heading">Bùi Ngọc Tá Thiên</p>
                    <p className="font-body-sm text-body-sm text-text-muted">Tech Lead • FPT Software</p>
                  </div>
                </div>
              </div>
              {/* Review 2 */}
              <div className="p-space-xl rounded-2xl bg-surface-card shadow-sm flex flex-col justify-between">
                <div className="space-y-space-md">
                  <div className="flex text-status-warning">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <p className="font-body-md text-body-md text-text-body italic">
                    "Thời gian bàn giao dự án cho kỹ sư mới giảm từ 3 tuần xuống còn đúng 5 ngày. Phân quyền MinIO theo vai trò giúp chúng tôi hoàn toàn yên tâm về bảo mật dữ liệu."
                  </p>
                </div>
                <div className="flex items-center gap-space-md pt-space-lg">
                  <div className="w-10 h-10 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-bold font-label-sm text-label-sm">
                    NT
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-text-heading">Nguyễn Duy Tùng</p>
                    <p className="font-body-sm text-body-sm text-text-muted">Engineering Manager • VNG Tech</p>
                  </div>
                </div>
              </div>
              {/* Review 3 */}
              <div className="p-space-xl rounded-2xl bg-surface-card shadow-sm flex flex-col justify-between">
                <div className="space-y-space-md">
                  <div className="flex text-status-warning">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  </div>
                  <p className="font-body-md text-body-md text-text-body italic">
                    "Khả năng mở video bài giảng kỹ thuật trực tuyến và lưu trữ đa dạng tài liệu dạng Gemini Notebook giúp khối đào tạo quản lý kho học liệu một cách khoa học tuyệt đối."
                  </p>
                </div>
                <div className="flex items-center gap-space-md pt-space-lg">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold font-label-sm text-label-sm">
                    LĐ
                  </div>
                  <div>
                    <p className="font-label-md text-label-md text-text-heading">Lê Thành Đạt</p>
                    <p className="font-body-sm text-body-sm text-text-muted">Head of L&D • Viettel Digital</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* 6. FINAL HIGH-IMPACT CTA BANNER */}
          <section className="max-w-7xl mx-auto px-margin pb-space-2xl">
            <div className="relative rounded-3xl bg-gradient-to-r from-background-canvas-start via-primary-fixed to-background-canvas-end p-space-xl sm:p-space-2xl shadow-xl overflow-hidden text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-space-xl">
              <div className="space-y-space-sm max-w-xl">
                <span className="px-space-sm py-0.5 rounded-full bg-surface-card/60 backdrop-blur font-label-xs text-label-xs text-text-heading uppercase tracking-wider inline-block">Khởi đầu kỷ nguyên đào tạo thông minh</span>
                <h2 className="font-headline-lg text-headline-lg text-text-heading">
                  Sẵn Sàng Nâng Tầm Quản Trị Tri Thức Doanh Nghiệp?
                </h2>
                <p className="font-body-md text-body-md text-text-body">
                  Trải nghiệm không gian làm việc chuẩn mực cho đội ngũ phát triển và đào tạo ngay hôm nay. Khởi tạo miễn phí trong 60 giây.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-space-md shrink-0">
                <Link className="w-full sm:w-auto inline-flex items-center justify-center px-space-xl py-space-md rounded-xl font-label-md text-label-md bg-inverse-surface text-inverse-on-surface hover:bg-secondary transition-all shadow-md" to="/register">
                  Bắt Đầu Dùng Thử Miễn Phí
                </Link>
                <a className="w-full sm:w-auto inline-flex items-center justify-center px-space-xl py-space-md rounded-xl font-label-md text-label-md bg-surface-card text-text-heading hover:bg-surface-container transition-all shadow-sm" href="#">
                  Liên Hệ Chuyên Viên Tư Vấn
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
      </main><footer className="w-full bg-surface-container-low py-space-2xl"><div className="max-w-7xl mx-auto px-margin"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl pb-space-xl"><div className="lg:col-span-2 space-y-space-md"><div className="flex items-center gap-space-sm"><img src="/logo.svg" alt="PrepareForTraining Logo" className="h-8 w-auto" /><span className="font-headline-sm text-headline-sm text-text-heading">PrepareForTraining</span></div><p className="font-body-md text-body-md text-text-muted max-w-sm">Hệ sinh thái lưu trữ tri thức đào tạo và onboarding dự án chuyên sâu dành cho doanh nghiệp hiện đại.</p><div className="inline-flex items-center gap-space-xs px-space-sm py-space-xs rounded-full bg-surface-container-highest text-on-surface-variant font-label-xs text-label-xs uppercase tracking-wider"><span className="material-symbols-outlined text-[14px] text-status-success">verified_user</span><span>Hệ thống bảo mật ISO 27001 & SOC2</span></div></div><div className="space-y-space-sm"><h4 className="font-headline-sm text-label-md text-text-heading">Sản phẩm</h4><ul className="space-y-space-xs font-body-md text-body-md text-on-surface-variant"><li><a className="hover:text-primary transition-colors" data-path="tinh-nang" href="#tinh-nang">Kho tri thức nội bộ</a></li><li><a className="hover:text-primary transition-colors" data-path="tinh-nang" href="#tinh-nang">Tài liệu tự động hóa</a></li><li><a className="hover:text-primary transition-colors" data-path="tinh-nang" href="#tinh-nang">Kiểm thử năng lực AI</a></li><li><a className="hover:text-primary transition-colors" data-path="tinh-nang" href="#tinh-nang">Tích hợp LMS</a></li></ul></div><div className="space-y-space-sm"><h4 className="font-headline-sm text-label-md text-text-heading">Giải pháp</h4><ul className="space-y-space-xs font-body-md text-body-md text-on-surface-variant"><li><a className="hover:text-primary transition-colors" data-path="giai-phap" href="#giai-phap">Kỹ thuật & Phần mềm</a></li><li><a className="hover:text-primary transition-colors" data-path="giai-phap" href="#giai-phap">Kinh doanh & Sales</a></li><li><a className="hover:text-primary transition-colors" data-path="giai-phap" href="#giai-phap">Nhân sự & Onboarding</a></li><li><a className="hover:text-primary transition-colors" data-path="giai-phap" href="#giai-phap">Khối Doanh nghiệp lớn</a></li></ul></div><div className="space-y-space-sm"><h4 className="font-headline-sm text-label-md text-text-heading">Tài nguyên & Pháp lý</h4><ul className="space-y-space-xs font-body-md text-body-md text-on-surface-variant"><li><a className="hover:text-primary transition-colors" data-path="tai-lieu" href="#tai-lieu">Trung tâm trợ giúp</a></li><li><a className="hover:text-primary transition-colors" data-path="tai-lieu" href="#tai-lieu">Tài liệu API & SDK</a></li><li><a className="hover:text-primary transition-colors" data-path="chinh-sach-bao-mat" href="#">Chính sách bảo mật</a></li><li><a className="hover:text-primary transition-colors" data-path="dieu-khoan-dich-vu" href="#">Điều khoản dịch vụ</a></li></ul></div></div><div className="pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md text-text-muted font-body-sm text-body-sm"><span>© 2025 PrepareForTraining Inc. Toàn bộ quyền được bảo lưu.</span><div className="flex items-center gap-space-md"><span className="flex items-center gap-space-xs"><span className="w-2 h-2 rounded-full bg-status-success inline-block"></span>Hạ tầng trực tuyến 99.98% SLA</span><span>Tiếng Việt (VN)</span></div></div></div></footer>
    </div>
  );
};

export default LandingPage;
