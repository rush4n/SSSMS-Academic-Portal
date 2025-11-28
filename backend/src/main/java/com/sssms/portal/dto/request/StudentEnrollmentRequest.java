package com.sssms.portal.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class StudentEnrollmentRequest {
    // Auth Info
    private String email;
    private String password;

    // Profile Info
    private String firstName;
    private String lastName;
    private String prn;
    private String phoneNumber;
    private String address;
    private String department;
    private int currentYear;
    private LocalDate dob;
}