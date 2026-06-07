package com.campusconnect.service;

import com.campusconnect.dto.CommentDto;
import com.campusconnect.entity.Comment;
import com.campusconnect.entity.Post;
import com.campusconnect.entity.User;
import com.campusconnect.repository.CommentRepository;
import com.campusconnect.repository.PostRepository;
import com.campusconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public CommentDto addComment(Long postId, String text, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = Comment.builder()
                .text(text)
                .post(post)
                .user(user)
                .build();

        Comment saved = commentRepository.save(comment);
        return CommentDto.fromEntity(saved);
    }

    public List<CommentDto> getCommentsByPost(Long postId) {
        return commentRepository.findByPostIdWithUser(postId)
                .stream()
                .map(CommentDto::fromEntity)
                .collect(Collectors.toList());
    }

    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }
}
