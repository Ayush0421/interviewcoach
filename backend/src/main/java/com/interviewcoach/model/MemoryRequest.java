package com.interviewcoach.model;

import lombok.Data;

@Data
public class MemoryRequest {
    private String type;
    private String content;
    private String query;
}
