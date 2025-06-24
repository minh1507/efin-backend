# EFIN Backend

## Cấu hình phát triển với Docker

### Yêu cầu
- Docker và Docker Compose
- Node.js 18+ (để phát triển local)

### Cơ sở dữ liệu
- **PostgreSQL**: Port 5432 (thay thế MariaDB)
- **MongoDB**: Port 27017
- **MinIO**: Port 9000 (Console: 9001)
- **HashiCorp Vault**: Port 8200 (Secrets Management)

### Chạy ứng dụng

#### 1. Khởi động tất cả services:
```bash
npm run docker:up
```

#### 2. Dừng tất cả services:
```bash
npm run docker:down
```

#### 3. Restart services:
```bash
npm run docker:restart
```

#### 4. Xem logs:
```bash
npm run docker:logs
```

#### 5. Kiểm tra trạng thái containers:
```bash
npm run docker:ps
```

#### 6. Khởi tạo Vault (lần đầu tiên):
```bash
# Windows PowerShell
npm run vault:init

# Linux/Mac
npm run vault:init-bash
```

### Truy cập ứng dụng
- **API Backend**: http://localhost:4600
- **Nginx Proxy**: http://localhost:80
- **PostgreSQL**: localhost:5432
  - Database: `efin_db`
  - User: `postgres`
  - Password: `123456`
- **MongoDB**: localhost:27017
  - User: `admin`
  - Password: `Minlvip123`
- **MinIO Console**: http://localhost:9001
  - User: `admin123`
  - Password: `Minlvip123!`
- **Vault UI**: http://localhost:8200
  - Root Token: `myroot` (development only)

### Development
Để phát triển local mà không cần Docker:
```bash
npm install
npm run start:dev
```

### Migration
```bash
npm run migration:run
```

## Vault Configuration

Đọc thêm tại: `vault-config.md`

**Lưu ý quan trọng**: Sau khi khởi động Docker lần đầu, bạn cần chạy script khởi tạo Vault để tạo các secrets cần thiết cho ứng dụng.
