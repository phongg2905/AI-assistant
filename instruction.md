# Đề Án: Nền Tảng AI Agent Recommendation Hệ Thống Tư Vấn Thiết Bị Công Nghệ Thông Minh

## 1. Đặt Vấn Đề & Chuyển Hướng Chiến Lược

### 1.1. Thách thức từ Mô hình C2C Ban đầu (Sàn Pass Đồ Cũ)
- **Rủi ro vận hành cao:** Rất khó giải quyết triệt để các tranh chấp giữa người mua và người bán (người mua cố tình làm hư hại sản phẩm để ép giá, tráo đổi linh kiện, gian lận tình trạng máy).
- **Chi phí kiểm định lớn:** Cần quy trình kiểm tra phần cứng (check máy) phức tạp, tốn kém nhân lực và thời gian.

### 1.2. Định Hướng Mới: AI Agent Recommendation & Decision System
- **Mục tiêu:** Chuyển sang xây dựng một **Chuyên gia / Kỹ sư tư vấn ảo** chuyên sâu về thiết bị công nghệ (Laptop, PC, Smartphone) ứng dụng mô hình AI Agentic Workflows.
- **Giải quyết điểm đau thị trường:** Thị trường thiết bị công nghệ bị nhiễu thông tin. Người dùng phổ thông không hiểu rõ thông số kỹ thuật (RAM, CPU, GPU, TGP, chuẩn hiển thị...) và khó đưa ra quyết định tối ưu theo mức ngân sách.
- **Khả năng thương mại hóa:**
  - Mô hình **Affiliate Marketing** (tiếp thị liên kết với Shopee, Lazada, CellphoneS, GearVN...).
  - Mô hình **B2B / SaaS Tool**: Nhúng Widget tư vấn thông minh vào các website bán lẻ điện máy.

---

## 2. Các Mũi Đột Phá So Với RAG / Semantic Search Thông Thường

Thay vì chỉ dùng Semantic Search (RAG) cơ bản để khớp từ khóa và vector similarity, hệ thống áp dụng 5 điểm đột phá kỹ thuật:

```
[ User Input ] 
      │
      ▼
[ Clarification / Intent Agent ] ──> [ GraphRAG & Benchmark Engine ]
      │                                             │
      └─────────────────────┬───────────────────────┘
                            ▼
               [ Trade-off Analyzer Agent ] 
                            │
                            ▼
            [ Interactive Decision Matrix & Streaming UI ]
```

### 2.1. Kiến Trúc AI Agentic Workflows (Phân Tích Đa Tầng)
Sử dụng các framework như **LangGraph** hoặc **CrewAI** để triển khai hệ thống Multi-Agent chuyên biệt:
- **Intent & Constraints Agent:** Bóc tách nhu cầu hiển ngôn và ẩn ngôn (Ví dụ: *"Học CNTT"* → yêu cầu RAM $\ge$ 16GB, bàn phím tốt; *"Chơi Genshin Impact"* → GPU rời hoặc GPU tích hợp mạnh như Radeon 780M).
- **Trade-off Analyzer Agent (Phản Biện):** Đóng vai góc nhìn phản biện, chuyên đi tìm điểm yếu của các dòng máy thỏa mãn điều kiện để cảnh báo người dùng.
- **Cost-Efficiency Agent:** Tính toán chỉ số P/P (Performance per Price) dựa trên kết quả Benchmark thực tế (Geekbench, Cinebench, FPS Game) chia cho giá thành.

### 2.2. Phân Tích Đánh Đổi (Trade-off Matrix) & Regret Index
- **Trade-off Matrix:** Đưa ra ma trận so sánh trực quan về những yếu tố người dùng phải đánh đổi (Ví dụ: Cấu hình mạnh nhưng vỏ nhựa và pin yếu vs. Vỏ nhôm mỏng nhẹ nhưng chip mỏng nhẹ không cày game nặng được).
- **Chỉ số "Nỗi hối hận sau 1 năm" (Regret Index):** Dự báo trước rủi ro nâng cấp/sử dụng dựa trên dữ liệu cộng đồng (Reddit, Voz, các diễn đàn kỹ thuật) (Ví dụ: RAM hàn chết không nâng cấp được, tản nhiệt hơi nóng khi render).

