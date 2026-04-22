import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import CarbonCalculator from './pages/CarbonCalculator'
import Leaderboard from './pages/Leaderboard'
import Home from './pages/Home'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="carbon" element={<CarbonCalculator />} />
          <Route path="leaderboard" element={<Leaderboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
