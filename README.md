# TechWise — Nền tảng AI Agent Tư vấn Thiết bị Công nghệ

> **Chuyên gia / Kỹ sư tư vấn ảo** cho Laptop/PC/Phone — hiểu ngôn ngữ tự nhiên, phân tích GraphRAG + Multi-Agent, trả về ma trận đánh đổi và chỉ số hối hận sau 1 năm.

Inspired by `instruction.md` (đề án chuyển từ sàn C2C pass đồ cũ sang **AI Agent Recommendation & Decision System**).

---

## 1. Tổng quan

| Lớp | Công nghệ | Vai trò |
|---|---|---|
| **Frontend** | Next.js 16 (App Router) + Tailwind v4 + TypeScript | Trợ lý tìm kiếm, voice sphere, typing mượt, neumorphism sáng |
| **API Gateway** | NestJS 12 + RxJS | Auth/Ratelimit (sẵn sàng), proxy sang các Agent, SSE |
| **AI Core** _(mô phỏng trong NestJS)_ | 5 Agent (Intent, GraphRAG, Trade-off, Cost, Clarification) | Thay thế Python FastAPI + LangGraph khi chưa có infra |
| **Data & Cache** _(mock in-memory)_ | 10 laptop + Knowledge Graph + Qdrant hybrid + Redis semantic cache | Thay thế PostgreSQL/Neo4j/Qdrant/Redis thật |

**5 mũi đột phá so với RAG thường:**

```
[User Input] → [Intent/Clarification] → [GraphRAG & Benchmark] → [Trade-off Analyzer] → [Decision Matrix + Streaming UI]
```

- **Agentic Workflows:** bóc ẩn ngôn (`Học CNTT → RAM≥16GB`, `Valorant → GPU rời`), phản biện, tính P/P.
- **Trade-off Matrix + Regret Index:** so sánh `Hiệu năng/Giá · Trọng lượng · Pin · Nâng cấp` + nhãn `Thấp/TB/Cao`.
- **GraphRAG:** `CPU -CAN_RUN-> Software @ FPS` + review vector (Qdrant).
- **Hỏi ngược:** 1–2 câu làm rõ khi query mơ hồ (`15tr học CNTT` → hỏi chuyên ngành).
- **DevOps:** Semantic Cache `<50ms`, Langfuse tracing (`TelemetryService`), SSE, `devIndicators:false`.

---

## 2. Cấu trúc thư mục

```
TechWise/
├── .gitignore              # root: ignore node_modules, dist, .next, *.tsbuildinfo, .env, logs
├── README.md               # file này
├── instruction.md          # đề án gốc
├── component.png           # ref neumorphism sáng
├── effect_sphere.png       # ref dotted fluid sphere
├── popup_UI.png            # ref popup UI
├── AI-assistant/           # tài liệu AI (lưu ý: chứa .git riêng, xem ghi chú commit)
│
├── backend/                # NestJS API Gateway (port 3001)
│   ├── src/
│   │   ├── main.ts         # prefix /api, CORS, port 3001
│   │   ├── app.module.ts   # import Products/Recommendation/Cache/Telemetry
│   │   ├── common/dto/     # DTO dùng chung
│   │   └── modules/
│   │       ├── products/       # 10 laptop, search(), graphQuery()
│   │       ├── recommendation/ # recommendation.service + controller + dto
│   │       │   └── agents/     # 5 agent: intent, clarification, graph-rag, cost-efficiency, tradeoff
│   │       ├── cache/          # semantic hash + TTL 30m + fuzzy 0.65
│   │       ├── telemetry/      # traceId per request
│   │       ├── crawler/        # crawler.service (chuẩn bị cho Graph)
│   │       ├── pipeline/       # pipeline.service
│   │       └── voice/          # voice.service (wavefile + ffmpeg-static)
│   ├── test/               # e2e
│   ├── scripts/
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── pnpm-workspace.yaml # allowBuilds: ffmpeg-static, sharp...
│   ├── tsconfig.json
│   └── dist/               # build output (đã ignore)
│
└── frontend/               # Next.js App Router (port 3000)
    ├── src/app/
    │   ├── page.tsx        # Trợ lý tìm kiếm + ParticleSphere + AvatarSphere
    │   ├── layout.tsx      # Geist font, metadata, icon.svg (TW)
    │   ├── globals.css     # #CFD8EB neumorphism, siriPing keyframes
    │   └── icon.svg        # Favicon TW thay Next.js
    ├── public/
    ├── package.json
    ├── pnpm-lock.yaml
    ├── pnpm-workspace.yaml
    ├── next.config.ts      # devIndicators:false
    └── .next/              # build output (đã ignore)
```

