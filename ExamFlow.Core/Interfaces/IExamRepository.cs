using ExamFlow.Core.Models;

public interface IExamRepository
{
    Task<IEnumerable<ExamQuestion>> GetAllAsync();
    Task<ExamQuestion?> GetByIdAsync(int id);
    Task<ExamQuestion> CreateAsync(ExamQuestion question);
    Task<ExamQuestion?> UpdateAsync(int id, ExamQuestion question);
    Task DeleteAsync(int id);
}