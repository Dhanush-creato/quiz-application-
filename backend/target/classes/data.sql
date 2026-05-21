-- ============================================================
-- Quiz Application – Database Seed Script
-- Run this AFTER the Spring Boot app has created the schema
-- ============================================================

-- Insert Roles
INSERT IGNORE INTO roles (name) VALUES ('ROLE_USER');
INSERT IGNORE INTO roles (name) VALUES ('ROLE_ADMIN');

-- Insert Categories
INSERT INTO categories (name, description, icon_class) VALUES
('Java', 'Core Java programming concepts', 'fab fa-java'),
('Python', 'Python programming language basics', 'fab fa-python'),
('JavaScript', 'Modern JavaScript ES6+ features', 'fab fa-js'),
('Spring Boot', 'Spring Boot framework and REST APIs', 'fas fa-leaf'),
('MySQL', 'SQL queries and database design', 'fas fa-database'),
('General Knowledge', 'Science, history, and current affairs', 'fas fa-globe');

-- Insert Sample Questions – Java
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty_level, category_id) VALUES
('What is the default value of an int variable in Java?', '0', 'null', '1', 'undefined', 'A', 'EASY', 1),
('Which of these is NOT a Java primitive type?', 'int', 'String', 'boolean', 'char', 'B', 'EASY', 1),
('What does JVM stand for?', 'Java Virtual Machine', 'Java Variable Method', 'Just Very Modular', 'Java Verified Module', 'A', 'EASY', 1),
('Which keyword is used to inherit a class in Java?', 'implements', 'extends', 'inherits', 'super', 'B', 'MEDIUM', 1),
('What is the output of: System.out.println(10 / 3)?', '3.33', '3', '4', 'Error', 'B', 'MEDIUM', 1),
('Which collection does NOT allow duplicate values?', 'ArrayList', 'LinkedList', 'HashSet', 'Vector', 'C', 'MEDIUM', 1),
('What is autoboxing in Java?', 'Auto-loading of JVM', 'Conversion of primitive to wrapper class', 'Memory deallocation', 'Stack overflow handling', 'B', 'HARD', 1),
('Which design pattern is used by Spring IoC container?', 'Singleton', 'Factory', 'Dependency Injection', 'Observer', 'C', 'HARD', 1);

-- Insert Sample Questions – JavaScript
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty_level, category_id) VALUES
('What does typeof null return in JavaScript?', '"null"', '"object"', '"undefined"', '"boolean"', 'B', 'EASY', 3),
('Which method adds an element to the end of an array?', 'push()', 'pop()', 'shift()', 'unshift()', 'A', 'EASY', 3),
('What is closure in JavaScript?', 'A loop structure', 'A function with access to outer scope', 'A try-catch block', 'An async operation', 'B', 'MEDIUM', 3),
('Which ES6 feature allows destructuring?', 'Arrow functions', 'Template literals', 'Destructuring assignment', 'Spread operator', 'C', 'MEDIUM', 3);

-- Insert Sample Questions – General Knowledge
INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty_level, category_id) VALUES
('Which planet is known as the Red Planet?', 'Venus', 'Jupiter', 'Mars', 'Saturn', 'C', 'EASY', 6),
('Who invented the telephone?', 'Thomas Edison', 'Alexander Graham Bell', 'Nikola Tesla', 'James Watt', 'B', 'EASY', 6),
('What is the capital of Japan?', 'Beijing', 'Seoul', 'Bangkok', 'Tokyo', 'D', 'EASY', 6),
('The speed of light is approximately:', '3 × 10^6 m/s', '3 × 10^8 m/s', '3 × 10^10 m/s', '3 × 10^4 m/s', 'B', 'MEDIUM', 6);
