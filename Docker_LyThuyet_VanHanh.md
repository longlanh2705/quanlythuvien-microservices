# TỔNG QUAN LÝ THUYẾT, TRIỂN KHAI VÀ VẬN HÀNH DOCKER

Tài liệu này cung cấp nền tảng lý thuyết về Docker và các bước thực tế để triển khai, cài đặt, vận hành hệ thống, kèm theo danh sách các câu lệnh thiết yếu. Rất phù hợp để đưa vào báo cáo đồ án.

---

## PHẦN 1: LÝ THUYẾT DOCKER

### 1.1. Docker là gì?
Docker là một nền tảng mã nguồn mở giúp các lập trình viên tự động hóa việc đóng gói, triển khai và chạy các ứng dụng bên trong các môi trường cô lập được gọi là **Container**. 

Mục tiêu lớn nhất của Docker là giải quyết vấn đề kinh điển: *"Code chạy ngon trên máy tôi, nhưng sang máy khác thì lỗi"*. Bằng cách đóng gói cả code, môi trường (PHP, Apache), thư viện và cấu hình vào một khối duy nhất, Docker đảm bảo ứng dụng sẽ chạy y hệt nhau trên bất kỳ máy tính nào.

### 1.2. Các khái niệm cốt lõi (Kiến trúc Docker)
* **Dockerfile**: Là một file kịch bản chứa các dòng lệnh để Docker tự động xây dựng nên một Image. (Ví dụ: Lệnh tải PHP 8.1, lệnh bật Apache...).
* **Docker Image**: Là một khuôn mẫu (template) chỉ đọc, chứa ứng dụng và toàn bộ môi trường cần thiết để chạy ứng dụng đó. Image giống như một đĩa cài đặt game, bạn không thể chơi trực tiếp trên đĩa mà phải cài nó ra.
* **Docker Container**: Là một thực thể đang chạy được tạo ra từ Image. Nếu Image là "đĩa cài đặt" thì Container chính là "trò chơi đang chạy" trên RAM của bạn. Các Container chạy hoàn toàn độc lập với nhau.
* **Docker Compose**: Là công cụ giúp định nghĩa và chạy các ứng dụng Docker có nhiều Container cùng lúc (Ví dụ: Vừa cần Container cho Web Server, vừa cần Container cho Database MySQL).
* **Docker Hub**: Là thư viện khổng lồ trên mạng, nơi mọi người chia sẻ các Image có sẵn (như `mysql:8.0` hay `phpmyadmin`).

### 1.3. So sánh Docker (Container) và Máy ảo (Virtual Machine - VM)
* **Máy ảo (VM)**: Mỗi máy ảo đòi hỏi phải cài một hệ điều hành riêng biệt (Guest OS), tiêu tốn rất nhiều RAM, CPU và mất vài phút để khởi động.
* **Docker (Container)**: Dùng chung nhân hệ điều hành của máy chủ (Host OS), không cần cài lại hệ điều hành. Do đó, Docker cực kỳ nhẹ, tiêu tốn ít tài nguyên và khởi động chỉ mất vài giây.

---

## PHẦN 2: TRIỂN KHAI VÀ CÀI ĐẶT

### 2.1. Cài đặt Docker trên môi trường Linux (Ubuntu/Debian)
Để hệ thống có thể vận hành, ta cần cài đặt Docker Engine và Docker Compose.

**Cài đặt Docker Engine:**
```bash
# Cập nhật danh sách phần mềm
sudo apt-get update

# Cài đặt các gói phụ trợ
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common -y

# Thêm khóa bảo mật GPG của Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Thêm kho lưu trữ (repository) của Docker
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Cài đặt Docker
sudo apt-get update
sudo apt-get install docker-ce -y
```

**Cài đặt Docker Compose:**
```bash
sudo apt-get install docker-compose -y
```
Kiểm tra cài đặt thành công: `docker --version` và `docker-compose --version`.

### 2.2. Triển khai code vào hệ thống Docker
Quy trình triển khai tiêu chuẩn cho một dự án Web gồm các bước:
1. **Viết Dockerfile**: Định nghĩa môi trường cho Web (VD: Dùng base image `php:8.1-apache`, cài thêm các thư viện `mysqli`, `gd`).
2. **Viết file docker-compose.yml**: Khai báo 3 dịch vụ (services) hoạt động song song:
   - Dịch vụ **web**: Chạy mã nguồn PHP.
   - Dịch vụ **db**: Chạy MySQL Database.
   - Dịch vụ **phpmyadmin**: Giao diện quản lý CSDL.
