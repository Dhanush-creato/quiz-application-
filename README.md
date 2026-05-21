# QuizMaster – Java Full Stack Quiz Application

> An interactive online quiz platform built with **Spring Boot** (backend) + **React.js** (frontend) + **MySQL** database.

---

## 📁 Project Structure

```
quiz-application/
├── backend/                          # Spring Boot REST API
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/quizapp/
│       │   ├── QuizApplicationBackend.java   ← Entry point
│       │   ├── config/
│       │   │   └── SecurityConfig.java       ← Spring Security + CORS
│       │   ├── controller/
│       │   │   ├── AuthController.java       ← /api/auth/**
│       │   │   ├── CategoryController.java   ← /api/categories + /api/admin/categories
│       │   │   ├── QuestionController.java   ← /api/questions + /api/admin/questions
│       │   │   └── QuizController.java       ← /api/quiz/**
│       │   ├── model/
│       │   │   ├── User.java
│       │   │   ├── Role.java + ERole.java
│       │   │   ├── Category.java
│       │   │   ├── Question.java
│       │   │   └── QuizResult.java
│       │   ├── repository/
│       │   │   ├── UserRepository.java
│       │   │   ├── RoleRepository.java
│       │   │   ├── CategoryRepository.java
│       │   │   ├── QuestionRepository.java
│       │   │   └── QuizResultRepository.java
│       │   ├── security/
│       │   │   ├── JwtUtils.java             ← Token generation/validation
│       │   │   ├── AuthTokenFilter.java      ← Per-request JWT filter
│       │   │   ├── AuthEntryPointJwt.java    ← 401 handler
│       │   │   ├── UserDetailsImpl.java
│       │   │   └── UserDetailsServiceImpl.java
│       │   └── payload/
│       │       ├── request/ LoginRequest, SignupRequest, QuizSubmitRequest
│       │       └── response/ JwtResponse, MessageResponse, QuizResultResponse
│       └── resources/
│           ├── application.properties        ← DB + JWT config
│           └── data.sql                      ← Seed data
│
└── frontend/                         # React.js SPA
    ├── package.json
    ├── public/index.html
    └── src/
        ├── index.js                   ← App entry
        ├── App.js                     ← Router + route guards
        ├── index.css                  ← Global design system
        ├── context/
        │   └── AuthContext.js         ← Auth state (JWT storage)
        ├── services/
        │   └── api.js                 ← Axios + interceptors
        ├── components/
        │   ├── Navbar.js
        │   └── AdminSidebar.js
        └── pages/
            ├── HomePage.js
            ├── LoginPage.js
            ├── RegisterPage.js
            ├── CategoriesPage.js
            ├── QuizPage.js            ← Timer + MCQ engine
            ├── ResultPage.js          ← Score circle + grade
            ├── DashboardPage.js       ← User history
            └── admin/
                ├── AdminDashboard.js
                ├── AdminQuestions.js  ← CRUD + modal
                ├── AdminCategories.js ← CRUD + modal
                └── AdminResults.js   ← All user results
```

---

## 🚀 Setup & Run

### Prerequisites
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+

### 1. Database Setup
```sql
CREATE DATABASE quiz_db;
```

### 2. Backend
```bash
cd backend
# Edit src/main/resources/application.properties → set your MySQL password
mvn spring-boot:run
```
> Backend runs at **http://localhost:8080**
> Tables auto-created by Hibernate. Then run `data.sql` manually to seed roles + sample data.

### 3. Frontend
```bash
cd frontend
npm install
npm start
```
> Frontend runs at **http://localhost:3000**

---

## 🔌 REST API Endpoints

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login → returns JWT |
| GET | `/api/categories` | Public | List all categories |
| GET | `/api/questions/quiz/{catId}?count=10` | User | Random quiz questions |
| POST | `/api/quiz/submit` | User | Submit answers → get score |
| GET | `/api/quiz/results` | User | My quiz history |
| GET | `/api/admin/questions` | Admin | All questions |
| POST | `/api/admin/questions` | Admin | Create question |
| PUT | `/api/admin/questions/{id}` | Admin | Update question |
| DELETE | `/api/admin/questions/{id}` | Admin | Delete question |
| POST | `/api/admin/categories` | Admin | Create category |
| GET | `/api/quiz/admin/results` | Admin | All user results |

---

## 👥 Default Test Accounts (after seed)

Register via `/register` or Postman:
- **User:** `student1 / password123`
- **Admin:** register with `"roles": ["admin"]` payload

---

## 🔒 Security Flow
```
1. User POST /api/auth/login → JWT token returned
2. React stores token in localStorage
3. Axios interceptor attaches: Authorization: Bearer <token>
4. AuthTokenFilter validates token per request
5. @PreAuthorize("hasRole('ADMIN')") guards admin endpoints
```

---

## 🛠 Technologies

| Layer | Technology |
|-------|------------|
| Frontend | React.js 18, React Router 6, Axios |
| Styling | Vanilla CSS (dark theme, glassmorphism) |
| Backend | Java 17, Spring Boot 3.2 |
| Security | Spring Security + JWT (jjwt 0.11.5) |
| ORM | Spring Data JPA + Hibernate |
| Database | MySQL 8 |
| Build | Maven |
