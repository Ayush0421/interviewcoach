package com.interviewcoach.service;

import com.interviewcoach.model.MemoryItem;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MemoryService {

    private final GeminiClientService geminiClient;
    private final List<MemoryItem> memoryStore = new ArrayList<>();

    public MemoryService(GeminiClientService geminiClient) {
        this.geminiClient = geminiClient;
    }

    public void addMemory(String type, String content) {
        float[] embedding = geminiClient.generateEmbedding(content);
        MemoryItem item = MemoryItem.builder()
                .type(type)
                .content(content)
                .embedding(embedding)
                .build();
        memoryStore.add(item);
    }

    public List<MemoryItem> getAllMemories() {
        return new ArrayList<>(memoryStore);
    }

    public String searchTopRelevantContext(String query) {
        if (memoryStore.isEmpty()) return "";

        float[] queryEmbedding = geminiClient.generateEmbedding(query);

        // Find top 3 by cosine similarity
        List<MemoryItem> topHits = memoryStore.stream()
                .sorted(Comparator.comparingDouble((MemoryItem m) -> -cosineSimilarity(m.getEmbedding(), queryEmbedding)))
                .limit(3)
                .collect(Collectors.toList());

        StringBuilder contextBuilder = new StringBuilder();
        for (MemoryItem item : topHits) {
            contextBuilder.append("[").append(item.getType().toUpperCase()).append("] ").append(item.getContent()).append("\n");
        }
        return contextBuilder.toString();
    }

    private double cosineSimilarity(float[] vectorA, float[] vectorB) {
        if (vectorA == null || vectorB == null || vectorA.length != vectorB.length) return 0.0;
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;
        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += Math.pow(vectorA[i], 2);
            normB += Math.pow(vectorB[i], 2);
        }
        if (normA == 0.0 || normB == 0.0) return 0.0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}
