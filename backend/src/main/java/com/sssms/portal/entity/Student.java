package com.sssms.portal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "student_profiles")
public class Student {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(unique = true, nullable = false)
    private String prn;

    @Enumerated(EnumType.STRING)
    private AcademicYear academicYear;

    private String firstName;
    private String middleName;
    private String lastName;

    private LocalDate dob;
    private String phoneNumber;
    private String address;

    private String coaEnrollmentNo;
    private String grNo;
    private String aadharNo;
    private String abcId;
    private String bloodGroup;
    private String parentPhoneNumber;

    @Enumerated(EnumType.STRING)
    private AdmissionCategory admissionCategory;

    private boolean scholarshipApplied;

    @ManyToMany(fetch = FetchType.EAGER)
        @JoinTable(
            name = "student_extra_courses",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "allocation_id")
        )
        @Builder.Default
        private Set<SubjectAllocation> extraCourses = new HashSet<>();
}
