package com.campusconnect.service;

import com.campusconnect.dto.PostDto;
import com.campusconnect.entity.Post;
import com.campusconnect.entity.User;
import com.campusconnect.repository.CommentRepository;
import com.campusconnect.repository.PostRepository;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final FileStorageService fileStorageService;

    public PostDto createPost(String title, String description, String category,
                              MultipartFile file, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String fileUrl = null;
        String fileName = null;
        String fileType = null;
        Long fileSize = null;

        if ( file!= null && !file.isEmpty()) {
            fileUrl = fileStorageService.storeFile(file);
            fileName = file.getOriginalFilename();
            fileType = file.getContentType();
            fileSize = file.getSize();
        }

        Post post = Post.builder()
                .title(title)
                .description(description)
                .category(category)
                .fileUrl(fileUrl)
                .fileName(fileName)
                .fileType(fileType)
                .fileSize(fileSize)
                .user(user)
                .build();

        Post saved = postRepository.save(post);
        return PostDto.fromEntity(saved);
    }

    public List<PostDto> getAllPosts() {
        return postRepository.findAllWithUserOrderByCreatedAtDesc()
                .stream()
                .map(PostDto::fromEntity)
                .collect(Collectors.toList());
    }

    public PostDto getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return PostDto.fromEntity(post);
    }

    public List<PostDto> getPostsByUser(Long userId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(PostDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this post");
        }

        if (post.getFileUrl() != null) {
            fileStorageService.deleteFile(post.getFileUrl());
        }

        commentRepository.deleteByPostId(postId);
        postRepository.delete(post);
    }

    @Transactional
    public PostDto toggleLike(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (post.getLikedByUsers().contains(userId)) {
            post.getLikedByUsers().remove(userId);
        } else {
            post.getLikedByUsers().add(userId);
        }

        Post saved = postRepository.save(post);
        return PostDto.fromEntity(saved);
    }
}
