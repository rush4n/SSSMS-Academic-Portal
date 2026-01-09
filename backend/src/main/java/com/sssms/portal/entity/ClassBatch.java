package com.sssms.portal.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "class_batches")
public class ClassBatch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String batchName;
    private String division;
    private int academicYear;
    private int currentSemester;
    private String timetablePdf;
    private String examSchedulePdf;
}