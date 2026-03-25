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

    await resend.emails.send({
      from: 'questionario@carolorofino.com.br',
      to: 'carolorofinoo@gmail.com',
      subject: `Novo questionário — ${data.name}`,
      html,
    })

    try {
      const { subject, html: clientHtml } = buildClientEmailHtml(
        { name: data.name, roomType: data.roomType, styles: data.styles },
        locale
      )
      await resend.emails.send({
        from: 'questionario@carolorofino.com.br',
        to: data.email,
        replyTo: 'carolorofinoo@gmail.com',
        subject,
        html: clientHtml,
      })
    } catch {
      // silent — client confirmation failure does not affect success result
    }

    return { success: true }
  } catch {
    return { success: false, error: 'generic' }
  }
}
