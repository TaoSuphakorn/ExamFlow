import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import { ExamQuestion } from '../../models/exam-question.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exam-list.html',
})
export class ExamListComponent implements OnInit {
  private readonly examService = inject(ExamService);
  protected readonly router = inject(Router);

  questions    = signal<ExamQuestion[]>([]);
  isLoading    = signal(true);
  errorMessage = signal('');
  deletingId   = signal<number | null>(null);

  ngOnInit(): void { this.load(); }

  load(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.examService.getAll().subscribe({
      next:  (data) => { this.questions.set(data); this.isLoading.set(false); },
      error: ()     => { this.errorMessage.set('ไม่สามารถโหลดข้อมูลได้'); this.isLoading.set(false); },
    });
  }

  goToAdd(): void { this.router.navigate(['/add']); }

  async delete(q: ExamQuestion): Promise<void> {
    const result = await Swal.fire({
      title: `ลบข้อสอบข้อ ${q.questionNumber}?`,
      text: `"${q.questionText}"`,
      icon: 'warning',
      showCancelButton:   true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor:  '#6b7280',
      confirmButtonText:  'ลบเลย',
      cancelButtonText:   'ยกเลิก',
    });

    if (!result.isConfirmed) return;

    this.deletingId.set(q.id);
    this.examService.delete(q.id).subscribe({
      next: () => {
        this.deletingId.set(null);
        this.load();
        Swal.fire({
          title:'ลบสำเร็จ!',
          text: `ลบข้อสอบข้อ ${q.questionNumber} แล้ว`,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: () => {
        this.deletingId.set(null);
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text:  'ลบข้อสอบไม่สำเร็จ กรุณาลองใหม่',
          icon:  'error',
        });
      },
    });
  }

  choices(q: ExamQuestion): string[] {
    return [q.choice1, q.choice2, q.choice3, q.choice4];
  }

  get year(): number { return new Date().getFullYear(); }

  goToEdit(id: number): void {
    this.router.navigate(['/edit', id]);
  }
}