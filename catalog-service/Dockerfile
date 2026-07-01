# Bước 1: Sử dụng node image nhẹ dựa trên Alpine Linux
FROM node:18-alpine

# Bước 2: Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app

# Bước 3: Sao chép package.json và package-lock.json để tận dụng cache của Docker
COPY package*.json ./

# Bước 4: Cài đặt dependencies (chỉ cài đặt production dependencies)
RUN npm install --omit=dev

# Bước 5: Sao chép toàn bộ mã nguồn của service vào container
COPY . .

# Bước 6: Mở cổng port của service
EXPOSE 5001

# Bước 7: Lệnh chạy chính để khởi động service
CMD ["npm", "start"]
