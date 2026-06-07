package com.campusconnect.dto;

import com.campusconnect.entity.Post;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
public class PostDto {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String fileUrl;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private Long userId;
    private String userName;
    private Set<Long> likedByUsers;
    private int likeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostDto fromEntity(Post post) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setDescription(post.getDescription());
        dto.setCategory(post.getCategory());
        dto.setFileUrl(post.getFileUrl());
        dto.setFileName(post.getFileName());
        dto.setFileType(post.getFileType());
        dto.setFileSize(post.getFileSize());
        dto.setUserId(post.getUser().getId());
        dto.setUserName(post.getUser().getName());
        dto.setLikedByUsers(post.getLikedByUsers());
        dto.setLikeCount(post.getLikedByUsers().size());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        return dto;
    }
}
