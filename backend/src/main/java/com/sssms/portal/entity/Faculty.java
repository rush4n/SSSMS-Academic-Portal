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
@Table(name = "faculty_profiles")
public class Faculty {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String firstName;
    private String lastName;

    private String designation; // e.g., "Assistant Professor", "HOD"
    private String department;
    private String qualification; // e.g., "M.Arch"
    private String phoneNumber;
    private LocalDate joiningDate;
}