# TỔNG QUAN DỰ ÁN: QUẢN LÝ THƯ VIỆN (MICROSERVICES)

Dự án này là một hệ thống **Quản Lý Thư Viện** được thiết kế theo kiến trúc **Microservices**. Hệ thống bao gồm nhiều dịch vụ nhỏ độc lập tương tác với nhau, kết hợp cùng một ứng dụng web ở phía giao diện người dùng (Frontend). Tất cả các dịch vụ và cơ sở dữ liệu được cấu hình để chạy thông qua **Docker Compose**.

---

## 1. Cấu Trúc Tổng Thể & Cơ Sở Hạ Tầng (Infrastructure)

- **Công cụ quản lý container:** Docker và Docker Compose (`docker-compose.yml`).
- **Network:** Dùng chung một network nội bộ là `library-net`.
- **Cơ sở dữ liệu & Message Broker:**
  - **PostgreSQL (`postgres:15-alpine`)**: Chạy ở cổng `5432`. Được sử dụng làm cơ sở dữ liệu chính cho dịch vụ xác thực (Auth Service).
  - **MongoDB (`mongo:6.0`)**: Chạy ở cổng `27017`. Được sử dụng cho dịch vụ lưu trữ danh mục sách (Catalog Service).
  - **RabbitMQ (`rabbitmq:3-management-alpine`)**: Chạy ở cổng `5672` (Giao thức AMQP) và `15672` (Giao diện quản lý UI). Đóng vai trò là Message Broker để các dịch vụ có thể giao tiếp bất đồng bộ với nhau (hiện tại `catalog-service` đã khai báo kết nối).

---

## 2. Các Dịch Vụ Cụ Thể (Microservices)

### 2.1. `auth-service` (Dịch Vụ Xác Thực)
- **Công nghệ:** Node.js, Express.js.
- **ORM / Database:** Sequelize kết nối với PostgreSQL.
- **Thư viện chính:** `jsonwebtoken` (JWT để xác thực), `bcryptjs` (mã hóa mật khẩu), `cors`, `dotenv`.
- **Cổng hoạt động (Port):** `5002`.
- **Nhiệm vụ:** Quản lý đăng ký, đăng nhập và phân quyền người dùng trong hệ thống thư viện.

### 2.2. `catalog-service` (Dịch Vụ Danh Mục Sách)
- **Công nghệ:** Node.js, Express.js.
- **ORM / Database:** Mongoose kết nối với MongoDB.
- **Message Broker:** Kết nối với RabbitMQ qua thư viện `amqplib`.
- **Thư viện chính:** `cors`, `dotenv`.
- **Cổng hoạt động (Port):** `5001`.
- **Nhiệm vụ:** Quản lý thông tin đầu sách, danh mục tài liệu của thư viện.

### 2.3. `frontend-app` (Giao Diện Người Dùng)
- **Công nghệ:** React.js (phiên bản 19), được build và dev thông qua **Vite**.
- **Routing:** Sử dụng `react-router-dom` để xử lý điều hướng trang.
- **UI / Icon:** Sử dụng `lucide-react` cho thư viện biểu tượng.
- **Công cụ khác:** ESLint để quản lý chất lượng code chuẩn.
- **Nhiệm vụ:** Trang web giao tiếp trực tiếp với người dùng cuối, gọi các API từ các dịch vụ backend.

### 2.4. `api-gateway` (Cổng Giao Tiếp API) - *Chưa triển khai*
- **Tình trạng:** Hiện mới chỉ có thư mục và file `README.md`.
- **Nhiệm vụ dự kiến:** Nhận mọi request từ `frontend-app` và phân luồng (route) các request này đến đúng các microservices ở phía sau (`auth-service`, `catalog-service`, v.v.).

### 2.5. `circulation-service` (Dịch Vụ Mượn/Trả Sách) - *Chưa triển khai*
- **Tình trạng:** Hiện mới chỉ có thư mục và file `README.md`.
- **Nhiệm vụ dự kiến:** Quản lý các nghiệp vụ cốt lõi của thư viện như lập phiếu mượn sách, trả sách, tính phí trễ hạn, và tương tác với `catalog-service` để kiểm tra trạng thái cuốn sách.

---

## 3. Cách Bắt Đầu

Để khởi chạy toàn bộ hệ thống cơ sở hạ tầng và các dịch vụ đã có (Database, Message Broker, Catalog, Auth), bạn cần chạy lệnh sau ở thư mục gốc chứa file `docker-compose.yml`:

```bash
docker-compose up -d
```

Phần `frontend-app` hiện tại là một project độc lập có thể chạy thủ công bằng cách:
```bash
cd frontend-app
npm install
npm run dev
```
