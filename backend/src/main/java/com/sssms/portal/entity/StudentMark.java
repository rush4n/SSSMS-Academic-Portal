package com.sssms.portal.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "student_marks")
public class StudentMark {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "assessment_id") private Assessment assessment;
    @ManyToOne @JoinColumn(name = "student_id") private Student student;
    private double marksObtained;
}