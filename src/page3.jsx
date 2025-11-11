import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from './hooks/useGeolocation';
import { UserContext } from './contexts/UserContext';
import { getUserByAccessCode } from './lib/supabase';

// Códigos especiales de acceso para inversores y demos
const SPECIAL_ACCESS_CODES = {
  'INVESTOR2025': {
    type: 'investor',
    route: '/page4',
    demoUser: {
      firstName: 'María',
      lastName: 'González',
      motherLastName: 'Rodríguez',
      phone: '5512345678',
      email: 'demo@saludcompartida.com',
      countryCode: '+52'
    }
  },
  'DEMO-MX': {
    type: 'demo-family',
    route: '/page4',
    demoUser: {
      firstName: 'Carlos',
      lastName: 'Martínez',
      motherLastName: 'López',
      phone: '5587654321',
      email: 'demo-mx@saludcompartida.com',
      countryCode: '+52'
    }
  },
  'DEMO-US': {
    type: 'demo-migrant',
    route: '/migrant',
    demoUser: {
      firstName: 'John',
      lastName: 'Smith',
      motherLastName: '',
      phone: '3105551234',
      email: 'demo-us@saludcompartida.com',
      countryCode: '+1'
    }
  }
};

export default function Page3() {
  const navigate = useNavigate();
  const { countryCode: detectedCountry, loading: geoLoading } = useGeolocation();
  const { setCurrentUser } = useContext(UserContext);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [motherLastName, setMotherLastName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+52'); // New state for country code
  const [specialCode, setSpecialCode] = useState(''); // Nuevo: para códigos especiales
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [showErrorForm, setShowErrorForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [useSpecialCode, setUseSpecialCode] = useState(false); // Toggle entre teléfono y código especial
  const [userDataLoaded, setUserDataLoaded] = useState(false); // Indica si ya cargamos datos del localStorage

  // Auto-select country code based on geolocation (only for Mexico)
  useEffect(() => {
    if (!geoLoading && detectedCountry) {
      if (detectedCountry === 'MX') {
        setCountryCode('+52');
      }
      // For US or other countries, keep default +52 (Mexico)
    }
  }, [detectedCountry, geoLoading]);

  // Auto-load user data when phone number changes
  useEffect(() => {
    if (whatsappNumber.trim().length === 10 && !useSpecialCode) {
      const uniquePhoneId = `${countryCode}${whatsappNumber.trim()}`;
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      
      if (registeredUsers[uniquePhoneId]) {
        const userData = registeredUsers[uniquePhoneId];
        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
        setMotherLastName(userData.motherLastName || '');
        setUserDataLoaded(true);
      } else {
        // Si cambia el número y no existe, limpiar campos
        if (userDataLoaded) {
          setFirstName('');
          setLastName('');
          setMotherLastName('');
          setUserDataLoaded(false);
        }
      }
    }
  }, [whatsappNumber, countryCode, useSpecialCode, userDataLoaded]);

  const handleAccessCode = async () => {
    // Si está usando código especial, validar directamente
    if (useSpecialCode && specialCode.trim()) {
      const upperCode = specialCode.trim().toUpperCase();
      
      // Primero revisar si es un código demo
      if (SPECIAL_ACCESS_CODES[upperCode]) {
        const codeData = SPECIAL_ACCESS_CODES[upperCode];
        
        // Cargar datos demo del usuario
        const userData = {
          ...codeData.demoUser,
          phoneId: `${codeData.demoUser.countryCode}${codeData.demoUser.phone}`,
          accessType: codeData.type,
          isDemo: true
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        // Registrar el código usado (para analytics)
        const usedCodes = JSON.parse(localStorage.getItem('usedSpecialCodes') || '[]');
        usedCodes.push({
          code: upperCode,
          type: codeData.type,
          usedAt: new Date().toISOString()
        });
        localStorage.setItem('usedSpecialCodes', JSON.stringify(usedCodes));
        
        // Navegar a la ruta correspondiente
        setErrors({});
        navigate(codeData.route);
        return;
      }
      
      // Si no es código demo, buscar en Supabase
      try {
        const result = await getUserByAccessCode(upperCode);
        
        if (result.success && result.data) {
          const dbUser = result.data;
          
          const userData = {
            firstName: dbUser.first_name,
            lastName: dbUser.last_name,
            motherLastName: dbUser.mother_last_name || '',
            email: dbUser.email,
            phone: dbUser.phone,
            countryCode: dbUser.country_code,
            phoneId: `${dbUser.country_code}${dbUser.phone}`,
            accessCode: dbUser.access_code,
            type: dbUser.user_type,
            registeredAt: dbUser.created_at
          };
          
          localStorage.setItem('currentUser', JSON.stringify(userData));
          setCurrentUser(userData); // Actualizar contexto
          setErrors({});
          
          // Navegar según el tipo de usuario
          if (dbUser.user_type === 'migrant' || dbUser.country_code === '+1') {
            navigate('/migrant');
          } else {
            navigate('/page4');
          }
        } else {
          setErrors({ specialCode: 'Código no válido. Verifica e intenta nuevamente.' });
        }
      } catch (error) {
        console.error('Error validando código:', error);
        setErrors({ specialCode: 'Error al validar código. Intenta nuevamente.' });
      }
      return;
    }
    
    // Validación normal por teléfono (fallback a localStorage)
    const newErrors = {};
    
    if (!whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'El número de WhatsApp es requerido';
    } else if (whatsappNumber.trim().length !== 10) {
      newErrors.whatsappNumber = 'Debe tener 10 dígitos';
    }
    
    if (!acceptedTerms) {
      newErrors.acceptedTerms = 'Debes aceptar los términos y condiciones';
    }
    
    // Si hay errores, mostrarlos y no continuar
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Construir el ID único con código de país + número
    const uniquePhoneId = `${countryCode}${whatsappNumber.trim()}`;
    
    // Verificar si el teléfono está registrado en localStorage (compatibilidad)
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    
    if (registeredUsers[uniquePhoneId]) {
      // Usuario encontrado - usar los datos del registro original (ya precargados)
      const originalData = registeredUsers[uniquePhoneId];
      
      const userData = {
        firstName: originalData.firstName,
        lastName: originalData.lastName,
        motherLastName: originalData.motherLastName || '',
        email: originalData.email || '',
        phone: originalData.phone,
        countryCode: countryCode,
        phoneId: uniquePhoneId,
        type: originalData.type || 'user',
        registeredAt: originalData.registeredAt
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      // Limpiar errores y navegar según el tipo de usuario
      setErrors({});
      if (originalData.type === 'migrant' || countryCode === '+1') {
        navigate('/migrant');
      } else {
        navigate('/page4');
      }
    } else {
      // Usuario no encontrado - mostrar formulario de consulta
      setShowErrorForm(true);
      setErrors({});
    }
  };

  const handleSendErrorReport = async () => {
    if (!errorMessage.trim()) {
      setErrors({ errorMessage: 'Por favor describe tu consulta' });
      return;
    }

    try {
      const uniquePhoneId = `${countryCode}${whatsappNumber.trim()}`;
      const emailBody = `
🔴 CÓDIGO O CLAVE ERRADA - CONSULTA DE USUARIO

--- DATOS DEL USUARIO ---
Nombre completo: ${firstName} ${lastName} ${motherLastName || ''}
Teléfono intentado: ${uniquePhoneId}

--- CONSULTA ---
${errorMessage}

--- INFORMACIÓN ADICIONAL ---
Fecha: ${new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
      `.trim();

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email: 'consultas@saludcompartida.com',
          message: emailBody,
          type: 'access-error'
        }),
      });

      if (response.ok) {
        setShowSuccessMessage(true);
        setShowErrorForm(false);
        
        // Limpiar formulario después de 5 segundos y volver al inicio
        setTimeout(() => {
          setShowSuccessMessage(false);
          setFirstName('');
          setLastName('');
          setMotherLastName('');
          setWhatsappNumber('');
          setErrorMessage('');
          setAcceptedTerms(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error al enviar consulta:', error);
      setErrors({ errorMessage: 'Error al enviar. Intenta nuevamente.' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-pink-50 to-cyan-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <img 
            src="/saludcompartida logo WT.png" 
            alt="SaludCompartida" 
            className="h-16 object-contain"
          />
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 text-lg font-medium transition-colors"
          >
            Volver
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-12">
        {showSuccessMessage ? (
          // MENSAJE DE ÉXITO
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ¡Consulta Enviada!
              </h2>
              <p className="text-gray-700 leading-relaxed mb-2">
                Gracias por comunicarte con SaludCompartida.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                En 15 minutos responderemos tu consulta.
              </p>
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                <p className="text-cyan-700 font-semibold">
                  🕒 Horario de Atención
                </p>
                <p className="text-cyan-600">
                  09:00 a 18:00
                </p>
              </div>
            </div>
          </div>
        ) : showErrorForm ? (
          // FORMULARIO DE CONSULTA POR ERROR
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-3">
                Código o Clave Errada
              </h2>
              <p className="text-gray-600">
                No encontramos tu número registrado.<br />
                Por favor, cuéntanos qué pasó para ayudarte.
              </p>
            </div>

            {/* RESUMEN DE DATOS INGRESADOS */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Datos ingresados:</span>
              </p>
              <p className="text-sm text-gray-700">
                Nombre: {firstName} {lastName} {motherLastName}
              </p>
              <p className="text-sm text-gray-700">
                Teléfono: {countryCode} {whatsappNumber}
              </p>
            </div>

            {/* CAMPO DE CONSULTA */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Describe tu consulta <span className="text-red-500">*</span>
              </label>
              <textarea
                value={errorMessage}
                onChange={(e) => {
                  setErrorMessage(e.target.value);
                  setErrors({ ...errors, errorMessage: '' });
                }}
                placeholder="Ejemplo: Me registré hace 2 días pero no puedo ingresar, o necesito ayuda con mi código..."
                rows={5}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-cyan-500 resize-none ${
                  errors.errorMessage ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.errorMessage && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.errorMessage}
                </p>
              )}
            </div>

            {/* BOTONES */}
            <div className="space-y-3">
              <button
                onClick={handleSendErrorReport}
                className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 text-white py-4 rounded-lg font-bold text-lg hover:from-cyan-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
              >
                Enviar Consulta
              </button>
              
              <button
                onClick={() => {
                  setShowErrorForm(false);
                  setErrorMessage('');
                  setErrors({});
                }}
                className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Volver a Intentar
              </button>
            </div>
          </div>
        ) : (
          // FORMULARIO ORIGINAL DE ACCESO
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* RECUADRO GRANDE - INGRESA TU CÓDIGO */}
          <div className="mb-8 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-2xl p-8 shadow-2xl">
            <div className="text-center text-white">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold mb-3">
                Ingresa tu Código
              </h1>
              <p className="text-xl text-cyan-50">
                Para inversionistas y usuarios registrados
              </p>
            </div>
          </div>

          {/* TOGGLE: Teléfono vs Código Especial */}
          <div className="mb-6 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setUseSpecialCode(false);
                setErrors({});
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                !useSpecialCode
                  ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📱 Mi Teléfono
            </button>
            <button
              type="button"
              onClick={() => {
                setUseSpecialCode(true);
                setErrors({});
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                useSpecialCode
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🔑 Código Especial
            </button>
          </div>

          {/* FORMULARIO */}
          <div className="space-y-5">
            {useSpecialCode ? (
              // MODO: CÓDIGO ESPECIAL
              <>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Código de Acceso <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={specialCode}
                    onChange={(e) => {
                      setSpecialCode(e.target.value.toUpperCase());
                      setErrors({ ...errors, specialCode: '' });
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleAccessCode()}
                    placeholder="Ingresa tu código de acceso"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-purple-500 text-lg font-mono uppercase ${
                      errors.specialCode ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.specialCode && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.specialCode}
                    </p>
                  )}
                </div>

                {/* Botón de acceso con código especial */}
                <button
                  onClick={handleAccessCode}
                  className="w-full mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
                >
                  Ingresar con Código Especial
                </button>
              </>
            ) : (
              // MODO: TELÉFONO (FORMULARIO ORIGINAL)
              <>
            {/* NOMBRE */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Nombre {userDataLoaded && <span className="text-green-600 text-sm">✓ Datos cargados</span>}
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  if (!userDataLoaded) {
                    setFirstName(e.target.value);
                    setErrors({ ...errors, firstName: '' });
                  }
                }}
                placeholder="Ej: María"
                readOnly={userDataLoaded}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-lg ${
                  userDataLoaded 
                    ? 'bg-green-50 border-green-300 cursor-not-allowed' 
                    : 'focus:border-cyan-500 border-gray-300'
                } ${errors.firstName ? 'border-red-500' : ''}`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* APELLIDO PATERNO */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Apellido Paterno {userDataLoaded && <span className="text-green-600 text-sm">✓</span>}
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  if (!userDataLoaded) {
                    setLastName(e.target.value);
                    setErrors({ ...errors, lastName: '' });
                  }
                }}
                placeholder="Ej: González"
                readOnly={userDataLoaded}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-lg ${
                  userDataLoaded 
                    ? 'bg-green-50 border-green-300 cursor-not-allowed' 
                    : 'focus:border-cyan-500 border-gray-300'
                } ${errors.lastName ? 'border-red-500' : ''}`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.lastName}
                </p>
              )}
            </div>

            {/* APELLIDO MATERNO */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Apellido Materno <span className="text-gray-500 text-sm font-normal">(opcional)</span>
              </label>
              <input
                type="text"
                value={motherLastName}
                onChange={(e) => {
                  if (!userDataLoaded) {
                    setMotherLastName(e.target.value);
                  }
                }}
                placeholder="Ej: Rodríguez"
                readOnly={userDataLoaded}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none text-lg ${
                  userDataLoaded 
                    ? 'bg-green-50 border-green-300 cursor-not-allowed' 
                    : 'focus:border-cyan-500 border-gray-300'
                }`}
              />
            </div>

            {/* WHATSAPP */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Número de WhatsApp <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-3 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 focus:outline-none focus:border-cyan-500"
                >
                  <option value="+52">🇲🇽 +52</option>
                  <option value="+1">🇺🇸 +1</option>
                </select>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setWhatsappNumber(value);
                    setErrors({ ...errors, whatsappNumber: '' });
                  }}
                  placeholder="5512345678"
                  className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-cyan-500 text-lg ${
                    errors.whatsappNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.whatsappNumber && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.whatsappNumber}
                </p>
              )}
            </div>

            {/* TÉRMINOS Y CONDICIONES */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    setErrors({ ...errors, acceptedTerms: '' });
                  }}
                  className="mt-1 w-5 h-5 text-cyan-600 rounded focus:ring-cyan-500"
                />
                <span className="text-gray-700 text-sm leading-relaxed">
                  Acepto los{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/terms', { state: { from: '/page3' } })}
                    className="text-cyan-600 font-semibold hover:underline"
                  >
                    Términos y Condiciones
                  </button>
                  {' '}y la{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/privacy', { state: { from: '/page3' } })}
                    className="text-cyan-600 font-semibold hover:underline"
                  >
                    Política de Privacidad
                  </button>
                  <span className="text-red-500"> *</span>
                </span>
              </label>
              {errors.acceptedTerms && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.acceptedTerms}
                </p>
              )}
            </div>

          {/* BOTÓN INGRESAR CON TELÉFONO */}
          <button
            onClick={handleAccessCode}
            className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-pink-500 text-white py-4 rounded-lg font-bold text-lg hover:from-cyan-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
          >
            Ingresar a SaludCompartida
          </button>

          {/* SECCIÓN DE PREGUNTAS */}
          <div className="mt-6 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-6 shadow-md">
            <div className="text-center mb-4">
              <p className="text-xl text-gray-800 font-bold mb-2">
                ¿Preguntas?
              </p>
              <p className="text-sm text-gray-600">Contáctanos a:</p>
              <p className="text-lg font-semibold text-cyan-700 mt-2">
                contact@saludcompartida.com
              </p>
            </div>
            
            <div className="flex flex-col gap-3 mt-4">
              <a
                href="mailto:contact@saludcompartida.com?subject=Código Erróneo&body=Hola, tengo un problema con mi código de acceso."
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Código Erróneo
              </a>
              
              <a
                href="mailto:contact@saludcompartida.com?subject=Consulta General&body=Hola, tengo una consulta."
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Otras Consultas
              </a>
            </div>
          </div>

          {/* AYUDA */}
          <div className="mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
            <p className="text-sm text-gray-600 text-center">
              <span className="font-semibold text-cyan-700">💡 ¿Cómo funciona?</span><br />
              Ingresa el número de teléfono que registraste en la preventa.<br />
              Tu número de WhatsApp es tu código de acceso único.
            </p>
          </div>
          </>
            )}
          </div>
        </div>
        )}
      </main>
    </div>
  );
}