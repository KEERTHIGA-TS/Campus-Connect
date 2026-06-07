package com.campusconnect.service;

import com.campusconnect.dto.UserDto;
import com.campusconnect.entity.User;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("USER FOUND = " + user.getName());

        return UserDto.fromEntity(user);
    }

    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserDto.fromEntity(user);
    }

    public UserDto updateProfile(Long id, UserDto dto) {

        System.out.println("ID RECEIVED = " + id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔥 ACTUAL UPDATES (this was missing)
        user.setName(dto.getName());
        user.setBio(dto.getBio());
        user.setDepartment(dto.getDepartment());
        user.setYearOfStudy(dto.getYearOfStudy());
        user.setSkills(dto.getSkills());
        user.setLinkedinUrl(dto.getLinkedinUrl());
        user.setGithubUrl(dto.getGithubUrl());

        // 🔥 SAVE TO DATABASE (VERY IMPORTANT)
        userRepository.save(user);

        System.out.println("PROFILE UPDATED SUCCESSFULLY");

        return UserDto.fromEntity(user);
    }
}
