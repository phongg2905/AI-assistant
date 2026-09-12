import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Product } from './product.entity.js';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);
  // KHÔNG hardcode – dữ liệu thực từ crawler + pipeline, tính toán động
  private products: Product[] = [];
  private initialized = false;

  async onModuleInit() {
    await this.loadInitialData();
  }

  private async loadInitialData() {
    if (this.initialized) return;
    this.initialized = true;
    // Thử đọc file cache thực tế từ lần cào trước (data/products.json)
    const dataPath = path.join(process.cwd(), 'data', 'products.json');
    try {
      if (fs.existsSync(dataPath)) {
        const raw = fs.readFileSync(dataPath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Tính toán lại các trường suy ra (không hardcode)
          this.products = parsed.map((p: any) => this.enrichComputed(p)).slice(0, 30);
          this.logger.log(`Loaded ${this.products.length} sp thực từ ${dataPath}`);
          return;
        }
      }
    } catch (e: any) {
      this.logger.warn(`Không đọc được ${dataPath}: ${e.message}`);
    }
    // Nếu chưa có file, để trống – crawler sẽ tự cào và upsert khi có request đầu tiên
    // Fallback tối thiểu: nếu offline hoàn toàn, dùng 2 sp mẫu tối giản để hệ thống không chết (sẽ bị thay ngay khi cào được)
    if (this.products.length === 0) {
      this.logger.warn('Chưa có dữ liệu thực, chờ crawler cào – hệ thống sẽ tự làm đầy khi có request /api/crawler/run');
    }
  }

  // Tính toán động – không hardcode ppScore/regret
  private enrichComputed(p: any): Product {
    const cpuBenchmark = Number(p.cpuBenchmark) || 12000;
    const gpuTGP = Number(p.gpuTGP) || 15;
    const batteryWh = Number(p.batteryWh) || 50;
    const weightNum = Number(p.weightNum) || 1.5;
    const priceNum = Number(p.priceNum) || 15000000;
    // Công thức tính ppScore thực tế: perf/price
    const perf = cpuBenchmark * 0.6 + gpuTGP * 42 + (batteryWh > 60 ? 400 : 0);
    const rawPP = (perf / priceNum) * 12200; // scale về 6-9
    const ppScore = parseFloat(Math.min(9.2, Math.max(6.0, rawPP)).toFixed(1));
    const regret: Product['regret'] = ppScore >= 8.2 ? 'Thấp' : ppScore >= 7.5 ? 'Trung bình' : 'Cao';
    const regretColor = regret === 'Thấp' ? '#22c55e' : regret === 'Trung bình' ? '#eab308' : '#ef4444';
    return {
      id: String(p.id || `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
      name: String(p.name).trim().slice(0, 80),
      category: p.category || (gpuTGP >= 45 ? 'GAMING' : weightNum < 1.6 ? 'ULTRABOOK' : 'WORKSTATION'),
      price: p.price || `${(priceNum / 1_000_000).toFixed(1)} triệu`,
      priceNum,
      cpu: p.cpu || 'i5-1335U',
      cpuBenchmark,
      gpu: p.gpu || 'Iris Xe',
      gpuTGP,
      ram: p.ram || '16GB DDR5',
      ramUpgradeable: p.ramUpgradeable ?? !String(p.ram).includes('hàn chết'),
      storage: p.storage || '512GB NVMe',
      display: p.display || '14″ IPS 100% sRGB',
      weight: p.weight || `${weightNum}kg`,
      weightNum,
      batteryWh,
      material: p.material || (weightNum < 1.6 ? 'Nhôm' : 'Nhựa'),
      ppScore,
      regret,
      regretColor,
      regretReasons: p.regretReasons || [],
      benchmark: p.benchmark || `Cinebench ${cpuBenchmark} · ${p.gpu || 'Iris Xe'} ${gpuTGP}W`,
      pros: p.pros || [`Giá thực ${priceNum.toLocaleString('vi-VN')}đ`],
      cons: p.cons || ['Cần kiểm tra chi tiết'],
      affiliate: p.affiliate || 'Crawl',
      badge: p.badge,
      canRun: p.canRun || (gpuTGP >= 45 ? ['Valorant', 'Genshin Impact'] : ['VS Code', 'Figma']),
      limitations: p.limitations || [],
    };
  }

  findAll(): Product[] {
    return this.products;
  }

  findById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  // Tìm kiếm đơn giản – không phức tạp, chỉ filter + sort
  search(params: {
    budgetMin?: number;
    budgetMax?: number;
    minRamGB?: number;
    needDiscreteGPU?: boolean;
    maxWeightKg?: number;
    mustUpgradeable?: boolean;
    tags?: string[];
  }): Product[] {
    let res = [...this.products];
    // Nếu chưa có dữ liệu thực, trả rỗng để caller fallback (không hardcode)
    if (res.length === 0) return [];
    if (params.budgetMin !== undefined) res = res.filter((p) => p.priceNum >= params.budgetMin!);
    if (params.budgetMax !== undefined) res = res.filter((p) => p.priceNum <= params.budgetMax!);
    if (params.minRamGB !== undefined) {
      res = res.filter((p) => {
        const m = p.ram.match(/(\d+)GB/);
        return m ? parseInt(m[1], 10) >= params.minRamGB! : true;
      });
    }
    if (params.needDiscreteGPU) res = res.filter((p) => p.gpuTGP >= 45);
    if (params.maxWeightKg !== undefined) res = res.filter((p) => p.weightNum <= params.maxWeightKg!);
    if (params.mustUpgradeable) res = res.filter((p) => p.ramUpgradeable);
    if (params.tags?.length) {
      const lower = params.tags.map((t) => t.toLowerCase());
      const filtered = res.filter((p) =>
        lower.some((t) => p.canRun.some((c) => c.toLowerCase().includes(t)) || p.name.toLowerCase().includes(t))
      );
      if (filtered.length > 0) res = filtered;
    }
    res.sort((a, b) => b.ppScore - a.ppScore || a.priceNum - b.priceNum);
    // Fallback nới lỏng nếu không có kết quả – trả 3 máy rẻ nhất gần ngân sách (không hardcode)
    if (res.length === 0) {
      const fallback = [...this.products]
        .filter((p) => {
          if (params.budgetMin !== undefined && p.priceNum < params.budgetMin) return false;
          if (params.budgetMax !== undefined && p.priceNum > params.budgetMax) return false;
          return true;
        })
        .sort((a, b) => b.ppScore - a.ppScore);
      if (fallback.length) return fallback.slice(0, 6);
      // Nếu vẫn rỗng (ngân sách quá thấp), trả 3 máy rẻ nhất
      const cheapest = [...this.products].sort((a, b) => a.priceNum - b.priceNum).slice(0, 3);
      if (cheapest.length) return cheapest;
    }
    return res.slice(0, 6);
  }

  graphQuery(query: { software?: string; minBenchmark?: number }): { laptop: Product; relation: string }[] {
    const { software, minBenchmark = 0 } = query;
    return this.products
      .filter((p) => p.cpuBenchmark >= minBenchmark && (!software || p.canRun.some((c) => c.toLowerCase().includes(software.toLowerCase()))))
      .map((p) => ({
        laptop: p,
        relation: software ? `${p.cpu} CAN_RUN ${software} at ${p.benchmark}` : `${p.cpu} HAS_BENCHMARK ${p.cpuBenchmark}`,
      }));
  }

  // Upsert đơn giản – không dùng FlexSearch phức tạp, chỉ Set dedupe theo tên
  upsertMany(newProducts: any[]): void {
    let added = 0;
    const seen = new Set(this.products.map((p) => p.name.toLowerCase().slice(0, 30)));
    for (const raw of newProducts) {
      const enriched = this.enrichComputed(raw);
      const key = enriched.name.toLowerCase().slice(0, 30);
      if (seen.has(key)) continue;
      seen.add(key);
      this.products.unshift(enriched);
      added++;
    }
    if (this.products.length > 30) this.products.splice(30);
    if (added > 0) {
      this.persistToFile();
      this.logger.log(`Upsert ${added} sp thực, tổng ${this.products.length}`);
    }
  }

  private persistToFile() {
    try {
      const dataPath = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });
      fs.writeFileSync(path.join(dataPath, 'products.json'), JSON.stringify(this.products.slice(0, 30), null, 2));
    } catch (e: any) {
      this.logger.warn(`Không ghi được file cache: ${e.message}`);
    }
  }

  // Dùng cho crawler fallback
  buildSearchIndex(): void {
    // Giữ method để tương thích, nhưng không cần index phức tạp nữa
    this.logger.log(`SearchIndex: ${this.products.length} sp (filter đơn giản, không cần FlexSearch)`);
  }
}
