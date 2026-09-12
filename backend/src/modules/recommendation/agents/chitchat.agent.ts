import { Injectable, Logger } from '@nestjs/common';

export type ChitChatResult = {
  isChitChat: boolean;
  intent: 'greeting' | 'thanks' | 'identity' | 'goodbye' | 'system_info' | 'chitchat' | 'product' | 'unknown';
  confidence: number;
  reply: string | null;
};

// Triệt để: thay 100 regex rời rạc bằng 1 classifier ngữ nghĩa
// Dùng @xenova/transformers zero-shot (đã có sẵn cho Whisper) – nếu model chưa tải/offline thì fallback rule cũ
@Injectable()
export class ChitChatAgent {
  private readonly logger = new Logger(ChitChatAgent.name);
  private classifier: any = null;
  private loading: Promise<any> | null = null;

  // Fallback rule cũ – chỉ dùng khi model chưa sẵn
  private greeting = /^(chào|hello|hi|hey|xin chào|alo|ê|yo)\b/i;
  private thanks = /(cảm ơn|cám ơn|thanks|thank you)/i;
  private goodbye = /(tạm biệt|bye|hẹn gặp|see you)/i;
  private identity = /(bạn là ai|bạn tên gì|bạn là gì|giới thiệu|techwise là gì)/i;
  private systemInfo = /(dữ liệu|cơ sở dữ liệu|database|data|bạn có bao nhiêu|bao nhiêu.*sản phẩm|bao nhiêu.*máy|có lớn không|nguồn.*dữ liệu|dữ liệu.*ở đâu|cập nhật.*không|đang dùng.*dữ liệu)/i;

  private async getClassifier(): Promise<any> {
    if (this.classifier) return this.classifier;
    if (this.loading) return this.loading;
    this.loading = (async () => {
      try {
        const { pipeline } = await import('@xenova/transformers');
        // Model nhỏ, nhanh, đủ cho intent 3 nhãn – nếu muốn chính xác hơn dùng bart-large-mnli
        this.classifier = await pipeline('zero-shot-classification', 'Xenova/distilbert-base-uncased-mnli', { quantized: true });
        this.logger.log('Zero-shot classifier ready (distilbert-mnli)');
      } catch (e: any) {
        this.logger.warn(`Không tải được zero-shot model, fallback rule: ${e.message}`);
      }
      return this.classifier;
    })();
    return this.loading;
  }

  // Rule fallback – giữ để không phụ thuộc 100% model
  private ruleFallback(query: string): ChitChatResult | null {
    const q = query.trim().toLowerCase();
    const raw = query.trim();
    const hasProductKeyword = /(\b\d+\s*(tr|triệu)\b|ram|cpu|gpu|laptop|máy tính|\bpc\b|gaming|valorant|genshin|oled|mỏng|nhẹ|pin|màn|ryzen|intel|rtx|ultra|cntt|lập trình|code|\bai\b|data|mua|tư vấn|giá|học.*cntt|chơi.*game|render)/i.test(q);
    const isVeryShort = raw.split(/\s+/).length <= 3 && raw.length < 25;

    if (new RegExp('^(chào bạn|chào em|chào anh|hello bạn|hi bạn|chào|hey|yo|alo|ê)\\s*[!.?]*$', 'i').test(raw) || (this.greeting.test(q) && isVeryShort && !hasProductKeyword)) {
      return { isChitChat: true, intent: 'greeting', confidence: 0.92, reply: `Chào bạn! Mình là TechWise – trợ lý tìm thiết bị công nghệ, hiểu tiếng thường như bạn đang nói chuyện với bạn bè.\n\nBạn chỉ cần nói kiểu: “15 triệu học CNTT cần nhẹ” hay “20 triệu chơi Valorant” là mình sẽ lọc ngay 2–3 máy hợp nhất, nói rõ được gì/mất gì bằng tiếng dễ hiểu.\n\nBạn đang tìm máy cho nhu cầu gì nhỉ?` };
    }
    if (this.systemInfo.test(q)) return { isChitChat: true, intent: 'system_info', confidence: 0.96, reply: null };
    if (this.thanks.test(q) && isVeryShort) return { isChitChat: true, intent: 'thanks', confidence: 0.94, reply: `Không có gì nè! Cần so sánh thêm 2 máy nào hay hỏi về pin/cân nặng thì cứ nói mình nhé.` };
    if (this.goodbye.test(q) && isVeryShort) return { isChitChat: true, intent: 'goodbye', confidence: 0.93, reply: `Tạm biệt bạn! Khi nào cần tư vấn lại cứ gọi TechWise nhé.` };
    if (this.identity.test(q)) return { isChitChat: true, intent: 'identity', confidence: 0.95, reply: `Mình là TechWise – Chuyên gia tư vấn ảo cho laptop/PC/phone. Mình không bán hàng, chỉ phân tích GraphRAG + benchmark thực tế.\n\nBạn thử nói: “15tr học CNTT” hoặc “Gaming 20tr RTX 4060” xem mình lọc nhé!` };
    if (isVeryShort && !hasProductKeyword) return { isChitChat: true, intent: 'chitchat', confidence: 0.88, reply: `Hihi, mình nghe nè! Bạn muốn tìm máy cho việc gì? Chỉ cần nói tự nhiên như: “18 triệu học CNTT, cần nhẹ, chơi Valorant” là mình sẽ gợi ý ngay.` };
    return null;
  }

