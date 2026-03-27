FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY NuGet.Config .

COPY ExamFlow.Core/ExamFlow.Core.csproj   ExamFlow.Core/
COPY ExamFlow.Api/ExamFlow.Api.csproj     ExamFlow.Api/

RUN dotnet restore ExamFlow.Api/ExamFlow.Api.csproj

COPY ExamFlow.Core/   ExamFlow.Core/
COPY ExamFlow.Api/    ExamFlow.Api/

RUN dotnet publish ExamFlow.Api/ExamFlow.Api.csproj \
    -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

RUN adduser --disabled-password --gecos "" appuser
USER appuser

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "ExamFlow.Api.dll"]