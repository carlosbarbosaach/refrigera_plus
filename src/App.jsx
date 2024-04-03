import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import MainContent from './components/Pages/MainContent/MainContent'
import GestaoContent from './components/Pages/Gestao/GestaoContent'
import EstoqueContent from './components/Pages/Estoque/EstoqueContent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
    
      <Header />
      <Routes>
      <Route path="/" element={<MainContent />} />
      <Route path="/gestao" element={<GestaoContent />} />
      <Route path="/estoque" element={<EstoqueContent />} />
      </Routes>
      <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
