import { Injectable } from '@nestjs/common';

@Injectable()
export class IntentParser {
  parse(rawText: string) {
    return {
      raw: rawText,
      timestamp: new Date(),
    };
  }
}
