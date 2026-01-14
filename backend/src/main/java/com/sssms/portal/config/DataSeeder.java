package com.sssms.portal.config;

import com.sssms.portal.entity.*;
import com.sssms.portal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final YearMetadataRepository yearRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final FacultyRepository facultyRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // 1. Seed Years
        if (yearRepository.count() == 0) {
            Arrays.stream(AcademicYear.values()).forEach(year -> {
                yearRepository.save(YearMetadata.builder().id(year).build());
            });
            System.out.println("DataSeeder: Academic Years Initialized");
        }

        // 2. Seed Subjects
        if (subjectRepository.count() == 0) {
            subjectRepository.save(Subject.builder().name("History of Architecture").code("ARC-101").academicYear(AcademicYear.FIRST_YEAR).build());
            subjectRepository.save(Subject.builder().name("Design Basics").code("ARC-102").academicYear(AcademicYear.FIRST_YEAR).build());
            subjectRepository.save(Subject.builder().name("Urban Planning").code("ARC-301").academicYear(AcademicYear.THIRD_YEAR).build());
            System.out.println("DataSeeder: Subjects Created");
        }

        // 3. Seed Users
        if (userRepository.count() == 0) {

            User admin = User.builder()
                    .email("admin@sssms.edu")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .isActive(true)
                    .build();
            userRepository.save(admin);
            System.out.println("DataSeeder: Admin Created");

            User facultyUser1 = User.builder()
                    .email("faculty@sssms.edu")
                    .passwordHash(passwordEncoder.encode("faculty123"))
                    .role(Role.FACULTY)
                    .isActive(true)
                    .build();
            userRepository.save(facultyUser1);

            Faculty facultyProfile1 = Faculty.builder()
                    .user(facultyUser1)
                    .firstName("Alice")
                    .lastName("Johnson")
                    .department("Architecture")
                    .designation("Senior Professor")
                    .qualification("M.Arch")
                    .phoneNumber("9876543210")
                    .joiningDate(LocalDate.of(2015, 6, 1))
                    .coaRegistrationNo("COA/2015/12345")
                    .coaValidFrom(LocalDate.of(2015, 1, 1))
                    .coaValidTill(LocalDate.of(2030, 12, 31))
                    .aadharNo("1234-5678-9012")
                    .panCardNo("ABCDE1234F")
                    .build();
            facultyRepository.save(facultyProfile1);

            User studentUser1 = User.builder()
                    .email("student@sssms.edu")
                    .passwordHash(passwordEncoder.encode("student123"))
                    .role(Role.STUDENT)
                    .isActive(true)
                    .build();
            userRepository.save(studentUser1);

            Student studentProfile1 = Student.builder()
                    .user(studentUser1)
                    .firstName("Bob")
                    .middleName("James")
                    .lastName("Williams")
                    .prn("ARC2024001")
                    .academicYear(AcademicYear.FIRST_YEAR)
                    .dob(LocalDate.of(2004, 5, 15))
                    .phoneNumber("9988776655")
                    .address("123 College Road, Solapur")
                    .coaEnrollmentNo("COA-S-2024-001")
                    .grNo("GR-2024-101")
                    .aadharNo("9876-5432-1098")
                    .abcId("ABC-123-456")
                    .bloodGroup("O+")
                    .parentPhoneNumber("8877665544")
                    .admissionCategory(AdmissionCategory.CAP_ROUND_1)
                    .scholarshipApplied(false)
                    .build();
            studentRepository.save(studentProfile1);

            System.out.println("DataSeeder: Users & Profiles Created with Full Details");
        }
    }
}