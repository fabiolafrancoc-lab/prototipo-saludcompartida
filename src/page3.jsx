import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Page3() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [motherLastName, setMotherLastName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+52'); // New state for country code
  const [accessCode, setAccessCode] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAccessCode = () => {
    // Validar campos
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
    
    if (!accessCode.trim()) {
      newErrors.accessCode = 'El código es requerido';
    }
    
    if (!acceptedTerms) {
      newErrors.acceptedTerms = 'Debes aceptar los términos y condiciones';
    }
    
    // Si hay errores, mostrarlos y no continuar
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Validar código según el país seleccionado
    const trimmedCode = accessCode.trim().toUpperCase();
    const expectedCode = countryCode === '+1' ? 'USA2025' : 'MX2025';
    
    if (trimmedCode === expectedCode) {
      // Guardar datos en localStorage
      const userData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        motherLastName: motherLastName.trim(),
        phone: whatsappNumber.trim(),
        countryCode: countryCode,
        accessCode: trimmedCode
      };
      
      localStorage.setItem('accessUser', JSON.stringify(userData));
      
      // Limpiar errores y navegar según el código
      setErrors({});
      if (trimmedCode === 'USA2025') {
        navigate('/migrant');
      } else {
        navigate('/page4');
      }
    } else {
      const expectedMessage = countryCode === '+1' ? 'USA2025' : 'MX2025';
      setErrors({ accessCode: `Código inválido. Usa ${expectedMessage} para ${countryCode === '+1' ? 'Estados Unidos' : 'México'}` });
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
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* TÍTULO */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Registro de Acceso
            </h1>
            <p className="text-gray-600">
              Completa tus datos y el código que recibiste
            </p>
          </div>

          {/* FORMULARIO */}
          <div className="space-y-5">
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

            {/* CÓDIGO DE ACCESO */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Código de Acceso <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value);
                  setErrors({ ...errors, accessCode: '' });
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleAccessCode()}
                placeholder="Ej: MX2025"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-cyan-500 text-lg font-mono uppercase ${
                  errors.accessCode ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.accessCode && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.accessCode}
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
          </div>

          {/* BOTÓN INGRESAR */}
          <button
            onClick={handleAccessCode}
            className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-pink-500 text-white py-4 rounded-lg font-bold text-lg hover:from-cyan-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
          >
            Ingresar a SaludCompartida
          </button>

          {/* AYUDA */}
          <div className="mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
            <p className="text-sm text-gray-600 text-center">
              <span className="font-semibold text-cyan-700">💡 Códigos válidos:</span><br />
              MX2025 (México) o USA2025 (Estados Unidos)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}