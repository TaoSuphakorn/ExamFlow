import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExamQuestion, CreateExamQuestionDto } from '../models/exam-question.model';

@Injectable({ providedIn: 'root' })
export class ExamService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5000/api/examquestions';

  getAll(): Observable<ExamQuestion[]> {
    return this.http.get<ExamQuestion[]>(this.baseUrl);
  }

  getById(id: number): Observable<ExamQuestion> {
    return this.http.get<ExamQuestion>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateExamQuestionDto): Observable<ExamQuestion> {
    return this.http.post<ExamQuestion>(this.baseUrl, dto);
  }

  update(id: number, dto: CreateExamQuestionDto): Observable<ExamQuestion> {
    return this.http.put<ExamQuestion>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}