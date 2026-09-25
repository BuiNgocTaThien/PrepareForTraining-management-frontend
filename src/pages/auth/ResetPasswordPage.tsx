import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordApi } from "../../services/authService";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
    }
  }, [token]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!token) return;

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await resetPasswordApi(token, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra. Token có thể đã hết hạn.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-background-canvas-start to-background-canvas-end min-h-screen text-on-surface antialiased flex flex-col justify-center items-center">
      <main className="w-full flex-1 flex items-center justify-center p-gutter">
        <div className="flex flex-col w-full items-center justify-center py-6 px-4">
          
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-primary-fixed opacity-40 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-primary-container opacity-30 blur-3xl"></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-surface-container-low opacity-60 blur-2xl"></div>
          </div>

          <div className="relative z-10 w-full max-w-lg bg-surface-card rounded-[2rem] shadow-2xl overflow-hidden flex flex-col transition-all duration-300">
            <div className="w-full p-8 sm:p-10 lg:p-12 flex flex-col bg-surface-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2.5">
                    <img alt="PrepareForTraining Logo" className="w-9 h-9 object-contain rounded-lg shadow-sm" src="/logo.svg" />
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-headline-sm font-bold text-text-heading tracking-tight">PrepareForTraining</span>
                    </div>
                  </div>
                </div>

                <div className="mb-7">
                  <h1 className="font-headline-lg text-headline-lg font-bold text-text-heading tracking-tight mb-1.5">Đặt lại mật khẩu</h1>
                  <p className="font-body-md text-body-md text-text-muted">Vui lòng nhập mật khẩu mới của bạn.</p>
                  {error && (
                    <div className="mt-3 p-3 rounded-lg bg-error-container/50 border border-error-container flex items-center space-x-2">
                      <span className="material-symbols-outlined text-[20px] text-error">error</span>
                      <p className="text-body-sm text-error font-medium">{error}</p>
                    </div>
                  )}
                  {success && (
                    <div className="mt-3 p-3 rounded-lg bg-status-success/10 border border-status-success/30 flex items-center space-x-2">
                      <span className="material-symbols-outlined text-[20px] text-status-success">check_circle</span>
                      <p className="text-body-sm text-status-success font-medium">Mật khẩu đã được thay đổi thành công. Đang tự động chuyển về trang đăng nhập...</p>
                    </div>
                  )}
                </div>

                {!success && token ? (
                    <form className="space-y-4" onSubmit={submit}>
                    <div>
                        <label className="block font-label-sm text-label-sm font-semibold text-text-heading mb-1.5" htmlFor="password">Mật khẩu mới</label>
                        <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-outline pointer-events-none material-symbols-outlined text-[20px]">lock</span>
                        <input 
                            id="password"
                            type={showPassword ? "text" : "password"} 
                            required 
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Tối thiểu 6 ký tự" 
                            className="w-full pl-11 pr-11 py-3 bg-surface-input-tint rounded-xl font-body-md text-body-md text-text-heading placeholder-outline transition-all duration-200 outline-none focus:bg-surface-card focus:shadow-[0_0_0_2px_#e8b4b8]" 
                        />
                        <button 
                            type="button" 
                            className="absolute right-3.5 text-outline hover:text-text-heading transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                        </button>
                        </div>
                    </div>

                    <div>
                        <label className="block font-label-sm text-label-sm font-semibold text-text-heading mb-1.5" htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                        <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-outline pointer-events-none material-symbols-outlined text-[20px]">lock_reset</span>
                        <input 
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"} 
                            required 
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu" 
                            className="w-full pl-11 pr-11 py-3 bg-surface-input-tint rounded-xl font-body-md text-body-md text-text-heading placeholder-outline transition-all duration-200 outline-none focus:bg-surface-card focus:shadow-[0_0_0_2px_#e8b4b8]" 
                        />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={submitting}
                        className="w-full py-3.5 px-6 rounded-xl bg-text-heading hover:bg-[#3D393B] disabled:opacity-70 disabled:cursor-not-allowed text-on-primary font-headline-sm text-headline-sm font-semibold tracking-wide shadow-md hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none transition-all duration-150 flex items-center justify-center space-x-2 mt-4"
                    >
                        {submitting ? (
                        <>
                            <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                            <span>Đang lưu...</span>
                        </>
                        ) : (
                        <span>Lưu mật khẩu mới</span>
                        )}
                    </button>
                    </form>
                ) : (
                    <Link 
                        to="/login"
                        className="w-full py-3.5 px-6 rounded-xl bg-text-heading hover:bg-[#3D393B] text-on-primary font-headline-sm text-headline-sm font-semibold tracking-wide shadow-md hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 flex items-center justify-center space-x-2 mt-4"
                    >
                        Trở lại đăng nhập
                    </Link>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
