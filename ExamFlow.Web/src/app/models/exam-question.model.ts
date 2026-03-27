export interface ExamQuestion {
  id: number;
  questionNumber: number;
  questionText: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  correctAnswer: number;
  createdAt: string;
}

export interface CreateExamQuestionDto {
  questionText: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  correctAnswer: number;
}


export interface QuizAnswer {
  questionId:     number;
  questionNumber: number;
  questionText:   string;
  choices:        string[];
  selectedAnswer: number;
  correctAnswer:  number;
  isCorrect:      boolean;
}