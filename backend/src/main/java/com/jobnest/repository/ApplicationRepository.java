package com.jobnest.repository;

import com.jobnest.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, String> {

    List<Application> findByApplicantIdOrderByAppliedAtDesc(String applicantId);

    List<Application> findByJobIdOrderByAppliedAtDesc(String jobId);

    Optional<Application> findByJobIdAndApplicantId(String jobId, String applicantId);

    boolean existsByJobIdAndApplicantId(String jobId, String applicantId);
}
