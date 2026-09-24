import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/common/AppShell";
import {
  createUser,
  listUsers,
  updateUserRole,
  updateUserStatus,
} from "../services/adminUserService";
import type { Role, User } from "../types/auth";
export function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");
  const [newRole, setNewRole] = useState<Role>("OWNER");
  const load = () => {
    setLoading(true);
    listUsers()
      .then((r) => setUsers(r.data.content))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);
  const role = async (id: number, value: Role) => {
    try {
      await updateUserRole(id, value);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update role");
    }
  };
  const status = async (user: User) => {
    try {
      await updateUserStatus(
        user.id,
        user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      );
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update status");
    }
  };
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await createUser(email, password, fullName, newRole);
      setFullName("");
      setEmail("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account");
    }
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
            <div className="p-6 border-b border-border-soft flex justify-between items-center bg-surface-subtle">
              <h2 className="font-headline-sm text-headline-sm text-text-heading flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">manage_accounts</span>
                Danh sách Người dùng
              </h2>
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
                      <tr key={user.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-label-md text-text-heading">{user.fullName}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-body-sm text-text-body">{user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={user.role}
                            onChange={(e) => role(user.id, e.target.value as Role)}
                            className="bg-surface-input-tint px-3 py-1.5 rounded-lg font-label-sm text-text-heading outline-none border border-transparent focus:border-primary/30"
                          >
                            {(["ADMIN", "OWNER", "USER"] as Role[]).map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-label-xs ${user.status === 'ACTIVE' ? 'bg-status-success/10 text-status-success' : 'bg-status-danger/10 text-status-danger'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-status-success' : 'bg-status-danger'}`}></span>
                            {user.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khoá'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
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
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
