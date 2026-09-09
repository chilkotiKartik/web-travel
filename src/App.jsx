import { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ScrollToTop } from './components/ScrollToTop'
import { PageTransition } from './components/PageTransition'
import { FloatingContact } from './components/FloatingContact'
import { ChatAssistant } from './components/ChatAssistant'
import { ScrollProgress } from './components/ScrollProgress'
import { CompareBar } from './components/CompareBar'

const Home = lazy(() => import('./pages/Home'))
const Destinations = lazy(() => import('./pages/Destinations'))
const DestinationDetail = lazy(() => import('./pages/DestinationDetail'))
const Experiences = lazy(() => import('./pages/Experiences'))
const Offers = lazy(() => import('./pages/Offers'))
const Tours = lazy(() => import('./pages/Tours'))
const TourDetail = lazy(() => import('./pages/TourDetail'))
const Journal = lazy(() => import('./pages/Journal'))
const StoryDetail = lazy(() => import('./pages/StoryDetail'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Plan = lazy(() => import('./pages/Plan'))
const CustomTrip = lazy(() => import('./pages/CustomTrip'))
const Compare = lazy(() => import('./pages/Compare'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Account = lazy(() => import('./pages/Account'))
const Admin = lazy(() => import('./pages/Admin'))
const NotFound = lazy(() => import('./pages/NotFound'))

function RouteFallback() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <span className="relative flex size-12 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-gradient-to-br from-blue-500 to-green-500 opacity-30" />
          <span className="relative flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-green-500 font-display text-sm font-extrabold text-white shadow-[0_8px_24px_-6px_rgba(19,97,224,0.5)]">
            W
          </span>
        </span>
        <span className="text-sm font-medium text-ink-500">Loading…</span>
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
        <Route path="/offers" element={<PageTransition><Offers /></PageTransition>} />
        <Route path="/tours" element={<PageTransition><Tours /></PageTransition>} />
        <Route path="/tours/:slug" element={<PageTransition><TourDetail /></PageTransition>} />
        <Route path="/journal" element={<PageTransition><Journal /></PageTransition>} />
        <Route path="/journal/:slug" element={<PageTransition><StoryDetail /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/plan" element={<PageTransition><Plan /></PageTransition>} />
        <Route path="/custom-trip" element={<PageTransition><CustomTrip /></PageTransition>} />
        <Route path="/compare" element={<PageTransition><Compare /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/account" element={<PageTransition><Account /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <AnimatedRoutes />
        </Suspense>
      </main>
      <Footer />
      <FloatingContact />
      <ChatAssistant />
      <CompareBar />
    </div>
  )
}

export default App
