package com.sssms.portal.controller;

import com.sssms.portal.service.FeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/fees")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class FeeController {

    private final FeeService feeService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllFees() {
        return ResponseEntity.ok(feeService.getAllFeeRecords());
    }

    @PostMapping("/init")
    public ResponseEntity<?> initializeFee(@RequestBody Map<String, Object> payload) {
        Long studentId = Long.valueOf(payload.get("studentId").toString());
        double amount = Double.parseDouble(payload.get("amount").toString());
        feeService.initializeFee(studentId, amount);
        return ResponseEntity.ok("Fee Initialized");
    }

    @PostMapping("/pay")
    public ResponseEntity<?> recordPayment(@RequestBody Map<String, Object> payload) {
        Long studentId = Long.valueOf(payload.get("studentId").toString());
        double amount = Double.parseDouble(payload.get("amount").toString());
        feeService.recordPayment(studentId, amount);
        return ResponseEntity.ok("Payment Recorded");
    }
}