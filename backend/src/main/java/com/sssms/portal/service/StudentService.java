package com.sssms.portal.service;

import com.sssms.portal.dto.request.StudentAttendanceDTO;
import com.sssms.portal.entity.*;
import com.sssms.portal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.sssms.portal.repository.ExamResultRepository;
import com.sssms.portal.entity.ExamResult;
import com.sssms.portal.dto.StudentProfileResponse;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final SubjectAllocationRepository allocationRepository;
    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceRecordRepository recordRepository;
    private final ExamResultRepository examResultRepository;

    public StudentProfileResponse getProfile(Long userId) {
            Student student = studentRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            // 1. Calculate Overall Attendance
            List<StudentAttendanceDTO> attendanceList = getMyAttendance(userId);
            double avgAttendance = attendanceList.isEmpty() ? 0.0 :
                attendanceList.stream().mapToDouble(StudentAttendanceDTO::getPercentage).average().orElse(0.0);

            // 2. Fetch Real CGPA from Exam Results
            List<ExamResult> results = examResultRepository.findByStudentId(userId);

            double cgpa = 0.0;
            if (!results.isEmpty()) {
                double totalSgpa = results.stream().mapToDouble(ExamResult::getSgpa).sum();
                cgpa = totalSgpa / results.size(); // Simple Average of all SGPA records
            }

            return StudentProfileResponse.builder()
                    .firstName(student.getFirstName())
                    .lastName(student.getLastName())
                    .email(student.getUser().getEmail())
                    .prn(student.getPrn())
                    .department(student.getDepartment())
                    .currentYear(student.getCurrentYear())
                    .phoneNumber(student.getPhoneNumber())
                    .address(student.getAddress())
                    .dob(student.getDob())
                    .overallAttendance(Math.round(avgAttendance * 10.0) / 10.0)
                    .cgpa(Math.round(cgpa * 100.0) / 100.0) // Round to 2 decimals
                    .build();
        }

    public List<StudentAttendanceDTO> getMyAttendance(Long userId) {
            Student student = studentRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Student profile not found"));

            // 1. Find all raw allocations for the student's year
            List<SubjectAllocation> rawAllocations = allocationRepository.findAll().stream()
                    .filter(a -> a.getClassBatch().getCurrentSemester() == student.getCurrentYear())
                    .toList();

            // 2. Use a Map to Group by Subject Code to prevent duplicates
            java.util.Map<String, StudentAttendanceDTO> subjectMap = new java.util.HashMap<>();

            for (SubjectAllocation allocation : rawAllocations) {
                String code = allocation.getSubject().getCode();
                String name = allocation.getSubject().getName();

                // Calculate stats for THIS specific allocation
                List<AttendanceSession> sessions = sessionRepository.findAll().stream()
                        .filter(s -> s.getAllocation().getId().equals(allocation.getId()))
                        .toList();

                int sessionCount = sessions.size();

                long attendedCount = recordRepository.findAll().stream()
                        .filter(r -> r.getStudent().getId().equals(student.getId())
                                  && r.getSession().getAllocation().getId().equals(allocation.getId())
                                  && r.getStatus() == AttendanceStatus.PRESENT)
                        .count();

                // Merge into the Map
                if (subjectMap.containsKey(code)) {
                    // If subject exists, add to the totals
                    StudentAttendanceDTO existing = subjectMap.get(code);
                    existing.setTotalSessions(existing.getTotalSessions() + sessionCount);
                    existing.setAttendedSessions(existing.getAttendedSessions() + (int) attendedCount);
                } else {
                    // New subject, create entry
                    StudentAttendanceDTO dto = StudentAttendanceDTO.builder()
                            .subjectName(name)
                            .subjectCode(code)
                            .totalSessions(sessionCount)
                            .attendedSessions((int) attendedCount)
                            .percentage(0.0) // Will calculate at end
                            .build();
                    subjectMap.put(code, dto);
                }
            }

            // 3. Finalize Percentages and convert to List
            return subjectMap.values().stream().map(dto -> {
                double percent = (dto.getTotalSessions() == 0) ? 0 :
                        ((double) dto.getAttendedSessions() / dto.getTotalSessions()) * 100;
                dto.setPercentage(Math.round(percent * 10.0) / 10.0);
                return dto;
            }).collect(java.util.stream.Collectors.toList());
        }



    }