> **Lưu ý `node_modules` ở root:** trước đây root có `package.json` (`sharp@0.32.6`) và `node_modules/` riêng do chạy `pnpm install` nhầm ở root. Đã xóa — đúng chuẩn chỉ `backend/node_modules` và `frontend/node_modules` tồn tại độc lập. Không chạy `pnpm install` ở root nữa.

---

## 3. Frontend — Trợ lý tìm kiếm

**Tông màu:** nền `#CFD8EB` tối hơn khung chat `#F0F2F5` để nổi bật, shadow `#D1D9E6`/`#CBD5E6` neumorphism mềm.

**Bố cục:**
- Header **không còn thanh ngang**: `fixed bg-transparent`, 2 pill góc trái (`TW + TRỢ LÝ`) và phải (`Lịch sử + TK`) `bg-[#F0F2F5]/75 backdrop-blur-xl rounded-full shadow-[6px_6px_16px_rgba(180,190,210,0.38)]` (`page.tsx:561`).
- Vùng hội thoại **full-width**: `listRef` `w-full max-w-none px-3 lg:px-8 bg-[#CFD8EB]` bỏ panel bọc ngoài, `max-w-none` để dàn đều 2-3 cột (`md:grid-cols-2 xl:grid-cols-3`).
- Input **nổi**: `fixed bottom-0 bg-transparent` chứa pill `rounded-[24px] bg-[#F0F2F5] shadow-[7px_7px_18px_#CBD5E6]` + 2 lớp `chat-spread-1/2` loang mờ `radial-gradient rgba(255,59,0,0.06)` `animation chatSpread 3.8s infinite` (`page.tsx:777,789`).

**Hiệu ứng:**
- **Voice sphere** (`ParticleSphere` 340px, 1650 dot, Fibonacci sphere, `baseR 98`, `persp 440`, màu `38BDF8→3B82F6→A855F7`, `speed 1.08/0.56`, `amp` lerp mượt theo `waveLevels`).
- **Thinking sphere** (`ThinkingSphere` 56px, 420 dot) trong bubble “Đang suy nghĩ” + **AvatarSphere** (32→48px, 260→300 dot, `speed 1.32` nhanh/mạnh, lan ra ngoài `overflow-visible` với `margin -8` và `drop-shadow`) thay avatar `TW` khi `typingId`/`isThinking`/`isStreaming`.

**Tương tác:** typing gõ từng chữ `18±18ms` + khựng `160-220ms` ở `· : — \n`, `bottomRef.scrollIntoView({smooth})` auto-focus theo kết quả, `max-w-[1180]→max-w-none` dàn đều.

**Icon Next.js:** đã xóa `src/app/favicon.ico`, thêm `src/app/icon.svg` TW, `next.config.ts:4` `devIndicators:false`.

---

## 4. Backend — API Gateway thực

### 4.1. Products (`products.service.ts:8`)

10 máy: IdeaPad Gaming 3, Swift Go OLED, Victus, TUF A15, MacBook Air M2, ThinkBook 14 G6, Nitro V 15, Inspiron 5430, Pavilion 14, ROG Flow X13.  
`search({budgetMin, budgetMax, minRamGB, needDiscreteGPU, maxWeightKg, tags})` + fallback nới lỏng khi `res.length===0` (chỉ giữ budget+RAM). `graphQuery({software, minBenchmark})` trả `CAN_RUN`.

### 4.2. Cache & Telemetry

- `CacheService` (`cache.service.ts:8`): hash `intent:xxxx:sortedTokens`, TTL 30m, LRU 500, fuzzy overlap `>0.65` → hit `12-30ms`.
- `TelemetryService` (`telemetry.service.ts:8`): `traceId = tw_<ts>_<rand>`, `start/done/error` log per agent.

### 4.3. 5 Agent

