import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import GeolocationButton from './GeolocationButton';

const Marketplace = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      let query = supabase
        .from('businesses')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;
      
      setBusinesses(data || []);
      setFilteredBusinesses(data || []);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(b => b.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationFound = (coords) => {
    setUserLocation(coords);
    filterBusinessesByLocation(coords);
  };

  const filterBusinessesByLocation = (coords) => {
    if (!coords) return businesses;

    const businessesWithDistance = businesses.map(business => {
      if (business.latitude && business.longitude) {
        const distance = calculateDistance(
          coords.latitude,
          coords.longitude,
          business.latitude,
          business.longitude
        );
        return { ...business, distance };
      }
      return { ...business, distance: null };
    });

    const nearbyBusinesses = businessesWithDistance
      .filter(b => b.distance !== null)
      .sort((a, b) => a.distance - b.distance);

    setFilteredBusinesses(nearbyBusinesses);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim() && !selectedCategory) {
      setFilteredBusinesses(businesses);
      return;
    }

    const filtered = businesses.filter(business => {
      const matchesSearch = term.toLowerCase() === '' || 
        business.name.toLowerCase().includes(term.toLowerCase()) ||
        business.description?.toLowerCase().includes(term.toLowerCase()) ||
        business.category?.toLowerCase().includes(term.toLowerCase()) ||
        business.city?.toLowerCase().includes(term.toLowerCase());
      
      const matchesCategory = !selectedCategory || business.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    setFilteredBusinesses(filtered);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (!category) {
      setFilteredBusinesses(businesses);
      return;
    }

    const filtered = businesses.filter(business => 
      business.category === category
    );
    setFilteredBusinesses(filtered);
  };

  // Function to get WhatsApp chat link
  const getWhatsAppLink = (business) => {
    if (business.whatsapp_number) {
      const cleanNumber = business.whatsapp_number.replace(/\D/g, '');
      return `https://wa.me/${cleanNumber}`;
    }
    return '#';
  };

  // Function to format WhatsApp number for display
  const formatPhoneForDisplay = (phone) => {
    if (!phone) return '';
    const clean = phone.replace(/\D/g, '');
    if (clean.startsWith('234')) {
      return `+${clean}`;
    }
    return `+234${clean}`;
  };

  // Function to track clicks on WhatsApp Business page
  const trackBusinessPageClick = async (businessId) => {
    try {
      await supabase
        .from('businesses')
        .update({ clicks_count: supabase.raw('clicks_count + 1') })
        .eq('id', businessId);
    } catch (err) {
      console.error('Error tracking click:', err);
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
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #25D366',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p>Loading businesses...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ 
              color: '#075E54', 
              marginBottom: '0.25rem',
              fontSize: '2rem'
            }}>
              WhatsApp Business Marketplace
            </h1>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>
              Find and connect with Nigerian businesses on WhatsApp
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <GeolocationButton onLocationFound={handleLocationFound} />
            <button 
              onClick={() => window.location.href = '/register-business'}
              style={{ 
                padding: '0.75rem 1.5rem', 
                background: '#25D366', 
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.95rem'
              }}
            >
              + Add Your Business
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr auto',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search businesses by name, category, or city..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ 
                padding: '0.75rem 1rem 0.75rem 3rem', 
                width: '100%',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border 0.2s'
              }}
            />
            <span style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666'
            }}>
              🔍
            </span>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            style={{ 
              padding: '0.75rem 1rem', 
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '1rem',
              background: 'white',
              minWidth: '200px'
            }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Location Status */}
        {userLocation && (
          <div style={{ 
            background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)', 
            padding: '1rem 1.5rem', 
            borderRadius: '10px',
            marginBottom: '1.5rem',
            border: '1px solid #c8e6c9'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📍</span>
                <div>
                  <p style={{ margin: 0, fontWeight: '600', color: '#075E54' }}>
                    Showing businesses near you
                  </p>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                    Latitude: {userLocation.latitude.toFixed(4)}, Longitude: {userLocation.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setUserLocation(null);
                  setFilteredBusinesses(businesses);
                }}
                style={{ 
                  padding: '0.5rem 1rem', 
                  background: 'white',
                  color: '#075E54',
                  border: '1px solid #075E54',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Clear Location
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>
            Found <strong>{filteredBusinesses.length}</strong> business{filteredBusinesses.length !== 1 ? 'es' : ''}
            {selectedCategory && ` in "${selectedCategory}"`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      </div>

      {/* Businesses Grid */}
      {filteredBusinesses.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          background: '#f9fafb',
          borderRadius: '12px',
          marginTop: '2rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
          <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>
            No businesses found
          </h3>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            {searchTerm || selectedCategory 
              ? 'Try different search terms or clear filters'
              : 'Be the first to register your business!'}
          </p>
          {!searchTerm && !selectedCategory && (
            <button 
              onClick={() => window.location.href = '/register-business'}
              style={{ 
                padding: '0.875rem 1.75rem', 
                background: '#25D366', 
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Register Your Business
            </button>
          )}
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredBusinesses.map((business) => (
            <div 
              key={business.id}
              style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '12px', 
                padding: '1.5rem',
                background: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                ':hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  borderColor: '#25D366'
                }
              }}
            >
              {/* Business Header */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ 
                      marginTop: 0, 
                      color: '#075E54',
                      marginBottom: '0.5rem',
                      fontSize: '1.25rem',
                      lineHeight: '1.3'
                    }}>
                      {business.name}
                    </h3>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span style={{
                        background: '#e0f2fe',
                        color: '#0369a1',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        {business.category}
                      </span>
                      
                      {business.verification_status === 'verified' && (
                        <span style={{
                          background: '#dcfce7',
                          color: '#166534',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: '600'
                        }}>
                          ✅ Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>📍</span>
                  <p style={{ 
                    margin: 0, 
                    color: '#4b5563',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    {business.city && business.state ? `${business.city}, ${business.state}` : 'Nigeria'}
                    {business.distance && (
                      <span style={{ 
                        display: 'inline-block',
                        marginLeft: '0.5rem',
                        color: '#059669',
                        fontWeight: '600',
                        background: '#f0fdf4',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                      }}>
                        {business.distance.toFixed(1)} km away
                      </span>
                    )}
                  </p>
                </div>
                
                {/* Phone Number Display */}
                {business.whatsapp_number && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>📱</span>
                    <p style={{ 
                      margin: 0, 
                      color: '#4b5563',
                      fontSize: '0.9rem'
                    }}>
                      {formatPhoneForDisplay(business.whatsapp_number)}
                    </p>
                  </div>
                )}
              </div>

              {/* Description */}
              {business.description && (
                <div style={{ 
                  marginBottom: '1rem',
                  flexGrow: 1
                }}>
                  <p style={{ 
                    color: '#4b5563', 
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {business.description}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ marginTop: 'auto' }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  {/* WhatsApp Chat Button */}
                  <a
                    href={getWhatsAppLink(business)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={async () => {
                      await supabase
                        .from('businesses')
                        .update({ clicks_count: (business.clicks_count || 0) + 1 })
                        .eq('id', business.id);
                    }}
                    style={{
                      display: 'block',
                      background: '#25D366',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '0.875rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                      fontSize: '1rem',
                      border: '2px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#128C7E';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#25D366';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    💬 Chat on WhatsApp
                  </a>

                  {/* WhatsApp Business Page Button (if available) */}
                  {business.whatsapp_business_link && (
                    <a
                      href={business.whatsapp_business_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackBusinessPageClick(business.id)}
                      style={{
                        display: 'block',
                        background: 'white',
                        color: '#075E54',
                        textDecoration: 'none',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        fontWeight: '600',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        fontSize: '0.9rem',
                        border: '2px solid #075E54'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#f0f9ff';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      📱 View Business Page
                    </a>
                  )}

                  {/* Website Link (if available) */}
                  {business.website && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        background: '#f3f4f6',
                        color: '#4b5563',
                        textDecoration: 'none',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        fontWeight: '500',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        fontSize: '0.9rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#e5e7eb';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#f3f4f6';
                      }}
                    >
                      🌐 Visit Website
                    </a>
                  )}
                </div>

                {/* Stats */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f3f4f6',
                  fontSize: '0.8rem',
                  color: '#6b7280'
                }}>
                  <span>
                    👁️ {business.views_count || 0} views
                  </span>
                  <span>
                    👆 {business.clicks_count || 0} clicks
                  </span>
                  <span>
                    📅 {new Date(business.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Marketplace;