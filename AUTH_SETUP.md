# 🔐 Hướng Dẫn Cấu Hình Authentication

## Chức Năng Được Thêm

✅ **Đăng Ký** - Tạo tài khoản mới
✅ **Đăng Nhập** - Đăng nhập vào tài khoản
✅ **Đăng Xuất** - Đăng xuất khỏi ứng dụng
✅ **Khôi Phục Mật Khẩu** - Đặt lại mật khẩu qua email
✅ **Bảo Vệ Route** - Trang Todo yêu cầu đăng nhập

## 📋 Cài Đặt Supabase

### Bước 1: Tạo Tài Khoản Supabase
1. Truy cập [supabase.com](https://supabase.com)
2. Đăng ký/Đăng nhập
3. Tạo project mới

### Bước 2: Lấy Credentials
1. Vào **Project Settings** > **API**
2. Copy **Project URL** và **anon key**

### Bước 3: Cấu Hình `.env.local`
```bash
# Copy từ .env.local.example
cp .env.local.example .env.local
```

Sau đó chỉnh sửa `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Bước 4: Bật Email Confirmations (Tùy Chọn)
Nếu muốn xác nhận email:
1. Vào **Authentication** > **Email Templates**
2. Tùy chỉnh template email (tùy ý)
3. Vào **Providers** > **Email** > Tắt **Confirm email**

### Bước 5: Khởi Động Ứng Dụng
```bash
npm run dev
```

## 🔗 Routes Có Sẵn

- `/login` - Đăng nhập
- `/register` - Đăng ký
- `/forgot-password` - Quên mật khẩu
- `/reset-password` - Đặt lại mật khẩu (sau khi click link từ email)
- `/` - Trang Todo (yêu cầu đăng nhập)

## 📁 Cấu Trúc File Mới

```
lib/
├── authContext.tsx       # Context provider cho authentication
└── supabaseClient.ts     # Khởi tạo Supabase client

app/
├── login/page.tsx        # Trang đăng nhập
├── register/page.tsx     # Trang đăng ký
├── forgot-password/      # Trang quên mật khẩu
│   └── page.tsx
├── reset-password/       # Trang đặt lại mật khẩu
│   └── page.tsx
├── layout.tsx            # (Cập nhật) Thêm AuthProvider
└── page.tsx              # (Cập nhật) Thêm logout & auth check
```

## 🛠️ Sử Dụng Auth Context

```typescript
import { useAuth } from '@/lib/authContext';

export default function MyComponent() {
  const { user, session, loading, logout } = useAuth();
  
  if (loading) return <p>Đang tải...</p>;
  if (!user) return <p>Vui lòng đăng nhập</p>;
  
  return (
    <div>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Đăng Xuất</button>
    </div>
  );
}
```

## 🔒 Bảo Mật

- Passwords được lưu trữ an toàn bởi Supabase
- Environment variables được bảo vệ
- JWT tokens được quản lý tự động
- Trang Todo được bảo vệ - chỉ user đã đăng nhập mới có thể truy cập

## ❓ Troubleshooting

**Lỗi: "Cannot find module '@supabase/ssr'"**
```bash
npm install @supabase/ssr
```

**Email không gửi từ Supabase**
- Kiểm tra cấu hình SMTP
- Kiểm tra spam folder
- Xác nhận Email Confirmations đã bật

**Không thể đăng nhập**
- Kiểm tra `.env.local` có đúng URL và key không
- Thử tạo account mới
- Kiểm tra console cho error messages

---

**Chúc mừng! Ứng dụng Todo của bạn giờ đã có authentication đầy đủ! 🎉**
