// Configuración de Supabase usando fetch API (sin necesidad de instalación)

const SUPABASE_URL = 'https://ozpffhjaknxwoueaojkh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96cGZmaGpha254d291ZWFvamtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MjA5MDUsImV4cCI6MjA3ODM5NjkwNX0.Co05GFfcqmANmlT5tiQ-2fpN6VYc3w2m3PSKdHFCvds';

// Función helper para hacer requests a Supabase
async function supabaseRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, options);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en la petición a Supabase');
  }

  return response.json();
}

// Función para generar código de acceso único
function generateAccessCode() {
  const prefix = 'SC';
  const numbers = Math.floor(10000 + Math.random() * 90000); // 5 dígitos
  return `${prefix}-${numbers}`;
}

// Insertar nuevo usuario
export async function insertUser(userData) {
  const accessCode = generateAccessCode();
  
  const newUser = {
    phone: userData.phone,
    country_code: userData.countryCode,
    first_name: userData.firstName,
    last_name: userData.lastName,
    mother_last_name: userData.motherLastName || null,
    email: userData.email,
    access_code: accessCode,
    user_type: userData.userType || 'family',
    linked_phone: userData.linkedPhone || null
  };

  try {
    const result = await supabaseRequest('registered_users', 'POST', newUser);
    return { success: true, data: result, accessCode };
  } catch (error) {
    console.error('Error insertando usuario:', error);
    return { success: false, error: error.message };
  }
}

// Buscar usuario por código de acceso
export async function getUserByAccessCode(accessCode) {
  try {
    const result = await supabaseRequest(
      `registered_users?access_code=eq.${accessCode}&select=*`,
      'GET'
    );
    
    if (result && result.length > 0) {
      return { success: true, data: result[0] };
    } else {
      return { success: false, error: 'Código no encontrado' };
    }
  } catch (error) {
    console.error('Error buscando usuario:', error);
    return { success: false, error: error.message };
  }
}

// Buscar usuario por teléfono
export async function getUserByPhone(phone) {
  try {
    const result = await supabaseRequest(
      `registered_users?phone=eq.${phone}&select=*`,
      'GET'
    );
    
    if (result && result.length > 0) {
      return { success: true, data: result[0] };
    } else {
      return { success: false, error: 'Teléfono no encontrado' };
    }
  } catch (error) {
    console.error('Error buscando usuario:', error);
    return { success: false, error: error.message };
  }
}

export default {
  insertUser,
  getUserByAccessCode,
  getUserByPhone
};
