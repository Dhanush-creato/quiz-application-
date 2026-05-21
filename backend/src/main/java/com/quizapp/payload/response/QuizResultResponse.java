package com.quizapp.payload.response;

/**
 * QuizResultResponse – DTO returned after quiz submission.
 */
public class QuizResultResponse {
    private Long resultId;
    private String categoryName;
    private int totalQuestions;
    private int correctAnswers;
    private int wrongAnswers;
    private double score;
    private int timeTakenSeconds;
    private String grade;
    private String message;

    public QuizResultResponse() {}

    public QuizResultResponse(Long resultId, String categoryName, int totalQuestions,
                               int correctAnswers, int wrongAnswers, double score,
                               int timeTakenSeconds, String grade, String message) {
        this.resultId = resultId;
        this.categoryName = categoryName;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.wrongAnswers = wrongAnswers;
        this.score = score;
        this.timeTakenSeconds = timeTakenSeconds;
        this.grade = grade;
        this.message = message;
    }

    public Long getResultId() { return resultId; }
    public void setResultId(Long resultId) { this.resultId = resultId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }

    public int getCorrectAnswers() { return correctAnswers; }
    public void setCorrectAnswers(int correctAnswers) { this.correctAnswers = correctAnswers; }

    public int getWrongAnswers() { return wrongAnswers; }
    public void setWrongAnswers(int wrongAnswers) { this.wrongAnswers = wrongAnswers; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public int getTimeTakenSeconds() { return timeTakenSeconds; }
    public void setTimeTakenSeconds(int timeTakenSeconds) { this.timeTakenSeconds = timeTakenSeconds; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
