// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from './services/supabase';
import Marketplace from './components/Marketplace';
import RegisterBusiness from './components/Business/RegisterBusiness';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UpdateProfile from './components/Business/UpdateProfile';
import NavBar from "./components/Navbar";
import Home from './pages/Home'; // Import the Home component

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        {/* Show NavBar only on authenticated pages, not on Home */}
        {user && <NavBar />}
        
        <Routes>
          {/* Home as landing page - accessible to everyone */}
          <Route path="/" element={<Home />} />
          
          {/* Public auth pages */}
          <Route 
            path="/login" 
            element={user ? <Navigate to="/marketplace" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/register-business" /> : <Register />} 
          />
          
          {/* Protected pages - require login */}
          <Route 
  path="/marketplace" 
  element={<Marketplace />} 
/>
          <Route 
            path="/register-business" 
            element={user ? <RegisterBusiness /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <UpdateProfile /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;