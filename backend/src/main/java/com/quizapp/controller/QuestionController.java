package com.quizapp.controller;

import com.quizapp.model.Category;
import com.quizapp.model.Question;
import com.quizapp.repository.CategoryRepository;
import com.quizapp.repository.QuestionRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * QuestionController – REST endpoints for quiz questions.
 * GET  /api/questions/category/{categoryId}          – authenticated users
 * GET  /api/questions/quiz/{categoryId}?count=10     – random questions for a quiz
 * POST /api/admin/questions                          – admin only (create)
 * PUT  /api/admin/questions/{id}                     – admin only (update)
 * DELETE /api/admin/questions/{id}                   – admin only (delete)
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    // ── User endpoints ─────────────────────────────────────────────────────────
    @GetMapping("/api/questions/category/{categoryId}")
    public List<Question> getQuestionsByCategory(@PathVariable Long categoryId) {
        return questionRepository.findByCategoryId(categoryId);
    }

    @GetMapping("/api/questions/quiz/{categoryId}")
    public List<Question> getRandomQuizQuestions(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "10") int count) {
        return questionRepository.findRandomQuestionsByCategory(categoryId, count);
    }

    @GetMapping("/api/questions/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        return questionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── Admin endpoints ────────────────────────────────────────────────────────
    @GetMapping("/api/admin/questions")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    @PostMapping("/api/admin/questions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createQuestion(@Valid @RequestBody Question question) {
        if (question.getCategory() == null || question.getCategory().getId() == null) {
            return ResponseEntity.badRequest().body("Category is required.");
        }
        Category category = categoryRepository.findById(question.getCategory().getId())
                .orElse(null);
        if (category == null) return ResponseEntity.badRequest().body("Category not found.");
        question.setCategory(category);
        return ResponseEntity.ok(questionRepository.save(question));
    }

    @PutMapping("/api/admin/questions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateQuestion(@PathVariable Long id,
                                            @Valid @RequestBody Question questionDetails) {
        return questionRepository.findById(id).map(q -> {
            q.setQuestionText(questionDetails.getQuestionText());
            q.setOptionA(questionDetails.getOptionA());
            q.setOptionB(questionDetails.getOptionB());
            q.setOptionC(questionDetails.getOptionC());
            q.setOptionD(questionDetails.getOptionD());
            q.setCorrectAnswer(questionDetails.getCorrectAnswer());
            q.setDifficultyLevel(questionDetails.getDifficultyLevel());
            if (questionDetails.getCategory() != null) {
                categoryRepository.findById(questionDetails.getCategory().getId())
                        .ifPresent(q::setCategory);
            }
            return ResponseEntity.ok(questionRepository.save(q));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/api/admin/questions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        return questionRepository.findById(id).map(q -> {
            questionRepository.delete(q);
            return ResponseEntity.ok("Question deleted successfully.");
        }).orElse(ResponseEntity.notFound().build());
    }
}
