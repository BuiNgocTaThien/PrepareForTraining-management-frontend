import { useState, type FormEvent } from "react";
import { addMember, removeMember } from "../../../../services/projectService";
import type { Project, ProjectMember } from "../../../../types/project";
import type { User } from "../../../../types/auth";

interface MemberSectionProps {
  projectId: string;
  project: Project;
  members: ProjectMember[];
  canManage: boolean;
  currentUser: User | null | undefined;
  onRefresh: () => void;
  onError: (msg: string) => void;
}

export function MemberSection({ projectId, project, members, canManage, currentUser, onRefresh, onError }: MemberSectionProps) {
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError("");
    try {
      await addMember(projectId, email);
      setEmail("");
      onRefresh();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Không thể thêm thành viên");
    }
  };

  const handleRemove = async (userId: number) => {
    setLocalError("");
    try {
      await removeMember(projectId, userId);
      onRefresh();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Không thể xóa thành viên");
    }
  };

  return (
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

        {localError && (
          <div className="p-3 rounded-xl bg-error-container text-error font-body-sm text-sm">
            {localError}
          </div>
        )}

        {canManage && (
          <form onSubmit={handleAdd} className="p-4 rounded-xl bg-surface-container-low space-y-3">
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
            <div key={member.userId} className={`flex items-center justify-between p-3 rounded-xl transition-colors group ${member.userId === project.ownerId ? 'bg-surface-container-low hover:bg-surface-container' : 'bg-surface-card hover:bg-surface-container-low'}`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className={`relative w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${member.userId === project.ownerId ? 'bg-text-heading text-on-primary' : member.role === 'ADMIN' ? 'bg-primary/20 text-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                  {member.fullName ? member.fullName.charAt(0).toUpperCase() : "U"}
                  {member.userId === project.ownerId && (
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-status-warning text-surface-card flex items-center justify-center">
                      <span className="material-symbols-outlined text-[10px]">key</span>
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-label-md text-label-md font-semibold text-text-heading truncate">{member.fullName}</p>
                    {member.userId === currentUser?.id && <span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container text-text-muted">Bạn</span>}
                  </div>
                  <p className="font-body-sm text-body-sm text-text-muted truncate text-xs">{member.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 shrink-0 pl-2">
                <span className={`px-2.5 py-1 rounded-full font-label-xs text-label-xs uppercase tracking-wider font-semibold ${member.userId === project.ownerId ? 'bg-text-heading text-on-primary' : 'bg-primary-fixed/40 text-on-primary-fixed'}`}>
                  {member.userId === project.ownerId ? 'OWNER' : member.role}
                </span>
                
                {canManage && member.userId !== project.ownerId && member.userId !== currentUser?.id && (
                  <button onClick={() => handleRemove(member.userId)} className="w-8 h-8 rounded-lg bg-surface-container-low hover:bg-error-container hover:text-error text-text-muted flex items-center justify-center transition-colors" title="Xóa thành viên khỏi dự án" type="button">
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
  );
}
