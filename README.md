# 📝 ExamFlow

ระบบจัดการข้อสอบออนไลน์ พัฒนาด้วย ASP.NET Core + Angular

---

## 🗂️ โครงสร้างโปรเจค

```
ExamFlow/
├── ExamFlow.Api/        # Backend - ASP.NET Core Web API
├── ExamFlow.Core/       # Business Logic & Domain Models
├── ExamFlow.Web/        # Frontend - Angular
└── ExamFlow.slnx        # Visual Studio Solution
```

---

## ✅ Prerequisites

ก่อน run โปรเจค ต้องติดตั้งสิ่งต่อไปนี้ให้ครบ:

| เครื่องมือ | เวอร์ชันที่แนะนำ | ดาวน์โหลด |
|---|---|---|
| Docker Desktop | Latest | https://www.docker.com/products/docker-desktop |

---

## 🚀 วิธี Run โปรเจค

### 1. Clone Repository

```bash
git clone https://github.com/TaoSuphakorn/ExamFlow.git
cd ExamFlow
```

### 2. Run Docker 

```bash
docker compose -f ExamFlow.Api/docker-compose.yml up -d --build
```

## 📦 Tech Stack

**Backend**
- ASP.NET Core 9
- Entity Framework Core
- SQL Server

**Frontend**
- Angular 19
- TypeScript

---

## 👤 Author
**TaoSuphakorn** — [@TaoSuphakorn](https://github.com/TaoSuphakorn)
