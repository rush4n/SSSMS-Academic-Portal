//check

package com.sssms.portal.service;

import com.sssms.portal.dto.request.AcademicMarksRequest;
import com.sssms.portal.entity.*;
import com.sssms.portal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GradingService {

    private final AcademicMarksRepository marksRepository;
    private final StudentRepository studentRepository;
    private final SubjectAllocationRepository allocationRepository;
    private final SubjectAllocationRepository subjectAllocationRepository;

    @Transactional
    public void saveBatchMarks(List<AcademicMarksRequest> requests) {
        for (AcademicMarksRequest req : requests) {
            Student student = studentRepository.findById(req.getStudentId()).orElseThrow();

            SubjectAllocation allocation = allocationRepository.findById(req.getAllocationId()).orElseThrow();
            Subject subject = allocation.getSubject();

            AcademicMarks mark = AcademicMarks.builder()
                    .student(student)
                    .subject(subject)
                    .examType(req.getExamType())
                    .marksObtained(req.getMarks())
                    .maxMarks(req.getMaxMarks())
                    .build();

            marksRepository.save(mark);
        }
    }

    public List<Map<String, Object>> generateReportCard(Long studentId) {
        Student student = studentRepository.findById(studentId).orElseThrow();

        List<AcademicMarks> allMarks = marksRepository.findByStudentId(studentId);

        Map<Subject, List<AcademicMarks>> marksBySubject = allMarks.stream()
                .collect(Collectors.groupingBy(AcademicMarks::getSubject));

        List<Map<String, Object>> reportCard = new ArrayList<>();

        for (Map.Entry<Subject, List<AcademicMarks>> entry : marksBySubject.entrySet()) {
            Subject subject = entry.getKey();
            List<AcademicMarks> subjectMarks = entry.getValue();

            Map<String, Object> subjectReport = calculateFinalResult(subjectMarks);
            subjectReport.put("subjectName", subject.getName());
            subjectReport.put("subjectCode", subject.getCode());

            reportCard.add(subjectReport);
        }
        return reportCard;
    }

    private Map<String, Object> calculateFinalResult(List<AcademicMarks> marks) {
        List<Double> unitTests = marks.stream()
                .filter(m -> m.getExamType().name().startsWith("UNIT_TEST"))
                .map(AcademicMarks::getMarksObtained)
                .sorted(Collections.reverseOrder())
                .collect(Collectors.toList());

        double utTotal = 0;
        if (unitTests.size() >= 2) utTotal = (unitTests.get(0) + unitTests.get(1)) / 2.0; // Average of Best 2
        else if (!unitTests.isEmpty()) utTotal = unitTests.get(0);

        double assignmentTotal = marks.stream()
                .filter(m -> m.getExamType() == ExamType.ASSIGNMENT)
                .mapToDouble(AcademicMarks::getMarksObtained)
                .sum();

        double eseTheory = marks.stream()
                .filter(m -> m.getExamType() == ExamType.THEORY_ESE)
                .mapToDouble(AcademicMarks::getMarksObtained)
                .findFirst().orElse(0.0);

        Map<String, Object> result = new HashMap<>();
        result.put("internalMarks", utTotal + assignmentTotal);
        result.put("externalMarks", eseTheory);
        result.put("total", utTotal + assignmentTotal + eseTheory);

        return result;
    }
}