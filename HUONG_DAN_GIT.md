# Hướng Dẫn Sử Dụng Git Toàn Diện từ A đến Z

Tài liệu này cung cấp hướng dẫn chi tiết, dễ hiểu về Git dành cho cả người mới bắt đầu và người muốn hệ thống lại kiến thức.

---

## Mục lục
1. [Giới thiệu về Git & GitHub](#1-giới-thiệu-về-git--github)
2. [Cấu hình Git ban đầu](#2-cấu-hình-git-ban-đầu)
3. [Chu trình làm việc cơ bản (Workflow)](#3-chu-trình-làm-việc-cơ-bản-workflow)
4. [Quản lý nhánh (Branching)](#4-quản-lý-nhánh-branching)
5. [Làm việc với Remote Repository (GitHub, GitLab,...)](#5-làm-việc-với-remote-repository)
6. [Xử lý xung đột (Conflict Resolution)](#6-xử-lý-xung-đột-conflict-resolution)
7. [Các lệnh nâng cao & Mẹo hữu ích](#7-các-lệnh-nâng-cao--mẹo-hữu-ích)
8. [Quy trình Git Flow chuẩn trong dự án](#8-quy-trình-git-flow-chuẩn-trong-dự-án)

---

## 1. Giới thiệu về Git & GitHub

*   **Git:** Là hệ thống quản lý phiên bản phân tán (Distributed Version Control System - DVCS). Nó theo dõi lịch sử thay đổi của các file trong dự án và cho phép nhiều người cùng làm việc trên một mã nguồn mà không sợ ghi đè lên nhau.
*   **GitHub/GitLab/Bitbucket:** Là các dịch vụ lưu trữ trực tuyến (hosting service) cho các Git Repository. Bạn đẩy code của mình từ máy cục bộ (Local) lên các dịch vụ này (Remote) để chia sẻ hoặc sao lưu.

---

## 2. Cấu hình Git ban đầu

Sau khi cài đặt Git, việc đầu tiên bạn cần làm là thiết lập danh tính của mình (chỉ cần làm một lần duy nhất trên máy tính):

```bash
# Thiết lập tên hiển thị
git config --global user.name "Tên Của Bạn"

# Thiết lập email (nên dùng email đăng ký GitHub)
git config --global user.email "email_cua_ban@example.com"

# Kiểm tra lại thông tin cấu hình
git config --list
```

---

## 3. Chu trình làm việc cơ bản (Workflow)

Một chu trình làm việc cơ bản với Git gồm các bước: **Modify (Chỉnh sửa) -> Stage (Đưa vào vùng chờ) -> Commit (Lưu trữ ảnh chụp lưu trạng thái)**.

```
+--------------------+        git add        +------------------+
| Working Directory  | ------------------->  |   Staging Area   |
| (Thư mục làm việc) |                       |   (Vùng chờ)     |
+--------------------+                       +------------------+
                                                      |
                                                      | git commit
                                                      v
+--------------------+        git push       +------------------+
| Remote Repository  | <-------------------  | Local Repository |
| (GitHub/GitLab...) |                       | (Kho lưu trữ cục)|
+--------------------+                       +------------------+
```

### Các lệnh cơ bản:

1.  **Khởi tạo một Git Repository mới:**
    ```bash
    git init
    ```
    *Lệnh này tạo ra một thư mục ẩn `.git` để theo dõi toàn bộ dự án.*

2.  **Sao chép một project có sẵn từ Remote (GitHub...):**
    ```bash
    git clone <url_cua_repo>
    ```

3.  **Kiểm tra trạng thái các file:**
    ```bash
    git status
    ```
    *Lệnh này cho biết file nào vừa được chỉnh sửa, file nào chưa được theo dõi (untracked).*

4.  **Đưa file vào vùng chờ (Staging Area):**
    ```bash
    # Đưa một file cụ thể
    git add ten_file.js

    # Đưa toàn bộ file thay đổi vào vùng chờ
    git add .
    ```

5.  **Lưu lại trạng thái (Commit):**
    ```bash
    git commit -m "Mô tả ngắn gọn về những thay đổi đã làm"
    ```
    *Mẹo: Hãy viết thông điệp commit rõ ràng, ví dụ: "feat: add login function" hoặc "fix: resolve db connection leak".*

6.  **Xem lịch sử commit:**
    ```bash
    git log

    # Xem lịch sử rút gọn trên 1 dòng
    git log --oneline
    ```

---

## 4. Quản lý nhánh (Branching)

Nhánh (Branch) giúp bạn phát triển các tính năng mới độc lập với luồng code chính (`main` hoặc `master`) mà không ảnh hưởng đến sản phẩm đang chạy.

```bash
# Xem danh sách các nhánh hiện có
git branch

# Tạo nhánh mới
git branch <ten_nhanh_moi>

# Chuyển sang nhánh vừa tạo
git checkout <ten_nhanh_moi>
# Hoặc lệnh mới hơn:
git switch <ten_nhanh_moi>

# Tạo và chuyển nhanh sang nhánh mới chỉ bằng 1 lệnh
git checkout -b <ten_nhanh_moi>
# Hoặc:
git switch -c <ten_nhanh_moi>

# Gộp nhánh phụ vào nhánh hiện tại (ví dụ đang ở main, gộp feature-login vào main)
git merge <ten_nhanh_phu>

# Xóa nhánh (sau khi đã gộp xong và không cần nữa)
git branch -d <ten_nhanh_can_xoa>
```

---

## 5. Làm việc với Remote Repository

Để làm việc nhóm, bạn cần đẩy mã nguồn lên các server như GitHub.

```bash
# Liên kết Local Repo với Remote Repo (chỉ cần làm 1 lần đầu)
git remote add origin <url_cua_repo_tren_github>

# Đẩy code lên Remote lần đầu tiên (thiết lập nhánh theo dõi mặc định)
git push -u origin <ten_nhanh>
# Ví dụ: git push -u origin main

# Các lần tiếp theo chỉ cần:
git push

# Lấy code mới nhất từ Remote về máy cục bộ và gộp luôn vào code hiện tại:
git pull

# Tải thông tin mới từ Remote về nhưng chưa gộp vào code cục bộ (an toàn để kiểm tra trước):
git fetch
```

---

## 6. Xử lý xung đột (Conflict Resolution)

Xung đột (Merge Conflict) xảy ra khi 2 người cùng sửa một dòng code ở một file trên cùng một nhánh, hoặc gộp 2 nhánh có thay đổi đối kháng nhau.

### Cách xử lý:
1.  Git sẽ thông báo file bị xung đột và đánh dấu trong file đó bằng các ký tự:
    ```text
    <<<<<<< HEAD
    Đoạn code của bạn ở Local (Hiện tại bạn đang đứng ở đây)
    =======
    Đoạn code của người khác hoặc nhánh khác đưa vào
    >>>>>>> branch-name
    ```
2.  Mở file bị lỗi xung đột bằng VS Code hoặc Text Editor.
3.  Chọn giữ lại code của bạn (Accept Current Change), giữ code kia (Accept Incoming Change), hoặc giữ cả hai (Accept Both Changes) và chỉnh sửa cho hợp lý.
4.  Xóa các ký tự đánh dấu xung đột (`<<<<<<<`, `=======`, `>>>>>>>`).
5.  Lưu file lại.
6.  Chạy lệnh lưu thay đổi:
    ```bash
    git add .
    git commit -m "fix: resolve merge conflict"
    ```

---

## 7. Các lệnh nâng cao & Mẹo hữu ích

### 7.1. Cất giữ code tạm thời (`git stash`)
Khi bạn đang code dang dở trên một nhánh nhưng phải chuyển gấp sang nhánh khác để fix bug, bạn không muốn commit code chưa hoàn thành. Hãy dùng `stash`:

```bash
# Cất đi toàn bộ thay đổi chưa commit
git stash

# Xem danh sách các lần cất giữ
git stash list

# Lấy lại thay đổi đã cất giữ gần nhất và tiếp tục code
git stash pop
```

### 7.2. Hoàn tác thay đổi (Undo Changes)

```bash
# Hủy bỏ thay đổi của một file chưa add vào staging
git checkout -- <ten_file>

# Đưa file từ vùng chờ (Staging Area) quay lại thư mục làm việc (Unstage)
git reset HEAD <ten_file>

# Quay lại commit trước đó và giữ nguyên code đang sửa
git reset --soft HEAD~1

# Hủy bỏ hoàn toàn commit gần nhất và xóa sạch code đã viết ở commit đó (Cực kỳ cẩn thận!)
git reset --hard HEAD~1
```

---

## 8. Quy trình Git Flow chuẩn trong dự án

Trong thực tế đi làm, các dự án thường tuân theo một quy chuẩn đặt tên nhánh như sau:

*   `main` / `master`: Nhánh chính chứa code sạch nhất, đã chạy ổn định và đang chạy production.
*   `develop`: Nhánh chứa code đang trong quá trình phát triển và kiểm thử liên tục.
*   `feature/...`: Nhánh phát triển tính năng mới (ví dụ: `feature/login`, `feature/cart`). Sau khi làm xong sẽ tạo Pull Request để gộp vào `develop`.
*   `hotfix/...`: Nhánh sửa lỗi khẩn cấp trực tiếp từ `main`. Sau khi sửa xong sẽ merge ngược lại vào cả `main` và `develop`.

### Các bước làm một Task mới:
1.  Lấy code mới nhất từ nhánh `develop` về máy của bạn:
    ```bash
    git checkout develop
    git pull
    ```
2.  Tạo nhánh nhánh tính năng mới:
    ```bash
    git checkout -b feature/register-page
    ```
3.  Viết code tính năng, commit liên tục:
    ```bash
    git add .
    git commit -m "feat: design registration UI"
    ```
4.  Đẩy nhánh này lên Remote:
    ```bash
    git push origin feature/register-page
    ```
5.  Lên GitHub tạo **Pull Request (PR)** từ `feature/register-page` vào `develop`.
6.  Nhờ thành viên khác Review code. Nếu được duyệt (Approve), merge code vào nhánh `develop`.
