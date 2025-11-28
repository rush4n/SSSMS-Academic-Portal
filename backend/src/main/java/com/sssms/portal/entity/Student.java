package com.sssms.portal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "student_profiles")
public class Student {

    @Id
    private Long id; // This will share the same ID as the User table

    @OneToOne
    @MapsId // This links the PK of Student to the PK of User (Shared Primary Key)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(unique = true, nullable = false)
    private String prn; // Permanent Registration Number

    private String firstName;
    private String lastName;

    private LocalDate dob;
    private String phoneNumber;
    private String address;
    private String department; // e.g., "Architecture", "Interior Design"
    private int currentYear;   // 1, 2, 3, 4, 5
}
