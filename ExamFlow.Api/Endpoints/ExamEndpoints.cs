using ExamFlow.Core.DTOs;
using ExamFlow.Core.Models;

namespace ExamFlow.Api.Endpoints;

public static class ExamEndpoints
{
    public static void MapExamEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/examquestions")
                       .WithTags("ExamQuestions")
                       .WithOpenApi();

        group.MapGet("/", GetAll);
        group.MapGet("/{id}", GetById);
        group.MapPost("/", Create);
        group.MapPut("/{id}", Update);
        group.MapDelete("/{id}", Delete);
    }

    private static string? ValidateDto(CreateExamQuestionDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.QuestionText))
            return "กรุณากรอกคำถาม";

        if (string.IsNullOrWhiteSpace(dto.Choice1)) return "กรุณากรอกคำตอบ 1";
        if (string.IsNullOrWhiteSpace(dto.Choice2)) return "กรุณากรอกคำตอบ 2";
        if (string.IsNullOrWhiteSpace(dto.Choice3)) return "กรุณากรอกคำตอบ 3";
        if (string.IsNullOrWhiteSpace(dto.Choice4)) return "กรุณากรอกคำตอบ 4";

        var choices = new[] { dto.Choice1, dto.Choice2, dto.Choice3, dto.Choice4 };
        var duplicates = choices
            .GroupBy(c => c.Trim().ToLower())
            .Where(g => g.Count() > 1)
            .Select(g => g.Key)
            .ToList();

        if (duplicates.Any())
            return $"คำตอบห้ามซ้ำกัน: {string.Join(", ", duplicates)}";

        if (dto.CorrectAnswer < 1 || dto.CorrectAnswer > 4)
            return "เฉลยต้องเป็น 1-4 เท่านั้น";

        return null;
    }

    private static async Task<IResult> GetAll(IExamRepository repo)
    {
        return Results.Ok(await repo.GetAllAsync());
    }

    private static async Task<IResult> GetById(int id, IExamRepository repo)
    {
        var question = await repo.GetByIdAsync(id);
        return question is null
            ? Results.NotFound(new { message = $"ไม่พบข้อสอบ id {id}" })
            : Results.Ok(question);
    }

    private static async Task<IResult> Create(CreateExamQuestionDto dto, IExamRepository repo)
    {
        var error = ValidateDto(dto);
        if (error is not null)
            return Results.BadRequest(new { message = error });

        var created = await repo.CreateAsync(new()
        {
            QuestionText = dto.QuestionText,
            Choice1 = dto.Choice1,
            Choice2 = dto.Choice2,
            Choice3 = dto.Choice3,
            Choice4 = dto.Choice4,
            CorrectAnswer = dto.CorrectAnswer,
        });

        return Results.Created($"/api/examquestions/{created.Id}", created);
    }

    private static async Task<IResult> Update(int id, CreateExamQuestionDto dto, IExamRepository repo)
    {
        var error = ValidateDto(dto);
        if (error is not null)
            return Results.BadRequest(new { message = error });

        var updated = await repo.UpdateAsync(id, new()
        {
            QuestionText = dto.QuestionText,
            Choice1 = dto.Choice1,
            Choice2 = dto.Choice2,
            Choice3 = dto.Choice3,
            Choice4 = dto.Choice4,
            CorrectAnswer = dto.CorrectAnswer,
        });

        return updated is null
            ? Results.NotFound(new { message = $"ไม่พบข้อสอบ id {id}" })
            : Results.Ok(updated);
    }

    private static async Task<IResult> Delete(int id, IExamRepository repo)
    {
        var question = await repo.GetByIdAsync(id);
        if (question is null)
            return Results.NotFound(new { message = $"ไม่พบข้อสอบ id {id}" });

        await repo.DeleteAsync(id);
        return Results.NoContent();
    }
}