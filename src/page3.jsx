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
  const [email, setEmail] = useState('');
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
    // Validar campos requeridos
    const newErrors = {};
    
    if (!specialCode.trim()) {
      newErrors.specialCode = 'El código de acceso es requerido';
    }
    
    if (!firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'El apellido paterno es requerido';
    }
    
    if (!whatsappNumber.trim()) {
      newErrors.whatsappNumber = 'El número de WhatsApp es requerido';
    } else if (whatsappNumber.replace(/\s/g, '').length !== 10) {
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
    
    const upperCode = specialCode.trim().toUpperCase();
    
    // Primero revisar si es un código demo/especial
    if (SPECIAL_ACCESS_CODES[upperCode]) {
      const codeData = SPECIAL_ACCESS_CODES[upperCode];
      
      // Usar datos del formulario en lugar de datos hardcodeados
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        motherLastName: motherLastName.trim(),
        email: email.trim(),
        phone: whatsappNumber.replace(/\s/g, ''),
        countryCode: '+52',
        phoneId: `+52${whatsappNumber.replace(/\s/g, '')}`,
        accessCode: upperCode,
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
      
      // Scroll al top antes de navegar
      window.scrollTo(0, 0);
      
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
        
        // Scroll al top antes de navegar
        window.scrollTo(0, 0);
        
        // Navegar según el tipo de usuario
        if (dbUser.user_type === 'migrant' || dbUser.country_code === '+1') {
          navigate('/migrant');
        } else {
          navigate('/page4');
        }
        return;
      }
    } catch (error) {
      console.error('Error validando código:', error);
    }
    
    // Si llegamos aquí, el código no es válido
    // Construir el ID único con código de país + número
    const uniquePhoneId = `+52${whatsappNumber.replace(/\s/g, '')}`;
    
    // Verificar si el teléfono está registrado en localStorage (compatibilidad)
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    
    if (registeredUsers[uniquePhoneId]) {
      // Usuario encontrado por teléfono - usar los datos del registro original
      const originalData = registeredUsers[uniquePhoneId];
      
      const userData = {
        firstName: originalData.firstName,
        lastName: originalData.lastName,
        motherLastName: originalData.motherLastName || '',
        email: originalData.email || '',
        phone: originalData.phone,
        countryCode: '+52',
        phoneId: uniquePhoneId,
        type: originalData.type || 'user',
        registeredAt: originalData.registeredAt
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      // Limpiar errores y navegar según el tipo de usuario
      setErrors({});
      
      // Scroll al top antes de navegar
      window.scrollTo(0, 0);
      
      if (originalData.type === 'migrant') {
        navigate('/migrant');
      } else {
        navigate('/page4');
      }
    } else {
      // Código no válido y teléfono no registrado - mostrar formulario de consulta
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

  // Handler para botón "Código Erróneo"
  const handleCodigoErroneo = async () => {
    try {
      const emailBody = `
🔴 CÓDIGO ERRÓNEO - SOLICITUD DE AYUDA

Usuario reporta problema con código de acceso.

--- INFORMACIÓN ADICIONAL ---
Fecha: ${new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
      `.trim();

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Usuario',
          email: 'usuario@saludcompartida.com',
          message: emailBody,
          type: 'codigo-erroneo',
          to: 'consultas@saludcompartida.com'
        }),
      });

      if (response.ok) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error al enviar:', error);
    }
  };

  // Handler para botón "Otras Consultas"
  const handleOtrasConsultas = async () => {
    try {
      const emailBody = `
📋 SOLICITUD DE CONSULTA DESDE ACCESO

Un usuario solicitó realizar una consulta general.

--- INFORMACIÓN ---
Origen: Página de Acceso (page3.jsx)
Fecha: ${new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
      `.trim();

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Usuario',
          email: 'usuario@saludcompartida.com',
          message: emailBody,
          type: 'consulta-general',
          to: 'contact@saludcompartida.com'
        }),
      });

      if (response.ok) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error al enviar consulta:', error);
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
                Hemos recibido tu mensaje con Éxito, en unos momentos te contactaremos
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Gracias por comunicarte con SaludCompartida.
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
          {/* RECUADRO GRANDE - MISMO ESTILO QUE PÁGINA 1 */}
          <div className="mb-10">
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 border-2 border-cyan-300 rounded-2xl p-6 shadow-lg">
              <div className="text-center">
                <div className="mb-4">
                  <svg className="w-12 h-12 mx-auto text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-cyan-600 mb-2">
                  Ingresa tu Código
                </h1>
                <p className="text-gray-700 text-sm md:text-base">
                  Completa tus datos para acceder a tus beneficios
                </p>
              </div>
            </div>
          </div>

          {/* FORMULARIO */}
          <div className="space-y-5">
            {/* CÓDIGO DE ACCESO */}
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
                placeholder="Ejemplo: SC-MX-123456"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-cyan-500 text-lg font-mono uppercase ${
                  errors.specialCode ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Formato: SC-MX-XXXXXX (ejemplo: SC-MX-123456)
              </p>
              {errors.specialCode && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Este campo es obligatorio
                </p>
              )}
            </div>

            {/* NOMBRE */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setErrors({ ...errors, firstName: '' });
                }}
                placeholder="Ejemplo: María"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-cyan-500 text-lg ${
                  errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Este campo es obligatorio
                </p>
              )}
            </div>

            {/* APELLIDO PATERNO */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Apellido Paterno <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setErrors({ ...errors, lastName: '' });
                }}
                placeholder="Ejemplo: González"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-cyan-500 text-lg ${
                  errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Este campo es obligatorio
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
                onChange={(e) => setMotherLastName(e.target.value)}
                placeholder="Ejemplo: López"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 text-lg"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Correo Electrónico <span className="text-gray-500 text-sm font-normal">(opcional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors({ ...errors, email: '' });
                }}
                placeholder="Ejemplo: maria@email.com"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-cyan-500 text-lg ${
                  errors.email ? 'border-red-500 bg-red-50' : email ? 'border-gray-300' : 'bg-gray-50 text-gray-500 border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* NÚMERO DE WHATSAPP */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Número de WhatsApp <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex items-center bg-gray-100 border-2 border-gray-300 rounded-lg px-4 py-3">
                  <span className="text-gray-700 font-semibold text-lg">+52</span>
                </div>
                <input
                  type="tel"
                  value={whatsappNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      const formatted = value.length <= 3 ? value :
                                      value.length <= 6 ? `${value.slice(0, 3)} ${value.slice(3)}` :
                                      `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;
                      setWhatsappNumber(formatted);
                      setErrors({ ...errors, whatsappNumber: '' });
                    }
                  }}
                  placeholder="555 123 4567"
                  className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-cyan-500 text-lg ${
                    errors.whatsappNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Formato: +52 XXX XXX XXXX (10 dígitos)
              </p>
              {errors.whatsappNumber && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Este campo es obligatorio
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

          {/* AYUDA */}
          <div className="mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
            <p className="text-sm text-gray-600 text-center">
              <span className="font-semibold text-cyan-700">💡 ¿Cómo funciona?</span><br />
              Ingresa tu código de acceso y completa tus datos para acceder a todos tus beneficios.
            </p>
          </div>

          </div>
        </div>
        )}
      </main>
    </div>
  );
}