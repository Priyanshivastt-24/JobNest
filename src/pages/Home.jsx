import { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Trusted from '../components/Trusted'
import Categories from '../components/Categories'
import WhyJobNest from '../components/WhyJobNest'
import FeaturedJobs from '../components/FeaturedJobs'
import Footer from '../components/Footer'

export default function Home() {
    useEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }, []);

    return (
        <>
            <Hero />
            <Trusted />
            <Categories />
            <WhyJobNest />
            <FeaturedJobs />
        </>
    )
}
