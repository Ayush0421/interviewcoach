package com.interviewcoach.agent;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AgentRouter {

    private final List<InterviewAgent> agents;

    public AgentRouter(List<InterviewAgent> agents) {
        this.agents = agents;
    }

    public InterviewAgent route(String input) {
        String query = input.toLowerCase();

        if (query.contains("design") && (query.contains("class") || query.contains("object") || query.contains("singleton") || query.contains("factory") || query.contains("parking lot") || query.contains("elevator"))) {
            return findAgent("LLD");
        } else if (query.contains("scalable") || query.contains("system") || query.contains("architecture") || query.contains("database") || query.contains("twitter") || query.contains("netflix")) {
            return findAgent("HLD");
        } else if (query.contains("tell me about yourself") || query.contains("manager") || query.contains("conflict") || query.contains("mistake") || query.contains("leadership")) {
            return findAgent("Behavioral");
        }

        // Default to DSA
        return findAgent("DSA");
    }

    private InterviewAgent findAgent(String name) {
        return agents.stream()
                .filter(a -> a.getAgentName().equals(name))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Agent not found: " + name));
    }
}