### 2.3. GraphRAG (Kết hợp Knowledge Graph & Vector DB)
- **Knowledge Graph (Neo4j):** Định nghĩa mối quan hệ cứng giữa Linh kiện $\leftrightarrow$ Phần mềm $\leftrightarrow$ Nhu cầu (`CPU_A` *CAN_RUN* `Software_X` at `60FPS`; `Laptop_B` *HAS_LIMITATION* `Thermal_Throttling`).
- **Vector Database (Qdrant / pgvector):** Lưu trữ bài đánh giá cảm quan, review thực tế.
- **Hybrid Retrieval:** Đảm bảo kết quả vừa chính xác tuyệt đối về mặt tương thích phần cứng, vừa mang tính tự nhiên từ đánh giá người dùng.

### 2.4. Tương Tác Hỏi Ngược Thông Minh (Interactive Counter-Questioning)
- Nhận diện các truy vấn mơ hồ (Ví dụ: *"Tài chính 15 triệu mua máy gì học CNTT"*).
- AI chủ động đặt 1–2 câu hỏi làm rõ (Clarification Loop) trước khi đưa ra quyết định (Ví dụ: *"Bạn học chuyên ngành nào: Lập trình Web, AI/Data, hay Mobile App?"*).

### 2.5. Tối Ưu Hệ Thống DevOps & Telemetry
- **Semantic Caching (Redis):** Cache lại kết quả truy vấn theo Intent Vector. Nếu có câu hỏi tương tự, hệ thống trả về kết quả $< 50\text{ms}$, giảm 90% chi phí gọi LLM API.
- **LLM Observability (Langfuse / Phoenix):** Tracing chi tiết luồng suy luận của từng Agent, phát hiện Hallucination và đo lường độ trễ từng bước.
- **Streaming UI:** Hiển thị thời gian thực các bước suy luận (Reasoning Steps) tạo niềm tin cho người dùng.

---

## 3. Kiến Trúc Kỹ Thuật Tổng Thể (Technical Architecture)

### 3.1. Kiến trúc đề xuất (đồ án)

```
+-----------------------------------------------------------------------+
|                          FRONTEND LAYER                               |
|        Next.js (App Router) + Tailwind CSS + Shadcn UI + SSE         |
+-----------------------------------------------------------------------+
                                   │
                                   ▼
+-----------------------------------------------------------------------+
|                         API GATEWAY LAYER                             |
|          NestJS / Express (Auth, Rate Limit, User History)            |
+-----------------------------------------------------------------------+
                                   │
                ┌──────────────────┴──────────────────┐
                ▼                                     ▼
+-------------------------------+   +-----------------------------------+
|       AI CORE SERVICE         |   |          DATA & CACHE             |
|  Python FastAPI + LangGraph   |   |  - PostgreSQL / Supabase          |
|  - Multi-Agent Orchestration  |   |  - Neo4j (Knowledge Graph)        |
|  - Langfuse Tracing           |   |  - Qdrant / pgvector              |
|                               |   |  - Redis Vector Cache             |
+-------------------------------+   +-----------------------------------+
```

### 3.2. Kiến trúc thực tế đã triển khai (monorepo pnpm)

```
TechWise/
├── frontend (Next 16.3.4, React 19, Tailwind v4)  :3000
│   └── src/app/page.tsx → ParticleSphere + SSE fallback
└── backend (NestJS 12, ESM, TypeScript 6, Vitest) :3001 /api
    ├── modules/products       → 10 laptop mock + search()/graphQuery()
    ├── modules/recommendation → 5 agent + recommendation.service (cache-first)
    │   └── agents: intent, clarification, graph-rag, tradeoff, cost-efficiency
    ├── modules/cache          → semantic hash djb2 + TTL 30m + fuzzy 0.88
    ├── modules/telemetry      → traceId tw_<ts>_<rand> + start/done/error
    ├── modules/voice          → Hybrid A: Web Speech + Whisper (Xenova)
    ├── modules/crawler        → axios+cheerio (cellphones/gearvn) + @Cron 2h
    └── modules/pipeline       → Medallion Bronze/Silver/Gold + zod validate
```

`backend/src/main.ts:6` `setGlobalPrefix('api')` + `enableCors([3000,3001,3002])`. `frontend/src/app/page.tsx:465` `API = NEXT_PUBLIC_API_URL || http://localhost:3001/api`.

