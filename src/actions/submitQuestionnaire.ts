'use server'

import { Resend } from 'resend'
import { normalizeWhatsApp, buildEmailHtml, buildClientEmailHtml } from './questionnaireUtils'

export { normalizeWhatsApp, buildEmailHtml }

export type QuestionnaireData = {
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
}

type ActionResult = { success: true } | { success: false; error: string }

export async function submitQuestionnaire(data: QuestionnaireData, locale: string): Promise<ActionResult> {
  console.log('[submitQuestionnaire] início — cliente:', data.name, '| fotos:', data.photoUrls.length, '| planta:', !!data.floorPlanUrl)

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const toEmail = process.env.RESEND_TO_EMAIL ?? 'carolorofinoo@gmail.com'
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
    const fromLabel = `Carol Orofino <${fromEmail}>`
    const normalizedWa = normalizeWhatsApp(data.whatsapp, locale)

    console.log('[submitQuestionnaire] env — RESEND_API_KEY:', !!process.env.RESEND_API_KEY)

    const html = buildEmailHtml({
      name: data.name,
      whatsapp: normalizedWa,
      email: data.email,
      roomType: data.roomType,
      area: data.area,
      floorPlanUrl: data.floorPlanUrl,
      photoUrls: data.photoUrls,
      styles: data.styles,
      mustHave: data.mustHave,
      scopeType: data.scopeType,
      urgency: data.urgency,
      budget: data.budget,
    })

    console.log('[submitQuestionnaire] enviando email para Carol...')
    const { error: carolEmailError } = await resend.emails.send({
      from: fromLabel,
      to: toEmail,
      subject: `Novo questionário — ${data.name}`,
      html,
    })
    if (carolEmailError) {
      console.error('[submitQuestionnaire] Resend rejeitou email para Carol:', JSON.stringify(carolEmailError))
      throw carolEmailError
    }
    console.log('[submitQuestionnaire] email para Carol enviado com sucesso')

    // Confirmação para o cliente só funciona com domínio verificado no Resend
    // Ativar quando tiver RESEND_FROM_EMAIL com domínio próprio configurado
    if (fromEmail !== 'onboarding@resend.dev') {
      try {
        const { subject, html: clientHtml } = buildClientEmailHtml(
          { name: data.name, roomType: data.roomType, styles: data.styles },
          locale
        )
        const { error: clientEmailError } = await resend.emails.send({
          from: fromLabel,
          to: data.email,
          replyTo: toEmail,
          subject,
          html: clientHtml,
        })
        if (clientEmailError) {
          console.error('[submitQuestionnaire] Resend rejeitou confirmação para cliente:', JSON.stringify(clientEmailError))
        }
      } catch (clientErr) {
        console.error('[submitQuestionnaire] exceção ao enviar confirmação para cliente:', clientErr)
      }
    }

    console.log('[submitQuestionnaire] concluído com sucesso')
    return { success: true }
  } catch (err) {
    console.error('[submitQuestionnaire] erro geral — tipo:', err instanceof Error ? err.constructor.name : typeof err)
    console.error('[submitQuestionnaire] erro geral — detalhe:', err)
    return { success: false, error: 'generic' }
  }
}