3. **Map Port (Ánh xạ cổng)**: Thiết lập cổng cho web và phpMyAdmin để truy cập từ bên ngoài.
4. **Volume Mounting**: Đồng bộ thư mục code trên máy chủ vào thẳng thư mục `/var/www/html/` bên trong Container.

---

## PHẦN 3: VẬN HÀNH THỰC TẾ VÀ QUẢN LÝ HỆ THỐNG

Việc vận hành hệ thống Web thông qua Docker mang lại hiệu suất vượt trội, loại bỏ hoàn toàn sự sai lệch giữa các môi trường (Dev - Test - Production). Quản trị viên chỉ cần thao tác bằng lệnh `docker-compose up` là toàn bộ cơ sở hạ tầng mạng, máy chủ web và database tự động được thiết lập chính xác.

---

## PHẦN 4: TỔNG HỢP CÁC CÂU LỆNH DOCKER THƯỜNG DÙNG

Dưới đây là danh sách các câu lệnh Docker và Docker Compose thiết yếu nhất, được chia theo từng nhóm chức năng.

### 4.1. Nhóm lệnh Docker Compose (Quản lý cụm dự án)
| Lệnh | Ý nghĩa / Tác dụng |
| :--- | :--- |
| `docker-compose up -d` | **Khởi động toàn bộ hệ thống** ở chế độ chạy ngầm (Detached mode). |
| `docker-compose up -d --build` | Ép buộc **Build lại môi trường** từ đầu rồi chạy ngầm (Dùng khi vừa sửa Dockerfile). |
| `docker-compose down` | **Tắt toàn bộ hệ thống** và xóa các Container, Mạng (Network) của dự án. |
| `docker-compose stop` | Chỉ **tạm dừng** các Container (Không xóa chúng). |
| `docker-compose start` | **Khởi động lại** các Container đang bị tạm dừng. |
| `docker-compose logs -f` | **Xem nhật ký (logs)** của toàn bộ hệ thống theo thời gian thực để bắt lỗi. |

### 4.2. Nhóm lệnh quản lý Container (Thực thể đang chạy)
| Lệnh | Ý nghĩa / Tác dụng |
| :--- | :--- |
| `docker ps` | Hiển thị danh sách các Container **đang chạy** (Kèm tên, ID, và Cổng kết nối). |
| `docker ps -a` | Hiển thị danh sách **toàn bộ** các Container (Cả những cái đã tắt/lỗi). |
| `docker stop <container_id>` | Tắt một Container cụ thể. |
| `docker start <container_id>` | Bật lại một Container cụ thể. |
| `docker rm <container_id>` | **Xóa vĩnh viễn** một Container (Container phải được tắt trước khi xóa). |
| `docker rm -f <container_id>` | Ép buộc tắt và **xóa ngay lập tức** một Container đang chạy. |
| `docker exec -it <container_id> bash` | **Đăng nhập (chui vào) bên trong** một Container đang chạy để gõ lệnh Linux. |

### 4.3. Nhóm lệnh quản lý Image (Bản mẫu)
| Lệnh | Ý nghĩa / Tác dụng |
| :--- | :--- |
| `docker images` | Hiển thị danh sách các Image đang được lưu trữ trên máy của bạn. |
| `docker pull <tên_image>` | Tải một Image từ Docker Hub về máy. *(Ví dụ: `docker pull mysql:8.0`)* |
| `docker rmi <image_id>` | **Xóa** một Image để giải phóng ổ cứng. |

### 4.4. Nhóm lệnh Dọn dẹp & Bảo trì
| Lệnh | Ý nghĩa / Tác dụng |
| :--- | :--- |
| `docker system prune` | **Dọn rác cơ bản:** Xóa các Container đang tắt, mạng không dùng, và Image rác. |
| `docker system prune -a` | **Dọn rác mạnh tay:** Xóa TOÀN BỘ mọi thứ không đang chạy (Giải phóng dung lượng lớn). |
| `docker volume prune` | Xóa các ổ đĩa ảo (Volume) không còn dùng (⚠️ Cẩn thận làm mất Database). |

### 💡 BÍ KÍP XỬ LÝ SỰ CỐ:
Nếu hệ thống của bạn tự nhiên bị lỗi hoặc đụng cổng mà không rõ nguyên nhân, hãy làm "Combo 2 bước" sau để reset sạch sẽ hệ thống:
1. Gõ: `docker-compose down` (Tắt hệ thống hiện tại).
2. Gõ: `docker-compose up -d --build` (Khởi động và xây lại toàn bộ môi trường mới).
