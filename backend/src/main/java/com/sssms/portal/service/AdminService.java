package com.sssms.portal.service;

import com.sssms.portal.dto.request.StudentEnrollmentRequest;
import com.sssms.portal.entity.Role;
import com.sssms.portal.entity.Student;
import com.sssms.portal.entity.User;
import com.sssms.portal.repository.StudentRepository;
import com.sssms.portal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional // Critical: If saving student fails, user is rolled back
    public String enrollStudent(StudentEnrollmentRequest request) {

        // 1. Create the User (Auth)
        User newUser = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.STUDENT)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(newUser);

        // 2. Create the Student Profile linked to User
        Student newStudent = Student.builder()
                .user(savedUser) // Link here
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .prn(request.getPrn())
                .department(request.getDepartment())
                .currentYear(request.getCurrentYear())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .dob(request.getDob())
                .build();

        studentRepository.save(newStudent);

        return "Student enrolled successfully with ID: " + savedUser.getUserId();
    }
}