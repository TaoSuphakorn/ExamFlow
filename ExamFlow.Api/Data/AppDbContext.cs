using ExamFlow.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace ExamApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<ExamQuestion> ExamQuestions => Set<ExamQuestion>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ExamQuestion>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.QuestionText).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Choice1).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Choice2).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Choice3).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Choice4).IsRequired().HasMaxLength(200);
        });
    }
}
