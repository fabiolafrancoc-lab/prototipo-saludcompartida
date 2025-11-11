import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from './components/TopNav';
import UserContext from './contexts/UserContext';

function App() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('register');
  const [spotsLeft, setSpotsLeft] = useState(300);
  const totalSpots = 1000;
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const [migrantFirstName, setMigrantFirstName] = useState('');
  const [migrantLastName, setMigrantLastName] = useState('');
  const [migrantMotherLastName, setMigrantMotherLastName] = useState('');
  const [migrantEmail, setMigrantEmail] = useState('');
  const [migrantPhone, setMigrantPhone] = useState('');
  const [familyCountry, setFamilyCountry] = useState('');
  
  const [familyFirstName, setFamilyFirstName] = useState('');
  const [familyLastName, setFamilyLastName] = useState('');
  const [familyMotherLastName, setFamilyMotherLastName] = useState('');
  const [familyPhone, setFamilyPhone] = useState('');
  
  const [accessCode, setAccessCode] = useState('');
  const [codeError, setCodeError] = useState('');

  const testimonials = [
    "Estoy ahorrando cada mes gracias a SaludCompartida.",
    "Mi familia ahora puede llamar a doctores cuando quiera sin estrés.",
    "El servicio me ayudó a manejar los medicamentos de mi mamá desde lejos.",
    "Ahora mi familia tiene acceso a terapia cuando la necesita.",
    "Los descuentos en medicinas nos han ayudado muchísimo."
  ];

  useEffect(() => {
    if (currentPage === 'register' && spotsLeft > 87) {
      const interval = setInterval(() => {
        setSpotsLeft(prev => {
          if (prev <= 87) return 87;
          const decrease = Math.floor(Math.random() * 3) + 1;
          return Math.max(87, prev - decrease);
        });
      }, Math.random() * 3000 + 2000);
      
      return () => clearInterval(interval);
    }
  }, [currentPage, spotsLeft]);

  useEffect(() => {
    if (currentPage === 'confirmation' || currentPage === 'access') {
      const interval = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }, 5500);
      
      return () => clearInterval(interval);
    }
  }, [currentPage, testimonials.length]);

  const formatUSPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
  };

  const formatMXPhone = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
  };

  const handleRegister = async () => {
    if (migrantFirstName && migrantLastName && migrantEmail && 
        migrantPhone && familyCountry && familyFirstName && familyLastName && 
        familyPhone) {
      
      // Prepare registration data
      const registrationData = {
        timestamp: new Date().toISOString(),
        migrant: {
          firstName: migrantFirstName,
          lastName: migrantLastName,
          motherLastName: migrantMotherLastName,
          email: migrantEmail,
          phone: `+1 ${migrantPhone}`
        },
        family: {
          firstName: familyFirstName,
          lastName: familyLastName,
          motherLastName: familyMotherLastName,
          phone: `+52 ${familyPhone}`,
          country: familyCountry
        }
      };

      console.log('Datos de registro:', registrationData);

      // Guardar en localStorage usando teléfonos como IDs únicos
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      
      // Guardar ambos usuarios con su teléfono como ID
      const migrantPhoneId = `+1${migrantPhone.replace(/\s/g, '')}`;
      const familyPhoneId = `+52${familyPhone.replace(/\s/g, '')}`;
      
      registeredUsers[migrantPhoneId] = {
        ...registrationData.migrant,
        registeredAt: registrationData.timestamp,
        type: 'migrant',
        linkedFamilyPhone: familyPhoneId
      };
      
      registeredUsers[familyPhoneId] = {
        ...registrationData.family,
        registeredAt: registrationData.timestamp,
        type: 'family',
        linkedMigrantPhone: migrantPhoneId
      };
      
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      console.log('Usuarios registrados:', registeredUsers);

      // Send email with registration data
      try {
        const emailMessage = `
🎉 NUEVO REGISTRO DE PREVENTA

--- DATOS DEL MIGRANTE EN EEUU ---
Nombre completo: ${migrantFirstName} ${migrantLastName} ${migrantMotherLastName || ''}
Email: ${migrantEmail}
Teléfono (WhatsApp): +1 ${migrantPhone}
ID de acceso: ${migrantPhoneId}

--- DATOS DEL FAMILIAR EN MÉXICO ---
Nombre completo: ${familyFirstName} ${familyLastName} ${familyMotherLastName || ''}
Teléfono (WhatsApp): +52 ${familyPhone}
ID de acceso: ${familyPhoneId}
País: ${familyCountry}

--- INFORMACIÓN ADICIONAL ---
Fecha de registro: ${new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
Cupos restantes después de este registro: ${spotsLeft - 1}

--- SIGUIENTE PASO ---
⚠️ IMPORTANTE: Los usuarios pueden ingresar usando su número de teléfono como ID único.
- Migrante (USA): ${migrantPhoneId}
- Familiar (México): ${familyPhoneId}
        `.trim();

        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `${migrantFirstName} ${migrantLastName}`,
            email: migrantEmail,
            message: emailMessage,
            type: 'registration'
          }),
        });

        if (!response.ok) {
          console.error('Error al enviar email de registro');
        }
      } catch (error) {
        console.error('Error:', error);
      }

      // Continue with UI flow
      setSpotsLeft(prev => Math.max(0, prev - 1));
      setShowConfetti(true);
      setCurrentPage('confirmation');
      
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    } else {
      alert('Por favor completa todos los campos');
    }
  };

  const handleAccessCode = () => {
    if (accessCode === 'USA2025' || accessCode === 'MX2025') {
      setCurrentPage('dashboard');
      setCodeError('');
    } else {
      setCodeError('Código incorrecto. Intenta nuevamente.');
    }
  };

  // Unified header uses TopNav component

  if (currentPage === 'register') {
    return (
      <UserContext.Provider value={{
        migrantFirstName,
        migrantLastName,
        familyFirstName,
        familyLastName
      }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
  <TopNav />

        <div className="max-w-7xl mx-auto px-6 py-8">
          
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              ¡Regístrate hoy y ten la posibilidad<br />
              de ser seleccionado para <span className="text-cyan-500">SaludCompartida</span>!
            </h2>
            <p className="text-xl text-orange-600 font-bold">
              ⚡ ¡Apúrate, quedan pocos cupos!
            </p>
          </div>

          <div className="mb-10 text-center">
            
            <button
              onClick={() => navigate('/page3')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-pulse cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span>¿Ya te registraste? ¡Ingresa con tu teléfono!</span>
            </button>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            <div className="relative space-y-8">
              <div className="sticky top-24">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8">
                  <img 
                    src="/girl%203.jpeg"
                    alt="Niña sonriendo"
                    className="w-full h-[550px] object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-5 shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Telemedicina 24/7</h3>
                      <p className="text-sm text-gray-600">Consultas ilimitadas por WhatsApp</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Red de Farmacias</h3>
                      <p className="text-sm text-gray-600">40-75% de descuento en 1,700+ ubicaciones</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Sesiones de Terapia Semanal</h3>
                      <p className="text-sm text-gray-600">Apoyo psicológico profesional</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-pink-500 to-rose-500 p-8 shadow-xl animate-pulse">
                <div className="relative z-10">
                  <div className="mb-6">
                    <p className="text-white/90 text-sm font-medium uppercase tracking-wider mb-2">
                      Cupos Disponibles - Programa Piloto
                    </p>
                    <div className="flex items-baseline gap-3 mb-4">
                      <p className="text-white text-5xl font-bold animate-bounce">
                        {spotsLeft}
                      </p>
                      <p className="text-white/80 text-lg">
                        de {totalSpots} cupos
                      </p>
                    </div>
                    
                    <div className="bg-white/20 rounded-xl p-4 mb-4">
                      <p className="text-white text-sm leading-relaxed">
                        <strong>Hemos recibido 4,500 solicitudes</strong> y solo podemos aceptar 1,000 participantes. 
                        <span className="block mt-2 text-yellow-200 font-semibold">⏰ Quedan 3 días para seleccionar los 1,000 participantes.</span>
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-white/80 text-sm font-medium">
                    ⚡ El registro no garantiza que seas seleccionado
                  </p>
                </div>
                
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              </div>

              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="p-10">
                  
                  <div className="mb-10">
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                      Comienza Tu Registro
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Completa tu información para tener la oportunidad de ser seleccionado en nuestro programa piloto
                    </p>
                  </div>

                  <div className="space-y-10">
                    
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 pb-4 border-b-2 border-cyan-100">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">Tus Datos</h4>
                          <p className="text-sm text-gray-500">Información del migrante en EE.UU.</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                          <input
                            type="text"
                            value={migrantFirstName}
                            onChange={(e) => setMigrantFirstName(e.target.value)}
                            placeholder="María"
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-gray-900 placeholder-gray-400 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido Paterno</label>
                          <input
                            type="text"
                            value={migrantLastName}
                            onChange={(e) => setMigrantLastName(e.target.value)}
                            placeholder="García"
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-gray-900 placeholder-gray-400 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido Materno</label>
                          <input
                            type="text"
                            value={migrantMotherLastName}
                            onChange={(e) => setMigrantMotherLastName(e.target.value)}
                            placeholder="López"
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-gray-900 placeholder-gray-400 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico</label>
                        <input
                          type="email"
                          value={migrantEmail}
                          onChange={(e) => setMigrantEmail(e.target.value)}
                          placeholder="maria.garcia@email.com"
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-gray-900 placeholder-gray-400 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <span>Proporciónanos tu WhatsApp (Estados Unidos)</span>
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-3.5 text-gray-500 font-semibold pointer-events-none z-10">+1</div>
                          <input
                            type="tel"
                            value={migrantPhone}
                            onChange={(e) => setMigrantPhone(formatUSPhone(e.target.value))}
                            placeholder="(305) 123-4567"
                            maxLength="14"
                            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-gray-900 placeholder-gray-400 bg-white"
                          />
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          10 dígitos • Tu código de acceso será enviado a este WhatsApp
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Haga clic en el lugar donde vive su familiar</label>
                        <select
                          value={familyCountry}
                          onChange={(e) => setFamilyCountry(e.target.value)}
                          className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-gray-900 bg-white"
                        >
                          <option value="">Selecciona un país</option>
                          <option value="MX">🇲🇽 México</option>
                          <option value="GT" disabled>🇬🇹 Guatemala (Próximamente)</option>
                          <option value="HN" disabled>🇭🇳 Honduras (Próximamente)</option>
                          <option value="SV" disabled>🇸🇻 El Salvador (Próximamente)</option>
                          <option value="NI" disabled>🇳🇮 Nicaragua (Próximamente)</option>
                          <option value="CO" disabled>🇨🇴 Colombia (Próximamente)</option>
                          <option value="PE" disabled>🇵🇪 Perú (Próximamente)</option>
                          <option value="EC" disabled>🇪🇨 Ecuador (Próximamente)</option>
                          <option value="IN" disabled>🇮🇳 India (Próximamente)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-3 pb-4 border-b-2 border-pink-100">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">Tu Conexión en Casa</h4>
                          <p className="text-sm text-gray-500">Beneficiario en México</p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                          <input
                            type="text"
                            value={familyFirstName}
                            onChange={(e) => setFamilyFirstName(e.target.value)}
                            placeholder="Rosa"
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-gray-900 placeholder-gray-400 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido Paterno</label>
                          <input
                            type="text"
                            value={familyLastName}
                            onChange={(e) => setFamilyLastName(e.target.value)}
                            placeholder="Hernández"
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-gray-900 placeholder-gray-400 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Apellido Materno</label>
                          <input
                            type="text"
                            value={familyMotherLastName}
                            onChange={(e) => setFamilyMotherLastName(e.target.value)}
                            placeholder="Pérez"
                            className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-gray-900 placeholder-gray-400 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <span>Proporciónanos su WhatsApp (México)</span>
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                        </label>
                        <div className="relative">
                          <div className="absolute left-4 top-3.5 text-gray-500 font-semibold pointer-events-none z-10">+52</div>
                          <input
                            type="tel"
                            value={familyPhone}
                            onChange={(e) => setFamilyPhone(formatMXPhone(e.target.value))}
                            placeholder="(55) 1234-5678"
                            maxLength="15"
                            className="w-full pl-14 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-gray-900 placeholder-gray-400 bg-white"
                          />
                        </div>
                        <p className="mt-2 text-xs text-gray-500">
                          10 dígitos • Su código de acceso será enviado a este WhatsApp
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleRegister}
                      className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3"
                    >
                      <span>Registrarme Ahora</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>

                    <p className="text-center text-sm text-gray-500 leading-relaxed">
                      Al registrarte, aceptas nuestros{' '}
                      <button className="text-cyan-600 hover:text-cyan-700 font-medium underline">
                        términos y condiciones
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </UserContext.Provider>
    );
  }

  if (currentPage === 'confirmation') {
    return (
      <UserContext.Provider value={{
        migrantFirstName,
        migrantLastName,
        familyFirstName,
        familyLastName
      }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 relative">
  <TopNav onBack={() => setCurrentPage('register')} />
        
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 20}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                  fontSize: '24px'
                }}
              >
                ✨
              </div>
            ))}
          </div>
        )}

        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/grandparent.jpeg"
                  alt="Familia conectada"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              
              <div className="mt-6 bg-gradient-to-r from-cyan-50 to-pink-50 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-8 h-8 text-cyan-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-gray-700 italic text-lg leading-relaxed transition-opacity duration-500">
                    "{testimonials[currentTestimonial]}"
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-10">
              
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  ¡Registro Recibido!
                </h2>
                <p className="text-orange-600 font-bold text-lg mb-2">
                  ⏰ Ahora cuenta cada minuto
                </p>
                <p className="text-gray-600">
                  Tu solicitud está en proceso de revisión
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-100 to-pink-100 border-2 border-orange-300 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-1">¡Solo quedan {spotsLeft} cupos disponibles!</p>
                    <p className="text-sm text-gray-700">
                      Cada hora se llenan más espacios. Los códigos de acceso se enviarán por orden de llegada a los seleccionados.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Si Eres Seleccionado
                </h3>
                <ol className="space-y-3 text-sm text-gray-700">
                  <li className="flex gap-3">
                    <span className="font-bold text-cyan-600 min-w-[24px]">1.</span>
                    <span>Recibirás WhatsApp en <strong>+1 {migrantPhone}</strong> con tu código de acceso exclusivo</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-cyan-600 min-w-[24px]">2.</span>
                    <span>Tu familiar recibirá su código en <strong>+52 {familyPhone}</strong></span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-cyan-600 min-w-[24px]">3.</span>
                    <span>Activa los servicios inmediatamente con tu código</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      </UserContext.Provider>
    );
  }

  if (currentPage === 'access') {
    return (
      <UserContext.Provider value={{
        migrantFirstName,
        migrantLastName,
        familyFirstName,
        familyLastName
      }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
  <TopNav />

        <div className="max-w-7xl mx-auto px-6 py-16">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              ¡Felicidades! 🎉<br />
              <span className="text-cyan-500">Has Sido Seleccionado</span>
            </h1>
            <p className="text-xl text-gray-600">
              Estás a un paso de transformar la salud de tu familia
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            <div className="relative">
              <div className="sticky top-24">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-6">
                  <img 
                    src="/girl.jpeg"
                    alt="Familia feliz con acceso a salud"
                    className="w-full h-[600px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-10 left-10 text-white">
                    <h2 className="text-4xl font-bold mb-3 drop-shadow-lg">Acceso Inmediato</h2>
                    <p className="text-xl font-light opacity-95 drop-shadow-md">Tu familia te lo agradecerá</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-cyan-50 to-pink-50 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start gap-3">
                    <svg className="w-8 h-8 text-cyan-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-gray-700 italic text-lg leading-relaxed transition-opacity duration-500">
                      "{testimonials[currentTestimonial]}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <svg className="w-12 h-12 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">Acceso Prioritario VIP</p>
                    <p className="text-gray-700">Eres parte del grupo exclusivo de {totalSpots} seleccionados</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="p-10">
                  
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      Ingresa Tu Código
                    </h2>
                    <p className="text-gray-600 text-lg">
                      Activa tus beneficios inmediatamente
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Código de Acceso Exclusivo
                      </label>
                      <input
                        type="text"
                        value={accessCode}
                        onChange={(e) => {
                          setAccessCode(e.target.value.toUpperCase());
                          setCodeError('');
                        }}
                        placeholder="Ingresa tu código"
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-center text-2xl font-mono uppercase tracking-widest bg-white"
                      />
                      {codeError && (
                        <p className="text-red-600 text-sm mt-3 text-center font-medium">{codeError}</p>
                      )}
                    </div>

                    <button
                      onClick={handleAccessCode}
                      className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 text-white py-5 px-6 rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                    >
                      <span>Activar Mis Beneficios</span>
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>

                    <div className="bg-gradient-to-r from-cyan-50 to-pink-50 rounded-xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4 text-center">Lo que obtienes al activar:</h4>
                      <ul className="space-y-3 text-sm text-gray-700">
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-cyan-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Telemedicina 24/7 ilimitada</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-pink-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>40-75% descuento en medicinas</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Sesiones de terapia semanales</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-cyan-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Hasta 4 miembros de familia</span>
                        </li>
                      </ul>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-3">¿No recibiste tu código?</p>
                      <button className="text-cyan-600 hover:text-cyan-700 font-semibold text-sm underline">
                        Contactar Soporte Inmediato
                      </button>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                      <p className="text-xs text-gray-400 text-center mb-2">Códigos de ejemplo para demo:</p>
                      <div className="flex gap-2 justify-center">
                        <code className="bg-gray-100 px-3 py-1 rounded text-xs font-mono">USA2025</code>
                        <code className="bg-gray-100 px-3 py-1 rounded text-xs font-mono">MX2025</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <BackButton position="bottom" />
          </div>
        </div>
      </div>
      </UserContext.Provider>
    );
  }

  if (currentPage === 'dashboard') {
    return (
      <UserContext.Provider value={{
        migrantFirstName,
        migrantLastName,
        familyFirstName,
        familyLastName
      }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
  <TopNav />
        <BackButton position="top" />

        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Panel de Servicios</h1>
            <p className="text-gray-600 text-lg">Accede a todos tus beneficios de salud</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Telemedicina 24/7', color: 'cyan' },
              { icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', title: 'Farmacias', color: 'pink' },
              { icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Terapia', color: 'orange' },
            ].map((service, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                <div className={`w-14 h-14 bg-gradient-to-br from-${service.color}-400 to-${service.color}-600 rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">Accede a este servicio ahora</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-12">
            <BackButton position="bottom" />
          </div>
        </div>
      </div>
      </UserContext.Provider>
    );
  }

  return null;
}

export default App;