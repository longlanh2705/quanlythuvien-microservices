# Circulation Service

Dịch vụ quản lý các hoạt động mượn sách, trả sách, đặt trước sách (reservations) và tính phí phạt khi trả sách muộn.

## Công nghệ đề xuất
- **Runtime**: Node.js / Express
- **Cơ sở dữ liệu**: PostgreSQL (Lưu trữ giao dịch mượn/trả, lịch sử, phí phạt)
- **Message Broker**: RabbitMQ client (để xuất bản các event `book.borrowed` hoặc `book.returned` cho Catalog Service đồng bộ kho).
- **Tính năng**: Tạo đơn mượn, duyệt đơn mượn, cập nhật trả sách, tính phí phạt tự động theo ngày quá hạn.

## Cấu trúc thư mục chuẩn
```text
circulation-service/
├── src/
│   ├── config/          # Cấu hình DB, RabbitMQ Connection
│   ├── controllers/     # Controller cho mượn/trả, tính phạt
│   ├── models/          # Model Loan, Reservation, Fine (PostgreSQL)
│   ├── routes/          # Các endpoint mượn/trả/phạt
│   ├── services/        # Nghiệp vụ kiểm tra tồn kho, lưu giao dịch, publish sự kiện
│   └── index.js         # Entry point chính
├── Dockerfile
└── package.json
```
