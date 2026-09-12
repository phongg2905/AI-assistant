import { MOCK_PRODUCTS } from "./mockProducts";
import type { Product } from "./domain.types";

export function buildFallbackSummary(query: string): string {
  const lower = query.toLowerCase();
  const budgetMatch = lower.match(/(\d{1,2})\s*(?:tr|triệu)/);
  const budget = budgetMatch ? `tối đa ${budgetMatch[1]}tr` : "linh động";
  const tags: string[] = [];
  if (lower.includes("cntt") || lower.includes("lập trình") || lower.includes("code")) tags.push("CNTT");
  if (lower.includes("valorant")) tags.push("Valorant");
  if (lower.includes("genshin")) tags.push("Genshin");
  if (lower.includes("ai") || lower.includes("data")) tags.push("AI");
  if (lower.includes("mỏng") || lower.includes("nhẹ")) tags.push("nhẹ");
  const useCases = tags.join(", ") || "đa dụng";
  return `Đã phân tích yêu cầu **“${budget} · ${useCases}”**\n\n- **Ngân sách:** ${budget}\n- **Nhu cầu:** ${query.slice(0, 90)}\n- **Gợi ý:** ${tags.length ? tags.join(" + ") : "phù hợp"} — 3 lựa chọn bên dưới`;
}
export function getFallbackProducts(query: string): Product[] {
  const lower = query.toLowerCase();
  let pool = [...MOCK_PRODUCTS];
  // thêm biến thể để không lặp y hệt
  const extra: Product[] = [
    { ...MOCK_PRODUCTS[0], id: "4", name: "ASUS TUF Gaming A15 FA507NU", price: "19.990.000₫", priceNum: 19990000, cpu: "Ryzen 7 7735HS", gpu: "RTX 4050 95W", ppScore: 8.9, regret: "Thấp" as const, regretColor: "#22c55e", benchmark: "Cyberpunk 68fps", pros: ["RTX 4050 DLSS 3"], cons: ["Pin 4.5h"], affiliate: "Phong Vũ", badge: "NEW", category: "GAMING" as const, weightNum: 2.2, batteryWh: 56 },
    { ...MOCK_PRODUCTS[1], id: "5", name: "Lenovo ThinkBook 14 G6", price: "15.900.000₫", priceNum: 15900000, cpu: "i5-1335U", gpu: "Iris Xe", ppScore: 7.4, regret: "Thấp" as const, regretColor: "#22c55e", benchmark: "Valorant 62fps", pros: ["Bàn phím tốt"], cons: ["Không GPU rời"], affiliate: "CellphoneS", category: "ULTRABOOK" as const, weightNum: 1.39, batteryWh: 45 },
  ];
  pool = [...MOCK_PRODUCTS, ...extra];
  const m = lower.match(/(\d{1,2})\s*(?:tr|triệu)/);
  if (m) {
    const v = parseInt(m[1], 10) * 1_000_000;
    const inBudget = pool.filter((p) => p.priceNum <= v + 2_000_000 && p.priceNum >= Math.max(0, v - 3_000_000));
    if (inBudget.length) pool = inBudget;
    else pool = [...pool].sort((a, b) => Math.abs(a.priceNum - v) - Math.abs(b.priceNum - v));
  }
  if (lower.includes("valorant") || lower.includes("gaming") || lower.includes("game")) {
    const gaming = pool.filter((p) => p.gpu.includes("RTX"));
    if (gaming.length) pool = gaming;
  }
  if (lower.includes("mỏng") || lower.includes("nhẹ")) pool = [...pool].sort((a, b) => parseFloat(a.weight) - parseFloat(b.weight));
  return pool.slice(0, 3);
}
