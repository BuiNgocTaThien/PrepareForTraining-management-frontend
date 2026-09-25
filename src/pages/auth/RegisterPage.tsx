import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setSubmitting(true);
    try {
      await register(email, password, fullName);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-background-canvas-start to-background-canvas-end min-h-screen text-on-surface antialiased flex flex-col justify-center items-center">
      <main className="w-full flex-1 flex items-center justify-center p-gutter">
        <div className="flex flex-col w-full items-center justify-center py-6 px-4">
          
          {/* Interactive & Floating Sakura Atmosphere Layer */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-primary-fixed opacity-40 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-primary-container opacity-30 blur-3xl"></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-surface-container-low opacity-60 blur-2xl"></div>
          </div>

          {/* Dual-Pane Centered Authentication Card */}
          <div className="relative z-10 w-full max-w-4xl bg-surface-card rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-300">
            
            {/* LEFT PANE: Authentication Form */}
            <div className="w-full md:w-1/2 p-8 sm:p-10 lg:p-12 flex flex-col justify-between bg-surface-card">
              <div>
                {/* Brand & System Role Hints */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2.5">
                    <img 
                      alt="PrepareForTraining Logo" 
                      className="w-9 h-9 object-contain rounded-lg shadow-sm" 
                      src="/logo.svg"
                    />
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-headline-sm font-bold text-text-heading tracking-tight">PrepareForTraining</span>
                      <span className="font-label-xs text-label-xs text-text-muted uppercase tracking-widest">Enterprise Hub</span>
                    </div>
                  </div>
                  {/* System Roles Tag / Indicator */}
                  <div className="flex items-center space-x-1">
                    <span className="px-2 py-0.5 rounded-full text-label-xs font-semibold bg-primary-fixed text-on-primary-fixed-variant uppercase tracking-wider">USER</span>
                  </div>
                </div>

                {/* Form Title & Subtitle */}
                <div className="mb-7">
                  <h1 className="font-headline-lg text-headline-lg font-bold text-text-heading tracking-tight mb-1.5">Tạo tài khoản</h1>
                  <p className="font-body-md text-body-md text-text-muted">Tài khoản mới sẽ bắt đầu với vai trò <b>USER</b>. Bạn có thể được nâng cấp sau.</p>
                  {error && (
                    <div className="mt-3 p-3 rounded-lg bg-error-container/50 border border-error-container flex items-center space-x-2">
                      <span className="material-symbols-outlined text-[20px] text-error">error</span>
                      <p className="text-body-sm text-error font-medium">{error}</p>
                    </div>
                  )}
                </div>

                {/* Interactive Form */}
                <form className="space-y-4" onSubmit={submit}>
                  {/* Full Name Input */}
                  <div>
                    <label className="block font-label-sm text-label-sm font-semibold text-text-heading mb-1.5" htmlFor="fullName">Họ và tên</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-outline pointer-events-none material-symbols-outlined text-[20px]">badge</span>
                      <input 
                        id="fullName"
                        type="text" 
                        required 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nguyễn Văn A" 
                        className="w-full pl-11 pr-4 py-3 bg-surface-input-tint rounded-xl font-body-md text-body-md text-text-heading placeholder-outline transition-all duration-200 outline-none focus:bg-surface-card focus:shadow-[0_0_0_2px_#e8b4b8]" 
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block font-label-sm text-label-sm font-semibold text-text-heading mb-1.5" htmlFor="email">Email</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-outline pointer-events-none material-symbols-outlined text-[20px]">email</span>
                      <input 
                        id="email"
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@company.vn" 
                        className="w-full pl-11 pr-4 py-3 bg-surface-input-tint rounded-xl font-body-md text-body-md text-text-heading placeholder-outline transition-all duration-200 outline-none focus:bg-surface-card focus:shadow-[0_0_0_2px_#e8b4b8]" 
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block font-label-sm text-label-sm font-semibold text-text-heading mb-1.5" htmlFor="password">Mật khẩu</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-outline pointer-events-none material-symbols-outlined text-[20px]">lock</span>
                      <input 
                        id="password"
                        type={showPassword ? "text" : "password"} 
                        required 
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="•••••••• (Tối thiểu 6 ký tự)" 
                        className="w-full pl-11 pr-11 py-3 bg-surface-input-tint rounded-xl font-body-md text-body-md text-text-heading placeholder-outline transition-all duration-200 outline-none focus:bg-surface-card focus:shadow-[0_0_0_2px_#e8b4b8]" 
                      />
                      <button 
                        type="button" 
                        className="absolute right-3.5 text-outline hover:text-text-heading transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Hiện mật khẩu"
                      >
                        <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Input */}
                  <div>
                    <label className="block font-label-sm text-label-sm font-semibold text-text-heading mb-1.5" htmlFor="confirmPassword">Nhập lại mật khẩu</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-outline pointer-events-none material-symbols-outlined text-[20px]">lock</span>
                      <input 
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"} 
                        required 
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="•••••••• (Nhập lại mật khẩu)" 
                        className="w-full pl-11 pr-11 py-3 bg-surface-input-tint rounded-xl font-body-md text-body-md text-text-heading placeholder-outline transition-all duration-200 outline-none focus:bg-surface-card focus:shadow-[0_0_0_2px_#e8b4b8]" 
                      />
                      <button 
                        type="button" 
                        className="absolute right-3.5 text-outline hover:text-text-heading transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Hiện mật khẩu"
                      >
                        <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Primary Submit CTA Button */}
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-text-heading hover:bg-[#3D393B] disabled:opacity-70 disabled:cursor-not-allowed text-on-primary font-headline-sm text-headline-sm font-semibold tracking-wide shadow-md hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 disabled:transform-none transition-all duration-150 flex items-center justify-center space-x-2 mt-4"
                  >
                    {submitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                        <span>Đang tạo tài khoản...</span>
                      </>
                    ) : (
                      <>
                        <span>Đăng Ký</span>
                        <span className="material-symbols-outlined text-[18px]">person_add</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Footer Info / Login Call */}
              <div className="mt-8 pt-4 text-center">
                <p className="font-body-sm text-body-sm text-text-muted">
                  Đã có tài khoản?{" "}
                  <Link to="/login" className="font-semibold text-text-heading hover:text-primary transition-colors underline underline-offset-4 decoration-primary/40">
                    Đăng nhập
                  </Link>
                </p>
              </div>
            </div>

            {/* RIGHT PANE: Dreamy Hero Visual Art Panel */}
            <div className="relative w-full md:w-1/2 min-h-[380px] md:min-h-full flex flex-col items-center justify-between p-8 sm:p-10 overflow-hidden text-center">
              {/* Background Image Layer */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBiU9BfExQ-Rw7MMfNMY2kIAZ9alXHk2xDIwF08NEQ0Xg6wK7FJUfBI0tz9Dy-Z-M-YTRh37Xky8fkmcTFJtxBpkbsLK_94tGXA7B-Gkq31Qa5gaeSsadnAjImge9YU5or53B6ZPFcw4ZA-VMDrMk48i6k2lGrlrzEe4gkPU65Nwu_e39uzRfSuRdnUkSz7mLm6aK0D44IdCU6Ca4pF6AGVpbyGlSu5W8sZ1bZXgeslYZTNpTrpkbuONw')" }}
              ></div>
              {/* Soft Tint & Radial Vignette Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-text-heading/30 via-transparent to-text-heading/60 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-primary/10"></div>

              {/* Top Mini Status Badge */}
              <div className="relative z-10 w-full flex justify-end">
                <div className="backdrop-blur-md bg-surface-card/20 px-3.5 py-1 rounded-full flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
                  <span className="font-label-xs text-label-xs font-semibold text-on-primary tracking-wider uppercase">SRS v2.4 Ready</span>
                </div>
              </div>



              {/* Bottom System Feature Highlights */}
              <div className="relative z-10 w-full flex items-center justify-center space-x-6 text-on-primary/80 font-body-sm text-body-sm">
                <div className="flex items-center space-x-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary-fixed">description</span>
                  <span>Tài liệu SRS</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-primary-fixed"></div>
                <div className="flex items-center space-x-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary-fixed">school</span>
                  <span>Khóa Đào Tạo</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-primary-fixed"></div>
                <div className="flex items-center space-x-1.5">
                  <span className="material-symbols-outlined text-[16px] text-primary-fixed">verified_user</span>
                  <span>Bảo mật</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
