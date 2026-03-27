using ExamApi.Data;
using ExamFlow.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace ExamFlow.Api.Services;

public class ExamService(AppDbContext db) : IExamRepository
{
    public async Task<IEnumerable<ExamQuestion>> GetAllAsync()
    {
        return await db.ExamQuestions
            .OrderBy(q => q.QuestionNumber)
            .ToListAsync();
    }

    public async Task<ExamQuestion?> GetByIdAsync(int id)
    {
        return await db.ExamQuestions.FindAsync(id);
    }

    public async Task<ExamQuestion> CreateAsync(ExamQuestion question)
    {
        var nextNumber = await db.ExamQuestions.AnyAsync()
            ? await db.ExamQuestions.MaxAsync(q => q.QuestionNumber) + 1
            : 1;

        question.QuestionNumber = nextNumber;
        question.CreatedAt = DateTime.UtcNow;

        db.ExamQuestions.Add(question);
        await db.SaveChangesAsync();

        return question;
    }

    public async Task DeleteAsync(int id)
    {
        var question = await db.ExamQuestions.FindAsync(id);
        if (question is null) return;

        var deletedNumber = question.QuestionNumber;

        db.ExamQuestions.Remove(question);
        await db.SaveChangesAsync();

        var questionsAfter = await db.ExamQuestions
            .Where(q => q.QuestionNumber > deletedNumber)
            .OrderBy(q => q.QuestionNumber)
            .ToListAsync();

        foreach (var q in questionsAfter)
            q.QuestionNumber--;

        await db.SaveChangesAsync();
    }

    public async Task<ExamQuestion?> UpdateAsync(int id, ExamQuestion updated)
    {
        var question = await db.ExamQuestions.FindAsync(id);
        if (question is null) return null;

        question.QuestionText = updated.QuestionText;
        question.Choice1 = updated.Choice1;
        question.Choice2 = updated.Choice2;
        question.Choice3 = updated.Choice3;
        question.Choice4 = updated.Choice4;
        question.CorrectAnswer = updated.CorrectAnswer;

        await db.SaveChangesAsync();
        return question;
    }
}