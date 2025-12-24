// Register.jsx - Minimal working version
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../../services/supabase"; 

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting registration...');
      
      // SIMPLEST POSSIBLE SIGNUP - no user metadata
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          // NO email redirect - simpler
          // NO user metadata initially
        }
      });

      console.log('Auth response:', { data, error });

      if (error) {
        throw error;
      }

      if (data?.user) {
        console.log('User created:', data.user.id);
        
        // MANUALLY create profile (no trigger)
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            username: username || data.user.email.split('@')[0]
          });

        if (profileError) {
          console.warn('Profile creation failed (but auth succeeded):', profileError);
          // Continue anyway - auth worked!
        }
        
        alert('✅ Registration successful! You can now login.');
        navigate('/login');
      }
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Register</h2>
      
      {error && (
        <div style={{ background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Password * (min 6 chars)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading || !email || !password}
          style={{
            width: '100%',
            padding: '10px',
            background: loading ? '#ccc' : '#25D366',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'none',
            border: 'none',
            color: '#25D366',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default Register;