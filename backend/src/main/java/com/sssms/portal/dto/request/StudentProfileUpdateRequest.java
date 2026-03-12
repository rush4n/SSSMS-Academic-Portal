package com.sssms.portal.dto.request;

import lombok.Data;
import java.time.LocalDate;
import com.sssms.portal.entity.AcademicYear;
import com.sssms.portal.entity.AdmissionCategory;

@Data
public class StudentProfileUpdateRequest {
    private String firstName;
    private String middleName;
    private String lastName;
    private String phoneNumber;
    private String parentPhoneNumber;
    private String address;
    private LocalDate dob;
    private String coaEnrollmentNo;
    private String grNo;
    private String aadharNo;
    private String abcId;
    private String bloodGroup;
    private AcademicYear academicYear;
    private AdmissionCategory admissionCategory;
}

