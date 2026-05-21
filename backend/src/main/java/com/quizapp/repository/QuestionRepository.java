package com.quizapp.repository;

import com.quizapp.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * QuestionRepository – Spring Data JPA repository for Question entity.
 */
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByCategoryId(Long categoryId);

    @Query(value = "SELECT * FROM questions WHERE category_id = :categoryId ORDER BY RAND() LIMIT :limit",
           nativeQuery = true)
    List<Question> findRandomQuestionsByCategory(Long categoryId, int limit);

    long countByCategoryId(Long categoryId);
}
