package com.campusconnect.dto;

import com.campusconnect.entity.User;
import jakarta.persistence.Column;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private String avatarUrl;
    private String bio;
    private String department;
    private String yearOfStudy;

    @Column(length = 1000)
    private String skills;

    private String linkedinUrl;
    private String githubUrl;
    private LocalDateTime createdAt;

    public static UserDto fromEntity(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setBio(user.getBio());
        dto.setDepartment(user.getDepartment());
        dto.setYearOfStudy(user.getYearOfStudy());
        dto.setSkills(user.getSkills());
        dto.setLinkedinUrl(user.getLinkedinUrl());
        dto.setGithubUrl(user.getGithubUrl());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
