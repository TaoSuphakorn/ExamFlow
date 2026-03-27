using System;
using System.Collections.Generic;
using System.Text;

namespace ExamFlow.Core.Models
{
    public class ExamQuestion
    {
        public int Id { get; set; }
        public int QuestionNumber { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public string Choice1 { get; set; } = string.Empty;
        public string Choice2 { get; set; } = string.Empty;
        public string Choice3 { get; set; } = string.Empty;
        public string Choice4 { get; set; } = string.Empty;
        public int CorrectAnswer { get; set; } = 1;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
