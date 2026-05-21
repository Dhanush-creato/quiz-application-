package com.quizapp.repository;

import com.quizapp.model.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * QuizResultRepository – Spring Data JPA repository for QuizResult entity.
 */
@Repository
public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
    List<QuizResult> findByUserId(Long userId);
    List<QuizResult> findByCategoryId(Long categoryId);
    List<QuizResult> findByUserIdOrderByAttemptedAtDesc(Long userId);
}
