package com.interviewcoach.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiClientService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String chatUrl;

    private static final String EMBED_URL = "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent";

    private final RestTemplate restTemplate = new RestTemplate();

    public float[] generateEmbedding(String text) {
        if ("PLACEHOLDER_KEY".equals(apiKey) || apiKey == null || apiKey.isEmpty()) {
            return new float[768]; // return mock dimensions
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> modelMap = new HashMap<>();
        Map<String, Object> contentMap = new HashMap<>();
        Map<String, Object> partsMap = new HashMap<>();
        partsMap.put("text", text);
        contentMap.put("parts", List.of(partsMap));
        modelMap.put("content", contentMap);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(modelMap, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(EMBED_URL + "?key=" + apiKey, entity, Map.class);
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("embedding")) {
                Map<String, Object> embeddingNode = (Map<String, Object>) body.get("embedding");
                List<Double> values = (List<Double>) embeddingNode.get("values");
                float[] result = new float[values.size()];
                for (int i = 0; i < values.size(); i++) {
                    result[i] = values.get(i).floatValue();
                }
                return result;
            }
        } catch (Exception e) {
            System.err.println("Embedding error: " + e.getMessage());
        }
        return new float[768];
    }

    public String generateChatResponse(String systemPrompt, List<Map<String, Object>> contents) {
        if ("PLACEHOLDER_KEY".equals(apiKey) || apiKey == null || apiKey.isEmpty()) {
            return "Mock AI Response because API key is missing.";
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> systemInstruction = new HashMap<>();
        Map<String, Object> systemParts = new HashMap<>();
        systemParts.put("text", systemPrompt);
        systemInstruction.put("parts", systemParts);
        
        requestBody.put("system_instruction", systemInstruction);
        requestBody.put("contents", contents);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(chatUrl + "?key=" + apiKey, entity, Map.class);
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> candidate = candidates.get(0);
                    Map<String, Object> content = (Map<String, Object>) candidate.get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    return (String) parts.get(0).get("text");
                }
            }
            return "No valid response generated.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error calling AI Chat API: " + e.getMessage();
        }
    }
}
