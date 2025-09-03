# Hướng Dẫn Cấu Hình Google OAuth

## Bước 1: Cấu hình Google Cloud Console

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Kích hoạt Google+ API
4. Vào **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
5. Chọn **Web application**
6. Điền thông tin:
   - **Name**: TMT Movies OAuth
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (cho development)
     - `https://yourdomain.com` (cho production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/vi/auth/callback` (cho development - tiếng Việt)
     - `http://localhost:3000/en/auth/callback` (cho development - tiếng Anh)
     - `https://yourdomain.com/vi/auth/callback` (cho production - tiếng Việt)
     - `https://yourdomain.com/en/auth/callback` (cho production - tiếng Anh)

## Bước 2: Cấu hình Supabase

1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào **Authentication** > **Providers**
4. Bật **Google** provider
5. Điền thông tin:
   - **Client ID**: Lấy từ Google Cloud Console
   - **Client Secret**: Lấy từ Google Cloud Console
   - **Redirect URL**: `https://your-project.supabase.co/auth/v1/callback`
   
   **Lưu ý**: Supabase sẽ tự động xử lý redirect, bạn không cần thay đổi URL này.

## Bước 3: Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục gốc của dự án:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth (đã có)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Bước 4: Kiểm tra hoạt động

1. Chạy dự án: `npm run dev`
2. Truy cập trang đăng nhập: `http://localhost:3000/auth`
3. Click vào nút "Google" để test đăng nhập

## Lưu ý quan trọng

- **Redirect URLs** phải khớp chính xác giữa Google Cloud Console và Supabase
- Đảm bảo domain được thêm vào **Authorized JavaScript origins** trong Google Cloud Console
- **Client Secret** không được expose ra client-side
- Test kỹ trước khi deploy production

## Troubleshooting

### Lỗi "redirect_uri_mismatch"
- Kiểm tra redirect URI trong Google Cloud Console
- Đảm bảo URI khớp chính xác với callback URL

### Lỗi "invalid_client"
- Kiểm tra Client ID và Client Secret
- Đảm bảo đã kích hoạt Google+ API

### Lỗi "access_denied"
- Kiểm tra OAuth consent screen
- Đảm bảo scope được cấu hình đúng
