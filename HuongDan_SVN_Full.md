# HƯỚNG DẪN TOÀN TẬP: TỪ CÀI ĐẶT SVN SERVER ĐẾN CHẠY WEB BẰNG DOCKER

Tài liệu này tổng hợp lại toàn bộ quy trình từ A đến Z dành cho đồ án của bạn. Quy trình gồm 3 giai đoạn chính:
1. Xây dựng Máy chủ SVN trên máy ảo Linux.
2. Đẩy code từ máy tính Windows lên Máy chủ SVN.
3. Tải code về và chạy Website bằng Docker trên máy ảo Linux.

---

## GIAI ĐOẠN 1: XÂY DỰNG MÁY CHỦ SVN (Thực hiện trên Terminal của Máy Ảo Linux)

*Đây là bước tạo ra "Cái Két Sắt" để cất giữ code, theo đúng tài liệu hướng dẫn của UTT.*

### 1. Tạo kho lưu trữ (Repository)
```bash
# Tạo thư mục gốc chứa các kho SVN
sudo mkdir -p /var/lib/svn

# Tạo kho code cho dự án của bạn (ví dụ: duan_phanmem)
sudo svnadmin create /var/lib/svn/duan_phanmem

# Cấp quyền cho Apache quản lý kho code này
sudo chown -R www-data:www-data /var/lib/svn
```

### 2. Mở cổng kết nối qua mạng (Cấu hình Apache WebDAV)
Mở file cấu hình Apache:
```bash
sudo vim /etc/apache2/mods-enabled/dav_svn.conf
```
Dán đoạn cấu hình sau vào để bật truy cập qua link `http://IP_MAY_AO/svn`:
```apache
<Location /svn>
  DAV svn
  SVNParentPath /var/lib/svn
  AuthType Basic
  AuthName "UTT SVN Repository"
  AuthUserFile /etc/apache2/svn-auth-users
  AuthzSVNAccessFile /etc/apache2/svn-authz
  Require valid-user
</Location>
```

### 3. Tạo Tài Khoản và Phân Quyền Bảo Mật
Tạo tài khoản đăng nhập (ví dụ tạo 2 user sv01 và sv02):
```bash
# Tham số -c chỉ dùng cho lần tạo file đầu tiên (tạo user sv01)
sudo htpasswd -c /etc/apache2/svn-auth-users sv01

# Đừng dùng tham số -c cho các user tiếp theo (tạo user sv02)
sudo htpasswd /etc/apache2/svn-auth-users sv02
```

Thiết lập quyền Read/Write (Đọc/Ghi):
Mở file phân quyền:
```bash
sudo vim /etc/apache2/svn-authz
```
Dán nội dung sau:
```ini
[groups]
nhom1 = sv01, sv02

[duan_phanmem:/]
@nhom1 = rw
* = 
```

**Khởi động lại Apache** để áp dụng toàn bộ cài đặt:
```bash
sudo systemctl restart apache2
```
✅ *Đến đây, máy chủ SVN của bạn đã hoàn thiện 100%!*

---

## GIAI ĐOẠN 2: ĐẨY CODE LÊN MÁY CHỦ (Thực hiện trên máy tính Windows)

*Giai đoạn này bạn đem code (Baitaplon và WinmartMVC) cất vào "Két Sắt" vừa tạo.*

1. **Cài đặt phần mềm:** Tải và cài đặt **TortoiseSVN** trên Windows.
2. **Checkout Kho rỗng:**
   - Tạo thư mục `C:\webbanhang_svn`.
   - Click chuột phải vào thư mục -> Chọn **SVN Checkout...**
   - Điền URL: `http://[IP_MAY_AO]/svn/duan_phanmem` và bấm OK.
   - Nhập tài khoản `sv01` và mật khẩu bạn vừa tạo ở Giai đoạn 1.
3. **Đưa code vào thư mục:**
   - Copy 2 thư mục `Baitaplon` và `WinmartMVC` từ `C:\xampp\htdocs\`.
   - Dán vào bên trong thư mục `C:\webbanhang_svn` vừa Checkout.
4. **Đẩy lên máy chủ (Commit):**
   - Click chuột phải vào `C:\webbanhang_svn` -> Chọn **TortoiseSVN > Add...** để đánh dấu các file mới.
   - Click chuột phải lần nữa -> Chọn **SVN Commit...**, ghi chú thích (VD: "Đẩy mã nguồn hệ thống lên SVN") và bấm OK.

---

## GIAI ĐOẠN 3: TRIỂN KHAI VÀ CHẠY DOCKER (Thực hiện lại trên Terminal của Máy Ảo Linux)

*Giai đoạn này là lấy code từ "Két Sắt" ra một "Bàn Làm Việc" để chạy.*

### 1. Chuẩn bị "Bàn Làm Việc"
Chúng ta tạo một thư mục riêng biệt ở `/opt` để làm nơi chạy code, tránh ảnh hưởng đến kho gốc.
```bash
# Tạo thư mục làm việc
sudo mkdir -p /opt/webbanhang

# Chuyển quyền sở hữu cho tài khoản hiện tại để không bị lỗi từ chối truy cập (Permission Denied)
sudo chown -R $USER:$USER /opt/webbanhang
```

### 2. Rút code từ SVN ra
```bash
# Cài đặt công cụ svn trên Linux nếu chưa có
sudo apt-get install subversion -y

# Kéo code từ kho cục bộ ra thư mục làm việc
svn checkout http://127.0.0.1/svn/duan_phanmem /opt/webbanhang
```
*(Tại đây, nó có thể hỏi lại username `sv01` và password)*

### 3. Chạy Website bằng Docker
```bash
# Đi vào thư mục chứa file cấu hình Docker
cd /opt/webbanhang/Baitaplon

# Lệnh thần thánh: Khởi động hệ thống tự động!
docker-compose up -d --build
```

🎉 **THÀNH CÔNG!** Lúc này, bạn chỉ cần mở trình duyệt trên máy Windows, gõ địa chỉ `http://[IP_MAY_AO]/Baitaplon` là trang web đăng nhập của hệ thống siêu thị WinMart sẽ xuất hiện và hoạt động mượt mà!
