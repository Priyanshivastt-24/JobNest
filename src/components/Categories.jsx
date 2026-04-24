import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'

const Categories = () => {
  const [categories, setCategories] = useState([])

  const fallbackCategories = [
    { name: 'Engineering', icon: '⚙️', count: 0 },
    { name: 'Design', icon: '🎨', count: 0 },
    { name: 'Marketing', icon: '📈', count: 0 },
    { name: 'Finance', icon: '💰', count: 0 }
  ]

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/jobs/categories')
        setCategories(res.data.length > 0 ? res.data : fallbackCategories)
      } catch {
        setCategories(fallbackCategories)
      }
    }
    fetchCategories()
  }, [])

  const display = categories.length > 0 ? categories : fallbackCategories

  return (
    <section className="categories">
      <div className="section-header">
        <h2>Popular Categories</h2>
        <Link to="/jobs">View All →</Link>
      </div>
      <div className="category-grid">
        {display.map(cat => (
          <Link to={`/jobs?category=${cat.name}`} key={cat.name} className="card">
            {cat.icon} {cat.name}
            <span>{cat.count}+ positions</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Categories
