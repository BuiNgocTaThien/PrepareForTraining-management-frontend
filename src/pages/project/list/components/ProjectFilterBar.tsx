import type { User } from "../../../../types/auth";

interface ProjectFilterBarProps {
  user: User | null | undefined;
  filter: string;
  setFilter: (f: string) => void;
  sort: string;
  setSort: (s: string) => void;
}

export function ProjectFilterBar({ user, filter, setFilter, sort, setSort }: ProjectFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-2.5 rounded-2xl bg-surface-card shadow-[0_16px_40px_-12px_rgba(175,115,125,0.12)]">
      <div className="inline-flex p-1.5 rounded-xl bg-surface-subtle" role="tablist">
        {user?.role === "ADMIN" && (
          <button type="button" onClick={() => setFilter("all")} className={`role-tab flex items-center gap-2 px-4 py-2 rounded-lg font-label-md text-label-md transition-all duration-200 ${filter === 'all' ? 'active bg-text-heading text-on-primary' : 'text-text-muted hover:text-text-heading'}`}>
            <span className="material-symbols-outlined text-[18px]">view_agenda</span>
            <span>Tất cả dự án</span>
          </button>
        )}
        {user?.role !== "USER" && (
          <button type="button" onClick={() => setFilter("owned")} className={`role-tab flex items-center gap-2 px-4 py-2 rounded-lg font-label-md text-label-md transition-all duration-200 ${filter === 'owned' ? 'active bg-text-heading text-on-primary' : 'text-text-muted hover:text-text-heading'}`}>
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            <span>Tôi sở hữu</span>
          </button>
        )}
        <button type="button" onClick={() => setFilter("shared")} className={`role-tab flex items-center gap-2 px-4 py-2 rounded-lg font-label-md text-label-md transition-all duration-200 ${filter === 'shared' ? 'active bg-text-heading text-on-primary' : 'text-text-muted hover:text-text-heading'}`}>
          <span className="material-symbols-outlined text-[18px]">group_add</span>
          <span>Được chia sẻ</span>
        </button>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <button
            onClick={() => setSort(sort === "createdAt,desc" ? "createdAt,asc" : "createdAt,desc")}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-surface-subtle hover:bg-surface-container font-label-sm text-label-sm text-text-heading transition-colors" type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-text-muted">sort</span>
            <span className="">{sort === "createdAt,desc" ? "Mới nhất" : "Cũ nhất"}</span>
            <span className="material-symbols-outlined text-[16px] text-text-muted">swap_vert</span>
          </button>
        </div>
      </div>
    </div>
  );
}
