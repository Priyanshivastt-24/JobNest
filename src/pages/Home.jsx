import { useEffect } from 'react'
import Hero from '../components/Hero'
import Trusted from '../components/Trusted'
import Categories from '../components/Categories'
import WhyJobNest from '../components/WhyJobNest'
import FeaturedJobs from '../components/FeaturedJobs'

export default function Home() {
    useEffect(() => {
        document.documentElement.classList.add('snap-active');
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        return () => {
            document.documentElement.classList.remove('snap-active');
        };
    }, []);

    return (
        <div className="snap-container">
            <div className="snap-slide">
                <Hero />
                <Trusted />
            </div>
            <div className="snap-slide">
                <Categories />
            </div>
            <div className="snap-slide">
                <WhyJobNest />
            </div>
            <div className="snap-slide">
                <FeaturedJobs />
            </div>
        </div>
    )
}
