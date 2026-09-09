import { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ScrollToTop } from './components/ScrollToTop'
import { PageTransition } from './components/PageTransition'

const Home = lazy(() => import('./pages/Home'))
const Destinations = lazy(() => import('./pages/Destinations'))
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'))
const Experiences = lazy(() => import('./pages/Experiences'))
const Tours = lazy(() => import('./pages/Tours'))
const TourDetail = lazy(() => import('./pages/TourDetail'))
const Journal = lazy(() => import('./pages/Journal'))
const StoryDetail = lazy(() => import('./pages/StoryDetail'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Plan = lazy(() => import('./pages/Plan'))
const NotFound = lazy(() => import('./pages/NotFound'))

function RouteFallback() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex items-center gap-3 text-ink-500">
        <span className="size-2 animate-ping rounded-full bg-green-500" />
        <span className="text-sm font-medium">Loading…</span>
      </div>
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/destinations" element={<PageTransition><Destinations /></PageTransition>} />
        <Route path="/destinations/:slug" element={<PageTransition><DestinationDetail /></PageTransition>} />
        <Route path="/experiences" element={<PageTransition><Experiences /></PageTransition>} />
        <Route path="/tours" element={<PageTransition><Tours /></PageTransition>} />
        <Route path="/tours/:slug" element={<PageTransition><TourDetail /></PageTransition>} />
        <Route path="/journal" element={<PageTransition><Journal /></PageTransition>} />
        <Route path="/journal/:slug" element={<PageTransition><StoryDetail /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/plan" element={<PageTransition><Plan /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <AnimatedRoutes />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App
