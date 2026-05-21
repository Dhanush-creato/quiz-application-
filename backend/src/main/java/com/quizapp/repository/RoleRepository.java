package com.quizapp.repository;

import com.quizapp.model.ERole;
import com.quizapp.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * RoleRepository – Spring Data JPA repository for Role entity.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(ERole name);
}
