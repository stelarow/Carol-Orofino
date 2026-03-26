'use server'

import { put } from '@vercel/blob'
import { Resend } from 'resend'
import { normalizeWhatsApp, buildEmailHtml, buildClientEmailHtml } from './questionnaireUtils'

export { normalizeWhatsApp, buildEmailHtml }

export type QuestionnaireData = {
  name: string
  whatsapp: string
  email: string
  roomType: string[]
  area: string
  floorPlanFile: File | null
  photoFiles: File[]
  styles: string[]
  mustHave: string
  scopeType: string
  urgency: string
  budget: string
}

type ActionResult = { success: true } | { success: false; error: string }

export async function submitQuestionnaire(data: QuestionnaireData, locale: string): Promise<ActionResult> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const toEmail = process.env.RESEND_TO_EMAIL ?? 'carolorofinoo@gmail.com'
    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'
    const fromLabel = `Carol Orofino <${fromEmail}>`
    const normalizedWa = normalizeWhatsApp(data.whatsapp)

    // Upload floor plan
    let floorPlanUrl: string | null = null
    if (data.floorPlanFile) {
      const timestamp = Date.now()
      const safeName = data.floorPlanFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const blob = await put(`questionnaire/${timestamp}-${safeName}`, data.floorPlanFile, {
        access: 'public',
      })
      floorPlanUrl = blob.url
    }

    // Upload photos/videos
    const photoUrls: string[] = []
    for (const file of data.photoFiles) {
      const timestamp = Date.now()
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const blob = await put(`questionnaire/${timestamp}-${safeName}`, file, {
        access: 'public',
      })
      photoUrls.push(blob.url)
    }

    const html = buildEmailHtml({
      name: data.name,
      whatsapp: normalizedWa,
      email: data.email,
      roomType: data.roomType,
      area: data.area,
      floorPlanUrl,
      photoUrls,
      styles: data.styles,
      mustHave: data.mustHave,
      scopeType: data.scopeType,
      urgency: data.urgency,
      budget: data.budget,
    })

    const { error: carolEmailError } = await resend.emails.send({
      from: fromLabel,
      to: toEmail,
      subject: `Novo questionário — ${data.name}`,
      html,
    })
    if (carolEmailError) {
      console.error('[submitQuestionnaire] erro ao enviar email para Carol:', carolEmailError)
      throw carolEmailError
    }

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
          console.error('[submitQuestionnaire] erro ao enviar confirmação para cliente:', clientEmailError)
        }
      } catch (clientErr) {
        console.error('[submitQuestionnaire] exceção ao enviar confirmação para cliente:', clientErr)
      }
    }

    return { success: true }
  } catch (err) {
    console.error('[submitQuestionnaire] erro geral:', err)
    return { success: false, error: 'generic' }
  }
}
