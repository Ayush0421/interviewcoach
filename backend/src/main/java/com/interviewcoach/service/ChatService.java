package com.interviewcoach.service;

import com.interviewcoach.agent.AgentRouter;
import com.interviewcoach.agent.HintEngine;
import com.interviewcoach.agent.InterviewAgent;
import com.interviewcoach.model.ChatMessage;
import com.interviewcoach.model.ChatResponse;
import com.interviewcoach.model.Session;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatService {

    private final AgentRouter agentRouter;
    private final HintEngine hintEngine;
    private final MemoryService memoryService;
    private final Map<String, Session> activeSessions = new ConcurrentHashMap<>();

    public ChatService(AgentRouter agentRouter, HintEngine hintEngine, MemoryService memoryService) {
        this.agentRouter = agentRouter;
        this.hintEngine = hintEngine;
        this.memoryService = memoryService;
    }

    public Session getOrCreateSession(String sessionId) {
        if (sessionId == null || sessionId.trim().isEmpty()) {
            sessionId = UUID.randomUUID().toString();
        }
        return activeSessions.computeIfAbsent(sessionId, id -> {
            Session s = new Session();
            s.setSessionId(id);
            return s;
        });
    }

    public ChatResponse processChat(String sessionId, String message, String mode, int hintLevel) {
        Session session = getOrCreateSession(sessionId);
        
        if (mode != null && !mode.isEmpty()) {
            session.setCurrentMode(mode);
        }
        session.setHintLevel(hintLevel);

        session.getHistory().add(new ChatMessage("user", message, LocalDateTime.now()));

        // RAG Context Retrieval
        String context = memoryService.searchTopRelevantContext(message);

        // Routing
        InterviewAgent activeAgent = agentRouter.route(message);

        // Generate
        String reply = activeAgent.respond(message, session, context);

        session.getHistory().add(new ChatMessage("model", reply, LocalDateTime.now()));

        return new ChatResponse(reply, session.getHintLevel(), activeAgent.getAgentName());
    }

    public int incrementHint(String sessionId) {
        return hintEngine.incrementHintLevel(getOrCreateSession(sessionId));
    }

    public int resetHint(String sessionId) {
        Session session = getOrCreateSession(sessionId);
        hintEngine.resetHintLevel(session);
        return session.getHintLevel();
    }
}
