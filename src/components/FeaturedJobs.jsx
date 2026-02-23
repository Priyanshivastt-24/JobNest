const FeaturedJobs = () => (
  <section className="jobs">
    <div className="section-header">
      <h2>Featured Opportunities</h2>
      <a href="#">Browse All →</a>
    </div>
    <div className="job-grid">
      <div className="job-card">
        <h3>Staff Data Engineer</h3>
        <p>Quant Analytics • Palo Alto, CA</p>
        <span className="tag">FULL-TIME</span>
        <span className="salary">$180k – $240k</span>
        <button>Apply Now</button>
      </div>
      <div className="job-card">
        <h3>Senior Fintech Architect</h3>
        <p>Silverline Global • Remote</p>
        <span className="tag">REMOTE</span>
        <span className="salary">$160k – $210k</span>
        <button>Apply Now</button>
      </div>
      <div className="job-card">
        <h3>Head of Cyber Security</h3>
        <p>DefendCore • New York, NY</p>
        <span className="tag">ON-SITE</span>
        <span className="salary">$220k – $300k</span>
        <button>Apply Now</button>
      </div>
    </div>
  </section>
)

export default FeaturedJobs
