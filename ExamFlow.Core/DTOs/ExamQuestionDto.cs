namespace ExamFlow.Core.DTOs;

public record CreateExamQuestionDto(
    string QuestionText,
    string Choice1,
    string Choice2,
    string Choice3,
    string Choice4,
    int CorrectAnswer
);

public record ExamQuestionResponse(
    int Id,
    int QuestionNumber,
    string QuestionText,
    string Choice1,
    string Choice2,
    string Choice3,
    string Choice4
);