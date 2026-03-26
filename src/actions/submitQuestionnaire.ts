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

    // Upload floor plan to blob (storage) + read buffer for email attachment
    let floorPlanUrl: string | null = null
    let floorPlanAttachment: { filename: string; content: Buffer } | null = null
    if (data.floorPlanFile) {
      const timestamp = Date.now()
      const safeName = data.floorPlanFile.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const [blob, buffer] = await Promise.all([
        put(`questionnaire/${timestamp}-${safeName}`, data.floorPlanFile, { access: 'private' }),
        data.floorPlanFile.arrayBuffer(),
      ])
      floorPlanUrl = blob.url
      floorPlanAttachment = { filename: data.floorPlanFile.name, content: Buffer.from(buffer) }
    }

    // Upload photos/videos to blob + read buffers for email attachments
    const photoUrls: string[] = []
    const photoAttachments: { filename: string; content: Buffer }[] = []
    for (const file of data.photoFiles) {
      const timestamp = Date.now()
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const [blob, buffer] = await Promise.all([
        put(`questionnaire/${timestamp}-${safeName}`, file, { access: 'private' }),
        file.arrayBuffer(),
      ])
      photoUrls.push(blob.url)
      photoAttachments.push({ filename: file.name, content: Buffer.from(buffer) })
    }

    const attachments = [
      ...(floorPlanAttachment ? [floorPlanAttachment] : []),
      ...photoAttachments,
    ]

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
      attachments,
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
