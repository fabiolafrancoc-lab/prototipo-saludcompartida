import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, message, type, to, subject: customSubject } = req.body;

    // Validate required fields
    if (!message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Si se proporciona 'to', es un email directo al usuario (no notificación al admin)
    const isDirectEmail = !!to;
    const recipientEmail = to || 'ffranco@saludcompartida.com';

    // Define subject and email styling based on type
    let subject = customSubject || '';
    let headerColor = '#06B6D4'; // cyan default
    let headerText = '';
    
    // Si es un email directo al usuario, usar formato simple
    if (isDirectEmail) {
      headerColor = '#06B6D4';
      headerText = customSubject || 'SaludCompartida';
    } else {
      // Email de notificación al admin
      switch(type) {
        case 'migrant':
          subject = `[🇺🇸 USA] Contacto Migrante - ${name}`;
          headerColor = '#06B6D4';
          headerText = 'Nuevo Contacto desde USA';
          break;
        case 'rating':
          subject = `[⭐ CALIFICACIÓN] ${name}`;
          headerColor = '#F59E0B';
          headerText = 'Nueva Calificación de Servicio';
          break;
        case 'blog-topic':
          subject = `[💡 SUGERENCIA BLOG] ${name}`;
          headerColor = '#8B5CF6';
          headerText = 'Nueva Sugerencia de Tema para Blog';
          break;
        case 'therapy':
          subject = `[🧠 CITA TERAPIA] ${name}`;
          headerColor = '#10B981';
          headerText = '🗓️ Nueva Cita de Terapia Agendada';
          break;
        case 'codigo-erroneo':
          subject = `[🔴 CÓDIGO ERRÓNEO] Solicitud de Ayuda`;
          headerColor = '#EF4444';
          headerText = '🔴 Código Erróneo - Usuario necesita ayuda';
          break;
        case 'consulta-general':
          subject = `[📋 CONSULTA GENERAL] ${name}`;
          headerColor = '#06B6D4';
          headerText = '📋 Consulta General';
          break;
        case 'mexico':
        default:
          subject = `[📞 CONTACTO] ${name}`;
          headerColor = '#E91E63';
          headerText = 'Nuevo Mensaje de Contacto';
          break;
      }
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'SaludCompartida <noreply@saludcompartida.com>',
      to: [recipientEmail],
      subject: subject,
      html: isDirectEmail ? 
        // Email simple para usuarios
        `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
            .header { background: ${headerColor}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; background: #f9f9f9; }
            .message { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; white-space: pre-wrap; }
            .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>${headerText}</h2>
          </div>
          <div class="content">
            <div class="message">${message}</div>
          </div>
          <div class="footer">
            <p>SaludCompartida © 2025</p>
            <p>¿Necesitas ayuda? Escríbenos a contact@saludcompartida.com</p>
          </div>
        </body>
        </html>
        `
        :
        // Email detallado para admin
        `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .header { background: ${headerColor}; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid ${headerColor}; }
            .label { font-weight: bold; color: ${headerColor}; }
            .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${headerText}</h1>
          </div>
          <div class="content">
            <div class="info-box">
              ${name ? `<p><span class="label">Nombre:</span> ${name}</p>` : ''}
              ${email && email !== 'Sin email proporcionado' ? `<p><span class="label">Email:</span> ${email}</p>` : ''}
              ${phone ? `<p><span class="label">Teléfono:</span> ${phone}</p>` : ''}
            </div>
            <div class="info-box">
              <p class="label">Mensaje:</p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
          <div class="footer">
            <p>Enviado desde: ${
              type === 'migrant' ? 'Formulario USA/Migrantes' : 
              type === 'rating' ? 'Sistema de Calificaciones' : 
              type === 'blog-topic' ? 'Blog - Sugerencias' : 
              type === 'therapy' ? 'Sistema de Agendamiento de Terapia' :
              type === 'codigo-erroneo' ? 'Página de Acceso - Código Erróneo' :
              type === 'consulta-general' ? 'Página de Acceso - Consulta General' :
              'Formulario de Contacto México'
            }</p>
            <p>SaludCompartida © 2025</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
