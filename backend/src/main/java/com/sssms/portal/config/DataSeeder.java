package com.sssms.portal.config;

import com.sssms.portal.entity.ClassBatch;
import com.sssms.portal.entity.Subject;
import com.sssms.portal.repository.ClassBatchRepository;
import com.sssms.portal.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ClassBatchRepository classRepository;
    private final SubjectRepository subjectRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only seed if empty to prevent duplicates
        if (classRepository.count() == 0) {
            classRepository.save(ClassBatch.builder().batchName("Second Year B.Arch").division("A").academicYear(2025).currentSemester(3).build());
            classRepository.save(ClassBatch.builder().batchName("Third Year B.Arch").division("A").academicYear(2025).currentSemester(5).build());
            System.out.println("✅ DataSeeder: Classes Created");
        }

        if (subjectRepository.count() == 0) {
            subjectRepository.save(Subject.builder().name("History of Architecture").code("ARC-201").semester(3).department("Architecture").build());
            subjectRepository.save(Subject.builder().name("Building Construction").code("ARC-202").semester(3).department("Architecture").build());
            System.out.println("✅ DataSeeder: Subjects Created");
        }
    }
}