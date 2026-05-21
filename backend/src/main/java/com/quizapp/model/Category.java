package com.quizapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

/**
 * Category entity – quiz category (e.g., Java, Python, General Knowledge).
 */
@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true)
    private String name;

    private String description;

    private String iconClass;

    public Category() {}

    public Category(Long id, String name, String description, String iconClass) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.iconClass = iconClass;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIconClass() { return iconClass; }
    public void setIconClass(String iconClass) { this.iconClass = iconClass; }
}
