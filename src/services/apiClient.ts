// --- Đường dẫn gốc tới Backend ---
// Sử dụng biến môi trường (environment variable). Nếu không có, mặc định trỏ về localhost:8080
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api/v1";

// --- Hàm gọi API trung tâm (Core API Client) ---
// Thay vì dùng thư viện Axios nặng nề, ta tự viết hàm bọc lại fetch API của trình duyệt.
// Tất cả các lệnh gọi lên Backend (Login, Upload, Lấy danh sách...) đều phải đi qua hàm này.
export async function apiClient<T>(
  path: string, // Đường dẫn API (Ví dụ: "/auth/login")
  options: RequestInit = {}, // Các tham số phụ như method (GET, POST), body,...
): Promise<T> {
  
  // 1. Lấy JWT Token từ Local Storage (nếu người dùng đã đăng nhập)
  const token = localStorage.getItem("accessToken");
  
  // 2. Thực hiện gọi lên Backend
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json", // Mặc định kiểu dữ liệu là JSON
      // Nếu có Token, tự động gắn vào Header 'Authorization: Bearer <token>' để Backend xác thực
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers, // Ghi đè header nếu được truyền vào từ bên ngoài (Ví dụ: khi upload file)
    },
  });
  
  // 3. Phân tích kết quả trả về từ Backend (Parse JSON)
  const body = await response.json().catch(() => null);
  
  // 4. Kiểm tra lỗi HTTP (Ví dụ: 400, 401, 500)
  if (!response.ok) {
    // Nếu Backend có trả về câu thông báo lỗi (body.message) thì quăng lỗi đó lên.
    // Nếu không thì quăng lỗi mặc định kèm theo mã Status Code.
    throw new Error(body?.message ?? `API request failed: ${response.status}`);
  }
    
  // 5. Trả về dữ liệu nguyên bản nếu gọi API thành công
  return body as T;
}
