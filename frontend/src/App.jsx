import { useState } from 'react'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

export function App() {
  const ProtectedRoute = ({children}) => {
    const xen_access_token = localStorage.getItem('xen_access_token');

    return xen_access_token ? children : <Navigate to='/login' />;
  }

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<LoginPage />}/>
        <Route path='/' element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }/>
      </Routes>
    </Router>
  )
}

export default App
