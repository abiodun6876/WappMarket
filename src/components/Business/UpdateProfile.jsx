import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useForm } from 'react-hook-form';

const UpdateProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setMessage({ type: 'error', text: 'Please login first' });
        return;
      }

      // First check if profile exists in profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // If no profile exists, create one with user info
      if (!profile) {
        const newProfile = {
          id: user.id,
          username: user.email?.split('@')[0],
          full_name: user.user_metadata?.full_name || '',
          created_at: new Date().toISOString()
        };

        const { error } = await supabase
          .from('profiles')
          .insert([newProfile]);

        if (error) {
          console.error('Error creating profile:', error);
        }

        reset({
          username: newProfile.username,
          full_name: newProfile.full_name,
          phone: '',
          website: ''
        });
      } else {
        reset({
          username: profile.username || '',
          full_name: profile.full_name || '',
          phone: profile.phone || '',
          website: profile.website || ''
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setMessage({ type: 'error', text: 'Error loading profile' });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setMessage({ type: '', text: '' });

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setMessage({ type: 'error', text: 'Please login first' });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: data.username,
          full_name: data.full_name,
          phone: data.phone,
          website: data.website,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setMessage({ 
        type: 'success', 
        text: '✅ Profile updated successfully!' 
      });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setMessage({ 
        type: 'error', 
        text: '❌ Error updating profile: ' + err.message 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #25D366',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#075E54', marginBottom: '0.5rem' }}>Update Your Profile</h1>
        <p style={{ color: '#666' }}>
          Keep your information up to date for better business visibility
        </p>
      </div>

      {message.text && (
        <div style={{ 
          background: message.type === 'success' ? '#d4edda' : '#f8d7da',
          color: message.type === 'success' ? '#155724' : '#721c24',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.5rem',
        background: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Username
          </label>
          <input
            type="text"
            placeholder="username"
            {...register('username')}
            style={{ 
              padding: '0.75rem', 
              width: '100%',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
          <small style={{ color: '#666', marginTop: '0.25rem', display: 'block' }}>
            Your unique identifier in the system
          </small>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Full Name
          </label>
          <input
            type="text"
            placeholder="Your full name"
            {...register('full_name')}
            style={{ 
              padding: '0.75rem', 
              width: '100%',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="e.g., +1 (555) 123-4567"
            {...register('phone')}
            style={{ 
              padding: '0.75rem', 
              width: '100%',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Website
          </label>
          <input
            type="url"
            placeholder="https://example.com"
            {...register('website')}
            style={{ 
              padding: '0.75rem', 
              width: '100%',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
          <button 
            type="submit"
            disabled={saving}
            style={{ 
              padding: '0.875rem 1.75rem', 
              background: saving ? '#94a3b8' : '#075E54', 
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              width: '100%',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => !saving && (e.target.style.background = '#064e3b')}
            onMouseLeave={(e) => !saving && (e.target.style.background = '#075E54')}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default UpdateProfile;