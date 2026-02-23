import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Trusted from './components/Trusted'
import Categories from './components/Categories'
import WhyJobNest from './components/WhyJobNest'
import FeaturedJobs from './components/FeaturedJobs'
import Footer from './components/Footer'
import './App.css'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    // Ensure page starts at top on every load/refresh
    window.scrollTo(0, 0);
    
    // Prevent browser scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <Trusted />
      <Categories />
      <WhyJobNest />
      <FeaturedJobs />
      <Footer />
    </>
  )
}

export default App
