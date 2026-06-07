package com.campusconnect.controller;

import com.campusconnect.dto.ApiResponse;
import com.campusconnect.dto.CommentDto;
import com.campusconnect.security.JwtUtil;
import com.campusconnect.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;
    private final JwtUtil jwtUtil;

    @PostMapping("/post/{postId}")
    public ResponseEntity<ApiResponse<CommentDto>> addComment(
            @PathVariable Long postId,
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String authHeader) {

        String text = body.get("text");
        if (text == null || text.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Comment text is required"));
        }

        Long userId = extractUserIdFromHeader(authHeader);
        CommentDto comment = commentService.addComment(postId, text, userId);
        return ResponseEntity.ok(ApiResponse.success("Comment added", comment));
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<ApiResponse<List<CommentDto>>> getComments(@PathVariable Long postId) {
        List<CommentDto> comments = commentService.getCommentsByPost(postId);
        return ResponseEntity.ok(ApiResponse.success(comments));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable Long commentId,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = extractUserIdFromHeader(authHeader);
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted", null));
    }

    private Long extractUserIdFromHeader(String authHeader) {
        String token = authHeader.substring(7);
        return jwtUtil.extractUserId(token);
    }
}
