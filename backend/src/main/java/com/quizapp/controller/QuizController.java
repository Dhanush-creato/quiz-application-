package com.quizapp.controller;

import com.quizapp.model.Category;
import com.quizapp.model.Question;
import com.quizapp.model.QuizResult;
import com.quizapp.model.User;
import com.quizapp.payload.request.QuizSubmitRequest;
import com.quizapp.payload.response.QuizResultResponse;
import com.quizapp.repository.CategoryRepository;
import com.quizapp.repository.QuestionRepository;
import com.quizapp.repository.QuizResultRepository;
import com.quizapp.repository.UserRepository;
import com.quizapp.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * QuizController – REST endpoints for quiz submission and results.
 * POST /api/quiz/submit   – submit quiz answers and get score
 * GET  /api/quiz/results  – user's own quiz history
 * GET  /api/admin/results – admin view all results
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @Autowired private QuizResultRepository quizResultRepository;
    @Autowired private QuestionRepository questionRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private UserRepository userRepository;

    // ── Submit Quiz ────────────────────────────────────────────────────────────
    @PostMapping("/submit")
    public ResponseEntity<?> submitQuiz(
            @Valid @RequestBody QuizSubmitRequest request,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElse(null);
        if (category == null) return ResponseEntity.badRequest().body("Category not found.");

        User user = userRepository.findById(currentUser.getId())
                .orElse(null);
        if (user == null) return ResponseEntity.badRequest().body("User not found.");

        Map<Long, String> answers = request.getAnswers();
        int correct = 0;
        int total = answers.size();

        for (Map.Entry<Long, String> entry : answers.entrySet()) {
            Question q = questionRepository.findById(entry.getKey()).orElse(null);
            if (q != null && q.getCorrectAnswer().equalsIgnoreCase(entry.getValue())) {
                correct++;
            }
        }

        int wrong = total - correct;
        double score = total > 0 ? ((double) correct / total) * 100 : 0;

        QuizResult result = new QuizResult();
        result.setUser(user);
        result.setCategory(category);
        result.setTotalQuestions(total);
        result.setCorrectAnswers(correct);
        result.setWrongAnswers(wrong);
        result.setScore(score);
        result.setTimeTakenSeconds(request.getTimeTakenSeconds());
        quizResultRepository.save(result);

        String grade = score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C"
                     : score >= 40 ? "D" : "F";
        String message = score >= 60 ? "Congratulations! You passed the quiz! 🎉"
                       : "Better luck next time. Keep practicing! 💪";

        return ResponseEntity.ok(new QuizResultResponse(
                result.getId(), category.getName(), total,
                correct, wrong, score,
                request.getTimeTakenSeconds(), grade, message));
    }

    // ── User Results ───────────────────────────────────────────────────────────
    @GetMapping("/results")
    public List<QuizResult> getMyResults(@AuthenticationPrincipal UserDetailsImpl currentUser) {
        return quizResultRepository.findByUserIdOrderByAttemptedAtDesc(currentUser.getId());
    }

    @GetMapping("/results/{id}")
    public ResponseEntity<QuizResult> getResultById(@PathVariable Long id) {
        return quizResultRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── Admin Results ──────────────────────────────────────────────────────────
    @GetMapping("/admin/results")
    @PreAuthorize("hasRole('ADMIN')")
    public List<QuizResult> getAllResults() {
        return quizResultRepository.findAll();
    }
}
