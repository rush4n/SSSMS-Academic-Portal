package com.sssms.portal.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "class_assessments")
public class ClassAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "allocation_id")
    private SubjectAllocation allocation; // Links to the Subject/Class

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    private String examType; // "Internal", "Assignment", "Unit Test"
    private Double marksObtained;
    private Double maxMarks;
}