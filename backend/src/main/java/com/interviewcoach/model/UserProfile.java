package com.interviewcoach.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    private List<String> weakTopics = new ArrayList<>();
    private List<String> strongTopics = new ArrayList<>();
    private String experienceLevel = "SDE1";
}
