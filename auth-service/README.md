# Auth Service

Dịch vụ quản lý xác thực và phân quyền người dùng trong hệ thống (Độc giả & Quản thủ/Admin). Chịu trách nhiệm đăng ký, đăng nhập, cấp phát JWT (Access Token / Refresh Token) và quản lý phân quyền (RBAC).

## Công nghệ đề xuất
- **Runtime**: Node.js / Express
- **Cơ sở dữ liệu**: PostgreSQL (lưu trữ thông tin user, hashed password, role)
- **ORM**: Sequelize / Prisma
- **Tính năng**: Cấp JWT token, mã hóa bcrypt, xác thực phân quyền.

## Cấu trúc thư mục chuẩn
```text
auth-service/
├── src/
│   ├── config/          # Cấu hình DB, JWT
│   ├── controllers/     # Xử lý đăng ký, đăng nhập
│   ├── middlewares/     # Middleware xác thực token
│   ├── models/          # Model User, Role (PostgreSQL)
│   ├── routes/          # API định tuyến (/auth/login, /auth/register)
│   ├── services/        # Logic nghiệp vụ xác thực & tạo token
│   └── index.js         # Entry point chính
├── Dockerfile
└── package.json
```
