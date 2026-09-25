import { useState } from "react";
import { uploadDocument, deleteDocument, downloadDocument } from "../../../../services/projectService";
import type { Document } from "../../../../types/project";
import type { User } from "../../../../types/auth";

interface DocumentSectionProps {
  projectId: string;
  documents: Document[];
  canManage: boolean;
  currentUser: User | null | undefined;
  onRefresh: () => void;
  onError: (msg: string) => void;
}

export function DocumentSection({ projectId, documents, canManage, currentUser, onRefresh, onError }: DocumentSectionProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert("Kích thước file không được vượt quá 100MB");
      return;
    }

    setUploading(true);
    try {
      await uploadDocument(projectId, file);
      onRefresh();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Không thể upload file");
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteFile = async (docId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) return;
    try {
      await deleteDocument(projectId, docId);
      onRefresh();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Không thể xóa tài liệu");
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
      const response = await downloadDocument(projectId, docId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Không thể tải tài liệu");
    }
  };

  const handleView = async (docId: number, contentType: string) => {
    try {
      const response = await downloadDocument(projectId, docId);
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      onError(err instanceof Error ? err.message : "Không thể xem tài liệu");
    }
  };

  return (
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
                {(currentUser?.role === "ADMIN" || currentUser?.fullName === doc.uploaderName || canManage) && (
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
  );
}
