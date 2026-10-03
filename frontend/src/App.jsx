import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Gigs from './pages/Gigs'
import CreateGig from './pages/CreateGig'
import GigDetails from './pages/GigDetails'
function App() {
  return (
    <BrowserRouter>

      <Navbar />

     {/* routes are added here*/}
      <Routes>
        <Route path="/" element={<Home />} />
         <Route path="/login" element={<Login />} />
         <Route path="/Register" element={<Register />} />
         <Route path="/gigs" element={<Gigs />} />
         <Route path="/offer-service" element={<CreateGig />} />
         <Route path="/gigs/:id" element={<GigDetails />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App