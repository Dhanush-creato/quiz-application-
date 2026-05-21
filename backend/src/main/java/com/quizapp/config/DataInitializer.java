package com.quizapp.config;

import com.quizapp.model.ERole;
import com.quizapp.model.Role;
import com.quizapp.repository.RoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * DataInitializer – seeds mandatory roles on startup.
 * Uses findAll() to avoid NonUniqueResultException if DB has stale rows.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        // Collect existing role names
        List<String> existingNames = roleRepository.findAll()
                .stream()
                .map(r -> r.getName().name())
                .toList();

        if (!existingNames.contains(ERole.ROLE_USER.name())) {
            roleRepository.save(new Role(ERole.ROLE_USER));
            logger.info("Seeded role: ROLE_USER");
        }
        if (!existingNames.contains(ERole.ROLE_ADMIN.name())) {
            roleRepository.save(new Role(ERole.ROLE_ADMIN));
            logger.info("Seeded role: ROLE_ADMIN");
        }

        logger.info("✅ Roles ready.");
    }
}
