import type { ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const signOut = () => {
    logout();
    navigate("/login");
  };

  const currentPath = location.pathname;

  return (
    <div className="bg-background font-body-md text-body min-h-screen">
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="h-20 flex items-center gap-3 px-6 bg-surface-container-low">
          <img 
            alt="PrepareForTraining" 
            className="h-8 w-auto object-contain" 
            src="https://lh3.googleusercontent.com/aida/AEtjO1Ud5zSwAdWxdejSv9OqmmYeOtkNy_uk3Kz1RZu8xXgjeM2IUPBVb97-LMKXpRtRDlfGMIYCIFhgmsH2RT6kPIeZKSOIYRpqj0cHPlQ2KmOqFXCLJxOvutMlYo9iYUC7a95ynhAHnBoeQ9sUQVF1Wa3ds-4z34VqHiosgq502BM0euUwGZI64aAnd4sOjtIxHpMEmnK2_Pbxp_q3MuZMgfmXxnx0kuKBJJfuouNnU-tTpVuVxt_5SZwCEIKs"
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-text-heading leading-tight">PrepareForTraining</span>
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-text-muted">Workspace Portal</span>
          </div>
        </div>
        
        <div className="px-6 py-2">
          <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-status-success"></span>
              <span className="font-label-sm text-label-sm text-on-surface">Chế độ xem</span>
            </div>
            <span className="font-label-xs text-label-xs px-2 py-0.5 rounded-full bg-text-heading text-on-primary">
              {user?.role || "GUEST"}
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-md text-label-md transition-colors outline-none ${currentPath === '/dashboard' && !location.search.includes('filter=starred') && !location.search.includes('filter=archived') ? 'text-text-heading font-headline-sm font-bold' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
          >
            <span className="material-symbols-outlined text-[20px]">folder_copy</span>
            <span>Tất cả dự án</span>
          </Link>
          <Link to="/dashboard?filter=starred" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-md text-label-md transition-colors outline-none ${location.search.includes('filter=starred') ? 'text-text-heading font-headline-sm font-bold' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}>
            <span className="material-symbols-outlined text-[20px]">star</span>
            <span>Dự án của tôi</span>
          </Link>
          <Link to="/dashboard?filter=archived" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-label-md text-label-md transition-colors outline-none ${location.search.includes('filter=archived') ? 'text-text-heading font-headline-sm font-bold' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}>
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            <span>Kho lưu trữ</span>
          </Link>

          {user?.role === "ADMIN" && (
            <Link 
              to="/admin" 
              className={`flex items-center justify-between px-4 py-3 rounded-xl font-label-md text-label-md transition-colors outline-none group ${currentPath === '/admin' ? 'text-text-heading font-headline-sm font-bold' : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[20px] ${currentPath === '/admin' ? '' : 'text-primary'}`}>admin_panel_settings</span>
                <span>Quản lý Người dùng</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-text-heading text-on-primary font-label-xs text-label-xs font-semibold">ADMIN</span>
            </Link>
          )}
        </nav>

        <div className="p-4 bg-surface-container-low">
          <button onClick={signOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-label-md text-label-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      <div className="pl-72">
        <header className="fixed top-0 left-72 right-0 h-20 bg-surface/85 backdrop-blur-xl z-40 shadow-[0_1px_8px_rgba(0,0,0,0.04)] px-gutter flex items-center justify-between gap-4">
          <div className="flex-1 max-w-xl">
            <div className="relative flex items-center w-full">
              <span className="material-symbols-outlined absolute left-4 text-text-muted text-[20px]">search</span>
              <input 
                type="text" 
                placeholder="Tìm kiếm dự án, tài liệu, thẻ..." 
                className="w-full pl-11 pr-4 py-2.5 bg-surface-input-tint rounded-lg font-body-md text-body-md text-text-heading placeholder-text-muted focus:outline-none focus:bg-surface-card transition-all" 
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard?create=true')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-text-heading text-on-primary font-label-md text-label-md shadow-[0_2px_6px_0_rgba(0,0,0,0.04)] hover:bg-on-background transition-all">
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Tạo dự án mới</span>
            </button>
            <button className="relative w-10 h-10 rounded-xl bg-surface-card flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-status-danger"></span>
            </button>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden xl:block">
                <p className="font-label-md text-label-md text-text-heading leading-tight">{user?.fullName}</p>
                <span className="font-label-xs text-label-xs text-text-muted">{user?.role}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
            </div>
          </div>
        </header>

        <main className="w-full pt-20 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
