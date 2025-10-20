import './styles/index.css'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ButtonShowcase from './components/ui/Botones'
import Dashboard from './pages/dashboard/Dashboard'
import Header from './components/layout/Header'

function App() {
  return (
    <>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/botones" element={<ButtonShowcase />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
