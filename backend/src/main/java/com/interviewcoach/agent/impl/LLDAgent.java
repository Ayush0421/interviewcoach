package com.interviewcoach.agent.impl;

import com.interviewcoach.agent.InterviewAgent;
import com.interviewcoach.agent.PromptBuilder;
import com.interviewcoach.model.ChatMessage;
import com.interviewcoach.model.Session;
import com.interviewcoach.service.GeminiClientService;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class LLDAgent implements InterviewAgent {

    private final GeminiClientService gemini;
    private final PromptBuilder promptBuilder;

    public LLDAgent(GeminiClientService gemini, PromptBuilder promptBuilder) {
        this.gemini = gemini;
        this.promptBuilder = promptBuilder;
    }

    @Override
    public String getAgentName() {
        return "LLD";
    }

    @Override
    public String respond(String input, Session session, String retrievedContext) {
        String systemPrompt = promptBuilder.buildSystemPrompt(session, getAgentName(), retrievedContext);
        
        List<Map<String, Object>> contents = new ArrayList<>();
        for (ChatMessage msg : session.getHistory()) {
            Map<String, Object> contentMsg = new HashMap<>();
            contentMsg.put("role", msg.getRole());
            contentMsg.put("parts", List.of(Map.of("text", msg.getContent())));
            contents.add(contentMsg);
        }
        return gemini.generateChatResponse(systemPrompt, contents);
    }
}
