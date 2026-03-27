import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExamService } from '../../services/exam.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-exam-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exam-form.html',
})
export class ExamFormComponent implements OnInit {
  private readonly fb      = inject(FormBuilder);
  private readonly service = inject(ExamService);
  private readonly router  = inject(Router);
  private readonly route   = inject(ActivatedRoute);

  isSaving  = signal(false);
  isLoading = signal(false);
  editId    = signal<number | null>(null);

  get isEditMode(): boolean { return this.editId() !== null; }

  form = this.fb.group({
    questionText:  ['', [Validators.required, Validators.maxLength(500)]],
    choice1:       ['', [Validators.required, Validators.maxLength(200)]],
    choice2:       ['', [Validators.required, Validators.maxLength(200)]],
    choice3:       ['', [Validators.required, Validators.maxLength(200)]],
    choice4:       ['', [Validators.required, Validators.maxLength(200)]],
    correctAnswer: [1,  [Validators.required]],
  });

  readonly fields = [
    { key: 'questionText', label: 'คำถาม',   placeholder: 'กรอกคำถาม' },
    { key: 'choice1',      label: 'คำตอบ 1', placeholder: 'กรอกคำตอบ 1' },
    { key: 'choice2',      label: 'คำตอบ 2', placeholder: 'กรอกคำตอบ 2' },
    { key: 'choice3',      label: 'คำตอบ 3', placeholder: 'กรอกคำตอบ 3' },
    { key: 'choice4',      label: 'คำตอบ 4', placeholder: 'กรอกคำตอบ 4' },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId.set(Number(id));
      this.loadQuestion(Number(id));
    }
  }

  loadQuestion(id: number): void {
    this.isLoading.set(true);
    this.service.getById(id).subscribe({
      next: (q) => {
        this.form.patchValue({
          questionText:  q.questionText,
          choice1:       q.choice1,
          choice2:       q.choice2,
          choice3:       q.choice3,
          choice4:       q.choice4,
          correctAnswer: q.correctAnswer,
        });
        this.isLoading.set(false);
      },
      error: () => {
        Swal.fire({ title: 'ไม่พบข้อสอบ', icon: 'error' })
          .then(() => this.router.navigate(['/']));
      },
    });
  }

  get previewAnswer(): string {
    const val = Number(this.form.get('correctAnswer')?.value);
    const map: Record<number, string> = {
      1: this.form.get('choice1')?.value || 'คำตอบ 1',
      2: this.form.get('choice2')?.value || 'คำตอบ 2',
      3: this.form.get('choice3')?.value || 'คำตอบ 3',
      4: this.form.get('choice4')?.value || 'คำตอบ 4',
    };
    return map[val] ?? '';
  }

  isInvalid(key: string): boolean {
    const c = this.form.get(key);
    return !!(c?.invalid && c?.touched);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      Swal.fire({ title: 'กรุณากรอกข้อมูลให้ครบ', icon: 'warning', timer: 1500, showConfirmButton: false });
      return;
    }

    this.isSaving.set(true);
    const dto = { ...this.form.value, correctAnswer: Number(this.form.value.correctAnswer) };

    const request$ = this.isEditMode
      ? this.service.update(this.editId()!, dto as any)
      : this.service.create(dto as any);

    request$.subscribe({
      next: () => {
        Swal.fire({
          title: this.isEditMode ? 'แก้ไขสำเร็จ!' : 'บันทึกสำเร็จ!',
          icon: 'success',
          timer: 1200,
          showConfirmButton: false,
        }).then(() => this.router.navigate(['/']));
      },
      error: (err) => {
      this.isSaving.set(false);
      const message = err?.error?.message ?? 'บันทึกไม่สำเร็จ กรุณาลองใหม่';
      Swal.fire({ title: 'เกิดข้อผิดพลาด', text: message, icon: 'error' });
    },
    });
  }

  async cancel(): Promise<void> {
    if (this.form.dirty) {
      const result = await Swal.fire({
        title: 'ยกเลิก?',
        text: 'ข้อมูลที่แก้ไขจะหายทั้งหมด',
        icon: 'question',
        showCancelButton:   true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor:  '#6b7280',
        confirmButtonText:  'ออกเลย',
        cancelButtonText:   'อยู่ต่อ',
      });
      if (!result.isConfirmed) return;
    }
    this.router.navigate(['/']);
  }
}