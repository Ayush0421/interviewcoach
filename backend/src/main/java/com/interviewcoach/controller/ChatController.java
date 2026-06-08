package com.interviewcoach.controller;

import com.interviewcoach.model.ChatRequest;
import com.interviewcoach.model.ChatResponse;
import com.interviewcoach.model.MemoryItem;
import com.interviewcoach.model.MemoryRequest;
import com.interviewcoach.model.Session;
import com.interviewcoach.model.SessionRequest;
import com.interviewcoach.service.ChatService;
import com.interviewcoach.service.MemoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final ChatService chatService;
    private final MemoryService memoryService;

    public ChatController(ChatService chatService, MemoryService memoryService) {
        this.chatService = chatService;
        this.memoryService = memoryService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        ChatResponse response = chatService.processChat(
            request.getSessionId(),
            request.getMessage(),
            request.getMode(),
            request.getHintLevel()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/hint")
    public ResponseEntity<Map<String, Integer>> hint(@RequestBody SessionRequest request) {
        int newHintLevel = chatService.incrementHint(request.getSessionId());
        return ResponseEntity.ok(Map.of("hintLevel", newHintLevel));
    }

    @PostMapping("/reset")
    public ResponseEntity<Map<String, Integer>> reset(@RequestBody SessionRequest request) {
        int newHintLevel = chatService.resetHint(request.getSessionId());
        return ResponseEntity.ok(Map.of("hintLevel", newHintLevel));
    }

    @GetMapping("/session/{id}")
    public ResponseEntity<Session> getSession(@PathVariable String id) {
        Session session = chatService.getOrCreateSession(id);
        return ResponseEntity.ok(session);
    }

    @PostMapping("/memory/add")
    public ResponseEntity<Map<String, String>> addMemory(@RequestBody MemoryRequest request) {
        memoryService.addMemory(request.getType(), request.getContent());
        return ResponseEntity.ok(Map.of("message", "Memory embedded and stored successfully!"));
    }

    @GetMapping("/memory/all")
    public ResponseEntity<List<MemoryItem>> getAllMemory() {
        return ResponseEntity.ok(memoryService.getAllMemories());
    }
}