---

## 4. Bảng So Sánh Mô Hình

| Tiêu chí | Hướng tiếp cận thông thường | Hướng tiếp cận đột phá (Đề xuất) | **Thực tế đã làm** |
| :--- | :--- | :--- | :--- |
| **Logic Tìm kiếm** | RAG / Embeddings đơn thuần | **GraphRAG + Multi-Agent Workflows** | Rule-based Intent regex + GraphRAG mock (CAN_RUN) + 5 agent tuần tự, `recommendation.service.ts:15` |
| **Dữ liệu** | Thông số kỹ thuật thô từ Web | **Benchmark Data + Knowledge Graph** | 10 laptop seed (`products.service.ts:8`), `cpuBenchmark`, `gpuTGP`, `ppScore`, `graphQuery()` + crawler `cellphones/gearvn` (`crawler.service.ts:33`) + pipeline Zod |
| **Giao diện / UX** | Ô tìm kiếm hoặc Chatbot gõ - trả lời | **Dynamic Decision Matrix + Streaming Reasoning Steps + Hỏi ngược thông minh** | Matrix 5 hàng (`tradeoff.agent.ts:6`), ParticleSphere 1650 dot Fibonacci (`page.tsx:777`), typing `18±18ms`, SSE `stream()` |
| **DevOps & AI Ops** | Gọi API trực tiếp | **Semantic Caching (Redis) + LLM Tracing (Langfuse) + Containerized Microservices** | In-memory `CacheService` TTL 30m LRU 500 (`cache.service.ts:13`), `TelemetryService` traceId (`telemetry.service.ts:8`), SSE `recommend/stream` |

---

## 5. Lộ Trình Triển Khai

| Giai đoạn | Tên Giai Đoạn | Nội Dung Công Việc Chính | Trạng thái |
| :--- | :--- | :--- | :--- |
| **Giai đoạn 1** | Chuẩn hóa Dữ liệu & Graph | Crawl dữ liệu 300–500 laptop/PC phổ biến. Dựng Neo4j Knowledge Graph & Vector DB. | **Đã làm (mock):** 10 laptop seed + `products.search()` hybrid filter + fallback, `crawler.service.ts` crawl CellphoneS/GearVN + `pipeline.service.ts` Bronze/Silver/Gold |
| **Giai đoạn 2** | Xây dựng AI Agentic Pipeline | Lập trình Multi-Agent với LangGraph trên FastAPI. Tích hợp Langfuse Tracing. | **Đã làm (NestJS):** 5 agent (`intent`, `clarification`, `graph-rag`, `cost-efficiency`, `tradeoff`) + `CacheService` + `TelemetryService` |
| **Giai đoạn 3** | Phát triển Fullstack | Dựng UI/UX với Next.js & Shadcn UI. Kết nối Streaming SSE cho quá trình tư duy của AI. | **Đã làm:** Next.js 16 App Router + Canvas ParticleSphere (1650 dot) + `POST /api/recommend` + `GET /api/recommend/stream` SSE |
| **Giai đoạn 4** | DevOps, Caching & Deploy | Đóng gói Docker Compose, dựng CI/CD pipeline, tích hợp Redis Semantic Cache và deploy AWS/VPS. | **Đã làm (in-memory):** Semantic Cache `<30ms`, tracing, `vitest` + `oxlint`; **Còn lại:** Docker/Nest `dist` deploy, thay mock bằng Postgres/Neo4j/Qdrant/Redis thật |

---

## 6. Kỹ Thuật Xử Lý Đã Triển Khai (Chi Tiết Mã Nguồn)

> Tổng hợp từ `backend/src` (27 file `.ts`) + `frontend/src/app` (3 file) — đối chiếu với 5 mũi đột phá ở Mục 2.

### 6.1. NLP — Intent & Constraints Agent (Rule-based, không LLM)

**File:** `backend/src/modules/recommendation/agents/intent.agent.ts:22` `analyze(query: string): IntentResult`

