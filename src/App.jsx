import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './lib/ThemeContext.jsx'
import Landing from './pages/Landing.jsx'
import AppPage from './pages/AppPage.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/app" element={<AppPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
