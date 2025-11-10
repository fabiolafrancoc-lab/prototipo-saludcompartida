import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNav from './components/TopNav';

// Páginas de Tips para cada beneficio
const AnxietyTips = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <img 
            src="/saludcompartida logo WT.png" 
            alt="SaludCompartida" 
            className="h-16"
          />
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 font-medium text-lg"
          >
            Volver
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Cómo reducir tu ansiedad
          </h1>

          <div className="bg-gradient-to-r from-cyan-100 to-purple-100 rounded-xl p-6 mb-8">
            <p className="text-lg text-gray-800 italic text-center font-semibold">
              "La ansiedad no te hace débil. Reconocerla y enfrentarla te hace valiente."
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-cyan-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-xl">1. Respira profundo cuando sientas el pecho apretado</h3>
              <p className="text-gray-700 mb-3">
                Inhala contando hasta 4, aguanta 4 segundos, y exhala contando hasta 6. Repite 5 veces.
              </p>
              <p className="text-cyan-800 font-semibold">
                Tu cuerpo escucha lo que tu respiración le dice. Cuando respiras despacio, le dices que todo está bien.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-xl">2. Escribe lo que te preocupa</h3>
              <p className="text-gray-700 mb-3">
                Anota en tu celular o en papel: "¿Qué es lo peor que puede pasar?" y "¿Qué puedo controlar?"
              </p>
              <p className="text-purple-800 font-semibold">
                Sacar los pensamientos de tu cabeza les quita poder. No estás solo con tus preocupaciones.
              </p>
            </div>

            <div className="bg-pink-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-xl">3. Mueve tu cuerpo 10 minutos al día</h3>
              <p className="text-gray-700 mb-3">
                Camina, baila, estira. No tiene que ser ejercicio intenso. Solo muévete.
              </p>
              <p className="text-pink-800 font-semibold">
                El movimiento le dice a tu cerebro: "Estoy vivo, estoy fuerte, puedo con esto."
              </p>
            </div>

            <div className="bg-cyan-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-xl">4. Limita el café y las noticias</h3>
              <p className="text-gray-700 mb-3">
                Si ya estás ansioso, la cafeína y las malas noticias lo empeoran. Toma agua, escucha música.
              </p>
              <p className="text-cyan-800 font-semibold">
                No tienes que estar informado 24/7. Tu paz mental vale más que saber todo lo que pasa.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-xl">5. Habla con alguien de confianza</h3>
              <p className="text-gray-700 mb-3">
                Un amigo, un familiar, o tu terapeuta. No guardes todo para ti.
              </p>
              <p className="text-purple-800 font-semibold">
                Pedir ayuda no es ser carga para otros. Es ser humano. Todos necesitamos apoyo.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6">
            <p className="text-gray-700 text-center font-semibold text-lg">
              Recuerda: La ansiedad miente. Te dice que todo está mal cuando no es cierto. 
              <br />
              <span className="text-purple-800">Eres más fuerte de lo que tu ansiedad te hace creer.</span>
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg"
          >
            Volver a Terapia
          </button>
        </div>


      </div>
    </div>
  );
};

