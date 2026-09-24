import { useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppShell } from "../components/common/AppShell";
import { ProjectList } from "../components/project/ProjectList";
import { createProject, listProjects, togglePinProject, toggleStarProject, archiveProject, restoreProject } from "../services/projectService";
import { useAuth } from "../context/AuthContext";
import type { Project } from "../types/project";

export function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  const canCreate = user?.role === "OWNER" || user?.role === "ADMIN";

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const shouldCreate = searchParams.get("create") === "true";
  const filter = searchParams.get("filter") || "";

  const load = () => {
    setLoading(true);
    listProjects(0, 20, filter)
      .then((r) => setProjects(r.data.content))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [filter]);

  useEffect(() => {
    if (shouldCreate && canCreate) {
      setShowForm(true);
      // Clean up query param
      navigate("/dashboard", { replace: true });
    }
  }, [shouldCreate, canCreate, navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await createProject(name, description);
      setName("");
      setDescription("");
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create project");
    }
  };

  const handleTogglePin = async (id: string) => {
    try {
      await togglePinProject(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not toggle pin");
    }
  };

  const handleToggleStar = async (id: string) => {
    try {
      await toggleStarProject(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not toggle star");
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await archiveProject(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not archive");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restoreProject(id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not restore");
    }
  };

  const pinnedProjects = projects.filter(p => p.isPinned);
  const recentProjects = projects.filter(p => !p.isPinned);

  return (
    <AppShell>
      <div className="flex flex-col w-full">
        {/* Top Ambient Glow Aura */}
        <div className="relative w-full overflow-hidden px-margin py-space-xl">
          <div className="absolute -top-32 -left-20 w-96 h-96 rounded-full bg-primary-container/25 blur-3xl pointer-events-none"></div>
          <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-accent-rose-hover/20 blur-3xl pointer-events-none"></div>
          
          {/* Header Banner */}
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
              <div className="flex flex-col gap-1.5 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-label-xs text-label-xs uppercase tracking-wider font-semibold">
                    Hệ thống Tri thức & Huấn luyện
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-label-xs text-label-xs text-text-muted">
                    <span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
                    Đồng bộ MinIO & PostgreSQL trực tiếp
                  </span>
                </div>
                <h1 className="font-headline-xl text-headline-xl text-text-heading tracking-tight">
                  Chào mừng trở lại, {user?.fullName || "Người dùng"} <span className="inline-block animate-wave origin-bottom-right">👋</span>
                </h1>
                <p className="font-body-md text-body-md text-text-body">
                  Không gian sổ tay dự án phong cách Gemini Notebook. Hiện có <strong className="text-text-heading font-semibold">{projects.length} dự án</strong> đang vận hành.
                </p>
              </div>

              {/* Quick Summary Mini Metrics */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-card shadow-[0_10px_30px_-10px_rgba(175,115,125,0.15)]">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[22px]">auto_stories</span>
                  </div>
                  <div>
                    <p className="font-headline-sm text-headline-sm text-text-heading leading-none">{projects.length < 10 ? `0${projects.length}` : projects.length}</p>
                    <span className="font-label-xs text-label-xs text-text-muted">Dự án hoạt động</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-card shadow-[0_10px_30px_-10px_rgba(175,115,125,0.15)]">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-[22px]">cloud_done</span>
                  </div>
                  <div>
                    <p className="font-headline-sm text-headline-sm text-text-heading leading-none">0</p>
                    <span className="font-label-xs text-label-xs text-text-muted">Tài liệu SRS/PDF</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-card shadow-[0_10px_30px_-10px_rgba(175,115,125,0.15)]">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[22px]">group</span>
                  </div>
                  <div>
                    <p className="font-headline-sm text-headline-sm text-text-heading leading-none">0</p>
                    <span className="font-label-xs text-label-xs text-text-muted">Thành viên tham gia</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Role-Switching Control Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-2.5 rounded-2xl bg-surface-card shadow-[0_16px_40px_-12px_rgba(175,115,125,0.12)]">
              <div className="inline-flex p-1.5 rounded-xl bg-surface-subtle" role="tablist">
                <button type="button" className="role-tab active flex items-center gap-2 px-4 py-2 rounded-lg font-label-md text-label-md transition-all duration-200 text-text-muted">
                  <span className="material-symbols-outlined text-[18px]">view_agenda</span>
                  <span>Tất cả dự án</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 font-label-xs text-label-xs">ADMIN ({projects.length})</span>
                </button>
                <button type="button" className="role-tab flex items-center gap-2 px-4 py-2 rounded-lg font-label-md text-label-md text-text-muted hover:text-text-heading transition-all duration-200">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  <span>Tôi sở hữu</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-xs text-label-xs text-primary font-semibold">OWNER (0)</span>
                </button>
                <button type="button" className="role-tab flex items-center gap-2 px-4 py-2 rounded-lg font-label-md text-label-md hover:text-text-heading transition-all duration-200 bg-text-heading text-on-primary">
                  <span className="material-symbols-outlined text-[18px]">group_add</span>
                  <span>Được chia sẻ</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-xs text-label-xs text-text-body">USER (0)</span>
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <button className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-subtle hover:bg-surface-container font-label-sm text-label-sm text-text-heading transition-colors" type="button">
                    <span className="material-symbols-outlined text-[18px] text-text-muted">sort</span>
                    <span className="">Gần đây nhất</span>
                    <span className="material-symbols-outlined text-[16px] text-text-muted">expand_more</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-margin">
          {pinnedProjects.length > 0 && (
            <div className="mt-8 mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-card flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined text-[20px] fill-current" style={{ fontVariationSettings: "'FILL' 1" }}>push_pin</span>
                  </div>
                  <div>
                    <h2 className="font-headline-md text-headline-md text-text-heading tracking-tight">Sổ dự án Ghim ưu tiên</h2>
                    <p className="font-body-sm text-text-muted mt-0.5">Các sổ tay huấn luyện trọng điểm được truy cập thường xuyên nhất</p>
                  </div>
                </div>
                <button type="button" className="text-text-muted hover:text-primary font-label-sm transition-colors flex items-center gap-1">
                  Xem tất cả ({pinnedProjects.length}) <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <ProjectList projects={pinnedProjects} onTogglePin={handleTogglePin} onToggleStar={handleToggleStar} onArchive={handleArchive} onRestore={handleRestore} />
              </div>
            </div>
          )}

          {/* MAIN SECTION: Recent Projects Grid */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-12">
            {/* Left 8 Cols: Project Library Grid */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-6 rounded-full bg-primary"></span>
                  <h2 className="font-headline-md text-headline-md text-text-heading tracking-tight">Sổ dự án gần đây</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm text-text-muted">Hiển thị {recentProjects.length} dự án</span>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-error-container text-error font-body-sm mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Rapid Creation Card */}
                {canCreate && (
                  <div 
                    className="group relative flex flex-col items-center justify-center min-h-[220px] p-6 rounded-2xl bg-surface-card/60 hover:bg-surface-card shadow-[0_8px_20px_-6px_rgba(175,115,125,0.08)] hover:shadow-[0_16px_32px_-8px_rgba(175,115,125,0.18)] transition-all duration-200 cursor-pointer text-center"
                    onClick={() => setShowForm(true)}
                  >
                    {!showForm ? (
                      <>
                        <div className="w-14 h-14 rounded-2xl bg-primary-container/40 group-hover:bg-primary-container text-on-primary-container flex items-center justify-center transition-all duration-300 group-hover:scale-110 mb-3">
                          <span className="material-symbols-outlined text-[28px]">post_add</span>
                        </div>
                        <h4 className="font-headline-sm text-headline-sm text-text-heading">Tạo sổ dự án mới</h4>
                        <p className="mt-1 font-body-sm text-body-sm text-text-muted max-w-xs">
                          Tạo không gian huấn luyện mới cho tổ chức.
                        </p>
                        <div className="mt-3 px-3 py-1 rounded-full bg-surface-container font-label-xs text-label-xs text-primary font-medium">
                          Chỉ huy bởi OWNER / ADMIN
                        </div>
                      </>
                    ) : (
                      <form onSubmit={submit} className="flex flex-col gap-3 w-full h-full" onClick={(e) => e.stopPropagation()}>
                        <h4 className="font-headline-sm text-headline-sm text-text-heading text-left">Tạo dự án mới</h4>
                        <input
                          placeholder="Tên dự án"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-surface-input-tint rounded-xl font-body-md text-text-heading outline-none focus:bg-surface-card focus:shadow-[0_0_0_2px_#e8b4b8]"
                        />
                        <textarea
                          placeholder="Mô tả"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 bg-surface-input-tint rounded-xl font-body-md text-text-heading outline-none focus:bg-surface-card focus:shadow-[0_0_0_2px_#e8b4b8]"
                        />
                        <div className="flex gap-2 mt-2">
                          <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 bg-surface-container text-text-heading rounded-xl font-label-sm font-semibold hover:bg-surface-variant transition-colors">
                            Hủy
                          </button>
                          <button type="submit" className="flex-1 py-2.5 bg-primary text-on-primary rounded-xl font-label-sm font-semibold hover:bg-on-primary-fixed-variant transition-colors">
                            Tạo Mới
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {loading ? (
                  <div className="flex justify-center items-center min-h-[220px]">
                    <span className="material-symbols-outlined animate-spin text-[32px] text-primary">progress_activity</span>
                  </div>
                ) : (
                  <ProjectList projects={recentProjects} onTogglePin={handleTogglePin} onToggleStar={handleToggleStar} onArchive={handleArchive} onRestore={handleRestore} />
                )}
              </div>
            </div>

            {/* Right 4 Cols: Realtime Activity Stream */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="p-6 rounded-2xl bg-surface-card shadow-[0_16px_40px_-12px_rgba(175,115,125,0.12)] flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">history</span>
                    <h3 className="font-headline-sm text-headline-sm text-text-heading">Hoạt động mới nhất</h3>
                  </div>
                  <button className="font-label-xs text-label-xs text-primary hover:underline">Làm mới</button>
                </div>
                <div className="flex flex-col gap-3.5">
                  <div className="py-8 text-center text-text-muted font-body-sm">
                    Chưa có hoạt động nào.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
