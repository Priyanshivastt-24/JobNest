const features = [
  {
    number: '01',
    title: 'Verified Companies',
    description: 'Every employer is thoroughly vetted for legitimacy and quality, ensuring you only connect with trusted, reputable organizations.',
    icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z',
  },
  {
    number: '02',
    title: 'Smart Job Matching',
    description: 'Our AI-driven platform analyses your profile and preferences to surface the most relevant opportunities, saving you time and effort.',
    icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  },
  {
    number: '03',
    title: 'Fast Applications',
    description: 'Apply to multiple positions with a single profile. Pre-filled forms and one-click submissions dramatically increase interview rates.',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    number: '04',
    title: 'Salary Transparency',
    description: 'Access real-time compensation benchmarks and negotiate with confidence using clear, reliable salary data from across the market.',
    icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  },
];

const WhyJobNest = () => (
  <section className="why">
    <div className="why-inner">
      <div className="why-left">
        <span className="section-label">WHY CHOOSE US</span>
        <h2>The Smart Way to<br />Find Your Next Role</h2>
        <p>
          JobNest is built for professionals who value their time. From curated listings
          to intelligent matching, every feature is designed to accelerate your career journey.
        </p>
        <div className="why-left-stats">
          <div className="why-stat">
            <strong>50K+</strong>
            <span>Verified Employers</span>
          </div>
          <div className="why-stat">
            <strong>1.5M+</strong>
            <span>Jobs Listed</span>
          </div>
        </div>
      </div>
      <div className="why-right">
        {features.map((f) => (
          <div className="why-card" key={f.number}>
            <div className="why-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={f.icon} />
              </svg>
            </div>
            <div className="why-card-content">
              <div className="why-step">{f.number}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default WhyJobNest
