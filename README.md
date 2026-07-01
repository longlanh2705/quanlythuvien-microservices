# Hệ Thống Quản Lý Thư Viện (Library Management System)

Kho lưu trữ (repo) này là dự án Quản lý Thư viện được xây dựng theo kiến trúc Microservices hiện đại, sử dụng Node.js, React, MongoDB, PostgreSQL, và RabbitMQ.

Các ứng dụng hiện tại:

- **Frontend**: `frontend-app` (React/Vite)
- **Edge**: `api-gateway` (Đang phát triển)
- **Dịch vụ (Services)**: `auth-service`, `catalog-service`, `circulation-service`

## 🏗️ Tổng quan về Kiến trúc (Architecture Overview)

Dự án này tuân theo Kiến trúc Microservices.

- **Frontend (`frontend-app`)**: Một ứng dụng React giao tiếp với các backend services.
- **Microservices**: Các dịch vụ Node.js độc lập:
  - `auth-service`: Quản lý tài khoản và xác thực người dùng (Sử dụng PostgreSQL).
  - `catalog-service`: Quản lý danh mục sách thư viện (Sử dụng MongoDB).
  - `circulation-service`: Quản lý quy trình mượn/trả sách.
- **Message Broker**: Sử dụng RabbitMQ để giao tiếp bất đồng bộ giữa các microservices.

## 🚀 Hướng dẫn bắt đầu (Getting Started)

### Điều kiện tiên quyết (Prerequisites)

Trước khi bắt đầu, hãy đảm bảo máy bạn đã cài đặt:

- **Docker Desktop**: Để chạy PostgreSQL, MongoDB, RabbitMQ và các dịch vụ đi kèm. Đảm bảo Docker đang mở.
- **Node.js (v18 trở lên)**: Để chạy ứng dụng frontend trực tiếp trên máy host.
- **npm**: Đi kèm với Node.js.

### Thiết lập Backend bằng 1 lệnh

Mở Terminal (hoặc PowerShell/Command Prompt) tại thư mục gốc của dự án (`quanlythuvieb`) và chạy lệnh sau:

```powershell
docker-compose up -d --build
```

Lệnh này sẽ tự động:

- build toàn bộ container cần thiết cho hệ thống
- khởi động `postgres`, `mongodb`, `rabbitmq`, `auth-service`, và `catalog-service`

*Lưu ý: Lần chạy đầu tiên có thể mất 1-2 phút để tải các image về máy.*

### Khởi động nhanh toàn bộ hệ thống bằng 1 lệnh (Khuyên dùng)

Nếu bạn muốn tự động bật Database và **mở hàng loạt cửa sổ Terminal riêng biệt** cho từng dịch vụ (Auth Service, Catalog Service, Frontend) giống như trong tài liệu C2C, hãy mở Terminal tại thư mục gốc (`quanlythuvieb`) và chạy:

```powershell
npm run dev
```

Lệnh này sẽ tự động chạy file `start-all.bat` và tự mở các cửa sổ `cmd` cho bạn! (Mỗi service sẽ chạy trên một cửa sổ riêng).

### Khởi động Giao diện Frontend (Thủ công)

Trong trường hợp bạn chỉ muốn mở mỗi Frontend mà không muốn chạy script mở hàng loạt, thì đứng tại thư mục gốc (`quanlythuvieb`) và chạy lệnh sau:

```powershell
npm install
npm run dev --prefix frontend-app
```

### Truy cập (Access Information)

Sau khi stack chạy xong:

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Auth Service**: [http://localhost:5002](http://localhost:5002) (Health check: `/health`)
- **Catalog Service**: [http://localhost:5001](http://localhost:5001) (API: `/api/books`)
- **RabbitMQ Management UI**: [http://localhost:15672](http://localhost:15672) (Tài khoản: `guest` / `guest`)

**Tài khoản đăng nhập hệ thống mặc định:**

- Username: `admin`
- Password: `admin123`

*(Sử dụng tài khoản Admin để cấp tài khoản cho sinh viên trong tab Quản lý Độc giả).*

### Dừng hệ thống

Khi không sử dụng nữa, bạn mở Terminal ở thư mục gốc và chạy:

```powershell
docker-compose down
```

Lệnh này sẽ tắt toàn bộ các dịch vụ Backend để giải phóng RAM. Dữ liệu trong Database vẫn được giữ nguyên an toàn trong các volume.

### Reset sạch dữ liệu database

Nếu bạn muốn xóa sạch dữ liệu cũ và bắt đầu lại từ đầu:

```powershell
docker-compose down -v
docker-compose up -d --build
```

## 🗄️ Cấu hình Cơ sở dữ liệu (Databases)

Hệ thống database được cấu hình chạy toàn bộ trong Docker:

- **PostgreSQL**: Cổng `5432` (`library_db`), được quản lý bởi `auth-service`.
- **MongoDB**: Cổng `27017` (`catalog_db`), được quản lý bởi `catalog-service`.
- **RabbitMQ**: Cổng `5672` (AMQP) và `15672` (UI).

Dữ liệu được lưu trữ tự động qua các Docker volume (`postgres_data`, `mongodb_data`, `rabbitmq_data`).

## Luồng Demo Dự kiến

Các bước trải nghiệm demo hiện tại:

1. Mở trang web tại `localhost:5173`.
2. Đăng nhập thông qua tài khoản Admin (được xác thực bởi `auth-service`).
3. Truy cập vào trang Quản lý Sách.
4. Xem danh sách sách, thêm/sửa sách (`catalog-service`).
5. Quản lý Độc giả (cấp phát tài khoản mới).

## Xử lý sự cố (Troubleshooting)

### Cổng (Port) đã bị chiếm dụng

Nếu lệnh `docker-compose up` hoặc `npm run dev` thất bại do lỗi chiếm cổng (`EADDRINUSE`), hãy kiểm tra xem bạn có đang chạy các dịch vụ trùng cổng trên máy thật không:
- `5432` (PostgreSQL local)
- `27017` (MongoDB local)
- `5173` (Vite dev server khác)

Hãy tắt các dịch vụ local này hoặc đổi cổng trong file cấu hình tương ứng.

### Lỗi chạy Frontend

Nếu bạn gặp lỗi khi chạy `npm run dev` trong frontend-app, hãy đảm bảo bạn đã cài đặt dependencies bằng lệnh `npm install` trước đó, và kiểm tra biến môi trường kết nối API.

### Lệnh start-all.bat không chạy được

Lệnh `start-all.bat` có thể không tương thích với môi trường PowerShell hiện tại. Vui lòng sử dụng cách thủ công là khởi chạy backend với `docker-compose up -d` và frontend bằng `npm run dev` theo hướng dẫn phía trên.
