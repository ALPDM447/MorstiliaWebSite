import { Outlet, Route, Routes, Navigate } from 'react-router-dom'
import heroImg from './assets/mc-logo.png'
import Navbar from './Navbar'
import About from './pages/about/About'
import Blog from './pages/blog/Blog'
import Engines from './pages/engines/Engines'
import './App.css'

function Home() {
  return (
    <section id="center">
      <div className="hero">
        <img src={heroImg} className="base" alt="Morstilia Logo" />
      </div>
      <div>
        <h1>Morstilia</h1>
        <h2 className="tagline">python open-source chess engine</h2>
        <p className="description">
          A powerful chess engine written in Python for developers and enthusiasts
        </p>
      </div>
      <a
        href="https://github.com/ALPDM447/MorstiliaChessEngine/releases"
        className="download-btn"
      >
        Download
      </a>
    </section>
  )
}

function SiteShell() {
  return (
    <div className="site-wrapper">
      <Navbar />
      <main className="site-content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="contact-bubbles">
          <a href="mailto:morstilia@gmail.com" className="bubble" title="Email">
            <img src="./src/assets/images/gmail-logo.png" alt="Email" className="bubble-icon" />
          </a>
          <a href="https://github.com/ALPDM447/MorstiliaChessEngine" className="bubble" title="GitHub">
            <img src="./src/assets/images/github-logo.png" alt="GitHub" className="bubble-icon" />
          </a>
          <a href="https://instagram.com" className="bubble" title="Instagram">
            <img src="./src/assets/images/instagram-logo.png" alt="Instagram" className="bubble-icon" />
          </a>
        </div>
        <p>&copy; 2026 Morstilia. All rights reserved.</p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route element={<SiteShell />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="blog" element={<Blog />} />
        <Route path="engines" element={<Engines />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
