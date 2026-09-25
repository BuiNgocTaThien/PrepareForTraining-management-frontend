import { Link } from "react-router-dom";
import { useState } from "react";
import type { Project } from "../../types/project";
import { useAuth } from "../../context/AuthContext";

export function ProjectList({ projects, onTogglePin, onToggleStar, onArchive, onRestore }: { projects: Project[], onTogglePin?: (id: string) => void, onToggleStar?: (id: string) => void, onArchive?: (id: string) => void, onRestore?: (id: string) => void }) {
  const { user } = useAuth();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (!projects.length) {
    return (
      <div className="col-span-full py-12 text-center flex flex-col items-center">
        <span className="material-symbols-outlined text-[48px] text-surface-variant mb-4">folder_open</span>
        <p className="font-body-md text-text-muted">Chưa có dự án nào.</p>
      </div>
    );
  }

  const handlePinClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (onTogglePin) onTogglePin(id);
    setOpenMenuId(null);
  };

  const handleStarClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (onToggleStar) onToggleStar(id);
  };

  const handleMenuClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleArchiveClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (onArchive) onArchive(id);
    setOpenMenuId(null);
  };

  const handleRestoreClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (onRestore) onRestore(id);
    setOpenMenuId(null);
  };

  return (
    <>
      {projects.map((project) => {
        const isOwner = user?.id === project.ownerId || user?.role === "OWNER" || user?.role === "ADMIN";
        const isPinned = project.isPinned;
        const isStarred = project.isStarred;
        
        return (
          <Link
            to={`/projects/${project.id}`}
            key={project.id}
            className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-surface-card shadow-[0_12px_30px_-8px_rgba(175,115,125,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(175,115,125,0.18)] transition-all duration-200`}
            onMouseLeave={() => setOpenMenuId(null)}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {isOwner ? (
                    <span className="px-2 py-0.5 rounded-full bg-text-heading text-on-primary font-label-xs text-label-xs font-semibold">OWNER</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-xs text-label-xs font-semibold">MEMBER</span>
                  )}
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-xs text-label-xs">{project.status}</span>
                </div>
                <div className="relative">
                  <button onClick={(e) => handleMenuClick(e, project.id.toString())} type="button" className="w-8 h-8 rounded-lg hover:bg-surface-container text-text-muted hover:text-text-heading flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                  </button>
                  {openMenuId === project.id.toString() && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-surface-card rounded-xl shadow-lg border border-surface-container py-1 z-20">
                      <button 
                        onClick={(e) => handlePinClick(e, project.id.toString())}
                        className="w-full px-4 py-2 text-left font-label-sm text-text-heading hover:bg-surface-container flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[16px]">{isPinned ? 'keep_off' : 'push_pin'}</span>
                        {isPinned ? 'Bỏ ghim' : 'Ghim dự án'}
                      </button>
                      {isOwner && project.status === 'ACTIVE' && (
                        <button 
                          onClick={(e) => handleArchiveClick(e, project.id.toString())}
                          className="w-full px-4 py-2 text-left font-label-sm text-status-danger hover:bg-surface-container flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                          Lưu trữ dự án
                        </button>
                      )}
                      {isOwner && project.status === 'ARCHIVED' && (
                        <button 
                          onClick={(e) => handleRestoreClick(e, project.id.toString())}
                          className="w-full px-4 py-2 text-left font-label-sm text-status-success hover:bg-surface-container flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[16px]">unarchive</span>
                          Khôi phục dự án
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <h4 className="font-headline-sm text-headline-sm text-text-heading group-hover:text-primary transition-colors flex items-center gap-2">
                {isPinned && <span className="material-symbols-outlined text-[20px] text-primary fill-current" style={{ fontVariationSettings: "'FILL' 1" }}>push_pin</span>}
                {project.name}
              </h4>
              <p className="mt-1.5 font-body-sm text-body-sm text-text-body line-clamp-2">
                {project.description || "Chưa có mô tả"}
              </p>

              <div className="mt-4 flex items-center gap-4 text-text-muted">
                <div className="flex items-center gap-1.5" title="Số lượng hình ảnh">
                  <span className="material-symbols-outlined text-[16px]">image</span>
                  <span className="font-label-xs text-label-xs font-medium">{project.imageCount || 0}</span>
                </div>
                <div className="flex items-center gap-1.5" title="Số lượng tài liệu">
                  <span className="material-symbols-outlined text-[16px]">description</span>
                  <span className="font-label-xs text-label-xs font-medium">{project.documentCount || 0}</span>
                </div>
                <div className="flex items-center gap-1.5" title="Số lượng video">
                  <span className="material-symbols-outlined text-[16px]">movie</span>
                  <span className="font-label-xs text-label-xs font-medium">{project.videoCount || 0}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-5 pt-3.5 bg-surface-subtle -mx-5 -mb-5 px-5 py-3 rounded-b-2xl flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-on-primary text-[10px] flex items-center justify-center uppercase">
                    {project.ownerName?.charAt(0) || "U"}
                  </div>
                  <span className="font-label-xs text-label-xs text-text-muted">Quản lý bởi {project.ownerName}</span>
                </div>
                <button 
                  onClick={(e) => handleStarClick(e, project.id.toString())}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isStarred ? 'text-yellow-500 hover:bg-yellow-500/10' : 'text-text-muted opacity-0 group-hover:opacity-100 hover:bg-surface-container'}`}
                >
                  <span className="material-symbols-outlined text-[20px]" style={isStarred ? { fontVariationSettings: "'FILL' 1" } : {}}>star</span>
                </button>
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
}
