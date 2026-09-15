import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class StreamingService {
  createStreamFromText(text: string): Observable<{ data: string }> {
    const subject = new Subject<{ data: string }>();
    const tokens = text.split(' ');
    let index = 0;

    const interval = setInterval(() => {
      if (index < tokens.length) {
        subject.next({ data: JSON.stringify({ token: tokens[index] + ' ', done: false }) });
        index++;
      } else {
        subject.next({ data: JSON.stringify({ done: true }) });
        subject.complete();
        clearInterval(interval);
      }
    }, 30);

    return subject.asObservable();
  }
}
