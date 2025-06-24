import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PhotoUpload from './components/PhotoUpload'
import Navbar from './components/navbar'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import About from './components/Abouts'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="flex flex-col min-h-screen"> 
      <Router>
        <Navbar />
        <main className="flex-grow"> 
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <HowItWorks />
                <About />
              </>
            } />
            <Route path="/verify" element={<PhotoUpload />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  )
}

export default App
