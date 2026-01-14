package com.sssms.portal.dto.request;

import lombok.Data;
import java.time.LocalDate;
import com.sssms.portal.entity.AcademicYear;

@Data
public class StudentEnrollmentRequest {

    private String email;
    private String password;

    private String firstName;
    private String middleName;
    private String lastName;
    private String prn;
    private String phoneNumber;
    private String address;
    private String department;
    private int currentYear;
    private LocalDate dob;
    private AcademicYear academicYear;
    private String coaEnrollmentNo;
    private String grNo;
    private String aadharNo;
    private String abcId;
    private String bloodGroup;
    private String parentPhoneNumber;
    private com.sssms.portal.entity.AdmissionCategory admissionCategory;
}