const RelationshipTips = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <img 
            src="/saludcompartida logo WT.png" 
            alt="SaludCompartida" 
            className="h-16"
          />
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Volver
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Cómo mejorar tus relaciones
          </h1>

          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-8">
            <p className="text-lg text-gray-800 italic text-center font-semibold">
              "Las buenas relaciones no son perfectas. Son honestas, pacientes y llenas de perdón."
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-xl">1. Escucha de verdad, no solo para responder</h3>
              <p className="text-gray-700 mb-3">
                Cuando alguien te habla, guarda el celular. Míralo a los ojos. Déjalo terminar antes de hablar.
              </p>
              <p className="text-purple-800 font-semibold">
                Escuchar es el regalo más grande que puedes darle a alguien. Le dices: "Tu voz importa."
              </p>
            </div>

            <div className="bg-pink-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-xl">2. Di lo que sientes sin atacar</h3>
              <p className="text-gray-700 mb-3">
                En vez de "Nunca me ayudas", di "Me siento solo cuando tengo que hacer todo yo."
              </p>
              <p className="text-pink-800 font-semibold">
                Tus sentimientos son válidos. Expresarlos con respeto abre puertas, no las cierra.
              </p>
            </div>

            <div className="bg-cyan-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-xl">3. Perdona, pero también pon límites</h3>
              <p className="text-gray-700 mb-3">
                Perdonar no significa aceptar cualquier cosa. Puedes perdonar y al mismo tiempo decir "esto no está bien."
              </p>
              <p className="text-cyan-800 font-semibold">
                Poner límites no es egoísta. Es cuidarte para poder cuidar a otros de manera sana.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-xl">4. Celebra lo bueno, no solo señales lo malo</h3>
              <p className="text-gray-700 mb-3">
                Cuando tu pareja, hijo o amigo haga algo bien, díselo. "Me gustó que...", "Gracias por..."
              </p>
              <p className="text-purple-800 font-semibold">
                Las relaciones crecen con lo que alimentas. Alimenta lo bueno, y lo bueno crecerá.
              </p>
            </div>

            <div className="bg-pink-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-xl">5. Pide lo que necesitas claramente</h3>
              <p className="text-gray-700 mb-3">
                No esperes que adivinen. Di: "Necesito que me escuches 10 minutos sin darme consejos."
              </p>
              <p className="text-pink-800 font-semibold">
                Nadie puede leer tu mente. Pedir no es exigir, es confiar en que te pueden apoyar.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6">
            <p className="text-gray-700 text-center font-semibold text-lg">
              Recuerda: Todas las relaciones pasan por momentos difíciles. 
              <br />
              <span className="text-purple-800">Lo que importa es cómo las enfrentan juntos.</span>
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg"
          >
            Volver a Terapia
          </button>
        </div>


      </div>
    </div>
  );
};

const StressTips = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <img 
            src="/saludcompartida logo WT.png" 
            alt="SaludCompartida" 
            className="h-16"
          />
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Volver
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Cómo manejar tu estrés
          </h1>

          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6 mb-8">
            <p className="text-lg text-gray-800 italic text-center font-semibold">
              "El estrés no viene de lo que haces, sino de sentir que no tienes control. Toma el control donde puedas."
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-pink-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-xl">1. Haz listas simples y tacha lo que terminas</h3>
              <p className="text-gray-700 mb-3">
                Escribe 3 cosas que TIENES que hacer hoy. Solo 3. Cuando las termines, tacha y celebra.
              </p>
              <p className="text-pink-800 font-semibold">
                Ver lo que SÍ lograste te da poder. No te enfoques en lo que falta, reconoce lo que hiciste.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-xl">2. Di "no" sin culpa cuando sea necesario</h3>
              <p className="text-gray-700 mb-3">
                No puedes con todo. "No puedo ahorita" o "déjame pensarlo" son respuestas válidas.
              </p>
              <p className="text-purple-800 font-semibold">
                Decir "no" a otros es decir "sí" a tu salud. No eres egoísta, eres inteligente.
              </p>
            </div>

            <div className="bg-cyan-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-xl">3. Duerme aunque creas que no hay tiempo</h3>
              <p className="text-gray-700 mb-3">
                Apaga el celular 30 minutos antes de dormir. Tu cerebro necesita descanso para funcionar.
              </p>
              <p className="text-cyan-800 font-semibold">
                Sin descanso, todo es más difícil. Dormir no es flojera, es recargarte para seguir adelante.
              </p>
            </div>

            <div className="bg-pink-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-xl">4. Toma pausas de 5 minutos cada hora</h3>
              <p className="text-gray-700 mb-3">
                Párate, estira, respira. No tienes que trabajar sin parar para ser productivo.
              </p>
              <p className="text-pink-800 font-semibold">
                Las pausas no te hacen lento. Te hacen eficiente. Tu mente necesita respirar también.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3 text-xl">5. Suelta lo que no puedes controlar</h3>
              <p className="text-gray-700 mb-3">
                Pregúntate: "¿Esto depende de mí?" Si no, déjalo ir. Enfócate en lo que SÍ puedes cambiar.
              </p>
              <p className="text-purple-800 font-semibold">
                Cargar con preocupaciones que no puedes resolver solo te agota. Suelta lo que no es tuyo.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-6">
            <p className="text-gray-700 text-center font-semibold text-lg">
              Recuerda: El estrés es parte de la vida, pero no tiene que consumirte. 
              <br />
              <span className="text-pink-800">Pequeños cambios diarios hacen una gran diferencia.</span>
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold px-8 py-4 rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg"
          >
            Volver a Terapia
          </button>
        </div>


      </div>
    </div>
  );
};

