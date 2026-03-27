using ExamApi.Data;
using ExamFlow.Api.Endpoints;
using ExamFlow.Api.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IExamRepository, ExamService>();

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

builder.Services.AddOpenApi();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    var retries = 5;
    while (retries > 0)
    {
        try
        {
            db.Database.EnsureCreated();
            logger.LogInformation("✅ Database Ready");
            break;
        }
        catch (Exception ex)
        {
            retries--;
            logger.LogWarning("⏳ Waiting for DB... left {Try} Info: {msg}", retries, ex.Message);
            Thread.Sleep(3000);
        }
    }
}

app.MapOpenApi();
app.MapScalarApiReference();
app.UseCors();

app.MapGet("/", () => Results.Redirect("/scalar/v1"));

app.MapExamEndpoints();

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.Run();