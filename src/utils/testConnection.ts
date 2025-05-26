import { warmUpServer } from '../services/api';

export const testBackendConnection = async () => {
  console.log('🔍 Testing backend connection...');
  
  try {
    // Testar se o servidor está respondendo
    const response = await fetch('https://masks-coc-backend.onrender.com/health', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is responding:', data);
      return true;
    } else {
      console.error('❌ Backend responded with error:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to connect to backend:', error);
    
    // Tentar warm up
    console.log('🌡️ Attempting to warm up server...');
    try {
      await warmUpServer();
      return true;
    } catch (warmUpError) {
      console.error('❌ Warm up failed:', warmUpError);
      return false;
    }
  }
};

export const testCORS = async () => {
  console.log('🌍 Testing CORS...');
  
  try {
    const response = await fetch('https://masks-coc-backend.onrender.com/api/sessions', {
      method: 'OPTIONS',
      mode: 'cors',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });
    
    console.log('✅ CORS preflight response:', response.status);
    console.log('✅ CORS headers:', Object.fromEntries(response.headers.entries()));
    return response.ok;
  } catch (error) {
    console.error('❌ CORS test failed:', error);
    return false;
  }
}; 