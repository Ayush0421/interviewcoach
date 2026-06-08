package com.interviewcoach.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemoryItem {
    @Builder.Default
    private String id = UUID.randomUUID().toString();
    private String type; // "note", "mistake", "pattern"
    private String content;
    private float[] embedding;
}
