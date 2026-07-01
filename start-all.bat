@echo off
echo ===================================================
echo   KHOI DONG HE THONG QUAN LY THU VIEN MICROSERVICES
echo ===================================================
echo.

echo [1] Kiem tra va khoi dong ha tang Databases (Postgres, Mongo, RabbitMQ)...
REM Chạy các container phụ thuộc ngoại trừ auth-service và catalog-service
docker-compose up -d postgres mongodb rabbitmq
echo Databases da san sang!
echo.

echo [1.5] Dang mo Terminal cho API Gateway (Port 5000)...
cd api-gateway
call npm install
start "API Gateway (Port 5000)" cmd /k "echo Dang khoi chay API Gateway... && npm run dev"
cd ..
echo.

echo [2] Dang mo Terminal cho Auth Service (Port 5002)...
cd auth-service
call npm install
start "Auth Service (Port 5002)" cmd /k "echo Dang khoi chay Auth Service... && npm run dev"
cd ..
echo.

echo [3] Dang mo Terminal cho Catalog Service (Port 5001)...
cd catalog-service
call npm install
start "Catalog Service (Port 5001)" cmd /k "echo Dang khoi chay Catalog Service... && npm run dev"
cd ..
echo.

echo [3.5] Dang mo Terminal cho Circulation Service (Port 5003)...
cd circulation-service
call npm install
start "Circulation Service (Port 5003)" cmd /k "echo Dang khoi chay Circulation Service... && npm run dev"
cd ..
echo.

echo [3.6] Dang mo Terminal cho Notification Service (Port 5004)...
cd notification-service
call npm install
start "Notification Service (Port 5004)" cmd /k "echo Dang khoi chay Notification Service... && npm run dev"
cd ..
echo.

echo [4] Dang mo Terminal cho Frontend App (Port 5173)...
cd frontend-app
call npm install
start "Frontend React App (Port 5173)" cmd /k "echo Dang khoi chay Frontend Web... && npm run dev"
cd ..
echo.

echo Tat ca cac dich vu da duoc khoi lenh trong cac cua so Terminal moi!
echo Bam phim bat ky de thoat cua so nay...
pause >nul
