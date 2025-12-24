import { useState } from 'react';

const GeolocationButton = ({ onLocationFound }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLoading(false);
          onLocationFound({ latitude, longitude });
        },
        (error) => {
          setLoading(false);
          setError('Error getting location: ' + error.message);
          console.error('Error getting user location:', error);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  };

  return (
    <div>
      <button 
        onClick={getUserLocation}
        disabled={loading}
        style={{ 
          padding: '0.5rem 1rem', 
          background: '#075E54', 
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        {loading ? 'Finding Location...' : '📍 Find Businesses Near Me'}
      </button>
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
    </div>
  );
};

export default GeolocationButton;