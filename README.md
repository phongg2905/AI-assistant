<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/your-username/techwise-ai">
    <img src="frontend/public/icon.svg" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">TechWise — AI Laptop Shopping Assistant</h3>

  <p align="center">
    Chuyên gia AI tư vấn chọn mua Laptop & Thiết bị Công nghệ dựa trên phân tích nhu cầu thực tế.
    <br />
    <a href="#-about-the-project"><strong>Khám phá tài liệu »</strong></a>
    <br />
    <br />
    <a href="http://localhost:3000">Xem Demo</a>
    ·
    <a href="https://github.com/your-username/techwise-ai/issues">Báo lỗi</a>
    ·
    <a href="https://github.com/your-username/techwise-ai/issues">Yêu cầu tính năng</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary><strong>Mục Lục (Table of Contents)</strong></summary>
  <ol>
    <li>
      <a href="#-about-the-project">Về Dự Án (About The Project)</a>
      <ul>
        <li><a href="#-built-with">Công Nghệ Sử Dụng (Built With)</a></li>
        <li><a href="#-key-features">Tính Năng Chính (Key Features)</a></li>
      </ul>
    </li>
    <li>
      <a href="#-getting-started">Bắt Đầu (Getting Started)</a>
      <ul>
        <li><a href="#-prerequisites">Điều Kiện Tiên Quyết (Prerequisites)</a></li>
        <li><a href="#-installation">Cài Đặt (Installation)</a></li>
      </ul>
    </li>
    <li><a href="#-usage">Hướng Dẫn Sử Dụng (Usage)</a></li>
    <li><a href="#-architecture--structure">Kiến Trúc & Cấu Trúc Dự Án</a></li>
    <li><a href="#-api-documentation">Tài Liệu API (API Documentation)</a></li>
    <li><a href="#-testing">Kiểm Thử (Testing)</a></li>
    <li><a href="#-roadmap">Lộ Trình Phát Triển (Roadmap)</a></li>
    <li><a href="#-contributing">Đóng Góp (Contributing)</a></li>
    <li><a href="#-license">Giấy Phép (License)</a></li>
    <li><a href="#-contact">Liên Hệ (Contact)</a></li>
    <li><a href="#-acknowledgments">Lời Cảm Ơn (Acknowledgments)</a></li>
  </ol>
</details>

---

<!-- ABOUT THE PROJECT -->
## 📖 About The Project

Khi lựa chọn mua laptop cho mục đích học tập, lập trình hoặc giải trí, người dùng thường bị bối rối giữa hàng trăm thông số kỹ thuật phức tạp (xung nhịp CPU, công suất TGP card đồ họa rời, chuẩn RAM nâng cấp, độ phủ màu màn hình,...).

**TechWise** được xây dựng nhằm giải quyết bài toán đó thông qua:
* **Hiểu ngôn ngữ tự nhiên:** Tiếp nhận trực tiếp nhu cầu (*"Tư vấn laptop dưới 30 triệu học CNTT, cần chạy Docker và mở nhiều IDEs"*).
* **Đề xuất tất định (Deterministic Engine):** Lọc ràng buộc, chấm điểm đa chiều và sinh ma trận đánh đổi (Trade-off Matrix) dựa trên dữ liệu benchmark thực tế, tuyệt đối không bịa thông số.
* **Giao diện Liquid Glass đời thường:** Minh họa thông số kỹ thuật dễ hiểu (cân nặng so sánh với 2 chai nước, thời lượng pin cả ngày, độ mượt màn hình).

<p align="right">(<a href="#readme-top">Về đầu trang</a>)</p>

### 🛠 Built With

Dự án sử dụng các công nghệ hiện đại và phổ biến nhất hiện nay:

* [![Next.js][Next.js-badge]][Next.js-url] — Framework ứng dụng React với App Router & Turbopack.
* [![NestJS][NestJS-badge]][NestJS-url] — Framework Node.js backend hướng module (Clean Architecture).
* [![TypeScript][TypeScript-badge]][TypeScript-url] — Đảm bảo an toàn kiểu dữ liệu 100%.
* [![TailwindCSS][Tailwind-badge]][Tailwind-url] — Thiết kế giao diện Liquid Glassmorphism cao cấp.
* [![Vitest][Vitest-badge]][Vitest-url] — Framework chạy Unit & E2E Test tốc độ cao.
* [![Prisma][Prisma-badge]][Prisma-url] — Data ORM tương thích PostgreSQL & pgvector.

<p align="right">(<a href="#readme-top">Về đầu trang</a>)</p>

### ✨ Key Features

* 🤖 **AI Orchestrator & Tool Adapters:** Tự động phát hiện ý định (Intent Extraction) và gọi các tool độc lập (`search_products`, `compare_products`, `get_benchmark`, `search_reviews`).
* 📊 **Multi-attribute Scoring Engine:** Chấm điểm hiệu năng (Performance), độ cơ động (Mobility), pin (Battery), chỉ số giá trị (Value/Price) trên thang điểm 10.
* 🎙️ **Voice Assistant (Web Speech + Waveform):** Trực tiếp nói câu hỏi và nhận diện giọng nói tiếng Việt với sóng âm thanh động.
* 🕷️ **Multi-Source Web Scraper:** Tích hợp pipeline thu thập dữ liệu tự động từ CellphoneS, GearVN và Phong Vũ.
* ⚡ **Streaming SSE:** Truyền tải câu trả lời từ AI theo thời gian thực (Server-Sent Events).

<p align="right">(<a href="#readme-top">Về đầu trang</a>)</p>

---

<!-- GETTING STARTED -->
## 🚀 Getting Started

Để cài đặt và chạy thử dự án trên môi trường nội bộ (Local), hãy làm theo các bước hướng dẫn dưới đây.

