import { useState, type ReactNode, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { updateProfileApi, changePasswordApi } from "../../services/authService";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const signOut = () => {
    logout();
    navigate("/login");
  };

  const currentPath = location.pathname;
  const [searchTerm, setSearchTerm] = useState(new URLSearchParams(location.search).get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams(location.search);
    if (searchTerm) {
      searchParams.set("search", searchTerm);
    } else {
      searchParams.delete("search");
    }
    navigate(`/dashboard?${searchParams.toString()}`);
  };

  // Profile Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (showProfileModal && user) {
      setProfileName(user.fullName);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setProfileError("");
      setProfileSuccess("");
      setIsChangingPassword(false);
    }
  }, [showProfileModal, user]);

  const handleUpdateProfile = async () => {
    // Xóa các thông báo cũ trước khi gọi API mới
    setProfileError("");
    setProfileSuccess("");
    setIsUpdatingProfile(true);
    try {
      // 1. Kiểm tra xem người dùng có đổi tên hiển thị không
      if (profileName.trim() !== user?.fullName) {
        await updateProfileApi(profileName);
        setProfileSuccess("Cập nhật tên thành công! Tên sẽ được cập nhật lại khi bạn tải lại trang.");
      }
      
      // 2. Nếu người dùng nhập vào trường "Mật khẩu mới", tức là họ muốn đổi mật khẩu
      if (newPassword) {
        // 2a. Kiểm tra xác nhận mật khẩu có khớp không
        if (newPassword !== confirmPassword) {
          setProfileError("Mật khẩu xác nhận không khớp!");
          setIsUpdatingProfile(false);
          return;
        }
        // 2b. Bắt buộc phải có mật khẩu cũ để xác thực
        if (!oldPassword) {
          setProfileError("Vui lòng nhập mật khẩu cũ!");
          setIsUpdatingProfile(false);
          return;
        }
        // Gọi API backend để đổi mật khẩu
        await changePasswordApi(oldPassword, newPassword);
        // Nếu thành công, đăng xuất ngay lập tức và chuyển người dùng về trang Đăng nhập
        logout();
        navigate("/login");
        return;
      }
    } catch (e: any) {
      // Catch lỗi trả về từ phía Backend (VD: "Mật khẩu cũ không chính xác")
      setProfileError(e.message || "Có lỗi xảy ra");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <div className="bg-background font-body-md text-body min-h-screen">
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="h-20 flex items-center gap-3 px-6 bg-surface-container-low">
          <img 
            alt="PrepareForTraining" 
            className="h-8 w-auto object-contain" 
            src="/logo.svg"
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
            <form onSubmit={handleSearch} className="relative flex items-center w-full">
              <span className="material-symbols-outlined absolute left-4 text-text-muted text-[20px]">search</span>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm dự án, tài liệu, thẻ..." 
                className="w-full pl-11 pr-4 py-2.5 bg-surface-input-tint rounded-lg font-body-md text-body-md text-text-heading placeholder-text-muted focus:outline-none focus:bg-surface-card transition-all" 
              />
            </form>
          </div>
          <div className="flex items-center gap-3">
            {user?.role !== "USER" && (
              <button onClick={() => navigate('/dashboard?create=true')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-text-heading text-on-primary font-label-md text-label-md shadow-[0_2px_6px_0_rgba(0,0,0,0.04)] hover:bg-on-background transition-all">
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span>Tạo dự án mới</span>
              </button>
            )}
            <button className="relative w-10 h-10 rounded-xl bg-surface-card flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-status-danger"></span>
            </button>
            <div className="flex items-center gap-3 pl-2 cursor-pointer group" onClick={() => setShowProfileModal(true)}>
              <div className="text-right hidden xl:block group-hover:opacity-80 transition-opacity">
                <p className="font-label-md text-label-md text-text-heading leading-tight">{user?.fullName}</p>
                <span className="font-label-xs text-label-xs text-text-muted">{user?.role}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
            </div>
          </div>
        </header>

        <main className="w-full pt-20 bg-background">
          {children}
        </main>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowProfileModal(false)}>
          <div className="bg-surface-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border-soft flex justify-between items-start">
              <div>
                <h3 className="font-headline-md text-headline-md text-text-heading">Thông tin cá nhân</h3>
                <p className="font-body-sm text-text-muted">{user?.email}</p>
              </div>
              <button onClick={() => setShowProfileModal(false)} className="text-text-muted hover:text-text-heading">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              {profileError && (
                <div className="p-3 bg-status-danger/10 text-status-danger rounded-xl font-body-sm">
                  {profileError}
                </div>
              )}
              {profileSuccess && (
                <div className="p-3 bg-status-success/10 text-status-success rounded-xl font-body-sm">
                  {profileSuccess}
                </div>
              )}
              
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-text-muted">Họ và tên</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  className="w-full bg-surface-input-tint px-4 py-2.5 rounded-xl font-label-md text-text-heading outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="pt-4 mt-2 border-t border-border-soft">
                <div className="flex items-center justify-end mb-4">
                  {!isChangingPassword ? (
                    <button 
                      type="button" 
                      onClick={() => setIsChangingPassword(true)}
                      className="text-primary hover:text-primary-hover font-label-sm transition-colors"
                    >
                      Đổi mật khẩu
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => {
                        setIsChangingPassword(false);
                        setOldPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                      }}
                      className="text-text-muted hover:text-text-heading font-label-sm transition-colors"
                    >
                      Hủy đổi mật khẩu
                    </button>
                  )}
                </div>
                
                {isChangingPassword && (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-text-muted">Mật khẩu cũ</label>
                      <input
                        type="password"
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                        placeholder="Nhập mật khẩu hiện tại"
                        className="w-full bg-surface-input-tint px-4 py-2.5 rounded-xl font-label-md text-text-heading outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-text-muted">Mật khẩu mới</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="Ít nhất 6 ký tự"
                        className="w-full bg-surface-input-tint px-4 py-2.5 rounded-xl font-label-md text-text-heading outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-sm text-text-muted">Nhập lại mật khẩu mới</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Xác nhận mật khẩu mới"
                        className="w-full bg-surface-input-tint px-4 py-2.5 rounded-xl font-label-md text-text-heading outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 bg-surface-subtle border-t border-border-soft flex justify-end gap-3">
              <button 
                onClick={() => setShowProfileModal(false)}
                className="px-6 py-2 rounded-xl bg-surface-container text-text-heading font-label-md hover:bg-surface-container-high transition-colors"
              >
                Đóng
              </button>
              <button 
                onClick={handleUpdateProfile}
                disabled={isUpdatingProfile}
                className="px-6 py-2 rounded-xl bg-primary text-white font-label-md hover:bg-primary-hover transition-colors shadow-md shadow-primary/20 disabled:opacity-50"
              >
                {isUpdatingProfile ? "Đang xử lý..." : "Cập nhật"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
