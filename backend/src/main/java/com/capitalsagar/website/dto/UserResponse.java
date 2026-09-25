package com.capitalsagar.website.dto;

import java.time.LocalDateTime;

public class UserResponse {

    private final Integer id;
    private final String fullname;
    private final String email;
    private final LocalDateTime createdAt;

    public UserResponse(Integer id, String fullname, String email, LocalDateTime createdAt) {
        this.id = id;
        this.fullname = fullname;
        this.email = email;
        this.createdAt = createdAt;
    }

    public Integer getId() {
        return id;
    }

    public String getFullname() {
        return fullname;
    }

    public String getEmail() {
        return email;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}