- **Budget parsing 4 pattern:**
  ```ts
  /(\d{1,2})\s*[-–~]\s*(\d{1,2})\s*(?:tr|triệu)/          // 18-20tr
  /(?:tài chính|ngân sách|budget)?\s*(\d{1,2})\s*(?:tr|triệu)/ // 15tr
  /dưới\s*(\d{1,2})\s*(?:tr|triệu)/                     // dưới 20tr
  /(\d{2,3})\d{6}/                                      // 18000000
  ```
  Logic `isMaxBudget = /tài chính|ngân sách|tầm|khoảng/.test(q)` → `budgetMax=v, budgetMin=v-3tr` else `±2tr` linh động. Mặc định `12–22tr` (`intent.agent.ts:65`). Nhân `*1_000_000`.

- **Ẩn ngôn mapping:**
  - `cntt|lập trình|code` → `minRamGB=16`, `tags=['CNTT']`, `RAM≥16GB` (`intent.agent.ts:72`)
  - `ai|data|machine learning` → `minRamGB=16`, `useCases AI/Data`
  - `valorant|gaming|genshin|liên minh` → `needDiscreteGPU=true`, `rawTags Valorant/Genshin`
  - `mỏng|nhẹ|mang đi` → `maxWeightKg=1.5` (`intent.agent.ts:93`)
  - `oled|creator|thiết kế` → `displayPref='OLED 100% sRGB'`
  - `render|premiere|blender` → `needDiscreteGPU`
  - `confidence: 0.88` cố định, `rawTags=['General']` nếu không khớp.

- **Vietnamese normalization (voice):** `voice.service.ts:206` `normalizeVi()` map `mười chín→19 … hai chục→20`, `/(\d+)\s*tr/→$1tr`, `c n t t→CNTT`, `va lô ran→Valorant` (thay cụm dài trước).

- **Summary builder:** `recommendation.service.ts:26` `buildSummary()` tính `budget = "tối đa Xtr"` vs `"Y–Ztr"`, `cheapestPrice = min(priceNum)`, nếu `cheapest > budgetMax` → chú thích `Không có máy đúng tầm`.

### 6.2. Tương Tác Hỏi Ngược — Clarification Agent

**File:** `backend/src/modules/recommendation/agents/clarification.agent.ts:10` `getClarification(query, intent): Clarification|null`

- **Heuristic mơ hồ:** `q.split(/\s+/).length < 6 || (!hasBudget && !hasUseCase)` hoặc chứa `tư vấn|mua máy gì`. Nếu `CNTT` → hỏi `Web/App - nhẹ & pin vs AI/Data vs Game GPU` (3 options), else `Hiệu năng / Mỏng nhẹ / OLED`. Nếu có budget nhưng thiếu useCase → `Học & code / Chơi game / Thiết kế`. Đủ context → `null`.

### 6.3. GraphRAG — Hybrid Retrieval (mô phỏng Neo4j + Qdrant)

**File:** `backend/src/modules/recommendation/agents/graph-rag.agent.ts:14` `retrieve()` + `backend/src/modules/products/products.service.ts:319` `search()` + `graphQuery()`

- **Giả lập latency:** `await sleep(120+random*80)ms` (`graph-rag.agent.ts:18`) mô phỏng Neo4j/Qdrant.
- **Knowledge Graph CAN_RUN:** `products.graphQuery({software, minBenchmark})` filter `cpuBenchmark >= 10000 (12000 nếu minRam)` && `canRun.includes(software)`, map `relation: "${cpu} CAN_RUN ${software} at ${benchmark}"` slice 0–6. `software` lấy từ `tags.find(['Valorant','Genshin Impact','Gaming'])||tags[0]`.
- **Vector DB mock:** 3 review cứng `score 0.88/0.82/0.79` (bàn phím, quạt, OLED).
- **Hybrid Candidates:** `products.search({budgetMin,budgetMax,minRamGB,needDiscreteGPU,maxWeightKg,tags})`:
  1. Filter budget, `ram regex /(\d+)GB/`, `gpuTGP>=45` nếu needDiscreteGPU, `weightNum<=maxWeight`.
  2. Tags filter: loại generic `cntt/ai/mobility/...`, chỉ giữ `specificTags`, match `canRun/name/category` — chỉ áp nếu `filtered.length>0`.
  3. Sort `b.ppScore - a.ppScore || a.priceNum - b.priceNum`.
  4. **Fallback:** relax weight+GPU (chỉ budget+RAM), nếu vẫn rỗng và `budgetMax < 13tr` → lấy 3 máy rẻ nhất `sort by priceNum`.
