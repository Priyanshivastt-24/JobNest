package com.jobnest.repository;

import com.jobnest.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface JobRepository extends JpaRepository<Job, String> {

    List<Job> findByPostedByOrderByCreatedAtDesc(String postedBy);

    List<Job> findTop6ByOrderByCreatedAtDesc();

    List<Job> findAllByOrderByCreatedAtDesc();

    @Query("SELECT j FROM Job j WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           " LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(j.company) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(j.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:location IS NULL OR :location = '' OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:category IS NULL OR :category = '' OR LOWER(j.category) = LOWER(:category)) AND " +
           "(:type IS NULL OR :type = '' OR LOWER(j.type) = LOWER(:type)) " +
           "ORDER BY j.createdAt DESC")
    List<Job> searchJobs(
            @Param("search") String search,
            @Param("location") String location,
            @Param("category") String category,
            @Param("type") String type
    );

    @Query("SELECT j.category AS name, COUNT(j) AS count FROM Job j GROUP BY j.category")
    List<Map<String, Object>> getCategoryCounts();
}
