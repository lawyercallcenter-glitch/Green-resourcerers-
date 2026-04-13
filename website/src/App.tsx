import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import RequestForm from './pages/RequestForm'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/request" element={<RequestForm />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
