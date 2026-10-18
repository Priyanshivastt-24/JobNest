package com.jobnest.dto;

public class ApplicationRequest {
    private String jobId;
    private String coverLetter;

    public ApplicationRequest() {}

    public ApplicationRequest(String jobId, String coverLetter) {
        this.jobId = jobId;
        this.coverLetter = coverLetter;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }
}
