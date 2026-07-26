import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Expressions from './pages/Expressions.jsx'
import Expression from './pages/Expression.jsx'
import Gallery from './pages/Gallery.jsx'
import Register from './pages/Register.jsx'
import Contact from './pages/Contact.jsx'
import Give from './pages/Give.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/expressions" element={<Expressions />} />
          {/* Dynamic expression template — :slug will select the CMS record once wired */}
          <Route path="/expression" element={<Expression />} />
          <Route path="/expression/:slug" element={<Expression />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/give" element={<Give />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
