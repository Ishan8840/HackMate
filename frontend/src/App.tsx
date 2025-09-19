import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Saved from './pages/Saved'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/saved' element={<Saved />} />
      </Routes>
    </Router>
  )
}

export default App
