import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Pharmacy() {
  const navigate = useNavigate();
  const [locationShared, setLocationShared] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const convenioNumber = 'SC-2025-8472';

  // Cargar nombre del usuario desde localStorage
  useEffect(() => {
    try {
      const accessUserData = localStorage.getItem('accessUser');
      if (accessUserData) {
        const userData = JSON.parse(accessUserData);
        // Solo mostrar nombre si el código es MX2025
        if (userData.accessCode === 'MX2025' && userData.firstName) {
          setNombreUsuario(userData.firstName);
          setApellidoPaterno(userData.lastName || '');
        } else {
          setNombreUsuario('Usuario');
          setApellidoPaterno('SaludCompartida');
        }
      } else {
        setNombreUsuario('Usuario');
        setApellidoPaterno('SaludCompartida');
      }
    } catch (error) {
      setNombreUsuario('Usuario');
      setApellidoPaterno('SaludCompartida');
    }
  }, []);

  const nearbyPharmacies = [
    { name: 'Farmacia Guadalajara', distance: '0.3 km', discount: '75%', logo: '🏥' },
    { name: 'Farmacia Benavides', distance: '0.8 km', discount: '68%', logo: '🏥' },
    { name: 'Farmacia del Ahorro', distance: '1.2 km', discount: '65%', logo: '🏥' },
    { name: 'Farmacia San Pablo', distance: '1.5 km', discount: '62%', logo: '🏥' },
    { name: 'Farmacia Similares', distance: '2.1 km', discount: '58%', logo: '🏥' },
  ];

  const handleShareLocation = () => {
    setLocationShared(true);
    // Scroll to the pharmacy finder section
    setTimeout(() => {
      const pharmacySection = document.getElementById('pharmacy-finder-section');
      if (pharmacySection) {
        pharmacySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleVolver = () => {
    if (locationShared) {
      setLocationShared(false);
      // Scroll al inicio cuando vuelve
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
      navigate('/page4');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* HEADER */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <img 
            src="/saludcompartida logo WT.png" 
            alt="SaludCompartida" 
            className="h-16 object-contain"
          />
          <button
            onClick={handleVolver}
            className="text-gray-600 hover:text-gray-900 font-medium text-lg transition-colors"
          >
            Volver
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* HERO SECTION CON VIDEOS */}
        <div className="mb-12">
          {nombreUsuario && nombreUsuario !== 'Usuario' && (
            <p className="text-center text-2xl text-gray-700 mb-4">
              ¡Hola <span className="font-bold text-cyan-600">{nombreUsuario}</span>!
            </p>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
            Descuentos en Farmacias
          </h1>
          <p className="text-center text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            <span className="font-bold text-pink-600">40% - 75% de descuento</span> en productos farmacéuticos y no farmacéuticos
            <br />
            <span className="text-cyan-600 font-semibold">¡Descuento sobre descuento!</span>
          </p>

          {/* VIDEOS LADO A LADO */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* VIDEO 1 */}
            <div className="rounded-2xl shadow-2xl overflow-hidden bg-gray-900">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
                style={{ minHeight: '300px', maxHeight: '500px' }}
              >
                <source src="/pharmacy1.mp4" type="video/mp4" />
              </video>
            </div>
            
            {/* VIDEO 2 */}
            <div className="rounded-2xl shadow-2xl overflow-hidden bg-gray-900">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
                style={{ minHeight: '300px', maxHeight: '500px' }}
              >
                <source src="/pharmacy2.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>

        {/* TARJETA PREMIUM BLACK/PLATINUM */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Tu Tarjeta de Descuento Premium
          </h2>
          
          <div className="max-w-md mx-auto">
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-8 shadow-2xl border border-gray-700 overflow-hidden">
              
              {/* EFECTOS DE BRILLO */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-slate-400/20 to-transparent rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                {/* HEADER TARJETA */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <div className="text-amber-400 font-bold text-sm tracking-wider mb-1">PLATINUM MEMBER</div>
                    <div className="text-white text-2xl font-bold">SaludCompartida</div>
                  </div>
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center p-2">
                    {/* QR CODE PLACEHOLDER */}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <rect x="0" y="0" width="20" height="20" fill="black"/>
                      <rect x="30" y="0" width="20" height="20" fill="black"/>
                      <rect x="60" y="0" width="20" height="20" fill="black"/>
                      <rect x="0" y="30" width="20" height="20" fill="black"/>
                      <rect x="60" y="30" width="20" height="20" fill="black"/>
                      <rect x="0" y="60" width="20" height="20" fill="black"/>
                      <rect x="30" y="60" width="20" height="20" fill="black"/>
                      <rect x="60" y="60" width="20" height="20" fill="black"/>
                    </svg>
                  </div>
                </div>

                {/* NOMBRE USUARIO */}
                <div className="mb-6">
                  <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Titular</div>
                  <div className="text-white text-xl font-semibold tracking-wide">
                    {nombreUsuario} {apellidoPaterno}
                  </div>
                </div>

                {/* CONVENIO */}
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Convenio</div>
                    <div className="text-amber-400 text-lg font-mono font-bold">{convenioNumber}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400 text-xs mb-1">Red de farmacias</div>
                    <div className="text-white font-bold text-2xl">+1,700</div>
                  </div>
                </div>
              </div>
            </div>

            {/* INSTRUCCIONES USO */}
            <div className="mt-4 bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-r-lg">
              <p className="text-sm text-gray-700">
                <span className="font-bold text-cyan-700">💡 Cómo usar:</span> Muestra esta tarjeta o código QR en farmacia para aplicar tu descuento
              </p>
            </div>
          </div>
        </div>

        {/* VENTAJA COMPETITIVA */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl p-8 mb-12 text-white shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-bold">Descuento sobre Descuento</h3>
          </div>
          <p className="text-lg leading-relaxed">
            ¿Ya tienes descuentos en tu farmacia favorita? <span className="font-bold">¡Perfecto!</span> Nuestro descuento se aplica <span className="font-bold underline">sobre el precio ya rebajado</span>. Maximiza tus ahorros en cada compra.
          </p>
        </div>

        {/* CATEGORÍAS DE PRODUCTOS */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Descuentos en Todo lo que Necesitas
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* PRODUCTOS FARMACÉUTICOS */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-cyan-100">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-10 h-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800">Productos Farmacéuticos</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-cyan-600 font-bold">✓</span> Medicamentos con receta
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-600 font-bold">✓</span> Medicamentos de libre venta
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-600 font-bold">✓</span> Vitaminas y suplementos
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-600 font-bold">✓</span> Material de curación
                </li>
              </ul>
            </div>

            {/* PRODUCTOS NO FARMACÉUTICOS */}
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-pink-100">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-10 h-10 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800">Productos del Hogar</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="text-pink-600 font-bold">✓</span> Cosméticos y maquillaje
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-pink-600 font-bold">✓</span> Productos de higiene
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-pink-600 font-bold">✓</span> Bebidas y snacks
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-pink-600 font-bold">✓</span> Pañales, leche y mucho más!
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* BUSCADOR DE UBICACIÓN */}
        <div className="mb-12" id="pharmacy-finder-section">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Encuentra Farmacias Cerca de Ti
          </h2>

          {!locationShared ? (
            <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-xl text-center">
              <svg className="w-20 h-20 mx-auto mb-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-xl font-bold text-gray-800 mb-3">¿Compartir mi ubicación?</h3>
              <p className="text-gray-600 mb-6">
                Te mostraremos las farmacias más cercanas con los mejores descuentos
              </p>
              <button
                onClick={handleShareLocation}
                className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
              >
                Compartir Ubicación
              </button>
              <p className="text-xs text-gray-500 mt-3">
                Tu privacidad es importante. Solo usamos tu ubicación para este propósito.
              </p>
            </div>
          ) : (
            <div>
              {/* ESTADÍSTICA DESTACADA */}
              <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl p-6 mb-6 text-center shadow-xl">
                <div className="text-5xl font-bold mb-2">+1,700</div>
                <div className="text-xl">Farmacias en toda la red</div>
              </div>

              {/* LISTA DE FARMACIAS CERCANAS */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Farmacias cercanas con mayores descuentos:
                </h3>
                
                {nearbyPharmacies.map((pharmacy, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-100 hover:border-cyan-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center bg-white border border-gray-200">
                          {index === 0 ? (
                            <img src="/guadalajara.jpeg" alt="Farmacia Guadalajara" className="w-full h-full object-contain p-1" />
                          ) : index === 1 ? (
                            <img src="/benavides.jpeg" alt="Farmacia Benavides" className="w-full h-full object-contain p-1" />
                          ) : index === 2 ? (
                            <img src="/delahorro.jpeg" alt="Farmacia del Ahorro" className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="text-3xl">{index === 3 ? '⚕️' : '💊'}</span>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-lg text-gray-800">{pharmacy.name}</div>
                          <div className="text-gray-500 text-sm flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            {pharmacy.distance}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-pink-600">{pharmacy.discount}</div>
                        <div className="text-xs text-gray-500">descuento</div>
                      </div>
                    </div>
                    
                    <button className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-2 rounded-lg font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all">
                      Ver Mapa y Dirección
                    </button>
                  </div>
                ))}
              </div>

              {/* LOGOS DE FARMACIAS PRINCIPALES */}
              <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-center text-gray-600 mb-4 font-semibold">Red de farmacias participantes:</h4>
                <div className="flex flex-wrap justify-center items-center gap-6">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-50 rounded-lg flex items-center justify-center mb-2 border-2 border-red-200 shadow-sm">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">FG</div>
                        <div className="text-[8px] text-red-500 font-semibold">FARMACIA</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Farmacia<br/>Guadalajara</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center mb-2 border-2 border-blue-200 shadow-sm">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">FB</div>
                        <div className="text-[8px] text-blue-500 font-semibold">FARMACIA</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Farmacia<br/>Benavides</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center mb-2 border-2 border-green-200 shadow-sm">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">FA</div>
                        <div className="text-[8px] text-green-500 font-semibold">FARMACIA</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">Farmacia<br/>del Ahorro</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg flex items-center justify-center mb-2 border-2 border-orange-200 shadow-sm">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">SP</div>
                        <div className="text-[8px] text-orange-500 font-semibold">FARMACIA</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">San<br/>Pablo</p>
                  </div>
                  <div className="text-gray-400 font-semibold text-sm">+ 1,693 más</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA FINAL - SIN BOTÓN VOLVER */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-center text-white shadow-2xl">
          <h3 className="text-3xl font-bold mb-3">Empieza a Ahorrar Hoy</h3>
          <p className="text-xl mb-6 text-gray-300">
            En promedio, nuestros usuarios ahorran <span className="font-bold text-amber-400">$2,500 MXN al mes</span> en farmacias
          </p>
        </div>

      </main>


    </div>
  );
}