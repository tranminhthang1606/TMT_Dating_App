# Google OAuth Login - TMT Movies

## Tính năng mới

Dự án đã được tích hợp chức năng đăng nhập bằng Google OAuth thông qua Supabase.

## Cách hoạt động

1. **SocialLogin Component**: Hiển thị nút đăng nhập Google và Facebook
2. **Google OAuth Flow**: Sử dụng Supabase Auth để xử lý OAuth với Google
3. **Callback Handler**: Xử lý redirect từ Google và tạo session
4. **Error Handling**: Hiển thị thông báo lỗi nếu có vấn đề

## Files đã được cập nhật

- `src/app/[locale]/components/auth/SocialLogin.tsx` - Component đăng nhập social
- `src/app/[locale]/auth/callback/page.tsx` - Xử lý OAuth callback
- `GOOGLE_OAUTH_SETUP.md` - Hướng dẫn cấu hình chi tiết

## Cách sử dụng

1. Đảm bảo đã cấu hình Google OAuth theo hướng dẫn trong `GOOGLE_OAUTH_SETUP.md`
2. Chạy dự án: `npm run dev`
3. Truy cập trang đăng nhập: `/auth`
4. Click nút "Google" để đăng nhập

## Lưu ý

- Cần cấu hình Google Cloud Console và Supabase trước khi sử dụng
- Facebook login chưa được implement (chỉ có UI)
- Tất cả lỗi OAuth sẽ được hiển thị cho người dùng
- Redirect URL phải khớp chính xác giữa Google và Supabase

## Troubleshooting

Nếu gặp vấn đề, hãy kiểm tra:
1. Console logs trong browser
2. Network tab để xem OAuth requests
3. Supabase logs
4. Google Cloud Console logs

Xem `GOOGLE_OAUTH_SETUP.md` để biết thêm chi tiết về cấu hình.
