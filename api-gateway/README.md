# API Gateway Service

Dịch vụ này đóng vai trò là điểm tiếp nhận duy nhất cho toàn bộ các yêu cầu từ phía client, chịu trách nhiệm định tuyến (routing) các yêu cầu đến các microservices tương ứng bên trong hệ thống.

## Công nghệ đề xuất
- **Runtime**: Node.js / Express
- **Library**: `express-http-proxy` hoặc `http-proxy-middleware` để định tuyến ngược (reverse proxy).
- **Tính năng**: Định tuyến, Giới hạn băng thông (Rate limiting), Xác thực JWT tập trung (Tùy chọn), Cors.

## Cấu trúc thư mục chuẩn
```text
api-gateway/
├── src/
│   ├── config/          # Cấu hình hệ thống (biến môi trường, routing map)
│   ├── middlewares/     # Middleware (Xác thực JWT, rate limiting, logging)
│   ├── routes/          # Cấu hình proxy định tuyến các service
│   └── index.js         # Entry point chính của ứng dụng
├── Dockerfile           # Đóng gói service
└── package.json
```
