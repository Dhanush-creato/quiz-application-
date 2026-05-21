package com.quizapp.controller;

import com.quizapp.model.Category;
import com.quizapp.repository.CategoryRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * CategoryController – REST endpoints for quiz categories.
 * GET  /api/categories          – public (list all categories)
 * POST /api/admin/categories    – admin only (create category)
 * PUT  /api/admin/categories/{id}  – admin only (update)
 * DELETE /api/admin/categories/{id} – admin only (delete)
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    // ── Public ─────────────────────────────────────────────────────────────────
    @GetMapping("/api/categories")
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @GetMapping("/api/categories/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── Admin ──────────────────────────────────────────────────────────────────
    @PostMapping("/api/admin/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCategory(@Valid @RequestBody Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            return ResponseEntity.badRequest().body("Category name already exists.");
        }
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @PutMapping("/api/admin/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCategory(@PathVariable Long id,
                                            @Valid @RequestBody Category categoryDetails) {
        return categoryRepository.findById(id).map(cat -> {
            cat.setName(categoryDetails.getName());
            cat.setDescription(categoryDetails.getDescription());
            cat.setIconClass(categoryDetails.getIconClass());
            return ResponseEntity.ok(categoryRepository.save(cat));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/api/admin/categories/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        return categoryRepository.findById(id).map(cat -> {
            categoryRepository.delete(cat);
            return ResponseEntity.ok("Category deleted successfully.");
        }).orElse(ResponseEntity.notFound().build());
    }
}
