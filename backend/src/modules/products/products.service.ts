import { Injectable } from '@nestjs/common';
import { Product } from './product.entity.js';

@Injectable()
export class ProductsService {
  private readonly products: Product[] = [
    {
      id: '1',
      name: 'Lenovo IdeaPad Gaming 3 15ARH7',
      category: 'GAMING',
      price: '17.490.000₫',
      priceNum: 17490000,
      cpu: 'Ryzen 5 7535HS',
      cpuBenchmark: 14200,
      gpu: 'RTX 3050 95W',
      gpuTGP: 95,
      ram: '16GB DDR5 (8+8)',
      ramUpgradeable: true,
      storage: '512GB NVMe',
      display: '15.6″ 144Hz 100% sRGB',
      weight: '2.32kg · Nhựa',
      weightNum: 2.32,
      batteryWh: 45,
      material: 'Nhựa',
      ppScore: 8.7,
      regret: 'Thấp',
      regretColor: '#22c55e',
      regretReasons: ['Vỏ nhựa flex nhẹ nhưng chấp nhận được ở tầm giá'],
      benchmark: 'Cinebench R23 14.2k · Valorant 210fps',
      pros: ['GPU rời 95W chiến game tốt', 'RAM dual-channel sẵn', 'Tản 2 quạt ổn'],
      cons: ['Vỏ nhựa flex nhẹ', 'Pin 45Wh ~4h'],
      affiliate: 'Shopee',
      badge: 'BEST P/P',
      canRun: ['Valorant', 'Genshin Impact', 'Premiere Pro', 'VS Code', 'Android Studio'],
      limitations: ['Thermal throttling nhẹ khi stress 30 phút'],
    },
    {
      id: '2',
      name: 'Acer Swift Go 14 OLED',
      category: 'ULTRABOOK',
      price: '18.990.000₫',
      priceNum: 18990000,
      cpu: 'Ultra 7 155H',
      cpuBenchmark: 14800,
      gpu: 'Arc 8-core',
      gpuTGP: 28,
      ram: '16GB LPDDR5 (hàn chết)',
      ramUpgradeable: false,
      storage: '512GB NVMe',
      display: '14″ 2.8K OLED 90Hz',
      weight: '1.32kg · Nhôm',
      weightNum: 1.32,
      batteryWh: 65,
      material: 'Nhôm',
      ppScore: 7.9,
      regret: 'Trung bình',
      regretColor: '#eab308',
      regretReasons: ['RAM hàn chết không nâng cấp', 'GPU tích hợp yếu hơn RTX 30% khi chơi AAA'],
      benchmark: 'Geekbench 14.8k · Valorant 110fps',
      pros: ['Siêu nhẹ 1.32kg, OLED đẹp', 'Pin 65Wh ~8h', 'Build nhôm'],
      cons: ['RAM hàn chết ko nâng', 'GPU tích hợp yếu hơn RTX'],
      affiliate: 'CellphoneS',
      canRun: ['Figma', 'VS Code', 'Lightroom', 'Valorant 1080p low'],
      limitations: ['Không nâng RAM', 'Tản mỏng nóng khi render lâu'],
    },
    {
      id: '3',
      name: 'HP Victus 15-fa1xxx',
      category: 'ENTRY GAMING',
      price: '16.290.000₫',
      priceNum: 16290000,
      cpu: 'i5-13420H',
      cpuBenchmark: 12100,
      gpu: 'RTX 2050 45W',
      gpuTGP: 45,
      ram: '8GB DDR4 (1 khe trống)',
      ramUpgradeable: true,
      storage: '512GB NVMe',
      display: '15.6″ 144Hz 45% NTSC',
      weight: '2.29kg · Nhựa',
      weightNum: 2.29,
      batteryWh: 52,
      material: 'Nhựa',
      ppScore: 7.2,
      regret: 'Cao',
      regretColor: '#ef4444',
      regretReasons: ['Màn 45% NTSC nhạt', '2050 yếu hơn 3050 35%'],
      benchmark: 'Cinebench R23 12.1k · Valorant 145fps',
      pros: ['Rẻ nhất, nâng RAM dễ', 'Màn 144Hz'],
      cons: ['Màn 45% NTSC nhạt', '2050 yếu hơn 3050 35%'],
      affiliate: 'GearVN',
      canRun: ['Valorant', 'LOL', 'Photoshop'],
      limitations: ['Màn nhạt', 'Vỏ nhựa'],
    },
    {
      id: '4',
      name: 'ASUS TUF Gaming A15 FA507NU',
      category: 'GAMING',
      price: '19.990.000₫',
      priceNum: 19990000,
      cpu: 'Ryzen 7 7735HS',
      cpuBenchmark: 15100,
      gpu: 'RTX 4050 95W',
      gpuTGP: 95,
      ram: '16GB DDR5',
      ramUpgradeable: true,
      storage: '512GB NVMe',
      display: '15.6″ 144Hz 100% sRGB',
      weight: '2.2kg · Nhựa',
      weightNum: 2.2,
      batteryWh: 56,
      material: 'Nhựa',
      ppScore: 8.9,
      regret: 'Thấp',
      regretColor: '#22c55e',
      regretReasons: [],
      benchmark: 'Cinebench 15.1k · Cyberpunk 68fps',
      pros: ['RTX 4050 DLSS 3 mạnh', 'Tản tốt, 2 khe RAM'],
      cons: ['Loa trung bình', 'Pin 4.5h'],
      affiliate: 'Phong Vũ',
      badge: 'NEW',
      canRun: ['Cyberpunk 2077', 'Elden Ring', 'Blender', 'Premiere Pro'],
      limitations: [],
    },
    {
      id: '5',
      name: 'MacBook Air M2 15″',
      category: 'ULTRABOOK',
      price: '24.900.000₫',
      priceNum: 24900000,
      cpu: 'Apple M2 8-core',
      cpuBenchmark: 15400,
      gpu: 'M2 10-core',
      gpuTGP: 15,
      ram: '8GB Unified (hàn chết)',
      ramUpgradeable: false,
      storage: '256GB SSD',
      display: '15.3″ Liquid Retina 500 nits',
      weight: '1.51kg · Nhôm',
      weightNum: 1.51,
      batteryWh: 66,
      material: 'Nhôm',
      ppScore: 7.1,
      regret: 'Trung bình',
      regretColor: '#eab308',
      regretReasons: ['RAM 8GB hạn chế cho AI/Data', 'Giá cao / hiệu năng game thấp'],
      benchmark: 'Geekbench 15.4k · Valorant 75fps (Rosetta)',
      pros: ['Mỏng nhẹ, pin 12h', 'Màn đẹp, loa hay'],
      cons: ['Không chơi game nặng', 'RAM hàn chết 8GB'],
      affiliate: 'FPT Shop',
      canRun: ['Final Cut', 'Figma', 'Xcode', 'Lightroom'],
      limitations: ['Không nâng cấp', 'Game yếu'],
    },
    {
      id: '6',
      name: 'Lenovo ThinkBook 14 G6',
      category: 'WORKSTATION',
      price: '15.900.000₫',
      priceNum: 15900000,
      cpu: 'i5-1335U',
      cpuBenchmark: 11800,
      gpu: 'Iris Xe',
      gpuTGP: 15,
      ram: '16GB DDR4',
      ramUpgradeable: true,
      storage: '512GB NVMe',
      display: '14″ 100% sRGB 300 nits',
      weight: '1.39kg · Nhôm',
      weightNum: 1.39,
      batteryWh: 45,
      material: 'Nhôm',
      ppScore: 7.4,
      regret: 'Thấp',
      regretColor: '#22c55e',
      regretReasons: [],
      benchmark: 'Cinebench 11.8k · Valorant 62fps',
      pros: ['Bàn phím tốt cho code', 'Nhẹ, nâng cấp dễ'],
      cons: ['Không GPU rời', 'Màn 14″ nhỏ'],
      affiliate: 'CellphoneS',
      canRun: ['VS Code', 'Docker', 'Figma'],
      limitations: ['Không chơi AAA'],
    },
    {
      id: '7',
      name: 'Acer Nitro V 15 ANV15-51',
      category: 'GAMING',
      price: '18.490.000₫',
      priceNum: 18490000,
      cpu: 'i5-13420H',
      cpuBenchmark: 12900,
      gpu: 'RTX 4050 75W',
      gpuTGP: 75,
      ram: '16GB DDR5',
      ramUpgradeable: true,
      storage: '512GB NVMe',
      display: '15.6″ 144Hz 100% sRGB',
      weight: '2.11kg · Nhựa',
      weightNum: 2.11,
      batteryWh: 57,
      material: 'Nhựa',
      ppScore: 8.4,
      regret: 'Thấp',
      regretColor: '#22c55e',
      regretReasons: [],
      benchmark: 'Cinebench 12.9k · Valorant 195fps',
      pros: ['4050 75W cân game', 'Màn 100% sRGB'],
      cons: ['Vỏ nhựa', 'Quạt hơi ồn'],
      affiliate: 'GearVN',
      canRun: ['Valorant', 'Genshin Impact', 'DaVinci Resolve'],
      limitations: ['Ồn khi max quạt'],
    },
    {
      id: '8',
      name: 'Dell Inspiron 14 5430',
      category: 'ULTRABOOK',
      price: '16.990.000₫',
      priceNum: 16990000,
      cpu: 'i7-1360P',
      cpuBenchmark: 13500,
      gpu: 'Iris Xe',
      gpuTGP: 20,
      ram: '16GB LPDDR5',
      ramUpgradeable: false,
      storage: '512GB NVMe',
      display: '14″ 2.5K IPS',
      weight: '1.52kg · Nhôm',
      weightNum: 1.52,
      batteryWh: 54,
      material: 'Nhôm',
      ppScore: 7.0,
      regret: 'Trung bình',
      regretColor: '#eab308',
      regretReasons: ['RAM hàn chết'],
      benchmark: 'Geekbench 13.5k · Valorant 68fps',
      pros: ['CPU P-series mạnh', 'Nhẹ'],
      cons: ['Iris Xe yếu game', 'Không nâng RAM'],
      affiliate: 'FPT Shop',
      canRun: ['Office', 'VS Code', 'Photoshop nhẹ'],
      limitations: ['Không AAA'],
    },
    {
      id: '9',
      name: 'HP Pavilion 14-dv2xxx',
      category: 'ULTRABOOK',
      price: '13.990.000₫',
      priceNum: 13990000,
      cpu: 'i5-1235U',
      cpuBenchmark: 10500,
      gpu: 'Iris Xe',
      gpuTGP: 15,
      ram: '8GB DDR4',
      ramUpgradeable: true,
      storage: '512GB NVMe',
      display: '14″ 100% sRGB',
      weight: '1.4kg · Nhựa',
      weightNum: 1.4,
      batteryWh: 43,
      material: 'Nhựa',
      ppScore: 7.3,
      regret: 'Cao',
      regretColor: '#ef4444',
      regretReasons: ['8GB thiếu cho CNTT đa nhiệm', 'Vỏ nhựa ọp ẹp'],
      benchmark: 'Cinebench 10.5k',
      pros: ['Rẻ, nhẹ'],
      cons: ['8GB đuối', 'Pin yếu'],
      affiliate: 'Shopee',
      canRun: ['Word', 'Chrome', 'Figma nhẹ'],
      limitations: ['Thiếu RAM'],
    },
    {
      id: '10',
      name: 'ASUS ROG Flow X13 GV302',
      category: 'CREATOR',
      price: '29.900.000₫',
      priceNum: 29900000,
      cpu: 'Ryzen 9 7940HS',
      cpuBenchmark: 16800,
      gpu: 'RTX 4050 60W',
      gpuTGP: 60,
      ram: '16GB LPDDR5',
      ramUpgradeable: false,
      storage: '1TB NVMe',
      display: '13.4″ 2.5K 165Hz',
      weight: '1.3kg · Magie',
      weightNum: 1.3,
      batteryWh: 75,
      material: 'Magie',
      ppScore: 8.0,
      regret: 'Thấp',
      regretColor: '#22c55e',
      regretReasons: [],
      benchmark: 'Cinebench 16.8k · Valorant 180fps',
      pros: ['1.3kg + 7940HS mạnh', 'Màn 165Hz đẹp'],
      cons: ['Giá cao', 'RAM hàn chết'],
      affiliate: 'GearVN',
      badge: 'CREATOR',
      canRun: ['Blender', 'Premiere Pro', 'Valorant', 'After Effects'],
      limitations: ['Giá cao'],
    },
  ];

