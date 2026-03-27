import { Injectable, signal } from '@angular/core';
import { QuizAnswer } from '../models/exam-question.model';

@Injectable({ providedIn: 'root' })
export class QuizStateService {
  answers = signal<QuizAnswer[]>([]);

  setAnswers(answers: QuizAnswer[]): void {
    this.answers.set(answers);
  }

  get score(): number {
    return this.answers().filter(a => a.isCorrect).length;
  }

  get total(): number {
    return this.answers().length;
  }

  get percentage(): number {
    if (this.total === 0) return 0;
    return Math.round((this.score / this.total) * 100);
  }

  clear(): void {
    this.answers.set([]);
  }
}