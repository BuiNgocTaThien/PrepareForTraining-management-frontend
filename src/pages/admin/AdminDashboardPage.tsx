import { useEffect, useState, type FormEvent } from "react";

import { AppShell } from "../../components/common/AppShell";
import {
  createUser,
  listUsers,
  updateUserRole,
  updateUserStatus,
} from "../../services/adminUserService";
import type { Role, User } from "../../types/auth";

export function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");
  const [newRole, setNewRole] = useState<Role>("OWNER");

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // --- Hàm load lại danh sách người dùng ---
  const load = () => {
    setLoading(true);
    // Gọi API lấy danh sách người dùng với phân trang (page) và tìm kiếm (search)
    listUsers(page, 10, search)
      .then((r) => {
        setUsers(r.data.content);
        setTotalPages(r.data.totalPages);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  // Gọi hàm load mỗi khi state 'page' hoặc 'search' bị thay đổi
  useEffect(() => {
    load();
  }, [page, search]);

  // --- Hàm thay đổi Quyền (Role) của người dùng ---
  const role = async (id: number, value: Role) => {
    try {
      await updateUserRole(id, value); // Gọi API thay đổi quyền
      load(); // Cập nhật lại table
      // Cập nhật lại state của selectedUser để Modal phản ánh ngay lập tức
      if (selectedUser && selectedUser.id === id) {
        setSelectedUser({ ...selectedUser, role: value });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update role");
    }
  };

  // --- Hàm Khóa/Mở Khóa (Status) người dùng ---
  const status = async (user: User) => {
    try {
      // Đảo ngược trạng thái hiện tại
      await updateUserStatus(
        user.id,
        user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      );
      load(); // Reload lại bảng
      // Cập nhật lại Modal để giao diện không bị giật lag (Optimistic UI update)
      if (selectedUser && selectedUser.id === user.id) {
        setSelectedUser({ ...selectedUser, status: user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update status");
    }
  };

  // --- Hàm Tạo người dùng mới ---
  const submit = async (e: FormEvent) => {
    e.preventDefault(); // Ngăn trình duyệt reload lại trang khi submit form
    setError("");
    try {
      // Gọi API tạo account
      await createUser(email, password, fullName, newRole);
      // Reset lại form cho sạch sẽ
      setFullName("");
      setEmail("");
      setPassword("123456"); // Đặt lại mật khẩu mặc định
      load(); // Reload lại table danh sách
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account");
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setPage(0);
    setSearch(searchInput);
  };

  return (
    <AppShell>
      <div className="flex flex-col w-full px-margin py-space-xl pb-32">
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="font-headline-xl text-headline-xl text-text-heading tracking-tight">
              Quản trị Hệ thống
            </h1>
            <p className="font-body-md text-body-md text-text-body">
              Quản lý người dùng, cấp quyền hệ thống và thiết lập không gian làm việc.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-status-danger/10 text-status-danger rounded-xl font-body-md">
              {error}
            </div>
          )}

          {/* Create User Card */}
          <div className="p-6 bg-surface-card rounded-2xl shadow-[0_16px_40px_-12px_rgba(175,115,125,0.12)]">
            <h2 className="font-headline-sm text-headline-sm text-text-heading mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">person_add</span>
              Tạo tài khoản mới
            </h2>
            <form className="flex flex-wrap items-end gap-4" onSubmit={submit}>
              <div className="flex-1 min-w-[200px]">
                <label className="block font-label-sm text-label-sm text-text-muted mb-1.5">Họ và tên</label>
                <input
                  placeholder="Nhập họ và tên..."
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-input-tint rounded-xl font-body-md text-text-heading focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block font-label-sm text-label-sm text-text-muted mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-input-tint rounded-xl font-body-md text-text-heading focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block font-label-sm text-label-sm text-text-muted mb-1.5">Mật khẩu</label>
                <input
                  type="password"
                  placeholder="******"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-input-tint rounded-xl font-body-md text-text-heading focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  required
                />
              </div>
              <div className="w-40">
                <label className="block font-label-sm text-label-sm text-text-muted mb-1.5">Quyền</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as Role)}
                  className="w-full px-4 py-2.5 bg-surface-input-tint rounded-xl font-body-md text-text-heading focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="OWNER">OWNER</option>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <button 
                className="h-[44px] px-6 rounded-xl bg-text-heading text-on-primary font-label-md hover:bg-on-background transition-all flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
              >
                Tạo mới
              </button>
            </form>
          </div>

          {/* User List */}
          <div className="bg-surface-card rounded-2xl shadow-[0_16px_40px_-12px_rgba(175,115,125,0.12)] overflow-hidden">
            <div className="p-6 border-b border-border-soft flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-subtle">
              <h2 className="font-headline-sm text-headline-sm text-text-heading flex items-center gap-2 whitespace-nowrap">
                <span className="material-symbols-outlined text-primary">manage_accounts</span>
                Danh sách Người dùng
              </h2>
              <form onSubmit={handleSearch} className="flex gap-2 max-w-sm w-full">
                <input 
                  type="text" 
                  placeholder="Tìm theo tên hoặc email..." 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="flex-1 px-4 py-2 bg-surface-input-tint rounded-xl font-body-sm text-text-heading focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button type="submit" className="px-4 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </button>
              </form>
            </div>
            
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center text-text-muted gap-4">
                <span className="material-symbols-outlined animate-spin text-[32px]">progress_activity</span>
                <p className="font-body-md">Đang tải dữ liệu...</p>
              </div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-subtle">
                      <th className="px-6 py-4 font-label-xs text-label-xs uppercase tracking-wider text-text-muted border-b border-border-soft">Họ và tên</th>
                      <th className="px-6 py-4 font-label-xs text-label-xs uppercase tracking-wider text-text-muted border-b border-border-soft">Email</th>
                      <th className="px-6 py-4 font-label-xs text-label-xs uppercase tracking-wider text-text-muted border-b border-border-soft">Vai trò</th>
                      <th className="px-6 py-4 font-label-xs text-label-xs uppercase tracking-wider text-text-muted border-b border-border-soft">Trạng thái</th>
                      <th className="px-6 py-4 font-label-xs text-label-xs uppercase tracking-wider text-text-muted border-b border-border-soft text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-soft/50">
                    {users.map((user) => (
                      <tr 
                        key={user.id} 
                        className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                        // Khi click vào 1 dòng trong Table, sẽ gán user đó vào state `selectedUser` để bật Modal lên
                        onClick={() => {
                          setSelectedUser(user);
                          setEditingRole(user.role); // Gán sẵn role hiện tại vào form chỉnh sửa role
                        }}
                      >
                        <td className="px-6 py-4">
                          <div className="font-label-md text-text-heading">{user.fullName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-body-sm text-text-body">{user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-label-sm px-3 py-1.5 bg-surface-container rounded-lg text-text-heading">{user.role}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-xs ${user.status === 'ACTIVE' ? 'bg-status-success/10 text-status-success' : 'bg-status-danger/10 text-status-danger'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-status-success' : 'bg-status-danger'}`}></span>
                            {user.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khoá'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => status(user)}
                            className={`px-4 py-1.5 rounded-lg font-label-sm transition-colors ${
                              user.status === "ACTIVE" 
                                ? "bg-surface-container hover:bg-status-danger/10 text-on-surface-variant hover:text-status-danger" 
                                : "bg-primary-container/50 hover:bg-primary-container text-on-primary-container"
                            }`}
                          >
                            {user.status === "ACTIVE" ? "Khoá TK" : "Mở khoá"}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                       <tr>
                         <td colSpan={5} className="px-6 py-8 text-center text-text-muted font-body-sm">
                           Không tìm thấy người dùng nào
                         </td>
                       </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="p-4 border-t border-border-soft flex justify-center items-center gap-2">
                <button 
                  disabled={page === 0}
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <span className="font-label-sm text-text-muted px-4">Trang {page + 1} / {totalPages}</span>
                <button 
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
          <div className="bg-surface-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border-soft flex justify-between items-start">
              <div>
                <h3 className="font-headline-md text-headline-md text-text-heading">{selectedUser.fullName}</h3>
                <p className="font-body-sm text-text-muted">{selectedUser.email}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-text-muted hover:text-text-heading">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-text-muted">Vai trò</label>
                <select
                  value={editingRole || selectedUser.role}
                  onChange={(e) => setEditingRole(e.target.value as Role)}
                  className="w-full bg-surface-input-tint px-4 py-2.5 rounded-xl font-label-md text-text-heading outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {(["ADMIN", "OWNER", "USER"] as Role[]).map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-text-muted">Trạng thái</label>
                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl">
                  <span className={`inline-flex items-center gap-2 font-label-sm ${selectedUser.status === 'ACTIVE' ? 'text-status-success' : 'text-status-danger'}`}>
                    <span className={`w-2 h-2 rounded-full ${selectedUser.status === 'ACTIVE' ? 'bg-status-success' : 'bg-status-danger'}`}></span>
                    {selectedUser.status === 'ACTIVE' ? 'Đang hoạt động' : 'Bị khóa'}
                  </span>
                  <button
                    onClick={() => status(selectedUser)}
                    className={`px-4 py-1.5 rounded-lg font-label-sm transition-colors ${
                      selectedUser.status === "ACTIVE" 
                        ? "bg-status-danger/10 text-status-danger hover:bg-status-danger hover:text-white" 
                        : "bg-primary-container/50 hover:bg-primary text-white"
                    }`}
                  >
                    {selectedUser.status === "ACTIVE" ? "Khóa tài khoản" : "Mở khóa"}
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 bg-surface-subtle border-t border-border-soft flex justify-end gap-3">
              <button 
                onClick={() => setSelectedUser(null)}
                className="px-6 py-2 rounded-xl bg-surface-container text-text-heading font-label-md hover:bg-surface-container-high transition-colors"
              >
                Đóng
              </button>
              <button 
                // Khi bấm cập nhật trong Modal
                onClick={() => {
                  // Chỉ gọi API nếu Role thực sự bị thay đổi so với giá trị cũ
                  if (editingRole && editingRole !== selectedUser.role) {
                    role(selectedUser.id, editingRole);
                  } else {
                    setSelectedUser(null); // Tắt Modal đi
                  }
                }}
                className="px-6 py-2 rounded-xl bg-primary text-white font-label-md hover:bg-primary-hover transition-colors shadow-md shadow-primary/20"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