- **Entity:** `product.entity.ts:8` `Product { id, name, category:GAMING/ULTRABOOK, priceNum, cpu, cpuBenchmark, gpu, gpuTGP:W, ram, ramUpgradeable, weightNum, batteryWh, ppScore, regret:Thấp/TB/Cao, canRun[], limitations[] }`. 10 seed: IdeaPad Gaming 3, Swift Go OLED, Victus, TUF A15, MacBook Air M2...

### 6.4. Trade-off Matrix & Cost-Efficiency

**File:** `backend/src/modules/recommendation/agents/cost-efficiency.agent.ts:11` `score()` + `tradeoff.agent.ts:6` `analyze()`

- **Cost-Efficiency:** `perf = cpuBenchmark*0.6 + gpuTGP*42 + (batteryWh>60?400:0)` → `raw = (perf/priceNum)*12200` → clamp `6.0–9.6` → blend `pp = ppScore*0.7 + raw*0.3` `toFixed(1)`. Label `≥8.5 BEST P/P, ≥7.8 Tốt`. Sort `b.ppScoreComputed - a.ppScoreComputed`.
- **Trade-off:** Headers = product names. 5 hàng: `Hiệu năng/Giá: '★'.repeat(round(ppScore/2))`, `Trọng lượng: ≤1.5kg ✓`, `Pin: ~batteryWh/9 h`, `Regret 1 năm`, `Nâng cấp: Có/Hàn chết`. `critique()` so `lightest vs bestPP`, nếu trùng id → `"thắng cả P/P và trọng lượng — an toàn"`, else `"vác hàng ngày → lightest thắng; ưu tiên FPS → bestPP nhưng đánh đổi trọng lượng & vật liệu"`.

### 6.5. Cache & Telemetry (DevOps)

**File:** `backend/src/modules/cache/cache.service.ts:16` + `telemetry.service.ts:8`

- **Semantic Cache (Redis-like in-memory):** `Map<string, CacheEntry{value, expiresAt, hits}>`, `ttlMs=30*60*1000`, `maxSize=500` FIFO evict. Hash: normalize `lower + sort tokens + djb2 h=5381; h=(h*33)^charCode` → `intent:${hex}:${norm.slice(0,48)}`. `get()` exact hit `12+random12 ms`, fuzzy scan `overlap = aTokens.filter∈b / maxLen`, `sameBudget` check `/^\d{1,2}$/`, threshold `overlap>0.88 && sameBudget` → `18+random22 ms`. Lazy expire.
- **Telemetry (Langfuse-like):** `TraceEvent{traceId, agent, status:start/done/error, latencyMs, ts}` append-only, `getTrace(traceId)`, `recent(50)`. `traceId = tw_${Date.now().toString(36)}_${rand}` (`telemetry.service.ts:12`). `main.ts:6` log `POST /api/recommend`, `GET /api/recommend/stream`.
- **Testing:** `vitest.config.ts` `globals:true, include:'**/*.spec.ts'`, `vitest.config.e2e.ts` cho `**/*.e2e-spec.ts` (`@nestjs/testing` + `supertest`). Script `test`, `test:cov`, `lint: oxlint`.

### 6.6. Voice Pipeline — Hybrid A (Web Speech + Whisper)

**File:** `backend/src/modules/voice/voice.service.ts:58` + `voice.controller.ts:12` + `frontend/src/app/page.tsx:763`

