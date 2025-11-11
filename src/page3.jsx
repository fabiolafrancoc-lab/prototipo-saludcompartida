import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from './hooks/useGeolocation';

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

  // Auto-select country code based on geolocation (only for Mexico)
  useEffect(() => {
    if (!geoLoading && detectedCountry) {
      if (detectedCountry === 'MX') {
        setCountryCode('+52');
      }
      // For US or other countries, keep default +52 (Mexico)
    }
  }, [detectedCountry, geoLoading]);

  const handleAccessCode = () => {
    // Si está usando código especial, validar directamente
    if (useSpecialCode && specialCode.trim()) {
      const upperCode = specialCode.trim().toUpperCase();
      
      if (SPECIAL_ACCESS_CODES[upperCode]) {
        const codeData = SPECIAL_ACCESS_CODES[upperCode];
        
        // Cargar datos demo del usuario
        const userData = {
          ...codeData.demoUser,
          phoneId: `${codeData.demoUser.countryCode}${codeData.demoUser.phone}`,
          accessType: codeData.type,
          isDemo: true
        };
        
        localStorage.setItem('accessUser', JSON.stringify(userData));
        
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
      } else {
        setErrors({ specialCode: 'Código no válido. Verifica e intenta nuevamente.' });
        return;
      }
    }
    
    // Validación normal por teléfono
    const newErrors = {};
    
    if (!firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }
    
    if (!lastName.trim()) {
      newErrors.lastName = 'El apellido paterno es requerido';
    }
    
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
    
    // Verificar si el teléfono está registrado
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
    
    if (registeredUsers[uniquePhoneId]) {
      // Usuario encontrado - cargar sus datos y dar acceso
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        motherLastName: motherLastName.trim(),
        phone: whatsappNumber.trim(),
        countryCode: countryCode,
        phoneId: uniquePhoneId,
        registeredData: registeredUsers[uniquePhoneId] // datos del registro original
      };
      
      localStorage.setItem('accessUser', JSON.stringify(userData));
      
      // Limpiar errores y navegar según el código de país
      setErrors({});
      if (countryCode === '+1') {
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
          {/* TÍTULO */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Ingresa a tu Cuenta
            </h1>
            <p className="text-gray-600">
              Usa el número de WhatsApp que registraste
            </p>
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
                    placeholder="Ej: INVESTOR2025, DEMO-MX"
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

                {/* Info sobre códigos especiales */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-purple-900 font-semibold mb-2">
                    🎯 Códigos disponibles para demo:
                  </p>
                  <ul className="text-xs text-purple-700 space-y-1">
                    <li>• <span className="font-mono font-bold">INVESTOR2025</span> - Acceso completo de inversores</li>
                    <li>• <span className="font-mono font-bold">DEMO-MX</span> - Demo usuario México (familia)</li>
                    <li>• <span className="font-mono font-bold">DEMO-US</span> - Demo usuario USA (migrante)</li>
                  </ul>
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
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setErrors({ ...errors, firstName: '' });
                }}
                placeholder="Ej: María"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-cyan-500 text-lg ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
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
                Apellido Paterno <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setErrors({ ...errors, lastName: '' });
                }}
                placeholder="Ej: González"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-cyan-500 text-lg ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
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
                onChange={(e) => setMotherLastName(e.target.value)}
                placeholder="Ej: Rodríguez"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 text-lg"
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