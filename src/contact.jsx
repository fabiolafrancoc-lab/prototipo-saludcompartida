// src/contact.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WhatsAppButtonMagenta } from './components/WhatsAppIcons';

export default function Contact() {
  const navigate = useNavigate();
  const location = useLocation();

  // Toma el nombre del familiar desde location.state; si no existe, intenta leer firstName desde localStorage.
  const rawName = typeof location.state?.name === 'string' ? location.state.name.trim() : '';
  let storedFirstName = '';
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('accessUser') : null;
    if (stored) {
      const parsed = JSON.parse(stored);
      storedFirstName = parsed?.firstName || '';
    }
  } catch (e) {
    storedFirstName = '';
  }
  // Mostrar sólo el primer nombre (no el apellido)
  const firstName = rawName ? rawName.split(' ')[0] : (storedFirstName || '');

  // Scroll al tope al montar
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    telefono: '',
    email: '',
    categoria: '',
    mensaje: '',
    aceptaTerminos: false
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categorias = [
    'Información General',
    'Soporte Técnico',
    'Consultas sobre Servicios',
    'Consultas sobre SaludCompartida Términos y Condiciones',
    'Consultas sobre las Políticas de Privacidad',
    'Facturación',
    'Sugerencias',
    'Reclamo'
  ];

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'nombre': {
        const v = (value || '').trim();
        if (!v) newErrors.nombre = 'El nombre es requerido';
        else if (v.length < 2) newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        else delete newErrors.nombre;
        break;
      }
      case 'apellidoPaterno': {
        const v = (value || '').trim();
        if (!v) newErrors.apellidoPaterno = 'El apellido paterno es requerido';
        else if (v.length < 2) newErrors.apellidoPaterno = 'El apellido debe tener al menos 2 caracteres';
        else delete newErrors.apellidoPaterno;
        break;
      }
      case 'telefono': {
        const cleanPhone = String(value || '').replace(/\D/g, '');
        if (!cleanPhone) newErrors.telefono = 'El teléfono es requerido';
        else if (cleanPhone.length !== 10) newErrors.telefono = 'El teléfono debe tener 10 dígitos';
        else delete newErrors.telefono;
        break;
      }
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErrors.email = 'El email no es válido';
        else delete newErrors.email;
        break;
      case 'categoria':
        if (!value) newErrors.categoria = 'Selecciona una categoría';
        else delete newErrors.categoria;
        break;
      case 'mensaje': {
        const v = (value || '').trim();
        if (!v) newErrors.mensaje = 'El mensaje es requerido';
        else if (v.length < 10) newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres';
        else delete newErrors.mensaje;
        break;
      }
      case 'aceptaTerminos':
        if (!value) newErrors.aceptaTerminos = 'Debes aceptar los términos y condiciones';
        else delete newErrors.aceptaTerminos;
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    if (name === 'telefono') {
      const cleanValue = String(value || '').replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: cleanValue }));
      validateField(name, cleanValue);
    } else {
      setFormData(prev => ({ ...prev, [name]: newValue }));
      validateField(name, newValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldsToValidate = ['nombre', 'apellidoPaterno', 'telefono', 'categoria', 'mensaje', 'aceptaTerminos'];
    let isValid = true;

    fieldsToValidate.forEach(field => {
      if (!validateField(field, formData[field])) isValid = false;
    });

    if (formData.email && !validateField('email', formData.email)) isValid = false;
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      // Enviar email via API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.nombre} ${formData.apellidoPaterno}`,
          email: formData.email || 'Sin email proporcionado',
          phone: formData.telefono,
          message: `Categoría: ${formData.categoria}\n\n${formData.mensaje}`,
          type: 'mexico'
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Error de API:', responseData);
        throw new Error(responseData.error || 'Error al enviar el mensaje');
      }

      console.log('Mensaje enviado exitosamente:', responseData);
      setShowSuccess(true);
      setTimeout(() => {
        // pasamos el primer nombre si deseas usarlo en /page4
        if (firstName) {
          navigate('/page4', { state: { name: firstName } });
        } else {
          navigate('/page4');
        }
      }, 3000);
    } catch (error) {
      console.error('Error completo:', error);
      alert(`Hubo un error al enviar tu mensaje: ${error.message}\n\nPor favor intenta de nuevo o contáctanos por WhatsApp.`);
      setIsSubmitting(false);
    }
  };

  const formatPhoneDisplay = (value) => {
    if (!value) return '';
    const cleaned = String(value).replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
  };

  const whatsappNumber = '5215573860842';
  const whatsappMessage = encodeURIComponent(
    firstName 
      ? `Hola, soy ${firstName}. 

🌟 *Bienvenido a SaludCompartida* 🌟

Por favor selecciona una opción:

1️⃣ Quiero utilizar Telemedicina
2️⃣ Quiero agendar mi cita con mi Terapeuta
3️⃣ Tengo consultas sobre mis Ahorros
4️⃣ Otras Consultas

📞 *Atención Personalizada*
Deja tu mensaje de voz y te devolveremos la llamada en máximo 15 minutos.
🕐 Horario: Lunes a Viernes, 9:00 AM - 5:00 PM`
      : `Hola, soy un nuevo usuario. 

🌟 *Bienvenido a SaludCompartida* 🌟

Por favor selecciona una opción:

1️⃣ Quiero utilizar Telemedicina
2️⃣ Quiero agendar mi cita con mi Terapeuta
3️⃣ Tengo consultas sobre mis Ahorros
4️⃣ Otras Consultas

📞 *Atención Personalizada*
Deja tu mensaje de voz y te devolveremos la llamada en máximo 15 minutos.
🕐 Horario: Lunes a Viernes, 9:00 AM - 5:00 PM`
  );

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-green-100 rounded-full mb-6 animate-bounce">
            <svg className="w-20 h-20 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            ¡Tu Mensaje ha sido Enviado con Éxito!
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            {firstName && <span className="font-bold text-cyan-600">{firstName}</span>}
            {firstName ? ', ' : ''}estamos para servirte. En un plazo máximo de <span className="font-bold text-pink-600">15 minutos</span> recibirás una respuesta nuestra.
          </p>
          <p className="text-lg text-gray-600 mt-4 font-semibold">
            Gracias por contactarnos{firstName ? `, ${firstName}` : ''}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-pink-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <img
            src="/saludcompartida logo WT.png"
            alt="SaludCompartida"
            className="h-16 object-contain"
          />
          <button
            onClick={() => navigate('/page4')}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Volver
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Grid limpio sin capas - formulario izquierda, imagen derecha */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 rounded-2xl overflow-hidden shadow-2xl mb-8 bg-white">
          
          {/* Formulario - 3 columnas - pegado a la izquierda */}
          <div className="md:col-span-3 p-6 lg:p-10">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Hola{firstName ? ' ' : ''}{firstName && <span className="text-cyan-600">{firstName}</span>}, ¿tienes consultas para nosotros?
              </h1>
              <p className="text-lg text-gray-700">
                Estamos para ayudarte para que sigas usando al máximo los servicios de SaludCompartida
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      errors.nombre ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-cyan-500'
                    }`}
                    placeholder="Tu nombre"
                  />
                  {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Apellido Paterno <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="apellidoPaterno"
                    value={formData.apellidoPaterno}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      errors.apellidoPaterno ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-cyan-500'
                    }`}
                    placeholder="Tu apellido paterno"
                  />
                  {errors.apellidoPaterno && <p className="mt-1 text-sm text-red-600">{errors.apellidoPaterno}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 bg-gray-100 border-2 border-r-0 border-gray-300 rounded-l-lg text-gray-700 font-semibold">
                      +52
                    </span>
                    <input
                      type="tel"
                      name="telefono"
                      value={formatPhoneDisplay(formData.telefono)}
                      onChange={handleChange}
                      className={`flex-1 px-4 py-3 border-2 rounded-r-lg focus:outline-none transition-colors ${
                        errors.telefono ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-cyan-500'
                      }`}
                      placeholder="XXX XXX XXXX"
                    />
                  </div>
                  {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-gray-400 text-xs">(Opcional)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                      errors.email ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-cyan-500'
                    }`}
                    placeholder="tu@email.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                    errors.categoria ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-cyan-500'
                  }`}
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.categoria && <p className="mt-1 text-sm text-red-600">{errors.categoria}</p>}
              </div>

              {/* Mensaje */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mensaje <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors resize-none ${
                    errors.mensaje ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-cyan-500'
                  }`}
                  placeholder="Escribe tu consulta aquí..."
                />
                {errors.mensaje && <p className="mt-1 text-sm text-red-600">{errors.mensaje}</p>}
              </div>

              {/* Términos */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="aceptaTerminos"
                    checked={formData.aceptaTerminos}
                    onChange={handleChange}
                    className="mt-1 w-5 h-5 text-cyan-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 leading-relaxed">
                    Acepto los{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/terms')}
                      className="text-cyan-600 font-semibold hover:text-cyan-700 underline"
                    >
                      Términos y Condiciones
                    </button>
                    {' '}y las{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/privacy')}
                      className="text-cyan-600 font-semibold hover:text-cyan-700 underline"
                    >
                      Políticas de Privacidad
                    </button>
                  </span>
                </label>
                {errors.aceptaTerminos && <p className="mt-2 text-sm text-red-600">{errors.aceptaTerminos}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-lg hover:shadow-xl'
                } text-white`}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Consulta'}
              </button>
            </form>
          </div>

          {/* Imagen - 2 columnas - SIN CAPAS - rostro centrado */}
          <div className="md:col-span-2 relative min-h-[600px]">
            <img
              src="/girl.jpeg"
              alt="Contacto - Niña sonriendo"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Información de Contacto */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Información de Contacto
          </h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                <p className="text-gray-600">contact@saludcompartida.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">WhatsApp</h3>
                <WhatsAppButtonMagenta
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                >
                  Chatea con Nosotros
                </WhatsAppButtonMagenta>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Horario de Atención</h3>
                <p className="text-gray-600">Lunes a Viernes</p>
                <p className="text-gray-600 font-semibold">09:00 AM - 6:00 PM</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-cyan-50 rounded-lg border-l-4 border-cyan-500">
              <p className="text-sm text-gray-700">
                <span className="font-bold text-cyan-700">Tiempo de respuesta:</span> Máximo 15 minutos durante horario de atención
              </p>
            </div>
          </div>
        </div>

        {/* Mensaje inferior (sin mostrar placeholder si no hay nombre) */}
        <div className="max-w-4xl mx-auto px-4 mt-10">
          <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
            {firstName && (
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Nombre familiar migrante:</span>{' '}
                <span className="text-cyan-700">{firstName}</span>
              </p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Te responderemos en máximo 15 minutos después de haber recibido tu consulta.
            </p>
            <p className="text-sm text-gray-600">
              Si está fuera de nuestros horarios de atención, recibirás nuestra respuesta al día hábil siguiente a las 09:00.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}