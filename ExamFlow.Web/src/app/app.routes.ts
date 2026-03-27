import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/exam-list/exam-list').then(m => m.ExamListComponent),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./components/exam-form/exam-form').then(m => m.ExamFormComponent),
  },
  {
    path: 'quiz',
    loadComponent: () =>
      import('./components/quiz/quiz').then(m => m.QuizComponent),
  },
  {
    path: 'result',
    loadComponent: () =>
      import('./components/quiz-result/quiz-result').then(m => m.QuizResultComponent),
  },
    {
    path: 'edit/:id',
    loadComponent: () =>
      import('./components/exam-form/exam-form').then(m => m.ExamFormComponent),
  },
  { path: '**', redirectTo: '' },
];