| Agent | File | Logic |
|---|---|---|
| Intent | `intent.agent.ts:15` | Regex budget `(\d)tr/ triệu`, map `CNTT→16GB`, `Valorant/Genshin→GPU rời`, `mỏng nhẹ→≤1.5kg` |
| Clarification | `clarification.agent.ts:10` | Nếu câu ngắn <6 từ hoặc thiếu budget/useCase → trả `question+options` |
| GraphRAG | `graph-rag.agent.ts:14` | `products.graphQuery` + vectorHits mock + `products.search` |
| Cost-Efficiency | `cost-efficiency.agent.ts:11` | `perf= cpu*0.6+gpuTGP*42`, `pp = ppScore*0.7 + raw*0.3` blend → sort |
| Trade-off | `tradeoff.agent.ts:6` | Matrix 5 hàng + `critique()` so `nhẹ nhất vs P/P cao nhất`, handle `candidates===0` |

`RecommendationService` (`recommendation.service.ts:15`) `recommend(query)` cache-first → chạy 4 agent tuần tự ghi `Telemetry`, `buildSummary()` và `cache.set()`. `stream()` là `AsyncGenerator` phát `intent→graph→tradeoff→cost→clarification→final` với `pause 300-420ms` cho SSE.

### 4.4. Endpoints (`main.ts:6` prefix `/api`, CORS `localhost:3000/3001/3002`, port **3001** để tránh đụng Next.js 3000)

| Method | Path | Mô tả |
|---|---|---|
| `GET` | `/api` | Gateway info + danh sách endpoint |
| `GET` | `/api/health` | `status:ok` |
| `GET` | `/api/products?budgetMin=&budgetMax=&q=` | Lọc hybrid |
| `GET` | `/api/products/:id` | Chi tiết 1 máy |
| `GET` | `/api/products/graph/query?software=&minBenchmark=` | Knowledge Graph |
| `POST` | `/api/recommend` `{query}` | Trả `intent, summary, products[0..5], matrix, clarification, graphHits, timings, cache` |
| `GET` | `/api/recommend/stream?query=...` | SSE `data: {"event":"intent"/"graph"/"final", data:{...}}` |

Ví dụ:

```bash
curl -X POST http://localhost:3001/api/recommend \
  -H "Content-Type: application/json" \
  -d '{"query":"18 trieu hoc CNTT choi Valorant mang di hoc hang ngay"}'
# => {"traceId":"tw_...","intent":{"budgetMin":16000000,...},"summary":"Đã phân tích...","products":[...],"matrix":{...}}

curl "http://localhost:3001/api/recommend/stream?query=15%20trieu%20hoc%20CNTT" --no-buffer
# data: {"event":"intent",...}
# data: {"event":"final",...}
```

---

## 5. Chạy nhanh

### Yêu cầu

Node 20+, pnpm 9+ (hoặc npm), 2 terminal. **Không** chạy `pnpm install` ở root.

### Backend (port 3001)

```bash
cd backend
pnpm install        # lần đầu
pnpm run build
PORT=3001 pnpm run start:dev   # watch
# hoặc
PORT=3001 npm run start         # prod: node dist/main.js
# test
curl http://localhost:3001/api/health
curl http://localhost:3001/api/products | head -c 500
```

> Mặc định `main.ts` lắng `3001` (không phải 3000) để không đụng Next.js. Đổi qua `PORT=3000` nếu muốn.

### Frontend (port 3000)

```bash
cd frontend
pnpm install
pnpm run build      # kiểm tra build pass
pnpm run dev        # http://localhost:3000
# biến môi trường (tùy chọn, mặc định http://localhost:3001/api)
echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
```

Frontend `page.tsx:465` `API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"`; sau `isThinking 760ms` gọi `fetch(`${API}/recommend`, {method:"POST", body:{query}})`, map `backend.products[].slice(0,3)` sang `Product` (đổi `ppScore` đã chuẩn hóa `7.0-8.9`), `backend.summary` thay `FINAL_TEXT`, giữ typing + `clarification` + `matrix` staggered.

### Kiểm thử

```bash
# backend
cd backend && npm test          # vitest 1 passed (AppController)
# frontend
cd frontend && npm run build    # Next.js 16 Turbopack compile 3xx ms
```

---

## 6. Tích hợp Frontend ↔ Backend

