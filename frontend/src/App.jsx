import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/auth/login'
import Signup from './pages/auth/signup'


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
