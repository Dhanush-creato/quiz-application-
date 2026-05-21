package com.quizapp.payload.request;

import jakarta.validation.constraints.NotEmpty;
import java.util.Map;

/**
 * QuizSubmitRequest – DTO for submitting quiz answers.
 */
public class QuizSubmitRequest {

    private Long categoryId;
    private int timeTakenSeconds;

    @NotEmpty
    private Map<Long, String> answers;

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public int getTimeTakenSeconds() { return timeTakenSeconds; }
    public void setTimeTakenSeconds(int timeTakenSeconds) { this.timeTakenSeconds = timeTakenSeconds; }

    public Map<Long, String> getAnswers() { return answers; }
    public void setAnswers(Map<Long, String> answers) { this.answers = answers; }
}
