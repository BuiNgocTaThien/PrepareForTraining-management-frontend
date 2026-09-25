import { useState, type FormEvent } from "react";

interface CreateProjectCardProps {
  onSubmit: (name: string, description: string) => Promise<void>;
}

export function CreateProjectCard({ onSubmit }: CreateProjectCardProps) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(name, description);
    setName("");
    setDescription("");
    setShowForm(false);
  };

  return (
    <div
      className="group relative flex flex-col items-center justify-center min-h-[220px] p-6 rounded-2xl bg-surface-card/60 hover:bg-surface-card shadow-[0_8px_20px_-6px_rgba(175,115,125,0.08)] hover:shadow-[0_16px_32px_-8px_rgba(175,115,125,0.18)] transition-all duration-200 cursor-pointer text-center"
      onClick={() => !showForm && setShowForm(true)}
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full h-full" onClick={(e) => e.stopPropagation()}>
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
  );
}