- **Backend:** `@xenova/transformers` `pipeline('automatic-speech-recognition', 'Xenova/whisper-small' quantized, 80MB)` fallback `whisper-tiny`, `allowLocalModels:false, numThreads=1`, lazy singleton + warmup `setTimeout 2000ms`. `toWav16k()` via `ffmpeg-static` spawn `['-y -i input -ar 16000 -ac 1 -c:a pcm_s16le']` timeout 8s. `readWavAsFloat32()` via `wavefile.WaveFile` `toSampleRate(16000).toMono().getSamples(Float32Array)` normalize `/32768` nếu `>1.5`, `trimSilence` win `20ms` threshold `0.015` keep `start-win*2 / end+win*3`. Check `length<0.6s` throw, `RMS<0.005` throw silent, `Whisper pipe(audio,{language:'vi', temperature:0, no_repeat_ngram_size:3})` race `5500ms` timeout, blacklist hallucination `['cảm ơn các bạn đã theo dõi', ...]` → fallback. `mergeHybrid(web, whisper)` score `hasBudget?2 + hasKeyword?1 + length>8?1`, hòa → ưu tiên whisper nếu `len >= web*0.85 && >5`. `POST /api/voice/transcribe` multipart `FileInterceptor('audio',8MB)` field `audio+webSpeechText` return `{text, engine:'embedded:whisper-small'/'web-speech-only', latencyMs, rawWhisper, polished}`. `GET /api/voice/status`.
- **Frontend:** `getUserMedia({echoCancel, noiseSuppression, sampleRate:16000})` + `MediaRecorder(webm/opus)` + `webkitSpeechRecognition lang vi-VN continuous:true interim:true maxAlternatives:3` chạy song song. `AudioContext 16000Hz` + `Analyser fftSize256 smoothing0.72` → `waveLevels[7]` `levels=0.18+avg*0.88`, `boosted=min(1,l*(0.75+rms*0.85))`. `onresult` nối `final+interim` → `setVoiceTranscript` word-by-word. Silence auto-stop `avg<0.06 → silenceMs+=120`, `>=1500ms` hoặc `max 8000ms` (fallback Whisper-only `avg<0.08, 150ms, 8500ms`). `onstop` Blob `<1000` → dùng webText, else `POST /voice/transcribe` với `Abort 6500ms`, hiện diff vàng `650ms` trước `startVoiceAnalyzingFlow`.

### 6.7. Crawler & Data Pipeline — Medallion

**File:** `backend/src/modules/crawler/crawler.service.ts:33` + `pipeline.service.ts:14` + `crawler.controller.ts`

- **Sources & Scheduling:** `sources=['cellphones','gearvn']` (2 sàn VN, tránh Shopee anti-bot), `axios.get` `User-Agent Mozilla/5.0 timeout 10s maxRedirects 3`, `@Cron('0 2 * * *')` 2h sáng `crawlFresh({limit:12})`.
- **CellphoneS:** `cellphones.com.vn/laptop.html`, `cheerio` `.product-item`, `h3||.product__name`, `p.product__price--show` fallback regex `/\d{1,3}(?:\.\d{3})+đ/` lấy first match, validate `price 5–80tr`. **GearVN:** `gearvn.com/collections/laptop-gaming` + `ban-chay`, `a.product-card` fallback `[data-testid=catalog-product-grid] a`, `price first match`. `parsePrice()` `digits <1tr || >80tr → null`.
- **Guess heuristics:** `guessCPU` ultra7/5, i7/i5, ryzen7/5, m2/m3; `guessGPU` 4050/4060/3050/2050/arc → tgp 75/85/65/45/15 else Iris 15W; `guessRAM /(\d+)gb/ else 16GB`; `canRun: RTX→Valorant/Genshin/Premiere else VS Code/Figma`; `weight 1.52/2.1kg, battery 52/60/68Wh, ppScore 7.2+random1.6`.
- **Medallion Pipeline:** `ingestBronze(raw)` lưu `_ingestedAt` giữ 100; `transformSilver()` dedupe `name.slice(0,40)`, `Zod ProductSchema.safeParse` (name 8–120, price 5–80tr, weight 0.8–4kg, battery 30–100Wh, ppScore 6–10), `invalidRecords`; `aggregateGold()` `avgPrice, avgPP`; `runFullPipeline()` `runId pipe_<ts36> status running→success/failed, history 5, invalidSample 20`. `GET /api/crawler/status`, `POST /api/crawler/run?limit&sources`, `GET /api/crawler/pipeline`.

### 6.8. Frontend Rendering — ParticleSphere & Streaming UI

**File:** `frontend/src/app/page.tsx:1` (1419 dòng) + `layout.tsx:8` + `globals.css:1` + `next.config.ts:4`

