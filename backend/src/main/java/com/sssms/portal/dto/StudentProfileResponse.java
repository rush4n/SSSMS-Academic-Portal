package com.sssms.portal.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class StudentProfileResponse {

    private String firstName;
    private String lastName;
    private String email;
    private String prn;
    private String department;
    private String currentYear;
    private String phoneNumber;
    private String address;
    private LocalDate dob;

    private double overallAttendance;
    private double cgpa;
}