import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { useForm } from 'react-hook-form';

const RegisterBusiness = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Nigerian-focused categories
  const categories = [
    'Logistics & Delivery', 
    'Transport Services', 
    'Courier Services',
    'Restaurant & Cafe', 
    'Retail Shop', 
    'Supermarket & Groceries',
    'Professional Services', 
    'Healthcare & Pharmacy', 
    'Education',
    'Automotive', 
    'Home Services', 
    'Beauty & Wellness',
    'Technology', 
    'Real Estate', 
    'Fashion',
    'Electronics',
    'Agriculture',
    'Manufacturing',
    'Other'
  ];

  const nigerianStates = [
    'Lagos', 'Abuja', 'Rivers', 'Delta', 'Oyo',
    'Kano', 'Kaduna', 'Ogun', 'Edo', 'Enugu',
    'Anambra', 'Akwa Ibom', 'Cross River', 'Imo', 'Benue',
    'Bauchi', 'Borno', 'Sokoto', 'Niger', 'Plateau'
  ];

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const formatWhatsAppNumber = (phone) => {
    const clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) return `234${clean.substring(1)}`;
    if (clean.startsWith('234')) return clean;
    return `234${clean}`;
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Please login first');
        setLoading(false);
        return;
      }

      // Generate WhatsApp link from phone number
      const whatsappNumber = formatWhatsAppNumber(data.whatsappNumber);
      const whatsappLink = `https://wa.me/${whatsappNumber}`;

      // BUSINESS DATA - Auto-approved
      const businessData = {
        owner_id: user.id,
        name: data.businessName,
        slug: generateSlug(data.businessName),
        description: data.description || `${data.category} services in ${data.state || 'Nigeria'}`,
        category: data.category,
        whatsapp_number: whatsappNumber, // Store the formatted number
        whatsapp_business_link: data.whatsappBusinessLink || null, // NEW: WhatsApp Business page
        email: data.email || null,
        website: data.website || null,
        address: data.address || null,
        city: data.city || 'Lagos',
        state: data.state || 'Lagos',
        country: 'Nigeria',
        status: 'approved', // AUTO-APPROVED!
        verification_status: 'verified', // AUTO-VERIFIED!
        // Social links can include multiple platforms
        social_links: data.whatsappBusinessLink ? {
          whatsapp_business: data.whatsappBusinessLink,
          website: data.website || null
        } : null
      };

      console.log('Registering business:', businessData);

      const { data: result, error: insertError } = await supabase
        .from('businesses')
        .insert([businessData])
        .select()
        .single();

      if (insertError) {
        console.error('Database error:', insertError);
        throw insertError;
      }

      console.log('Business registered successfully:', result);
      
      // Success!
      alert('✅ Business registered successfully! Your listing is live now.');
      navigate('/marketplace');
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(`Registration failed: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: '#075E54', marginBottom: '0.5rem' }}>Register Your Business</h1>
        <p style={{ color: '#666' }}>
          Add your business in 60 seconds. No approval needed - live immediately!
        </p>
      </div>

      {error && (
        <div style={{ 
          background: '#fee', 
          color: '#c00', 
          padding: '1rem', 
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem'
      }}>
        {/* REQUIRED FIELDS */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Business Name *
          </label>
          <input
            type="text"
            placeholder="e.g., Fast Logistics Nigeria"
            {...register('businessName', { 
              required: 'Business name is required',
              minLength: { value: 3, message: 'Minimum 3 characters' }
            })}
            style={{ 
              padding: '0.75rem', 
              width: '100%',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
          {errors.businessName && (
            <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>
              {errors.businessName.message}
            </span>
          )}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Category *
          </label>
          <select
            {...register('category', { required: 'Category is required' })}
            style={{ 
              padding: '0.75rem', 
              width: '100%',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem',
              background: 'white'
            }}
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && (
            <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>
              {errors.category.message}
            </span>
          )}
        </div>

        {/* WHATSAPP CONTACT SECTION */}
        <div style={{ 
          background: '#f0f9ff', 
          padding: '1rem', 
          borderRadius: '8px',
          border: '1px solid #bae6fd'
        }}>
          <h3 style={{ marginTop: 0, color: '#075E54' }}>WhatsApp Contact</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              WhatsApp Phone Number *
            </label>
            <input
              type="tel"
              placeholder="e.g., 08012345678"
              {...register('whatsappNumber', { 
                required: 'WhatsApp number is required',
                pattern: {
                  value: /^[0-9\s\-\(\)\+]{10,}$/,
                  message: 'Enter a valid Nigerian phone number'
                }
              })}
              style={{ 
                padding: '0.75rem', 
                width: '100%',
                border: '1px solid #93c5fd',
                borderRadius: '6px',
                fontSize: '1rem',
                background: '#f8fafc'
              }}
            />
            <small style={{ color: '#666', marginTop: '0.25rem', display: 'block' }}>
              Customers will chat with you on this number
            </small>
            {errors.whatsappNumber && (
              <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>
                {errors.whatsappNumber.message}
              </span>
            )}
          </div>

          {/* WHATSAPP BUSINESS PAGE LINK */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              WhatsApp Business Page Link (Optional)
            </label>
            <input
              type="url"
              placeholder="https://www.whatsapp.com/business/your-page"
              {...register('whatsappBusinessLink', {
                pattern: {
                  value: /^(https?:\/\/)?(www\.)?(whatsapp\.com|wa\.me)\/.*$/i,
                  message: 'Please enter a valid WhatsApp Business URL'
                }
              })}
              style={{ 
                padding: '0.75rem', 
                width: '100%',
                border: '1px solid #93c5fd',
                borderRadius: '6px',
                fontSize: '1rem',
                background: '#f8fafc'
              }}
            />
            <small style={{ color: '#666', marginTop: '0.25rem', display: 'block' }}>
              Share your official WhatsApp Business catalog/profile
            </small>
            {errors.whatsappBusinessLink && (
              <span style={{ color: '#dc2626', fontSize: '0.875rem' }}>
                {errors.whatsappBusinessLink.message}
              </span>
            )}
          </div>

          <div style={{ 
            marginTop: '1rem', 
            padding: '0.75rem', 
            background: '#e0f2fe',
            borderRadius: '6px',
            fontSize: '0.875rem'
          }}>
            <p style={{ margin: 0, color: '#0369a1' }}>
              💡 <strong>Tip:</strong> WhatsApp Business pages allow you to showcase products/services, 
              business hours, and location. Create one at <a href="https://business.whatsapp.com" target="_blank" style={{ color: '#075E54' }}>business.whatsapp.com</a>
            </p>
          </div>
        </div>

        {/* OPTIONAL FIELDS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              City
            </label>
            <input
              type="text"
              placeholder="e.g., Lagos"
              {...register('city')}
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
              State
            </label>
            <select
              {...register('state')}
              style={{ 
                padding: '0.75rem', 
                width: '100%',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                background: 'white'
              }}
            >
              <option value="">Select state</option>
              {nigerianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Business Description (Optional)
          </label>
          <textarea
            placeholder="Describe your services, products, or specialties..."
            {...register('description')}
            rows="3"
            style={{ 
              padding: '0.75rem', 
              width: '100%',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
        </div>

        {/* WEBSITE & EMAIL */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Website (Optional)
            </label>
            <input
              type="url"
              placeholder="https://yourbusiness.com"
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

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Email (Optional)
            </label>
            <input
              type="email"
              placeholder="contact@business.com"
              {...register('email')}
              style={{ 
                padding: '0.75rem', 
                width: '100%',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button 
          type="submit"
          disabled={loading}
          style={{ 
            padding: '1rem',
            background: loading ? '#94a3b8' : '#25D366', 
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '1rem'
          }}
        >
          {loading ? 'Registering...' : '🚀 Register Business Instantly'}
        </button>

        <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          ✅ No approval needed • Live immediately • 100% free
        </p>
      </form>
    </div>
  );
};

export default RegisterBusiness;