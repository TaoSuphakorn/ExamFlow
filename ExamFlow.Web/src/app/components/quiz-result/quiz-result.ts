import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { QuizStateService } from '../../services/quiz.state.service';

@Component({
  selector: 'app-quiz-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-result.html',
})
export class QuizResultComponent implements OnInit {
  readonly quizState = inject(QuizStateService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (this.quizState.answers().length === 0) {
      this.router.navigate(['/']);
    }
  }

  get scoreColor(): string {
    const pct = this.quizState.percentage;
    if (pct >= 80) return 'text-green-500';
    if (pct >= 50) return 'text-yellow-500';
    return 'text-red-500';
  }

  get scoreMessage(): string {
    const pct = this.quizState.percentage;
    if (pct === 100) return '🏆 เยี่ยมมาก! ถูกทุกข้อ!';
    if (pct >= 80)   return '🎉 ดีมาก! เกือบถูกทุกข้อ';
    if (pct >= 50)   return '👍 พอใช้ได้ ลองทำใหม่นะ';
    return '💪 ยังไม่ผ่าน ทบทวนแล้วลองใหม่!';
  }

  getChoiceLabel(choices: string[], index: number): string {
    return choices[index - 1] ?? '';
  }

  tryAgain(): void {
    this.router.navigate(['/quiz']);
  }

  goHome(): void {
    this.quizState.clear();
    this.router.navigate(['/']);
  }
}