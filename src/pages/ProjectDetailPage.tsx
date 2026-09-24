import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { AppShell } from "../components/common/AppShell";
import {
  addMember,
  getProject,
  listMembers,
  removeMember,
  updateProject,
  archiveProject,
  uploadDocument,
  listDocuments,
  deleteDocument,
  downloadDocument,
  askChatbot,
} from "../services/projectService";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Project, ProjectMember, Document } from "../types/project";

export function ProjectDetailPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<{role: "user" | "bot", content: string}[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

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

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addMember(id, email);
      setEmail("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể thêm thành viên");
    }
  };

  const remove = async (userId: number) => {
    try {
      await removeMember(id, userId);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xóa thành viên");
    }
  };

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kích thước tối đa 100MB
    if (file.size > 100 * 1024 * 1024) {
      alert("Kích thước file không được vượt quá 100MB");
      return;
    }

    setUploading(true);
    try {
      await uploadDocument(id, file);
      load(); // Tải lại danh sách sau khi upload
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể upload file");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDeleteFile = async (docId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) return;
    try {
      await deleteDocument(id, docId);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xóa tài liệu");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = async (docId: number, fileName: string) => {
    try {
      const response = await downloadDocument(id, docId);
      // Hack để trigger download blob từ browser
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Revoke the object URL after a short delay to free up memory
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải tài liệu");
    }
  };

  const handleView = async (docId: number, contentType: string) => {
    try {
      const response = await downloadDocument(id, docId);
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      // Note: We don't revoke the URL immediately here because the new tab needs time to load it
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xem tài liệu");
    }
  };

  const handleAskChatbot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuestion.trim()) return;
    
    const questionToAsk = chatQuestion.trim();
    setChatMessages(prev => [...prev, { role: "user", content: questionToAsk }]);
    setChatQuestion("");
    setChatLoading(true);
    
    try {
      const res = await askChatbot(id, questionToAsk);
      setChatMessages(prev => [...prev, { role: "bot", content: res.answer }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: "bot", content: "❌ Rất tiếc, tôi không thể trả lời lúc này do lỗi kết nối với máy chủ AI." }]);
    } finally {
      setChatLoading(false);
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
            <section className="xl:col-span-8 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-card p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-headline-sm text-headline-sm text-text-heading">Tài liệu &amp; Tệp tin đính kèm</h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-surface-container font-label-xs text-label-xs font-semibold text-primary">{documents.length} tệp • {formatFileSize(documents.reduce((acc, curr) => acc + curr.fileSize, 0))}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-text-muted mt-0.5">Kho lưu trữ tài liệu chuẩn</p>
                </div>
              </div>

              <div className="relative group rounded-2xl bg-gradient-to-b from-surface-card to-surface-container-low/60 p-6 md:p-8 text-center transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  onChange={handleFileUpload} 
                  disabled={uploading}
                />
                <label htmlFor="file-upload" className={`p-6 md:p-8 rounded-xl flex flex-col items-center justify-center transition-all ${uploading ? 'bg-surface-container/20 cursor-wait' : 'bg-surface-container/40 cursor-pointer hover:bg-surface-container/70'}`}>
                  <div className={`w-14 h-14 rounded-2xl bg-primary-container/40 flex items-center justify-center mb-3 shadow-inner transition-transform duration-200 ${uploading ? 'text-text-muted' : 'text-primary group-hover:scale-110'}`}>
                    <span className={`material-symbols-outlined text-[30px] ${uploading ? 'animate-bounce' : ''}`}>{uploading ? 'sync' : 'cloud_upload'}</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-text-heading mb-1">
                    {uploading ? (
                      <span className="animate-pulse">Đang tải tệp lên...</span>
                    ) : (
                      <>Kéo &amp; thả tệp tin vào đây, hoặc <span className="text-primary underline decoration-primary-container decoration-2 underline-offset-4">Duyệt tệp từ máy tính</span></>
                    )}
                  </h3>
                  <p className="font-body-sm text-body-sm text-text-muted max-w-xl mb-4 leading-normal">
                    Hỗ trợ PDF, DOCX, XLSX, PPTX, MD, TXT, PNG, JPG, MP4 (Tối đa 100MB/tệp).
                  </p>
                </label>
              </div>

              {documents.length === 0 ? (
                <div className="bg-surface-card rounded-2xl p-8 text-center text-text-muted font-body-sm shadow-[0_16px_40px_-12px_rgba(175,115,125,0.12),0_2px_6px_0_rgba(0,0,0,0.02)]">
                  Chưa có tài liệu nào.
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-surface-card rounded-xl shadow-sm hover:shadow-md transition-shadow group">
                      <div className="flex items-center gap-4 min-w-0 flex-1 cursor-pointer" onClick={() => handleView(doc.id, doc.contentType)}>
                        <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0 transition-colors group-hover:bg-primary/10">
                          <span className="material-symbols-outlined">
                            {doc.contentType.includes('image') ? 'image' 
                             : doc.contentType.includes('video') ? 'movie'
                             : doc.contentType.includes('pdf') ? 'picture_as_pdf'
                             : 'insert_drive_file'}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-label-md text-label-md font-semibold text-text-heading truncate group-hover:text-primary transition-colors" title={doc.fileName}>{doc.fileName}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-text-muted">
                            <span className="font-medium">{formatFileSize(doc.fileSize)}</span>
                            <span>•</span>
                            <span>{doc.uploaderName} tải lên</span>
                            <span>•</span>
                            <span>{formatDate(doc.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleView(doc.id, doc.contentType); }}
                          className="w-10 h-10 rounded-lg bg-surface-container-low hover:bg-primary/10 hover:text-primary text-text-muted flex items-center justify-center transition-colors"
                          title="Xem tài liệu"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDownload(doc.id, doc.fileName); }}
                          className="w-10 h-10 rounded-lg bg-surface-container-low hover:bg-primary/10 hover:text-primary text-text-muted flex items-center justify-center transition-colors"
                          title="Tải xuống"
                        >
                          <span className="material-symbols-outlined text-[18px]">download</span>
                        </button>
                        {(user?.role === "ADMIN" || user?.fullName === doc.uploaderName || canManage) && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteFile(doc.id); }}
                            className="w-10 h-10 rounded-lg bg-surface-container-low hover:bg-error-container hover:text-error text-text-muted flex items-center justify-center transition-colors"
                            title="Xóa tài liệu"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* RIGHT COLUMN: QUẢN LÝ THÀNH VIÊN */}
            <aside className="xl:col-span-4 flex flex-col gap-6">
              <div className="bg-surface-card rounded-2xl p-6 shadow-[0_16px_40px_-12px_rgba(175,115,125,0.12),0_2px_6px_0_rgba(0,0,0,0.02)] space-y-6">
                
                <div className="flex items-center justify-between pb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline-sm text-headline-sm text-text-heading">Thành viên dự án</h3>
                      <span className="px-2 py-0.5 rounded-full bg-primary-fixed/50 text-on-primary-fixed font-label-xs text-label-xs font-semibold">{members.length}</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-text-muted mt-0.5">Phân quyền &amp; cấp phép truy cập</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                  </div>
                </div>

                {canManage && (
                  <form onSubmit={submit} className="p-4 rounded-xl bg-surface-container-low space-y-3">
                    <div className="flex items-center gap-2 text-text-heading font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[18px] text-primary">person_add</span>
                      <span className="">Mời cộng sự mới qua email</span>
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">mail</span>
                        <input 
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 bg-surface-card rounded-lg font-body-md text-body-md text-text-heading placeholder-text-muted focus:outline-none shadow-xs text-xs focus:shadow-[0_0_0_2px_#e8b4b8]" 
                          placeholder="Nhập email cộng sự..." 
                        />
                      </div>
                      <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-text-heading hover:bg-on-background text-on-primary font-label-md text-label-md shadow-sm transition-all active:scale-98">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        <span className="">Thêm thành viên</span>
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                  <p className="font-label-xs text-label-xs uppercase tracking-wider text-text-muted px-1">Danh sách nhân sự hiện tại</p>
                  
                  {members.map(member => (
                    <div key={member.userId} className={`flex items-center justify-between p-3 rounded-xl transition-colors group ${member.userId === project?.ownerId ? 'bg-surface-container-low hover:bg-surface-container' : 'bg-surface-card hover:bg-surface-container-low'}`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`relative w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${member.userId === project?.ownerId ? 'bg-text-heading text-on-primary' : member.role === 'ADMIN' ? 'bg-primary/20 text-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                          {member.fullName ? member.fullName.charAt(0).toUpperCase() : "U"}
                          {member.userId === project?.ownerId && (
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-status-warning text-surface-card flex items-center justify-center">
                              <span className="material-symbols-outlined text-[10px]">key</span>
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-label-md text-label-md font-semibold text-text-heading truncate">{member.fullName}</p>
                            {member.userId === user?.id && <span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container text-text-muted">Bạn</span>}
                          </div>
                          <p className="font-body-sm text-body-sm text-text-muted truncate text-xs">{member.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0 pl-2">
                        <span className={`px-2.5 py-1 rounded-full font-label-xs text-label-xs uppercase tracking-wider font-semibold ${member.userId === project?.ownerId ? 'bg-text-heading text-on-primary' : 'bg-primary-fixed/40 text-on-primary-fixed'}`}>
                          {member.userId === project?.ownerId ? 'OWNER' : member.role}
                        </span>
                        
                        {canManage && member.userId !== project?.ownerId && member.userId !== user?.id && (
                          <button onClick={() => remove(member.userId)} className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-error-container hover:text-error text-text-muted flex items-center justify-center transition-colors" title="Xóa thành viên khỏi dự án" type="button">
                            <span className="material-symbols-outlined text-[16px]">person_remove</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {canManage && (
                  <div className="p-3.5 rounded-xl bg-surface-container/60 flex items-start gap-2.5 text-text-muted">
                    <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">info</span>
                    <p className="font-body-sm text-body-sm text-xs leading-relaxed">
                      <span className="font-semibold text-text-heading">Lưu ý:</span> Chỉ Chủ dự án hoặc Quản trị viên mới có quyền thêm/xóa thành viên.
                    </p>
                  </div>
                )}
              </div>
            </aside>

          </div>
        </div>
      </div>

      {/* FLOATING AI CHATBOT BUTTON & POPUP */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        {/* Chat Popup */}
        {isChatOpen && (
          <div className="w-[480px] bg-surface-card rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.3)] border border-surface-container-low overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-primary/5 border-b border-surface-container-low">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">smart_toy</span>
                <div>
                  <h3 className="font-headline-sm text-sm font-semibold text-text-heading">ChatGPT AI Chat</h3>
                  <p className="font-body-sm text-[11px] text-text-muted">Hỏi đáp tài liệu dự án</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container text-text-muted transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-5 bg-surface-card flex flex-col gap-4">
              <div className="bg-surface-container-low rounded-xl p-5 h-[400px] overflow-y-auto flex flex-col gap-4 font-body-md text-body-md leading-relaxed text-text-heading">
                {chatMessages.length === 0 && !chatLoading ? (
                  <div className="text-text-muted flex flex-col items-center justify-center h-full gap-2 opacity-70 text-center">
                    <span className="material-symbols-outlined text-[36px]">menu_book</span>
                    <span className="text-xs">Hãy đặt câu hỏi,<br/>tôi sẽ tìm đáp án trong tài liệu...</span>
                  </div>
                ) : (
                  <>
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                        <div className={`p-3 rounded-2xl whitespace-pre-wrap shadow-sm ${msg.role === 'user' ? 'bg-primary text-on-primary rounded-tr-sm' : 'bg-surface-card text-text-heading border border-surface-container-low rounded-tl-sm'}`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="self-start flex items-center gap-2 text-text-muted animate-pulse mt-2">
                        <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                        <span className="text-sm">Đang suy nghĩ...</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleAskChatbot} className="flex gap-2">
                <input 
                  type="text"
                  value={chatQuestion}
                  onChange={(e) => setChatQuestion(e.target.value)}
                  placeholder="Nhập câu hỏi..."
                  className="flex-1 bg-surface-container-low px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 ring-primary/30 transition-all text-text-heading placeholder-text-muted"
                  disabled={chatLoading}
                />
                <button 
                  type="submit" 
                  disabled={chatLoading || !chatQuestion.trim()}
                  className="bg-primary text-on-primary w-11 h-11 rounded-xl flex items-center justify-center hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Floating Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 ${isChatOpen ? 'bg-surface-container text-text-heading' : 'bg-primary text-on-primary'}`}
          title="Mở AI Chatbot"
        >
          <span className="material-symbols-outlined text-[28px]">
            {isChatOpen ? 'keyboard_arrow_down' : 'smart_toy'}
          </span>
        </button>
      </div>

    </AppShell>
  );
}
