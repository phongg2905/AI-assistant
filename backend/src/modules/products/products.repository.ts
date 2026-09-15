import { Injectable } from '@nestjs/common';
import { Product } from './entities/product.entity.js';
import { FindProductsDto } from './dto/find-products.dto.js';

@Injectable()
export class ProductsRepository {
  private products: Product[] = [
    {
      id: 'prod-1',
      name: 'MacBook Air M2 13.6-inch 16GB 512GB',
      brand: 'Apple',
      priceVnd: 28990000,
      originalPriceVnd: 31990000,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
      productUrl: 'https://cellphones.com.vn/macbook-air-m2-16gb.html',
      source: 'cellphones',
      specs: {
        cpu: 'Apple M2 8-core',
        gpu: '10-core GPU',
        ramGb: 16,
        storageGb: 512,
        storageType: 'SSD',
        screenSizeInch: 13.6,
        resolution: '2560x1664 Liquid Retina',
        refreshRateHz: 60,
        batteryWattHours: 52.6,
        weightKg: 1.24,
      },
      tags: ['office', 'coding', 'lightweight', 'long-battery'],
      inStock: true,
    },
    {
      id: 'prod-2',
      name: 'ASUS ROG Zephyrus G14 GA402 16GB 1TB RTX 4060',
      brand: 'ASUS',
      priceVnd: 39990000,
      originalPriceVnd: 42990000,
      imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed',
      productUrl: 'https://gearvn.com/products/asus-rog-zephyrus-g14.html',
      source: 'gearvn',
      specs: {
        cpu: 'AMD Ryzen 9 8945HS',
        gpu: 'NVIDIA GeForce RTX 4060 8GB',
        ramGb: 16,
        storageGb: 1024,
        storageType: 'NVMe SSD',
        screenSizeInch: 14.0,
        resolution: '2880x1800 3K OLED',
        refreshRateHz: 120,
        batteryWattHours: 73.0,
        weightKg: 1.5,
      },
      tags: ['gaming', 'ai-workload', 'docker', 'creator'],
      inStock: true,
    },
    {
      id: 'prod-3',
      name: 'Lenovo ThinkPad P16s Gen 2 AMD Ryzen 7 PRO 32GB 1TB',
      brand: 'Lenovo',
      priceVnd: 34500000,
      originalPriceVnd: 36900000,
      imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef',
      productUrl: 'https://phongvu.vn/lenovo-thinkpad-p16s-gen-2.html',
      source: 'phongvu',
      specs: {
        cpu: 'AMD Ryzen 7 PRO 7840U',
        gpu: 'AMD Radeon 780M',
        ramGb: 32,
        storageGb: 1024,
        storageType: 'NVMe SSD',
        screenSizeInch: 16.0,
        resolution: '1920x1200 IPS',
        refreshRateHz: 60,
        batteryWattHours: 86.0,
        weightKg: 1.7,
      },
      tags: ['software-engineering', 'docker', 'ide', 'multitasking', 'durability'],
      inStock: true,
    },
    {
      id: 'prod-4',
      name: 'Dell XPS 13 Plus 9320 Core i7-1360P 16GB 512GB',
      brand: 'Dell',
      priceVnd: 31990000,
      originalPriceVnd: 35990000,
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45',
      productUrl: 'https://cellphones.com.vn/dell-xps-13-plus-9320.html',
      source: 'cellphones',
      specs: {
        cpu: 'Intel Core i7-1360P',
        gpu: 'Intel Iris Xe',
        ramGb: 16,
        storageGb: 512,
        storageType: 'NVMe SSD',
        screenSizeInch: 13.4,
        resolution: '3456x2160 OLED Touch',
        refreshRateHz: 60,
        batteryWattHours: 55.0,
        weightKg: 1.23,
      },
      tags: ['premium', 'ultrabook', 'business', 'mobility'],
      inStock: true,
    },
    {
      id: 'prod-5',
      name: 'Acer Swift Go 14 AI OLED Core Ultra 7 155H 32GB 1TB',
      brand: 'Acer',
      priceVnd: 24990000,
      originalPriceVnd: 26990000,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
      productUrl: 'https://phongvu.vn/acer-swift-go-14-oled.html',
      source: 'phongvu',
      specs: {
        cpu: 'Intel Core Ultra 7 155H NPU',
        gpu: 'Intel Arc Graphics',
        ramGb: 32,
        storageGb: 1024,
        storageType: 'NVMe SSD',
        screenSizeInch: 14.0,
        resolution: '2880x1800 2.8K OLED',
        refreshRateHz: 90,
        batteryWattHours: 65.0,
        weightKg: 1.32,
      },
      tags: ['ai-pc', 'programming', 'student', 'oled', 'value'],
      inStock: true,
    }
  ];

  async findAll(dto?: FindProductsDto): Promise<Product[]> {
    let result = [...this.products];

    if (dto?.brand) {
      result = result.filter(p => p.brand.toLowerCase() === dto.brand?.toLowerCase());
    }
    if (dto?.minPrice !== undefined) {
      result = result.filter(p => p.priceVnd >= (dto.minPrice ?? 0));
    }
    if (dto?.maxPrice !== undefined) {
      result = result.filter(p => p.priceVnd <= (dto.maxPrice ?? Infinity));
    }
    if (dto?.minRamGb !== undefined) {
      result = result.filter(p => p.specs.ramGb >= (dto.minRamGb ?? 0));
    }
    if (dto?.maxWeightKg !== undefined) {
      result = result.filter(p => p.specs.weightKg <= (dto.maxWeightKg ?? Infinity));
    }
    if (dto?.query) {
      const q = dto.query.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.specs.cpu.toLowerCase().includes(q) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    const offset = dto?.offset || 0;
    const limit = dto?.limit || 20;
    return result.slice(offset, offset + limit);
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.find(p => p.id === id) || null;
  }

  async create(product: Product): Promise<Product> {
    this.products.push(product);
    return product;
  }

  async upsertMany(newProducts: Product[]): Promise<number> {
    for (const p of newProducts) {
      const idx = this.products.findIndex(existing => existing.id === p.id);
      if (idx >= 0) {
        this.products[idx] = p;
      } else {
        this.products.push(p);
      }
    }
    return newProducts.length;
  }
}