- `frontend/src/app/page.tsx:465` `API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"`; sau `isThinking 760ms` gọi `fetch(`${API}/recommend`, {method:"POST", body:{query}})`, map `backend.products[].slice(0,3)` sang `Product` (đổi `ppScore` đã chuẩn hóa `7.0-8.9`), `backend.summary` thay `FINAL_TEXT`, giữ typing + `clarification` + `matrix` staggered.
- Nếu muốn SSE thay POST: dùng `new EventSource(`${API}/recommend/stream?query=${encodeURIComponent(text)}`)` và lắng `event: intent/graph/final`.
- `Chat frame loang` và `header pill blur` không ảnh hưởng API, chỉ CSS.

---

## 7. Chuẩn bị commit

### 7.1. `.gitignore` đã cập nhật

Root `.gitignore:1` hiện ignore:

- `node_modules`, `.pnp`, `*.log` (cả `backend/node_modules` và `frontend/node_modules`)
- `backend/dist`, `backend/tsconfig.build.tsbuildinfo`, `backend/.vite`, `backend/coverage`
- `frontend/.next`, `frontend/out`, `frontend/.vercel`, `*.tsbuildinfo`, `next-env.d.ts`
- `.env`, `.env.local`, `*.pem`, `logs`, `.DS_Store`, `.vscode`, `.idea`

`frontend/.gitignore:1` giữ nguyên (Next.js mặc định). `backend` không cần `.gitignore` riêng — đã cover ở root.

> `AI-assistant/` chứa `.git` riêng. Nếu không muốn commit như submodule, giữ dòng `# AI-assistant/` trong `.gitignore` được comment sẵn — bỏ comment để ignore.

### 7.2. Những gì sẽ commit

```bash
git status --short
# Chỉ nên thấy:
#  .gitignore, README.md, instruction.md, *.png
#  backend/src/**, backend/package.json, backend/pnpm-lock.yaml, ...
#  frontend/src/**, frontend/package.json, frontend/pnpm-lock.yaml, ...
# Không thấy: backend/dist, frontend/.next, node_modules, *.tsbuildinfo
```

Kiểm tra trước commit:

```bash
git check-ignore -v backend/dist/main.js frontend/.next/server/app/page.js
# phải trả về .gitignore:xx:backend/dist ...

git ls-files --others --exclude-standard | head
# chỉ còn file source, không còn dist/.next
```

### 7.3. Gợi ý commit đầu tiên

```bash
git add .gitignore README.md instruction.md component.png effect_sphere.png popup_UI.png
git add backend/ frontend/
# nếu muốn loại AI-assistant khỏi commit chính: git rm --cached -r AI-assistant (hoặc bỏ comment trong .gitignore)
git status
git commit -m "feat: TechWise AI Agent Recommendation - NestJS + Next.js + 5 agents"
git log --oneline -5
```

Sau commit, `pnpm-lock.yaml` ở `backend` và `frontend` **nên được commit** để đảm bảo reproducible install.

---

## 8. Triển khai & Mở rộng

- **Docker:** thêm `Dockerfile` cho `backend` (`node:20-alpine` + `npm run build` + `node dist/main.js`) và `frontend` (`next build` + `next start`), `docker-compose` với `postgres`, `neo4j`, `qdrant`, `redis` khi thay mock bằng DB thật (hiện tất cả in-memory để chạy ngay).
- **Thay mock bằng DB thật:** inject `TypeORM`/`Prisma` cho `ProductsService`, `neo4j-driver` cho `GraphRAGAgent`, `@qdrant/js-client` cho vector, `ioredis` cho `CacheService`, `langfuse` cho `TelemetryService`.
- **Bảo mật:** thêm `AuthModule` (JWT), `ThrottlerModule` rate-limit, `ValidationPipe` cho `RecommendDto`.

---

## 9. Liên hệ & Ghi chú

- Đề án gốc: `instruction.md` (5 giai đoạn: Graph → Agentic Pipeline → Fullstack → DevOps).
- Hiệu ứng sphere gốc: `effect_sphere.png` (dotted fluid blue→purple) đã được tái tạo bằng Canvas 2D (không dùng ảnh tĩnh) để mượt và tương tác với `waveLevels`.
- Giao diện gốc: `component.png` (neumorphism sáng bo tròn) đã áp dụng cho toàn hệ thống `#CFD8EB`/`#F0F2F5`.

> Hỏi thử: “15tr học CNTT”, “18tr Valorant cần nhẹ”, “PC 20tr render Premiere” — hệ thống sẽ trả lời ngay cả khi backend chưa chạy (mock) và chính xác hơn khi backend đã chạy (GraphRAG + P/P thực).