  async detect(query: string): Promise<ChitChatResult> {
    const q = query.trim();
    if (!q) return { isChitChat: false, intent: 'unknown', confidence: 0, reply: null };

    // Early exit nhanh cho câu rõ ràng là mua máy – tránh chờ model
    const hasProductKeyword = /(\b\d+\s*(tr|triệu)\b|ram|cpu|gpu|laptop|máy tính|\bpc\b|gaming|valorant|genshin|oled|mỏng|nhẹ|pin|màn|ryzen|intel|rtx|ultra|cntt|lập trình|code|\bai\b|data|mua|tư vấn|giá|học.*cntt|chơi.*game|render)/i.test(q.toLowerCase());
    if (hasProductKeyword && q.length > 12 && /(\b\d+\s*(tr|triệu)\b|laptop|máy tính|ram|cpu|gpu)/i.test(q)) {
      // Rõ ràng là hỏi mua – không cần zero-shot
      return { isChitChat: false, intent: 'product', confidence: 0.88, reply: null };
    }

    // 1. Thử zero-shot trước – triệt để cho 100 câu vu vơ khác nhau, race với timeout 700ms
    try {
      const clfPromise = this.getClassifier();
      const timeout = new Promise<null>((res) => setTimeout(() => res(null), 700));
      const clf: any = await Promise.race([clfPromise, timeout]);
      if (clf) {
        // candidate 3 nhãn lớn – đủ để phân biệt PRODUCT vs CHITCHAT
        const candidateLabels = ['product recommendation', 'chitchat greeting', 'system information'];
        const res = await Promise.race([
          clf(q, candidateLabels, { hypothesis_template: 'This text is about {}.' }),
          new Promise<null>((res) => setTimeout(() => res(null), 900)),
        ]) as any;
        if (res) {
          const top = res.labels[0];
          const score = res.scores[0];
          this.logger.log(`Zero-shot "${q.slice(0,30)}" -> ${top} ${score.toFixed(2)}`);
          if (top === 'chitchat greeting' && score > 0.62) {
            const rule = this.ruleFallback(q);
            if (rule && ['greeting','thanks','goodbye','identity'].includes(rule.intent)) return rule;
            return { isChitChat: true, intent: 'chitchat', confidence: score, reply: `Hihi, mình nghe nè! Bạn muốn tìm máy cho việc gì? Nói tự nhiên như “18 triệu học CNTT cần nhẹ” là mình lọc ngay nhé.` };
          }
          if (top === 'system information' && score > 0.60) {
            return { isChitChat: true, intent: 'system_info', confidence: score, reply: null };
          }
          if (top === 'product recommendation' && score > 0.65) {
            return { isChitChat: false, intent: 'product', confidence: score, reply: null };
          }
        }
      }
    } catch (e: any) {
      this.logger.warn(`Zero-shot lỗi, fallback rule: ${e.message}`);
    }

    // 2. Fallback rule cho trường hợp model chưa tải/offline hoặc score thấp
    const rule = this.ruleFallback(q);
    if (rule) return rule;

    // 3. Mặc định: nếu không có từ khóa sản phẩm → chitchat, ngược lại → product (dùng hasProductKeyword đã tính ở đầu)
    if (!hasProductKeyword) {
      return { isChitChat: true, intent: 'chitchat', confidence: 0.72, reply: `Mình chưa chắc bạn đang hỏi về máy tính hay chỉ trò chuyện. Bạn có thể nói rõ hơn kiểu “15tr học CNTT” hoặc hỏi “dữ liệu có lớn không” thì mình sẽ trả lời về hệ thống nhé!` };
    }
    return { isChitChat: false, intent: 'product', confidence: 0.68, reply: null };
  }
}
