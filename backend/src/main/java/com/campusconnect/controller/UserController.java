package com.campusconnect.controller;

import com.campusconnect.dto.ApiResponse;
import com.campusconnect.dto.PostDto;
import com.campusconnect.dto.UserDto;
import com.campusconnect.service.PostService;
import com.campusconnect.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final PostService postService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/{id}/posts")
    public ResponseEntity<ApiResponse<List<PostDto>>> getUserPosts(@PathVariable Long id) {
        List<PostDto> posts = postService.getPostsByUser(id);
        return ResponseEntity.ok(ApiResponse.success(posts));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @PathVariable Long id,
            @RequestBody UserDto userDto) {

        System.out.println("ID = " + id);
        System.out.println("DTO = " + userDto);

        UserDto updatedUser = userService.updateProfile(id, userDto);

        return ResponseEntity.ok(ApiResponse.success(updatedUser));
    }
}
