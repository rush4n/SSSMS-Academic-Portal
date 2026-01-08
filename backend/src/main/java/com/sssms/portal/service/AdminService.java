package com.sssms.portal.service;

import com.sssms.portal.dto.request.StudentEnrollmentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sssms.portal.dto.request.FacultyEnrollmentRequest;
import com.sssms.portal.dto.request.AllocationRequest;
import com.sssms.portal.entity.*;
import com.sssms.portal.repository.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final FacultyRepository facultyRepository;
    private final ClassBatchRepository classRepository;
    private final SubjectRepository subjectRepository;
    private final SubjectAllocationRepository allocationRepository;
    private final FeeRepository feeRepository;
    private final ExamResultRepository resultRepository;
    private final ResultParserService parserService;
    private final FileStorageService fileStorageService;

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
                .middleName(request.getMiddleName())
                .lastName(request.getLastName())
                .prn(request.getPrn())
                .department(request.getDepartment())
                .currentYear(request.getCurrentYear())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .dob(request.getDob())
                .build();

        studentRepository.save(newStudent);

        double defaultFee = 150000.0;

                FeeRecord feeRecord = FeeRecord.builder()
                        .student(newStudent)
                        .totalFee(defaultFee)
                        .paidAmount(0.0)
                        .build();

                feeRepository.save(feeRecord);

        return "Student enrolled successfully with ID: " + savedUser.getUserId();
    }

    @Transactional
        public String enrollFaculty(FacultyEnrollmentRequest request) {
            // 1. Create User
            User newUser = User.builder()
                    .email(request.getEmail())
                    .passwordHash(passwordEncoder.encode(request.getPassword()))
                    .role(Role.FACULTY) // Role is FACULTY
                    .isActive(true)
                    .build();

            User savedUser = userRepository.save(newUser);

            // 2. Create Profile
            Faculty newFaculty = Faculty.builder()
                    .user(savedUser)
                    .firstName(request.getFirstName())
                    .middleName(request.getMiddleName())
                    .lastName(request.getLastName())
                    .designation(request.getDesignation())
                    .department(request.getDepartment())
                    .qualification(request.getQualification())
                    .phoneNumber(request.getPhoneNumber())
                    .joiningDate(request.getJoiningDate())
                    .build();

            facultyRepository.save(newFaculty);

            return "Faculty enrolled successfully with ID: " + savedUser.getUserId();
        }

        public String allocateSubject(AllocationRequest request) {
                Faculty faculty = facultyRepository.findById(request.getFacultyId())
                        .orElseThrow(() -> new RuntimeException("Faculty not found"));

                Subject subject = subjectRepository.findById(request.getSubjectId())
                        .orElseThrow(() -> new RuntimeException("Subject not found"));

                ClassBatch classBatch = classRepository.findById(request.getClassId())
                        .orElseThrow(() -> new RuntimeException("Class not found"));

                SubjectAllocation allocation = SubjectAllocation.builder()
                        .faculty(faculty)
                        .subject(subject)
                        .classBatch(classBatch)
                        .build();

                allocationRepository.save(allocation);
                return "Subject Assigned Successfully!";
        }

        public void removeAllocation(Long allocationId) {
                allocationRepository.deleteById(allocationId);
            }

            public List<Map<String, Object>> getFacultyAllocations(Long facultyId) {
                List<SubjectAllocation> list = allocationRepository.findByFacultyId(facultyId);

                // Convert to DTO
                return list.stream().map(a -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", a.getId());
                    map.put("subjectName", a.getSubject().getName());
                    map.put("subjectCode", a.getSubject().getCode());
                    map.put("className", a.getClassBatch().getBatchName());
                    map.put("division", a.getClassBatch().getDivision());
                    return map;
                }).collect(Collectors.toList());
            }

        public List<Map<String, Object>> getAllFaculty() {
                return facultyRepository.findAll().stream().map(f -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", f.getId()); // This is the User ID you need
                    map.put("name", f.getFirstName() + " " + f.getLastName());
                    map.put("email", f.getUser().getEmail());
                    map.put("designation", f.getDesignation());
                    return map;
                }).collect(Collectors.toList());
        }

        public String processResultLedger(MultipartFile file) {
                // 1. Save PDF
                String fileName = fileStorageService.storeFile(file);
                String fullPath = "/uploads/" + fileName; // Path inside container

                // 2. Parse PDF via Python
                List<Map<String, Object>> data = parserService.parsePdf(fullPath);

                int count = 0;
                for (Map<String, Object> row : data) {
                    if (row.containsKey("error")) continue;

                    String prn = (String) row.get("prn");

                    // 3. Find Student
                    studentRepository.findByPrn(prn).ifPresent(student -> {
                        // 4. Save Result
                        ExamResult result = ExamResult.builder()
                                .student(student)
                                .sgpa(Double.parseDouble(row.get("sgpa").toString()))
                                .status((String) row.get("status"))
                                .examSession("Latest") // You can pass this as param later
                                .resultDate(java.time.LocalDate.now())
                                .build();
                        resultRepository.save(result);
                    });
                    count++;
                }
                return "Processed " + count + " records successfully.";
            }
}