- **State machine:** `messages{role:user/assistant, text, reasoning, products, clarification, matrix}`, `isStreaming/isThinking/typingId/isListening/isPolishing/waveLevels, lastTrace/lastCacheHit`. 2 view hero vs chat scroll.
- **Typewriter & Streaming:** `fetch POST /api/recommend` → `summary/products/clarification`, typing `slice(0,idx)` delay `18+random18 ms`, pause `160–280ms` cho `· : — \n`, sau `420ms` hiện clarification, `900ms` hiện products. Fallback `buildFallbackSummary/getFallbackProducts` (pool MOCK + extra ASUS/ThinkBook, filter budget±2tr) khi backend fail. `SSE` alternative `new EventSource('/recommend/stream?query=')` lắng `intent/graph/final`.
- **ParticleSphere (Canvas 2D):** 4 component `ParticleSphere (340px,1650 dot)`, `ThinkingSphere (56px,420)`, `AvatarSphere (72px,380)`, `BackgroundSphere (4200 dot full)`. Thuật toán Fibonacci `golden=(1+√5)/2, theta=2πi/golden, phi=acos(1-2(i+0.5)/n)`, wave `w1=sin(phi*2.15 + t*speed*1.28)*amp + w2+w3+w4`, rotation `rotY=t*speed*0.30, rotX=sin(t*0.18)*0.11`, perspective `scale=persp/(persp-z)` persp `440/110/85/900`, color gradient `yNorm` `38BDF8→3B82F6→A855F7`, highlight `depth>0.78` additive white `0.32`, `shadowBlur 5.5`, `requestAnimationFrame`, `dpr min(devicePixelRatio,2)`, `smoothAvg += (raw-avg)*0.09`. Mode listening `speed 1.08 amp0.13+smoothAvg*0.26` vs analyzing `0.56`. Neumorphism `#F0F2F5/#CFD8EB`, `backdrop-blur-xl rounded-full`, `shadow 6px 6px 16px #D1D9E6`, keyframes `siriPing/siriMove, cardIn 420ms cubic-bezier(0.16,1,0.3,1)`.
- **Layout:** `layout.tsx` `Inter + JetBrains_Mono` `next/font/google display:swap`, `globals.css` `@import tailwindcss`, `next.config.ts devIndicators:false`.

### 6.9. API & SSE

**File:** `backend/src/modules/recommendation/recommendation.controller.ts:14` + `recommendation.service.ts:15` `recommend()` + `stream(): AsyncGenerator` + `dto/recommend.dto.ts`

- `GET /api` → `TechWise API Gateway`, `GET /api/health` → `status:ok uptime`, `POST /api/recommend {query}` → sync flow `intent→clarification→graph→cost→tradeoff→cache.set`, `GET /api/recommend/stream?query=` → `@Sse()` `Observable<MessageEvent>` wrap `for await ev of stream() sub.next({data:JSON.stringify(ev)})`. Generator yields `cache->{hit}`, `intent->{latency 320+80}`, `pause 420ms`, `graph->{active/done}`, `pause380`, `tradeoff->{active}`, `pause420`, `cost->{products 0-3}`, `pause320`, `clarification`, `final->{traceId,intent,summary,products,matrix}`. `CORS origin 3000/3001/3002 credentials true, prefix api`.

---

## 7. Tổng Kết Kỹ Thuật Đã Làm Được vs Đề Xuất

| Mũi đột phá (Mục 2) | Đề xuất | **Đã làm (file:line)** |
| :--- | :--- | :--- |
| Agentic Workflows | LangGraph/CrewAI 3 agent | 5 agent NestJS (`intent`, `clarification`, `graph-rag`, `cost-efficiency`, `tradeoff`) + `recommendation.service.ts:15` tuần tự + telemetry |
| Trade-off & Regret | Matrix + Regret Index | Matrix 5 hàng + Regret `Thấp/TB/Cao` + critique (`tradeoff.agent.ts:6`) |
| GraphRAG | Neo4j + Qdrant hybrid | Mock `graphQuery()` + vector 3 review + hybrid filter + fallback (`products.service.ts:319`) |
| Hỏi ngược | Clarification Loop 1–2 câu | Heuristic `<6 từ` + `hasBudget/hasUseCase` (`clarification.agent.ts:10`) |
| DevOps | Redis + Langfuse + SSE | Cache djb2+fuzzy 0.88 TTL30m (`cache.service.ts:16`), traceId (`telemetry.service.ts:8`), SSE `stream()` |
| **Mở rộng** | — | **Voice Hybrid A** (`voice.service.ts:58`), **Medallion Pipeline Zod** (`pipeline.service.ts:14`), **ParticleSphere Canvas** (`page.tsx:777`), **Crawler Cheerio** (`crawler.service.ts:33`) |

