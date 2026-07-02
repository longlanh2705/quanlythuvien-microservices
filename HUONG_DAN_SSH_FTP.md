# HƯỚNG DẪN CẤU HÌNH VÀ SỬ DỤNG SSH, FTP / SFTP

Tài liệu này hướng dẫn chi tiết cách hoàn thiện yêu cầu đồ án: Cấu hình server chạy SSH, FTP (Vsftpd), SFTP và tổng hợp các câu lệnh tương tác cơ bản nhất.

---

## PHẦN 1: CẤU HÌNH VÀ SỬ DỤNG SSH
**SSH (Secure Shell)** là giao thức giúp bạn điều khiển máy ảo Linux từ xa thông qua màn hình dòng lệnh (Terminal) của máy tính Windows.

### 1.1. Cài đặt SSH Server trên Linux
Mặc định Ubuntu/Debian thường đã có sẵn SSH. Nếu chưa có, gõ lệnh sau trên Linux:
```bash
# Cập nhật hệ thống
sudo apt update

# Cài đặt OpenSSH Server
sudo apt install openssh-server -y

# Bật SSH chạy ngầm cùng hệ thống
sudo systemctl enable ssh
sudo systemctl start ssh
```

### 1.2. Kết nối SSH từ máy Windows
**Cách 1: Dùng PowerShell (Nhanh gọn, có sẵn trên Windows)**
1. Mở PowerShell.
2. Gõ câu lệnh kết nối: `ssh <tên_user_linux>@<IP_máy_ảo>`
   *(Ví dụ: `ssh sv01@192.168.0.105`)*
3. Gõ `yes` và nhập mật khẩu của máy ảo Linux.

**Cách 2: Dùng Bitvise SSH Client (Có giao diện)**
1. Tải và cài phần mềm Bitvise SSH Client trên Windows.
2. Mở phần mềm, điền: Host (`192.168.0.105`), Port (`22`), Username và Password.
3. Bấm **Log in** để mở cửa sổ Terminal.

---

## PHẦN 2: CẤU HÌNH FTP VÀ SFTP (Truyền file)
* **SFTP** (Secure FTP): Truyền file an toàn qua cổng 22 của SSH. Đã có sẵn khi cài SSH.
* **FTP**: Truyền file qua cổng 21, tốc độ nhanh. Cần cài phần mềm `vsftpd`.

### 2.1. Cài đặt FTP Server (Vsftpd) trên Linux
```bash
# Cài đặt phần mềm vsftpd
sudo apt install vsftpd -y

# Mở file cấu hình để cho phép user tải file lên
sudo nano /etc/vsftpd.conf
```
Trong file này, tìm dòng `#write_enable=YES` và xóa dấu `#` ở đầu đi:
`write_enable=YES`
*(Lưu lại bằng cách ấn Ctrl+O -> Enter -> Ctrl+X)*

Sau đó khởi động lại FTP: `sudo systemctl restart vsftpd`

### 2.2. Kết nối truyền file từ Windows (Không cần cài App)
* **Dùng FTP:** Mở **This PC (File Explorer)** trên Windows, gõ vào thanh địa chỉ `ftp://192.168.0.105`. Nhập tài khoản và mật khẩu. Bạn có thể kéo thả copy file như dùng USB.
* **Dùng SFTP / FTP có App:** Tải FileZilla hoặc WinSCP. Điền IP, Username, Password. Điền Port `21` (cho FTP) hoặc `22` (cho SFTP).

---

## PHẦN 3: TỔNG HỢP CÁC LỆNH DÒNG LỆNH CƠ BẢN (KÈM LƯU Ý QUAN TRỌNG)

Dưới đây là danh sách các câu lệnh Terminal (hoặc PowerShell) cơ bản nhất dành cho các dịch vụ kết nối và truyền tải dữ liệu. 

🚨 **NGUYÊN TẮC SỐ 1 TRƯỚC KHI GÕ LỆNH:**
* Bạn phải phân biệt rõ mình đang gõ ở **Tab Windows** (hiện chữ `C:\...`) hay **Tab Linux** (hiện chữ `sinhvien@...`).
* Lệnh truyền file (`scp`, `sftp`, `ftp`) **BẮT BUỘC** phải gõ ở Tab Windows. Nếu gõ bên trong Linux, máy sẽ báo lỗi ngay lập tức vì Linux không biết ổ C:\ của bạn là gì.

### 3.1. Giao thức SSH (Điều khiển máy chủ từ xa)
*Gõ ở Tab Windows để chui vào điều khiển máy ảo Linux.*
| Câu lệnh | Ý nghĩa / Cách dùng |
| :--- | :--- |
| `ssh user@ip_address` | Kết nối vào máy chủ với cổng mặc định 22. |
| `ssh -p 2222 user@ip_address` | Kết nối vào máy chủ với một cổng tùy chỉnh (VD: 2222). |
| `exit` | Thoát khỏi phiên làm việc SSH, đẩy bạn về lại màn hình Windows. |

### 3.2. Lệnh SCP (Copy file siêu tốc qua dòng lệnh)
*Gõ ở Tab Windows. Lệnh này ném file qua lại thẳng luôn không cần giao diện FTP.*

🚨 **Lưu ý Cấm kỵ:** Không được ném file vào các thư mục hệ thống của Linux (như `/`) hoặc các thư mục tạo bằng `sudo mkdir` (sẽ bị lỗi Permission Denied). Hãy ném vào nhà của bạn (VD: `/home/sinhvien/`).

| Câu lệnh | Ý nghĩa / Cách dùng |
| :--- | :--- |
| `scp file.txt user@ip:/duong/dan/` | **Gửi file** từ máy Windows sang máy ảo Linux. <br>*(VD: `scp index.php sinhvien@192.168.0.106:/home/sinhvien/`)* |
| `scp user@ip:/duong/dan/file.txt .` | **Lấy file** từ máy ảo Linux đem về máy Windows (Dấu chấm `.` là copy về thư mục hiện tại). |
| `scp -r folder user@ip:/duong/dan/` | Gửi nguyên một **thư mục** sang máy chủ (Thêm cờ `-r`). |

### 3.3. Giao thức SFTP (Truyền file an toàn qua SSH)
*Gõ lệnh `sftp user@ip_address` ở Tab Windows để bắt đầu truyền file.*
| Câu lệnh | Ý nghĩa / Cách dùng |
| :--- | :--- |
| `pwd` | Xem mình đang đứng ở thư mục nào trên **máy chủ Linux**. |
| `lpwd` | Xem mình đang đứng ở thư mục nào trên **máy tính Windows** (Local). |
| `ls` | Liệt kê các file đang có trên máy chủ Linux. |
| `put file.txt` | **Tải file lên** (Ném file.txt từ Windows lên Linux). |
| `get file.txt` | **Tải file về** (Lấy file.txt từ Linux về Windows). |
| `exit` hoặc `bye` | Thoát khỏi chế độ SFTP. |

### 3.4. Giao thức FTP (Truyền file truyền thống)
*Gõ lệnh `ftp ip_address` ở Tab Windows, nhập username/password để bắt đầu.*
| Câu lệnh | Ý nghĩa / Cách dùng |
| :--- | :--- |
| `ls` | Hiển thị danh sách file trên máy chủ Linux. |
| `cd folder` | Chui vào một thư mục trên máy chủ Linux. |
| `put file.txt` | Tải một file từ máy Windows lên Linux. |
| `get file.txt` | Tải một file từ máy Linux về Windows. |
| `quit` | Thoát khỏi chế độ FTP. |
