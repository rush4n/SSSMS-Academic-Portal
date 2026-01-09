package com.sssms.portal.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;

@Service
public class ResultParserService {

    public List<Map<String, Object>> parsePdf(String filePath) {
        try {
            ProcessBuilder pb = new ProcessBuilder(
                "python3",
                "/app/result_parser.py",
                filePath
            );
            pb.redirectErrorStream(true);

            Process process = pb.start();

            // Read output
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }

            process.waitFor();

            System.out.println("PYTHON OUTPUT: " + output.toString()); // Debugging

            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(output.toString(), new TypeReference<List<Map<String, Object>>>() {});

        } catch (Exception e) {
            throw new RuntimeException("Python execution failed: " + e.getMessage());
        }
    }
}