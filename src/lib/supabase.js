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
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=representation' // Para que retorne los datos insertados
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, options);
  
  if (!response.ok) {
    let errorMessage = 'Error en la petición a Supabase';
    try {
      const error = await response.json();
      errorMessage = error.message || error.hint || JSON.stringify(error);
    } catch (e) {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  // Para INSERT/POST, Supabase puede retornar respuesta vacía (201 Created)
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

// Función para generar código de acceso único
function generateAccessCode() {
  const prefix = 'SC';
  const numbers = Math.floor(10000 + Math.random() * 90000); // 5 dígitos
  return `${prefix}-${numbers}`;
}

// Insertar registro completo (migrante + familiar en una sola fila)
export async function insertRegistration(migrantData, familyData) {
  const migrantAccessCode = generateAccessCode();
  const familyAccessCode = generateAccessCode();
  
  const newRegistration = {
    // Datos del migrante (columnas 1-11)
    migrant_first_name: migrantData.firstName,
    migrant_last_name: migrantData.lastName,
    migrant_mother_last_name: migrantData.motherLastName || null,
    migrant_email: migrantData.email,
    migrant_country_code: migrantData.countryCode || '+1',
    migrant_phone: migrantData.phone,
    migrant_access_code: migrantAccessCode,
    
    // Datos del familiar (columnas 12-20)
    family_first_name: familyData.firstName,
    family_last_name: familyData.lastName,
    family_mother_last_name: familyData.motherLastName || null,
    family_email: familyData.email || null,
    family_country_code: familyData.countryCode || '+52',
    family_phone: familyData.phone,
    family_access_code: familyAccessCode,
    family_country: familyData.country || null
  };

  try {
    const result = await supabaseRequest('registered_users', 'POST', newRegistration);
    return { 
      success: true, 
      data: result, 
      migrantAccessCode,
      familyAccessCode 
    };
  } catch (error) {
    console.error('Error insertando registro:', error);
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
  insertRegistration,
  getUserByAccessCode,
  getUserByPhone
};
