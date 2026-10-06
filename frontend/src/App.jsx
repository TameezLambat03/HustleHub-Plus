import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Gigs from './pages/Gigs/Gigs'
import CreateGig from './pages/Gigs/CreateGig'
import GigDetails from './pages/Gigs/GigDetails'
import Bookings from './pages/Bookings/Bookings'
import MyServices from './pages/Gigs/MyServices'
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
         <Route path="/bookings" element={<Bookings />} />
         <Route path="/my-services" element={<MyServices />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App