package com.sssms.portal.controller;

import com.sssms.portal.config.JwtUtil;
import com.sssms.portal.dto.AuthenticationRequest;
import com.sssms.portal.dto.RegisterRequest;
import com.sssms.portal.service.AuthService;
import com.sssms.portal.entity.User;
import com.sssms.portal.repository.UserRepository; // Temporary direct access for /me
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository; // To fetch full user details

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // We ignore the returned token from service for now, just register
        service.register(request);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {
        // 1. Authenticate (This validates password)
        UserDetails userDetails = service.authenticateForCookie(request);

        // 2. Generate Cookie
        ResponseCookie jwtCookie = jwtUtil.generateJwtCookie(userDetails);

        // 3. Return response with Set-Cookie Header
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body("Login successful");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie cleanCookie = jwtUtil.getCleanJwtCookie();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cleanCookie.toString())
                .body("You've been signed out!");
    }

    // React calls this on page load to check if logged in
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        // 1. Guard Clause: If no user, return 401 instead of crashing
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        // 2. Safe to proceed
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        return ResponseEntity.ok(Map.of(
                "email", user.getEmail(),
                "role", "ROLE_" + user.getRole().name(),
                "name", user.getEmail() // Placeholder for name
        ));
    }
}