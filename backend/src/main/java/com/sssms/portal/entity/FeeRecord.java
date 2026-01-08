package com.sssms.portal.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "fee_records")
public class FeeRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    private double totalFee;
    private double paidAmount;

    // Calculated field (Not in DB, handled by Logic) or Enum
    // We will use logic: status = (paid >= total) ? "PAID" : "PENDING"

    private LocalDateTime lastPaymentDate;
}