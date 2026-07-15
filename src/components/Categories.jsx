import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const categoryData = [
  { name: 'Engineering',  icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  { name: 'Design',       icon: 'M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z' },
  { name: 'Marketing',    icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
  { name: 'Finance',      icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
  { name: 'Management',   icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
  { name: 'Healthcare',   icon: 'M22 12h-4l-3 9L9 3l-3 9H2' },
  { name: 'Education',    icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z' },
  { name: 'Sales',        icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/jobs/categories')
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const getCategoryIcon = (name) => {
    const found = categoryData.find(c => c.name === name);
    return found ? found.icon : 'M12 2L2 7l10 5 10-5-10-5z';
  };

  if (loading) {
    return (
      <section className="categories">
        <div className="section-header-centered">
          <h2>Popular Category</h2>
          <p className="subtitle">Explore active jobs across high-demand business domains</p>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="categories" className="categories">
      <div className="section-header-centered">
        <h2>Popular Category</h2>
        <p className="subtitle">Explore active jobs across high-demand business domains</p>
      </div>
      <div className="category-grid">
        {categories.map((cat) => (
          <Link to={`/jobs?category=${cat.name}`} key={cat.name} className="category-card-pill">
            <div className="cat-icon-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={getCategoryIcon(cat.name)} />
              </svg>
            </div>
            <div className="cat-text">
              <span className="cat-name">{cat.name}</span>
              <span className="cat-count">{cat.count} open positions</span>
            </div>
            <svg className="cat-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Categories