export default function Therapy() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentView, setCurrentView] = useState('main');
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    concerns: ''
  });

  // 50 Testimoniales rotativos - Solo nombre y edad
  const testimonials = [
    { text: "Ir a terapia no es de ricos, es de quien quiere dejar de sufrir en silencio.", author: "Juan, 34 años" },
    { text: "Hablar con alguien no te hace débil, te da las fuerzas para soportar lo que otros no ven.", author: "Rosa, 41 años" },
    { text: "No estás solo, muchos callamos por miedo, pero juntos podemos buscar algo mejor.", author: "Miguel, 28 años" },
    { text: "Dicen que así es la vida, pero yo aprendí que merezco algo diferente y pedir ayuda es el primer paso.", author: "Carmen, 36 años" },
    { text: "Si nadie te escucha en casa, busca quien sí lo haga afuera; tu dolor merece atención, no silencio.", author: "José, 43 años" },
    { text: "La vergüenza no es tuya, es de quienes te lastiman; tú sí mereces sanar.", author: "María, 32 años" },
    { text: "Aguantar no es lo mismo que vivir; pedir ayuda me enseñó eso.", author: "Pedro, 39 años" },
    { text: "Basta de decir 'así me tocó'; también se vale buscar estar bien.", author: "Guadalupe, 45 años" },
    { text: "Es mentira que pedir ayuda sea para gente loca; es para los que ya no quieren sufrir solos.", author: "Carlos, 37 años" },
    { text: "A mí también me dolía el alma y pensé que no tenía arreglo, pero sí lo tiene.", author: "Ana, 29 años" },
    { text: "Pedir ayuda no es traicionar a tu familia, es cuidarte para poder cuidarlos.", author: "Luis, 40 años" },
    { text: "Aunque nos digan 'no llores', llorar fue el principio de mi libertad.", author: "Patricia, 33 años" },
    { text: "No se trata de tener dinero, se trata de tener ganas de vivir mejor.", author: "Francisco, 44 años" },
    { text: "Mi mamá me decía 'no cuentes tus cosas', pero cuando hablé, sentí que el mundo pesaba menos.", author: "Teresa, 38 años" },
    { text: "La violencia no es normal, aunque todos te digan que sí; buscar ayuda me mostró otra vida.", author: "Ramón, 42 años" },
    { text: "Callar también te enferma; hablar fue mi medicina.", author: "Elena, 35 años" },
    { text: "No vine a este mundo a aguantar golpes ni palabras feas; merezco vivir en paz.", author: "Jesús, 31 años" },
    { text: "Antes pensaba que era mi culpa todo... ahora sé que nadie merece maltrato.", author: "Margarita, 46 años" },
    { text: "Si crees que solo a ti te pasa, hay miles como tú... y también salieron adelante.", author: "Antonio, 36 años" },
    { text: "Tener miedo no es lo mismo que estar solo; aquí hay gente que quiere ayudarte.", author: "Silvia, 30 años" },
    { text: "No importa si eres hombre o mujer, todos sentimos y todos merecemos ayuda.", author: "Roberto, 41 años" },
    { text: "El primer paso fue atreverme a preguntar, el segundo fue descubrir que sí podía salir adelante.", author: "Leticia, 34 años" },
    { text: "No necesitas saberlo todo ni tener respuestas; solo necesitas dar el primer paso para sanar.", author: "Javier, 39 años" },
    { text: "Aunque no tengas mucho, mereces vivir bien; la salud mental es para todos.", author: "Cristina, 37 años" },
    { text: "Lo que viviste no te define, pedir ayuda sí puede cambiar tu historia.", author: "Fernando, 43 años" },
    { text: "Ir al terapeuta no es de locos, es de valientes que decidieron estar en paz.", author: "Isabel, 32 años" },
    { text: "Los hombres también lloran... y sanar también es cosa de hombres.", author: "Raúl, 38 años" },
    { text: "Antes me guardaba todo; ahora hablo y duermo tranquilo.", author: "Luz, 35 años" },
    { text: "Pensé que pedir ayuda era debilidad, pero fue mi mejor decisión.", author: "Manuel, 40 años" },
    { text: "Ir al terapeuta no me cambió la vida... me la devolvió.", author: "Gloria, 42 años" },
    { text: "Aprendí que sentir no es ser débil, es ser humano.", author: "Alejandro, 33 años" },
    { text: "Mi papá nunca habló de sus emociones; yo sí, y ahora soy un mejor padre.", author: "Ricardo, 44 años" },
    { text: "Dejar de fingir que todo está bien también es cuidarte.", author: "Esperanza, 31 años" },
    { text: "No estás loco, estás cansado de cargar solo.", author: "Héctor, 36 años" },
    { text: "Pedir ayuda no te quita lo fuerte, te quita lo triste.", author: "Concepción, 39 años" },
    { text: "Mi mente también merece un chequeo, como mi cuerpo.", author: "Sergio, 41 años" },
    { text: "Antes les huía a mis pensamientos, ahora los entiendo.", author: "Yolanda, 34 años" },
    { text: "Ir a terapia no me hizo débil, me hizo libre.", author: "Arturo, 37 años" },
    { text: "Mi salud mental también es parte de mi bienestar.", author: "Angélica, 30 años" },
    { text: "No necesitas tocar fondo para buscar ayuda, basta con querer estar mejor.", author: "Enrique, 45 años" },
    { text: "Si hablar sana, ¿por qué seguir callando?", author: "Beatriz, 33 años" },
    { text: "En mi barrio decían que la terapia era para ricos; hoy sé que es para quien se quiere.", author: "Martín, 38 años" },
    { text: "La gente dice que el tiempo cura... pero hablar acelera el proceso.", author: "Dolores, 42 años" },
    { text: "Romper el silencio fue mi primer paso hacia la paz.", author: "Oscar, 35 años" },
    { text: "Mis cuates decían 'aguántate', ahora dicen que onda güey eres otro.", author: "Rodrigo, 29 años" },
    { text: "No es que esté loco, es que estoy aprendiendo a estar bien.", author: "Mónica, 36 años" },
    { text: "Hablar con un terapeuta no me quitó los problemas, me dio herramientas.", author: "Gabriel, 40 años" },
    { text: "Si cuidamos el cuerpo, también hay que cuidar la mente.", author: "Norma, 43 años" },
    { text: "Antes me daba pena decir que iba a terapia, hoy hasta la recomiendo.", author: "Julio, 37 años" },
    { text: "No se trata de ser fuerte todo el tiempo, se trata de estar bien contigo.", author: "Verónica, 32 años" }
  ];

  // Cambiar testimonial cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => 
        (prevIndex + 1) % testimonials.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Psicólogos
  const psychologists = [
    {
      name: "Psic. Antonio Márquez",
      image: "/psycho1.jpeg",
      specialties: ["Ansiedad", "Depresión", "Duelo"],
      experience: 15,
      bio: "Especialista en procesos migratorios y adaptación cultural. Ayudo a familias a mantener lazos fuertes a pesar de la distancia."
    },
    {
      name: "Psic. María Jesús García",
      image: "/psycho2.jpeg",
      specialties: ["Familia", "Relaciones", "Estrés"],
      experience: 6,
      bio: "Trabajo con parejas y familias para mejorar su comunicación. Creo firmemente que las relaciones sanas se construyen con esfuerzo diario."
    },
    {
      name: "Psic. Laura Rodríguez",
      image: "/psycho3.jpeg",
      specialties: ["Ansiedad", "Trauma", "Autoestima"],
      experience: 7,
      bio: "Me enfoco en ayudar a personas que cargan con culpa y ansiedad. Juntos encontramos la paz mental que mereces tener."
    },
    {
      name: "Psic. Carmen López",
      image: "/psycho4.jpeg",
      specialties: ["Depresión", "Duelo", "Familia"],
      experience: 5,
      bio: "Acompaño procesos de pérdida y duelo con empatía. La tristeza es válida, y juntos encontraremos cómo seguir adelante."
    }
  ];

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const availableDates = generateDates();

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', 
    '18:00', '19:00', '20:00'
  ];

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Solo números
    if (value.length <= 10) {
      setFormData({...formData, phone: value});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      alert('Por favor selecciona fecha y hora para tu sesión');
      return;
    }

    if (formData.phone.length !== 10) {
      alert('Por favor ingresa un número de teléfono válido de 10 dígitos');
      return;
    }

    const dataToSend = {
      timestamp: new Date().toISOString(),
      name: `${formData.firstName} ${formData.lastName}`,
      phone: `+55${formData.phone}`,
      sessionType: 'Individual',
      contactMethod: 'Videollamada',
      date: selectedDate.toLocaleDateString('es-MX'),
      time: selectedTime,
      concerns: formData.concerns
    };

    console.log('Agendamiento de terapia:', dataToSend);
    
    setShowConfirmation(true);
  };

  const formatDate = (date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()]
    };
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const getAvailableTimesForDate = (date) => {
    if (!date) return [];
    if (isWeekend(date)) {
      return timeSlots.filter(time => {
        const hour = parseInt(time.split(':')[0]);
        return hour >= 9 && hour < 14;
      });
    }
    return timeSlots.filter(time => {
      const hour = parseInt(time.split(':')[0]);
      return hour >= 8 && hour <= 20;
    });
  };

  if (currentView === 'anxiety') {
    return <AnxietyTips onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'relationships') {
    return <RelationshipTips onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'stress') {
    return <StressTips onBack={() => setCurrentView('main')} />;
  }

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
        <TopNav onBack={() => navigate('/page4')} />

        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Tu sesión está agendada!
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              Que bueno que diste el primer paso. Hablar de lo que sientes es de valientes.
            </p>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Tu sesión</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {selectedDate.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <p className="text-xl text-gray-700">{selectedTime} hrs</p>
              <p className="text-sm text-gray-600 mt-4">Sesión individual por videollamada</p>
            </div>

            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mb-8">
              <p className="text-sm text-gray-700">
                <strong>Te vamos a contactar 24 horas antes</strong> al <span className="font-semibold">+55{formData.phone}</span> para confirmar tu sesión y mandarte el link de la videollamada.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/page4')}
                className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold py-4 rounded-xl hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg"
              >
                Volver al menú principal
              </button>
              
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setFormData({ firstName: '', lastName: '', phone: '', concerns: '' });
                }}
                className="w-full text-gray-600 hover:text-gray-900 font-medium"
              >
                Agendar otra sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <img 
            src="/saludcompartida logo WT.png" 
            alt="SaludCompartida" 
            className="h-16 cursor-pointer"
            onClick={() => navigate('/')}
          />
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              navigate('/page4');
            }}
            className="text-gray-600 hover:text-gray-900 font-medium text-lg"
          >
            Volver
          </button>

        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section - SIN ICONO DE CORAZÓN */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tu Salud Mental Importa
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Hablar de lo que sientes no es de débiles, es de valientes. Una sesión a la semana puede cambiar tu vida.
          </p>

          <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3">
            <svg className="w-5 h-5 text-purple-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-purple-900">
              100% confidencial y profesional
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ¿Por qué terapia?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <button
              onClick={() => setCurrentView('anxiety')}
              className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 text-left transition-all hover:shadow-xl hover:scale-105 hover:from-cyan-100 hover:to-cyan-200 cursor-pointer"
            >
              <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Reduce tu ansiedad</h3>
              <p className="text-sm text-gray-600 mb-3">
                La vida de migrante es pesada. Hablar con alguien que te entiende te ayuda a sentirte más tranquilo.
              </p>
              <p className="text-xs font-semibold text-cyan-700">
                Haz clic para ver tips →
              </p>
            </button>

            <button
              onClick={() => setCurrentView('relationships')}
              className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-left transition-all hover:shadow-xl hover:scale-105 hover:from-purple-100 hover:to-purple-200 cursor-pointer"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Mejora tus relaciones</h3>
              <p className="text-sm text-gray-600 mb-3">
                Estar lejos no es fácil. Un terapeuta te ayuda a manejar el estrés y mejorar cómo te llevas con tu familia.
              </p>
              <p className="text-xs font-semibold text-purple-700">
                Haz clic para ver tips →
              </p>
            </button>

            <button
              onClick={() => setCurrentView('stress')}
              className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-6 text-left transition-all hover:shadow-xl hover:scale-105 hover:from-pink-100 hover:to-pink-200 cursor-pointer"
            >
              <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Maneja tu estrés</h3>
              <p className="text-sm text-gray-600 mb-3">
                Entre el trabajo, las cuentas y la preocupación por tu familia, el estrés se acumula. Aquí te ayudamos.
              </p>
              <p className="text-xs font-semibold text-pink-700">
                Haz clic para ver tips →
              </p>
            </button>
          </div>

          {/* Testimoniales - Solo nombre y edad */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 transition-all duration-500">
            <p className="text-gray-700 italic mb-2">
              "{testimonials[currentTestimonialIndex].text}"
            </p>
            <p className="text-sm font-semibold text-gray-900">
              — {testimonials[currentTestimonialIndex].author}
            </p>
          </div>
        </div>

        {/* Videos de Salud Mental */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <video 
              src="https://p0iccshbkx3s8qpk.public.blob.vercel-storage.com/womansreaming.mov"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              Tu navegador no soporta el video.
            </video>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl">
            <video 
              src="https://p0iccshbkx3s8qpk.public.blob.vercel-storage.com/mentalhealthhappy.mov"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              Tu navegador no soporta el video.
            </video>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Conoce a nuestros psicólogos
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Todos nuestros psicólogos están certificados y tienen amplia experiencia
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {psychologists.map((psychologist, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src={psychologist.image} 
                    alt={psychologist.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center"><svg class="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>`;
                    }}
                  />
                </div>
                
                <h3 className="font-bold text-gray-900 text-center mb-2">
                  {psychologist.name}
                </h3>
                
                <div className="flex flex-wrap gap-2 justify-center mb-3">
                  {psychologist.specialties.map((specialty, i) => (
                    <span key={i} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      {specialty}
                    </span>
                  ))}
                </div>
                
                <p className="text-xs text-gray-600 text-center mb-3">
                  {psychologist.experience} años de experiencia
                </p>
                
                <p className="text-sm text-gray-700 text-center">
                  {psychologist.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario con campos separados y teléfono +55 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Agenda tu sesión individual
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Apellido paterno
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Tu apellido"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Tu teléfono
            </label>
            <div className="flex">
              <div className="flex items-center bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl px-4">
                <span className="text-gray-700 font-medium">+55</span>
              </div>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={handlePhoneChange}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="1234567890"
                maxLength="10"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Ingresa 10 dígitos (ejemplo: 5512345678)
            </p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Selecciona el día
            </label>
            <div className="grid grid-cols-7 gap-2">
              {availableDates.map((date, index) => {
                const formatted = formatDate(date);
                const isSunday = date.getDay() === 0;
                const isSelected = selectedDate?.toDateString() === date.toDateString();
                
                return (
                  <button
                    key={index}
                    type="button"
                    disabled={isSunday}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedTime(null);
                    }}
                    className={`p-3 rounded-xl text-center transition-all ${
                      isSunday
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : isSelected
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white border-2 border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">{formatted.day}</div>
                    <div className="text-lg font-bold">{formatted.date}</div>
                    <div className="text-xs">{formatted.month}</div>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * Cerrado los domingos
            </p>
          </div>

          {selectedDate && (
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Selecciona la hora
              </label>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {getAvailableTimesForDate(selectedDate).map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 rounded-xl font-semibold transition-all ${
                      selectedTime === time
                        ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg'
                        : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-cyan-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {isWeekend(selectedDate) 
                  ? '* Sábados: 9:00am - 2:00pm'
                  : '* Lunes a Viernes: 8:00am - 8:00pm'
                }
              </p>
            </div>
          )}

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ¿Qué te gustaría trabajar? (opcional)
            </label>
            <textarea
              value={formData.concerns}
              onChange={(e) => setFormData({...formData, concerns: e.target.value})}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Puedes compartir brevemente lo que te preocupa. Esto es confidencial y nos ayuda a prepararnos mejor para apoyarte."
            />
          </div>

          <button
            type="submit"
            disabled={!selectedDate || !selectedTime}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              selectedDate && selectedTime
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Confirmar mi sesión
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            Te contactaremos 24 horas antes para confirmar tu sesión por videollamada
          </p>
        </form>

        <div className="mt-12 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-purple-600 mr-4 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Tu privacidad es sagrada</h3>
              <p className="text-sm text-gray-700">
                Todo lo que compartas con tu terapeuta es 100% confidencial. Tus sesiones están protegidas por las leyes de privacidad médica. Nadie más tendrá acceso a lo que platiques, ni siquiera nosotros.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}