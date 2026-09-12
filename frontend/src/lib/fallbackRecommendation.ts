import { MOCK_PRODUCTS } from "./mockProducts";
import type { Product } from "./domain.types";

export function buildFallbackSummary(query: string): string {
  const lower = query.toLowerCase();
  const budgetMatch = lower.match(/(\d{1,2})\s*(?:tr|triệu)/);
  const budget = budgetMatch ? `${budgetMatch[1]} triệu` : "khoảng 15–20 triệu";
  const needs: string[] = [];
  if (lower.includes("cntt") || lower.includes("lập trình") || lower.includes("code")) needs.push("học lập trình");
  if (lower.includes("valorant") || lower.includes("gaming") || lower.includes("game")) needs.push("chơi game");
  if (lower.includes("ai") || lower.includes("data")) needs.push("làm AI/Data");
  if (lower.includes("mỏng") || lower.includes("nhẹ")) needs.push("mang đi nhẹ");
  if (lower.includes("oled") || lower.includes("thiết kế")) needs.push("màn đẹp làm ảnh");
  const needText = needs.length ? needs.join(", ") : "dùng hàng ngày";
  const qShort = query.length > 80 ? query.slice(0, 80) + "…" : query;
  return ` **Hiểu rồi! Bạn cần ${budget} để ${needText}**\n\n Bạn nói: “${qShort}”\n\n- ** Tiền:** ${budget} (mình ưu tiên máy đúng tầm này)\n- ** Bạn cần:** ${needText} – mình đã dịch ra ngôn ngữ máy tính rồi\n- ** Mình đã chọn 3 máy hợp nhất ở dưới – mỗi máy mình ghi rõ bằng tiếng thường: được gì, mất gì, pin mấy tiếng, nặng bao nhiêu, có dễ hối hận không. Không cần biết gì về máy tính cũng hiểu được nhé!**`;
}
export function getFallbackProducts(query: string): Product[] {
  const lower = query.toLowerCase();
  let pool = [...MOCK_PRODUCTS];
  // thêm biến thể để không lặp y hệt
  const extra: Product[] = [
    { ...MOCK_PRODUCTS[0], id: "4", name: "ASUS TUF Gaming A15 FA507NU", price: "19.990.000₫", priceNum: 19990000, cpu: "Ryzen 7 7735HS", gpu: "RTX 4050 95W", ppScore: 8.9, regret: "Thấp"as const, regretColor: "#22c55e", benchmark: "Cyberpunk 68fps", pros: ["RTX 4050 DLSS 3"], cons: ["Pin 4.5h"], affiliate: "Phong Vũ", badge: "NEW", category: "GAMING"as const, weightNum: 2.2, batteryWh: 56 },
    { ...MOCK_PRODUCTS[1], id: "5", name: "Lenovo ThinkBook 14 G6", price: "15.900.000₫", priceNum: 15900000, cpu: "i5-1335U", gpu: "Iris Xe", ppScore: 7.4, regret: "Thấp"as const, regretColor: "#22c55e", benchmark: "Valorant 62fps", pros: ["Bàn phím tốt"], cons: ["Không GPU rời"], affiliate: "CellphoneS", category: "ULTRABOOK"as const, weightNum: 1.39, batteryWh: 45 },
  ];
  pool = [...MOCK_PRODUCTS, ...extra];
  const m = lower.match(/(\d{1,2})\s*(?:tr|triệu)/);
  if (m) {
    const v = parseInt(m[1], 10) * 1_000_000;
    const inBudget = pool.filter((p) =>p.priceNum <= v + 2_000_000 && p.priceNum >= Math.max(0, v - 3_000_000));
    if (inBudget.length) pool = inBudget;
    else pool = [...pool].sort((a, b) =>Math.abs(a.priceNum - v) - Math.abs(b.priceNum - v));
  }
  if (lower.includes("valorant") || lower.includes("gaming") || lower.includes("game")) {
    const gaming = pool.filter((p) =>p.gpu.includes("RTX"));
    if (gaming.length) pool = gaming;
  }
  if (lower.includes("mỏng") || lower.includes("nhẹ")) pool = [...pool].sort((a, b) =>parseFloat(a.weight) - parseFloat(b.weight));
  return pool.slice(0, 3);
}
