package com.interviewcoach.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class Session {
    private String sessionId;
    private List<ChatMessage> history;
    private int hintLevel; // 0, 1, 2, 3
    private String currentMode; // "interview", "learning", "debug"
    private UserProfile userProfile;

    public Session() {
        this.history = new ArrayList<>();
        this.hintLevel = 0;
        this.currentMode = "interview";
        this.userProfile = new UserProfile();
    }
}
