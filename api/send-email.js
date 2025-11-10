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
    const { name, email, phone, message, type } = req.body;

    // Validate required fields
    if (!name || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Define subject and email styling based on type
    let subject = '';
    let headerColor = '#06B6D4'; // cyan default
    let headerText = '';
    
    switch(type) {
      case 'migrant':
        subject = `[🇺🇸 USA] Contacto Migrante - ${name}`;
        headerColor = '#06B6D4'; // cyan
        headerText = 'Nuevo Contacto desde USA';
        break;
      case 'rating':
        subject = `[⭐ CALIFICACIÓN] ${name}`;
        headerColor = '#F59E0B'; // amber
        headerText = 'Nueva Calificación de Servicio';
        break;
      case 'blog-topic':
        subject = `[💡 SUGERENCIA BLOG] ${name}`;
        headerColor = '#8B5CF6'; // purple
        headerText = 'Nueva Sugerencia de Tema para Blog';
        break;
      case 'mexico':
      default:
        subject = `[📞 CONTACTO] ${name}`;
        headerColor = '#E91E63'; // magenta
        headerText = 'Nuevo Mensaje de Contacto';
        break;
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'SaludCompartida <onboarding@resend.dev>',
      to: ['ffranco@saludcompartida.com'],
      subject: subject,
      html: `
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
              <p><span class="label">Nombre:</span> ${name}</p>
              ${email && email !== 'Sin email proporcionado' ? `<p><span class="label">Email:</span> ${email}</p>` : '<p><span class="label">Email:</span> <em>No proporcionado</em></p>'}
              ${phone ? `<p><span class="label">Teléfono:</span> ${phone}</p>` : ''}
            </div>
            <div class="info-box">
              <p class="label">Mensaje:</p>
              <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
          <div class="footer">
            <p>Enviado desde: ${type === 'migrant' ? 'Formulario USA/Migrantes' : type === 'rating' ? 'Sistema de Calificaciones' : type === 'blog-topic' ? 'Blog - Sugerencias' : 'Formulario de Contacto México'}</p>
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