  findAll(): Product[] {
    return this.products;
  }

  findById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  // Hybrid search: filter by budget + implicit constraints, sort by PP
  search(params: {
    budgetMin?: number;
    budgetMax?: number;
    minRamGB?: number;
    needDiscreteGPU?: boolean;
    maxWeightKg?: number;
    mustUpgradeable?: boolean;
    tags?: string[]; // e.g. 'CNTT', 'Genshin', 'Valorant', 'OLED'
  }): Product[] {
    let res = [...this.products];
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
      const specificTags = lower.filter((t) => !['cntt', 'ai', 'mobility', 'general', 'mỏng nhẹ', 'creator', 'oled'].includes(t));
      const filterTags = specificTags.length ? specificTags : [];
      if (filterTags.length) {
        const filtered = res.filter((p) => filterTags.some((t) => p.canRun.some((c) => c.toLowerCase().includes(t)) || p.name.toLowerCase().includes(t) || p.category.toLowerCase().includes(t)));
        // only apply if yields results, otherwise keep original (fallback)
        if (filtered.length > 0) res = filtered;
      }
    }
    // sort by ppScore desc, then price asc
    res.sort((a, b) => b.ppScore - a.ppScore || a.priceNum - b.priceNum);
    if (res.length === 0) {
      // Fallback 1: relax weight + GPU if too strict
      const fallback1 = [...this.products]
        .filter((p) => {
          if (params.budgetMin !== undefined && p.priceNum < params.budgetMin) return false;
          if (params.budgetMax !== undefined && p.priceNum > params.budgetMax) return false;
          if (params.minRamGB !== undefined) {
            const m = p.ram.match(/(\d+)GB/);
            if (m && parseInt(m[1], 10) < params.minRamGB) return false;
          }
          return true;
        })
        .sort((a, b) => b.ppScore - a.ppScore);
      if (fallback1.length > 0) return fallback1.slice(0, 6);
      // Fallback 2: budget quá thấp (vd 10tr) không có máy → trả 3 máy rẻ nhất gần budget nhất
      if (params.budgetMax !== undefined) {
        const above = [...this.products].sort((a, b) => a.priceNum - b.priceNum);
        const closestAbove = above.filter((p) => p.priceNum >= params.budgetMax!).slice(0, 3);
        if (closestAbove.length) return closestAbove;
        return above.slice(0, 3);
      }
    }
    return res.slice(0, 6);
  }

  // Knowledge Graph mock: return relationships for a query
  graphQuery(query: { software?: string; minBenchmark?: number }): { laptop: Product; relation: string }[] {
    const { software, minBenchmark = 0 } = query;
    return this.products
      .filter((p) => p.cpuBenchmark >= minBenchmark && (!software || p.canRun.some((c) => c.toLowerCase().includes(software.toLowerCase()))))
      .map((p) => ({
        laptop: p,
        relation: software ? `${p.cpu} CAN_RUN ${software} at ${p.benchmark}` : `${p.cpu} HAS_BENCHMARK ${p.cpuBenchmark}`,
      }));
  }
}
