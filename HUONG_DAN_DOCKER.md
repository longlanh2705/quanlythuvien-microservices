# Hướng Dẫn Sử Dụng Docker Toàn Diện từ A đến Z

Tài liệu này cung cấp hướng dẫn chi tiết, dễ hiểu về Docker dành cho người mới bắt đầu và áp dụng thực tế vào dự án microservices.

---

## Mục lục
1. [Docker là gì? Tại sao nên dùng?](#1-docker-là-gi-tại-sao-nên-dùng)
2. [Các khái niệm cốt lõi trong Docker](#2-các-khái-niệm-cốt-lõi-trong-docker)
3. [Các lệnh Docker cơ bản (Cheat Sheet)](#3-các-lệnh-docker-cơ-bản-cheat-sheet)
4. [Hướng dẫn viết Dockerfile chuẩn](#4-hướng-dẫn-viết-dockerfile-chuẩn)
5. [Docker Compose - Quản lý Multi-Container](#5-docker-compose---quản-lý-multi-container)
6. [Tối ưu hóa Docker (Best Practices)](#6-tối-ưu-hóa-docker-best-practices)
7. [Các lỗi thường gặp và cách khắc phục](#7-các-lỗi-thường-gặp-và-cách-khắc-phục)

---

## 1. Docker là gì? Tại sao nên dùng?

*   **Docker** là một nền tảng mã nguồn mở cho phép bạn đóng gói ứng dụng cùng với tất cả các thư viện, môi trường chạy (runtime) cần thiết thành một đơn vị duy nhất gọi là **Container**.
*   **Giải quyết vấn đề:** *"Code chạy ngon lành trên máy tôi nhưng lỗi trên máy server / máy đồng nghiệp."* Docker đảm bảo ứng dụng chạy đồng nhất ở mọi môi trường (Local, Staging, Production).

---

## 2. Các khái niệm cốt lõi trong Docker

```
 +---------------------------------------------------------------+
 |                        DOCKER HOST                            |
 |                                                               |
 |  +------------------+                 +--------------------+  |
 |  |      Images      |  ---> RUN --->  |     Containers     |  |
 |  | (Bản thiết kế)   |                 | (Ứng dụng chạy)    |  |
 |  +------------------+                 +--------------------+  |
 |           ^                                                   |
 +-----------|---------------------------------------------------+
             | pull / push
             v
 +---------------------------------------------------------------+
 |                       DOCKER REGISTRY                         |
 |               (Docker Hub, GCR, GitHub Registry...)           |
 +---------------------------------------------------------------+
```

*   **Dockerfile:** Một file cấu hình dạng text chứa danh sách các chỉ thị/lệnh để build nên một Docker Image.
*   **Docker Image:** Giống như một "bản thiết kế" hoặc "đĩa cài đặt" hệ điều hành tĩnh (chỉ đọc), chứa source code và môi trường.
*   **Docker Container:** Một thực thể chạy (instance) của Docker Image. Bạn có thể khởi động, dừng, xóa container.
*   **Docker Hub:** Kho chứa trực tuyến công cộng để lưu trữ và chia sẻ Docker Images (như GitHub lưu source code).
*   **Docker Volume:** Cơ chế lưu trữ dữ liệu bền vững (persistent data). Khi container bị xóa, dữ liệu trong Volume vẫn được bảo toàn (rất quan trọng cho Database).
*   **Docker Network:** Giúp các container có thể giao tiếp, kết nối mạng với nhau.

---

## 3. Các lệnh Docker cơ bản (Cheat Sheet)

### 3.1. Quản lý Container:
```bash
# Khởi chạy một container từ Image (nếu chưa có sẽ tự tải về)
docker run -d -p <port_host>:<port_container> --name <ten_container> <ten_image>
# Ví dụ: chạy nginx ở cổng 8080 trên máy host
docker run -d -p 8080:80 --name my-web nginx

# Xem danh sách các container đang chạy
docker ps

# Xem toàn bộ container (kể cả đã tắt)
docker ps -a

# Dừng/Khởi động container
docker stop <id_hoac_ten_container>
docker start <id_hoac_ten_container>

# Xóa container (phải stop trước khi xóa)
docker rm <id_hoac_ten_container>
# Xóa nhanh container đang chạy (force)
docker rm -f <id_hoac_ten_container>

# Xem log của container
docker logs <ten_container>
# Xem log thời gian thực (realtime)
docker logs -f <ten_container>

# Đi vào bên trong terminal của container đang chạy để debug
docker exec -it <ten_container> sh
# Hoặc (nếu container hỗ trợ bash):
docker exec -it <ten_container> /bin/bash
```

### 3.2. Quản lý Images:
```bash
# Liệt kê các images hiện có trên máy
docker images

# Build image từ Dockerfile trong thư mục hiện tại (.)
docker build -t <ten_image_tu_dat>:<tag> .
# Ví dụ: docker build -t auth-service:1.0 .

# Xóa image khỏi máy cục bộ
docker rmi <image_id_hoac_name>

# Xóa bỏ các container đã dừng, network không dùng, và image không dùng để giải phóng bộ nhớ
docker system prune -a
```

---

## 4. Hướng dẫn viết Dockerfile chuẩn

Dưới đây là một Dockerfile mẫu chuẩn dành cho ứng dụng Node.js (ví dụ như dịch vụ `auth-service` của bạn):

```dockerfile
# Bước 1: Chọn Base Image từ Docker Hub (nên chọn bản Alpine để dung lượng nhẹ)
FROM node:18-alpine

# Bước 2: Thiết lập thư mục làm việc bên trong container
WORKDIR /usr/src/app

# Bước 3: Copy các file định nghĩa dependencies trước để tận dụng Docker Cache
COPY package*.json ./

# Bước 4: Cài đặt các thư viện cần thiết
RUN npm install --only=production

# Bước 5: Copy toàn bộ source code từ máy host vào container
COPY . .

# Bước 6: Khai báo cổng mà container sẽ lắng nghe khi chạy
EXPOSE 5000

# Bước 7: Lệnh mặc định được thực thi khi container khởi động
CMD ["npm", "start"]
```

### File `.dockerignore`
Để tránh copy những file không cần thiết (như `node_modules` hay file môi trường `.env`) vào Image làm tăng dung lượng, hãy tạo file `.dockerignore` nằm cùng cấp với `Dockerfile`:
```text
node_modules
npm-debug.log
.env
.git
.gitignore
```

---

## 5. Docker Compose - Quản lý Multi-Container

Khi dự án của bạn có nhiều service chạy cùng lúc (ví dụ: `auth-service`, `gateway`, `database`), thay vì chạy tay từng lệnh `docker run`, ta dùng **Docker Compose** để quản lý tất cả trong 1 file duy nhất `docker-compose.yml`.

### File mẫu `docker-compose.yml`:
```yaml
version: '3.8'

services:
  # Dịch vụ Cơ sở dữ liệu Postgres
  postgres-db:
    image: postgres:15-alpine
    container_name: auth-postgres
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: supersecretpassword
      POSTGRES_DB: auth_db
    volumes:
      - pgdata:/var/lib/postgresql/data

  # Dịch vụ Backend Auth Service
  auth-service:
    build:
      context: ./auth-service
      dockerfile: Dockerfile
    container_name: auth-app
    restart: always
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - DB_HOST=postgres-db # Dùng tên service làm host
      - DB_USER=admin
      - DB_PASSWORD=supersecretpassword
      - DB_NAME=auth_db
    depends_on:
      - postgres-db # Chỉ chạy app khi database đã khởi chạy trước

volumes:
  pgdata: # Khai báo volume để lưu trữ dữ liệu Postgres
```

### Các lệnh Docker Compose thông dụng:
```bash
# Khởi chạy toàn bộ hệ thống ở chế độ chạy ngầm (-d)
docker-compose up -d

# Xem log của tất cả các services
docker-compose logs -f

# Dừng và xóa toàn bộ container, network được tạo bởi file compose
docker-compose down

# Dừng, xóa container kèm theo xóa sạch dữ liệu trong Volumes
docker-compose down -v

# Build lại các image khi có sự thay đổi code và khởi động lại
docker-compose up -d --build
```

---

## 6. Tối ưu hóa Docker (Best Practices)

1.  **Sử dụng Base Image gọn nhẹ:** Nên dùng các phiên bản có hậu tố `-alpine` hoặc `-slim` (ví dụ: `node:18-alpine` thay vì `node:18`).
2.  **Tận dụng Docker Layer Caching:** Sắp xếp các câu lệnh trong `Dockerfile` từ ít thay đổi nhất đến nhiều thay đổi nhất. Đặt `COPY package.json` và `RUN npm install` trước khi `COPY . .`.
3.  **Hạn chế số lượng Layer:** Mỗi dòng lệnh `RUN`, `COPY`, `ADD` sẽ tạo ra một layer mới. Nên gộp các lệnh chạy liên quan bằng dấu `&&`.
4.  **Luôn dùng `.dockerignore`:** Để không đẩy các file rác, file dev hoặc tài liệu không cần thiết vào image.
5.  **Không chạy với quyền root:** Sử dụng User không có quyền root (ví dụ: user `node` mặc định trong image node) để đảm bảo bảo mật.

---

## 7. Các lỗi thường gặp và cách khắc phục

### Lỗi 1: Cổng (Port) đã bị sử dụng
*   **Triệu chứng:** Lỗi báo `port is already allocated` khi chạy `docker run` hoặc `docker-compose up`.
*   **Khắc phục:** Thay đổi port máy host (số đầu tiên) thành một cổng trống, ví dụ chuyển `-p 8080:80` thành `-p 8081:80`.

### Lỗi 2: Dữ liệu biến mất khi khởi động lại container
*   **Triệu chứng:** Dữ liệu trong database bị mất sau khi container bị xóa.
*   **Khắc phục:** Bạn chưa mount volume. Phải thêm cấu hình `volumes` trong file `docker-compose.yml` hoặc cờ `-v` khi chạy lệnh `docker run`.

### Lỗi 3: Không thể kết nối giữa ứng dụng và Database
*   **Triệu chứng:** App báo lỗi `Connection refused` hoặc `host not found`.
*   **Khắc phục:** Trong môi trường Docker, thay vì dùng `localhost` hoặc `127.0.0.1` làm địa chỉ db host, hãy sử dụng **tên service** của Database định nghĩa trong file `docker-compose.yml` (ví dụ: `DB_HOST=postgres-db`).
