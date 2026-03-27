import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { QuizStateService } from '../../services/quiz.state.service';
import { ExamQuestion, QuizAnswer } from '../../models/exam-question.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.html',
})
export class QuizComponent implements OnInit {
  private readonly examService  = inject(ExamService);
  private readonly quizState    = inject(QuizStateService);
  private readonly router       = inject(Router);

  questions    = signal<ExamQuestion[]>([]);
  isLoading    = signal(true);
  errorMessage = signal('');

  selectedAnswers = signal<Record<number, number>>({});

  answeredCount = computed(() =>
    Object.keys(this.selectedAnswers()).length
  );

  ngOnInit(): void {
    this.quizState.clear();
    this.examService.getAll().subscribe({
      next: (data) => {
        this.questions.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('ไม่สามารถโหลดข้อมูลได้');
        this.isLoading.set(false);
      },
    });
  }

  selectAnswer(questionId: number, choice: number): void {
    this.selectedAnswers.update(prev => ({ ...prev, [questionId]: choice }));
  }

  isSelected(questionId: number, choice: number): boolean {
    return this.selectedAnswers()[questionId] === choice;
  }

  choices(q: ExamQuestion): { label: string; value: number }[] {
    return [
      { label: q.choice1, value: 1 },
      { label: q.choice2, value: 2 },
      { label: q.choice3, value: 3 },
      { label: q.choice4, value: 4 },
    ];
  }

  async submit(): Promise<void> {
    const unanswered = this.questions().length - this.answeredCount();

    if (unanswered > 0) {
      const result = await Swal.fire({
        title: 'ยังตอบไม่ครบ!',
        text: `เหลือ ${unanswered} ข้อที่ยังไม่ได้เลือกคำตอบ ต้องการส่งต่อหรือไม่?`,
        icon: 'warning',
        showCancelButton:   true,
        confirmButtonColor: '#f59e0b',
        cancelButtonColor:  '#6b7280',
        confirmButtonText:  'ส่งเลย',
        cancelButtonText:   'กลับไปทำต่อ',
      });
      if (!result.isConfirmed) return;
    }

    const answers: QuizAnswer[] = this.questions().map(q => {
      const selected = this.selectedAnswers()[q.id] ?? 0;
      return {
        questionId:     q.id,
        questionNumber: q.questionNumber,
        questionText:   q.questionText,
        choices:        [q.choice1, q.choice2, q.choice3, q.choice4],
        selectedAnswer: selected,
        correctAnswer:  q.correctAnswer,
        isCorrect:      selected === q.correctAnswer,
      };
    });

    this.quizState.setAnswers(answers);
    this.router.navigate(['/result']);
  }

  async goBack(): Promise<void> {
    if (this.answeredCount() > 0) {
      const result = await Swal.fire({
        title: 'ออกจากการทำข้อสอบ?',
        text: 'คำตอบที่เลือกไว้จะหายทั้งหมด',
        icon: 'question',
        showCancelButton:   true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor:  '#6b7280',
        confirmButtonText:  'ออกเลย',
        cancelButtonText:   'ทำต่อ',
      });
      if (!result.isConfirmed) return;
    }
    this.router.navigate(['/']);
  }
}