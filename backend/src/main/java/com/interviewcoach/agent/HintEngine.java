package com.interviewcoach.agent;

import com.interviewcoach.model.Session;
import org.springframework.stereotype.Component;

@Component
public class HintEngine {

    public int incrementHintLevel(Session session) {
        int currentLevel = session.getHintLevel();
        if (currentLevel < 3) {
            session.setHintLevel(currentLevel + 1);
        }
        return session.getHintLevel();
    }

    public void resetHintLevel(Session session) {
        session.setHintLevel(0);
    }
}