### 📋 Prerequisites

Đảm bảo máy tính của bạn đã cài đặt:
* **Node.js** phiên bản `>= 20.0.0`
  ```bash
  node -v
  ```
* **pnpm** (Khuyến nghị phiên bản `>= 10.0.0`)
  ```bash
  npm install -g pnpm
  pnpm -v
  ```

---

### 💻 Installation

1. Clone repository về máy:
   ```bash
   git clone https://github.com/your-username/techwise-ai.git
   cd techwise-ai
   ```

2. Cài đặt các thư viện phụ thuộc cho **Backend**:
   ```bash
   cd backend
   pnpm install
   ```

3. Cài đặt các thư viện phụ thuộc cho **Frontend**:
   ```bash
   cd ../frontend
   pnpm install
   ```

4. Cấu hình file môi trường `.env` tại thư mục `backend/`:
   ```env
   PORT=4000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/techwise_db?schema=public"
   ```

5. Khởi chạy dự án:
   * **Terminal 1 (Backend API):**
     ```bash
     cd backend
     pnpm start:dev
     ```
     Server sẵn sàng tại `http://localhost:4000/api`
   * **Terminal 2 (Frontend Web):**
     ```bash
     cd frontend
     pnpm dev
     ```
     Giao diện sẵn sàng tại `http://localhost:3000`

6. *(Tùy chọn)* Khởi chạy nhanh bằng **Docker Compose**:
   ```bash
   docker-compose up --build
   ```

<p align="right">(<a href="#readme-top">Về đầu trang</a>)</p>

---

<!-- USAGE EXAMPLES -->
## 💡 Usage

Dưới đây là một số ví dụ câu hỏi mẫu bạn có thể thử trực tiếp trên thanh chat hoặc giọng nói:

```text
1. "Tư vấn laptop dưới 30 triệu học CNTT, cần mở Docker và RAM 16GB"
2. "So sánh MacBook Air M2 và ASUS ROG Zephyrus G14"
3. "Điểm benchmark Cinebench R23 của Ryzen 9 8945HS là bao nhiêu?"
4. "Laptop gaming tầm 40 triệu có màn hình OLED đẹp"
5. "Laptop văn phòng mỏng nhẹ dưới 1.3kg pin trâu mang đi làm"
```

_Khi nhận được câu hỏi, TechWise AI sẽ tự động phân tích ngân sách, trích xuất ràng buộc phần cứng và trả về bảng xếp hạng laptop kèm ưu/nhược điểm cụ thể._

<p align="right">(<a href="#readme-top">Về đầu trang</a>)</p>

---

<!-- ARCHITECTURE -->
## 🏛 Architecture & Structure

Dự án được cấu trúc theo nguyên lý **Clean Modular Architecture** độc lập trong 1 Git repository duy nhất:

```text
techwise-ai/
├── backend/                      # NestJS 12 API Service
│   ├── src/
│   │   ├── common/               # Bộ lọc, Interceptors, Exceptions toàn cục
│   │   ├── config/               # Cấu hình biến môi trường
│   │   ├── infrastructure/       # Giao diện Database & Vector Store
│   │   └── modules/
│   │       ├── ai/               # AI Orchestrator & Intent Extractor
│   │       ├── tools/            # Approved ITool Adapters
│   │       ├── recommendations/  # Constraints, Scorers & Ranking
│   │       ├── products/         # Quản lý danh mục Laptop
│   │       ├── crawler/          # Bộ cào dữ liệu từ các sàn bán lẻ
│   │       └── ...
│   └── test/                     # Vitest e2e tests
├── frontend/                     # Next.js 16 Web Client
│   ├── src/
│   │   ├── app/                  # Next.js App Router
│   │   ├── components/           # Liquid Glass UI, Voice, ProductCard
│   │   └── hooks/                # useChat, useVoice, useApiHealth
│   └── public/                   # Static assets & icons
├── docker/                       # Dockerfile.backend & Dockerfile.frontend
├── docs/                         # Tài liệu kiến trúc chuyên sâu
└── docker-compose.yml
```

<p align="right">(<a href="#readme-top">Về đầu trang</a>)</p>

---

<!-- API DOCUMENTATION -->
## 📡 API Documentation

| Method | Endpoint | Mô tả | Payload mẫu |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Kiểm tra tình trạng backend | — |
| `POST` | `/api/chat` | Gửi tin nhắn chat tới AI | `{"message": "Laptop dưới 30 triệu"}` |
| `GET` | `/api/chat/stream` | Server-Sent Events stream | — |
| `POST` | `/api/recommendations` | Tìm kiếm & chấm điểm laptop | `{"budgetMaxVnd": 30000000, "minRamGb": 16}` |
| `GET` | `/api/products` | Lấy danh sách sản phẩm | `?limit=10&brand=Apple` |
| `GET` | `/api/products/:id` | Xem chi tiết 1 sản phẩm | — |
| `POST` | `/api/crawler/run` | Kích hoạt cào dữ liệu mới | — |
| `POST` | `/api/voice/transcribe`| Chuyển đổi giọng nói | `{"textMock": "..."}` |

<p align="right">(<a href="#readme-top">Về đầu trang</a>)</p>

---

<!-- TESTING -->
## 🧪 Testing

Kiểm tra toàn bộ hệ thống bằng bộ test suite tự động:

```bash
# 1. Chạy Unit Tests Backend (Vitest)
cd backend
pnpm test

# 2. Chạy E2E Tests Backend (Vitest + Supertest)
pnpm run test:e2e

# 3. Kiểm tra Types TypeScript Frontend
cd ../frontend
npx tsc --noEmit

# 4. Kiểm tra Production Build
pnpm build
```

<p align="right">(<a href="#readme-top">Về đầu trang</a>)</p>





