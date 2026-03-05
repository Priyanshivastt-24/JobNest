import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const categoryIcons = {
  'Engineering': '⚙️',
  'Design': '🎨',
  'Marketing': '📈',
  'Finance': '💰',
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/jobs/categories')
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="categories">
        <div className="section-header">
          <h2>Popular Categories</h2>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="categories">
      <div className="section-header">
        <h2>Popular Categories</h2>
        <Link to="/jobs">View All →</Link>
      </div>
      <div className="category-grid">
        {categories.map((cat) => (
          <Link to={`/jobs?category=${cat.name}`} key={cat.name} className="card">
            {categoryIcons[cat.name] || '📁'} {cat.name}
            <span>{cat.count}+ positions</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Categories
