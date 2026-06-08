package com.interviewcoach.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChatRequest {
    private String message;
    private String mode; // "interview", "learning", "debug"
    private int hintLevel; // If passed from frontend, otherwise backend syncs it
    private String sessionId;
}
