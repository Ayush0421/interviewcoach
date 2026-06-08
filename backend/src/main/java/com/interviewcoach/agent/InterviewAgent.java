package com.interviewcoach.agent;

import com.interviewcoach.model.Session;

public interface InterviewAgent {
    String getAgentName();
    String respond(String input, Session session, String retrievedContext);
}
