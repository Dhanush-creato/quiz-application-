package com.quizapp.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

/**
 * SignupRequest – DTO for user registration.
 */
public class SignupRequest {

    @NotBlank @Size(min = 3, max = 50)
    private String username;

    @NotBlank @Size(max = 100) @Email
    private String email;

    @NotBlank @Size(min = 6, max = 40)
    private String password;

    @NotBlank @Size(max = 100)
    private String fullName;

    private Set<String> roles;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
}
