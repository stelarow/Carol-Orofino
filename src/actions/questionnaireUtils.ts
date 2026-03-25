function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function normalizeWhatsApp(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  return digits.startsWith('55') ? digits : `55${digits}`
}

export function buildEmailHtml(data: {
  name: string
  whatsapp: string
  email: string
  roomType: string[]
  area: string
  floorPlanUrl: string | null
  photoUrls: string[]
  styles: string[]
  mustHave: string
  scopeType: string
  urgency: string
  budget: string
}): string {
  const waUrl = `https://wa.me/${data.whatsapp}`
  const fileLinks = [
    data.floorPlanUrl ? `<a href="${data.floorPlanUrl}">Planta baixa</a>` : null,
    ...data.photoUrls.map((url, i) => `<a href="${url}">Foto ${i + 1}</a>`),
  ]
    .filter(Boolean)
    .join(', ')

  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#333">Novo questionário — ${escapeHtml(data.name)}</h2>
      <hr/>

      <h3>👤 Identificação</h3>
      <p><strong>Nome:</strong> ${escapeHtml(data.name)}<br/>
      <strong>WhatsApp:</strong> ${data.whatsapp}<br/>
      <strong>E-mail:</strong> ${escapeHtml(data.email)}</p>

      <h3>🏠 Ambiente</h3>
      <p><strong>Tipo:</strong> ${data.roomType.map(escapeHtml).join(', ')}<br/>
      ${data.area ? `<strong>Medidas:</strong> ${escapeHtml(data.area)}<br/>` : ''}
      ${fileLinks ? `<strong>Arquivos:</strong> ${fileLinks}` : ''}</p>

      <h3>🎨 Estilo</h3>
      <p><strong>Estilos:</strong> ${data.styles.map(escapeHtml).join(', ') || '—'}<br/>
      ${data.mustHave ? `<strong>Deve ter:</strong> ${escapeHtml(data.mustHave)}` : ''}</p>

      <h3>📋 Escopo</h3>
      <p><strong>Tipo:</strong> ${escapeHtml(data.scopeType)}<br/>
      ${data.urgency ? `<strong>Urgência:</strong> ${escapeHtml(data.urgency)}<br/>` : ''}
      ${data.budget ? `<strong>Investimento:</strong> ${escapeHtml(data.budget)}` : ''}</p>

      <hr/>
      <a href="${waUrl}" style="display:inline-block;background:#25D366;color:white;padding:10px 20px;border-radius:4px;text-decoration:none;font-weight:bold">
        💬 Responder no WhatsApp
      </a>
    </div>
  `
}

const CLIENT_EMAIL_STRINGS: Record<string, {
  subject: string
  greeting: (name: string) => string
  confirmation: string
  summaryTitle: string
  roomLabel: string
  stylesLabel: string
  nextSteps: string
}> = {
  pt: {
    subject: 'Recebemos seu questionário — Carol Orofino',
    greeting: (name) => `Olá, ${name}!`,
    confirmation: 'Recebemos seu questionário e entraremos em contato em breve.',
    summaryTitle: 'Resumo do seu envio',
    roomLabel: 'Ambiente(s)',
    stylesLabel: 'Estilo(s)',
    nextSteps: 'Carol Orofino analisará suas respostas e entrará em contato pelo WhatsApp ou e-mail.',
  },
  en: {
    subject: 'We received your questionnaire — Carol Orofino',
    greeting: (name) => `Hello, ${name}!`,
    confirmation: 'We received your questionnaire and will be in touch shortly.',
    summaryTitle: 'Your submission summary',
    roomLabel: 'Room(s)',
    stylesLabel: 'Style(s)',
    nextSteps: 'Carol Orofino will review your answers and reach out via WhatsApp or email.',
  },
  es: {
    subject: 'Recibimos tu cuestionario — Carol Orofino',
    greeting: (name) => `¡Hola, ${name}!`,
    confirmation: 'Recibimos tu cuestionario y nos pondremos en contacto contigo pronto.',
    summaryTitle: 'Resumen de tu envío',
    roomLabel: 'Ambiente(s)',
    stylesLabel: 'Estilo(s)',
    nextSteps: 'Carol Orofino revisará tus respuestas y se pondrá en contacto por WhatsApp o correo electrónico.',
  },
}

type ClientEmailInput = {
  name: string
  roomType: string[]
  styles: string[]
}

export function buildClientEmailHtml(
  data: ClientEmailInput,
  locale: string
): { subject: string; html: string } {
  const s = CLIENT_EMAIL_STRINGS[locale] ?? CLIENT_EMAIL_STRINGS['pt']
  const stylesText = data.styles.length > 0 ? data.styles.map(escapeHtml).join(', ') : '—'

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#333">${s.greeting(escapeHtml(data.name))}</h2>
      <p>${s.confirmation}</p>
      <hr/>
      <h3>${s.summaryTitle}</h3>
      <p>
        <strong>${s.roomLabel}:</strong> ${data.roomType.map(escapeHtml).join(', ')}<br/>
        <strong>${s.stylesLabel}:</strong> ${stylesText}
      </p>
      <hr/>
      <p style="color:#555">${s.nextSteps}</p>
      <p style="margin-top:24px;color:#888;font-size:12px">Carol Orofino — carolorofino.com.br</p>
    </div>
  `

  return { subject: s.subject, html }
}
