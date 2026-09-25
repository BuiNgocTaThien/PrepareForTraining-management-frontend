import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { AppShell } from "../../../components/common/AppShell";
import {
  getProject,
  listMembers,
  updateProject,
  archiveProject,
  listDocuments,
} from "../../../services/projectService";
import { ChatbotFab } from "./components/ChatbotFab";
import { MemberSection } from "./components/MemberSection";
import { DocumentSection } from "./components/DocumentSection";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Project, ProjectMember, Document } from "../../../types/project";

export function ProjectDetailPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);


  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([getProject(id), listMembers(id), listDocuments(id)])
      .then(([p, m, d]) => {
        setProject(p.data);
        setEditName(p.data.name);
        setEditDesc(p.data.description || "");
        setMembers(m.data);
        setDocuments(d.data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const canManage = user?.role === "ADMIN" || user?.id === project?.ownerId;


  const saveEdit = async () => {
    try {
      await updateProject(id, editName, editDesc);
      setIsEditing(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật dự án");
    }
  };

  const handleArchive = async () => {
    if (!confirm("Bạn có chắc chắn muốn lưu trữ dự án này?")) return;
    try {
      await archiveProject(id);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể lưu trữ dự án");
    }
  };



  if (loading) {
    return (
      <AppShell>
        <div className="flex flex-col w-full px-gutter py-space-lg max-w-[1520px] mx-auto items-center justify-center min-h-[50vh]">
          <span className="material-symbols-outlined animate-spin text-[40px] text-primary">progress_activity</span>
          <p className="mt-4 font-body-md text-text-muted">Đang tải dữ liệu dự án...</p>
        </div>
      </AppShell>
    );
  }

  if (error || !project) {
    return (
      <AppShell>
        <div className="px-gutter py-space-lg max-w-[1520px] mx-auto">
           <Link to="/dashboard" className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface-card text-on-surface-variant hover:text-text-heading hover:bg-surface-container shadow-sm transition-all duration-200">
             <span className="material-symbols-outlined text-[20px]">arrow_back</span>
           </Link>
           <div className="mt-6 p-4 rounded-xl bg-error-container text-error font-body-sm">
             {error || "Dự án không tồn tại."}
           </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col w-full">
        <div className="px-gutter py-space-lg space-y-space-lg max-w-[1520px] mx-auto w-full">
          {/* TOP BREADCRUMB & CONTROLS */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface-card text-on-surface-variant hover:text-text-heading hover:bg-surface-container shadow-sm transition-all duration-200" to="/dashboard" title="Quay lại danh sách">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </Link>
              <nav className="flex items-center gap-2 font-label-md text-label-md text-text-muted">
                <Link className="hover:text-text-heading transition-colors" to="/dashboard">Trang chủ</Link>
                <span className="material-symbols-outlined text-[16px] text-outline-variant">chevron_right</span>
                <span className="font-semibold text-text-heading truncate max-w-[280px] sm:max-w-md">{project.name}</span>
              </nav>
            </div>
            <div className="flex items-center gap-2.5">
              {canManage && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-xs text-label-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                  {user?.role === "ADMIN" ? "ADMIN" : "OWNER"} (Quản trị)
                </span>
              )}
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-container/30 text-tertiary font-label-xs text-label-xs tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
                </span>
                {project.status || "Đang hoạt động"}
              </span>
            </div>
          </div>

          {/* OVERVIEW & HEADER CARD */}
          <div className="relative overflow-hidden rounded-2xl bg-surface-card p-6 md:p-8 shadow-[0_16px_40px_-12px_rgba(175,115,125,0.12),0_2px_6px_0_rgba(0,0,0,0.02)]">
            <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-gradient-to-br from-primary-fixed/40 via-background-canvas-end/30 to-transparent blur-3xl pointer-events-none"></div>
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-3 max-w-4xl w-full">
                  {isEditing ? (
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-4 py-2 bg-surface-input-tint rounded-xl font-headline-lg text-headline-lg text-text-heading outline-none focus:shadow-[0_0_0_2px_#e8b4b8]"
                      />
                      <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-surface-input-tint rounded-xl font-body-lg text-text-body outline-none focus:shadow-[0_0_0_2px_#e8b4b8]"
                      />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-surface-container text-text-heading rounded-xl font-label-md hover:bg-surface-variant transition-colors">Hủy</button>
                        <button onClick={saveEdit} className="px-4 py-2 bg-primary text-on-primary rounded-xl font-label-md hover:bg-on-primary-fixed-variant transition-colors">Lưu thay đổi</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="font-headline-lg text-headline-lg text-text-heading tracking-tight leading-tight">
                        {project.name}
                      </h1>
                      <p className="font-body-lg text-body-lg text-text-body leading-relaxed max-w-3xl whitespace-pre-line">
                        {project.description || "Không có mô tả cho dự án này."}
                      </p>
                    </>
                  )}
                </div>
                {canManage && !isEditing && (
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-2.5 shrink-0">
                    <button onClick={() => setIsEditing(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-text-heading font-label-md text-label-md transition-all shadow-sm" type="button">
                      <span className="material-symbols-outlined text-[18px]">edit_document</span>
                      <span className="">Sửa dự án</span>
                    </button>
                    <button onClick={handleArchive} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container hover:bg-error-container hover:text-error text-text-muted font-label-md text-label-md transition-all shadow-sm" title="Chuyển vào kho lưu trữ" type="button">
                      <span className="material-symbols-outlined text-[18px]">archive</span>
                      <span className="">Lưu trữ</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-low">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {project.ownerName ? project.ownerName.charAt(0).toUpperCase() : "O"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-label-xs text-label-xs uppercase text-text-muted">Chủ nhiệm dự án</p>
                    <p className="font-label-md text-label-md font-semibold text-text-heading truncate">{project.ownerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-low">
                  <div className="w-10 h-10 rounded-xl bg-surface-card flex items-center justify-center text-primary shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-label-xs text-label-xs uppercase text-text-muted">Trạng thái</p>
                    <p className="font-label-md text-label-md font-semibold text-text-heading">{project.status || "Hoạt động"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-low">
                  <div className="w-10 h-10 rounded-xl bg-surface-card flex items-center justify-center text-status-warning shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">group</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-label-xs text-label-xs uppercase text-text-muted">Nhân sự</p>
                    <p className="font-label-md text-label-md font-semibold text-text-heading">{members.length} Thành viên</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN WORKSPACE 2-COLUMN LAYOUT */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter items-start">
            
            {/* LEFT COLUMN: TÀI LIỆU & FILE UPLOAD */}
            <DocumentSection 
              projectId={id}
              documents={documents}
              canManage={canManage}
              currentUser={user}
              onRefresh={load}
              onError={setError}
            />

            {/* RIGHT COLUMN: QUẢN LÝ THÀNH VIÊN */}
            <MemberSection 
              projectId={id}
              project={project}
              members={members}
              canManage={canManage}
              currentUser={user}
              onRefresh={load}
              onError={setError}
            />

          </div>
        </div>
      </div>

      <ChatbotFab projectId={id} />

    </AppShell>
  );
}
